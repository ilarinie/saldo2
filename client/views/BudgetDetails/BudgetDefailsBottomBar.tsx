import AddBoxIcon from '@mui/icons-material/AddBox'
import AssessmentIcon from '@mui/icons-material/Assessment'
import ListIcon from '@mui/icons-material/ListAltOutlined'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import { styled } from '@mui/system'

interface BudgetDetailsBottomBarProps {
  selectedIndex: number
  setSelectedIndex: (index: number) => void
}

export const BudgetDetailsBottomBar = ({ selectedIndex, setSelectedIndex }: BudgetDetailsBottomBarProps) => {
  return (
    <BudgetDetailsBottomBarContainer
      showLabels
      value={selectedIndex}
      onChange={(event, newValue) => {
        console.log(newValue)
        setSelectedIndex(newValue)
      }}
    >
      <BottomNavigationAction label='Saldo' icon={<AddBoxIcon />} />
      <BottomNavigationAction label='Add purchase' icon={<AddBoxIcon />} />
      <BottomNavigationAction label='Purchase List' icon={<ListIcon />} />
      <BottomNavigationAction label='Report' icon={<AssessmentIcon />} />
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
