import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Container, Collapse, Fade, Button, Divider, Paper, Grid } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import InfoDialog from './InfoDialog';
import {
  InfoContainer,
  LogoContainer,
  InfoSection,
  InfoButton,
  ServiceButton,
  FooterContainer,
  FooterContent,
  FooterSection,
  SocialLinks,
  InfoIcon as StyledInfoIcon,
  InfoText,
  ContactInfo,
  ServicesList,
} from '../../styles/components/ParkingInfo.styles';

const DEFAULT_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Parking_icon.svg';
const DEFAULT_PORTADA_URL = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

const ParkingInfo = ({ parkingData, onClose }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [dialogTitle, setDialogTitle] = useState('');
  const [isServicesExpanded, setIsServicesExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const handleInfoClick = (title, info) => {
    setDialogTitle(title);
    setDialogInfo(info);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSectionHover = (index) => {
    setActiveSection(index);
  };

  const infoSections = [
    {
      title: 'Nombre del parqueadero',
      icon: <LocalParkingIcon />,
      key: 'name',
      dialogTitle: 'Nombre',
      description: 'Información detallada sobre nuestro establecimiento'
    },
    {
      title: 'Ubicación del parqueadero',
      icon: <LocationOnIcon />,
      key: 'address',
      dialogTitle: 'Dirección',
      description: 'Encuentra nuestra ubicación exacta'
    },
    {
      title: 'Capacidad disponible',
      icon: <DirectionsCarIcon />,
      key: 'capacity',
      dialogTitle: 'Capacidad',
      description: 'Espacios disponibles para diferentes vehículos'
    },
    {
      title: 'Horarios de atención',
      icon: <AccessTimeIcon />,
      key: 'schedule',
      dialogTitle: 'Horarios',
      description: 'Conoce nuestros horarios de servicio'
    }
  ];

  const services = [
    {
      icon: <SecurityIcon />,
      title: 'Seguridad 24/7',
      description: 'Vigilancia permanente y cámaras de seguridad'
    },
    {
      icon: <SpeedIcon />,
      title: 'Control automatizado',
      description: 'Sistema moderno de control de acceso'
    },
    {
      icon: <DirectionsCarIcon />,
      title: 'Espacios amplios',
      description: 'Cómodo acceso para todo tipo de vehículos'
    }
  ];

  return (
    <Paper elevation={4} sx={{ overflow: 'hidden', bgcolor: '#f8fafc' }}>
      <Box sx={{ width: '100%', height: 180, position: 'relative', overflow: 'hidden' }}>
        <img
          src={parkingData?.portada_url || DEFAULT_PORTADA_URL}
          alt={parkingData?.nombre || parkingData?.name || 'parking'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.onerror = null; e.target.src = DEFAULT_PORTADA_URL; }}
        />
        <Button onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(255,255,255,0.8)', color: '#2563eb', fontWeight: 700, borderRadius: 2, px: 2, boxShadow: 2, '&:hover': { bgcolor: '#2563eb', color: 'white' } }}>Cerrar</Button>
      </Box>
      <Box sx={{ p: { xs: 2, md: 4 }, pt: 4 }}>
        {/* Logo y nombre alineados */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {parkingData?.logo_url && (
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              border: '4px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#fff',
            }}>
              <img
                src={parkingData.logo_url}
                alt="Logo parqueadero"
                style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: '50%' }}
                onError={e => { e.target.onerror = null; e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Parking_icon.svg'; }}
              />
            </Box>
          )}
          <Typography variant="h4" fontWeight={800} color="#2563eb">{parkingData?.nombre || parkingData?.name || ''}</Typography>
        </Box>
        {/* Descripción del parqueadero */}
        {parkingData?.descripcion || parkingData?.description ? (
          <Typography variant="body1" color="text.secondary" mb={2}>
            {parkingData.descripcion || parkingData.description}
          </Typography>
        ) : null}
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOnIcon sx={{ color: '#64748b' }} />
              <Typography variant="subtitle1" fontWeight={600}>Dirección:</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" mb={2}>{parkingData?.direccion || parkingData?.address || ''}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AccessTimeIcon sx={{ color: '#64748b' }} />
              <Typography variant="subtitle1" fontWeight={600}>Horario:</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" mb={2}>{parkingData?.horarios || parkingData?.schedule || ''}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DirectionsCarIcon sx={{ color: '#64748b' }} />
              <Typography variant="subtitle1" fontWeight={600}>Capacidad:</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" mb={2}>{parkingData?.capacidad || parkingData?.capacity || 0} vehículos</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SecurityIcon sx={{ color: '#64748b' }} />
              <Typography variant="subtitle1" fontWeight={600}>Seguridad:</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" mb={2}>{parkingData?.seguridad || '24/7, cámaras y personal'}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" fontWeight={700} color="#2563eb" mb={2}>Servicios Ofrecidos</Typography>
        <Grid container spacing={2}>
          {Array.isArray(parkingData?.servicios) && parkingData.servicios.length > 0 ? (
            parkingData.servicios.map((servicio, idx) => (
              <Grid item xs={12} sm={4} key={servicio.id || idx}>
                <Box sx={{ bgcolor: '#e3f2fd', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 1 }}>
                  <Typography fontWeight={600}>{servicio.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">{servicio.descripcion}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Precio: {servicio.precio}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Duración: {servicio.duracion}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Estado: {servicio.estado}</Typography>
                </Box>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Este parqueadero no ha registrado servicios ofrecidos.</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
      <InfoDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={dialogTitle}
        info={dialogInfo}
      />
    </Paper>
  );
};

export default ParkingInfo; 