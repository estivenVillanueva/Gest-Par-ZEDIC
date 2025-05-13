import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaymentIcon from '@mui/icons-material/Payment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import safeparkingLogo from '../../assets/safeparking.png';
import { useAuth } from '../../context/AuthContext';

const navigationItems = [
  { 
    label: 'Vehículos', 
    path: '/dashboard/vehiculos',
    icon: <DirectionsCarIcon />
  },
  { 
    label: 'Pagos', 
    path: '/dashboard/pagos',
    icon: <PaymentIcon />
  },
  { 
    label: 'Reportes', 
    path: '/dashboard/reportes',
    icon: <AssessmentIcon />
  },
  { 
    label: 'Ingresos', 
    path: '/dashboard/ingresos',
    icon: <LocalParkingIcon />
  }
];

const DashboardHeader = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      navigate('/acceder');
    } catch (error) {
      // Puedes mostrar un mensaje de error si lo deseas
    }
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', height: '70px' }}>
          {/* Logo y Título */}
          <Box 
            component={Link}
            to="/dashboard"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1
            }}
          >
          
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2B6CA3',
                fontWeight: 600,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Gest-Par ZEDIC
            </Typography>
          </Box>

          {/* Navegación Principal */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            alignItems: 'center',
            '& a': {
              textDecoration: 'none'
            }
          }}>
            {navigationItems.map((item) => (
              <Box
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? '#2B6CA3' : '#64748B',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(43, 108, 163, 0.08)',
                    color: '#2B6CA3'
                  }
                }}
              >
                {item.icon}
                <Typography sx={{ fontWeight: 500 }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Acciones Rápidas */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notificaciones */}
            <Tooltip title="Notificaciones">
              <IconButton 
                onClick={handleNotificationsClick}
                sx={{ color: '#64748B' }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Menú de Usuario */}
            <Tooltip title="Configuración">
              <IconButton
                onClick={handleProfileClick}
                sx={{ 
                  padding: 0.5,
                  border: '2px solid rgba(43, 108, 163, 0.1)',
                  '&:hover': {
                    border: '2px solid rgba(43, 108, 163, 0.2)',
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 35, 
                    height: 35,
                    backgroundColor: '#2B6CA3'
                  }}
                >
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Menú de Notificaciones */}
          <Menu
            anchorEl={notificationsAnchor}
            open={Boolean(notificationsAnchor)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: '300px',
                mt: 1.5,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Typography sx={{ p: 2, fontWeight: 600 }}>
              Notificaciones
            </Typography>
            <Divider />
            <MenuItem onClick={handleClose}>
              Nuevo vehículo registrado
            </MenuItem>
            <MenuItem onClick={handleClose}>
              Pago pendiente
            </MenuItem>
            <MenuItem onClick={handleClose}>
              Actualización del sistema
            </MenuItem>
          </Menu>

          {/* Menú de Usuario */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: '200px',
                mt: 1.5,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <MenuItem component={Link} to="/dashboard/perfil" onClick={handleClose}>
              <PersonIcon sx={{ mr: 1 }} /> Perfil
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={handleLogout}
              sx={{ color: 'error.main' }}
            >
              <ExitToAppIcon sx={{ mr: 1 }} /> Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DashboardHeader; 