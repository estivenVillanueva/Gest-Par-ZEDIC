import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  Tooltip,
  Divider,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import Chip from '@mui/material/Chip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAuth } from '../../../logic/AuthContext';
const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';

const MOCK_VEHICULOS = [
  {
    id: '1',
    placa: 'ABC123',
    tipoVehiculo: 'Carro',
    color: 'Rojo',
    modelo: 'Mazda 3',
  },
  {
    id: '2',
    placa: 'XYZ789',
    tipoVehiculo: 'Moto',
    color: 'Negro',
    modelo: 'Yamaha FZ',
  },
];

const VehiculoCard = ({ vehiculo, onVer, onEditar, onEliminar }) => (
  <Card sx={{ mb: 2, borderRadius: 3, boxShadow: '0 2px 12px rgba(52,152,243,0.10)', p: 1, display: 'flex', alignItems: 'center', transition: 'box-shadow 0.18s', '&:hover': { boxShadow: '0 8px 32px rgba(52,152,243,0.18)' } }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 0, flex: 1 }}>
      <Avatar sx={{ background: 'linear-gradient(135deg, #3498f3 0%, #6ec1ff 100%)', width: 54, height: 54, color: '#fff', fontSize: 32, boxShadow: '0 2px 8px rgba(52,152,243,0.10)' }}>
        <DirectionsCarIcon sx={{ fontSize: 32 }} />
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehiculo.placa}</Typography>
        <Typography variant="body2" color="text.secondary">{vehiculo.tipoVehiculo} - {vehiculo.color} - {vehiculo.modelo}</Typography>
      </Box>
    </CardContent>
    <CardActions sx={{ gap: 1 }}>
      <Tooltip title="Ver información">
        <IconButton onClick={() => onVer(vehiculo)} color="primary">
          <DirectionsCarIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Editar">
        <IconButton onClick={() => onEditar(vehiculo)} color="secondary">
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Eliminar">
        <IconButton onClick={() => onEliminar(vehiculo)} color="error">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </CardActions>
  </Card>
);

const FormularioVehiculo = ({ open, onClose, onGuardar, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    placa: '',
    tipoVehiculo: '',
    color: '',
    modelo: '',
  });
  const [placaError, setPlacaError] = useState('');
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'placa') {
      let value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      if (value.length > 6) {
        value = value.slice(0, 6);
        setPlacaError('La placa no puede tener más de 6 caracteres');
      } else {
        setPlacaError('');
      }
      setFormData({ ...formData, [e.target.name]: value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handlePlacaPaste = (e) => {
    let paste = (e.clipboardData || window.clipboardData).getData('text');
    paste = paste.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
    e.preventDefault();
    setFormData(prev => ({ ...prev, placa: paste }));
    setPlacaError(paste.length > 6 ? 'La placa no puede tener más de 6 caracteres' : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (formData.placa.length !== 6) {
      setPlacaError('La placa debe tener exactamente 6 caracteres');
      return;
    }
    try {
      await onGuardar(formData);
    } catch (error) {
      setFormError(error.message || 'Error al agregar el vehículo');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? 'Editar Vehículo' : 'Registrar Vehículo'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {formError && (
            <Typography color="error" sx={{ mb: 1 }}>{formError}</Typography>
          )}
          <TextField
            margin="dense"
            label="Placa"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            onPaste={handlePlacaPaste}
            fullWidth
            required
            inputProps={{ maxLength: 6, style: { textTransform: 'uppercase' }, pattern: '[A-Z0-9]{1,6}' }}
            error={!!placaError}
            helperText={placaError}
          />
          <TextField
            margin="dense"
            label="Tipo de Vehículo"
            name="tipoVehiculo"
            value={formData.tipoVehiculo}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={!!placaError || formData.placa.length !== 6}>Guardar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const InfoVehiculoDialog = ({ open, onClose, vehiculo }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontWeight: 700, color: '#3498f3', textAlign: 'center' }}>Información del Vehículo</DialogTitle>
    <DialogContent dividers>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 1 }}>
        <Avatar sx={{ background: 'linear-gradient(135deg, #3498f3 0%, #6ec1ff 100%)', width: 60, height: 60, color: '#fff', mb: 1 }}>
          <DirectionsCarIcon sx={{ fontSize: 36 }} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehiculo?.placa}</Typography>
        <Box sx={{ width: '100%', mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}><b>Tipo:</b> {vehiculo?.tipoVehiculo}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}><b>Color:</b> {vehiculo?.color}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}><b>Modelo:</b> {vehiculo?.modelo}</Typography>
        </Box>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#3498f3', '&:hover': { bgcolor: '#2176bd' } }}>Cerrar</Button>
    </DialogActions>
  </Dialog>
);

