import { createTheme } from '@mui/material'
import { lightBlue } from '@mui/material/colors'

export const theme = createTheme({
  typography: {
    bigCurrency: {
      fontSize: '30px',
      fontWeight: 500,
      fontFamily: 'LogoFont',
    },
    subtitle1: {
      marginTop: '8px',
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: lightBlue[500],
    },
  },
})

declare module '@mui/material/styles' {
  interface TypographyVariants {
    bigCurrency: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    bigCurrency?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    bigCurrency: true
  }
}
