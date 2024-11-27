import React, { useState } from 'react';
import { Box, Heading, Button, Input, Flex, Text } from '@chakra-ui/react';
import LanguageTable from './components/LanguageTable';
import AddLanguageForm from './components/AddLanguageForm';
import Matrix from './components/Matrix';
import ActionLog from './components/ActionLog';
import RankingTable from './components/RankingTable';
import { Language } from './types/Language';
import Papa from 'papaparse';

interface ExpertProps {
  id: number;
  languages: Language[];
  showMatrix: boolean;
  showLanguages: boolean;
  matrix: number[][];
  initialOrder: Language[];
}

const App: React.FC = () => {
  const [experts, setExperts] = useState<ExpertProps[]>([{ 
    id: 1, 
    languages: [], 
    showMatrix: false,
    showLanguages: true,
    matrix: [],
    initialOrder: [] 
  }]);
  const [numExperts, setNumExperts] = useState<number>(1);
  const [actionLogs, setActionLogs] = useState<string[]>([]);
  const [showRankingTable, setShowRankingTable] = useState<boolean>(false);

  const handleNumExpertsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setNumExperts(value);
    const newExperts = Array.from({ length: value }, (_, i) => ({
      id: i + 1,
      languages: [],
      showMatrix: false,
      showLanguages: true,
      matrix: [],
      initialOrder: []
    }));
    setExperts(newExperts);
  };

  const createInitialRankingMatrix = (languages: Language[]): number[][] => {
    const size = languages.length;
    return Array.from({ length: size }, (_, i) => 
      Array.from({ length: size }, (_, j) => {
        if (i === j) return 0;
        // In initial matrix, higher visual position means better rank
        return i < j ? 1 : -1;
      })
    );
  };

  const updateMatrixValues = (languages: Language[], expertId: number) => {
    if (!languages.length) return;

    const expert = experts.find(e => e.id === expertId);
    if (!expert) return;

    // Use expert's initial order for matrix positions
    const matrixOrder = expert.initialOrder.length > 0 
      ? expert.initialOrder.filter(lang => languages.some(l => l.name === lang.name))
      : [...languages];

    // Ensure matrix order has all current languages
    languages.forEach(lang => {
      if (!matrixOrder.some(l => l.name === lang.name)) {
        matrixOrder.push(lang);
      }
    });

    const size = matrixOrder.length;
    const rankMap = new Map(languages.map((lang, index) => [lang.name, index]));

    try {
      const newMatrix = Array(size).fill(null).map(() => Array(size).fill(0));
      
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (i === j) {
            newMatrix[i][j] = 0;
            continue;
          }
          
          const langI = matrixOrder[i];
          const langJ = matrixOrder[j];
          
          if (!langI || !langJ) continue;

          const rankI = rankMap.get(langI.name);
          const rankJ = rankMap.get(langJ.name);
          
          if (rankI === undefined || rankJ === undefined) continue;

          newMatrix[i][j] = rankI > rankJ ? -1 : 1;
        }
      }

      setExperts((prev) =>
        prev.map((exp) =>
          exp.id === expertId
            ? { ...exp, matrix: newMatrix }
            : exp
        )
      );
    } catch (error) {
      console.error('Error updating matrix:', error);
    }
  };

  const handleLoadFromFile = (file: File, expertId: number) => {
    Papa.parse(file, {
      complete: (result) => {
        const loadedLanguages = result.data
          .slice(1)
          .map((item, index) => ({ 
            name: Array.isArray(item) && item[0] ? item[0] : '',
            initialNumber: index + 1
          }))
          .filter((lang): lang is Language => !!lang.name);

        setExperts((prev) =>
          prev.map((exp) =>
            exp.id === expertId 
              ? { 
                  ...exp, 
                  languages: loadedLanguages, 
                  matrix: createInitialRankingMatrix(loadedLanguages), 
                  initialOrder: loadedLanguages 
                } 
              : exp
          )
        );
        logAction(`Експерт ${expertId} завантажив мови з файлу.`);
      },
    });
  };

  const handleAddLanguage = (expertId: number, languageName: string) => {
    setExperts((prevExperts) => {
      return prevExperts.map((expert) => {
        if (expert.id === expertId) {
          // Перевіряємо, чи не існує вже така мова
          if (expert.languages.some((l) => l.name === languageName)) {
            return expert;
          }
          
          // Знаходимо максимальний номер тільки для поточного експерта
          const maxNumber = Math.max(
            0,
            ...expert.languages.map(l => l.initialNumber)
          );
          
          const newLanguage = {
            name: languageName,
            initialNumber: maxNumber + 1
          };

          const newLanguages = [...expert.languages, newLanguage];
          
          // Оновлюємо матрицю
          const newMatrix = createInitialRankingMatrix(newLanguages);
          
          return {
            ...expert,
            languages: newLanguages,
            matrix: newMatrix,
            initialOrder: [...expert.initialOrder, newLanguage]
          };
        }
        return expert;
      });
    });
    
    setActionLogs(prev => [...prev, `Експерт ${expertId} додав мову "${languageName}"`]);
  };

  const handleRemoveLanguage = (name: string, expertId: number) => {
    setExperts((prev) =>
      prev.map((exp) =>
        exp.id === expertId
          ? {
              ...exp,
              languages: exp.languages.filter((lang) => lang.name !== name),
              initialOrder: exp.initialOrder.filter(lang => lang.name !== name)
            }
          : exp
      )
    );
    
    const expert = experts.find((e) => e.id === expertId);
    if (expert) {
      const updatedLanguages = expert.languages.filter(lang => lang.name !== name);
      updateMatrixValues(updatedLanguages, expertId);
    }

    logAction(`Експерт ${expertId} видалив об'єкт "${name}".`);
  };

  const handleLanguageReorder = (reorderedLanguages: Language[], expertId: number) => {
    const currentExpert = experts.find(exp => exp.id === expertId);
    if (currentExpert) {
      const oldOrder = currentExpert.languages;
      const changes = reorderedLanguages.map((lang, newIndex) => {
        const oldIndex = oldOrder.findIndex(l => l.name === lang.name);
        return { lang, oldIndex, newIndex };
      });

      // Log only actual position changes
      changes.forEach(({ lang, oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
          logAction(`Об'єкт "${lang.name}" переміщено з позиції ${oldIndex + 1} на позицію ${newIndex + 1}`);
        }
      });
    }

    setExperts((prev) =>
      prev.map((exp) =>
        exp.id === expertId
          ? { ...exp, languages: reorderedLanguages }
          : exp
      )
    );
    
    updateMatrixValues(reorderedLanguages, expertId);
  };

  const toggleMatrixVisibility = (expertId: number) => {
    setExperts((prev) =>
      prev.map((exp) =>
        exp.id === expertId ? { ...exp, showMatrix: !exp.showMatrix } : exp
      )
    );
  };

  const toggleLanguagesVisibility = (expertId: number) => {
    setExperts((prev) =>
      prev.map((exp) =>
        exp.id === expertId ? { ...exp, showLanguages: !exp.showLanguages } : exp
      )
    );
  };

  const logAction = (action: string) => {
    setActionLogs((prev) => [...prev, action]);
  };

  const exportToCSV = () => {
    const data = experts.map((expert) => {
      const rankings = expert.languages.map((_, i) => expert.matrix[i].join(',')).join('\n');
      return `Експерт ${expert.id}\n${rankings}`;
    }).join('\n\n');

    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ranking_matrix.csv';
    link.click();
  };

  const exportToTxt = () => {
    let content = '';

    // Додаємо матриці для кожного експерта
    experts.forEach((expert) => {
      content += `Експерт ${expert.id}\n`;
      
      // Додаємо матрицю
      expert.matrix.forEach((row) => {
        content += row.join(',') + '\n';
      });
      content += '\n'; // Додаємо порожній рядок між експертами
    });

    // Додаємо таблицю ранжувань
    content += 'Таблиця ранжувань:\n';
    
    // Отримуємо всі унікальні мови
    const allLanguages = Array.from(
      new Set(
        experts.flatMap(expert => 
          expert.initialOrder.map(lang => lang.name)
        )
      )
    );

    // Додаємо рядки для кожного експерта
    experts.forEach((expert) => {
      content += `Експерт${expert.id} `;
      
      // Додаємо позиції для кожної мови
      allLanguages.forEach((langName) => {
        const position = expert.languages.findIndex(
          lang => lang.name === langName
        );
        content += `${position === -1 ? '' : (position + 1)} `;
      });
      content += '\n';
    });

    // Створюємо та завантажуємо файл
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ranking_results.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Flex p={5}>
      <Box flex="1">
        <Heading mb={6}>Lab - 2 "Multi-Expert Language"</Heading>
          <Box mb={4}>
            <Text fontSize="sm" color="gray.500" mb={1}>Введіть кількість експертів</Text>
            <Input
              placeholder="Введіть кількість експертів"
              value={numExperts}
              onChange={handleNumExpertsChange}
              type="number"
              min={1}
            />
          </Box>

        {experts.map((expert) => (
          <Box key={expert.id} mb={8}>
            <Heading size="md" mb={4}>
              Експерт {expert.id}
            </Heading>
            <Flex 
              justifyContent="space-between" 
              alignItems="center" 
              mb={4}
              width="100%"
            >
              <Button
                onClick={() => toggleLanguagesVisibility(expert.id)}
                size="sm"
                variant="outline"
                leftIcon={
                  <Text fontSize="lg">
                    {expert.showLanguages ? '▼' : '▶'}
                  </Text>
                }
              >
                {expert.showLanguages ? 'Приховати список' : 'Показати список'}
              </Button>
            </Flex>

            {expert.showLanguages && (
              <>
                <AddLanguageForm onAdd={(name) => handleAddLanguage(expert.id, name)} />
                <LanguageTable
                  languages={expert.languages}
                  onRemove={(name) => handleRemoveLanguage(name, expert.id)}
                  expertId={expert.id}
                  onLoadFile={(file) => handleLoadFromFile(file, expert.id)}
                  onReorderLanguages={(reorderedLanguages) => handleLanguageReorder(reorderedLanguages, expert.id)}
                />
              </>
            )}

            <Button
              mt={4}
              onClick={() => toggleMatrixVisibility(expert.id)}
              isDisabled={expert.languages.length < 2}
            >
              {expert.showMatrix ? 'Приховати матрицю' : 'Показати матрицю'}
            </Button>
            {expert.showMatrix && (
              <Matrix matrix={expert.matrix} languages={expert.languages.map(l => l.name)} onHide={() => toggleMatrixVisibility(expert.id)} />
            )}
          </Box>
        ))}
        <RankingTable 
          experts={experts}
          isVisible={showRankingTable}
          onToggleVisibility={() => setShowRankingTable(!showRankingTable)}
        />
      </Box>
      <Box ml={10} width="300px">
        <ActionLog logs={actionLogs} />
        <Button 
          onClick={exportToTxt} 
          mt={4}
          size="md"
          variant="outline"
          width="100%"
        >
          Зберегти результати
        </Button>
      </Box>
    </Flex>
  );
};

export default App;
