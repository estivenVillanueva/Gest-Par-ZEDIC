// Dependencias de React y paquetes externos
import React from 'react';
// import { BrowserRouter } from 'react-router-dom'; // Eliminado
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import AppRoutes from '../logic/routes.index';
// Importar estilos globales
import './styles/global.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <BrowserRouter> */}
        <AppRoutes />
      {/* </BrowserRouter> */}
    </ThemeProvider>
  );
}

export default App;