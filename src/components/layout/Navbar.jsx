import React from 'react';
import { AppBar, Toolbar, Button, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaymentIcon from '@mui/icons-material/Payment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#2563EB',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem 1rem',
});

const NavButton = styled(Button)({
  color: '#ffffff',
  textTransform: 'none',
  fontSize: '0.95rem',
  padding: '0.5rem 1rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

const Logo = styled(Link)({
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const Navbar = () => {
  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        <Logo to="/dashboard">
          <DirectionsCarIcon sx={{ fontSize: '2rem' }} />
          M.C.K.A.Z
        </Logo>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <NavButton
            component={Link}
            to="/dashboard/vehiculos"
            startIcon={<DirectionsCarIcon />}
          >
            Vehículos
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
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            component={Link}
            to="/dashboard/perfil"
            sx={{ color: '#ffffff' }}
            title="Perfil del Parqueadero"
          >
            <AccountCircleIcon />
          </IconButton>
          
          <IconButton
            sx={{ color: '#ffffff' }}
            title="Cerrar Sesión"
          >
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar; 