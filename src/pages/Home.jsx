import React from 'react';
import { Typography, Box, Grid, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import {
  HeroSection,
  StyledContainer,
  StyledPaper,
  IconWrapper,
  FeatureSection,
  CTASection,
  StyledButton
} from '../styles/pages/Home.styles';

const Home = () => {
  return (
    <Box sx={{ width: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
      <HeroSection>
        <StyledContainer>
          <Typography variant="h1" component="h1" gutterBottom>
            Parqueaderos M.C.K.A.Z
          </Typography>
          <Typography variant="h5" gutterBottom>
            La solución inteligente para el estacionamiento de tu vehículo
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, opacity: 0.9 }}>
            Descubre nuestros parqueaderos asociados con ubicaciones estratégicas,
            amplia capacidad y horarios flexibles para tu comodidad.
          </Typography>
          <Stack direction="row" spacing={3} justifyContent="center">
            <StyledButton 
              variant="contained" 
              component={Link} 
              to="/servicios"
              sx={{ backdropFilter: 'blur(8px)' }}
            >
              Explorar Servicios
            </StyledButton>
            <StyledButton 
              variant="outlined" 
              component={Link} 
              to="/contacto"
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Contáctanos
            </StyledButton>
          </Stack>
        </StyledContainer>
      </HeroSection>

      <FeatureSection>
        <StyledContainer>
          <Typography variant="h2" component="h2" gutterBottom>
            ¿Por qué elegirnos?
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 6, maxWidth: 700, mx: 'auto', color: '#64748b' }}>
            Ofrecemos una experiencia de estacionamiento superior con tecnología de punta
            y un servicio excepcional para tu tranquilidad.
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <StyledPaper elevation={0}>
                <IconWrapper>
                  <DirectionsCarIcon />
                </IconWrapper>
                <Typography variant="h5" component="h3" gutterBottom>
                  Espacios Amplios
                </Typography>
                <Typography>
                  Espacios diseñados pensando en tu comodidad, con dimensiones
                  optimizadas para todo tipo de vehículos y fácil acceso.
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledPaper elevation={0}>
                <IconWrapper>
                  <SecurityIcon />
                </IconWrapper>
                <Typography variant="h5" component="h3" gutterBottom>
                  Seguridad 24/7
                </Typography>
                <Typography>
                  Vigilancia permanente con tecnología avanzada y personal
                  altamente capacitado para proteger tu vehículo.
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledPaper elevation={0}>
                <IconWrapper>
                  <AccessTimeIcon />
                </IconWrapper>
                <Typography variant="h5" component="h3" gutterBottom>
                  Horarios Flexibles
                </Typography>
                <Typography>
                  Adaptamos nuestros servicios a tu rutina con opciones
                  flexibles de estacionamiento y tarifas competitivas.
                </Typography>
              </StyledPaper>
            </Grid>
          </Grid>
        </StyledContainer>
      </FeatureSection>

      <CTASection>
        <StyledContainer>
          <Typography variant="h3" align="center" gutterBottom>
            Únete a nuestra red
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Forma parte de la red de parqueaderos más innovadora
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 4, opacity: 0.8 }}>
            Maximiza tus ingresos y optimiza la gestión de tu parqueadero con nuestra tecnología
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" gap={3}>
            <StyledButton 
              variant="contained" 
              component={Link} 
              to="/acceder"
              startIcon={<LocalParkingIcon />}
            >
              Registra tu Parqueadero
            </StyledButton>
            <StyledButton 
              variant="outlined"
              component={Link}
              to="/beneficios"
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Ver Beneficios
            </StyledButton>
          </Box>
        </StyledContainer>
      </CTASection>
    </Box>
  );
};

export default Home; 