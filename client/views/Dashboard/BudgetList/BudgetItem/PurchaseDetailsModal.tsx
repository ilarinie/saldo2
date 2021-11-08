import CloseRounded from '@mui/icons-material/CloseRounded'
import { Avatar, Card, CardContent, CardHeader, IconButton, Modal, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { formatCurrency } from 'client/utils/formatCurrency'
import { Purchase } from 'types'
import { getPayer } from './BudgetExpanded'

interface PurchaseDetailsModalProps {
  modalOpen: boolean
  selectedPurchase?: Purchase
  setSelectedPurchase: (purchase: Purchase | undefined) => void
}

const style = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '600px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export const PurchaseDetailsModal = ({ modalOpen, selectedPurchase, setSelectedPurchase }: PurchaseDetailsModalProps) => {
  return (
    <Modal open={modalOpen} onClose={() => setSelectedPurchase(undefined)}>
      <Card sx={{ ...style, position: 'absolute' }}>
        {selectedPurchase && (
          <>
            <CardHeader
              title={selectedPurchase?.description}
              avatar={<Avatar src={getPayer(selectedPurchase).picture} aria-label='recipe' />}
              subheader={formatDateTime(new Date(selectedPurchase.createdAt))}
              action={
                <IconButton aria-label='close' onClick={() => setSelectedPurchase(undefined)}>
                  <CloseRounded />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant='subtitle1'>Summa</Typography>
              <Typography variant='bigCurrency'>{formatCurrency(selectedPurchase.amount)}</Typography>
              <Typography sx={{ marginTop: '0.5em' }} variant='subtitle1'>
                Osuudet
              </Typography>
              <Table aria-label='equity table'>
                <TableBody>
                  {selectedPurchase.benefactors.map(benefactor => (
                    <TableRow
                      key={benefactor.user._id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component='th' scope='row'>
                        {benefactor.user.name.split(' ')[0]}
                      </TableCell>
                      <TableCell align='right'>{formatCurrency(benefactor.amountBenefitted)}</TableCell>
                      <TableCell align='right'>{percentage(benefactor.amountBenefitted, selectedPurchase.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography sx={{ marginTop: '0.5em' }} variant='subtitle1'>
                Ostoksen loi
              </Typography>
              <Typography sx={{ marginTop: '0.5em' }} variant='body2'>
                {selectedPurchase.createdBy.name}
              </Typography>
            </CardContent>
          </>
        )}
      </Card>
    </Modal>
  )
}

const percentage = (number1: number, number2: number): string => {
  return ((number1 / number2) * 100).toFixed(0) + '%'
}

const formatDateTime = (date: Date): string => {
  return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`
}
