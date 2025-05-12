import React, { useState } from 'react';
import {
  TextField,
  Grid,
  CardContent,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Container,
  Chip,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {
  VehiculoCardStyled,
  CardImageContainer,
  CardActionContainer,
  CardInfoContainer,
  AddVehiculoCard,
  SearchContainer,
  ContentContainer
} from '../../styles/pages/Vehiculos.styles';

const getVehiculoIcon = (tipo) => {
  switch (tipo?.toLowerCase()) {
    case 'moto':
      return <TwoWheelerIcon sx={{ fontSize: 80, color: 'white' }} />;
    case 'carro':
      return <TimeToLeaveIcon sx={{ fontSize: 80, color: 'white' }} />;
    case 'bicicleta':
      return <PedalBikeIcon sx={{ fontSize: 80, color: 'white' }} />;
    case 'camion':
      return <LocalShippingIcon sx={{ fontSize: 80, color: 'white' }} />;
    default:
      return <DirectionsCarIcon sx={{ fontSize: 80, color: 'white' }} />;
  }
};

const VehiculoCard = ({ vehiculo, onVerInfo }) => (
  <VehiculoCardStyled>
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
      <CardImageContainer>
        {getVehiculoIcon(vehiculo.tipoVehiculo)}
      </CardImageContainer>
      <CardInfoContainer>
        <Typography variant="h6">
          {vehiculo.placa}
        </Typography>
        <Typography variant="body2">
          {vehiculo.propietario}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Puesto:
          </Typography>
          <Chip 
            label={vehiculo.puesto || 'No asignado'} 
            size="small"
            sx={{ 
              bgcolor: 'rgba(43, 108, 163, 0.08)',
              color: '#2B6CA3',
              fontWeight: 600
            }}
          />
        </Box>
        {vehiculo.tipoServicio && (
          <Chip
            label={vehiculo.tipoServicio}
            size="small"
            sx={{
              bgcolor: 'rgba(43, 108, 163, 0.08)',
              color: '#2B6CA3',
              alignSelf: 'flex-start',
              mt: 1,
              textTransform: 'capitalize'
            }}
          />
        )}
      </CardInfoContainer>
      <CardActionContainer>
        <Button 
          fullWidth 
          variant="text"
          onClick={() => onVerInfo(vehiculo)}
          startIcon={<LocalParkingIcon />}
        >
          Ver Información
        </Button>
      </CardActionContainer>
    </CardContent>
  </VehiculoCardStyled>
);

const FormularioVehiculo = ({ open, onClose, onGuardar, isEdit = false }) => {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    placa: '',
    puesto: '',
    tipoVehiculo: '',
    color: '',
    tipoServicio: '',
    entradas: ''
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
        <Typography variant="h6">
          {isEdit ? 'Información del vehículo' : 'Añadir nuevo vehículo'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre cliente"
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
                label="Tipo de vehículo"
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
                label="Puesto"
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
                label="Placa"
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
                label="Color"
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
                label="Tipo de servicio"
                name="tipoServicio"
                value={formData.tipoServicio}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Entradas y salidas registradas"
                name="entradas"
                value={formData.entradas}
                onChange={handleChange}
                multiline
                rows={3}
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
            {isEdit ? 'Guardar' : 'Añadir vehículo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Vehiculos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchNombre, setSearchNombre] = useState('');
  const [searchPlaca, setSearchPlaca] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  const [vehiculos, setVehiculos] = useState([
    { 
      id: 1, 
      placa: 'ABC123', 
      propietario: 'Juan Pérez',
      tipoVehiculo: 'carro',
      color: 'Rojo',
      puesto: 'A1',
      tipoServicio: 'mensual',
      fecha: '2024-06-01',
      entradas: '2024-06-01,2024-06-10'
    },
    { 
      id: 2, 
      placa: 'XYZ789', 
      propietario: 'María García',
      tipoVehiculo: 'moto',
      color: 'Negro',
      puesto: 'B2',
      tipoServicio: 'diario',
      fecha: '2024-06-05',
      entradas: '2024-06-05,2024-06-12'
    },
  ]);

  const handleVerInfo = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setOpenForm(true);
  };

  const handleGuardar = (datos) => {
    if (selectedVehiculo) {
      const updatedVehiculos = vehiculos.map(v => 
        v.id === selectedVehiculo.id ? { ...v, ...datos } : v
      );
      setVehiculos(updatedVehiculos);
    } else {
      setVehiculos([...vehiculos, { id: vehiculos.length + 1, ...datos }]);
    }
  };

  // Filtrado avanzado
  const filteredVehiculos = vehiculos.filter((vehiculo) => {
    const matchGeneral = searchTerm === '' ||
      vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.propietario.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNombre = searchNombre === '' || vehiculo.propietario.toLowerCase().includes(searchNombre.toLowerCase());
    const matchPlaca = searchPlaca === '' || vehiculo.placa.toLowerCase().includes(searchPlaca.toLowerCase());
    let matchFecha = true;
    if (dateFrom) {
      matchFecha = vehiculo.fecha >= dateFrom;
    }
    if (dateTo && matchFecha) {
      matchFecha = vehiculo.fecha <= dateTo;
    }
    return matchGeneral && matchNombre && matchPlaca && matchFecha;
  });

  return (
    <Container maxWidth="xl">
      <ContentContainer>
        <SearchContainer>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Filtrar por nombre"
                value={searchNombre}
                onChange={(e) => setSearchNombre(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Filtrar por placa"
                value={searchPlaca}
                onChange={(e) => setSearchPlaca(e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                label="Desde"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                label="Hasta"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </Grid>
          </Grid>
        </SearchContainer>

        <Grid container spacing={3}>
          {filteredVehiculos.map((vehiculo) => (
            <Grid item xs={12} sm={6} md={3} key={vehiculo.id}>
              <VehiculoCard vehiculo={vehiculo} onVerInfo={handleVerInfo} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={3}>
            <AddVehiculoCard
              onClick={() => {
                setSelectedVehiculo(null);
                setOpenForm(true);
              }}
            >
              <AddIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
            </AddVehiculoCard>
          </Grid>
        </Grid>

        <FormularioVehiculo
          open={openForm}
          onClose={() => setOpenForm(false)}
          onGuardar={handleGuardar}
          isEdit={!!selectedVehiculo}
        />
      </ContentContainer>
    </Container>
  );
};

export default Vehiculos; 