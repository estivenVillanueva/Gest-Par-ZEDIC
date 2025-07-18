import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Avatar,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentIcon from '@mui/icons-material/Payment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LoginIcon from '@mui/icons-material/Login';
import Logo from '../../assets/logo';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = () => {
  const location = useLocation();

  const navigationItems = [
    { text: 'Vehiculos', path: '/dashboard/vehiculos', icon: <DirectionsCarIcon /> },
    { text: 'Facturas', path: '/dashboard/pagos', icon: <PaymentIcon /> },
    { text: 'Reportes', path: '/dashboard/reportes', icon: <AssessmentIcon /> },
    { text: 'Solicitudes', path: '/dashboard/solicitudes', icon: <ListAltIcon /> },
    { text: 'Ingresos de parqueaderos', path: '/dashboard/ingresos', icon: <LoginIcon /> },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#F8FAFC'
    }}>
      <DashboardHeader />
      <Box sx={{ 
        p: { xs: 2, sm: 3 }
      }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 