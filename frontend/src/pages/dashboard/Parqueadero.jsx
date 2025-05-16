import React from 'react';
import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const adminSections = [
  {
    title: 'Vehículos',
    description: 'Gestiona los vehículos registrados en el parqueadero.',
    path: '/dashboard/vehiculos',
  },
  {
    title: 'Pagos',
    description: 'Revisa y administra los pagos realizados.',
    path: '/dashboard/pagos',
  },
  {
    title: 'Reportes',
    description: 'Visualiza reportes de uso y actividad.',
    path: '/dashboard/reportes',
  },
  {
    title: 'Solicitudes',
    description: 'Gestiona las solicitudes de los usuarios.',
    path: '/dashboard/solicitudes',
  },
];

const Parqueadero = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Panel de Administrador de Parqueadero
      </Typography>
      <Grid container spacing={3}>
        {adminSections.map((section) => (
          <Grid item xs={12} sm={6} md={3} key={section.title}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight={600} mb={1}>{section.title}</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>{section.description}</Typography>
              <Button component={Link} to={section.path} variant="contained" color="primary">
                Ir a {section.title}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Parqueadero; 