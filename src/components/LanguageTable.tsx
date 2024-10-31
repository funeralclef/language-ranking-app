import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { Language } from '../types/Language';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Props {
  languages: Language[];
  onRemove: (name: string) => void;
  onReorder: (newLanguages: Language[]) => void;
}

const LanguageTable: React.FC<Props> = ({ languages, onRemove, onReorder }) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedLanguages = Array.from(languages);
    const [movedLanguage] = reorderedLanguages.splice(result.source.index, 1);
    reorderedLanguages.splice(result.destination.index, 0, movedLanguage);
    onReorder(reorderedLanguages);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="languageList">
        {(provided) => (
          <Table variant="simple" {...provided.droppableProps} ref={provided.innerRef}>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {languages.map((lang, index) => (
                <Draggable key={lang.name} draggableId={lang.name} index={index}>
                  {(provided) => (
                    <Tr
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Td>{lang.name}</Td>
                      <Td>
                        <Button onClick={() => onRemove(lang.name)}>Remove</Button>
                      </Td>
                    </Tr>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Tbody>
          </Table>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default LanguageTable;
