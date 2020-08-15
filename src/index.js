import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

import App from './App';

// Global Theme
const theme = createMuiTheme({
  palette: {
    background: {
      default: '#F7F7F7',
    },
    primary: { 500: '#FFFFFF' },
    secondary: { main: '#F4EFA8' },
  },
});

ReactDOM.render(
  <SnackbarProvider>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </SnackbarProvider>,
  document.getElementById('root')
);
