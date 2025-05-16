import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import SolicitudesPanel from '../../components/solicitudes/SolicitudesPanel';

const Solicitudes = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 2 }}>
          <SolicitudesPanel />
        </Box>
      </Paper>
    </Container>
  );
};

export default Solicitudes; 