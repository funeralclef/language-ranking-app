import React from 'react';
import { Box, Button, Input } from '@chakra-ui/react';
import { Language } from '../types/Language';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface LanguageTableProps {
  languages: Language[];
  onRemove: (name: string) => void;
  onLoadFile: (file: File) => void;
  onReorderLanguages: (languages: Language[], expertId: number) => void;
  expertId: number;
}

const LanguageTable: React.FC<LanguageTableProps> = ({ languages, onRemove, onLoadFile, onReorderLanguages, expertId }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onLoadFile(file);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedLanguages = Array.from(languages);
    const [movedItem] = reorderedLanguages.splice(result.source.index, 1);
    reorderedLanguages.splice(result.destination.index, 0, movedItem);
    onReorderLanguages(reorderedLanguages, expertId);
  };

  return (
    <Box>
      {/* Кнопка для завантаження файлу з красивим дизайном */}
      <Input 
        type="file" 
        onChange={handleFileUpload} 
        display="none" 
        id={`file-upload-${expertId}`} 
      />
      <label htmlFor={`file-upload-${expertId}`}>
        <Button 
          as="span" 
          colorScheme="gray" 
          variant="solid" 
          mb={4} 
          _hover={{ bg: "gray.250" }}
          _focus={{ boxShadow: "outline" }}
        >
          Завантажити мови з файлу
        </Button>
      </label>

      {/* Drag and drop для мови */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`language-table-${expertId}`}>
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {languages.map((language, index) => (
                <Draggable key={language.name} draggableId={language.name} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      p={2}
                      borderWidth="1px"
                      borderRadius="md"
                      mb={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box display="flex" alignItems="center">
                        <Box
                          minWidth="24px"
                          height="24px"
                          borderRadius="md"
                          bg="gray.100"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          mr={2}
                          fontSize="sm"
                        >
                          {language.initialNumber}
                        </Box>
                        {language.name}
                      </Box>
                      <Button size="sm" onClick={() => onRemove(language.name)}>
                        Видалити
                      </Button>
                    </Box>
                  )} 
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default LanguageTable;
