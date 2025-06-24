import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { useAuth } from '../../../logic/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const SolicitudCard = ({ solicitud, onAccion }) => (
  <Card sx={{ mb: 2, borderRadius: '12px', boxShadow: 2 }}>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Reserva #{solicitud.id} - {solicitud.estado}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <b>Parqueadero:</b> {solicitud.parqueadero_id} | <b>Vehículo:</b> {solicitud.vehiculo_id} | <b>Usuario:</b> {solicitud.usuario_id}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <b>Fecha inicio:</b> {solicitud.fecha_inicio} <b>Fecha fin:</b> {solicitud.fecha_fin}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Chip
            label={solicitud.estado}
            color={solicitud.estado === 'Aprobada' ? 'success' : solicitud.estado === 'Pendiente' ? 'warning' : 'error'}
            icon={solicitud.estado === 'Aprobada' ? <CheckCircleIcon /> : <CancelIcon />}
            sx={{ fontWeight: 700, fontSize: '1rem', px: 1.5, borderRadius: 2, mb: 1 }}
          />
          {solicitud.estado === 'Pendiente' && (
            <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: { md: 'flex-end' } }}>
              <Button variant="contained" color="success" size="small" onClick={() => onAccion(solicitud.id, 'Aprobada')}>
                Aceptar
              </Button>
              <Button variant="outlined" color="error" size="small" onClick={() => onAccion(solicitud.id, 'No aprobada')}>
                Rechazar
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const SolicitudesPanel = () => {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [solicitud, setSolicitud] = useState({
    tipo: '',
    descripcion: '',
    estado: 'Pendiente',
  });
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSolicitud(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Nueva solicitud:', solicitud);
    handleClose();
  };

  const tiposSolicitud = [
    'Reserva de espacio',
    'Cambio de horario',
    'Cancelación de servicio',
    'Otros'
  ];

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      if (!currentUser?.parqueadero_id) {
        setSolicitudes([]);
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_URL}/reservas?parqueadero_id=${currentUser.parqueadero_id}`);
      setSolicitudes(res.data.data || []);
    } catch (e) {
      setSolicitudes([]);
    }
    setLoading(false);
  };

  const handleAccion = async (id, estado) => {
    try {
      await axios.put(`${API_URL}/reservas/${id}/estado`, { estado });
      setSnackbar({ open: true, message: `Reserva ${estado === 'Aprobada' ? 'aprobada' : 'rechazada'}`, severity: 'success' });
      fetchSolicitudes();
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al actualizar reserva', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ListAltIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Solicitudes de Reserva</Typography>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress />
        </Box>
      ) : solicitudes.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No hay solicitudes de reserva.
        </Typography>
      ) : (
        solicitudes.map((solicitud) => (
          <SolicitudCard key={solicitud.id} solicitud={solicitud} onAccion={handleAccion} />
        ))
      )}
      {!currentUser?.parqueadero_id && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          fullWidth
          sx={{ mt: 2 }}
        >
          Nueva Solicitud
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nueva Solicitud</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Tipo de solicitud"
              name="tipo"
              value={solicitud.tipo}
              onChange={handleChange}
              margin="normal"
            >
              {tiposSolicitud.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={solicitud.descripcion}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Enviar Solicitud
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SolicitudesPanel; 