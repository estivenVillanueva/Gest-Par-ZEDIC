import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <Card 
    sx={{ 
      borderRadius: 4, 
      boxShadow: '0 2px 12px rgba(52,152,243,0.06)',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)'
      }
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          bgcolor: `${color}.light`, 
          borderRadius: 2, 
          p: 1, 
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Typography variant="h6" color="text.primary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight={700} color={`${color}.main`}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Inicio = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Datos de ejemplo - Estos deberían venir de tu backend
  const stats = {
    vehiculos: 25,
    pagos: 150,
    ocupacion: '75%',
    ingresos: '$2,500,000',
    solicitudes: 5
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#f6f7fa',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 4 },
        boxSizing: 'border-box',
      }}
    >
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Bienvenido al Panel de Control
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aquí puedes ver un resumen de la actividad de tu parqueadero
        </Typography>
      </Box>

      {/* Tarjetas de Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Vehículos Registrados"
            value={stats.vehiculos}
            icon={<DirectionsCarIcon sx={{ color: 'primary.main' }} />}
            color="primary"
            onClick={() => navigate('/dashboard/vehiculos')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pagos del Mes"
            value={stats.pagos}
            icon={<PaymentIcon sx={{ color: 'success.main' }} />}
            color="success"
            onClick={() => navigate('/dashboard/pagos')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Ocupación Actual"
            value={stats.ocupacion}
            icon={<LocalParkingIcon sx={{ color: 'warning.main' }} />}
            color="warning"
            onClick={() => navigate('/dashboard/parqueadero')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Ingresos del Mes"
            value={stats.ingresos}
            icon={<TrendingUpIcon sx={{ color: 'info.main' }} />}
            color="info"
            onClick={() => navigate('/dashboard/reportes')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Solicitudes Pendientes"
            value={stats.solicitudes}
            icon={<RequestPageIcon sx={{ color: 'error.main' }} />}
            color="error"
            onClick={() => navigate('/dashboard/solicitudes')}
          />
        </Grid>
      </Grid>

      {/* Resumen de Actividad */}
      <Paper elevation={2} sx={{
        width: '100%',
        borderRadius: 3,
        p: { xs: 2, sm: 4 },
        boxShadow: '0 4px 16px rgba(52,152,243,0.08)',
        bgcolor: '#fff',
      }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Resumen de Actividad
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 12px rgba(52,152,243,0.06)' }}>
              <CardHeader
                title={<Typography variant="h6">Últimos Vehículos Registrados</Typography>}
                action={
                  <IconButton onClick={() => navigate('/dashboard/vehiculos')}>
                    <DirectionsCarIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  No hay vehículos registrados recientemente
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 12px rgba(52,152,243,0.06)' }}>
              <CardHeader
                title={<Typography variant="h6">Últimos Pagos</Typography>}
                action={
                  <IconButton onClick={() => navigate('/dashboard/pagos')}>
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
      </Paper>
    </Box>
  );
};

export default Inicio; 