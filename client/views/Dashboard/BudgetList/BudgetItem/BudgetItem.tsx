import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { Button,ButtonGroup,Card,CardActions,CardContent,CardHeader,Collapse,IconButton,styled } from '@mui/material'
import { memo,useState } from 'react'
import { useHistory } from 'react-router'
import { Budget,PurchaseUser } from 'types'
import { BudgetExpanded } from './BudgetExpanded'
import { BudgetItemMenu } from './BudgetItemMenu'
import { BudgetStack } from './BudgetStack'
import { SaldoStack } from './SaldoStack'
interface BudgetItemProps {
  budget: Budget
  onDeletePurchase: (purchaseId: string, budgetId: string) => void
  requestNewTransfer: (budget: Budget) => void
  currentUser: PurchaseUser
}

export const formatName = (name: string) => {
  return name.split(' ')[0]
}

const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }: { theme: any; expand: any }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export const BudgetItem = memo(
  ({ budget, onDeletePurchase, requestNewTransfer, currentUser }: BudgetItemProps) => {
    const [expanded, setExpanded] = useState(false)
    const history = useHistory()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleExpandClick = () => {
      setExpanded(!expanded)
    }
    const onMenuClose = (path?: string) => {
      setAnchorEl(null)
      if (path) {
        history.push(path)
      }
    }
    const onMenuOpen = (event: any) => {
      setAnchorEl(event.target)
    }

    const { totals } = budget

    const currentUserTotal = totals.find(t => t.user._id === currentUser._id)
    const otherUserTotal = totals.find(t => t.user._id !== currentUser._id)

    return (
      <Card sx={{ marginBottom: '1em' }}>
        <CardHeader
          onClick={() => history.push(`/budgets/${budget._id}`)}
          title={budget.name}
          subheader={budget.type === 'saldo' && otherUserTotal && `with ${otherUserTotal?.user.name}`}
          titleTypographyProps={{
            sx: {
              fontFamily: 'LogoFont ',
            },
          }}
          subheaderTypographyProps={{
            sx: {
              fontSize: '0.85rem',
              fontVariant: 'small-caps',
              marginTop: '-10px',
              fontWeight: 500,
            },
          }}
          action={
            <IconButton ref={anchorEl} onClick={onMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          }
        />
        <BudgetItemMenu budgetType={budget.type} onMenuClose={onMenuClose} anchorEl={anchorEl} budgetId={budget._id} open={open} />
        <CardContent>
          {budget.type === 'saldo' ? <SaldoStack {...{ currentUserTotal, otherUserTotal }} /> : <BudgetStack members={totals} />}
        </CardContent>
        <CardActions disableSpacing>
          <ButtonGroup>
            <Button variant='text' size='small' onClick={() => history.push(`/budgets/${budget._id}/addpurchase`)}>
              <AddIcon />
              &nbsp; Add
            </Button>
            <Button variant='text' size='small' onClick={() => requestNewTransfer(budget)}>
              <SwapHorizIcon />
              &nbsp; Transfer
            </Button>
          </ButtonGroup>
          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label='show more'>
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <BudgetExpanded budget={budget} />
        </Collapse>
      </Card>
    )
  },
  (previousProps, newProps) => {
    if (previousProps.budget.total === newProps.budget.total) {
      return false
    }
    return true
  }
)
BudgetItem.displayName = 'SaldoBudgetItem'
