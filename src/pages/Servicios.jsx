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
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
      py: 8
    }}>
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

        <Grid container spacing={4}>
          {servicios.map((servicio, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    '& .MuiSvgIcon-root': {
                      transform: 'scale(1.1)',
                      transition: 'transform 0.3s ease'
                    }
                  }
                }}
              >
                <CardContent sx={{ 
                  flexGrow: 1, 
                  textAlign: 'center',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    mb: 3,
                    p: 2,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(43, 108, 163, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {servicio.icon}
                  </Box>
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
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 6,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #2B6CA3 0%, #1a4971 100%)',
              color: 'white'
            }}
          >
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
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Servicios; 