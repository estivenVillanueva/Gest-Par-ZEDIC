import React, { useState, useEffect, useRef } from 'react';
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
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import safeparkingLogo from '../../assets/safeparking.png';
import { useAuth } from '../../../logic/AuthContext';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { format } from 'date-fns';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';

const navigationItems = [
  { 
    label: 'Inicio', 
    path: '/dashboard',
    icon: <DirectionsCarIcon />
  },
  { 
    label: 'Vehículos', 
    path: '/dashboard/vehiculos',
    icon: <DirectionsCarIcon />
  },
  { 
    label: 'Facturas', 
    path: '/dashboard/pagos',
    icon: <PaymentIcon />
  },
  { 
    label: 'Solicitudes', 
    path: '/dashboard/solicitudes',
    icon: <AssessmentIcon />
  },
  { 
    label: 'Reportes', 
    path: '/dashboard/reportes',
    icon: <AssessmentIcon />
  },
  { 
    label: 'Ingresos', 
    path: '/dashboard/ingresos',
    icon: <LocalParkingIcon />
  }
];

const DashboardHeader = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [seleccionando, setSeleccionando] = useState(false);
  const [seleccionadas, setSeleccionadas] = useState([]);

  const fetchNotificaciones = async () => {
    if (!currentUser) return;
    try {
      let url = '';
      if (currentUser.tipo_usuario === 'admin' && currentUser.parqueadero_id) {
        url = `https://gest-par-zedic.onrender.com/api/usuarios/parqueadero/${currentUser.parqueadero_id}/notificaciones`;
      } else if (currentUser.id) {
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

  useEffect(() => {
    let intervalId;
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
      if (currentUser.tipo_usuario === 'admin' && currentUser.parqueadero_id) {
        await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/notificaciones/parqueadero/${currentUser.parqueadero_id}/todas-leidas`, { method: 'PUT' });
      } else {
        await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/notificaciones/${currentUser.id}/todas-leidas`, { method: 'PUT' });
      }
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
        borderRadius: 0
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: { xs: '90px', sm: '110px', md: '130px' }, px: { xs: 2, sm: 4 } }}>
        {/* Logo y Título */}
        <Box 
          component={Link}
          to="/dashboard"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            gap: 2
          }}
        >
          <Typography 
            variant="h4"
            sx={{ 
              color: '#2B6CA3',
              fontWeight: 700,
              display: { xs: 'none', sm: 'block' },
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            ZEDIC
          </Typography>
          <DirectionsCarIcon sx={{ color: '#2B6CA3', display: { xs: 'block', sm: 'none' }, fontSize: 40 }} />
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={seleccionando ? "Cancelar selección" : "Seleccionar notificaciones"}>
                <IconButton size="small" onClick={() => {
                  setSeleccionando(s => !s);
                  setSeleccionadas([]);
                }}>
                  <EditIcon color={seleccionando ? 'primary' : 'action'} />
                </IconButton>
              </Tooltip>
              {seleccionando && seleccionadas.length > 0 && (
                <Tooltip title="Eliminar seleccionadas">
                  <IconButton size="small" color="error" onClick={async () => {
                    if (window.confirm('¿Seguro que deseas eliminar las notificaciones seleccionadas?')) {
                      await Promise.all(seleccionadas.map(id => fetch(`https://gest-par-zedic.onrender.com/api/usuarios/notificaciones/${id}`, { method: 'DELETE' })));
                      await fetchNotificaciones();
                      setSeleccionadas([]);
                      setSeleccionando(false);
                    }
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
              {!seleccionando && notificaciones.length > 0 && unreadCount > 0 && (
                <Tooltip title="Marcar todas como leídas">
                  <IconButton size="small" onClick={handleMarcarTodasLeidas}>
                    <DoneAllIcon color="success" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          <Divider />
          {notificaciones.length === 0 && (
            <MenuItem disabled>No hay notificaciones</MenuItem>
          )}
          {notificaciones.map((n) => {
            let icon = null;
            let color = '#1976d2';
            let link = null;
            if (n.tipo === 'pago') {
              icon = <PaymentIcon sx={{ color: '#43a047', mr: 1 }} />;
              color = '#e8f5e9';
              link = `/dashboard/pagos`;
            } else if (n.tipo === 'vehiculo') {
              icon = <DirectionsCarIcon sx={{ color: '#1976d2', mr: 1 }} />;
              color = '#e3f2fd';
              link = `/dashboard/vehiculos`;
            } else if (n.tipo === 'pago_pendiente') {
              icon = <AssignmentLateIcon sx={{ color: '#fbc02d', mr: 1 }} />;
              color = '#fffde7';
              link = `/dashboard/pagos`;
            } else if (n.tipo === 'reserva') {
              icon = <EventNoteIcon sx={{ color: '#8e24aa', mr: 1 }} />;
              color = '#f3e5f5';
              link = `/dashboard/solicitudes`;
            }
            return (
              <MenuItem
                key={n.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  position: 'relative',
                  pl: seleccionando ? 0 : 2
                }}
                onClick={() => {
                  if (seleccionando) {
                    setSeleccionadas(prev => prev.includes(n.id) ? prev.filter(x => x !== n.id) : [...prev, n.id]);
                  }
                }}
                selected={seleccionando && seleccionadas.includes(n.id)}
              >
                {seleccionando && (
                  <Checkbox
                    checked={seleccionadas.includes(n.id)}
                    onChange={() => setSeleccionadas(prev => prev.includes(n.id) ? prev.filter(x => x !== n.id) : [...prev, n.id])}
                    sx={{ p: 0.5, mr: 1 }}
                  />
                )}
                {icon}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{n.titulo}</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'normal' }}>{n.mensaje}</Typography>
                </Box>
                {!seleccionando && (
                  <IconButton size="small" onClick={async (e) => {
                    e.stopPropagation();
                    await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/notificaciones/${n.id}`, { method: 'DELETE' });
                    await fetchNotificaciones();
                  }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </MenuItem>
            );
          })}
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
          <MenuItem component={Link} to="/dashboard/perfil" onClick={handleClose}>
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
    </AppBar>
  );
};

export default DashboardHeader; 