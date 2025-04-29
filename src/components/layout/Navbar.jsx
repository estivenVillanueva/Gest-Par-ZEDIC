import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Tooltip,
  Button,
  Avatar,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentIcon from '@mui/icons-material/Payment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import { StyledAppBar, StyledToolbar, NavButton, LogoButton } from '../../styles/components/Navbar.styles';

const Navbar = () => {
  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LogoButton
            component={Link}
            to="/dashboard/perfil"
            sx={{ mr: 2 }}
          >
            M.C.K.A.Z
          </LogoButton>

          <NavButton
            component={Link}
            to="/dashboard/vehiculos"
            startIcon={<DirectionsCarIcon />}
          >
            Vehiculos
          </NavButton>

          <NavButton
            component={Link}
            to="/dashboard/pagos"
            startIcon={<PaymentIcon />}
          >
            Pagos
          </NavButton>

          <NavButton
            component={Link}
            to="/dashboard/reportes"
            startIcon={<AssessmentIcon />}
          >
            Reportes
          </NavButton>

          <NavButton
            component={Link}
            to="/dashboard/solicitudes"
            startIcon={<ListAltIcon />}
          >
            Solicitudes
          </NavButton>

          <NavButton
            component={Link}
            to="/dashboard/ingresos"
            startIcon={<LoginIcon />}
          >
            Ingresos de parqueaderos
          </NavButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Perfil del Parqueadero">
            <IconButton
              component={Link}
              to="/dashboard/perfil"
              sx={{ color: '#ffffff' }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Perfil del Parqueadero">
            <Avatar
              component={Link}
              to="/dashboard/perfil"
              sx={{ 
                width: 35, 
                height: 35, 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              U
            </Avatar>
          </Tooltip>
          
          <Tooltip title="Cerrar Sesión">
            <IconButton
              sx={{ color: '#ffffff' }}
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar; 