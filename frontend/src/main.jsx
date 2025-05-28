import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '../logic/AuthContext';
import { VehiculoProvider } from '../logic/VehiculoContext';
import AppRoutes from '../logic/routes.index.jsx';
import theme from './theme';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log('Google Client ID:', clientId);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <VehiculoProvider>
              <AppRoutes />
            </VehiculoProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
) 