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

  const handleAgregar = () => {
    setEditingVehiculo(null);
    setOpenForm(true);
  };

  const handleGuardar = async (data) => {
    // Si es edición
    if (editingVehiculo) {
      const res = await fetch(`${API_URL}/api/vehiculos/${editingVehiculo.placa}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, usuario_id: currentUser.id })
      });
      if (!res.ok) throw new Error('Error al editar vehículo');
    } else {
      // Nuevo vehículo
      const res = await fetch(`${API_URL}/api/vehiculos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, usuario_id: currentUser.id })
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
    <Box sx={{ bgcolor: '#f0f4fa', minHeight: '100vh', py: 6, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 1100, borderRadius: 4, p: { xs: 2, sm: 4, md: 6 }, boxShadow: '0 8px 32px rgba(43,108,163,0.10)', bgcolor: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#3498f3' }}>Tus Vehículos</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAgregar} sx={{ borderRadius: 3, fontWeight: 600, bgcolor: '#3498f3', '&:hover': { bgcolor: '#2176bd' } }}>
              Agregar Vehículo
            </Button>
            <Button variant="outlined" color="error" startIcon={<DeleteSweepIcon />} onClick={handleEliminarTodos} sx={{ borderRadius: 3, fontWeight: 600 }}>
              Eliminar todos los vehículos
            </Button>
          </Box>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            {loading ? (
              <Typography>Cargando...</Typography>
            ) : vehiculos.length === 0 ? (
              <Typography>No tienes vehículos registrados.</Typography>
            ) : (
              vehiculos.map((vehiculo) => (
                <VehiculoCard
                  key={vehiculo.id || vehiculo.placa}
                  vehiculo={vehiculo}
                  onVer={handleVer}
                  onEditar={handleEditar}
                  onEliminar={handleEliminar}
                />
              ))
            )}
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 3, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom>Registrar/Editar Vehículo</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Completa el formulario para agregar o editar un vehículo.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <FormularioVehiculo
                open={openForm}
                onClose={() => setOpenForm(false)}
                onGuardar={handleGuardar}
                initialData={editingVehiculo}
              />
            </Box>
          </Grid>
        </Grid>
        <InfoVehiculoDialog open={openInfo} onClose={() => setOpenInfo(false)} vehiculo={selectedVehiculo} />
      </Paper>
    </Box>
  );
};

export default MisVehiculos; 