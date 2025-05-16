import React from 'react';
import VehiculoHeader from './VehiculoHeader';
import { Box, Toolbar } from '@mui/material';

const VehiculoLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <VehiculoHeader />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: '100vh',
          bgcolor: '#f5f5f7',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default VehiculoLayout; 