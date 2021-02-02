import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'background',
        color: 'textColor',
      },
    },
  },
  colors: {
    transparent: 'transparent',
    lighterDark: '#212230',
    background: '#1F1D2B',
    textColor: '#DBDADC',
    positiveColor: '#90B571',
    negativeColor: '#E54131',
    black: '#000',
    white: '#fff',
  },
  components: {
    Container: {
      baseStyle: {
        paddingLeft: '1em',
        paddingRight: '1em',
      },
    },
    IconButton: {
      baseStyle: {
        background: '#1F1D2B',
      },
    },
  },
  space: {},
});

export default theme;
