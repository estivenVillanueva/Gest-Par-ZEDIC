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

const DashboardLayout = () => {
  const location = useLocation();

  const navigationItems = [
    { text: 'Vehiculos', path: '/dashboard/vehiculos', icon: <DirectionsCarIcon /> },
    { text: 'Pagos', path: '/dashboard/pagos', icon: <PaymentIcon /> },
    { text: 'Reportes', path: '/dashboard/reportes', icon: <AssessmentIcon /> },
    { text: 'Solicitudes', path: '/dashboard/solicitudes', icon: <ListAltIcon /> },
    { text: 'Ingresos de vehiculos', path: '/dashboard/ingresos', icon: <LoginIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#2B6CA3' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ mr: 2 }}>
              <Logo />
            </Box>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              M.C.K.A.Z
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(location.pathname === item.path && {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontWeight: 'bold',
                  }),
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          <Avatar sx={{ ml: 2, bgcolor: '#1a4971' }}>U</Avatar>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Container maxWidth={false} sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 3, bgcolor: '#f5f5f5' }}>
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 | Tema de parqueadero M.C.K.A.Z
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout; 