import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { Avatar, Box, Container, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, Typography } from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { useSelector } from 'react-redux'
import { Route, Switch, useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { PurchaseUser } from 'types'
import { checkCurrentUser, selectCurrentUser, selectLoginStatus, setCurrentUser, setLoginStatus } from './store/authSlice'
import { useAppDispatch } from './store/hooks'
import { AddBudget } from './views/AddBudget/AddBudget'
import { AddBudgetUser } from './views/AddBudgetUser/AddBudgetUser'
import { AddPurchase } from './views/AddPurchase/AddPurchase'
import { BudgetReport } from './views/BudgetReport/BudgetReport'
import { Dashboard } from './views/Dashboard/Dashboard'
import LoginView from './views/Login'

export const App = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const checkForLogin = async () => {
      dispatch(setLoginStatus('PENDING'))
      try {
        const resultAction = await dispatch(checkCurrentUser())
        const originalPromiseResult = unwrapResult(resultAction)
        dispatch(setCurrentUser((originalPromiseResult as any).payload as PurchaseUser))
        dispatch(setLoginStatus('LOGGED_IN'))
      } catch (err) {
        dispatch(setLoginStatus('UNAUTHORIZED'))
      }
    }
    checkForLogin()
  }, [])
  const loginStatus = useSelector(selectLoginStatus)
  const currentUser = useSelector(selectCurrentUser)

  const history = useHistory()

  const [drawerOpen, setDrawerOpen] = useState(false)

  const doNavigate = (path: string) => {
    history.push(path)
    setDrawerOpen(false)
  }
  return (
    <Div100vh>
      {/* <Snackbar
        open={rootState.snackBarOpen}
        autoHideDuration={6000}
        onClose={rootState.closeSnackbar}
        message={rootState.snackBarMessage.message}
      /> */}
      {loginStatus !== 'PENDING' && <LoginView />}
      {loginStatus === 'LOGGED_IN' && (
        <Container maxWidth='lg'>
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
          <Box
            sx={{
              paddingTop: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='h4' sx={{ fontFamily: 'LogoFont', textAlign: 'center' }} gutterBottom>
              - SALDO -
            </Typography>
            <Avatar
              src={currentUser.picture}
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ marginBottom: '17px', width: '30px', height: '30px' }}
            />
          </Box>
          <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route path='/addbudget' component={AddBudget} />
            <Route path='/budgets/:budgetId/adduser' component={AddBudgetUser} />
            <Route path='/budgets/:budgetId/addpurchase' component={AddPurchase} />
            <Route path='/budgets/:budgetId/report' component={BudgetReport} />
          </Switch>
        </Container>
      )}
    </Div100vh>
  )
}

export default App
