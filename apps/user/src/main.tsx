import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router-dom';


export const theme = createTheme({
  palette: {
    // type: 'light',
    primary: {
      main: '#4285F4',
    },
    secondary: {
      main: '#ff002e',
    },
    error: {
      main: '#FF3B30',
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
      fontFamily: "Poppins",
    },
    h4: {
      fontFamily: "Poppins",
    },
    h5: {
      fontFamily: "Poppins",
    },
    h6: {
      fontFamily: "Poppins",
    },
    subtitle1: {
      fontFamily: "Poppins",
    },
    subtitle2: {
      fontFamily: "Poppins",
    },
    body1: {
      fontFamily: "Poppins",
    },
    body2: {
      fontFamily: "Poppins",
    },
    button: {
      fontFamily: "Poppins",
    },
    caption: {
      fontFamily: "Poppins",
    },
    overline: {
      fontFamily: "Poppins",
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme} >
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </BrowserRouter>

  </StrictMode>
);
