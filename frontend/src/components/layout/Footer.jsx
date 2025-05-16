import React from 'react';
import { Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import {
  FooterWrapper,
  FooterContainer,
  FooterSection,
  SocialIconsContainer,
  BottomFooter
} from '../../styles/components/Footer.styles';

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterSection>
          <Typography variant="h6">Gest-Par ZEDIC</Typography>
          <Typography component="p">
            Red de parqueaderos seguros con ubicaciones estratégicas en toda la ciudad.
          </Typography>
          <SocialIconsContainer>
            <MuiLink href="https://facebook.com" target="_blank" aria-label="Facebook">
              <FacebookIcon />
            </MuiLink>
            <MuiLink href="https://twitter.com" target="_blank" aria-label="Twitter">
              <TwitterIcon />
            </MuiLink>
            <MuiLink href="https://t.me" target="_blank" aria-label="Telegram">
              <TelegramIcon />
            </MuiLink>
          </SocialIconsContainer>
        </FooterSection>

        <FooterSection>
          <Typography variant="h6">Enlaces Rápidos</Typography>
          <Link to="/parqueaderos">Buscar Parqueaderos</Link>
          <Link to="/reservas">Mis Reservas</Link>
          <Link to="/tarifas">Tarifas</Link>
          <Link to="/beneficios">Beneficios</Link>
        </FooterSection>

        <FooterSection>
          <Typography variant="h6">Servicios</Typography>
          <Link to="/registro-parqueadero">Registra tu Parqueadero</Link>
          <Link to="/planes">Planes y Precios</Link>
          <Link to="/soporte">Soporte Técnico</Link>
          <Link to="/faq">Preguntas Frecuentes</Link>
        </FooterSection>

        <FooterSection>
          <Typography variant="h6">Contacto</Typography>
          <Typography component="p">Teléfono: +57 300 123 4567</Typography>
          <Typography component="p">Email: info@parqueaderos.com</Typography>
          <Typography component="p">
            Dirección: Calle Principal #123
            Bogotá, Colombia
          </Typography>
        </FooterSection>
      </FooterContainer>

      <BottomFooter>
        <Typography component="p">
          © {new Date().getFullYear()} | Tema de  Gest-Par ZEDIC | Todos los derechos reservados
        </Typography>
      </BottomFooter>
    </FooterWrapper>
  );
};

export default Footer; 