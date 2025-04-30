import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import HistorialVistas from '../common/HistorialVistas';
import {
  LayoutContainer,
  MainContent,
  FooterContainer
} from '../../styles/components/Layout.styles';

const Layout = () => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        <Container>
          <Outlet />
        </Container>
      </MainContent>
      <FooterContainer>
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 | Tema de  Gest-Par ZEDIC
          </Typography>
        </Container>
      </FooterContainer>
      <Footer />
      <HistorialVistas />
    </LayoutContainer>
  );
};

export default Layout; 