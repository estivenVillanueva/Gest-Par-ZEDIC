import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  CalendarMonth as CalendarIcon,
  Payment as PaymentIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: '12px',
            p: 1,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const mockParqueaderosDisponibles = [
  {
    id: 1,
    nombre: 'Parqueadero Centro',
    telefono: '3001234567',
    direccion: 'Calle 10 #5-20',
    email: 'centro@parqueaderos.com',
    capacidad: 50,
    horarios: '6:00am - 10:00pm',
    servicios: ['Mensual', 'Diario', 'Quincenal', 'Semanal'],
  },
  {
    id: 2,
    nombre: 'Parqueadero Norte',
    telefono: '3019876543',
    direccion: 'Av. Norte #100-50',
    email: 'norte@parqueaderos.com',
    capacidad: 30,
    horarios: '24 horas',
    servicios: ['Mensual', 'Diario'],
  },
];

const mockParqueaderosReservados = [
  {
    id: 3,
    nombre: 'Parqueadero Sur',
    telefono: '3025558888',
    direccion: 'Cra 20 #15-30',
    email: 'sur@parqueaderos.com',
    capacidad: 40,
    horarios: '7:00am - 9:00pm',
    servicios: ['Mensual', 'Semanal'],
  },
];

const Inicio = () => {
  const navigate = useNavigate();
  const [parqueaderosDisponibles] = useState(mockParqueaderosDisponibles);
  const [parqueaderosReservados] = useState(mockParqueaderosReservados);

  const handleReservar = (parqueadero) => {
    alert(`Reservar en: ${parqueadero.nombre}`);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bienvenido a tu Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona tus vehículos y reservas de parqueadero
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mis Vehículos"
            value="2"
            icon={<CarIcon sx={{ color: '#2B6CA3' }} />}
            color="#2B6CA3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reservas Activas"
            value="1"
            icon={<CalendarIcon sx={{ color: '#4CAF50' }} />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pagos Pendientes"
            value="$0"
            icon={<PaymentIcon sx={{ color: '#FF9800' }} />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/vehiculo/mis-vehiculos')}
                sx={{ bgcolor: '#2B6CA3', '&:hover': { bgcolor: '#1e4d6e' } }}
              >
                Agregar Vehículo
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Próximas Reservas"
              action={
                <IconButton onClick={() => navigate('/vehiculo/reservas')}>
                  <CalendarIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No tienes reservas programadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Últimos Pagos"
              action={
                <IconButton onClick={() => navigate('/vehiculo/pagos')}>
                  <PaymentIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No hay pagos recientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sección: Parqueaderos Disponibles */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Parqueaderos Disponibles para Reservar
        </Typography>
        <Grid container spacing={3}>
          {parqueaderosDisponibles.map((p) => (
            <Grid item xs={12} md={6} key={p.id}>
              <Card>
                <CardHeader title={p.nombre} subheader={p.direccion} />
                <CardContent>
                  <Typography variant="body2"><b>Teléfono:</b> {p.telefono}</Typography>
                  <Typography variant="body2"><b>Email:</b> {p.email}</Typography>
                  <Typography variant="body2"><b>Capacidad:</b> {p.capacidad}</Typography>
                  <Typography variant="body2"><b>Horarios:</b> {p.horarios}</Typography>
                  <Typography variant="body2"><b>Servicios:</b> {p.servicios.join(', ')}</Typography>
                  <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleReservar(p)}>
                    Reservar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Sección: Parqueaderos Reservados */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Mis Parqueaderos Reservados
        </Typography>
        <Grid container spacing={3}>
          {parqueaderosReservados.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                No tienes parqueaderos reservados.
              </Typography>
            </Grid>
          ) : (
            parqueaderosReservados.map((p) => (
              <Grid item xs={12} md={6} key={p.id}>
                <Card>
                  <CardHeader title={p.nombre} subheader={p.direccion} />
                  <CardContent>
                    <Typography variant="body2"><b>Teléfono:</b> {p.telefono}</Typography>
                    <Typography variant="body2"><b>Email:</b> {p.email}</Typography>
                    <Typography variant="body2"><b>Capacidad:</b> {p.capacidad}</Typography>
                    <Typography variant="body2"><b>Horarios:</b> {p.horarios}</Typography>
                    <Typography variant="body2"><b>Servicios:</b> {p.servicios.join(', ')}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Inicio; 