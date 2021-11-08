import Assessment from '@mui/icons-material/Assessment'
import PersonAdd from '@mui/icons-material/PersonAdd'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { Budget } from 'types'

interface BudgetItemMenuProps {
  budgetId: string
  onMenuClose: (path?: string) => void
  anchorEl: any
  open: boolean
  budgetType: Budget['type']
}

export const BudgetItemMenu = ({ budgetId, onMenuClose, anchorEl, open, budgetType }: BudgetItemMenuProps) => {
  return (
    <Menu
      id='basic-menu'
      anchorEl={anchorEl}
      open={open}
      onClose={() => onMenuClose()}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      {budgetType === 'budget' && (
        <MenuItem onClick={() => onMenuClose(`/budgets/${budgetId}/adduser`)}>
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText>Add user</ListItemText>
        </MenuItem>
      )}
      <MenuItem onClick={() => onMenuClose(`/budgets/${budgetId}/report`)}>
        <ListItemIcon>
          <Assessment />
        </ListItemIcon>
        <ListItemText>Report</ListItemText>
      </MenuItem>
    </Menu>
  )
}
