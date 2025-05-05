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
  BeneficiosPaper
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
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                Beneficios Adicionales
              </Typography>
              <List>
                {beneficios.map((beneficio, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={beneficio}
                      sx={{ 
                        '& .MuiListItemText-primary': {
                          fontSize: '1.1rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 3
              }}>
                <SpeedIcon sx={{ fontSize: 60, color: 'white' }} />
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
                  Tecnología de Punta
                </Typography>
                <Typography variant="body1" align="center">
                  Utilizamos los sistemas más avanzados para garantizar la seguridad y comodidad de tu vehículo.
                </Typography>
                <VerifiedUserIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>
            </Grid>
          </Grid>
        </BeneficiosPaper>
      </Container>
    </ServiciosSection>
  );
};

export default Servicios; 