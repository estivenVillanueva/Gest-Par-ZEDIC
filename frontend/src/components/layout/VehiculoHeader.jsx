import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAuth } from '../../../logic/AuthContext';

const navigationItems = [
  { 
    label: 'Inicio', 
    path: '/vehiculo/inicio',
    icon: <DirectionsCarIcon />
  },
  { 
    label: 'Mis Vehículos', 
    path: '/vehiculo/mis-vehiculos',
    icon: <DirectionsCarIcon />
  },
  { 
    label: 'Reservas', 
    path: '/vehiculo/reservas',
    icon: <CalendarMonthIcon />
  },
  {
    label: 'Pagos',
    path: '/vehiculo/pagos',
    icon: <PaymentIcon />
  }
];

const iconByType = {
  reserva: <CalendarMonthIcon color="primary" sx={{ mr: 1 }} />,
  vehiculo: <DirectionsCarIcon color="info" sx={{ mr: 1 }} />,
  factura: <PaymentIcon color="error" sx={{ mr: 1 }} />,
};

const VehiculoHeader = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let intervalId;
    const fetchNotificaciones = async () => {
      if (!currentUser) return;
      try {
        let url = '';
        if (currentUser.id) {
          url = `https://gest-par-zedic.onrender.com/api/usuarios/${currentUser.id}/notificaciones`;
        } else {
          setNotificaciones([]);
          return;
        }
        const res = await fetch(url);
        const data = await res.json();
        setNotificaciones(data.data || []);
      } catch (err) {
        setNotificaciones([]);
      }
    };
    fetchNotificaciones();
    if (currentUser) {
      intervalId = setInterval(fetchNotificaciones, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentUser]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
  };

  const handleMarcarLeida = async (id) => {
    try {
      await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/notificaciones/${id}/leida`, { method: 'PUT' });
      setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    } catch {}
  };

  const handleMarcarTodasLeidas = async () => {
    if (!currentUser) return;
    try {
      await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/notificaciones/${currentUser.id}/todas-leidas`, { method: 'PUT' });
      await fetchNotificaciones();
    } catch {}
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      navigate('/acceder');
    } catch (error) {
      // Puedes mostrar un mensaje de error si lo deseas
    }
  };

  const unreadCount = notificaciones.filter(n => !n.leida).length;

  return (
    <AppBar 
      position="sticky" 
      sx={{
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', height: { xs: '56px', sm: '64px', md: '70px' }, px: { xs: 1, sm: 2 } }}>
          {/* Logo y Título */}
          <Box 
            component={Link}
            to="/vehiculo/inicio"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2B6CA3',
                fontWeight: 600,
                display: { xs: 'none', sm: 'block' },
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
              }}
            >
              Gest-Par ZEDI
            </Typography>
            <DirectionsCarIcon sx={{ color: '#2B6CA3', display: { xs: 'block', sm: 'none' }, fontSize: 28 }} />
          </Box>

          {/* Menú Hamburguesa en móvil */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#2B6CA3', mr: 1 }}>
              <MenuIcon fontSize="large" />
            </IconButton>
          </Box>

          {/* Navegación Principal (oculta en móvil) */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 1,
            alignItems: 'center',
            '& a': {
              textDecoration: 'none'
            }
          }}>
            {navigationItems.map((item) => (
              <Box
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? '#2B6CA3' : '#64748B',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(43, 108, 163, 0.08)',
                    color: '#2B6CA3'
                  }
                }}
              >
                {item.icon}
                <Typography sx={{ fontWeight: 500 }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Acciones Rápidas */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notificaciones */}
            <Tooltip title="Notificaciones">
              <IconButton 
                onClick={handleNotificationsClick}
                sx={{ color: '#64748B' }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Menú de Usuario */}
            <Tooltip title="Configuración">
              <IconButton
                onClick={handleProfileClick}
                sx={{ 
                  padding: 0.5,
                  border: '2px solid rgba(43, 108, 163, 0.1)',
                  '&:hover': {
                    border: '2px solid rgba(43, 108, 163, 0.2)',
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 35, 
                    height: 35,
                    backgroundColor: '#2B6CA3'
                  }}
                >
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Drawer para navegación en móvil */}
          <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Box sx={{ width: 240, pt: 2 }} role="presentation" onClick={() => setDrawerOpen(false)}>
              <List>
                {navigationItems.map((item) => (
                  <ListItem button key={item.path} component={Link} to={item.path} selected={location.pathname === item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>

          {/* Menú de Notificaciones */}
          <Menu
            anchorEl={notificationsAnchor}
            open={Boolean(notificationsAnchor)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: '300px',
                mt: 1.5,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>
                Notificaciones
              </Typography>
              {notificaciones.length > 0 && unreadCount > 0 && (
                <Tooltip title="Marcar todas como leídas">
                  <IconButton size="small" onClick={handleMarcarTodasLeidas}>
                    <DoneAllIcon color="success" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Divider />
            {notificaciones.length === 0 && (
              <MenuItem disabled>No hay notificaciones</MenuItem>
            )}
            {notificaciones.map((n) => (
              <MenuItem
                key={n.id}
                onClick={() => { handleMarcarLeida(n.id); handleClose(); }}
                sx={{
                  bgcolor: n.tipo === 'factura' && (n.estado === 'pendiente' || n.estado === 'Pendiente') ? 'rgba(255,0,0,0.08)' : undefined,
                  fontWeight: !n.leida ? 700 : 400,
                  color: !n.leida ? '#2B6CA3' : 'inherit',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1
                }}
              >
                {iconByType[n.tipo] || <NotificationsIcon color="action" sx={{ mr: 1 }} />}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{n.titulo}</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'normal' }}>{n.mensaje}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>

          {/* Menú de Usuario */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: '200px',
                mt: 1.5,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <MenuItem component={Link} to="/vehiculo/perfil" onClick={handleClose}>
              <PersonIcon sx={{ mr: 1 }} /> Perfil
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={handleLogout}
              sx={{ color: 'error.main' }}
            >
              <ExitToAppIcon sx={{ mr: 1 }} /> Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default VehiculoHeader; 