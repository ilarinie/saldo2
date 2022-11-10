import { Box, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { ReactNode } from 'react'

type TitleValueProps = {
  first: string
  children: ReactNode
  second: string
}

export const TitleValue = ({ first, children, second }: TitleValueProps) => {
  return <TitleValueContainer>
    <TitleContainer>
      <Typography>{first}</Typography>
    </TitleContainer>
    <ValueContainer>
      {children}
    </ValueContainer>
    <TitleContainer>
      <Typography>{second}</Typography>
    </TitleContainer>
  </TitleValueContainer>
}

const TitleValueContainer = styled(Box)`
  display: flex;
  flex-direction: column;

  align-items: center;
`

const TitleContainer = styled(Box)`
  font-variant: small-caps;
  p {

    font-weight: 700;
  }
  
`

const ValueContainer = styled(Box)`
  p {
    font-weight: 300
  }

`