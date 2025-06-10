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
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SearchIcon from '@mui/icons-material/Search';
import { MinimalCard, MinimalIcon, MinimalBadge, MinimalFab, MinimalGrid, MinimalFilterBar } from '../../styles/pages/Vehiculos.styles';

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

const Vehiculos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [vehiculos, setVehiculos] = useState([
    { id: 1, placa: 'ABC123', propietario: 'Juan Pérez', tipoVehiculo: 'carro', color: 'Rojo', puesto: 'A1', tipoServicio: 'mensual', fecha: '2024-06-01', entradas: '2024-06-01,2024-06-10' },
    { id: 2, placa: 'XYZ789', propietario: 'María García', tipoVehiculo: 'moto', color: 'Negro', puesto: 'B2', tipoServicio: 'diario', fecha: '2024-06-05', entradas: '2024-06-05,2024-06-12' },
  ]);

  const handleVerInfo = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setOpenForm(true);
  };

  // Filtrado avanzado
  const filteredVehiculos = vehiculos.filter((vehiculo) => {
    const matchGeneral = searchTerm === '' || vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) || vehiculo.propietario.toLowerCase().includes(searchTerm.toLowerCase());
    let matchFecha = true;
    if (dateFrom) {
      matchFecha = vehiculo.fecha >= dateFrom;
    }
    if (dateTo && matchFecha) {
      matchFecha = vehiculo.fecha <= dateTo;
    }
    return matchGeneral && matchFecha;
  });

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 5, px: { xs: 1, md: 6 }, bgcolor: '#f6f7fa' }}>
      <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 4 }}>Vehículos</Typography>
      <MinimalFilterBar>
        <TextField variant="outlined" placeholder="Buscar por nombre o placa" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<SearchIcon sx={{ mr: 1 }} />) }} />
        <TextField type="date" variant="outlined" value={dateFrom} onChange={e => setDateFrom(e.target.value)} label="Desde" InputLabelProps={{ shrink: true }} />
        <TextField type="date" variant="outlined" value={dateTo} onChange={e => setDateTo(e.target.value)} label="Hasta" InputLabelProps={{ shrink: true }} />
      </MinimalFilterBar>
      <MinimalGrid container spacing={4}>
        {filteredVehiculos.map((vehiculo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={vehiculo.id}>
            <VehiculoCard vehiculo={vehiculo} onVerInfo={handleVerInfo} />
          </Grid>
        ))}
      </MinimalGrid>
      <MinimalFab color="primary" aria-label="add" onClick={() => { setSelectedVehiculo(null); setOpenForm(true); }}>
        <AddIcon />
      </MinimalFab>
    </Box>
  );
};

export default Vehiculos; 