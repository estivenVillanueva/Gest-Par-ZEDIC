import React, { useState } from 'react';
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
  Fab
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

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <TabPanelContainer>{children}</TabPanelContainer>}
  </div>
);

const PagoCard = ({ pago }) => (
  <ElegantCard>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 2 }}>
      <Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#2B6CA3', mb: 0.5 }}>
          {pago.descripcion}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pago.fecha}
        </Typography>
      </Box>
      <Typography variant="h6" fontWeight={800} sx={{ color: 'primary.main', minWidth: 110, textAlign: 'right' }}>
        ${pago.monto.toLocaleString()}
      </Typography>
    </Box>
  </ElegantCard>
);

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

const Pagos = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const theme = useTheme();

  const [pagos] = useState([
    { id: 1, descripcion: 'Mensualidad carro hdt 2e4 luis', monto: 80000, fecha: '2024-03-15' },
    { id: 2, descripcion: 'Mensualidad moto ABC123', monto: 40000, fecha: '2024-03-14' },
  ]);

  const [pendientes] = useState([
    { id: 3, descripcion: 'Mensualidad carro hdt 2e4 luis (pendiente)', monto: 80000, fecha: '2024-03-15' }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGuardarPago = (datos) => {
    console.log('Pago guardado:', datos);
  };

  const filterBySearch = (items) => {
    if (!searchTerm) return items;
    return items.filter((p) =>
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFilteredItems = (items) => {
    let filtered = filterBySearch(items);
    return filtered;
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 5, px: { xs: 1, md: 6 }, bgcolor: '#f6f7fa' }}>
      <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 4 }}>Pagos</Typography>
      <ElegantPaper sx={{ maxWidth: 1100, mx: 'auto', p: 0 }}>
        <TabsContainer>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Pago" />
            <Tab label="Pendientes" />
          </Tabs>
        </TabsContainer>
        <ElegantContent>
          <ElegantSearchBar>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: (<SearchIcon sx={{ mr: 1 }} />) }}
            />
            <IconButton>
              <FilterListIcon />
            </IconButton>
            <IconButton onClick={() => setOpenForm(true)}>
              <AddIcon />
            </IconButton>
          </ElegantSearchBar>
          <TabPanel value={tabValue} index={0}>
            {getFilteredItems(pagos).map((pago) => (
              <PagoCard key={pago.id} pago={pago} />
            ))}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {getFilteredItems(pendientes).map((pago) => (
              <PagoCard key={pago.id} pago={pago} />
            ))}
          </TabPanel>
        </ElegantContent>
      </ElegantPaper>
      <ElegantFab color="primary" aria-label="add" onClick={() => setOpenForm(true)}>
        <AddIcon />
      </ElegantFab>
      <FormularioPago
        open={openForm}
        onClose={() => setOpenForm(false)}
        onGuardar={handleGuardarPago}
      />
    </Box>
  );
};

export default Pagos; 