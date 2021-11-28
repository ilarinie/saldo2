import { Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import { formatCurrency } from 'client/utils/formatCurrency'
import { UserTotal } from 'types'

interface SaldoTotalPanelProps {
  currentUserTotal: UserTotal
}

export const SaldoTotalPanel = ({ currentUserTotal }: SaldoTotalPanelProps) => {
  return (
    <TotalContainer>
      <Typography className='label'>total</Typography>
      <Typography className='value' variant='bigCurrency'>
        {formatCurrency(currentUserTotal.diff, true)}
      </Typography>
      <Typography className='label'>{currentUserTotal.diff > 0 ? 'owed' : 'debt'}</Typography>
    </TotalContainer>
  )
}

const TotalContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  .label {
    font-variant: small-caps;
  }
`
