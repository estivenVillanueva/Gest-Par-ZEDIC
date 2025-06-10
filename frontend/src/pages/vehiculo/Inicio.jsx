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
import {
  DashboardCard,
  DashboardCardIcon,
  DashboardCardTitle,
  DashboardCardValue,
  DashboardCardButton
} from '../../styles/components/DashboardCard.styles';

const StatCard = ({ title, value, icon, button, onButtonClick }) => (
  <DashboardCard>
    <DashboardCardIcon>{icon}</DashboardCardIcon>
    <DashboardCardTitle>{title}</DashboardCardTitle>
    <DashboardCardValue>{value}</DashboardCardValue>
    {button && (
      <DashboardCardButton startIcon={button.icon} onClick={onButtonClick}>
        {button.label}
      </DashboardCardButton>
    )}
  </DashboardCard>
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
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#f0f4fa',
      py: { xs: 2, md: 6 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: { xs: 4, md: 7 },
    }}>
      {/* Cabecera Dashboard */}
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: 1200,
        borderRadius: 4,
        p: { xs: 2, sm: 4, md: 7 },
        boxShadow: '0 8px 32px rgba(43,108,163,0.10)',
        bgcolor: '#fff',
        mb: 0,
        position: 'relative',
      }}>
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#3498f3', mb: 1 }}>
            ¡Hola, Usuario! Bienvenido a tu Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Gestiona tus vehículos y reservas de parqueadero
          </Typography>
          <Box sx={{ width: '100%', borderBottom: '2px solid #e3eaf6', mb: 2 }} />
        </Box>
        <Grid container spacing={2} sx={{ mb: 0, justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Mis Vehículos"
              value="2"
              icon={<CarIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Reservas Activas"
              value="1"
              icon={<CalendarIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pagos Pendientes"
              value="$0"
              icon={<PaymentIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title=""
              value=""
              icon={<AddIcon />}
              button={{ label: 'Agregar Vehículo', icon: <AddIcon /> }}
              onButtonClick={() => navigate('/vehiculo/mis-vehiculos')}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Próximas Reservas */}
      <Paper elevation={2} sx={{
        width: '100%',
        maxWidth: 1200,
        borderRadius: 3,
        p: { xs: 2, sm: 4, md: 5 },
        boxShadow: '0 4px 16px rgba(52,152,243,0.08)',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        alignItems: 'stretch',
      }}>
        <Box flex={1}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 12px rgba(52,152,243,0.06)' }}>
            <CardHeader
              title={<Typography variant="h6">Próximas Reservas</Typography>}
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
        </Box>
      </Paper>

      {/* Parqueaderos Disponibles */}
      <Paper elevation={2} sx={{
        width: '100%',
        maxWidth: 1200,
        borderRadius: 3,
        p: { xs: 2, sm: 4, md: 5 },
        boxShadow: '0 4px 16px rgba(52,152,243,0.08)',
        bgcolor: '#fff',
      }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2B6CA3', textAlign: 'center', mb: 4 }}>
            Parqueaderos Disponibles para Reservar
          </Typography>
          <Grid container spacing={{ xs: 3, md: 5 }} justifyContent="center" alignItems="stretch">
            {parqueaderosDisponibles.map((p) => (
              <Grid item xs={12} sm={8} md={5} lg={4} key={p.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(52,152,243,0.10)',
                  bgcolor: '#fff',
                  minHeight: 340,
                  width: 340,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 2,
                  p: 3,
                  mb: 2,
                  transition: 'box-shadow 0.25s, transform 0.18s',
                  '&:hover': { boxShadow: '0 16px 48px rgba(52,152,243,0.18)', transform: 'translateY(-4px) scale(1.02)' }
                }}>
                  <Box sx={{ mt: 1, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{
                      background: 'linear-gradient(135deg, #3498f3 0%, #6ec1ff 100%)',
                      borderRadius: '50%',
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      boxShadow: '0 2px 8px rgba(52,152,243,0.10)'
                    }}>
                      <LocalParkingIcon sx={{ fontSize: 34, color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 0.5 }}>{p.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} /> {p.direccion}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: '#43a047' }} /> {p.telefono}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <EmailIcon sx={{ fontSize: 16, mr: 0.5, color: '#e53935' }} /> {p.email}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PeopleIcon sx={{ fontSize: 16, mr: 0.5, color: '#fbc02d' }} /> Capacidad: {p.capacidad}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#1976d2' }} /> Horarios: {p.horarios}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventAvailableIcon sx={{ fontSize: 16, mr: 0.5, color: '#43a047' }} /> Servicios: {p.servicios.join(', ')}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<EventAvailableIcon />}
                    sx={{ mb: 1, borderRadius: 5, fontWeight: 600, width: '100%', bgcolor: '#3498f3', '&:hover': { bgcolor: '#2176bd' } }}
                    onClick={() => handleReservar(p)}
                  >
                    Reservar
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* Parqueaderos Reservados */}
      <Paper elevation={2} sx={{
        width: '100%',
        maxWidth: 1200,
        borderRadius: 3,
        p: { xs: 2, sm: 4, md: 5 },
        boxShadow: '0 4px 16px rgba(52,152,243,0.08)',
        bgcolor: '#fff',
      }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2B6CA3', textAlign: 'center', mb: 4 }}>
            Mis Parqueaderos Reservados
          </Typography>
          <Grid container spacing={{ xs: 3, md: 5 }} justifyContent="center" alignItems="stretch">
            {parqueaderosReservados.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No tienes parqueaderos reservados.
                </Typography>
              </Grid>
            ) : (
              parqueaderosReservados.map((p) => (
                <Grid item xs={12} sm={8} md={5} lg={4} key={p.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card sx={{
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(52,152,243,0.10)',
                    bgcolor: '#fff',
                    minHeight: 340,
                    width: 340,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 2,
                    p: 3,
                    mb: 2,
                    transition: 'box-shadow 0.25s, transform 0.18s',
                    '&:hover': { boxShadow: '0 16px 48px rgba(52,152,243,0.18)', transform: 'translateY(-4px) scale(1.02)' }
                  }}>
                    <Box sx={{ mt: 1, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #3498f3 0%, #6ec1ff 100%)',
                        borderRadius: '50%',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                        boxShadow: '0 2px 8px rgba(52,152,243,0.10)'
                      }}>
                        <LocalParkingIcon sx={{ fontSize: 34, color: '#fff' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 0.5 }}>{p.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} /> {p.direccion}
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', mb: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: '#43a047' }} /> {p.telefono}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 0.5, color: '#e53935' }} /> {p.email}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PeopleIcon sx={{ fontSize: 16, mr: 0.5, color: '#fbc02d' }} /> Capacidad: {p.capacidad}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#1976d2' }} /> Horarios: {p.horarios}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EventAvailableIcon sx={{ fontSize: 16, mr: 0.5, color: '#43a047' }} /> Servicios: {p.servicios.join(', ')}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Inicio; 