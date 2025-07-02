import React, { useState } from 'react';
import {
  Typography,
  Box,
  IconButton,
  List,
  ListItemText,
  Zoom,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  StyledFab,
  DrawerHeader,
  StyledDrawer,
  StyledListItem,
  StyledListItemIcon,
} from '../../styles/components/HistorialVistas.styles';

const HistorialVistas = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Simulamos un historial de vistas (en una aplicación real, esto vendría de un estado global o localStorage)
  const getIconForPath = (path) => {
    switch (path) {
      case '/':
        return <HomeIcon />;
      case '/acceder':
        return <AccountCircleIcon />;
      case '/dashboard/vehiculos':
        return <DirectionsCarIcon />;
      case '/dashboard/reportes':
        return <AssessmentIcon />;
      default:
        return <HistoryIcon />;
    }
  };

  const getNameForPath = (path) => {
    switch (path) {
      case '/':
        return 'Inicio';
      case '/acceder':
        return 'Acceder';
      case '/dashboard/vehiculos':
        return 'Vehículos';
      case '/dashboard/reportes':
        return 'Reportes';
      case '/dashboard/solicitudes':
        return 'Solicitudes';
      case '/dashboard/ingresos':
        return 'Ingresos de parqueaderos';
      default:
        return path;
    }
  };

  // En una aplicación real, esto vendría de un estado global o localStorage
  const historialVistas = [
    location.pathname,
    '/dashboard/vehiculos',
    '/dashboard/reportes',
    '/acceder',
    '/'
  ].filter((path, index, self) => self.indexOf(path) === index).slice(0, 5);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <StyledDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <DrawerHeader>
          <Typography variant="h6">
            Últimas vistas
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        <List>
          {historialVistas.map((path, index) => (
            <StyledListItem
              button
              key={index}
              onClick={() => handleNavigate(path)}
              selected={location.pathname === path}
            >
              <StyledListItemIcon>
                {getIconForPath(path)}
              </StyledListItemIcon>
              <ListItemText 
                primary={getNameForPath(path)}
                secondary={index === 0 ? 'Visitado actualmente' : 'Visitado recientemente'}
              />
            </StyledListItem>
          ))}
        </List>
      </StyledDrawer>
    </>
  );
};

export default HistorialVistas; 