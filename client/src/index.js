import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import strings from './Localization.js'
import { SnackbarProvider } from 'notistack';
strings.setLanguage('fi');

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3} variant="success">
      <App />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

