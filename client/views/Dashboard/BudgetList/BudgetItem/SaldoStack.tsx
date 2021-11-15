import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { InfoBoxRow } from 'client/components/InfoBox/InfoBoxRow'
import { formatCurrency } from 'client/utils/formatCurrency'
import { UserTotal } from 'types'

export const SaldoStack = ({ currentUserTotal, otherUserTotal }: { currentUserTotal?: UserTotal; otherUserTotal?: UserTotal }) => {
  if (!otherUserTotal || !currentUserTotal) {
    return null
  }
  return (
    <Stack direction='column'>
      <TotalContainer>
        <Typography className='label'>total</Typography>
        <Typography className='value' variant='bigCurrency'>
          {formatCurrency(currentUserTotal.diff)}
        </Typography>
        <Typography className='label'>{currentUserTotal.diff > 0 ? 'owed' : 'debt'}</Typography>
      </TotalContainer>
      <InfoBoxRow data={foo} />
    </Stack>
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

const foo = [
  {
    topText: 'purchases',
    value: '999.99',
    bottomText: 'this month',
  },
  {
    topText: 'change',
    value: '999.99',
    bottomText: 'today',
  },
]
