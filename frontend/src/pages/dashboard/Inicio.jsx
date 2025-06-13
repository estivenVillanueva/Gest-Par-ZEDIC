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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import axios from 'axios';

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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Inicio = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Datos de ejemplo - Estos deberían venir de tu backend
  const [stats, setStats] = React.useState({
    vehiculos: 0,
    pagos: 0,
    ocupacion: '0%',
    ingresos: '$0',
    solicitudes: 0
  });
  const [ultimosVehiculos, setUltimosVehiculos] = React.useState([]);

  React.useEffect(() => {
    // Obtener estadísticas y últimos vehículos
    fetchVehiculos();
  }, []);

  const fetchVehiculos = async () => {
    try {
      const res = await axios.get(`${API_URL}/vehiculos`);
      if (res.data && res.data.data) {
        setStats((prev) => ({ ...prev, vehiculos: res.data.data.length }));
        // Tomar los últimos 5 vehículos registrados (ordenados por created_at si existe)
        const vehiculosOrdenados = [...res.data.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setUltimosVehiculos(vehiculosOrdenados.slice(0, 5));
      }
    } catch (e) {
      setUltimosVehiculos([]);
    }
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
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Ingresos"
            value={"Ir"}
            icon={<MonetizationOnIcon sx={{ color: 'secondary.main' }} />}
            color="secondary"
            onClick={() => navigate('/dashboard/ingresos')}
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
                {ultimosVehiculos.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No hay vehículos registrados recientemente
                  </Typography>
                ) : (
                  ultimosVehiculos.map((v) => (
                    <Typography key={v.id} variant="body2" color="text.primary">
                      {v.placa} - {v.marca} {v.modelo} ({v.color})
                    </Typography>
                  ))
                )}
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