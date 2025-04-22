import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import InfoPanel from '../../components/parqueadero/InfoPanel';
import ServiciosPanel from '../../components/parqueadero/ServiciosPanel';
import InfoAdicional from '../../components/parqueadero/InfoAdicional';

const Parqueadero = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 2 }}>
          <InfoPanel />
          <ServiciosPanel />
        </Box>
      </Paper>
      <InfoAdicional />
    </Container>
  );
};

export default Parqueadero; 