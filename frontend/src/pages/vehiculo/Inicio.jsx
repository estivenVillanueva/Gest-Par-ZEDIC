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
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

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
      <Box sx={{ mt: 6, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 1100 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2B6CA3', textAlign: 'center', mb: 4 }}>
            Parqueaderos Disponibles para Reservar
          </Typography>
          <Grid container spacing={5} justifyContent="center">
            {parqueaderosDisponibles.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 24px rgba(43,108,163,0.10)',
                  p: 0,
                  bgcolor: '#fff',
                  minHeight: 340,
                  width: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 2,
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 8px 32px rgba(43,108,163,0.18)' }
                }}>
                  <Box sx={{ mt: 4, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{
                      bgcolor: '#2B6CA3',
                      borderRadius: 2,
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1
                    }}>
                      <LocalParkingIcon sx={{ fontSize: 38, color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>{p.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} /> {p.direccion}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '90%', mb: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 18, mr: 0.5, color: '#43a047' }} /> {p.telefono}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <EmailIcon sx={{ fontSize: 18, mr: 0.5, color: '#e53935' }} /> {p.email}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PeopleIcon sx={{ fontSize: 18, mr: 0.5, color: '#fbc02d' }} /> Capacidad: {p.capacidad}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5, color: '#1976d2' }} /> Horarios: {p.horarios}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventAvailableIcon sx={{ fontSize: 18, mr: 0.5, color: '#43a047' }} /> Servicios: {p.servicios.join(', ')}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<EventAvailableIcon />}
                    sx={{ mb: 3, bgcolor: '#2B6CA3', borderRadius: 2, fontWeight: 600, width: '85%', '&:hover': { bgcolor: '#1976d2' } }}
                    onClick={() => handleReservar(p)}
                  >
                    Reservar
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Sección: Parqueaderos Reservados */}
      <Box sx={{ mt: 6, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 1100 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2B6CA3', textAlign: 'center', mb: 4 }}>
            Mis Parqueaderos Reservados
          </Typography>
          <Grid container spacing={5} justifyContent="center">
            {parqueaderosReservados.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No tienes parqueaderos reservados.
                </Typography>
              </Grid>
            ) : (
              parqueaderosReservados.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 24px rgba(43,108,163,0.10)',
                    p: 0,
                    bgcolor: '#fff',
                    minHeight: 340,
                    width: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 2,
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 8px 32px rgba(43,108,163,0.18)' }
                  }}>
                    <Box sx={{ mt: 4, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box sx={{
                        bgcolor: '#2B6CA3',
                        borderRadius: 2,
                        width: 64,
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1
                      }}>
                        <LocalParkingIcon sx={{ fontSize: 38, color: '#fff' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>{p.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} /> {p.direccion}
                      </Typography>
                    </Box>
                    <Box sx={{ width: '90%', mb: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 18, mr: 0.5, color: '#43a047' }} /> {p.telefono}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 18, mr: 0.5, color: '#e53935' }} /> {p.email}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PeopleIcon sx={{ fontSize: 18, mr: 0.5, color: '#fbc02d' }} /> Capacidad: {p.capacidad}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5, color: '#1976d2' }} /> Horarios: {p.horarios}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EventAvailableIcon sx={{ fontSize: 18, mr: 0.5, color: '#43a047' }} /> Servicios: {p.servicios.join(', ')}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Inicio; 