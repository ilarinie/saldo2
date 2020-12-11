import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from "@chakra-ui/react"
import { RootState } from './RootState';
import theme from './theme';

const rootState = new RootState();

export const RootContext = createContext<RootState>(rootState);

ReactDOM.render(
  <React.StrictMode>
    <RootContext.Provider value={rootState}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
    </RootContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
