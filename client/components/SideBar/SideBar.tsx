import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer } from '@mui/material'
import { Link } from 'react-router-dom'

interface SideBarProps {
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  doNavigate: (path: string) => void
}

export const SideBar = ({ drawerOpen, setDrawerOpen, doNavigate }: SideBarProps) => {
  return (
    <SwipeableDrawer onOpen={() => setDrawerOpen(true)} open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor='right'>
      <List>
        <ListItem button onClick={() => doNavigate('/')}>
          <ListItemIcon>
            <DashboardOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItem>
        <ListItem button onClick={() => doNavigate('/addbudget')}>
          <ListItemIcon>
            <AddOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary='Add budget' />
        </ListItem>
        <ListItem button onClick={() => doNavigate('/api/auth/logout')}>
          <Link to='/api/auth/logout'>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary='Log Out' />
          </Link>
        </ListItem>
      </List>
    </SwipeableDrawer>
  )
}
