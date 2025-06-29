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

const VehiculoCard = ({ vehiculo, onVerInfo }) => (
  <MinimalCard onClick={() => onVerInfo(vehiculo)}>
    <MinimalIcon>
      {getVehiculoIcon(vehiculo.tipoVehiculo)}
    </MinimalIcon>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, color: '#2B6CA3', mt: 1 }}>{vehiculo.placa}</Typography>
    <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>{vehiculo.propietario}</Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1, minHeight: 40, justifyContent: 'center' }}>
      <Typography variant="body2" sx={{ color: '#2B6CA3', fontWeight: 600, mb: 0.5, minHeight: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Lugar: {vehiculo.puesto ? vehiculo.puesto : 'No asignado'}
      </Typography>
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
      <DialogTitle>{initialData ? 'Editar Vehículo' : 'Registrar Vehículo'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField margin="normal" fullWidth label="Placa" name="placa" value={form.placa} onChange={handleChange} required disabled={!!initialData}
            inputProps={{ maxLength: 6 }}
            error={!!placaError}
            helperText={placaError || 'Máximo 6 caracteres. Solo mayúsculas.'}
          />
          <TextField margin="normal" fullWidth select label="Tipo" name="tipo" value={form.tipo} onChange={handleChange} required>
            {tiposVehiculo.map(tipo => <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>)}
          </TextField>
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
  const [searchUser, setSearchUser] = useState('');
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { vehiculos, loading, error, agregarVehiculo, actualizarVehiculo, eliminarVehiculo, cargarVehiculos } = useVehiculo();
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

  // Buscar usuario por correo o ID
  const handleBuscarUsuario = async () => {
    setSearchError('');
    setUsuarioBuscado(null);
    setVehiculosUsuario([]);
    setParqueaderosUsuario([]);
    if (!searchUser.trim()) return;
    try {
      let res;
      if (searchUser.includes('@')) {
        res = await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/correo/${searchUser}`);
      } else {
        res = await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/${searchUser}`);
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Usuario no encontrado');
      setUsuarioBuscado(data.data);
      // Buscar vehículos de ese usuario
      const vehRes = await fetch(`https://gest-par-zedic.onrender.com/api/vehiculos?usuario_id=${data.data.id}`);
      const vehData = await vehRes.json();
      setVehiculosUsuario(vehData.data || []);
      // Buscar parqueaderos de ese usuario
      const parqRes = await fetch(`https://gest-par-zedic.onrender.com/api/parqueaderos/usuario/${data.data.id}`);
      const parqData = await parqRes.json();
      if (parqData.success && parqData.data) {
        // Puede ser objeto o array
        setParqueaderosUsuario(Array.isArray(parqData.data) ? parqData.data : [parqData.data]);
      }
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
      {/* Búsqueda de usuario */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="Buscar usuario por correo o ID"
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleBuscarUsuario}>Buscar</Button>
        {searchError && <Typography color="error">{searchError}</Typography>}
      </Box>
      {usuarioBuscado && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>Usuario encontrado:</Typography>
          <Typography>Nombre: {usuarioBuscado.nombre}</Typography>
          <Typography>Correo: {usuarioBuscado.correo}</Typography>
          <Typography>ID: {usuarioBuscado.id}</Typography>
          <Typography>Tipo: {usuarioBuscado.tipo_usuario}</Typography>
          <Box sx={{ display: 'flex', gap: 2, my: 1 }}>
            <Button variant="contained" startIcon={<PlaylistAddIcon />} onClick={() => setOpenFormUsuario(true)}>
              Registrar vehículo
            </Button>
          </Box>
          <Typography sx={{ mt: 1, fontWeight: 700 }}>Vehículos de este usuario:</Typography>
          {vehiculosUsuario.length === 0 ? (
            <Typography>No tiene vehículos registrados.</Typography>
          ) : (
            vehiculosUsuario.map(v => (
              <Box key={v.id || v.placa} sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1, p: 1, bgcolor: '#fff', borderRadius: 1 }}>
                <DirectionsCarIcon color="primary" />
                <Typography>{v.placa} - {v.tipo} - {v.marca} - {v.modelo}</Typography>
                <Button size="small" variant="outlined" startIcon={<LinkIcon />} onClick={() => { setVehiculoParaAsociar(v); setOpenAsociar(true); }}>
                  Asociar a parqueadero
                </Button>
              </Box>
            ))
          )}
        </Box>
      )}
      {/* Modal registrar vehículo para usuario */}
      <FormVehiculo
        open={openFormUsuario}
        onClose={() => setOpenFormUsuario(false)}
        initialData={{ usuario_id: usuarioBuscado?.id || '' }}
        onGuardar={handleRegistrarVehiculoUsuario}
        onEliminar={null}
      />
      {/* Modal asociar vehículo a parqueadero */}
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
    </Box>
  );
};

export default Vehiculos; 