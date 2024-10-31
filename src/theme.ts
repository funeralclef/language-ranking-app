import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Arial, sans-serif',
    body: 'Georgia, serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.100',
      },
    },
  },
});

export default theme;
