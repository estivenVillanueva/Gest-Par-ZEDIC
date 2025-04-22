import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const InfoPanel = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Avatar
          sx={{ width: 150, height: 150, bgcolor: 'primary.main' }}
          alt="Logo parqueadero"
        >
          Logo parqueadero
        </Avatar>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          La nombre del parqueadero
        </Typography>
        <Button
          variant="contained"
          startIcon={<InfoIcon />}
          fullWidth
          sx={{ mb: 2 }}
        >
          ver info
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          La dirección del parqueadero
        </Typography>
        <Button
          variant="contained"
          startIcon={<InfoIcon />}
          fullWidth
          sx={{ mb: 2 }}
        >
          ver info
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          La capacidad del parqueadero
        </Typography>
        <Button
          variant="contained"
          startIcon={<InfoIcon />}
          fullWidth
          sx={{ mb: 2 }}
        >
          ver info
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Los horarios de operación del parqueadero
        </Typography>
        <Button
          variant="contained"
          startIcon={<InfoIcon />}
          fullWidth
          sx={{ mb: 2 }}
        >
          ver info
        </Button>
      </Box>
    </Box>
  );
};

export default InfoPanel; 