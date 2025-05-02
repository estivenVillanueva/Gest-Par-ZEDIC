import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import safeparkingLogo from '../../assets/safeparking.png';
import {
  StyledAppBar,
  HeaderContainer,
  HeaderToolbar,
  LogoContainer,
  NavContainer,
  NavButton,
  ActionButton,
} from '../../styles/components/Header.styles';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Servicios', path: '/servicios' },
    { label: 'Contacto', path: '/contacto' },
  ];

  return (
    <StyledAppBar position="fixed">
      <HeaderContainer maxWidth="xl">
        <HeaderToolbar>
          <LogoContainer>
            <Link to="/">
              <img 
                src={safeparkingLogo}
                alt="Parqueaderos M.C.K.A.Z Logo" 
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                 Gest-Par ZEDIC
              </Typography>
            </Link>
          </LogoContainer>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {navigationItems.map((item) => (
                  <MenuItem 
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={handleClose}
                    selected={location.pathname === item.path}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                <MenuItem 
                  component={Link} 
                  to="/acceder"
                  onClick={handleClose}
                >
                  Acceder
                </MenuItem>
              </Menu>
            </>
          ) : (
            <NavContainer>
              {navigationItems.map((item) => (
                <NavButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    borderBottom: location.pathname === item.path ? 
                      `2px solid ${theme.palette.primary.main}` : 'none'
                  }}
                >
                  {item.label}
                </NavButton>
              ))}
              <ActionButton
                component={Link}
                to="/acceder"
                variant="contained"
                color="primary"
              >
                Acceder
              </ActionButton>
            </NavContainer>
          )}
        </HeaderToolbar>
      </HeaderContainer>
    </StyledAppBar>
  );
};

export default Header; 