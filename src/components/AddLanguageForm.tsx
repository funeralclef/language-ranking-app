import React, { useState } from 'react';
import { Input, Button, Box } from '@chakra-ui/react';

interface AddLanguageFormProps {
  onAdd: (name: string) => void;
}

const AddLanguageForm: React.FC<AddLanguageFormProps> = ({ onAdd }) => {
  const [languageName, setLanguageName] = useState('');

  const handleAdd = () => {
    if (languageName.trim()) {
      onAdd(languageName.trim());
      setLanguageName('');
    }
  };

  return (
    <Box display="flex" mt={4} mb={4}>
      <Input
        placeholder="Додати нову мову"
        value={languageName}
        onChange={(e) => setLanguageName(e.target.value)}
        mr={2}
      />
      <Button onClick={handleAdd}>Додати</Button>
    </Box>
  );
};

export default AddLanguageForm;
