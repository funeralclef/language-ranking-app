import React from 'react';
import { Box, List, ListItem, ListIcon, Heading } from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';

interface ActionLogProps {
  logs: string[];
}

const ActionLog: React.FC<ActionLogProps> = ({ logs }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} width="100%" maxHeight="600px" overflowY="auto">
      <Heading size="md" mb={4}>Лог дій експертів</Heading>
      <List spacing={3}>
        {logs.map((log, index) => (
          <ListItem key={index} fontSize="sm">
            <ListIcon as={MdCheckCircle} color="green.500" />
            {log}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ActionLog;