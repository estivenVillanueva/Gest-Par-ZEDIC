import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  MenuItem,
  IconButton,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

const InfoItem = ({ icon, title, value, onEdit }) => (
  <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <IconButton onClick={onEdit} size="small">
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
    <Typography variant="body1" color="text.secondary">
      {value || 'No especificado'}
    </Typography>
  </Box>
);

const ParqueaderoProfile = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [parqueaderoInfo, setParqueaderoInfo] = useState({
    nombre: 'Mi Parqueadero',
    direccion: 'Calle Principal #123',
    capacidad: '50 vehículos',
    horarios: 'Lunes a Domingo 24/7',
    telefono: '+1234567890',
    email: 'contacto@parqueadero.com',
    descripcion: 'Ofrecemos servicios de parqueadero seguros y confiables para todo tipo de vehículos. Contamos con vigilancia 24/7 y personal capacitado.',
    servicios: [
      { tipo: 'Por hora', tarifa: '$5.000' },
      { tipo: 'Mensual', tarifa: '$150.000' },
      { tipo: 'Quincenal', tarifa: '$80.000' }
    ],
    beneficios: [
      'Eficiencia en la gestión del parqueadero',
      'Precisión en el control de vehículos',
      'Alta satisfacción del cliente'
    ]
  });

  const handleEdit = (field, value) => {
    setEditField(field);
    setEditValue(value);
    setOpenEdit(true);
  };

  const handleSave = () => {
    setParqueaderoInfo(prev => ({
      ...prev,
      [editField]: editValue
    }));
    setOpenEdit(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: 'primary.main',
              mr: 3
            }}
          >
            <LocalParkingIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {parqueaderoInfo.nombre}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Perfil del Parqueadero
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Información General
            </Typography>
            
            <InfoItem
              icon={<BusinessIcon color="primary" />}
              title="Nombre"
              value={parqueaderoInfo.nombre}
              onEdit={() => handleEdit('nombre', parqueaderoInfo.nombre)}
            />
            
            <InfoItem
              icon={<LocationOnIcon color="primary" />}
              title="Dirección"
              value={parqueaderoInfo.direccion}
              onEdit={() => handleEdit('direccion', parqueaderoInfo.direccion)}
            />
            
            <InfoItem
              icon={<LocalParkingIcon color="primary" />}
              title="Capacidad"
              value={parqueaderoInfo.capacidad}
              onEdit={() => handleEdit('capacidad', parqueaderoInfo.capacidad)}
            />
            
            <InfoItem
              icon={<AccessTimeIcon color="primary" />}
              title="Horarios"
              value={parqueaderoInfo.horarios}
              onEdit={() => handleEdit('horarios', parqueaderoInfo.horarios)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Contacto y Redes Sociales
            </Typography>
            
            <InfoItem
              icon={<PhoneIcon color="primary" />}
              title="Teléfono"
              value={parqueaderoInfo.telefono}
              onEdit={() => handleEdit('telefono', parqueaderoInfo.telefono)}
            />
            
            <InfoItem
              icon={<EmailIcon color="primary" />}
              title="Email"
              value={parqueaderoInfo.email}
              onEdit={() => handleEdit('email', parqueaderoInfo.email)}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <IconButton color="primary" size="large">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" size="large">
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Descripción
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="body1">
                {parqueaderoInfo.descripcion}
              </Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => handleEdit('descripcion', parqueaderoInfo.descripcion)}
                sx={{ mt: 2 }}
              >
                Editar descripción
              </Button>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Servicios Ofrecidos
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {parqueaderoInfo.servicios.map((servicio, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {servicio.tipo}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {servicio.tarifa}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom>
              Beneficios
            </Typography>
            <Grid container spacing={2}>
              {parqueaderoInfo.beneficios.map((beneficio, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body1">
                      {beneficio}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar {editField}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline={editField === 'descripcion'}
            rows={editField === 'descripcion' ? 4 : 1}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ParqueaderoProfile; 