const MisVehiculos = () => {
  const { currentUser } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);

  // Fetch vehículos del usuario
  useEffect(() => {
    if (!currentUser) return;
    const fetchVehiculos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/vehiculos?usuario_id=${currentUser.id}`);
        const data = await res.json();
        setVehiculos(data.data || []);
      } catch {
        setVehiculos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehiculos();
  }, [currentUser]);

  // Fetch reservas del usuario
  useEffect(() => {
    if (!currentUser) return;
    const fetchReservas = async () => {
      setLoadingReservas(true);
      try {
        const res = await fetch(`https://gest-par-zedic.onrender.com/api/reservas?usuario_id=${currentUser.id}`);
        const data = await res.json();
        setReservas(data.data || []);
      } catch {
        setReservas([]);
      } finally {
        setLoadingReservas(false);
      }
    };
    fetchReservas();
  }, [currentUser]);

  const handleAgregar = () => {
    setEditingVehiculo(null);
    setOpenForm(true);
  };

  const handleGuardar = async (data) => {
    // Transformar tipoVehiculo a tipo
    const vehiculoData = {
      ...data,
      tipo: data.tipoVehiculo,
      usuario_id: currentUser.id
    };
    delete vehiculoData.tipoVehiculo;
    // Si es edición
    if (editingVehiculo) {
      const res = await fetch(`${API_URL}/api/vehiculos/${editingVehiculo.placa}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculoData)
      });
      if (!res.ok) throw new Error('Error al editar vehículo');
    } else {
      // Nuevo vehículo
      const res = await fetch(`${API_URL}/api/vehiculos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculoData)
      });
      if (!res.ok) throw new Error('Error al agregar vehículo');
    }
    // Refrescar lista
    const res = await fetch(`${API_URL}/api/vehiculos?usuario_id=${currentUser.id}`);
    const dataVehiculos = await res.json();
    setVehiculos(dataVehiculos.data || []);
    setOpenForm(false);
  };

  const handleEditar = (vehiculo) => {
    setEditingVehiculo(vehiculo);
    setOpenForm(true);
  };

  const handleEliminar = async (vehiculo) => {
    await fetch(`${API_URL}/api/vehiculos/${vehiculo.placa}`, { method: 'DELETE' });
    // Refrescar lista
    const res = await fetch(`${API_URL}/api/vehiculos?usuario_id=${currentUser.id}`);
    const dataVehiculos = await res.json();
    setVehiculos(dataVehiculos.data || []);
  };

  const handleVer = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setOpenInfo(true);
  };

  const handleEliminarTodos = async () => {
    // Eliminar todos los vehículos del usuario
    await Promise.all(vehiculos.map(v => fetch(`${API_URL}/api/vehiculos/${v.placa}`, { method: 'DELETE' })));
    setVehiculos([]);
  };

  return (
    <Box sx={{ bgcolor: '#f0f4fa', minHeight: '100vh', py: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ width: '95vw', maxWidth: 1400, borderRadius: 2, p: { xs: 1, sm: 2, md: 3 }, boxShadow: '0 12px 48px rgba(43,108,163,0.13)', bgcolor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh', my: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#3498f3', mb: 2, mt: 2, textAlign: 'center' }}>Tus Vehículos</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAgregar} sx={{ borderRadius: 2, fontWeight: 600, bgcolor: '#3498f3', '&:hover': { bgcolor: '#2176bd' }, minWidth: 170 }}>
            Agregar Vehículo
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteSweepIcon />} onClick={handleEliminarTodos} sx={{ borderRadius: 2, fontWeight: 600, minWidth: 170 }}>
            Eliminar todos los vehículos
          </Button>
        </Box>
        <Typography variant="subtitle1" sx={{ mb: 2, color: '#2B6CA3', fontWeight: 500, textAlign: 'center' }}>
          Tienes {vehiculos.length} vehículo{vehiculos.length !== 1 ? 's' : ''} registrado{vehiculos.length !== 1 ? 's' : ''}.
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 1300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {loading ? (
            <Typography>Cargando...</Typography>
          ) : vehiculos.length === 0 ? (
            <Typography>No tienes vehículos registrados.</Typography>
          ) : (
            <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: { xs: '1fr', md: vehiculos.length > 1 ? '1fr 1fr' : '1fr' }, gap: 3, justifyItems: 'center' }}>
              {vehiculos.map((vehiculo) => {
                const historial = reservas.filter(r => r.vehiculo_placa === vehiculo.placa);
                return (
                  <Card key={vehiculo.id || vehiculo.placa} sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(52,152,243,0.15)', border: '1.5px solid #e3eaf6', p: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'flex-start' }, transition: 'box-shadow 0.18s', width: '100%', maxWidth: 600, mx: 'auto', '&:hover': { boxShadow: '0 16px 48px rgba(52,152,243,0.22)' } }}>
                    {/* Columna 1: Datos del vehículo y acciones */}
                    <Box sx={{ flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 2, md: 0 } }}>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #3498f3 0%, #6ec1ff 100%)', width: 54, height: 54, color: '#fff', fontSize: 32, boxShadow: '0 2px 8px rgba(52,152,243,0.10)' }}>
                        <DirectionsCarIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehiculo.placa}</Typography>
                        <Typography variant="body2" color="text.secondary">{vehiculo.tipoVehiculo || vehiculo.tipo} - {vehiculo.color} - {vehiculo.modelo}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Ver información">
                          <IconButton onClick={() => handleVer(vehiculo)} color="primary" size="small">
                            <DirectionsCarIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton onClick={() => handleEditar(vehiculo)} color="secondary" size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => handleEliminar(vehiculo)} color="error" size="small">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    {/* Columna 2: Historial de parqueaderos */}
                    <Box sx={{ flex: 2, minWidth: 220, px: { xs: 0, md: 2 }, borderLeft: { md: '1px solid #f0f4fa' }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="subtitle2" sx={{ color: '#2B6CA3', fontWeight: 600, mb: 0.5 }}>
                        Historial en parqueaderos:
                      </Typography>
                      {loadingReservas ? (
                        <Typography variant="body2" color="text.secondary">Cargando historial...</Typography>
                      ) : (
                        historial.length === 0 ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <InfoOutlinedIcon sx={{ color: '#b0bec5', fontSize: 22 }} />
                            <Typography variant="body2" color="text.secondary">Este vehículo no tiene reservas en parqueaderos.</Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {historial.map((r, idx) => (
                              <Box key={r.id || idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5, borderBottom: '1px solid #f0f4fa' }}>
                                <LocalParkingIcon sx={{ fontSize: 18, color: '#3498f3' }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.parqueadero_nombre || r.nombre || 'Parqueadero'}</Typography>
                                <EventAvailableIcon sx={{ fontSize: 16, color: '#1976d2', ml: 1 }} />
                                <Typography variant="body2" color="text.secondary">{r.fecha_inicio ? new Date(r.fecha_inicio).toLocaleDateString() : ''}</Typography>
                                <Chip label={r.estado} size="small" color={r.estado === 'Aprobada' ? 'success' : r.estado === 'Pendiente' ? 'warning' : 'error'} sx={{ ml: 1, fontWeight: 600 }} />
                              </Box>
                            ))}
                          </Box>
                        )
                      )}
                    </Box>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
        <FormularioVehiculo
          open={openForm}
          onClose={() => setOpenForm(false)}
          onGuardar={handleGuardar}
          initialData={editingVehiculo}
        />
        <InfoVehiculoDialog open={openInfo} onClose={() => setOpenInfo(false)} vehiculo={selectedVehiculo} />
      </Paper>
    </Box>
  );
};

export default MisVehiculos; 