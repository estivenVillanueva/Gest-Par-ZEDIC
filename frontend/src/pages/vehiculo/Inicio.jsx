import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../../logic/AuthContext';
import { useVehiculo } from '../../../logic/VehiculoContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

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

const Inicio = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { vehiculos } = useVehiculo();
  const [parqueaderosDisponibles, setParqueaderosDisponibles] = useState([]);
  const [parqueaderosReservados, setParqueaderosReservados] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservaLoading, setReservaLoading] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState('');
  const [parqueaderoAReservar, setParqueaderoAReservar] = useState(null);
  const [showVehiculoSelect, setShowVehiculoSelect] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [fechaError, setFechaError] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [openReservaModal, setOpenReservaModal] = useState(false);
  const [parqueaderoSeleccionado, setParqueaderoSeleccionado] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchParqueaderos = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://gest-par-zedic.onrender.com/api/parqueaderos');
        const data = await response.json();
        setParqueaderosDisponibles(data.data || []);
      } catch (error) {
        setParqueaderosDisponibles([]);
      }
      setLoading(false);
    };
    fetchParqueaderos();
  }, []);

  useEffect(() => {
    const fetchReservas = async () => {
      if (!currentUser?.id) return;
      try {
        const response = await fetch(`https://gest-par-zedic.onrender.com/api/reservas?usuario_id=${currentUser.id}`);
        const data = await response.json();
        setParqueaderosReservados(data.data || []);
      } catch (error) {
        setParqueaderosReservados([]);
      }
    };
    fetchReservas();
  }, [currentUser]);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      if (new Date(fechaFin) <= new Date(fechaInicio)) {
        setFechaError('La fecha y hora de fin debe ser mayor a la de inicio');
      } else {
        setFechaError('');
      }
    } else {
      setFechaError('');
    }
  }, [fechaInicio, fechaFin]);

  const handleReservar = (parqueadero) => {
    setParqueaderoSeleccionado(parqueadero);
    setOpenReservaModal(true);
  };

  const handleConfirmarReserva = () => {
    realizarReserva(parqueaderoSeleccionado, vehiculoSeleccionado, fechaInicio, fechaFin);
    setOpenReservaModal(false);
  };

  const realizarReserva = async (parqueadero, vehiculoId, fechaInicioParam, fechaFinParam) => {
    setReservaLoading(true);
    try {
      const fecha_inicio = fechaInicioParam || new Date().toISOString();
      const fecha_fin = fechaFinParam || new Date(new Date().getTime() + 60 * 60 * 1000).toISOString();
      const reserva = {
        parqueadero_id: parqueadero.id,
        usuario_id: currentUser.id,
        fecha_inicio,
        fecha_fin,
        estado: 'Pendiente',
        observaciones,
      };
      if (vehiculoId) {
        reserva.vehiculo_id = vehiculoId;
      } else if (tipoVehiculo) {
        reserva.tipo_vehiculo = tipoVehiculo;
      }
      const response = await fetch('https://gest-par-zedic.onrender.com/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva),
      });
      const data = await response.json().catch(() => ({}));
      console.log('Respuesta reserva:', data);
      if (response.ok) {
        setSuccessMessage('Reserva realizada con éxito');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setSuccessMessage('Error al realizar la reserva: ' + (data.message || ''));
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (error) {
      setSuccessMessage('Error de conexión al reservar');
      setTimeout(() => setSuccessMessage(''), 4000);
    }
    setReservaLoading(false);
    setShowVehiculoSelect(false);
    setParqueaderoAReservar(null);
    setVehiculoSeleccionado('');
    setFechaInicio('');
    setFechaFin('');
    setTipoVehiculo('');
    setObservaciones('');
  };

  const parqueaderosFiltrados = parqueaderosDisponibles.filter((p) => {
    const texto = `${p.nombre} ${p.direccion || ''} ${p.ubicacion || ''}`.toLowerCase();
    return texto.includes(search.toLowerCase());
  }).slice(0, 5);

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
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Mis Vehículos"
              value="2"
              icon={<CarIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Reservas Activas"
              value="1"
              icon={<CalendarIcon />}
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
          {successMessage && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Paper elevation={3} sx={{ bgcolor: '#e8f5e9', color: '#388e3c', px: 3, py: 1, borderRadius: 2, fontWeight: 600 }}>
                {successMessage}
              </Paper>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <input
              type="text"
              placeholder="Buscar por nombre, dirección o ubicación..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', maxWidth: 400 }}
            />
          </Box>
          {loading ? (
            <Typography align="center">Cargando parqueaderos...</Typography>
          ) : parqueaderosFiltrados.length === 0 ? (
            <Typography align="center">No hay parqueaderos registrados.</Typography>
          ) : (
            <Grid container spacing={{ xs: 3, md: 5 }} justifyContent="center" alignItems="stretch">
              {parqueaderosFiltrados.map((p) => (
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
                        <EventAvailableIcon sx={{ fontSize: 16, mr: 0.5, color: '#43a047' }} /> Servicios: {(p.servicios || []).join(', ')}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<EventAvailableIcon />}
                      sx={{ mb: 1, borderRadius: 5, fontWeight: 600, width: '100%', bgcolor: '#3498f3', '&:hover': { bgcolor: '#2176bd' } }}
                      onClick={() => handleReservar(p)}
                      disabled={reservaLoading}
                    >
                      {reservaLoading ? 'Reservando...' : 'Reservar'}
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
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
            Mis Reservas
          </Typography>
          <Grid container spacing={{ xs: 3, md: 5 }} justifyContent="center" alignItems="stretch">
            {parqueaderosReservados.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No tienes reservas registradas.
                </Typography>
              </Grid>
            ) : (
              parqueaderosReservados.map((reserva) => (
                <Grid item xs={12} sm={8} md={5} lg={4} key={reserva.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card sx={{
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(52,152,243,0.10)',
                    bgcolor: '#fff',
                    minHeight: 180,
                    width: 340,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    gap: 2,
                    p: 3,
                    mb: 2,
                    transition: 'box-shadow 0.25s, transform 0.18s',
                    '&:hover': { boxShadow: '0 16px 48px rgba(52,152,243,0.18)', transform: 'translateY(-4px) scale(1.02)' }
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {reserva.parqueadero_nombre || reserva.nombre || 'Parqueadero'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <CalendarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> {reserva.fecha_inicio ? new Date(reserva.fecha_inicio).toLocaleString() : ''}
                    </Typography>
                    {reserva.vehiculo_placa && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <CarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Vehículo: {reserva.vehiculo_placa}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Estado: {reserva.estado || 'Pendiente'}
                    </Typography>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Paper>

      {/* Modal de formulario de reserva */}
      <Dialog open={openReservaModal} onClose={() => setOpenReservaModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Reservar Parqueadero</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2">Nombre completo:</Typography>
            <input
              type="text"
              value={currentUser?.nombre || ''}
              disabled
              style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #1976d2', background: '#f4f8fd', fontWeight: 600, color: '#1976d2', marginBottom: 8 }}
            />
            <Typography variant="subtitle2">Selecciona tu vehículo:</Typography>
            <select
              value={vehiculoSeleccionado}
              onChange={e => setVehiculoSeleccionado(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #1976d2', width: '100%', maxWidth: 350, marginBottom: 8, background: '#fafdff' }}
            >
              <option value="">Selecciona un vehículo</option>
              {vehiculos.map(v => (
                <option key={v.id} value={v.id}>{v.placa} - {v.tipo}</option>
              ))}
            </select>
            <Typography variant="subtitle2">O selecciona tipo de vehículo:</Typography>
            <select
              value={tipoVehiculo}
              onChange={e => setTipoVehiculo(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #1976d2', width: '100%', maxWidth: 350, marginBottom: 8, background: '#fafdff' }}
            >
              <option value="">Selecciona tipo de vehículo</option>
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
              <option value="bicicleta">Bicicleta</option>
              <option value="otro">Otro</option>
            </select>
            <Typography variant="subtitle2">Fecha y hora de inicio:</Typography>
            <input
              type="datetime-local"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #1976d2', width: '100%', maxWidth: 350, marginBottom: 8, background: '#fafdff' }}
            />
            <Typography variant="subtitle2">Fecha y hora de fin:</Typography>
            <input
              type="datetime-local"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #1976d2', width: '100%', maxWidth: 350, marginBottom: 8, background: '#fafdff' }}
            />
            <Typography variant="subtitle2">Observaciones:</Typography>
            <textarea
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #1976d2', width: '100%', maxWidth: 400, marginBottom: 8, background: '#fafdff' }}
              rows={2}
              placeholder="Observaciones adicionales (opcional)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReservaModal(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarReserva} variant="contained" disabled={reservaLoading || (!vehiculoSeleccionado && !tipoVehiculo) || !fechaInicio || !fechaFin || fechaError}>Confirmar Reserva</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inicio; 