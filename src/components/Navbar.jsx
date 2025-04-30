import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';

const Navbar = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button
        component={Link}
        to="/"
        sx={{ 
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
        }}
      >
        Inicio
      </Button>
      <Button
        component={Link}
        to="/servicios"
        sx={{ 
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
        }}
      >
        Servicios
      </Button>
      <Button
        component={Link}
        to="/contacto"
        sx={{ 
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
        }}
      >
        Contacto
      </Button>
    </Box>
  );
};

export default Navbar; 