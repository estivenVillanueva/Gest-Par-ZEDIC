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

const PARQUEADERO_API_URL = 'https://gest-par-zedic.onrender.com/api/parqueaderos'; // URL correcta del backend
const SERVICIOS_API_URL = 'https://gest-par-zedic.onrender.com/api/servicios';

const ParqueaderoProfile = () => {
  const { currentUser } = useAuth();
  console.log('currentUser en ParqueaderoProfile:', currentUser);
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    // Mostrar mensaje de bienvenida solo si es la primera vez
    if (localStorage.getItem('showWelcomePending')) {
      setShowWelcome(true);
      localStorage.removeItem('showWelcomePending');
      localStorage.removeItem('showWelcome');
    }
    const cargarDatosParqueadero = async () => {
      console.log('Intentando cargar parqueadero para usuario:', currentUser?.id);
      if (!currentUser || !currentUser.id) return; // Validación para evitar id=undefined
      try {
        // 1. Obtener parqueadero por usuario
        const response = await fetch(`${PARQUEADERO_API_URL}/usuario/${currentUser.id}`);
        console.log('Respuesta fetch:', response);
        if (!response.ok) throw new Error('Error al obtener datos');
        const data = await response.json();
        console.log('Respuesta de la API al cargar parqueadero:', data);
        const parqueadero = data.data;

        // 2. Obtener servicios por parqueadero
        let servicios = [];
        if (parqueadero && parqueadero.id) {
          const serviciosRes = await fetch(`${SERVICIOS_API_URL}/parqueadero/${parqueadero.id}`);
          if (serviciosRes.ok) {
            const serviciosData = await serviciosRes.json();
            servicios = serviciosData.data || [];
          }
        }

        // 3. Actualizar el estado con los servicios
        setParqueaderoInfo({ ...parqueadero, servicios });
      } catch (error) {
        console.error('Error al cargar parqueadero:', error);
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
    // Si el campo es del usuario
    if (editField.startsWith('usuario.')) {
      const field = editField.replace('usuario.', '');
      try {
        const updatedUser = { ...currentUser, [field]: editValue };
        const response = await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser)
        });
        if (!response.ok) throw new Error('Error al actualizar usuario');
        const data = await response.json();
        setSnackbar({
          open: true,
          message: 'Cambios guardados exitosamente',
          severity: 'success'
        });
        setOpenEdit(false);
        // Volver a cargar los datos actualizados del usuario y actualizar el estado local
        const refreshed = await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/${currentUser.id}`);
        if (refreshed.ok) {
          const refreshedData = await refreshed.json();
          // Si tienes un contexto global de usuario, actualízalo aquí
          // setCurrentUser(refreshedData.data);
          // Actualizar el estado local del usuario para reflejar los cambios en la interfaz
          currentUser.nombre = refreshedData.data.nombre;
          currentUser.telefono = refreshedData.data.telefono;
          currentUser.ubicacion = refreshedData.data.ubicacion;
          currentUser.correo = refreshedData.data.correo;
          currentUser.tipo_usuario = refreshedData.data.tipo_usuario;
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error al guardar los cambios',
          severity: 'error'
        });
      }
      return;
    }
    // Si el campo es del parqueadero
    if (editField.startsWith('parqueadero.')) {
      const field = editField.replace('parqueadero.', '');
      if (!parqueaderoInfo.id) {
        setSnackbar({
          open: true,
          message: 'No se encontró el parqueadero para actualizar.',
          severity: 'error'
        });
        return;
      }
      try {
        const updatedData = { ...parqueaderoInfo, [field]: editValue };
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
        // Volver a cargar los datos actualizados del parqueadero
        const refreshed = await fetch(`${PARQUEADERO_API_URL}/usuario/${currentUser.id}`);
        if (refreshed.ok) {
          const refreshedData = await refreshed.json();
          setParqueaderoInfo(refreshedData.data);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error al guardar los cambios',
          severity: 'error'
        });
      }
      return;
    }
    // ... (mantener el resto de la lógica si hay otros campos)
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/${currentUser.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Si tienes un método de logout en tu contexto de auth, úsalo aquí
        // logout();
        navigate('/login');
      } else {
        setSnackbar({ open: true, message: 'Error al eliminar la cuenta', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar la cuenta', severity: 'error' });
    }
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

  if (!currentUser) return <div>Cargando usuario...</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
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
              onEdit={() => handleEdit('parqueadero.nombre', parqueaderoInfo.nombre)}
            />
            
            <InfoItem
              icon={<LocationOnIcon color="primary" />}
              title="Dirección"
              value={parqueaderoInfo.direccion}
              onEdit={() => handleEdit('parqueadero.direccion', parqueaderoInfo.direccion)}
            />
            
            <InfoItem
              icon={<LocalParkingIcon color="primary" />}
              title="Capacidad"
              value={parqueaderoInfo.capacidad}
              onEdit={() => handleEdit('parqueadero.capacidad', parqueaderoInfo.capacidad)}
            />
            
            <InfoItem
              icon={<AccessTimeIcon color="primary" />}
              title="Horarios"
              value={parqueaderoInfo.horarios}
              onEdit={() => handleEdit('parqueadero.horarios', parqueaderoInfo.horarios)}
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
              onEdit={() => handleEdit('parqueadero.telefono', parqueaderoInfo.telefono)}
            />
            
            <InfoItem
              icon={<EmailIcon color="primary" />}
              title="Email"
              value={parqueaderoInfo.email}
              onEdit={() => handleEdit('parqueadero.email', parqueaderoInfo.email)}
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
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Descripción
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="body1">
                {parqueaderoInfo.descripcion}
              </Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => handleEdit('parqueadero.descripcion', parqueaderoInfo.descripcion)}
                sx={{ mt: 2 }}
              >
                Editar descripción
              </Button>
            </Paper>
            <Typography variant="h6" gutterBottom>
              Servicios Ofrecidos
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {(parqueaderoInfo.servicios || [])
                .filter(servicio => servicio && (servicio.nombre || servicio.precio))
                .map((servicio, index) => {
                  const tipoServicio = servicio.nombre || 'Sin tipo';
                  const tarifaServicio = servicio.precio || 'Sin tarifa';
                  return (
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
                            {tipoServicio}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            {tarifaServicio}
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
                            onClick={async () => {
                              const servicioId = parqueaderoInfo.servicios[index].id;
                              try {
                                const res = await fetch(`${SERVICIOS_API_URL}/${servicioId}`, { method: 'DELETE' });
                                if (res.ok) {
                                  setParqueaderoInfo(prev => ({ ...prev, servicios: prev.servicios.filter((_, i) => i !== index) }));
                                  setSnackbar({ open: true, message: 'Servicio eliminado', severity: 'success' });
                                } else {
                                  setSnackbar({ open: true, message: 'Error al eliminar el servicio', severity: 'error' });
                                }
                              } catch {
                                setSnackbar({ open: true, message: 'Error al eliminar el servicio', severity: 'error' });
                              }
                            }}
                            aria-label="Eliminar servicio"
                          >
                            <span style={{ fontWeight: 'bold', fontSize: 18, lineHeight: 1 }}>×</span>
                          </IconButton>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
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
                  onClick={() => handleEdit('servicio', { nombre: '', descripcion: '', precio: '', duracion: '', estado: '', index: -1 })}
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
        <Button
          variant="outlined"
          color="error"
          onClick={() => setOpenDeleteDialog(true)}
          sx={{ position: 'absolute', bottom: 24, right: 24 }}
        >
          Eliminar cuenta
        </Button>
      </Paper>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar {editField === 'servicio' ? 'servicio' : editField}</DialogTitle>
        <DialogContent>
          {editField === 'servicio' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                select
                fullWidth
                label="Nombre del servicio"
                value={["mes", "hora", "minuto", "semanal", "quincenal", "días", "otro"].includes(editValue.nombre) ? editValue.nombre : "otro"}
                onChange={e => {
                  const value = e.target.value;
                  setEditValue({ ...editValue, nombre: value === 'otro' ? '' : value, nombrePersonalizado: value === 'otro' ? (editValue.nombrePersonalizado || '') : '' });
                }}
                sx={{ mb: 2 }}
              >
                <MenuItem value="mes">Mes</MenuItem>
                <MenuItem value="hora">Hora</MenuItem>
                <MenuItem value="minuto">Minuto</MenuItem>
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="quincenal">Quincenal</MenuItem>
                <MenuItem value="días">Días</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </TextField>
              {((!['mes','hora','minuto','semanal','quincenal','días'].includes(editValue.nombre) && editValue.nombre !== '') || editValue.nombre === '') && (
                <TextField
                  fullWidth
                  label="Nombre personalizado del servicio"
                  value={editValue.nombrePersonalizado || ''}
                  onChange={e => setEditValue({ ...editValue, nombrePersonalizado: e.target.value, nombre: e.target.value })}
                  sx={{ mb: 2 }}
                />
              )}
              <TextField
                fullWidth
                label="Descripción"
                value={editValue.descripcion}
                onChange={e => setEditValue({ ...editValue, descripcion: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Precio"
                value={editValue.precio}
                onChange={e => setEditValue({ ...editValue, precio: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                select
                fullWidth
                label="Duración"
                value={["mes", "hora", "minuto", "semanal", "quincenal", "días", "otro"].includes(editValue.duracion) ? editValue.duracion : "otro"}
                onChange={e => {
                  const value = e.target.value;
                  setEditValue({ ...editValue, duracion: value === 'otro' ? '' : value, duracionPersonalizada: value === 'otro' ? (editValue.duracionPersonalizada || '') : '' });
                }}
                sx={{ mb: 2 }}
              >
                <MenuItem value="mes">Mes</MenuItem>
                <MenuItem value="hora">Hora</MenuItem>
                <MenuItem value="minuto">Minuto</MenuItem>
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="quincenal">Quincenal</MenuItem>
                <MenuItem value="días">Días</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </TextField>
              {((!['mes','hora','minuto','semanal','quincenal','días'].includes(editValue.duracion) && editValue.duracion !== '') || editValue.duracion === '') && (
                <TextField
                  fullWidth
                  label="Duración personalizada"
                  value={editValue.duracionPersonalizada || ''}
                  onChange={e => setEditValue({ ...editValue, duracionPersonalizada: e.target.value, duracion: e.target.value })}
                  sx={{ mb: 2 }}
                />
              )}
              <TextField
                select
                fullWidth
                label="Estado"
                value={editValue.estado}
                onChange={e => setEditValue({ ...editValue, estado: e.target.value })}
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </TextField>
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
              if (!parqueaderoInfo.id) {
                setSnackbar({ open: true, message: 'No se encontró el parqueadero para agregar servicio.', severity: 'error' });
                setOpenEdit(false);
                return;
              }
              if (editValue.index === -1) {
                // Crear servicio
                fetch(SERVICIOS_API_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    nombre: editValue.nombre,
                    descripcion: editValue.descripcion,
                    precio: editValue.precio,
                    duracion: editValue.duracion,
                    estado: editValue.estado,
                    parqueadero_id: parqueaderoInfo.id
                  })
                })
                  .then(res => res.json())
                  .then(data => {
                    setParqueaderoInfo(prev => ({ ...prev, servicios: [...prev.servicios, data.data] }));
                    setSnackbar({ open: true, message: 'Servicio guardado', severity: 'success' });
                    setOpenEdit(false);
                  })
                  .catch(() => {
                    setSnackbar({ open: true, message: 'Error al guardar el servicio', severity: 'error' });
                  });
              } else {
                // Editar servicio
                const servicioId = parqueaderoInfo.servicios[editValue.index].id;
                fetch(`${SERVICIOS_API_URL}/${servicioId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    nombre: editValue.nombre,
                    descripcion: editValue.descripcion,
                    precio: editValue.precio,
                    duracion: editValue.duracion,
                    estado: editValue.estado,
                    parqueadero_id: parqueaderoInfo.id
                  })
                })
                  .then(res => res.json())
                  .then(data => {
                    setParqueaderoInfo(prev => {
                      const servicios = [...prev.servicios];
                      servicios[editValue.index] = data.data;
                      return { ...prev, servicios };
                    });
                    setSnackbar({ open: true, message: 'Servicio actualizado', severity: 'success' });
                    setOpenEdit(false);
                  })
                  .catch(() => {
                    setSnackbar({ open: true, message: 'Error al actualizar el servicio', severity: 'error' });
                  });
              }
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
                value={currentUser?.nombre || 'No especificado'}
                onEdit={() => handleEdit('usuario.nombre', currentUser?.nombre)}
              />
              <InfoItem
                icon={<PhoneIcon color="primary" />}
                title="Teléfono"
                value={currentUser?.telefono || 'No especificado'}
                onEdit={() => handleEdit('usuario.telefono', currentUser?.telefono)}
              />
              <InfoItem
                icon={<LocationOnIcon color="primary" />}
                title="Ubicación"
                value={currentUser?.ubicacion || 'No especificado'}
                onEdit={() => handleEdit('usuario.ubicacion', currentUser?.ubicacion)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<EmailIcon color="primary" />}
                title="Email"
                value={currentUser?.correo || 'No especificado'}
                onEdit={() => handleEdit('usuario.correo', currentUser?.correo)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdminModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>¿Estás seguro de que deseas eliminar tu cuenta?</DialogTitle>
        <DialogContent>
          <Typography>
            Esta acción no se puede deshacer. Se eliminarán todos tus datos, parqueadero y servicios asociados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button color="error" onClick={handleDeleteAccount}>Eliminar</Button>
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