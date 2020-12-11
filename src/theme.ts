import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: '#1F1D2B',
                color: '#DBDADC'
            } 
        }
    },
    colors: {
      transparent: "transparent",
      lighterDark: '#212230',
      black: "#000",
      white: "#fff",
    },
    components: {
        Container: {
            baseStyle: {
                paddingLeft: '1em',
                paddingRight: '1em'
            }
        }
    },
    space: {
        
    }
    
  });

  export default theme;