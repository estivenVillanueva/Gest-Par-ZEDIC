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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useVehiculo } from '../../../logic/VehiculoContext';

const VehiculoCard = ({ vehiculo, onVer, onEditar, onEliminar }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ bgcolor: '#2B6CA3', width: 56, height: 56 }}>
        <DirectionsCarIcon sx={{ fontSize: 32 }} />
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{vehiculo.placa}</Typography>
        <Typography variant="body2" color="text.secondary">{vehiculo.tipoVehiculo} - {vehiculo.color} - {vehiculo.modelo}</Typography>
      </Box>
      <CardActions>
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
    </CardContent>
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

const MisVehiculos = () => {
  const { vehiculos, agregarVehiculo, actualizarVehiculo, eliminarVehiculo, loading } = useVehiculo();
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleAgregar = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleGuardar = async (data) => {
    if (editData) {
      await actualizarVehiculo(editData.id, data);
    } else {
      await agregarVehiculo(data);
    }
    setOpenForm(false);
  };

  const handleEditar = (vehiculo) => {
    setEditData(vehiculo);
    setOpenForm(true);
  };

  const handleEliminar = async (vehiculo) => {
    if (window.confirm('¿Seguro que deseas eliminar este vehículo?')) {
      await eliminarVehiculo(vehiculo.id);
    }
  };

  const handleVer = (vehiculo) => {
    alert(`Información del vehículo:\nPlaca: ${vehiculo.placa}\nTipo: ${vehiculo.tipoVehiculo}\nColor: ${vehiculo.color}\nModelo: ${vehiculo.modelo}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>Tus Vehículos</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAgregar}>
              Agregar
            </Button>
          </Box>
          {loading ? (
            <Typography>Cargando...</Typography>
          ) : (
            vehiculos.length === 0 ? (
              <Typography>No tienes vehículos registrados.</Typography>
            ) : (
              vehiculos.map((vehiculo) => (
                <VehiculoCard
                  key={vehiculo.id}
                  vehiculo={vehiculo}
                  onVer={handleVer}
                  onEditar={handleEditar}
                  onEliminar={handleEliminar}
                />
              ))
            )
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
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
      {/* Información de la empresa y contacto en la parte inferior */}
      <Box sx={{ mt: 6, textAlign: 'center', color: 'text.secondary' }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2">Gest-Par ZEDIC | Contacto: info@parqueaderos.com | Bogotá, Colombia</Typography>
      </Box>
    </Box>
  );
};

export default MisVehiculos; 