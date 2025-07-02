import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Paper,
  Checkbox,
  Snackbar,
  Alert
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
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import LinkIcon from '@mui/icons-material/Link';
import { MinimalCard, MinimalIcon, MinimalBadge, MinimalFab, MinimalGrid, MinimalFilterBar } from '../../styles/pages/Vehiculos.styles';
import { useVehiculo } from '../../../logic/VehiculoContext';
import { useAuth } from '../../../logic/AuthContext';
import axios from 'axios';

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

const VehiculoCard = ({ vehiculo, onVerInfo, seleccionado, onSeleccionar }) => (
  <MinimalCard onClick={() => onVerInfo(vehiculo)}>
    <Checkbox
      checked={seleccionado}
      onClick={e => { e.stopPropagation(); onSeleccionar(vehiculo.id); }}
      sx={{ position: 'absolute', top: 10, left: 10, zIndex: 2, p: 0.5 }}
      color="primary"
    />
    <MinimalIcon>
      {getVehiculoIcon(vehiculo.tipo || vehiculo.tipoVehiculo)}
    </MinimalIcon>
    <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#2B6CA3', mb: 0.2, fontSize: 16, textAlign: 'center', width: '100%' }}>{vehiculo.placa}</Typography>
    <Typography variant="body2" sx={{ color: '#64748B', mb: 0.2, fontSize: 13, textAlign: 'center', width: '100%' }}>{vehiculo.propietario}</Typography>
    <Typography variant="body2" sx={{ color: '#2B6CA3', fontWeight: 600, mb: 0.2, fontSize: 13, textAlign: 'center', width: '100%' }}>
      Lugar: {vehiculo.puesto ? vehiculo.puesto : 'No asignado'}
    </Typography>
    <MinimalBadge label={vehiculo.tipoServicio} color="secondary" />
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center', mb: 0.5 }}>
      <Chip label={vehiculo.color} size="small" sx={{ bgcolor: '#f8fafc', color: '#2B6CA3', fontSize: 11 }} />
    </Box>
    <Typography variant="caption" sx={{ color: '#90a4ae', textAlign: 'center', width: '100%', fontSize: 11 }}>Entradas: {vehiculo.entradas}</Typography>
    <Fab size="small" color="info" sx={{ position: 'absolute', bottom: 10, right: 10, boxShadow: 2, minHeight: 28, minWidth: 28, width: 28, height: 28 }} onClick={e => { e.stopPropagation(); onVerInfo(vehiculo); }}>
      <LocalParkingIcon sx={{ fontSize: 16 }} />
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
    usuario_id: '',
    servicio_id: '',
    dueno_nombre: '',
    dueno_telefono: '',
    dueno_email: ''
  });
  const [servicios, setServicios] = useState([]);
  const { currentUser } = useAuth();
  const [placaError, setPlacaError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [duenoError, setDuenoError] = useState('');
  const [puestosDisponibles, setPuestosDisponibles] = useState([]);
  const [capacidad, setCapacidad] = useState(0);

  useEffect(() => {
    const initialFormState = {
      placa: '',
      marca: '',
      modelo: '',
      color: '',
      tipo: '',
      usuario_id: '',
      servicio_id: '',
      dueno_nombre: '',
      dueno_telefono: '',
      dueno_email: ''
    };
    setForm({ ...initialFormState, ...(initialData || {}) });
    if (initialData && initialData.servicio_id) {
      setForm(prevForm => ({ ...prevForm, servicio_id: initialData.servicio_id }));
    }
  }, [initialData, open]);

  useEffect(() => {
    const fetchServicios = async () => {
      if (open && currentUser?.parqueadero_id) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';
          const res = await axios.get(`${apiUrl}/api/servicios/parqueadero/${currentUser.parqueadero_id}`);
          if (res.data && res.data.data) {
            setServicios(res.data.data);
          }
        } catch (e) {
          console.error("Error al cargar servicios:", e);
          setServicios([]);
        }
      }
    };
    fetchServicios();
  }, [currentUser, open]);

  useEffect(() => {
    // Obtener capacidad y puestos ocupados
    const fetchPuestos = async () => {
      if (open && currentUser?.parqueadero_id) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';
          // Obtener capacidad del parqueadero
          const parqueaderoRes = await axios.get(`${apiUrl}/api/parqueaderos/${currentUser.parqueadero_id}`);
          const capacidadParq = parqueaderoRes.data?.data?.capacidad || 0;
          setCapacidad(capacidadParq);
          // Obtener vehículos para saber puestos ocupados
          const vehiculosRes = await axios.get(`${apiUrl}/api/vehiculos?parqueadero_id=${currentUser.parqueadero_id}`);
          const ocupados = vehiculosRes.data?.data?.map(v => v.puesto).filter(Boolean);
          // Si estamos editando, permitir el puesto actual
          let disponibles = [];
          for (let i = 1; i <= capacidadParq; i++) {
            if (!ocupados.includes(i) || (initialData && initialData.puesto === i)) {
              disponibles.push(i);
            }
          }
          setPuestosDisponibles(disponibles);
        } catch (e) {
          setPuestosDisponibles([]);
        }
      }
    };
    fetchPuestos();
  }, [currentUser, open, initialData]);

  const handleChange = e => {
    if (e.target.name === 'placa') {
      let value = e.target.value.toUpperCase();
      if (value.length > 6) {
        setPlacaError('La placa debe tener máximo 6 caracteres');
        value = value.slice(0, 6);
      } else {
        setPlacaError('');
      }
      setForm({ ...form, placa: value });
    } else if (["tipo", "marca", "modelo", "color", "dueno_nombre"].includes(e.target.name)) {
      setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.usuario_id && !form.dueno_nombre.trim()) {
      setDuenoError('El nombre del dueño es obligatorio si no hay usuario.');
      return;
    }
    setDuenoError('');
    onGuardar(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {getVehiculoIcon(form.tipo)}
        {initialData ? 'Editar Vehículo' : 'Registrar Vehículo'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField margin="normal" fullWidth label="Placa" name="placa" value={form.placa} onChange={handleChange} required disabled={!!initialData}
            inputProps={{ maxLength: 6 }}
            error={!!placaError}
            helperText={placaError || 'Máximo 6 caracteres. Solo mayúsculas.'}
          />
          <TextField margin="normal" fullWidth select label="Tipo *" name="tipo" value={form.tipo} onChange={handleChange} required>
            <MenuItem value="">Selecciona un tipo</MenuItem>
            {tiposVehiculo.map(tipo => <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>)}
          </TextField>
          {/* Campos adicionales según el tipo de vehículo */}
          {form.tipo === 'carro' && (
            <TextField margin="normal" fullWidth label="Número de puertas" name="puertas" value={form.puertas || ''} onChange={e => setForm({ ...form, puertas: e.target.value })} />
          )}
          {form.tipo === 'moto' && (
            <TextField margin="normal" fullWidth label="Cilindraje (cc)" name="cilindraje" value={form.cilindraje || ''} onChange={e => setForm({ ...form, cilindraje: e.target.value })} />
          )}
          {form.tipo === 'bicicleta' && (
            <TextField margin="normal" fullWidth label="Tipo de bicicleta" name="tipo_bicicleta" value={form.tipo_bicicleta || ''} onChange={e => setForm({ ...form, tipo_bicicleta: e.target.value })} />
          )}
          {form.tipo === 'camion' && (
            <TextField margin="normal" fullWidth label="Capacidad de carga (kg)" name="capacidad_carga" value={form.capacidad_carga || ''} onChange={e => setForm({ ...form, capacidad_carga: e.target.value })} />
          )}
          <TextField margin="normal" fullWidth select label="Servicio" name="servicio_id" value={form.servicio_id} onChange={handleChange} required>
            {servicios.map(servicio => (
              <MenuItem key={servicio.id} value={servicio.id}>{servicio.nombre}</MenuItem>
            ))}
          </TextField>
          <TextField margin="normal" fullWidth label="ID de usuario (opcional)" name="usuario_id" value={form.usuario_id} onChange={handleChange} />
          {!form.usuario_id && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Datos del dueño (si no está registrado):</Typography>
              <TextField margin="dense" fullWidth label="Nombre del dueño" name="dueno_nombre" value={form.dueno_nombre} onChange={handleChange} required={!form.usuario_id} error={!!duenoError} helperText={duenoError} />
              <TextField margin="dense" fullWidth label="Teléfono del dueño" name="dueno_telefono" value={form.dueno_telefono} onChange={handleChange} />
              <TextField margin="dense" fullWidth label="Email del dueño" name="dueno_email" value={form.dueno_email} onChange={handleChange} />
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Button variant="text" onClick={() => setShowDetails(v => !v)}>
              {showDetails ? 'Ocultar detalles del vehículo' : 'Agregar detalles del vehículo'}
            </Button>
          </Box>
          {showDetails && (
            <Box sx={{ mt: 1 }}>
              <TextField margin="dense" fullWidth label="Marca" name="marca" value={form.marca} onChange={handleChange} />
              <TextField margin="dense" fullWidth label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} />
              <TextField margin="dense" fullWidth label="Color" name="color" value={form.color} onChange={handleChange} />
            </Box>
          )}
          <TextField margin="normal" fullWidth select label="Puesto" name="puesto" value={form.puesto || ''} onChange={handleChange} required>
            <MenuItem value="">No asignado</MenuItem>
            {puestosDisponibles.map(p => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          {initialData && (
            <Button color="error" onClick={() => { onEliminar(initialData.placa); onClose(); }}>Eliminar</Button>
          )}
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={!!placaError || (form.placa || '').length !== 6}>Guardar</Button>
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
  const [usuarioBuscado, setUsuarioBuscado] = useState(null);
  const [vehiculosUsuario, setVehiculosUsuario] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [openFormUsuario, setOpenFormUsuario] = useState(false);
  const [vehiculoParaAsociar, setVehiculoParaAsociar] = useState(null);
  const [openAsociar, setOpenAsociar] = useState(false);
  const [parqueaderos, setParqueaderos] = useState([]);
  const [parqueaderoSeleccionado, setParqueaderoSeleccionado] = useState('');
  const [asociarMsg, setAsociarMsg] = useState('');
  const [parqueaderosUsuario, setParqueaderosUsuario] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [openConfirmarEliminar, setOpenConfirmarEliminar] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { vehiculos, loading, error, agregarVehiculo, actualizarVehiculo, eliminarVehiculo, cargarVehiculos } = useVehiculo();
  const { currentUser } = useAuth();
  const [busquedaUsuarioActiva, setBusquedaUsuarioActiva] = useState(false);

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

  // Buscar usuario por correo o ID
  const handleBuscarUsuario = async () => {
    setSearchError('');
    setUsuarioBuscado(null);
    setVehiculosUsuario([]);
    setParqueaderosUsuario([]);
    if (!searchTerm.trim()) return;
    try {
      let res;
      if (searchTerm.includes('@')) {
        res = await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/correo/${searchTerm}`);
      } else if (!isNaN(Number(searchTerm))) {
        res = await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/${searchTerm}`);
      } else {
        setSearchError('Solo puedes buscar por ID numérico o correo electrónico.');
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Usuario no encontrado');
      setUsuarioBuscado(data.data);
      // Buscar vehículos de ese usuario
      const vehRes = await fetch(`https://gest-par-zedic.onrender.com/api/vehiculos?usuario_id=${data.data.id}`);
      const vehData = await vehRes.json();
      setVehiculosUsuario(vehData.data || []);
      setBusquedaUsuarioActiva(true);
    } catch (err) {
      setSearchError(err.message || 'Usuario no encontrado');
    }
  };

  // Registrar vehículo para usuario buscado
  const handleRegistrarVehiculoUsuario = async (form) => {
    try {
      const body = { ...form, usuario_id: usuarioBuscado.id };
      const res = await fetch('https://gest-par-zedic.onrender.com/api/vehiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setOpenFormUsuario(false);
      // Refrescar lista
      handleBuscarUsuario();
    } catch (e) {
      alert('Error al registrar vehículo: ' + e.message);
    }
  };

  // Asociar vehículo existente a parqueadero
  const handleAsociarVehiculo = async () => {
    if (!vehiculoParaAsociar || !currentUser?.parqueadero_id) return;
    try {
      // 1. Obtener datos completos del vehículo
      const resGet = await fetch(`https://gest-par-zedic.onrender.com/api/vehiculos/placa/${vehiculoParaAsociar.placa}`);
      const vehiculoData = await resGet.json();
      if (!vehiculoData.success || !vehiculoData.data) throw new Error('No se pudo obtener datos del vehículo');
      // 2. Hacer PUT con todos los campos, cambiando solo parqueadero_id
      const body = { ...vehiculoData.data, parqueadero_id: currentUser.parqueadero_id };
      const res = await fetch(`https://gest-par-zedic.onrender.com/api/vehiculos/${vehiculoParaAsociar.placa}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setAsociarMsg('Vehículo asociado correctamente');
      setTimeout(() => { setOpenAsociar(false); setAsociarMsg(''); handleBuscarUsuario(); cargarVehiculos(); }, 1200);
    } catch (e) {
      setAsociarMsg('Error: ' + e.message);
    }
  };

  const handleSeleccionar = (id) => {
    setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleEliminarSeleccionados = async () => {
    try {
      for (const id of seleccionados) {
        const veh = vehiculos.find(v => v.id === id);
        if (veh) await eliminarVehiculo(veh.placa);
      }
      setSeleccionados([]);
      setOpenConfirmarEliminar(false);
      setSnackbar({ open: true, message: 'Vehículos eliminados correctamente', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al eliminar vehículos', severity: 'error' });
    }
  };

  // Botón para limpiar búsqueda
  const limpiarBusquedaUsuario = () => {
    setUsuarioBuscado(null);
    setVehiculosUsuario([]);
    setBusquedaUsuarioActiva(false);
    setSearchTerm('');
    setSearchError('');
  };

  // En el render, si hay búsqueda activa, mostrar solo los vehículos del usuario
  const vehiculosParaMostrar = busquedaUsuarioActiva && usuarioBuscado ? vehiculosUsuario : filteredVehiculos;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: { xs: 2, md: 5 }, px: { xs: 0.5, sm: 2, md: 6 }, bgcolor: '#f6f7fa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: { xs: '100vw', md: 1500, lg: 1700 },
        borderRadius: 0,
        bgcolor: '#fff',
        boxShadow: { xs: '0 2px 8px rgba(52,152,243,0.08)', md: '0 6px 32px rgba(52,152,243,0.10)' },
        px: { xs: 1, sm: 2, md: 6, lg: 10 },
        py: { xs: 2, md: 5 },
        mt: { xs: 1, md: 4 },
        mb: { xs: 2, md: 4 },
      }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: { xs: 2, md: 4 }, gap: 2 }}>
          <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ mb: { xs: 1, sm: 0 } }}>Vehículos</Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={() => setOpenDeleteAll(true)}
            sx={{ borderRadius: 3, fontWeight: 600, display: { xs: 'none', md: 'flex' } }}
          >
            Eliminar todos los vehículos
          </Button>
        </Box>
        <MinimalFilterBar sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 2 }, mb: { xs: 2, md: 3 } }}>
          <TextField variant="outlined" placeholder="Buscar por nombre, placa o usuario (ID, correo)" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<SearchIcon sx={{ mr: 1 }} />) }} size="small" sx={{ flex: 2, minWidth: 180 }} />
          <TextField type="date" variant="outlined" value={dateFrom} onChange={e => setDateFrom(e.target.value)} label="Desde" InputLabelProps={{ shrink: true }} size="small" sx={{ minWidth: 120 }} />
          <TextField type="date" variant="outlined" value={dateTo} onChange={e => setDateTo(e.target.value)} label="Hasta" InputLabelProps={{ shrink: true }} size="small" sx={{ minWidth: 120 }} />
          <Button variant="contained" size="large" sx={{ minWidth: 120, fontWeight: 700 }} onClick={handleBuscarUsuario}>Buscar usuario</Button>
        </MinimalFilterBar>
        {searchError && (
          <Typography color="error" sx={{ mb: 2, ml: 1, fontWeight: 600, fontSize: 15 }}>{searchError}</Typography>
        )}
        {loading ? (
          <Typography variant="body1">Cargando vehículos...</Typography>
        ) : error ? (
          <Typography variant="body1" color="error">{error}</Typography>
        ) : (
          <Box sx={{ width: '100%', overflowX: 'auto', mt: 3 }}>
            <Box sx={{ minWidth: 700, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 2px 12px rgba(31,38,135,0.07)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1.5px solid #e3eaf6', position: 'sticky', top: 0, zIndex: 2, bgcolor: '#fff' }}>
                <Checkbox disabled sx={{ mr: 1 }} />
                <Box sx={{ width: 44, mr: 2 }} />
                <Box sx={{ flex: 2, fontWeight: 700, color: '#2563eb' }}>Placa</Box>
                <Box sx={{ flex: 1.2, color: '#64748B', fontWeight: 600 }}>Tipo</Box>
                <Box sx={{ flex: 1, color: '#64748B', fontWeight: 600 }}>Lugar</Box>
                <Box sx={{ flex: 1, color: '#64748B', fontWeight: 600 }}>Color</Box>
                <Box sx={{ flex: 1, color: '#64748B', fontWeight: 600 }}>Entradas</Box>
                <Box sx={{ flex: 0.5 }}></Box>
              </Box>
              {vehiculosParaMostrar.map((vehiculo) => (
                <Box key={vehiculo.id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #f0f4fa', transition: 'background 0.18s', '&:hover': { background: '#f4f8fd' } }}>
                  <Checkbox
                    checked={seleccionados.includes(vehiculo.id)}
                    onClick={e => { e.stopPropagation(); handleSeleccionar(vehiculo.id); }}
                    sx={{ mr: 1 }}
                    color="primary"
                  />
                  <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#e3eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                    {getVehiculoIcon(vehiculo.tipo || vehiculo.tipoVehiculo)}
                  </Box>
                  <Box sx={{ flex: 2, fontWeight: 700, color: '#2563eb', fontSize: 16 }}>{vehiculo.placa}</Box>
                  <Box sx={{ flex: 1.2, color: '#64748B', fontWeight: 500 }}>{vehiculo.tipo || vehiculo.tipoVehiculo}</Box>
                  <Box sx={{ flex: 1, color: '#2B6CA3', fontWeight: 600 }}>{vehiculo.puesto ? vehiculo.puesto : 'No asignado'}</Box>
                  <Box sx={{ flex: 1 }}><Chip label={vehiculo.color} size="small" sx={{ bgcolor: '#f8fafc', color: '#2B6CA3', fontSize: 13 }} /></Box>
                  <Box sx={{ flex: 1, color: '#90a4ae', fontWeight: 500 }}>{vehiculo.entradas}</Box>
                  <Box sx={{ flex: 0.5, display: 'flex', justifyContent: 'flex-end' }}>
                    {busquedaUsuarioActiva && usuarioBuscado && vehiculo.parqueadero_id !== currentUser?.parqueadero_id ? (
                      <Button size="small" color="primary" variant="contained" sx={{ minWidth: 32, px: 1.5 }} onClick={() => { setVehiculoParaAsociar(vehiculo); setOpenAsociar(true); }}>
                        Asociar
                      </Button>
                    ) : (
                      <Button size="small" color="info" variant="outlined" sx={{ minWidth: 32, px: 1.5 }} onClick={() => handleVerInfo(vehiculo)}>
                        Info
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteSweepIcon />}
          onClick={() => setOpenDeleteAll(true)}
          sx={{ borderRadius: 3, fontWeight: 600, display: { xs: 'flex', md: 'none' }, mt: 2, width: '100%' }}
        >
          Eliminar todos los vehículos
        </Button>
      </Paper>
      {seleccionados.length > 0 && (
        <Fab
          color="error"
          variant="extended"
          sx={{ position: 'fixed', bottom: { xs: 80, md: 100 }, right: 24, zIndex: 200, minWidth: 180 }}
          onClick={() => setOpenConfirmarEliminar(true)}
        >
          <DeleteSweepIcon sx={{ mr: 1 }} />
          Eliminar seleccionados ({seleccionados.length})
        </Fab>
      )}
      <MinimalFab color="primary" aria-label="add" onClick={() => { setSelectedVehiculo(null); setOpenForm(true); }} sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 150 }}>
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
      {usuarioBuscado && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} color="#2563eb">Usuario encontrado:</Typography>
          <Typography>Nombre: <b>{usuarioBuscado.nombre}</b></Typography>
          <Typography>Correo: <b>{usuarioBuscado.correo}</b></Typography>
          <Typography>ID: <b>{usuarioBuscado.id}</b></Typography>
          <Typography>Tipo: <b>{usuarioBuscado.tipo_usuario}</b></Typography>
          {busquedaUsuarioActiva && vehiculosUsuario.length > 0 && (
            <Typography sx={{ ml: 2 }} color="primary">Vehículos de este usuario listados abajo. Puedes asociarlos a tu parqueadero si no lo están.</Typography>
          )}
        </Box>
      )}
      <FormVehiculo
        open={openFormUsuario}
        onClose={() => setOpenFormUsuario(false)}
        initialData={{ usuario_id: usuarioBuscado?.id || '' }}
        onGuardar={handleRegistrarVehiculoUsuario}
        onEliminar={null}
      />
      <Dialog open={openAsociar} onClose={() => setOpenAsociar(false)}>
        <DialogTitle>Asociar vehículo a parqueadero</DialogTitle>
        <DialogContent>
          <Typography>Vehículo: {vehiculoParaAsociar?.placa}</Typography>
          {currentUser?.parqueadero_id ? (
            <Typography sx={{ mt: 2 }}>¿Deseas asociar este vehículo a tu parqueadero actual?</Typography>
          ) : (
            <Typography color="error" sx={{ mt: 2 }}>No tienes un parqueadero asignado.</Typography>
          )}
          {asociarMsg && <Typography color={asociarMsg.startsWith('Error') ? 'error' : 'primary'} sx={{ mt: 2 }}>{asociarMsg}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAsociar(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAsociarVehiculo} disabled={!currentUser?.parqueadero_id}>Asociar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmarEliminar} onClose={() => setOpenConfirmarEliminar(false)}>
        <DialogTitle>¿Eliminar vehículos seleccionados?</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar los vehículos seleccionados? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmarEliminar(false)}>Cancelar</Button>
          <Button onClick={handleEliminarSeleccionados} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
      {busquedaUsuarioActiva && usuarioBuscado && (
        <Button variant="outlined" color="primary" sx={{ ml: 2, mb: 1 }} onClick={limpiarBusquedaUsuario}>
          Limpiar búsqueda
        </Button>
      )}
    </Box>
  );
};

export default Vehiculos; 