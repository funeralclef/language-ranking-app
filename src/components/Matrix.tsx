import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box} from '@chakra-ui/react';

interface MatrixProps {
  matrix: number[][];
  languages: string[];
  onHide: () => void;
}

const Matrix: React.FC<MatrixProps> = ({ matrix, languages, onHide }) => {
  return (
    <Box mt={4} maxW="100%" overflowX="auto" borderWidth={1} borderRadius="lg" p={4}>
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th></Th>
            {languages.map((lang, idx) => (
              <Th key={idx} textAlign="center">{lang}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {matrix.map((row, i) => (
            <Tr key={i}>
              <Td fontWeight="bold">{languages[i]}</Td>
              {row.map((value, j) => (
                <Td key={j} textAlign="center">{value}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Matrix;
