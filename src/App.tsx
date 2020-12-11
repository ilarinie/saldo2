import { PurchaseList } from './PurchaseList'
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import addNotification, { Notifications } from 'react-push-notification';
import { PurchaseCreator } from './PurchaseCreator/PurchaseCreator'
import { Purchase } from './models/Purchase';
import { Box, Flex, Input, Switch, Text } from '@chakra-ui/react';
import './App.scss';
import { RootState } from './RootState';
import { RootContext } from '.';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { Dashboard } from './Dashboard/Dashboard';
import Div100vh from 'react-div-100vh';

axios.defaults.headers.common = {
  Authorization: localStorage.getItem('token') || '',
};



const App = observer(() => {


  const rootState = useContext(RootContext);
  const [ dialogOpen, setDialogOpen ] = useState(false)

  const tryLogin = () => {
    //@ts-ignore
    const newKey = document.getElementById('key-input').value || '';
    localStorage.setItem('token', newKey);
    axios.defaults.headers.common = {
      Authorization: newKey || '',
    };

      rootState.fetchPurchases();

  }
  
  useEffect(() => {

      rootState.fetchPurchases();

  }, [rootState])

  return (
    <Div100vh>
      <Notifications />
      {rootState.loginState === 'UNAUTHORIZED' &&
        <Box>
          <h1>What's the word</h1>
          <Input type='text' id='key-input' />
          <button onClick={tryLogin}>press</button>
        </Box>
      }
      {rootState.loginState === 'LOGGED_IN' &&
      <> 
        
      {dialogOpen && <PurchaseCreator purchases={rootState.purchases} open={dialogOpen} onClose={() => setDialogOpen(false)} onPurchaseCreated={(purchase: Purchase) => {  }} /> }
      {!dialogOpen &&  <><Dashboard /><div onClick={() => setDialogOpen(true)} className='fab' aria-label="add">
          +
        </div></> }
      </>
      
      }
    </Div100vh>
  );
});

export default App;
