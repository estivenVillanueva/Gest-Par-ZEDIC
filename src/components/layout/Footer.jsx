import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import {
  StyledFooter,
  FooterSection,
  SocialIconButton
} from '../../styles/components/Layout.styles';

const Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FooterSection>
              <Typography variant="h6" gutterBottom>
                Eficiencia
              </Typography>
              <Typography>
                Automatización completa para agilizar tus operaciones
              </Typography>
            </FooterSection>
          </Grid>
          <Grid item xs={12} md={4}>
            <FooterSection>
              <Typography variant="h6" gutterBottom>
                Precisión
              </Typography>
              <Typography>
                Gestión exacta de pagos y registros sin margen de error
              </Typography>
            </FooterSection>
          </Grid>
          <Grid item xs={12} md={4}>
            <FooterSection>
              <Typography variant="h6" gutterBottom>
                Satisfacción del cliente
              </Typography>
              <Typography>
                Una experiencia sin igual para ti y tus clientes
              </Typography>
            </FooterSection>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="body2" align="center" gutterBottom>
            Seguridad, confiabilidad y rentabilidad son nuestras garantías. Con Parqueadero M.C.K.A.Z obtendrás un servicio de calidad que se adapta a las necesidades del mercado moderno.
          </Typography>
        </Box>

        <Box mt={3} display="flex" justifyContent="center">
          <Box mr={4} display="flex" alignItems="center">
            <PhoneIcon sx={{ mr: 1 }} />
            <Typography>Teléfono:</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <ChatIcon sx={{ mr: 1 }} />
            <Typography>Chat</Typography>
          </Box>
        </Box>

        <Box mt={2} display="flex" justifyContent="center">
          <SocialIconButton>
            <FacebookIcon />
          </SocialIconButton>
          <SocialIconButton>
            <TwitterIcon />
          </SocialIconButton>
          <SocialIconButton>
            <TelegramIcon />
          </SocialIconButton>
        </Box>

        <Typography variant="body2" align="center" mt={2}>
          © 2024 | Tema de parqueadero M.C.K.A.Z
        </Typography>
      </Container>
    </StyledFooter>
  );
};

export default Footer; 