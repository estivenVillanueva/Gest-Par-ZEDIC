import React, { useState } from 'react';
import {
  Box,
  Container,
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
  CardContent,
  IconButton,
  Drawer,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  TabPanelContainer,
  StyledPaper,
  StyledCard,
  TabsContainer,
  SearchContainer,
  ContentContainer
} from '../../styles/pages/Pagos.styles';
import { useTheme } from '@mui/material/styles';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <TabPanelContainer>{children}</TabPanelContainer>}
  </div>
);

const PagoCard = ({ pago }) => (
  <StyledCard>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <Typography variant="subtitle1" fontWeight={500}>
            {pago.descripcion}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pago.fecha}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} textAlign="right">
          <Typography variant="h6" color="primary">
            ${pago.monto.toLocaleString()}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </StyledCard>
);

const FormularioPago = ({ open, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    informacionPago: '',
    mensualidad: '',
    informacionGasto: '',
    total: ''
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
                label="Información del pago"
                name="informacionPago"
                value={formData.informacionPago}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensualidad"
                name="mensualidad"
                value={formData.mensualidad}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Información del gasto"
                name="informacionGasto"
                value={formData.informacionGasto}
                onChange={handleChange}
                multiline
                rows={3}
                variant="outlined"
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total"
                name="total"
                value={formData.total}
                onChange={handleChange}
                required
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
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            variant="contained"
            color="primary"
          >
            Guardar Pago
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const theme = useTheme();

  const [pagos] = useState([
    { 
      id: 1, 
      descripcion: 'Mensualidad carro hdt 2e4 luis', 
      monto: 80000,
      fecha: '2024-03-15'
    },
    { 
      id: 2, 
      descripcion: 'Mensualidad moto ABC123', 
      monto: 40000,
      fecha: '2024-03-14'
    },
  ]);

  const [pendientes] = useState([
    { 
      id: 3, 
      descripcion: 'Mensualidad carro hdt 2e4 luis (pendiente)', 
      monto: 80000,
      fecha: '2024-03-15'
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGuardarPago = (datos) => {
    console.log('Pago guardado:', datos);
  };

  const filterByDate = (items) => {
    if (!dateFilter) return items;
    const now = new Date();
    return items.filter(item => {
      const itemDate = new Date(item.fecha);
      if (dateFilter === 'dia') {
        return itemDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'semana') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return itemDate >= startOfWeek && itemDate <= endOfWeek;
      } else if (dateFilter === 'mes') {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filterBySearch = (items) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFilteredItems = (items) => {
    return filterBySearch(filterByDate(items));
  };

  return (
    <Container maxWidth="xl">
      <StyledPaper>
        <TabsContainer>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Pago" />
            <Tab label="Pendientes" />
          </Tabs>
        </TabsContainer>

        <ContentContainer>
          <SearchContainer>
            <TextField
              fullWidth
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon />
              }}
            />
            <IconButton onClick={() => setDrawerOpen(true)}>
              <FilterListIcon />
            </IconButton>
            <IconButton onClick={() => setOpenForm(true)}>
              <AddIcon />
            </IconButton>
          </SearchContainer>

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{ sx: { width: 300, p: 3, borderRadius: '16px 0 0 16px', background: theme.palette.background.default } }}
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Filtrar por fecha
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="date-filter-label">Tipo de filtro</InputLabel>
                <Select
                  labelId="date-filter-label"
                  value={dateFilter}
                  label="Tipo de filtro"
                  onChange={e => setDateFilter(e.target.value)}
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  <MenuItem value="dia">Día</MenuItem>
                  <MenuItem value="semana">Semana</MenuItem>
                  <MenuItem value="mes">Mes</MenuItem>
                  <MenuItem value="todos">Todos</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Drawer>

          <TabPanel value={tabValue} index={0}>
            {getFilteredItems(pagos).map((pago) => (
              <PagoCard key={pago.id} pago={pago} />
            ))}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {getFilteredItems(pendientes).length === 0 ? (
              <Typography variant="body1" color="text.secondary" align="center">
                No hay pagos pendientes
              </Typography>
            ) : (
              getFilteredItems(pendientes).map((pago) => (
                <PagoCard key={pago.id} pago={pago} />
              ))
            )}
          </TabPanel>
        </ContentContainer>
      </StyledPaper>

      <FormularioPago
        open={openForm}
        onClose={() => setOpenForm(false)}
        onGuardar={handleGuardarPago}
      />
    </Container>
  );
};

export default Pagos; 