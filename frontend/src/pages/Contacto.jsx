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
      icon: <EmailIcon sx={{ fontSize: 32, color: '#2B6CA3' }} />,
      title: 'Email',
      content: 'gestparzedic@gmail.com',
      action: 'mailto:gestparzedic@gmail.com'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 32, color: '#2B6CA3' }} />,
      title: 'Teléfono',
      content: '3219861509',
      action: 'tel:3219861509'
    },
    {
      icon: <WhatsAppIcon sx={{ fontSize: 32, color: '#25D366' }} />,
      title: 'WhatsApp',
      content: '3219861509',
      action: 'https://wa.me/573219861509'
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 32, color: '#E53935' }} />,
      title: 'Dirección',
      content: 'Cra. 18 #7-58, Armenia, Quindío',
      action: 'https://maps.google.com/?q=Cra.+18+%237-58,+Armenia,+Quindío'
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
          <Grid item xs={12}>
            <Grid container spacing={3} justifyContent="center" alignItems="stretch" direction={{ xs: 'column', md: 'row' }}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <ContactInfoCard sx={{ mb: { xs: 2, md: 0 }, boxShadow: 4, border: '1.5px solid #e3e9f1', minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <ContactIcon sx={{ backgroundColor: 'rgba(43,108,163,0.12)', mb: 1, width: 56, height: 56 }}>
                      {info.icon}
                    </ContactIcon>
                    <Typography variant="h6" gutterBottom sx={{ color: '#2B6CA3', fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>
                      {info.title}
                    </Typography>
                    <Typography 
                      component="a" 
                      href={info.action}
                      sx={{ 
                        color: '#1a4971',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '1.08rem',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#2B6CA3'
                        }
                      }}
                    >
                      {info.content}
                    </Typography>
                  </ContactInfoCard>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, mb: 2 }}>
              <SocialButton href="https://facebook.com" target="_blank" variant="outlined" startIcon={<FacebookIcon sx={{ color: '#1877F3' }} />}>Facebook</SocialButton>
              <SocialButton href="https://twitter.com" target="_blank" variant="outlined" startIcon={<TwitterIcon sx={{ color: '#1DA1F2' }} />}>Twitter</SocialButton>
              <SocialButton href="https://instagram.com" target="_blank" variant="outlined" startIcon={<InstagramIcon sx={{ color: '#E4405F' }} />}>Instagram</SocialButton>
            </Box>
          </Grid>

          {/* Formulario de contacto */}
          <Grid item xs={12} md={8}>
            <ContactCard sx={{ background: 'linear-gradient(120deg, #f8fafc 80%, #e3e9f1 100%)', boxShadow: 6, border: '1.5px solid #e3e9f1', mt: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#2B6CA3', mb: 4, fontWeight: 700, textAlign: 'center' }}>
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
                      sx={{ mb: 2 }}
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
                      sx={{ mb: 2 }}
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
                      sx={{ mb: 2 }}
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
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <SubmitButton
                        type="submit"
                        sx={{
                          background: 'linear-gradient(90deg, #2B6CA3 60%, #1a4971 100%)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          px: 5,
                          py: 1.5,
                          borderRadius: 2,
                          boxShadow: '0 6px 16px rgba(43, 108, 163, 0.18)',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #1a4971 60%, #2B6CA3 100%)',
                            color: 'white',
                          }
                        }}
                      >
                        Enviar mensaje
                      </SubmitButton>
                    </Box>
                  </Grid>
                </Grid>
              </ContactForm>
            </ContactCard>
          </Grid>
        </Grid>
        {/* Mapa de ubicación */}
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <iframe
            title="Ubicación Gest-Par ZEDIC"
            src="https://www.google.com/maps?q=Cra.+18+%237-58,+Armenia,+Quindío&output=embed"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: 16, maxWidth: 700 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Box>
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