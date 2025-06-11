import React, { useState } from 'react';
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
import { useAuth } from '../../../logic/AuthContext';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? 'Editar Vehículo' : 'Registrar Vehículo'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            label="Placa"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            fullWidth
            required
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
          <Button type="submit" variant="contained">Guardar</Button>
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
  const [vehiculos, setVehiculos] = useState(MOCK_VEHICULOS);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [infoVehiculo, setInfoVehiculo] = useState(null);
  const { currentUser } = useAuth();

  const handleAgregar = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleGuardar = async (data) => {
    try {
      // Construir el objeto para el backend
      const vehiculoData = {
        placa: data.placa,
        tipo: data.tipoVehiculo,
        color: data.color,
        modelo: data.modelo,
        usuario_id: currentUser.id,
        parqueadero_id: currentUser.parqueadero_id || null
      };
      const response = await fetch('https://gest-par-zedic.onrender.com/api/vehiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculoData)
      });
      if (!response.ok) throw new Error('Error al agregar el vehículo');
      // Opcional: actualizar la lista de vehículos desde el backend
      setOpenForm(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditar = (vehiculo) => {
    setEditData(vehiculo);
    setOpenForm(true);
  };

  const handleEliminar = (vehiculo) => {
    if (window.confirm('¿Seguro que deseas eliminar este vehículo?')) {
      setVehiculos(vehiculos.filter(v => v.id !== vehiculo.id));
    }
  };

  const handleVer = (vehiculo) => {
    setInfoVehiculo(vehiculo);
  };

  return (
    <Box sx={{ bgcolor: '#f0f4fa', minHeight: '100vh', py: 6, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 1100, borderRadius: 4, p: { xs: 2, sm: 4, md: 6 }, boxShadow: '0 8px 32px rgba(43,108,163,0.10)', bgcolor: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#3498f3' }}>Tus Vehículos</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAgregar} sx={{ borderRadius: 3, fontWeight: 600, bgcolor: '#3498f3', '&:hover': { bgcolor: '#2176bd' } }}>
            Agregar Vehículo
          </Button>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            {vehiculos.map((vehiculo) => (
              <VehiculoCard
                key={vehiculo.id}
                vehiculo={vehiculo}
                onVer={handleVer}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            ))}
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
                initialData={editData}
              />
            </Box>
          </Grid>
        </Grid>
        <InfoVehiculoDialog open={!!infoVehiculo} onClose={() => setInfoVehiculo(null)} vehiculo={infoVehiculo} />
      </Paper>
    </Box>
  );
};

export default MisVehiculos; 