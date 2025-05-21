import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const MOCK_RESERVAS = [
  {
    id: 1,
    parqueadero: 'Parqueadero Centro',
    fecha: '2024-06-10 08:00',
    vehiculo: 'ABC123',
    estado: 'Aprobada',
  },
  {
    id: 2,
    parqueadero: 'Parqueadero Norte',
    fecha: '2024-06-12 14:30',
    vehiculo: 'XYZ789',
    estado: 'No aprobada',
  },
  {
    id: 3,
    parqueadero: 'Parqueadero Sur',
    fecha: '2024-06-15 10:00',
    vehiculo: 'ABC123',
    estado: 'Aprobada',
  },
];

const estados = [
  { label: 'Todas', value: 'todas' },
  { label: 'Aprobadas', value: 'Aprobada' },
  { label: 'No aprobadas', value: 'No aprobada' },
];

const Reservas = () => {
  const [tab, setTab] = useState('todas');

  const reservasFiltradas =
    tab === 'todas'
      ? MOCK_RESERVAS
      : MOCK_RESERVAS.filter((r) => r.estado === tab);

  return (
    <Box sx={{ bgcolor: '#f0f4fa', minHeight: '100vh', py: 6, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 1100, borderRadius: 4, p: { xs: 2, sm: 4, md: 6 }, boxShadow: '0 8px 32px rgba(43,108,163,0.10)', bgcolor: '#fff' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#3498f3', mb: 2 }}>
          Mis Reservas
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 4 }}
          textColor="primary"
          indicatorColor="primary"
        >
          {estados.map((e) => (
            <Tab key={e.value} label={e.label} value={e.value} />
          ))}
        </Tabs>
        <Grid container spacing={4}>
          {reservasFiltradas.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary" align="center">
                No tienes reservas en este estado.
              </Typography>
            </Grid>
          ) : (
            reservasFiltradas.map((reserva) => (
              <Grid item xs={12} md={6} key={reserva.id}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(52,152,243,0.10)', p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ background: 'linear-gradient(135deg, #3498f3 0%, #6ec1ff 100%)', width: 54, height: 54, color: '#fff', fontSize: 32, boxShadow: '0 2px 8px rgba(52,152,243,0.10)' }}>
                    <LocalParkingIcon />
                  </Avatar>
                  <CardContent sx={{ flex: 1, p: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{reserva.parqueadero}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      <EventAvailableIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> {reserva.fecha}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <DirectionsCarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Vehículo: {reserva.vehiculo}
                    </Typography>
                  </CardContent>
                  <Chip
                    label={reserva.estado}
                    color={reserva.estado === 'Aprobada' ? 'success' : 'warning'}
                    icon={reserva.estado === 'Aprobada' ? <CheckCircleIcon /> : <CancelIcon />}
                    sx={{ fontWeight: 700, fontSize: '1rem', px: 1.5, borderRadius: 2 }}
                  />
                  <Button variant="outlined" disabled sx={{ ml: 2, borderRadius: 2 }}>
                    Ver detalles
                  </Button>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Reservas; 