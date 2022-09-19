import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { formatCurrency } from 'client/utils/formatCurrency'
import { useState } from 'react'
import { Purchase } from 'types'
import { getPayer } from '../../views/Dashboard/BudgetList/BudgetItem/BudgetExpanded'

export const PurchaseItem = ({
  purchase,
  deletePurchase,
  onPurchaseSelected,
}: {
  purchase: Purchase
  deletePurchase: (purchaseId: string, budgetId: string) => void
  onPurchaseSelected: (purchase: Purchase) => void
}) => {
  const onDeletePurchase = () => {
    /* eslint-disable */
    const duu = confirm('Sure u want delete?')
    if (duu) {
      deletePurchase(purchase._id, purchase.budgetId)
    }
    onMenuClose()
  }

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
          <MoreVertIcon />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar src={getPayer(purchase).picture} />
      </ListItemAvatar>
      <ListItemText
        primary={purchase.description}
        secondary={`${formatCurrency(purchase.amount)} - ${new Date(purchase.createdAt).toLocaleTimeString()} ${new Date(purchase.createdAt)
          .toLocaleDateString()
          .substr(0, 5)}`}
      />
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
