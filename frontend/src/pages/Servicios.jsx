import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaymentIcon from '@mui/icons-material/Payment';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  ServiciosSection,
  ServiciosGrid,
  ServicioCard,
  ServicioIconBox,
  BeneficiosPaper,
  BeneficioListItem
} from '../styles/pages/Servicios.styles';

const Servicios = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const servicios = [
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: '#2B6CA3' }} />,
      title: 'Seguridad 24/7',
      description: 'Vigilancia continua y sistemas de seguridad avanzados para garantizar la protección de tu vehículo.'
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 50, color: '#2B6CA3' }} />,
      title: 'Acceso 24 Horas',
      description: 'Entrada y salida ilimitada con sistemas de control de acceso modernos y eficientes.'
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 50, color: '#2B6CA3' }} />,
      title: 'Atención Personalizada',
      description: 'Personal capacitado para brindar asistencia y soporte en todo momento.'
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 50, color: '#2B6CA3' }} />,
      title: 'Múltiples Métodos de Pago',
      description: 'Diversas opciones de pago para tu comodidad, incluyendo transferencias y tarjetas.'
    },
    {
      icon: <DirectionsCarIcon sx={{ fontSize: 50, color: '#2B6CA3' }} />,
      title: 'Espacios Amplios',
      description: 'Áreas designadas para diferentes tipos de vehículos con espacio suficiente para maniobrar.'
    },
    {
      icon: <LocalParkingIcon sx={{ fontSize: 50, color: '#2B6CA3' }} />,
      title: 'Reserva de Espacios',
      description: 'Sistema de reserva en línea para garantizar tu espacio cuando lo necesites.'
    }
  ];

  const beneficios = [
    'Sistema de reserva de espacios en línea',
    'Notificaciones en tiempo real',
    'Historial de uso detallado',
    'Facturación electrónica',
    'Soporte técnico inmediato',
    'Cobertura de seguro básica'
  ];

  return (
    <ServiciosSection>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              color: '#2B6CA3',
              fontWeight: 'bold',
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Nuestros Servicios
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto' }}
          >
            Ofrecemos una solución completa para el estacionamiento de tu vehículo, 
            con tecnología de punta y atención personalizada.
          </Typography>
        </Box>

        <ServiciosGrid>
          {servicios.map((servicio, index) => (
            <ServicioCard key={index}>
              <CardContent sx={{ 
                flexGrow: 1, 
                textAlign: 'center',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <ServicioIconBox>
                  {servicio.icon}
                </ServicioIconBox>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    color: '#2B6CA3',
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  {servicio.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {servicio.description}
                </Typography>
              </CardContent>
            </ServicioCard>
          ))}
        </ServiciosGrid>

        <BeneficiosPaper elevation={0}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: 900,
            mx: 'auto',
            py: 4
          }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              Beneficios Adicionales
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.85 }}>
              Descubre todas las ventajas exclusivas que ofrecemos para tu tranquilidad y comodidad.
            </Typography>
            <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 4 }}>
              {beneficios.map((beneficio, index) => (
                <BeneficioListItem key={index} elevation={0} sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box sx={{
                      bgcolor: 'rgba(43,108,163,0.18)',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <CheckCircleIcon sx={{ color: '#2B6CA3', fontSize: 22 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={beneficio}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }
                    }}
                  />
                </BeneficioListItem>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4, mt: 2 }}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.13)', borderRadius: '50%', p: 2, mb: { xs: 2, sm: 0 } }}>
                <SpeedIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Tecnología de Punta
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                  Utilizamos los sistemas más avanzados para garantizar la seguridad y comodidad de tu vehículo.
                </Typography>
              </Box>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.13)', borderRadius: '50%', p: 2 }}>
                <VerifiedUserIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>
            </Box>
          </Box>
        </BeneficiosPaper>
      </Container>
    </ServiciosSection>
  );
};

export default Servicios; 