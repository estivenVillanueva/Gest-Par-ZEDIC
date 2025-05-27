import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material/styles';

const FeatureContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '380px',
  width: '350px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  background: '#ffffff',
  borderRadius: '16px',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '85px',
  height: '85px',
  borderRadius: '16px',
  background: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
  '& svg': {
    fontSize: '42px',
    color: '#ffffff',
  },
}));

const ContentWrapper = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  padding: '0 16px',
});

const features = [
  {
    icon: <DirectionsCarIcon />,
    title: 'Espacios Amplios',
    description: 'Espacios diseñados pensando en tu comodidad, con dimensiones optimizadas para todo tipo de vehículos y fácil acceso.'
  },
  {
    icon: <SecurityIcon />,
    title: 'Seguridad 24/7',
    description: 'Vigilancia permanente con tecnología avanzada y personal altamente capacitado para proteger tu vehículo.'
  },
  {
    icon: <AccessTimeIcon />,
    title: 'Horarios Flexibles',
    description: 'Adaptamos nuestros servicios a tu rutina con opciones flexibles de estacionamiento y tarifas competitivas.'
  }
];

const WhyChooseUs = () => {
  return (
    <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 2 }}
        >
          ¿Por qué elegirnos?
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ mb: 6, maxWidth: 700, mx: 'auto', color: 'text.secondary' }}
        >
          Ofrecemos una experiencia de estacionamiento superior con tecnología de punta
          y un servicio excepcional para tu tranquilidad.
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '32px',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center'
        }}>
          {features.map((feature, index) => (
            <FeatureContainer elevation={0} key={index}>
              <IconWrapper>
                {feature.icon}
              </IconWrapper>
              <ContentWrapper>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ 
                    mb: 3,
                    fontWeight: 600,
                    fontSize: '1.5rem',
                    lineHeight: 1.2
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ 
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </ContentWrapper>
            </FeatureContainer>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default WhyChooseUs; 