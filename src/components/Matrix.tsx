import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

interface MatrixProps {
  matrix: number[][];
  languages: string[];
  onHide: () => void;
}

const Matrix: React.FC<MatrixProps> = ({ matrix, languages, onHide }) => {
  return (
    <Box mt={4}>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Object</Th>
            {languages.map((lang, i) => (
              <Th key={i}>{i + 1}</Th>  // Виводимо індекс об'єкта
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {matrix.map((row, i) => (
            <Tr key={i}>
              <Td>{i + 1}</Td>  {/* Виводимо індекс об'єкта для кожного рядка */}
              {row.map((cell, j) => (
                <Td key={j}>{cell}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};


export default Matrix;
