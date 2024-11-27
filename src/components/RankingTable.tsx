import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,
  Text,
  TableContainer
} from '@chakra-ui/react';
import { Language } from '../types/Language';

interface RankingTableProps {
  experts: {
    id: number;
    languages: Language[];
    initialOrder: Language[];
  }[];
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const RankingTable: React.FC<RankingTableProps> = ({ 
  experts, 
  isVisible, 
  onToggleVisibility 
}) => {
  if (!isVisible) {
    return (
      <Box 
        width="100%" 
        maxW="600px" 
        display="flex" 
        justifyContent="flex-start"
      >
        <Button onClick={onToggleVisibility} size="md">
          Показати таблицю ранжувань
        </Button>
      </Box>
    );
  }

  // Get all unique languages from all experts' initial orders
  const allLanguages = Array.from(
    new Set(
      experts.flatMap(expert => 
        expert.initialOrder.map(lang => lang.name)
      )
    )
  );

  return (
    <Box mt={4} width="100%">
      <Box 
        width="100%" 
        maxW="600px" 
        display="flex" 
        justifyContent="flex-start"
        mb={4}
      >
        <Button onClick={onToggleVisibility} size="md">
          Приховати таблицю ранжувань
        </Button>
      </Box>
      
      <TableContainer 
        maxW="100%" 
        overflowX="auto" 
        border="1px" 
        borderColor="gray.200" 
        borderRadius="md"
        boxShadow="sm"
      >
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th 
                position="sticky" 
                left="0" 
                bg="gray.50" 
                zIndex="1"
                minW="100px"
                borderRight="1px"
                borderColor="gray.200"
              >
                Objects
              </Th>
              {allLanguages.map((langName, index) => (
                <Th 
                  key={index}
                  px={3}
                  textAlign="center"
                  minW="80px"
                  maxW="120px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  fontSize="xs"
                  p={0}
                >
                  <Box 
                    borderBottom="1px" 
                    borderColor="gray.200" 
                    height="32px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="sm">{index + 1}</Text>
                  </Box>
                  <Box 
                    height="40px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text 
                      fontSize="xs" 
                      color="gray.600"
                      noOfLines={2}
                    >
                      {langName}
                    </Text>
                  </Box>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {experts.map((expert) => (
              <Tr key={expert.id}>
                <Td 
                  position="sticky" 
                  left="0" 
                  zIndex="1"
                  fontWeight="bold"
                  borderRight="1px"
                  borderColor="gray.200"
                >
                  Експерт {expert.id}
                </Td>
                {allLanguages.map((langName, index) => {
                  const position = expert.languages.findIndex(
                    lang => lang.name === langName
                  );
                  return (
                    <Td 
                      key={index}
                      textAlign="center"
                      px={3}
                    >
                      {position === -1 ? '' : (position + 1)}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RankingTable;
