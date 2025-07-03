import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import safeparkingLogo from '../../assets/safeparking.png';
import {
  StyledAppBar,
  HeaderContainer,
  HeaderToolbar,
  LogoContainer,
  NavContainer,
  NavButton,
  ActionButton,
  MobileMenu,
} from '../../styles/components/Header.styles';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const prevScrollPos = useRef(0);
  const hideAt = useRef(0);

  useEffect(() => {
    const handleWindowScroll = () => {
      const currentScrollPos = window.scrollY;
      setScrolled(currentScrollPos > 10);

      if (currentScrollPos > prevScrollPos.current && currentScrollPos > 50) {
        setVisible(false);
        hideAt.current = currentScrollPos;
      } else if (currentScrollPos < prevScrollPos.current && hideAt.current - currentScrollPos > 30) {
        setVisible(true);
      }
      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

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
    <StyledAppBar 
      position="fixed"
      {...(scrolled ? { scrolled: true } : {})}
      {...(visible ? { visible: true } : {})}
    >
      <HeaderContainer maxWidth="xl">
        <HeaderToolbar>
          <LogoContainer>
            <Link to="/">
              <img 
                src={safeparkingLogo}
                alt="ZEDIC Logo" 
              />
              <Typography variant="h6">
                ZEDIC
              </Typography>
            </Link>
          </LogoContainer>

          {isMobile ? (
            <>
              <Tooltip title="Menú">
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                  sx={{
                    color: theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: 'rgba(43, 108, 163, 0.04)',
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
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
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    borderRadius: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <MobileMenu>
                  {navigationItems.map((item) => (
                    <MenuItem 
                      key={item.path}
                      component={Link}
                      to={item.path}
                      onClick={handleClose}
                      selected={location.pathname === item.path}
                      className="mobile-nav-link"
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                  <Box sx={{ pt: 1, mt: 1, borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <MenuItem 
                      component={Link} 
                      to="/acceder"
                      onClick={handleClose}
                      className="mobile-nav-link"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      }}
                    >
                      <LoginIcon sx={{ mr: 1 }} />
                      Acceder
                    </MenuItem>
                  </Box>
                </MobileMenu>
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
                startIcon={<LoginIcon />}
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