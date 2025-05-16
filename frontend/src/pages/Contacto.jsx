import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import {
  ContactContainer,
  ContactHeader,
  ContactCard,
  ContactInfoCard,
  ContactForm,
  StyledTextField,
  SubmitButton,
  SocialButton,
  ContactIcon,
} from '../styles/pages/Contacto.styles';

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
      icon: <EmailIcon />,
      title: 'Email',
      content: 'contacto@mckaz.com',
      action: 'mailto:contacto@mckaz.com'
    },
    {
      icon: <PhoneIcon />,
      title: 'Teléfono',
      content: '+57 300 123 4567',
      action: 'tel:+573001234567'
    },
    {
      icon: <WhatsAppIcon />,
      title: 'WhatsApp',
      content: '+57 300 123 4567',
      action: 'https://wa.me/573001234567'
    },
    {
      icon: <LocationOnIcon />,
      title: 'Dirección',
      content: 'Calle Principal #123, Ciudad',
      action: 'https://maps.google.com'
    }
  ];

  return (
    <ContactContainer>
      <Container maxWidth="lg">
        <ContactHeader>
          <Typography variant="h3" component="h1" gutterBottom>
            Contáctanos
          </Typography>
          <Typography variant="subtitle1">
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </Typography>
        </ContactHeader>

        <Grid container spacing={4}>
          {/* Información de contacto */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} key={index}>
                  <ContactInfoCard>
                    <ContactIcon>
                      {info.icon}
                    </ContactIcon>
                    <Typography variant="h6" gutterBottom>
                      {info.title}
                    </Typography>
                    <Typography 
                      component="a" 
                      href={info.action}
                      sx={{ 
                        color: 'white',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {info.content}
                    </Typography>
                  </ContactInfoCard>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Formulario de contacto */}
          <Grid item xs={12} md={8}>
            <ContactCard>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                Envíanos un mensaje
              </Typography>
              <ContactForm onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
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
                    <StyledTextField
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
                    <StyledTextField
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
                    <StyledTextField
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <SubmitButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                      >
                        Enviar Mensaje
                      </SubmitButton>
                    </Box>
                  </Grid>
                </Grid>
              </ContactForm>
            </ContactCard>
          </Grid>

          {/* Redes sociales */}
          <Grid item xs={12}>
            <ContactCard>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                Síguenos en redes sociales
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <SocialButton
                  startIcon={<FacebookIcon />}
                  variant="outlined"
                  href="https://facebook.com"
                  target="_blank"
                >
                  Facebook
                </SocialButton>
                <SocialButton
                  startIcon={<TwitterIcon />}
                  variant="outlined"
                  href="https://twitter.com"
                  target="_blank"
                >
                  Twitter
                </SocialButton>
                <SocialButton
                  startIcon={<InstagramIcon />}
                  variant="outlined"
                  href="https://instagram.com"
                  target="_blank"
                >
                  Instagram
                </SocialButton>
              </Box>
            </ContactCard>
          </Grid>
        </Grid>
      </Container>

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
    </ContactContainer>
  );
};

export default Contacto; 