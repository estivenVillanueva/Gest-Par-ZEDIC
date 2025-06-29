import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  Fab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  Checkbox,
  Tooltip,
  Switch
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  TabPanelContainer,
  ElegantPaper,
  ElegantCard,
  TabsContainer,
  ElegantSearchBar,
  ElegantContent,
  ElegantFab
} from '../../styles/pages/Pagos.styles';
import { useAuth } from '../../../logic/AuthContext.jsx';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FacturaPreview from '../../components/payment/FacturaPreview';

const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';
const DEFAULT_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Parking_icon.svg';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <TabPanelContainer>{children}</TabPanelContainer>}
  </div>
);

const PagoCard = ({ pago, onCardClick, isPending, selectable, checked, onSelectChange }) => {
  const isVencida = isPending && new Date(pago.fecha_vencimiento) < new Date();
  const diasRestantes = isPending ? Math.ceil((new Date(pago.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const porVencer = isPending && diasRestantes !== null && diasRestantes <= 3 && diasRestantes >= 0;
  
  const formatDate = (dateString) => {
    return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  // Lógica para mostrar nombre y datos de contacto
  let nombreMostrado = pago.usuario_nombre && pago.usuario_nombre.trim() !== '' ? pago.usuario_nombre : 'Dueño no registrado';
  let detallesContacto = '';
  if ((!pago.usuario_id || !pago.usuario_nombre) && (pago.dueno_telefono || pago.dueno_email)) {
    detallesContacto = [pago.dueno_telefono, pago.dueno_email].filter(Boolean).join(' | ');
  }

  // Badge visual
  let badgeColor = 'warning';
  let badgeLabel = 'Pendiente';
  let badgeIcon = <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />;
  if (isVencida) {
    badgeColor = 'error';
    badgeLabel = 'Vencido';
    badgeIcon = <WarningAmberIcon fontSize="small" sx={{ mr: 0.5 }} />;
  } else if (pago.estado === 'pagada') {
    badgeColor = 'success';
    badgeLabel = 'Pagado';
    badgeIcon = <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />;
  } else if (porVencer) {
    badgeColor = 'info';
    badgeLabel = 'Por vencer';
    badgeIcon = <WarningAmberIcon fontSize="small" sx={{ mr: 0.5, color: '#ff9800' }} />;
  }

  return (
    <ElegantCard onClick={onCardClick} sx={{ 
      borderLeft: isVencida ? '4px solid #f44336' : porVencer ? '4px solid #ff9800' : (isPending ? '4px solid #ff9800' : '4px solid #4caf50'),
      cursor: isPending ? 'pointer' : 'default',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: isPending ? 'scale(1.02)' : 'none'
      },
      position: 'relative',
      mb: 2,
      boxShadow: 2,
      borderRadius: 1,
      '@media (max-width:600px)': { px: 1, py: 1 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {selectable && (
            <Checkbox
              checked={checked}
              onChange={onSelectChange}
              sx={{ mr: 1 }}
              onClick={e => e.stopPropagation()}
            />
          )}
          <Box>
            <Tooltip title={detallesContacto || ''} arrow disableHoverListener={!detallesContacto}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#2B6CA3', mb: 0.5, wordBreak: 'break-all' }}>
                {pago.servicio_nombre} - {pago.placa} ({nombreMostrado})
              </Typography>
            </Tooltip>
            {detallesContacto && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {detallesContacto}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {isPending 
                ? `Vence: ${formatDate(pago.fecha_vencimiento)}`
                : `Pagado: ${formatDate(pago.fecha_pago)}`
              }
            </Typography>
            <Chip
              icon={badgeIcon}
              label={badgeLabel}
              color={badgeColor}
              size="small"
              sx={{ mt: 1, fontWeight: 700, fontSize: 14, px: 1.5, py: 0.5 }}
            />
            {porVencer && !isVencida && (
              <Typography variant="caption" color="#ff9800" sx={{ ml: 1, fontWeight: 700 }}>
                ¡Por vencer en {diasRestantes} día{diasRestantes === 1 ? '' : 's'}!
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Typography variant="h6" fontWeight={800} sx={{ color: isVencida ? '#f44336' : porVencer ? '#ff9800' : 'primary.main', minWidth: 110, textAlign: 'right' }}>
            ${parseInt(pago.total, 10).toLocaleString('es-CO')}
          </Typography>
          {isPending && (
            <Button variant="contained" color="primary" size="small" sx={{ mt: 1 }} onClick={onCardClick}>
              Marcar como pagada
            </Button>
          )}
        </Box>
      </Box>
    </ElegantCard>
  );
};

const FormularioPago = ({ open, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    placa: '',
    nombreCliente: '',
    tipoVehiculo: '',
    puesto: '',
    color: '',
    tipoServicio: '',
    entradas: '',
  });
  const [conFactura, setConFactura] = useState(false);
  const [detalles, setDetalles] = useState([
    { servicio_id: '', cantidad: 1, precio_unitario: '', subtotal: '' }
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDetalleChange = (idx, field, value) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[idx][field] = value;
    if (field === 'cantidad' || field === 'precio_unitario') {
      const cantidad = parseFloat(nuevosDetalles[idx].cantidad) || 0;
      const precio = parseFloat(nuevosDetalles[idx].precio_unitario) || 0;
      nuevosDetalles[idx].subtotal = (cantidad * precio).toFixed(2);
    }
    setDetalles(nuevosDetalles);
  };

  const handleAddDetalle = () => {
    setDetalles([...detalles, { servicio_id: '', cantidad: 1, precio_unitario: '', subtotal: '' }]);
  };

  const handleRemoveDetalle = (idx) => {
    setDetalles(detalles.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (conFactura) {
      onGuardar({ ...formData, detalles });
    } else {
      onGuardar(formData);
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: '#f5f5f7',
        }
      }}
    >
      <DialogTitle align="center" pt={3}>
        <Typography variant="h6">Información de Pago</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="nombre cliente"
                name="nombreCliente"
                value={formData.nombreCliente}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="tipo de vehiculo"
                name="tipoVehiculo"
                value={formData.tipoVehiculo}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="puesto"
                name="puesto"
                value={formData.puesto}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="placa"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="tipo de servicio"
                name="tipoServicio"
                value={formData.tipoServicio}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #b39ddb' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="entras y salidas registradas"
                name="entradas"
                value={formData.entradas}
                onChange={handleChange}
                multiline
                rows={2}
                variant="outlined"
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
              <Switch checked={conFactura} onChange={e => setConFactura(e.target.checked)} />
              <Typography variant="body1" sx={{ ml: 1 }}>¿Desea factura?</Typography>
            </Box>
            {conFactura && (
              <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Detalles de la factura</Typography>
                {detalles.map((detalle, idx) => (
                  <Grid container spacing={1} alignItems="center" key={idx} sx={{ mb: 1 }}>
                    <Grid item xs={4}>
                      <TextField
                        label="Servicio ID"
                        name="servicio_id"
                        value={detalle.servicio_id}
                        onChange={e => handleDetalleChange(idx, 'servicio_id', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Cantidad"
                        type="number"
                        name="cantidad"
                        value={detalle.cantidad}
                        onChange={e => handleDetalleChange(idx, 'cantidad', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Precio unitario"
                        type="number"
                        name="precio_unitario"
                        value={detalle.precio_unitario}
                        onChange={e => handleDetalleChange(idx, 'precio_unitario', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Subtotal"
                        name="subtotal"
                        value={detalle.subtotal}
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Button color="error" onClick={() => handleRemoveDetalle(idx)} disabled={detalles.length === 1}>-</Button>
                    </Grid>
                  </Grid>
                ))}
                <Button variant="outlined" onClick={handleAddDetalle}>Agregar detalle</Button>
              </Box>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">{conFactura ? 'Guardar y facturar' : 'Guardar'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const PagarDialog = ({ open, onClose, onConfirm, factura }) => {
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [parqueadero, setParqueadero] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [vehiculo, setVehiculo] = useState(null);
  const [numIngresos, setNumIngresos] = useState(0);
  const [numSalidas, setNumSalidas] = useState(0);

  useEffect(() => {
    const fetchParqueadero = async () => {
      if (factura && factura.parqueadero_id) {
        try {
          const res = await fetch(`${API_URL}/api/facturas/completa/${factura.id}`);
          const data = await res.json();
          setParqueadero(data.parqueadero);
          setDetalles(data.detalles);
          setVehiculo(data.vehiculo);
          setNumIngresos(data.numIngresos);
          setNumSalidas(data.numSalidas);
        } catch (err) {
          setParqueadero(null);
          setDetalles([]);
          setVehiculo(null);
          setNumIngresos(0);
          setNumSalidas(0);
        }
      }
    };
    fetchParqueadero();
  }, [factura]);

  if (!factura) return null;

  // Imprimir solo el modal
  const handleImprimir = () => {
    window.print();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Factura</DialogTitle>
      <DialogContent>
        <FacturaPreview
          factura={factura}
          parqueadero={parqueadero}
          vehiculo={vehiculo}
          detalles={detalles}
          numIngresos={numIngresos}
          numSalidas={numSalidas}
        />
        <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={handleImprimir}>
          Imprimir factura
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onConfirm(metodoPago)} variant="contained" color="primary">
          Confirmar Pago
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const estados = [
  { value: '', label: 'Todos' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'vencida', label: 'Vencida' },
  { value: 'pagada', label: 'Pagada' }
];

const Pagos = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagosPendientes, setPagosPendientes] = useState([]);
  const [pagosHistorial, setPagosHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [tipoServicio, setTipoServicio] = useState('');
  const [estado, setEstado] = useState('');
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [selectedPagos, setSelectedPagos] = useState([]);
  
  const { currentUser } = useAuth();
  
  const fetchPagos = async () => {
    const parqueaderoId = currentUser?.parqueadero_id;
    if (!parqueaderoId || isNaN(parseInt(parqueaderoId, 10))) {
      setError("No se pudo obtener el identificador del parqueadero.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [pendientesRes, historialRes] = await Promise.all([
        axios.get(`${API_URL}/api/pagos/pendientes/${parqueaderoId}`),
        axios.get(`${API_URL}/api/pagos/historial/${parqueaderoId}`)
      ]);
      setPagosPendientes(pendientesRes.data);
      setPagosHistorial(historialRes.data);
    } catch (e) {
      setError('Error al cargar los pagos. Por favor, intente de nuevo más tarde.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, [currentUser]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/servicios`);
        if (res.data && res.data.data) {
          setServiciosDisponibles(res.data.data);
        }
      } catch (e) {
        setServiciosDisponibles([]);
      }
    };
    fetchServicios();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (factura) => {
    setSelectedFactura(factura);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedFactura(null);
    setDialogOpen(false);
  };

  const handleConfirmarPago = async (metodo_pago) => {
    if (!selectedFactura) return;
    try {
      await axios.put(`${API_URL}/api/pagos/${selectedFactura.id}/pagar`, { metodo_pago });
      handleCloseDialog();
      fetchPagos(); // Recargar datos
    } catch (e) {
      console.error('Error al marcar como pagado:', e);
      setError('No se pudo completar el pago.');
    }
  };

  const handleSelectPago = (id) => {
    setSelectedPagos((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (pagos) => {
    if (selectedPagos.length === pagos.length) {
      setSelectedPagos([]);
    } else {
      setSelectedPagos(pagos.map((p) => p.id));
    }
  };

  const handleMarcarSeleccionados = async () => {
    for (const id of selectedPagos) {
      try {
        await axios.put(`${API_URL}/api/pagos/${id}/pagar`, { metodo_pago: 'efectivo' });
      } catch (e) {
        // Manejar error individual si se desea
      }
    }
    setSelectedPagos([]);
    fetchPagos();
  };

  const filterItems = (items) => {
    return items.filter((p) => {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const matchSearch =
        p.servicio_nombre.toLowerCase().includes(lowerCaseSearch) ||
        p.placa.toLowerCase().includes(lowerCaseSearch) ||
        (p.usuario_nombre && p.usuario_nombre.toLowerCase().includes(lowerCaseSearch));
      const matchTipo = tipoServicio ? p.servicio_nombre === tipoServicio : true;
      const matchEstado = estado ? p.estado === estado : true;
      const matchFechaDesde = fechaDesde ? new Date(p.fecha_vencimiento || p.fecha_pago) >= new Date(fechaDesde) : true;
      const matchFechaHasta = fechaHasta ? new Date(p.fecha_vencimiento || p.fecha_pago) <= new Date(fechaHasta) : true;
      return matchSearch && matchTipo && matchEstado && matchFechaDesde && matchFechaHasta;
    });
  };

  const renderContent = (items, isPendingTab) => {
    if (!items || items.length === 0) {
      return <Typography sx={{ textAlign: 'center', p: 4 }}>No hay pagos para mostrar.</Typography>;
    }

    if (isPendingTab) {
      // Agrupar y ordenar
      const vencidos = items.filter(p => new Date(p.fecha_vencimiento) < new Date()).sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento));
      const pendientes = items.filter(p => new Date(p.fecha_vencimiento) >= new Date()).sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento));
      const allPendientes = [...vencidos, ...pendientes];
      return <>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Checkbox
            checked={selectedPagos.length === allPendientes.length && allPendientes.length > 0}
            indeterminate={selectedPagos.length > 0 && selectedPagos.length < allPendientes.length}
            onChange={() => handleSelectAll(allPendientes)}
            sx={{ mr: 1 }}
          />
          <Typography variant="body1">Seleccionar todos</Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ ml: 2 }}
            disabled={selectedPagos.length === 0}
            onClick={handleMarcarSeleccionados}
          >
            Marcar seleccionados como pagados
          </Button>
        </Box>
        {vencidos.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#ffeaea', borderRadius: 2, px: 2, py: 1, mb: 1 }}>
            <WarningAmberIcon sx={{ color: '#f44336', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ color: '#f44336', fontWeight: 700 }}>
              Vencidos
            </Typography>
          </Box>
        )}
        {vencidos.map((pago) => (
          <PagoCard
            key={pago.id}
            pago={pago}
            onCardClick={isPendingTab ? () => handleOpenDialog(pago) : undefined}
            isPending={isPendingTab}
            selectable
            checked={selectedPagos.includes(pago.id)}
            onSelectChange={() => handleSelectPago(pago.id)}
          />
        ))}
        {pendientes.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff8e1', borderRadius: 2, px: 2, py: 1, mt: 3, mb: 1 }}>
            <AccessTimeIcon sx={{ color: '#ff9800', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ color: '#ff9800', fontWeight: 700 }}>
              Pendientes
            </Typography>
          </Box>
        )}
        {pendientes.map((pago) => (
          <PagoCard
            key={pago.id}
            pago={pago}
            onCardClick={isPendingTab ? () => handleOpenDialog(pago) : undefined}
            isPending={isPendingTab}
            selectable
            checked={selectedPagos.includes(pago.id)}
            onSelectChange={() => handleSelectPago(pago.id)}
          />
        ))}
      </>;
    } else {
      // Historial: ordenar por fecha de pago descendente
      const pagados = [...items].sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));
      return pagados.map((pago) => (
        <PagoCard
          key={pago.id}
          pago={pago}
          isPending={false}
        />
      ));
    }
  };
  
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 5, px: { xs: 1, md: 6 }, bgcolor: '#f6f7fa' }}>
      <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 4 }}>Gestión de Pagos</Typography>
      <ElegantPaper sx={{ maxWidth: 1100, mx: 'auto', p: 0 }}>
        <TabsContainer>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Pendientes" />
            <Tab label="Historial" />
          </Tabs>
        </TabsContainer>

        <ElegantContent>
          <ElegantPaper sx={{ mb: 2, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3} md={3}>
                <TextField
                  fullWidth
                  label="Buscar por servicio, placa o cliente..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={3} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de servicio"
                  value={tipoServicio}
                  onChange={e => setTipoServicio(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {serviciosDisponibles.map(s => (
                    <MenuItem key={s.nombre} value={s.nombre}>{s.nombre}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2} md={2}>
                <TextField
                  select
                  fullWidth
                  label="Estado"
                  value={estado}
                  onChange={e => setEstado(e.target.value)}
                >
                  {estados.map(e => (
                    <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} sm={2} md={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DatePicker
                    label="Desde"
                    value={fechaDesde}
                    onChange={setFechaDesde}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6} sm={2} md={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DatePicker
                    label="Hasta"
                    value={fechaHasta}
                    onChange={setFechaHasta}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </ElegantPaper>
          <TabPanel value={tabValue} index={0}>
            {renderContent(filterItems(pagosPendientes), true)}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderContent(filterItems(pagosHistorial), false)}
          </TabPanel>
        </ElegantContent>
      </ElegantPaper>
      
      <PagarDialog 
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmarPago}
        factura={selectedFactura}
      />
    </Box>
  );
};

export default Pagos; 