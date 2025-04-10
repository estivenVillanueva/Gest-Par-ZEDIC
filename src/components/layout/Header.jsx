import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';
import Logo from '../../assets/logo';
import {
  StyledAppBar,
  HeaderToolbar,
  LogoContainer,
  ButtonContainer
} from '../../styles/components/Layout.styles';

const Header = () => {
  return (
    <StyledAppBar position="fixed" className="navbar navbar-expand-lg">
      <Container className="container-fluid">
        <HeaderToolbar>
          <LogoContainer>
            <Link to="/" className="navbar-brand">
              <Logo />
              <Typography variant="h6" component="div">
                Parqueaderos M.C.K.A.Z
              </Typography>
            </Link>
          </LogoContainer>
          <ButtonContainer>
            <Button
              component={Link}
              to="/acceder"
              variant="outlined"
              color="inherit"
              className="btn btn-outline-light"
            >
              Acceder
            </Button>
          </ButtonContainer>
        </HeaderToolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header; 