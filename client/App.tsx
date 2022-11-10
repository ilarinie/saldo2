import { Alert, Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch, useHistory } from 'react-router'
import { useCheckLoginStatus } from './hooks/useCheckLoginStatus'
import { selectCurrentUser } from './store/authSlice'
import { RootState } from './store/store'
import { closeToast } from './store/toastSlice'
import { FaceliftBudgetView } from './views/FaceliftBudget/FaceliftBudgetView'
import LoginView from './views/Login'

export const App = () => {
  const loginStatus = useCheckLoginStatus()
  const currentUser = useSelector(selectCurrentUser)
  const history = useHistory()
  const toastState = useSelector((state: RootState) => state.toast)
  const dispatch = useDispatch()

  const onCloseToast = () => {
    dispatch(closeToast())
  }

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

  // const renderMainView = () => (
  //   <>
  //     <Container maxWidth='lg'>
  //       <AppBar setDrawerOpen={setDrawerOpen} isDrawerOpen={drawerOpen} currentUser={currentUser} />
  //     </Container>
  //     <Container maxWidth='lg' sx={{ height: 'calc(100% - 54px)' }}>
  //       <SideBar drawerOpen={drawerOpen} doNavigate={doNavigate} setDrawerOpen={setDrawerOpen} />
  //       <Switch>
  //         <Route exact path='/' component={Dashboard} />
  //         <Route path='/addbudget' component={AddBudget} />
  //         <Route exact path='/budgets/:budgetId/adduser' component={AddBudgetUser} />
  //         <Route path='/budgets/:budgetId' component={BudgetDetailsContainer} />
  //         <Route path='/settings' component={UserSettings} />
  //       </Switch>
  //     </Container>
  //   </>
  // )
  return (
    <Div100vh>
      <Snackbar open={toastState.isOpen} autoHideDuration={6000} onClose={onCloseToast}>
        <Alert onClose={onCloseToast} severity={toastState.type} sx={{ width: '100%' }}>
          {toastState.message}
        </Alert>
      </Snackbar>
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
