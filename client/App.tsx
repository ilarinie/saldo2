import { Container } from '@mui/material'
import { useState } from 'react'
import Div100vh from 'react-div-100vh'
import { useSelector } from 'react-redux'
import { Route, Switch, useHistory } from 'react-router'
import { AppBar, SideBar } from './components'
import { useCheckLoginStatus } from './hooks/useCheckLoginStatus'
import { selectCurrentUser } from './store/authSlice'
import { AddBudget } from './views/AddBudget/AddBudget'
import { AddBudgetUser } from './views/AddBudgetUser/AddBudgetUser'
import { AddPurchase } from './views/AddPurchase/AddPurchase'
import { BudgetDetailsContainer } from './views/BudgetDetails/BudgetDetailsContainer'
import { BudgetReport } from './views/BudgetReport/BudgetReport'
import { Dashboard } from './views/Dashboard/Dashboard'
import LoginView from './views/Login'
import { PurchaseList } from './views/PurchaseList/PurchaseList'

export const App = () => {
  const loginStatus = useCheckLoginStatus()
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
      {loginStatus !== 'LOGGED_IN' && <LoginView />}
      {loginStatus === 'LOGGED_IN' && (
        <Container maxWidth='lg'>
          <SideBar drawerOpen={drawerOpen} doNavigate={doNavigate} setDrawerOpen={setDrawerOpen} />
          <AppBar setDrawerOpen={setDrawerOpen} isDrawerOpen={drawerOpen} currentUser={currentUser} />
          <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route path='/addbudget' component={AddBudget} />
            <Route path='/budgets/:budgetId/adduser' component={AddBudgetUser} />
            <Route path='/budgets/:budgetId/addpurchase' component={AddPurchase} />
            <Route path='/budgets/:budgetId/report' component={BudgetReport} />
            <Route path='/budgets/:budgetId/purchaselist' component={PurchaseList} />
            <Route path='/budgets/:budgetId' component={BudgetDetailsContainer} />
          </Switch>
        </Container>
      )}
    </Div100vh>
  )
}

export default App
