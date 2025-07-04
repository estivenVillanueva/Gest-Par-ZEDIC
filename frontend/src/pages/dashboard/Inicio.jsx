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
  useMediaQuery,
  Avatar,
  Chip
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { useAuth } from '../../../logic/AuthContext.jsx';

const StatCard = ({ title, value, icon, color, onClick, borderRadius }) => (
  <Card 
    sx={{ 
      borderRadius: borderRadius || 4, 
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
  const { currentUser } = useAuth();

  const [stats, setStats] = React.useState({
    vehiculos: 0,
    pagos: 0,
    ocupacion: '0%',
    ingresos: '$0',
    solicitudes: 0
  });
  const [ultimosVehiculos, setUltimosVehiculos] = React.useState([]);
  const [ultimosPagos, setUltimosPagos] = React.useState([]);
  const [capacidad, setCapacidad] = React.useState(0);

  React.useEffect(() => {
    if (currentUser && currentUser.parqueadero_id) {
      fetchVehiculos(currentUser.parqueadero_id);
      fetchPagos(currentUser.parqueadero_id);
      fetchCapacidad(currentUser.parqueadero_id);
      fetchSolicitudes(currentUser.parqueadero_id);
    }
  }, [currentUser]);

  const fetchVehiculos = async (parqueaderoId) => {
    try {
      const res = await axios.get(`${API_URL}/api/vehiculos?parqueadero_id=${parqueaderoId}`);
      if (res.data && res.data.data) {
        setStats((prev) => ({ ...prev, vehiculos: res.data.data.length }));
        const vehiculosOrdenados = [...res.data.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setUltimosVehiculos(vehiculosOrdenados.slice(0, 5));
        // Actualizar ocupación si ya tenemos capacidad
        if (capacidad > 0) {
          setStats((prev) => ({ ...prev, ocupacion: `${Math.round((res.data.data.length / capacidad) * 100)}%` }));
        }
      }
    } catch (e) {
      setUltimosVehiculos([]);
    }
  };

  const fetchPagos = async (parqueaderoId) => {
    try {
      const res = await axios.get(`${API_URL}/api/pagos/historial/${parqueaderoId}`);
      if (Array.isArray(res.data)) {
        // Pagos del mes actual
        const now = new Date();
        const pagosMes = res.data.filter(p => {
          if (!p.fecha_pago) return false;
          const fecha = new Date(p.fecha_pago);
          return fecha.getMonth() === now.getMonth() && fecha.getFullYear() === now.getFullYear();
        });
        const ingresosMes = pagosMes.reduce((acc, p) => acc + (parseInt(p.total, 10) || 0), 0);
        setStats(prev => ({
          ...prev,
          pagos: pagosMes.length,
          ingresos: ingresosMes.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
        }));
        // Últimos pagos realizados (ordenados por fecha de pago)
        const pagosRealizados = res.data.filter(p => p.estado === 'pagada' && p.fecha_pago).sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));
        setUltimosPagos(pagosRealizados.slice(0, 5));
      }
    } catch (e) {
      setUltimosPagos([]);
    }
  };

  const fetchCapacidad = async (parqueaderoId) => {
    try {
      const res = await axios.get(`${API_URL}/api/parqueaderos/${parqueaderoId}`);
      if (res.data && res.data.data && res.data.data.capacidad) {
        setCapacidad(res.data.data.capacidad);
        // Si ya tenemos vehículos, actualizar ocupación
        setStats(prev => ({
          ...prev,
          ocupacion: prev.vehiculos > 0 ? `${Math.round((prev.vehiculos / res.data.data.capacidad) * 100)}%` : '0%'
        }));
      }
    } catch (e) {
      setCapacidad(0);
    }
  };

  const fetchSolicitudes = async (parqueaderoId) => {
    try {
      const res = await axios.get(`${API_URL}/api/solicitudes?parqueadero_id=${parqueaderoId}&estado=pendiente`);
      if (res.data && Array.isArray(res.data.data)) {
        setStats(prev => ({ ...prev, solicitudes: res.data.data.length }));
      }
    } catch (e) {
      setStats(prev => ({ ...prev, solicitudes: 0 }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#f6f7fa',
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, md: 2 },
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: '98vw',
        borderRadius: 0,
        bgcolor: '#fff',
        boxShadow: '0 6px 32px rgba(52,152,243,0.10)',
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 5 },
        mt: { xs: 2, md: 4 },
        mb: 4,
      }}>
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
              borderRadius={2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Pagos del Mes"
              value={stats.pagos}
              icon={<PaymentIcon sx={{ color: 'success.main' }} />}
              color="success"
              onClick={() => navigate('/dashboard/pagos')}
              borderRadius={2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Ocupación Actual"
              value={stats.ocupacion}
              icon={<LocalParkingIcon sx={{ color: 'warning.main' }} />}
              color="warning"
              onClick={() => navigate('/dashboard/parqueadero')}
              borderRadius={2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Ingresos del Mes"
              value={stats.ingresos}
              icon={<TrendingUpIcon sx={{ color: 'info.main' }} />}
              color="info"
              onClick={() => navigate('/dashboard/reportes')}
              borderRadius={2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Solicitudes Pendientes"
              value={stats.solicitudes}
              icon={<RequestPageIcon sx={{ color: 'error.main' }} />}
              color="error"
              onClick={() => navigate('/dashboard/solicitudes')}
              borderRadius={2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Ingresos"
              value={"Ir"}
              icon={<MonetizationOnIcon sx={{ color: 'secondary.main' }} />}
              color="secondary"
              onClick={() => navigate('/dashboard/ingresos')}
              borderRadius={2}
            />
          </Grid>
        </Grid>

        {/* Resumen de Actividad */}
        <Paper elevation={1} sx={{
          width: '100%',
          borderRadius: 0,
          p: { xs: 2, sm: 4 },
          boxShadow: '0 2px 8px rgba(52,152,243,0.06)',
          bgcolor: '#f8fafc',
        }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Resumen de Actividad
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(52,152,243,0.06)' }}>
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
                      <Box key={v.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', mr: 1, width: 28, height: 28 }}>
                          <DirectionsCarIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" color="text.primary">
                          {v.placa} - {v.modelo ? v.modelo : ''} {v.color ? `(${v.color})` : ''}
                        </Typography>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(52,152,243,0.06)' }}>
                <CardHeader
                  title={<Typography variant="h6">Últimos Pagos</Typography>}
                  action={
                    <IconButton onClick={() => navigate('/dashboard/pagos')}>
                      <PaymentIcon />
                    </IconButton>
                  }
                />
                <CardContent>
                  {ultimosPagos.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No hay pagos recientes
                    </Typography>
                  ) : (
                    ultimosPagos.map((p) => (
                      <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: 'success.light', mr: 1, width: 28, height: 28 }}>
                          <PaymentIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.primary" fontWeight={600}>
                            {p.placa} - {p.usuario_nombre || 'Usuario'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(p.fecha_pago).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </Typography>
                        </Box>
                        <Chip
                          label={parseInt(p.total, 10).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}
                          color="success"
                          size="small"
                          sx={{ fontWeight: 700, fontSize: 13, ml: 1 }}
                        />
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Paper>
    </Box>
  );
};

export default Inicio; 