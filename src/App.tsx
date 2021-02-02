import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import Div100vh from 'react-div-100vh';
import { Notifications } from 'react-push-notification';
import { useHistory } from 'react-router-dom';
import './App.scss';
import { LoadingScreen } from './components';
import { RootContext } from './state/RootContext';
import LoginView from './views/Login';
import { NewDashboard } from './views/NewDashboard/NewDashboard';

export const App = observer(() => {
  const rootState = useContext(RootContext);
  const history = useHistory();

  return (
    <Div100vh>
      <Notifications />
      {rootState.loginState === 'PENDING' && <LoadingScreen />}
      {rootState.loginState === 'UNAUTHORIZED' && <LoginView />}
      {rootState.loginState === 'LOGGED_IN' && <NewDashboard />}
    </Div100vh>
  );
});

export default App;
