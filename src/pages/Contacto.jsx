import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el mensaje
    setSnackbar({
      open: true,
      message: 'Mensaje enviado exitosamente',
      severity: 'success'
    });
    setFormData({
      nombre: '',
      email: '',
      asunto: '',
      mensaje: ''
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const contactInfo = [
    {
      icon: <EmailIcon fontSize="large" sx={{ color: '#2B6CA3' }} />,
      title: 'Email',
      content: 'contacto@mckaz.com',
      action: 'mailto:contacto@mckaz.com'
    },
    {
      icon: <PhoneIcon fontSize="large" sx={{ color: '#2B6CA3' }} />,
      title: 'Teléfono',
      content: '+57 300 123 4567',
      action: 'tel:+573001234567'
    },
    {
      icon: <WhatsAppIcon fontSize="large" sx={{ color: '#2B6CA3' }} />,
      title: 'WhatsApp',
      content: '+57 300 123 4567',
      action: 'https://wa.me/573001234567'
    },
    {
      icon: <LocationOnIcon fontSize="large" sx={{ color: '#2B6CA3' }} />,
      title: 'Dirección',
      content: 'Calle Principal #123, Ciudad',
      action: 'https://maps.google.com'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#2B6CA3', fontWeight: 'bold', mb: 4 }}>
        Contáctanos
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {contactInfo.map((info, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 5
                    }
                  }}
                >
                  <CardContent sx={{ 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    {info.icon}
                    <Typography variant="h6" component="h2">
                      {info.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      component="a" 
                      href={info.action}
                      sx={{ 
                        color: 'text.secondary',
                        textDecoration: 'none',
                        '&:hover': {
                          color: '#2B6CA3',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {info.content}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Formulario de contacto */}
        <Grid item xs={12} md={8} sx={{ mt: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              borderRadius: 2,
              backgroundColor: '#ffffff'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: '#2B6CA3', mb: 3 }}>
              Envíanos un mensaje
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: '#2B6CA3',
                      '&:hover': {
                        bgcolor: '#1a4971'
                      },
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Enviar Mensaje
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Redes sociales */}
        <Grid item xs={12} md={4} sx={{ mt: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              height: '100%'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: '#2B6CA3', mb: 3 }}>
              Síguenos en redes sociales
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                startIcon={<FacebookIcon />}
                fullWidth
                variant="outlined"
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
                href="https://facebook.com"
                target="_blank"
              >
                Facebook
              </Button>
              <Button
                startIcon={<TwitterIcon />}
                fullWidth
                variant="outlined"
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
                href="https://twitter.com"
                target="_blank"
              >
                Twitter
              </Button>
              <Button
                startIcon={<InstagramIcon />}
                fullWidth
                variant="outlined"
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
                href="https://instagram.com"
                target="_blank"
              >
                Instagram
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contacto; 