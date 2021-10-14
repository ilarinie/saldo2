import { createTheme } from '@mui/material'

export const theme = createTheme({
  typography: {
    bigCurrency: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    subtitle1: {
      marginTop: '8px',
    },
  },
  palette: {
    mode: 'dark',
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
