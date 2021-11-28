import AddBoxIcon from '@mui/icons-material/AddBox'
import AssessmentIcon from '@mui/icons-material/Assessment'
import ListIcon from '@mui/icons-material/ListAltOutlined'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import { styled } from '@mui/system'
import { useHistory } from 'react-router-dom'

interface BudgetDetailsBottomBarProps {
  budgetId: string
}

export const BudgetDetailsBottomBar = ({ budgetId }: BudgetDetailsBottomBarProps) => {
  const history = useHistory()

  return (
    <BudgetDetailsBottomBarContainer showLabels>
      <BottomNavigationAction label='Add purchase' icon={<AddBoxIcon />} onClick={() => history.push(`/budgets/${budgetId}/addpurchase`)} />
      <BottomNavigationAction label='Purchase List' icon={<ListIcon />} onClick={() => history.push(`/budgets/${budgetId}/purchaselist`)} />
      <BottomNavigationAction label='Report' icon={<AssessmentIcon />} onClick={() => history.push(`/budgets/${budgetId}/report`)} />
    </BudgetDetailsBottomBarContainer>
  )
}

const BudgetDetailsBottomBarContainer = styled(BottomNavigation)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`
