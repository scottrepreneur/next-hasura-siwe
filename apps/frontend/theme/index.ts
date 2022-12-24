import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Link: {
      baseStyle: (props) => ({
        color: props.color || 'whiteAlpha.600',
        _hover: {
          textDecoration: 'none',
          color: 'whiteAlpha.900',
        },
      }),
    },
  },
  global: {
    styles: {
      body: {
        bg: 'blackAlpha.600',
        color: 'white',
      },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

export default theme;
