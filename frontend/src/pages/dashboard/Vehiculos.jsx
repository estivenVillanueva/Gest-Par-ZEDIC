import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Chip,
  Fab,
  Tooltip,
  TextField,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SearchIcon from '@mui/icons-material/Search';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { MinimalCard, MinimalIcon, MinimalBadge, MinimalFab, MinimalGrid, MinimalFilterBar } from '../../styles/pages/Vehiculos.styles';
import { useVehiculo } from '../../../logic/VehiculoContext';
import { useAuth } from '../../../logic/AuthContext';

const getVehiculoIcon = (tipo) => {
  switch (tipo?.toLowerCase()) {
    case 'moto':
      return <TwoWheelerIcon sx={{ fontSize: 32 }} />;
    case 'carro':
      return <TimeToLeaveIcon sx={{ fontSize: 32 }} />;
    case 'bicicleta':
      return <PedalBikeIcon sx={{ fontSize: 32 }} />;
    case 'camion':
      return <LocalShippingIcon sx={{ fontSize: 32 }} />;
    default:
      return <DirectionsCarIcon sx={{ fontSize: 32 }} />;
  }
};

const VehiculoCard = ({ vehiculo, onVerInfo }) => (
  <MinimalCard onClick={() => onVerInfo(vehiculo)}>
    <MinimalIcon>
      {getVehiculoIcon(vehiculo.tipoVehiculo)}
    </MinimalIcon>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, color: '#2B6CA3', mt: 1 }}>{vehiculo.placa}</Typography>
    <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>{vehiculo.propietario}</Typography>
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 1 }}>
      <MinimalBadge label={vehiculo.puesto || 'No asignado'} color="primary" />
      <MinimalBadge label={vehiculo.tipoServicio} color="secondary" />
    </Box>
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 1 }}>
      <Chip label={vehiculo.color} size="small" sx={{ bgcolor: '#f8fafc', color: '#2B6CA3' }} />
    </Box>
    <Typography variant="caption" sx={{ color: '#90a4ae', textAlign: 'center', width: '100%' }}>Entradas: {vehiculo.entradas}</Typography>
    <Fab size="small" color="info" sx={{ position: 'absolute', bottom: 18, right: 18, boxShadow: 2 }} onClick={e => { e.stopPropagation(); onVerInfo(vehiculo); }}>
      <LocalParkingIcon />
    </Fab>
  </MinimalCard>
);

const tiposVehiculo = [
  'carro',
  'moto',
  'bicicleta',
  'camion',
  'otro'
];

const FormVehiculo = ({ open, onClose, initialData, onGuardar, onEliminar }) => {
  const [form, setForm] = useState(initialData || {
    placa: '',
    marca: '',
    modelo: '',
    color: '',
    tipo: '',
    usuario_id: ''
  });

  React.useEffect(() => {
    setForm(initialData || {
      placa: '', marca: '', modelo: '', color: '', tipo: '', usuario_id: ''
    });
  }, [initialData, open]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onGuardar(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Vehículo' : 'Registrar Vehículo'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField margin="normal" fullWidth label="Placa" name="placa" value={form.placa} onChange={handleChange} required disabled={!!initialData} />
          <TextField margin="normal" fullWidth label="Marca" name="marca" value={form.marca} onChange={handleChange} required />
          <TextField margin="normal" fullWidth label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} required />
          <TextField margin="normal" fullWidth label="Color" name="color" value={form.color} onChange={handleChange} required />
          <TextField margin="normal" fullWidth select label="Tipo" name="tipo" value={form.tipo} onChange={handleChange} required>
            {tiposVehiculo.map(tipo => <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>)}
          </TextField>
          <TextField margin="normal" fullWidth label="ID de usuario (opcional)" name="usuario_id" value={form.usuario_id} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          {initialData && (
            <Button color="error" onClick={() => { onEliminar(initialData.placa); onClose(); }}>Eliminar</Button>
          )}
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Guardar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Vehiculos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [openDeleteAll, setOpenDeleteAll] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { vehiculos, loading, error, agregarVehiculo, actualizarVehiculo, eliminarVehiculo } = useVehiculo();
  const { currentUser } = useAuth();

  const handleVerInfo = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setOpenForm(true);
  };

  const handleGuardar = async (data) => {
    if (selectedVehiculo) {
      await actualizarVehiculo(selectedVehiculo.placa, data);
    } else {
      await agregarVehiculo(data);
    }
  };

  const handleEliminar = async (placa) => {
    await eliminarVehiculo(placa);
  };

  const handleEliminarTodos = async () => {
    try {
      const response = await fetch(`https://gest-par-zedic.onrender.com/api/vehiculos/parqueadero/${currentUser.parqueadero_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar los vehículos');
      // Aquí deberías actualizar la lista de vehículos, por ejemplo recargando los datos
      window.location.reload();
      setOpenDeleteAll(false);
    } catch (error) {
      alert(error.message);
    }
  };

  // Filtrado avanzado
  const filteredVehiculos = vehiculos.filter((vehiculo) => {
    const matchGeneral = searchTerm === '' || vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) || (vehiculo.propietario || '').toLowerCase().includes(searchTerm.toLowerCase());
    let matchFecha = true;
    if (dateFrom && vehiculo.fecha) {
      matchFecha = vehiculo.fecha >= dateFrom;
    }
    if (dateTo && matchFecha && vehiculo.fecha) {
      matchFecha = vehiculo.fecha <= dateTo;
    }
    return matchGeneral && matchFecha;
  });

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 5, px: { xs: 1, md: 6 }, bgcolor: '#f6f7fa' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="primary.main">Vehículos</Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteSweepIcon />}
          onClick={() => setOpenDeleteAll(true)}
          sx={{ borderRadius: 3, fontWeight: 600 }}
        >
          Eliminar todos los vehículos
        </Button>
      </Box>
      <MinimalFilterBar>
        <TextField variant="outlined" placeholder="Buscar por nombre o placa" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<SearchIcon sx={{ mr: 1 }} />) }} />
        <TextField type="date" variant="outlined" value={dateFrom} onChange={e => setDateFrom(e.target.value)} label="Desde" InputLabelProps={{ shrink: true }} />
        <TextField type="date" variant="outlined" value={dateTo} onChange={e => setDateTo(e.target.value)} label="Hasta" InputLabelProps={{ shrink: true }} />
      </MinimalFilterBar>
      {loading ? (
        <Typography variant="body1">Cargando vehículos...</Typography>
      ) : error ? (
        <Typography variant="body1" color="error">{error}</Typography>
      ) : (
        <MinimalGrid container spacing={4}>
          {filteredVehiculos.map((vehiculo) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={vehiculo.id}>
              <VehiculoCard vehiculo={vehiculo} onVerInfo={handleVerInfo} />
            </Grid>
          ))}
        </MinimalGrid>
      )}
      <MinimalFab color="primary" aria-label="add" onClick={() => { setSelectedVehiculo(null); setOpenForm(true); }}>
        <AddIcon />
      </MinimalFab>
      <FormVehiculo
        open={openForm}
        onClose={() => setOpenForm(false)}
        initialData={selectedVehiculo}
        onGuardar={handleGuardar}
        onEliminar={handleEliminar}
      />
      <Dialog open={openDeleteAll} onClose={() => setOpenDeleteAll(false)}>
        <DialogTitle>¿Estás seguro de que deseas eliminar todos los vehículos?</DialogTitle>
        <DialogContent>
          <Typography>Eliminarás todos los vehículos de tu parqueadero. Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteAll(false)}>Cancelar</Button>
          <Button onClick={handleEliminarTodos} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vehiculos; 