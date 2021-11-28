import { Stack } from '@mui/material'
import { SaldoTotalPanel } from 'client/components/SaldoTotalPanel/SaldoTotalPanel'
import { UserTotal } from 'types'

export const SaldoStack = ({ currentUserTotal, otherUserTotal }: { currentUserTotal?: UserTotal; otherUserTotal?: UserTotal }) => {
  if (!otherUserTotal || !currentUserTotal) {
    return null
  }
  return (
    <Stack direction='column'>
      <SaldoTotalPanel currentUserTotal={currentUserTotal} />
    </Stack>
  )
}
