import { useContext, lazy, Suspense } from 'react';
import  { Notifications } from 'react-push-notification';
import './App.scss';
import { RootContext } from './state/RootContext';
import { observer } from 'mobx-react-lite';
import Div100vh from 'react-div-100vh';
import LoginView from './views/Login';
import {
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { Fab, LoadingScreen }  from './components';

import  Dashboard from './views/Dashboard';
import  PurchaseCreator from './views/PurchaseCreator';

export const App = observer(() => {

  const rootState = useContext(RootContext);
  const history = useHistory();

  return (
    <Div100vh>
      <Notifications />
      {rootState.loginState === 'PENDING' && 
        <LoadingScreen />
      }
      {rootState.loginState === 'UNAUTHORIZED' &&
        <LoginView />
      }
      {rootState.loginState === 'LOGGED_IN' &&
        <>
          <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route path='/create' component={PurchaseCreator} />
          </Switch>
          <Fab onClick={() => history.push('/create')} />
        </>
      }
    </Div100vh>
  );
});

export default App;
