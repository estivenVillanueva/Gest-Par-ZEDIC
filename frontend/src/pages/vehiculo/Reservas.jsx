import React, { useState, useEffect } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../../logic/AuthContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const estados = [
  { label: 'Todas', value: 'todas' },
  { label: 'Pendientes', value: 'Pendiente' },
  { label: 'Aprobadas', value: 'Aprobada' },
  { label: 'No aprobadas', value: 'No aprobada' },
];

const Reservas = () => {
  const [tab, setTab] = useState('todas');
  const [reservas, setReservas] = useState([]);
  const { currentUser } = useAuth();
  const [detalleReserva, setDetalleReserva] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [limit, setLimit] = useState(8);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [reservaToCancel, setReservaToCancel] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchReservas = async () => {
      if (!currentUser?.id) return;
      try {
        const response = await fetch(`https://gest-par-zedic.onrender.com/api/reservas?usuario_id=${currentUser.id}`);
        const data = await response.json();
        setReservas(data.data || []);
      } catch (error) {
        setReservas([]);
      }
    };
    fetchReservas();
  }, [currentUser]);

  const handleCancelarReserva = (reserva) => {
    setReservaToCancel(reserva);
    setOpenConfirmDialog(true);
  };

  const confirmCancelarReserva = async () => {
    if (!reservaToCancel) return;
    setCancelingId(reservaToCancel.id);
    try {
      await fetch(`https://gest-par-zedic.onrender.com/api/reservas/${reservaToCancel.id}`, {
        method: 'DELETE',
      });
      setReservas((prev) => prev.filter((r) => r.id !== reservaToCancel.id));
      setSnackbar({ open: true, message: 'Reserva cancelada con éxito', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al cancelar la reserva', severity: 'error' });
    }
    setCancelingId(null);
    setOpenConfirmDialog(false);
    setReservaToCancel(null);
  };

  const reservasFiltradas =
    (tab === 'todas' ? reservas : reservas.filter((r) => r.estado === tab))
      .filter(r =>
        (!filtroNombre || (r.parqueadero_nombre && r.parqueadero_nombre.toLowerCase().includes(filtroNombre.toLowerCase()))) &&
        (!filtroFecha || (r.fecha_inicio && r.fecha_inicio.startsWith(filtroFecha)))
      );
  const reservasMostradas = reservasFiltradas.slice(0, limit);

  return (
    <Box sx={{ bgcolor: '#f0f4fa', minHeight: '100vh', py: { xs: 2, sm: 4, md: 6 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '95vw', maxWidth: 1400, borderRadius: 2, p: { xs: 1, sm: 2, md: 4 }, boxShadow: '0 8px 32px rgba(43,108,163,0.10)', bgcolor: '#fff' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#3498f3', mb: 2, fontSize: { xs: '1.3rem', sm: '1.7rem' } }}>
          Mis Reservas
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v) => { setTab(v); setLimit(8); }}
          sx={{ mb: 3, flexWrap: 'wrap' }}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {estados.map((e) => (
            <Tab key={e.value} label={e.label} value={e.value} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />
          ))}
        </Tabs>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
          <TextField
            size="small"
            placeholder="Buscar por parqueadero"
            value={filtroNombre}
            onChange={e => { setFiltroNombre(e.target.value); setLimit(8); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { xs: 120, sm: 180, md: 220 }, width: { xs: '100%', sm: 'auto' } }}
          />
          <TextField
            size="small"
            type="date"
            label="Filtrar por fecha"
            value={filtroFecha}
            onChange={e => { setFiltroFecha(e.target.value); setLimit(8); }}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: { xs: 120, sm: 150, md: 180 }, width: { xs: '100%', sm: 'auto' } }}
          />
        </Box>
        <Grid container spacing={{ xs: 2, md: 4 }} alignItems="stretch">
          {reservasMostradas.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary" align="center">
                No tienes reservas en este estado.
              </Typography>
            </Grid>
          ) : (
            reservasMostradas.map((reserva) => (
              <Grid item xs={12} sm={12} md={6} key={reserva.id} sx={{ height: '100%' }}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(52,152,243,0.10)', p: { xs: 1, sm: 2 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, height: '100%' }}>
                  <Avatar sx={{ background: 'linear-gradient(135deg, #3498f3 0%, #6ec1ff 100%)', width: 48, height: 48, color: '#fff', fontSize: 28, boxShadow: '0 2px 8px rgba(52,152,243,0.10)' }}>
                    <LocalParkingIcon />
                  </Avatar>
                  <CardContent sx={{ flex: 1, p: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>{reserva.parqueadero_nombre || reserva.nombre || 'Parqueadero'}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      <EventAvailableIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> {reserva.fecha_inicio ? new Date(reserva.fecha_inicio).toLocaleString() : ''}
                    </Typography>
                    {reserva.vehiculo_placa && (
                      <Typography variant="body2" color="text.secondary">
                        <DirectionsCarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Vehículo: {reserva.vehiculo_placa}
                      </Typography>
                    )}
                    {!reserva.vehiculo_placa && reserva.tipo_vehiculo && (
                      <Typography variant="body2" color="text.secondary">
                        <DirectionsCarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Tipo de vehículo: {reserva.tipo_vehiculo}
                      </Typography>
                    )}
                    {reserva.observaciones && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        <b>Observaciones:</b> {reserva.observaciones}
                      </Typography>
                    )}
                  </CardContent>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: { xs: 'center', sm: 'flex-end' }, gap: 1, width: { xs: '100%', sm: 'auto' }, mt: { xs: 1, sm: 0 } }}>
                    <Chip
                      label={
                        reserva.estado === 'Aprobada'
                          ? 'Aprobada'
                          : reserva.estado === 'Pendiente'
                          ? 'Pendiente'
                          : 'No aprobada'
                      }
                      color={
                        reserva.estado === 'Aprobada'
                          ? 'success'
                          : reserva.estado === 'Pendiente'
                          ? 'warning'
                          : 'error'
                      }
                      icon={
                        reserva.estado === 'Aprobada'
                          ? <CheckCircleIcon />
                          : reserva.estado === 'Pendiente'
                          ? <EventAvailableIcon />
                          : <CancelIcon />
                      }
                      sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' }, px: 1.5, borderRadius: 2 }}
                    />
                    <Button variant="outlined" sx={{ borderRadius: 2, minWidth: 90, fontSize: { xs: '0.8rem', sm: '1rem' } }} onClick={() => setDetalleReserva(reserva)}>
                      Ver detalles
                    </Button>
                    {reserva.estado === 'Pendiente' && (
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ borderRadius: 2, minWidth: 90, fontSize: { xs: '0.8rem', sm: '1rem' } }}
                        startIcon={<DeleteIcon />}
                        onClick={() => handleCancelarReserva(reserva)}
                        disabled={cancelingId === reserva.id}
                      >
                        {cancelingId === reserva.id ? 'Cancelando...' : 'Cancelar'}
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))
          )}
          {reservasFiltradas.length > limit && (
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Box>
                <Button variant="outlined" onClick={() => setLimit(limit + 8)} sx={{ borderRadius: 3, fontWeight: 600, mr: 1 }}>
                  Ver más
                </Button>
                {limit > 8 && (
                  <Button variant="outlined" color="secondary" onClick={() => setLimit(Math.max(8, limit - 8))} sx={{ borderRadius: 3, fontWeight: 600 }}>
                    Ver menos
                  </Button>
                )}
              </Box>
              <Typography color="text.secondary">
                Mostrando {Math.min(limit, reservasFiltradas.length)} de {reservasFiltradas.length} reservas.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
      {/* Modal de detalles de reserva */}
      <Dialog open={!!detalleReserva} onClose={() => setDetalleReserva(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalle de la Reserva</DialogTitle>
        <DialogContent dividers>
          {detalleReserva && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}><b>Parqueadero:</b> {detalleReserva.parqueadero_nombre || detalleReserva.nombre || 'Parqueadero'}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><b>Fecha inicio:</b> {detalleReserva.fecha_inicio ? new Date(detalleReserva.fecha_inicio).toLocaleString() : ''}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><b>Fecha fin:</b> {detalleReserva.fecha_fin ? new Date(detalleReserva.fecha_fin).toLocaleString() : ''}</Typography>
              {detalleReserva.vehiculo_placa && (
                <Typography variant="body2" sx={{ mb: 1 }}><b>Vehículo:</b> {detalleReserva.vehiculo_placa}</Typography>
              )}
              {!detalleReserva.vehiculo_placa && detalleReserva.tipo_vehiculo && (
                <Typography variant="body2" sx={{ mb: 1 }}><b>Tipo de vehículo:</b> {detalleReserva.tipo_vehiculo}</Typography>
              )}
              {detalleReserva.observaciones && (
                <Typography variant="body2" sx={{ mb: 1 }}><b>Observaciones:</b> {detalleReserva.observaciones}</Typography>
              )}
              <Typography variant="body2" sx={{ mb: 1 }}><b>Estado:</b> {detalleReserva.estado}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><b>Creada:</b> {detalleReserva.created_at ? new Date(detalleReserva.created_at).toLocaleString() : ''}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalleReserva(null)} variant="contained">Cerrar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Cancelar Reserva</DialogTitle>
        <DialogContent>¿Seguro que deseas cancelar esta reserva?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">No</Button>
          <Button onClick={confirmCancelarReserva} color="error" variant="contained" autoFocus disabled={!!cancelingId}>
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Reservas; 