import { Container } from '@mui/material'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { useSelector } from 'react-redux'
import { Route, Switch, useHistory } from 'react-router'
import { AppBar, SideBar } from './components'
import { useCheckLoginStatus } from './hooks/useCheckLoginStatus'
import { selectCurrentUser } from './store/authSlice'
import { AddBudget } from './views/AddBudget/AddBudget'
import { AddBudgetUser } from './views/AddBudgetUser/AddBudgetUser'
import { BudgetDetailsContainer } from './views/BudgetDetails/BudgetDetailsContainer'
import { Dashboard } from './views/Dashboard/Dashboard'
import { FaceliftBudgetView } from './views/FaceliftBudget/FaceliftBudgetView'
import LoginView from './views/Login'
import { UserSettings } from './views/UserSettings/UserSettings'

export const App = () => {
  const loginStatus = useCheckLoginStatus()
  const currentUser = useSelector(selectCurrentUser)
  const history = useHistory()

  const [drawerOpen, setDrawerOpen] = useState(false)
  // const { settings } = useLocalStorageUserSettings()

  const doNavigate = (path: string) => {
    history.push(path)
    setDrawerOpen(false)
  }

  useEffect(() => {
    if (loginStatus === 'LOGGED_IN' && currentUser.defaultBudgetId) {
      history.push(`/budgets/${currentUser.defaultBudgetId}`)
    }
  }, [loginStatus])

  const renderMainView = () => (
    <>
      <Container maxWidth='lg'>
        <AppBar setDrawerOpen={setDrawerOpen} isDrawerOpen={drawerOpen} currentUser={currentUser} />
      </Container>
      <Container maxWidth='lg' sx={{ height: 'calc(100% - 54px)' }}>
        <SideBar drawerOpen={drawerOpen} doNavigate={doNavigate} setDrawerOpen={setDrawerOpen} />
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route path='/addbudget' component={AddBudget} />
          <Route exact path='/budgets/:budgetId/adduser' component={AddBudgetUser} />
          <Route path='/budgets/:budgetId' component={BudgetDetailsContainer} />
          <Route path='/settings' component={UserSettings} />
        </Switch>
      </Container>
    </>
  )
  return (
    <Div100vh>
      {/* <Snackbar
        open={rootState.snackBarOpen}
        autoHideDuration={6000}
        onClose={rootState.closeSnackbar}
        message={rootState.snackBarMessage.message}
      /> */}
      {loginStatus !== 'LOGGED_IN' && <LoginView />}
      {loginStatus === 'LOGGED_IN' && (
        <>
          <Switch>
            <Route path='/budgets/:budgetId' component={FaceliftBudgetView} />
            {/* <Route component={renderMainView} /> */}
          </Switch>
        </>
      )}
    </Div100vh>
  )
}

export default App
