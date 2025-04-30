import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Tooltip,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentIcon from '@mui/icons-material/Payment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import { StyledAppBar, StyledToolbar, NavButton, LogoButton } from '../../styles/components/Navbar.styles';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Aquí se implementaría la lógica de cierre de sesión
    handleClose();
    navigate('/acceder');
  };

  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LogoButton
            component={Link}
            to="/dashboard/parqueadero"
            sx={{ mr: 2 }}
          >
            M.C.K.A.Z
          </LogoButton>

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

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Gestión del Parqueadero">
            <IconButton
              onClick={handleClick}
              sx={{ color: '#ffffff' }}
            >
              <Avatar
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
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1,
              width: 220,
            }
          }}
        >
          <MenuItem component={Link} to="/dashboard/perfil">
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Ver Perfil" secondary="Información del parqueadero" />
          </MenuItem>

          <MenuItem component={Link} to="/dashboard/perfil">
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Editar Perfil" secondary="Modificar datos del parqueadero" />
          </MenuItem>

          <MenuItem component={Link} to="/dashboard/perfil">
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Configuración" secondary="Ajustes del parqueadero" />
          </MenuItem>

          <Divider />
          
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Cerrar Sesión</ListItemText>
          </MenuItem>
        </Menu>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar; 