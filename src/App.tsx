import React, { useState, useRef } from 'react';
import { Box, Heading, Button, Stack } from '@chakra-ui/react';
import LanguageTable from './components/LanguageTable';
import AddLanguageForm from './components/AddLanguageForm';
import Matrix from './components/Matrix';
import { Language } from './types/Language';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const CustomFileInput = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button onClick={() => inputRef.current?.click()} colorScheme='orange' variant='outline' mt={1}>
        Choose file
      </Button>
    </>
  );
};

const App: React.FC = () => {
  const initialLanguages: Language[] = [
    { name: "English" },
    { name: "Ukrainian" },
    { name: "Spanish" },
    { name: "Mandarin Chinese" },
    { name: "Hindi" },
    { name: "Turkish" },
    { name: "Korean" },
    { name: "Italian" },
    { name: "Bengali" },
    { name: "Portuguese" },
    { name: "Arabic" },
    { name: "Vietnamese" }
  ];

  const [languages, setLanguages] = useState<Language[]>(initialLanguages);
  const [isMatrixVisible, setMatrixVisible] = useState(false);

  const handleAddLanguage = (name: string) => {
    setLanguages([...languages, { name }]);
  };

  const handleRemoveLanguage = (name: string) => {
    setLanguages(languages.filter(lang => lang.name !== name));
  };

  const handleReorderLanguages = (newLanguages: Language[]) => {
    setLanguages(newLanguages);
  };

  const handleLoadFromFile = (file: File) => {
    Papa.parse(file, {
      complete: (result) => {
        const loadedLanguages = result.data
          .slice(1)
          .map((item: unknown) => {
            if (Array.isArray(item) && typeof item[0] === 'string' && item[0].trim() !== '') {
              return { name: item[0] };
            }
            return null;
          })
          .filter((item): item is Language => item !== null);
        setLanguages(loadedLanguages);
      },
    });
  };

  const generateComparisonMatrix = () => {
    const matrix: number[][] = [];
    for (let i = 0; i < languages.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < languages.length; j++) {
        if (i === j) {
          matrix[i][j] = 0;
        } else if (i < j) {
          matrix[i][j] = 1;
        } else {
          matrix[i][j] = -1;
        }
      }
    }
    return matrix;
  };

  const handleSaveMatrixToFile = () => {
    const matrix = generateComparisonMatrix();
    const csvRows = [];

    const header = [''].concat(languages.map(lang => lang.name)).join(',');
    csvRows.push(header);

    matrix.forEach((row, i) => {
      const rowStr = [languages[i].name].concat(row.map(value => value.toString())).join(',');
      csvRows.push(rowStr);
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'language_comparison_matrix.csv');
  };

  return (
    <Box p={5}>
      <Heading mb={6}>Lab 1 - Language Ranking</Heading>

      <AddLanguageForm onAdd={handleAddLanguage} />

      <CustomFileInput onFileSelect={handleLoadFromFile} />

      <LanguageTable
        languages={languages}
        onRemove={handleRemoveLanguage}
        onReorder={handleReorderLanguages}
      />

      <Stack direction='row' spacing={4}>
      <Button colorScheme='purple' variant='outline' mt={4} onClick={handleSaveMatrixToFile}>
        Save Comparison Matrix to File
      </Button>

      <Button colorScheme='red' variant='outline' mt={4} onClick={() => setMatrixVisible(!isMatrixVisible)}>
        {isMatrixVisible ? 'Hide Matrix' : 'Show Matrix'}
      </Button>
      </Stack>

      {isMatrixVisible && (
        <Matrix
          matrix={generateComparisonMatrix()}
          languages={languages.map(lang => lang.name)}
          onHide={() => setMatrixVisible(false)}
        />
      )}
    </Box>
  );
};

export default App;
