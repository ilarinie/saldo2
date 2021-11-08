import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { Avatar, Container, Stack, Typography } from '@mui/material'
import { formatCurrency } from 'client/utils/formatCurrency'
import { UserTotal } from 'types'
import { formatName } from './BudgetItem'

export const SaldoStack = ({ member1, member2 }: { member1: UserTotal; member2?: UserTotal }) => {
  if (!member2) {
    return null
  }
  return (
    <>
      <Stack direction='row'>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexGrow: 0,
            width: '50px',
          }}
        >
          <Avatar src={member1.user.picture} sx={{ marginBottom: '4px' }} />
          <Typography>{formatName(member1.user.name)}</Typography>
        </Container>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <ArrowLeftIcon
            sx={{
              visibility: member1.diff > 0 ? 'visible' : 'hidden',
            }}
          />
          <Typography variant='bigCurrency'>{formatCurrency(member1.diff)}</Typography>
          <ArrowRightIcon
            sx={{
              visibility: member1.diff > 0 ? 'hidden' : 'visible',
            }}
          />
        </Container>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexGrow: 0,
            width: '50px',
          }}
        >
          <Avatar src={member2.user.picture} sx={{ marginBottom: '4px' }} />
          <Typography>{formatName(member2.user.name)}</Typography>
        </Container>
      </Stack>
    </>
  )
}
