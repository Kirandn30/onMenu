import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom"
import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material/styles';

import App from './app/app';
import store from './redux/store';

export const theme = createTheme({
  palette: {
    // type: 'light',
    primary: {
      main: '#0094FF',
    },
    secondary: {
      main: '#ff002e',
    },
    error: {
      main: '#c62828',
    },
    text: {
      secondary: 'rgba(249,249,249,0.54)',
    },
    background: {
      default: '#FBFAF8',
    },
    info: {
      main: "#167AF9",
    }
  },

  typography: {
    h3: {
      fontFamily: '',
    },
    h4: {
      fontFamily: 'Poppins',
    },
    h5: {
      fontFamily: 'Poppins',
    },
    h6: {
      fontFamily: 'Poppins',
    },
    subtitle1: {
      fontFamily: 'Poppins',
    },
    subtitle2: {
      fontFamily: 'Poppins',
    },
    body1: {
      fontFamily: 'Poppins',
    },
    body2: {
      fontFamily: 'Poppins',
    },
    button: {
      fontFamily: 'Poppins',
    },
    caption: {
      fontFamily: 'Poppins',
    },
    overline: {
      fontFamily: 'Poppins',
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <StrictMode>
  <BrowserRouter>
    <ThemeProvider theme={theme} >
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </BrowserRouter>
  /* </StrictMode> */
);
