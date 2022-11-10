import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Box, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, styled, Typography } from '@mui/material'
import { formatCurrency } from 'client/utils/formatCurrency'
import { purchaseNameToEmojiMapper } from 'client/utils/purchaseNameToEmojiMapper'
import { useState } from 'react'
import { Purchase, PurchaseUser } from 'types'

type PurchaseItemProps = {
  purchase: Purchase
  deletePurchase: (purchaseId: string, budgetId: string) => void
  onPurchaseSelected: (purchase: Purchase) => void
  currentUser: PurchaseUser
}

const getPurchaseDiff = (purchase: Purchase, currentUser: PurchaseUser) => {
  const benefactor = purchase.benefactors.find(b => b.user._id === currentUser._id)
  if (!benefactor) {
    return 0
  }
  if (benefactor.amountBenefitted !== 0) {
    return benefactor.amountBenefitted * -1
  }
  if (benefactor.amountPaid) {
    return benefactor.amountPaid
  }
  return 0
}

export const PurchaseItem = ({ currentUser, purchase, deletePurchase, onPurchaseSelected }: PurchaseItemProps) => {
  const onDeletePurchase = () => {
    /* eslint-disable */
    const duu = confirm('Sure u want delete?')
    if (duu) {
      deletePurchase(purchase._id, purchase.budgetId)
    }
    onMenuClose()
  }

  const purchaseDiff = getPurchaseDiff(purchase, currentUser)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const onMenuOpen = (event: any) => {
    setAnchorEl(event.target)
  }

  const onMenuClose = (action?: any) => {
    setAnchorEl(null)
    if (action) {
      if (action === 'open') {
        onPurchaseSelected(purchase)
      }
    }
  }

  return (
    <ListItem
      secondaryAction={
        <IconButton edge='end' aria-label='delete' onClick={onMenuOpen}>
          <MoreHorizIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <Badge negative={String(purchaseDiff < 0)}>{formatCurrency(purchaseDiff, true)}</Badge>
        <Typography sx={{ fontWeight: '300', marginRight: '1em' }}>{purchaseNameToEmojiMapper(purchase.description)}</Typography>
      </ListItemIcon>
      <ListItemText sx={{ fontSize: '1.2rem', textTransform: 'capitalize', fontWeight: 800 }} primary={`${purchase.description} `} />
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={onMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => onMenuClose('open')}>
          <ListItemIcon>
            <InfoOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={onDeletePurchase}>
          <ListItemIcon>
            <DeleteOutlineOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </ListItem>
  )
}

const Badge = styled(Box)<{ negative: string }>(
  ({ negative }) => `
  background: #258525a8;
  color: #fff;
  font-weight: 500;
  margin-right: 1em;
  border-radius: 3px;
  min-width: 9ch;
  text-align: center;
  ${negative === 'true' && 'background: #d43636db;'}
`
)
