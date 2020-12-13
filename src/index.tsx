import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from "@chakra-ui/react"
import theme from './theme';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { RootContext, rootState } from './state/RootContext';



ReactDOM.render(
  <React.StrictMode>
    <RootContext.Provider value={rootState}>
      <ChakraProvider theme={theme}>
        <Router>
          <Route component={App} />
        </Router>
      </ChakraProvider>
    </RootContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
