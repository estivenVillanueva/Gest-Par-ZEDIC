import React from 'react';
import VehiculoHeader from './VehiculoHeader';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';

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
        <Outlet />
      </Box>
    </Box>
  );
};

export default VehiculoLayout; 