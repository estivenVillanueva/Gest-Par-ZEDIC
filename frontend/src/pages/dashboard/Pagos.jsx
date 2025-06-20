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
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
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

const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <TabPanelContainer>{children}</TabPanelContainer>}
  </div>
);

const PagoCard = ({ pago, onCardClick, isPending }) => {
  const isVencida = isPending && new Date(pago.fecha_vencimiento) < new Date();
  
  const formatDate = (dateString) => {
    return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  return (
    <ElegantCard onClick={onCardClick} sx={{ 
      borderLeft: isVencida ? '4px solid #f44336' : (isPending ? '4px solid #ff9800' : '4px solid #4caf50'),
      cursor: isPending ? 'pointer' : 'default',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: isPending ? 'scale(1.02)' : 'none'
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 2 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#2B6CA3', mb: 0.5 }}>
            {pago.servicio_nombre} - {pago.placa} ({pago.usuario_nombre})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isPending 
              ? `Vence: ${formatDate(pago.fecha_vencimiento)}`
              : `Pagado: ${formatDate(pago.fecha_pago)}`
            }
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ color: isVencida ? '#f44336' : 'primary.main', minWidth: 110, textAlign: 'right' }}>
          ${parseInt(pago.total, 10).toLocaleString('es-CO')}
        </Typography>
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
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
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button 
            onClick={onClose}
            color="primary"
            variant="outlined"
          >
            guardar pago
          </Button>
          <Button 
            type="submit"
            variant="contained"
            color="primary"
            sx={{ minWidth: 180 }}
          >
            generar factura
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const PagarDialog = ({ open, onClose, onConfirm, factura }) => {
  const [metodoPago, setMetodoPago] = useState('efectivo');

  if (!factura) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirmar Pago</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Confirmas que has recibido el pago de <strong>${parseInt(factura.total, 10).toLocaleString('es-CO')}</strong> para el servicio <strong>{factura.servicio_nombre}</strong> del vehículo <strong>{factura.placa}</strong>?
        </Typography>
        <FormControl fullWidth margin="normal" sx={{ mt: 3 }}>
          <InputLabel>Método de Pago</InputLabel>
          <Select
            value={metodoPago}
            label="Método de Pago"
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <MenuItem value="efectivo">Efectivo</MenuItem>
            <MenuItem value="transferencia">Transferencia</MenuItem>
            <MenuItem value="tarjeta">Tarjeta</MenuItem>
          </Select>
        </FormControl>
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

const Pagos = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagosPendientes, setPagosPendientes] = useState([]);
  const [pagosHistorial, setPagosHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  
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

  const filterItems = (items) => {
    if (!searchTerm) return items;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return items.filter((p) =>
      p.servicio_nombre.toLowerCase().includes(lowerCaseSearch) ||
      p.placa.toLowerCase().includes(lowerCaseSearch) ||
      p.usuario_nombre.toLowerCase().includes(lowerCaseSearch)
    );
  };

  const renderContent = (items, isPendingTab) => {
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    
    const filteredItems = filterItems(items);

    if (filteredItems.length === 0) {
      return <Typography sx={{ textAlign: 'center', p: 4 }}>No hay pagos para mostrar.</Typography>;
    }

    return filteredItems.map((pago) => (
      <PagoCard 
        key={pago.id} 
        pago={pago} 
        onCardClick={isPendingTab ? () => handleOpenDialog(pago) : undefined}
        isPending={isPendingTab}
      />
    ));
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
          <ElegantSearchBar
            fullWidth
            placeholder="Buscar por servicio, placa o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TabPanel value={tabValue} index={0}>
            {renderContent(pagosPendientes, true)}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderContent(pagosHistorial, false)}
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