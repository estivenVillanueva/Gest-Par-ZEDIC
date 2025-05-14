import React from 'react';
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

const Inicio = () => {
  const navigate = useNavigate();

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
    </Box>
  );
};

export default Inicio; 