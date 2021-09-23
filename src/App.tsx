import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  SwipeableDrawer,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import Div100vh from 'react-div-100vh';
import { Route, Switch, useHistory } from 'react-router';
import { RootContext } from './state/RootContext';
import { AddBudget } from './views/AddBudget/AddBudget';
import { AddBudgetUser } from './views/AddBudgetUser/AddBudgetUser';
import { BudgetReport } from './views/BudgetReport/BudgetReport';
import { Dashboard } from './views/Dashboard/Dashboard';
import LoginView from './views/Login';

export const App = observer(() => {
  const rootState = useContext(RootContext);
  const history = useHistory();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const doNavigate = (path: string) => {
    history.push(path);
    setDrawerOpen(false);
  };

  return (
    <Div100vh>
      <Snackbar
        open={rootState.snackBarOpen}
        autoHideDuration={6000}
        onClose={rootState.closeSnackbar}
        message={rootState.snackBarMessage.message}
      />
      {rootState.loginState === 'PENDING' && <div>loading</div>}
      {rootState.loginState === 'UNAUTHORIZED' && <LoginView />}
      {rootState.loginState === 'LOGGED_IN' && (
        <Container maxWidth='lg'>
          <SwipeableDrawer
            onOpen={() => setDrawerOpen(true)}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            anchor='right'
          >
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
            </List>
          </SwipeableDrawer>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='h2' gutterBottom>
              Saldo
            </Typography>
            <IconButton
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ marginBottom: '17px' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route path='/addbudget' component={AddBudget} />
            <Route
              path='/budgets/:budgetId/adduser'
              component={AddBudgetUser}
            />
            <Route path='/budgets/:budgetId/report' component={BudgetReport} />
          </Switch>
        </Container>
      )}
    </Div100vh>
  );
});

export default App;
