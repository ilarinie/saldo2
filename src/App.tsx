import { Snackbar } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import Div100vh from 'react-div-100vh';
import { RootContext } from './state/RootContext';
import { Dashboard } from './views/Dashboard/Dashboard';
import LoginView from './views/Login';

export const App = observer(() => {
  const rootState = useContext(RootContext);

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
      {rootState.loginState === 'LOGGED_IN' && <Dashboard />}
    </Div100vh>
  );
});

export default App;
