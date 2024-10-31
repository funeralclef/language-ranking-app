import React, { useState } from 'react';
import { Box, Button, Input } from '@chakra-ui/react';

interface AddLanguageFormProps {
  onAdd: (name: string) => void;
}

const AddLanguageForm: React.FC<AddLanguageFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name);
      setName('');
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} mb={4}>
      <Input
        placeholder="Enter language name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button colorScheme='purple' variant='outline' type="submit" mt={2}>
        Add Language
      </Button>
    </Box>
  );
};

export default AddLanguageForm;
