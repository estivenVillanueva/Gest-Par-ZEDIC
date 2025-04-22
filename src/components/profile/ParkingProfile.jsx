import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Tab, 
  Tabs, 
  Button,
  TextField,
  Grid,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const ParkingProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [parkingData, setParkingData] = useState({
    name: 'Parqueadero M.C.K.A.Z',
    address: 'Calle Principal #123',
    capacity: '100 vehículos',
    schedule: '24/7',
    services: [
      'Vigilancia 24/7',
      'Sistema automatizado',
      'Espacios techados',
    ],
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const renderGeneralInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: '15px', bgcolor: '#f8fafc' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Nombre del Parqueadero
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={parkingData.name}
                variant="outlined"
                size="small"
              />
            ) : (
              <Typography variant="h6">{parkingData.name}</Typography>
            )}
          </Box>

          <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <LocationOnIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Dirección
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={parkingData.address}
                  variant="outlined"
                  size="small"
                />
              ) : (
                <Typography>{parkingData.address}</Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <DirectionsCarIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Capacidad
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={parkingData.capacity}
                  variant="outlined"
                  size="small"
                />
              ) : (
                <Typography>{parkingData.capacity}</Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <AccessTimeIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Horario
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={parkingData.schedule}
                  variant="outlined"
                  size="small"
                />
              ) : (
                <Typography>{parkingData.schedule}</Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: '15px', bgcolor: '#f8fafc' }}>
          <Typography variant="h6" gutterBottom>
            Servicios Disponibles
          </Typography>
          {parkingData.services.map((service, index) => (
            <Typography 
              key={index} 
              sx={{ 
                py: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:not(:last-child)': { borderBottom: '1px solid #e2e8f0' }
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  mr: 2
                }}
              />
              {service}
            </Typography>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );

  const renderSettings = () => (
    <Paper sx={{ p: 3, borderRadius: '15px', bgcolor: '#f8fafc' }}>
      <Typography variant="h6" gutterBottom>
        Configuración del Parqueadero
      </Typography>
      <Typography color="text.secondary">
        Aquí podrás configurar las preferencias de tu parqueadero
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="600">
          Perfil del Parqueadero
        </Typography>
        <Button
          variant="contained"
          startIcon={isEditing ? <InfoIcon /> : <EditIcon />}
          onClick={handleEdit}
          sx={{
            bgcolor: '#2563EB',
            '&:hover': { bgcolor: '#1E40AF' },
          }}
        >
          {isEditing ? 'Guardar Cambios' : 'Editar Información'}
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="parking profile tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            },
            '& .Mui-selected': {
              color: '#2563EB',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2563EB',
            },
          }}
        >
          <Tab
            icon={<InfoIcon />}
            iconPosition="start"
            label="Información General"
          />
          <Tab
            icon={<SettingsIcon />}
            iconPosition="start"
            label="Configuración"
          />
        </Tabs>
      </Box>

      {activeTab === 0 ? renderGeneralInfo() : renderSettings()}
    </Container>
  );
};

export default ParkingProfile; 