import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  MenuItem,
  IconButton,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../logic/AuthContext';

const InfoItem = ({ icon, title, value, onEdit }) => (
  <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <IconButton onClick={onEdit} size="small">
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
    <Typography variant="body1" color="text.secondary">
      {value || 'No especificado'}
    </Typography>
  </Box>
);

const PARQUEADERO_API_URL = 'https://gest-par-zedic.onrender.com/parqueaderos'; // URL correcta del backend

const ParqueaderoProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openAdminModal, setOpenAdminModal] = useState(false);
  const [parqueaderoInfo, setParqueaderoInfo] = useState({
    nombre: '',
    direccion: '',
    capacidad: '',
    horarios: '',
    telefono: '',
    email: '',
    descripcion: '',
    servicios: [],
    beneficios: [],
    administrador: {
      nombre: '',
      cargo: '',
      identificacion: '',
      telefono: '',
      email: '',
      experiencia: '',
      fechaInicio: ''
    }
  });
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Mostrar mensaje de bienvenida solo si es la primera vez
    if (localStorage.getItem('showWelcomePending')) {
      setShowWelcome(true);
      localStorage.removeItem('showWelcomePending');
      localStorage.removeItem('showWelcome');
    }
    const cargarDatosParqueadero = async () => {
      if (!currentUser || !currentUser.id) return; // Validación para evitar id=undefined
      try {
        // Buscar parqueadero por usuario_id
        const response = await fetch(`${PARQUEADERO_API_URL}?usuario_id=${currentUser.id}`);
        if (!response.ok) throw new Error('Error al obtener datos');
        const data = await response.json();
        // Si la API devuelve un array, tomar el primero
        setParqueaderoInfo(Array.isArray(data.data) ? data.data[0] : data.data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error al cargar los datos del parqueadero',
          severity: 'error'
        });
      }
    };
    cargarDatosParqueadero();
  }, [currentUser]);

  const handleEdit = (field, value) => {
    setEditField(field);
    setEditValue(value);
    setOpenEdit(true);
  };

  const handleSave = async () => {
    try {
      const updatedData = { ...parqueaderoInfo, [editField]: editValue };
      const response = await fetch(`${PARQUEADERO_API_URL}/${parqueaderoInfo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) throw new Error('Error al actualizar');
      const data = await response.json();
      setParqueaderoInfo(data.data);
      setSnackbar({
        open: true,
        message: 'Cambios guardados exitosamente',
        severity: 'success'
      });
      setOpenEdit(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al guardar los cambios',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (showWelcome) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            ¡Bienvenido a Gest-Par ZEDIC!
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Tu cuenta ha sido creada exitosamente.<br />
            Empecemos a configurar tu parqueadero en el sistema.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4 }}
            onClick={() => setShowWelcome(false)}
          >
            Continuar
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: 'primary.main',
                mr: 3
              }}
            >
              <LocalParkingIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {parqueaderoInfo.nombre}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Perfil del Parqueadero
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={() => setOpenAdminModal(true)}
          >
            Ver información del administrador
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Información General
            </Typography>
            
            <InfoItem
              icon={<BusinessIcon color="primary" />}
              title="Nombre"
              value={parqueaderoInfo.nombre}
              onEdit={() => handleEdit('nombre', parqueaderoInfo.nombre)}
            />
            
            <InfoItem
              icon={<LocationOnIcon color="primary" />}
              title="Dirección"
              value={parqueaderoInfo.direccion}
              onEdit={() => handleEdit('direccion', parqueaderoInfo.direccion)}
            />
            
            <InfoItem
              icon={<LocalParkingIcon color="primary" />}
              title="Capacidad"
              value={parqueaderoInfo.capacidad}
              onEdit={() => handleEdit('capacidad', parqueaderoInfo.capacidad)}
            />
            
            <InfoItem
              icon={<AccessTimeIcon color="primary" />}
              title="Horarios"
              value={parqueaderoInfo.horarios}
              onEdit={() => handleEdit('horarios', parqueaderoInfo.horarios)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Contacto y Redes Sociales
            </Typography>
            
            <InfoItem
              icon={<PhoneIcon color="primary" />}
              title="Teléfono"
              value={parqueaderoInfo.telefono}
              onEdit={() => handleEdit('telefono', parqueaderoInfo.telefono)}
            />
            
            <InfoItem
              icon={<EmailIcon color="primary" />}
              title="Email"
              value={parqueaderoInfo.email}
              onEdit={() => handleEdit('email', parqueaderoInfo.email)}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <IconButton color="primary" size="large">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" size="large">
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Descripción
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="body1">
                {parqueaderoInfo.descripcion}
              </Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => handleEdit('descripcion', parqueaderoInfo.descripcion)}
                sx={{ mt: 2 }}
              >
                Editar descripción
              </Button>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Servicios Ofrecidos
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {parqueaderoInfo.servicios.map((servicio, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      minHeight: 100,
                      borderRadius: 3,
                      boxShadow: '0 2px 8px rgba(43,108,163,0.04)',
                      position: 'relative',
                      transition: 'box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 16px rgba(43,108,163,0.10)',
                        '.servicio-actions': { opacity: 1 }
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {servicio.tipo}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        {servicio.tarifa}
                      </Typography>
                    </Box>
                    <Box
                      className="servicio-actions"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleEdit('servicio', { ...servicio, index })}
                        aria-label="Editar servicio"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setParqueaderoInfo(prev => ({
                            ...prev,
                            servicios: prev.servicios.filter((_, i) => i !== index)
                          }));
                          setSnackbar({ open: true, message: 'Servicio eliminado', severity: 'success' });
                        }}
                        aria-label="Eliminar servicio"
                      >
                        <span style={{ fontWeight: 'bold', fontSize: 18, lineHeight: 1 }}>×</span>
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
              ))}
              <Grid item xs={12} sm={4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    minHeight: 100,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                    border: '1.5px dashed #2B6CA3',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    '&:hover': {
                      background: 'rgba(43,108,163,0.04)',
                    }
                  }}
                  onClick={() => handleEdit('servicio', { tipo: '', tarifa: '', index: -1 })}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 400, mb: 0.5 }}>+</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Agregar servicio
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar {editField === 'servicio' ? 'servicio' : editField}</DialogTitle>
        <DialogContent>
          {editField === 'servicio' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Tipo de servicio"
                value={editValue.tipo}
                onChange={e => setEditValue({ ...editValue, tipo: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Tarifa"
                value={editValue.tarifa}
                onChange={e => setEditValue({ ...editValue, tarifa: e.target.value })}
              />
            </Box>
          ) : (
            <TextField
              fullWidth
              multiline={editField === 'descripcion'}
              rows={editField === 'descripcion' ? 4 : 1}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={() => {
            if (editField === 'servicio') {
              setParqueaderoInfo(prev => {
                const servicios = [...prev.servicios];
                if (editValue.index === -1) {
                  servicios.push({ tipo: editValue.tipo, tarifa: editValue.tarifa });
                } else {
                  servicios[editValue.index] = { tipo: editValue.tipo, tarifa: editValue.tarifa };
                }
                return { ...prev, servicios };
              });
              setSnackbar({ open: true, message: 'Servicio guardado', severity: 'success' });
              setOpenEdit(false);
            } else {
              handleSave();
            }
          }} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL ADMINISTRADOR */}
      <Dialog open={openAdminModal} onClose={() => setOpenAdminModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Información del Administrador</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<PersonIcon color="primary" />}
                title="Nombre del Administrador"
                value={parqueaderoInfo.administrador.nombre}
                onEdit={() => handleEdit('administrador.nombre', parqueaderoInfo.administrador.nombre)}
              />
              <InfoItem
                icon={<BadgeIcon color="primary" />}
                title="Identificación"
                value={parqueaderoInfo.administrador.identificacion}
                onEdit={() => handleEdit('administrador.identificacion', parqueaderoInfo.administrador.identificacion)}
              />
              <InfoItem
                icon={<WorkIcon color="primary" />}
                title="Cargo"
                value={parqueaderoInfo.administrador.cargo}
                onEdit={() => handleEdit('administrador.cargo', parqueaderoInfo.administrador.cargo)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<PhoneIcon color="primary" />}
                title="Teléfono"
                value={parqueaderoInfo.administrador.telefono}
                onEdit={() => handleEdit('administrador.telefono', parqueaderoInfo.administrador.telefono)}
              />
              <InfoItem
                icon={<EmailIcon color="primary" />}
                title="Email"
                value={parqueaderoInfo.administrador.email}
                onEdit={() => handleEdit('administrador.email', parqueaderoInfo.administrador.email)}
              />
              <InfoItem
                icon={<AccessTimeIcon color="primary" />}
                title="Fecha de Inicio"
                value={parqueaderoInfo.administrador.fechaInicio}
                onEdit={() => handleEdit('administrador.fechaInicio', parqueaderoInfo.administrador.fechaInicio)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Experiencia
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {parqueaderoInfo.administrador.experiencia}
                </Typography>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit('administrador.experiencia', parqueaderoInfo.administrador.experiencia)}
                  sx={{ mt: 1 }}
                >
                  Editar experiencia
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdminModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

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
    </Container>
  );
};

export default ParqueaderoProfile; 