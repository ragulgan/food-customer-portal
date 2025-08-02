import * as React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AppRoutes from "./AppRoutes";
import { store } from './reduxState/store'
import { Provider } from 'react-redux';
import { red, deepOrange, lightBlue, green, orange, amber } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: orange[600],
      main: orange[700],
      dark: orange[800],
      contrastText: orange[50]
    },
    secondary: {
      light: amber[700],
      main: amber[800],
      dark: amber[900],
      contrastText: amber[50]
    },
    error: {
      light: red[700],
      main: red[800],
      dark: red[900],
      contrastText: red[50]
    },
    warning: {
      light: deepOrange[700],
      main: deepOrange[800],
      dark: deepOrange[900],
      contrastText: deepOrange[50]
    },
    info: {
      light: lightBlue[700],
      main: lightBlue[800],
      dark: lightBlue[900],
      contrastText: lightBlue[50]
    },
    success: {
      light: green[700],
      main: green[800],
      dark: green[900],
      contrastText: green[50]
    }
  },
});

const App: React.FC<any> = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
  </ThemeProvider >
  );
}

export default App;
