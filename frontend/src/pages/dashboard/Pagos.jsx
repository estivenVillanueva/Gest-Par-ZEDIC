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
  Switch,
  Paper
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

const PagoCard = ({ pago, onCardClick, onPagar, isPending, selectable, checked, onSelectChange }) => {
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
      borderRadius: 0,
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
            <Button variant="contained" color="primary" size="small" sx={{ mt: 1 }} onClick={e => { e.stopPropagation(); onPagar && onPagar(); }}>
              Pagar
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
  const [facturaCompleta, setFacturaCompleta] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFacturaCompleta = async () => {
      if (factura && factura.id) {
        try {
          const res = await fetch(`${API_URL}/api/facturas/completa/${factura.id}`);
          const data = await res.json();
          setFacturaCompleta(data.data);
        } catch (err) {
          setFacturaCompleta(null);
        }
      }
    };
    fetchFacturaCompleta();
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
        {!facturaCompleta ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Cargando datos de la factura...</Typography>
          </Box>
        ) : (
          <FacturaPreview
            open={open}
            onClose={onClose}
            {...facturaCompleta}
          />
        )}
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleImprimir}
          disabled={!facturaCompleta}
        >
          Imprimir factura
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2, ml: 2 }}
          onClick={() => onConfirm(metodoPago)}
          disabled={!facturaCompleta}
        >
          Pagar
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
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
  const [facturaCompleta, setFacturaCompleta] = useState(null);
  const [tipoServicio, setTipoServicio] = useState('');
  const [estado, setEstado] = useState('');
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [selectedPagos, setSelectedPagos] = useState([]);
  const [confirmacionPagoOpen, setConfirmacionPagoOpen] = useState(false);
  const [facturaParaImprimir, setFacturaParaImprimir] = useState(null);
  const [pagoAConfirmar, setPagoAConfirmar] = useState(null);
  
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

  const handleOpenDialog = async (factura) => {
    try {
      const res = await fetch(`${API_URL}/api/facturas/completa/${factura.id}`);
      const data = await res.json();
      setFacturaCompleta(data.data);
    } catch (error) {
      setFacturaCompleta(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFacturaCompleta(null);
    setDialogOpen(false);
  };

  const handleConfirmarPago = async (metodo_pago) => {
    if (!facturaCompleta) return;
    try {
      await axios.put(`${API_URL}/api/pagos/${facturaCompleta.id}/pagar`, { metodo_pago });
      setFacturaParaImprimir(facturaCompleta);
      setConfirmacionPagoOpen(true);
      handleCloseDialog();
      fetchPagos();
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
            onCardClick={() => handleOpenDialog(pago)}
            onPagar={() => handleConfirmarPagoDirecto(pago)}
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
            onCardClick={() => handleOpenDialog(pago)}
            onPagar={() => handleConfirmarPagoDirecto(pago)}
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
          onCardClick={() => handleOpenDialog(pago)}
          onPagar={() => handleConfirmarPagoDirecto(pago)}
          isPending={false}
        />
      ));
    }
  };
  
  // Obtener tipos de servicio únicos realmente usados en el parqueadero
  const tiposServicioUnicos = Array.from(new Set([
    ...pagosPendientes.map(p => p.servicio_nombre),
    ...pagosHistorial.map(p => p.servicio_nombre)
  ].filter(Boolean))).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

  const handleGuardarFactura = async (facturaData) => {
    try {
      // Buscar el vehículo por placa antes de crear la factura
      const resVehiculo = await axios.get(`${API_URL}/api/vehiculos/placa/${facturaData.placa}`);
      const vehiculo = resVehiculo.data.data;
      if (!vehiculo) {
        alert('No se encontró el vehículo con esa placa. Debe registrar el vehículo primero.');
        return;
      }
      // Construir el payload de la factura incluyendo el id correcto
      const facturaPayload = {
        ...facturaData,
        vehiculo_id: vehiculo.id,
      };
      await axios.post(`${API_URL}/api/facturas`, facturaPayload);
      // Aquí puedes agregar feedback, cerrar modal, recargar datos, etc.
    } catch (error) {
      alert('Error al crear la factura. Verifica la placa del vehículo.');
      console.error('Error al crear la factura:', error);
    }
  };

  const handleConfirmarPagoDirecto = (pago) => {
    setPagoAConfirmar(pago);
  };

  // Agregar función para marcar como pagada desde el diálogo de confirmación
  const handlePagarFactura = async (factura) => {
    if (!factura) return;
    try {
      await axios.put(`${API_URL}/api/pagos/${factura.id}/pagar`, { metodo_pago: 'efectivo' });
      fetchPagos();
    } catch (e) {
      setError('No se pudo completar el pago.');
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 5, px: { xs: 1, md: 6 }, bgcolor: '#f6f7fa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: '98vw',
        borderRadius: 0,
        bgcolor: '#fff',
        boxShadow: '0 6px 32px rgba(52,152,243,0.10)',
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 5 },
        mt: { xs: 2, md: 4 },
        mb: 4,
      }}>
        <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 4 }}>Facturas</Typography>
        {/* Filtros visuales */}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3, alignItems: 'center', justifyContent: 'flex-start' }}>
            <ElegantSearchBar
              placeholder="Buscar por servicio, placa o usuario"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 120, maxWidth: 120 }}
              InputProps={{ startAdornment: (<SearchIcon sx={{ mr: 1 }} />) }}
            />
            <FormControl size="small" sx={{ minWidth: 120, maxWidth: 120 }}>
              <InputLabel>Tipo de Servicio</InputLabel>
              <Select
                value={tipoServicio}
                label="Tipo de Servicio"
                onChange={e => setTipoServicio(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {tiposServicioUnicos.map(nombre => (
                  <MenuItem key={nombre} value={nombre}>{nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140, maxWidth: 140 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={estado}
                label="Estado"
                onChange={e => setEstado(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="vencida">Vencida</MenuItem>
                <MenuItem value="pagada">Pagada</MenuItem>
              </Select>
            </FormControl>
            <DatePicker
              label="Desde"
              value={fechaDesde}
              onChange={newValue => setFechaDesde(newValue)}
              renderInput={(params) => <TextField {...params} size="small" sx={{ minWidth: 140, maxWidth: 140 }} />}
            />
            <DatePicker
              label="Hasta"
              value={fechaHasta}
              onChange={newValue => setFechaHasta(newValue)}
              renderInput={(params) => <TextField {...params} size="small" sx={{ minWidth: 140, maxWidth: 140 }} />}
            />
          </Box>
        </LocalizationProvider>
        <ElegantPaper sx={{ p: 0 }}>
          <TabsContainer>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Pendientes" />
              <Tab label="Historial" />
            </Tabs>
          </TabsContainer>
          <TabPanel value={tabValue} index={0}>
            {renderContent(filterItems(pagosPendientes), true)}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderContent(filterItems(pagosHistorial), false)}
          </TabPanel>
        </ElegantPaper>
      </Paper>
      
      <PagarDialog 
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmarPago}
        factura={facturaCompleta}
      />

      <Dialog open={confirmacionPagoOpen} onClose={() => setConfirmacionPagoOpen(false)}>
        <DialogTitle>Factura marcada como pagada</DialogTitle>
        <DialogContent>
          <Typography>La factura ha sido marcada como pagada exitosamente.</Typography>
          <Typography>¿Desea imprimir la factura?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmacionPagoOpen(false)} color="secondary">Cerrar</Button>
          <Button onClick={() => {
            if (facturaParaImprimir) {
              setFacturaCompleta(facturaParaImprimir);
              setDialogOpen(true);
            }
            setConfirmacionPagoOpen(false);
          }} color="primary" variant="contained">Imprimir factura</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!pagoAConfirmar} onClose={() => setPagoAConfirmar(null)}>
        <DialogTitle>Confirmar Pago</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas marcar esta factura como pagada?</Typography>
          <Typography sx={{ mt: 2, fontWeight: 700 }}>Factura: {pagoAConfirmar?.servicio_nombre} - {pagoAConfirmar?.placa}</Typography>
          <Typography sx={{ mt: 1 }}>Valor: {pagoAConfirmar?.total?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPagoAConfirmar(null)}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={async () => {
            await handlePagarFactura(pagoAConfirmar);
            setPagoAConfirmar(null);
          }}>Confirmar Pago</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Pagos; 