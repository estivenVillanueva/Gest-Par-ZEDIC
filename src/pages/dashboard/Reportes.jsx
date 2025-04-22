import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Reportes = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
        Reportes
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, borderRadius: '12px' }}>
          {/* Aquí irá el contenido de los reportes */}
          <Typography>
            Contenido de los reportes
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Reportes; 