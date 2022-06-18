import AddBoxTwoToneIcon from '@mui/icons-material/AddBoxTwoTone'
import DashboardCustomizeTwoToneIcon from '@mui/icons-material/DashboardCustomizeTwoTone'
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone'
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone'
import { List,ListItem,ListItemIcon,ListItemProps,ListItemText,SwipeableDrawer } from '@mui/material'
import type { ReactNode } from 'react'

interface SideBarProps {
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  doNavigate: (path: string) => void
}

export const SideBar = ({ drawerOpen, setDrawerOpen, doNavigate }: SideBarProps) => {
  return (
    <SwipeableDrawer onOpen={() => setDrawerOpen(true)} open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor='right'>
      <List>
        <SideBarListItem label='Dashboard' path='/' doNavigate={doNavigate}>
          <DashboardCustomizeTwoToneIcon />
        </SideBarListItem>
        <SideBarListItem label='Settings' path='/settings' doNavigate={doNavigate}>
          <SettingsApplicationsTwoToneIcon />
        </SideBarListItem>
        <SideBarListItem path='addbudget' label='Add budgeet' doNavigate={doNavigate}>
          <AddBoxTwoToneIcon />
        </SideBarListItem>
        <SideBarListItem listItemProps={{ component: 'a', href: '/api/auth/logout' }} path='/api/auth/logout' label='Log Out'>
          <LogoutTwoToneIcon />
        </SideBarListItem>
      </List>
    </SwipeableDrawer>
  )
}

type SideBarListItemProps = {
  path: string
  label: string
  doNavigate?: (path: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listItemProps?: Partial<ListItemProps<any>>
  children: ReactNode
}

const SideBarListItem = ({ path, doNavigate, label, listItemProps, children }: SideBarListItemProps) => (
  <ListItem button onClick={doNavigate ? () => doNavigate(path) : undefined} {...listItemProps}>
    <ListItemIcon>{children}</ListItemIcon>
    <ListItemText primary={label} />
  </ListItem>
)
