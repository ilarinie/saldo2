import { Box, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { formatCurrency } from 'client/utils/formatCurrency'

type TitleValueProps = {
  first: string
  value: string
  second: string
}

export const TitleValue = ({ first, value, second }: TitleValueProps) => {
  return <TitleValueContainer>
    <TitleContainer>
      <Typography>{first}</Typography>
    </TitleContainer>
    <ValueContainer>
      <Typography>{value}</Typography>
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