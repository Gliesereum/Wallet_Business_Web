import './styles/base.scss';
import 'animate.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from './state';
import { history } from './utils';
import App from './App';
// import openSocket from 'socket.io-client';

// const socket = openSocket(
// 'http://localhost:8080',
// { transports: ['websocket'] }
// );

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
