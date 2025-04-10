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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import {
  TabPanelContainer,
  StyledPaper,
  StyledCard,
  TabsContainer,
  SearchContainer,
  ContentContainer
} from '../../styles/pages/Pagos.styles';

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGuardarPago = (datos) => {
    console.log('Pago guardado:', datos);
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
            <IconButton onClick={() => setOpenForm(true)}>
              <AddIcon />
            </IconButton>
          </SearchContainer>

          <TabPanel value={tabValue} index={0}>
            {pagos.map((pago) => (
              <PagoCard key={pago.id} pago={pago} />
            ))}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="body1" color="text.secondary" align="center">
              No hay pagos pendientes
            </Typography>
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