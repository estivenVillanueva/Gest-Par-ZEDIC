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
      <Footer />
      <HistorialVistas />
    </LayoutContainer>
  );
};

export default Layout; 