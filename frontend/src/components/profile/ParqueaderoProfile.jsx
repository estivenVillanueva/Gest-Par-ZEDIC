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
  Tooltip,
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
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../logic/AuthContext';

const DEFAULT_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Parking_icon.svg';
const DEFAULT_PORTADA_URL = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

const InfoItem = ({ icon, title, value, onEdit }) => (
  <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      {onEdit && (
        <IconButton onClick={onEdit} size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      )}
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
  const [logoInputRef, setLogoInputRef] = useState(null);
  const [portadaInputRef, setPortadaInputRef] = useState(null);
  const [logoTimestamp, setLogoTimestamp] = useState(Date.now());
  const [portadaTimestamp, setPortadaTimestamp] = useState(Date.now());
  const [openPassword, setOpenPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const CLOUDINARY_UPLOAD_PRESET = 'Gest-par-zedic';
  const CLOUDINARY_CLOUD_NAME = 'dnudkdqyr';

  const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${PARQUEADERO_API_URL}/upload-image`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success && data.url) return data.url;
    throw new Error(data.error || 'Error al subir imagen');
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadToBackend(file);
      handleSaveLogo(url);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handlePortadaChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadToBackend(file);
      handleSavePortada(url);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

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
        if (field === 'correo' && data.data && data.data.verificado === false) {
          setSnackbar({
            open: true,
            message: '¡Correo actualizado! Revisa tu nuevo correo para verificarlo.',
            severity: 'info'
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Cambios guardados exitosamente',
            severity: 'success'
          });
        }
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
        if (field === 'direccion') {
          // Esperar un pequeño tiempo para asegurar que la geocodificación se procese en el backend
          setTimeout(async () => {
            const refreshed = await fetch(`${PARQUEADERO_API_URL}/usuario/${currentUser.id}`);
            if (refreshed.ok) {
              const refreshedData = await refreshed.json();
              setParqueaderoInfo(refreshedData.data);
            }
          }, 1000);
        } else {
          const refreshed = await fetch(`${PARQUEADERO_API_URL}/usuario/${currentUser.id}`);
          if (refreshed.ok) {
            const refreshedData = await refreshed.json();
            setParqueaderoInfo(refreshedData.data);
          }
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
    // Si el campo es un servicio
    if (editField === 'servicio') {
      // Validación dinámica según tipo de servicio
      if (!editValue.tipo_servicio) {
        setSnackbar({ open: true, message: 'Selecciona el tipo de servicio', severity: 'error' });
        return;
      }
      if (['mensual', 'quincenal', 'semanal', 'otro'].includes(editValue.tipo_servicio)) {
        if (!editValue.nombre && editValue.tipo_servicio === 'otro') {
          setSnackbar({ open: true, message: 'El nombre es obligatorio para servicios tipo "otro"', severity: 'error' });
          return;
        }
        if (!editValue.precio || !editValue.duracion) {
          setSnackbar({ open: true, message: 'El precio y la duración son obligatorios', severity: 'error' });
          return;
        }
      }
      if (['dia', 'hora', 'minuto'].includes(editValue.tipo_servicio)) {
        if (!editValue.duracion) {
          setSnackbar({ open: true, message: 'Selecciona la duración', severity: 'error' });
          return;
        }
        if (editValue.duracion === 'dia' && !editValue.precio_dia) {
          setSnackbar({ open: true, message: 'El precio por día es obligatorio', severity: 'error' });
          return;
        }
        if (editValue.duracion === 'hora' && !editValue.precio_hora) {
          setSnackbar({ open: true, message: 'El precio por hora es obligatorio', severity: 'error' });
          return;
        }
        if (editValue.duracion === 'minuto' && !editValue.precio_minuto) {
          setSnackbar({ open: true, message: 'El precio por minuto es obligatorio', severity: 'error' });
          return;
        }
      }
      try {
        let response, data;
        const payload = {
          ...editValue,
          parqueadero_id: parqueaderoInfo.id,
        };
        console.log('Payload a enviar:', payload);
        if (editValue.index !== undefined && editValue.index >= 0) {
          const servicioId = parqueaderoInfo.servicios[editValue.index].id;
          response = await fetch(`${SERVICIOS_API_URL}/${servicioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!response.ok) throw new Error('Error al actualizar el servicio');
          data = await response.json();
          setParqueaderoInfo(prev => ({
            ...prev,
            servicios: prev.servicios.map((s, i) =>
              i === editValue.index ? data.data : s
            )
          }));
          setSnackbar({ open: true, message: 'Servicio actualizado', severity: 'success' });
        } else {
          response = await fetch(`${SERVICIOS_API_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!response.ok) throw new Error('Error al agregar el servicio');
          data = await response.json();
          setParqueaderoInfo(prev => ({
            ...prev,
            servicios: [...prev.servicios, data.data]
          }));
          setSnackbar({ open: true, message: 'Servicio agregado', severity: 'success' });
        }
        setOpenEdit(false);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error al guardar el servicio',
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

  const handleSaveLogo = async (url) => {
    if (!parqueaderoInfo.id) return;
    const updatedData = { ...parqueaderoInfo, logo_url: url };
    const response = await fetch(`${PARQUEADERO_API_URL}/${parqueaderoInfo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    if (response.ok) {
      const data = await response.json();
      setParqueaderoInfo(data.data);
      setLogoTimestamp(Date.now());
      setSnackbar({ open: true, message: url ? 'Logo actualizado' : 'Logo eliminado', severity: 'success' });
    }
  };

  const handleSavePortada = async (url) => {
    if (!parqueaderoInfo.id) return;
    const updatedData = { ...parqueaderoInfo, portada_url: url };
    const response = await fetch(`${PARQUEADERO_API_URL}/${parqueaderoInfo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    if (response.ok) {
      const data = await response.json();
      setParqueaderoInfo(data.data);
      setPortadaTimestamp(Date.now());
      setSnackbar({ open: true, message: url ? 'Portada actualizada' : 'Portada eliminada', severity: 'success' });
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      setSnackbar({ open: true, message: 'Las contraseñas no coinciden', severity: 'error' });
      return;
    }
    try {
      const res = await fetch(`https://gest-par-zedic.onrender.com/api/usuarios/${currentUser.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaContrasena: passwords.new })
      });
      if (!res.ok) throw new Error('Error al cambiar la contraseña');
      setOpenPassword(false);
      setSnackbar({ open: true, message: '¡Contraseña cambiada exitosamente!', severity: 'success' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al cambiar la contraseña', severity: 'error' });
    }
  };

  if (showWelcome) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            ¡Bienvenido a ZEDIC!
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Tu cuenta ha sido creada exitosamente.<br />
            
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
        <Box sx={{ position: 'relative', width: '100%', mb: 7 }}>
          {/* Portada */}
          <img
            src={`${parqueaderoInfo.portada_url || DEFAULT_PORTADA_URL}?t=${portadaTimestamp}`}
            alt="Portada del parqueadero"
            style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 12 }}
            onError={e => { e.target.onerror = null; e.target.src = DEFAULT_PORTADA_URL; }}
          />
          {/* Iconos para portada */}
          <Tooltip title="Cambiar o quitar portada">
            <IconButton
              size="small"
              sx={{ position: 'absolute', top: 12, right: 16, zIndex: 3, bgcolor: 'rgba(255,255,255,0.85)' }}
              onClick={() => portadaInputRef && portadaInputRef.click()}
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={ref => setPortadaInputRef(ref)}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) {
                if (window.confirm('¿Deseas quitar la portada y dejarla en blanco?')) {
                  await handleSavePortada('');
                }
                return;
              }
              await handlePortadaChange(e);
            }}
          />
          {/* Logo superpuesto */}
          <Avatar
            src={`${parqueaderoInfo.logo_url || DEFAULT_LOGO_URL}?t=${logoTimestamp}`}
            alt="Logo del parqueadero"
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              position: 'absolute',
              left: 40,
              bottom: -50,
              border: '4px solid white',
              boxShadow: 3
            }}
            onError={e => { e.target.onerror = null; e.target.src = DEFAULT_LOGO_URL; }}
          />
          {/* Iconos para logo */}
          <Tooltip title="Cambiar o quitar logo">
            <IconButton
              size="small"
              sx={{ position: 'absolute', left: 120, bottom: -40, zIndex: 3, bgcolor: 'rgba(255,255,255,0.85)' }}
              onClick={() => logoInputRef && logoInputRef.click()}
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={ref => setLogoInputRef(ref)}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) {
                if (window.confirm('¿Deseas quitar el logo y dejarlo en blanco?')) {
                  await handleSaveLogo('');
                }
                return;
              }
              await handleLogoChange(e);
            }}
          />
        </Box>
        {/* Espacio para que el logo no tape el contenido */}
        <Box sx={{ height: 60 }} />
        {/* Nombre y botón admin */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {parqueaderoInfo.nombre}
          </Typography>
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
            
            <InfoItem
              icon={<EmailIcon color="primary" />}
              title="Email"
              value={parqueaderoInfo.email}
              onEdit={() => handleEdit('usuario.correo', parqueaderoInfo.email)}
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
                .filter(servicio => servicio && (servicio.nombre || servicio.precio) && servicio.estado !== 'inactivo')
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
                                const data = await res.json();
                                if (res.ok && data.message && data.message.includes('desactivado')) {
                                  // Servicio desactivado, no eliminado
                                  setParqueaderoInfo(prev => ({
                                    ...prev,
                                    servicios: prev.servicios.map((s, i) =>
                                      i === index ? { ...s, estado: 'inactivo' } : s
                                    )
                                  }));
                                  setSnackbar({ open: true, message: 'El servicio tiene dependencias y fue desactivado.', severity: 'info' });
                                } else if (res.ok) {
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
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, flex: 1 }}
            onClick={() => setOpenPassword(true)}
            startIcon={<PersonIcon />}
          >
            Cambiar Contraseña
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2, flex: 1 }}
            onClick={() => setOpenDeleteDialog(true)}
            startIcon={<DeleteIcon />}
          >
            Eliminar cuenta
          </Button>
        </Box>
      </Paper>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(43,108,163,0.15)',
            p: 2,
            minWidth: { xs: 280, sm: 400 },
            maxWidth: 480
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, textTransform: 'capitalize', pb: 1 }}>
          Editar {editField === 'usuario.correo' ? 'Correo' : editField.replace('usuario.', '').replace('parqueadero.', '')}
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 2 }}>
          {editField === 'servicio' ? (
            <>
              <TextField
                select
                margin="dense"
                label="Tipo de servicio"
                fullWidth
                variant="outlined"
                value={editValue.tipo_servicio || ''}
                onChange={e => {
                  const value = e.target.value;
                  let nombre = value;
                  if (value === 'otro') nombre = '';
                  setEditValue({
                    ...editValue,
                    tipo_servicio: value,
                    nombre,
                    precio: '',
                    precio_minuto: '',
                    precio_hora: '',
                    precio_dia: '',
                    duracion: '',
                  });
                }}
                sx={{ borderRadius: 2, bgcolor: '#f7fafd', mb: 2 }}
              >
                <MenuItem value="mensual">Mensual</MenuItem>
                <MenuItem value="quincenal">Quincenal</MenuItem>
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="dia">Día</MenuItem>
                <MenuItem value="hora">Hora</MenuItem>
                <MenuItem value="minuto">Minuto</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </TextField>

              {/* Si es tipo 'otro', permite escribir el nombre */}
              {editValue.tipo_servicio === 'otro' && (
                <TextField
                  margin="dense"
                  label="Nombre del servicio"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={editValue.nombre || ''}
                  onChange={e => setEditValue({ ...editValue, nombre: e.target.value })}
                  sx={{ borderRadius: 2, bgcolor: '#f7fafd', mb: 2 }}
                />
              )}

              <TextField
                margin="dense"
                label="Descripción"
                type="text"
                fullWidth
                variant="outlined"
                value={editValue.descripcion || ''}
                onChange={e => setEditValue({ ...editValue, descripcion: e.target.value })}
                sx={{ borderRadius: 2, bgcolor: '#f7fafd', mb: 2 }}
              />

              {/* Si es mensual/quincenal/semanal/otro, pide precio fijo y duración */}
              {['mensual', 'quincenal', 'semanal', 'otro'].includes(editValue.tipo_servicio) && (
                <>
                  <TextField
                    margin="dense"
                    label="Precio"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={editValue.precio || ''}
                    onChange={e => setEditValue({ ...editValue, precio: e.target.value })}
                    sx={{ borderRadius: 2, bgcolor: '#f7fafd', mb: 2 }}
                  />
                  <TextField
                    select
                    margin="dense"
                    label="Duración"
                    fullWidth
                    variant="outlined"
                    value={editValue.duracion || ''}
                    onChange={e => setEditValue({ ...editValue, duracion: e.target.value })}
                    sx={{ borderRadius: 2, bgcolor: '#f7fafd', mb: 2 }}
                  >
                    <MenuItem value="mes">Mes</MenuItem>
                    <MenuItem value="quincena">Quincena</MenuItem>
                    <MenuItem value="semana">Semana</MenuItem>
                  </TextField>
                </>
              )}

              {/* Si es por uso: día, hora, minuto */}
              {['dia', 'hora', 'minuto'].includes(editValue.tipo_servicio) && (
                <>
                  <TextField
                    select
                    margin="dense"
                    label="Duración"
                    fullWidth
                    variant="outlined"
                    value={editValue.duracion || ''}
                    onChange={e => setEditValue({ ...editValue, duracion: e.target.value })}
                    sx={{ borderRadius: 2, bgcolor: '#f7fafd', mb: 2 }}
                  >
                    <MenuItem value="dia">Día</MenuItem>
                    <MenuItem value="hora">Hora</MenuItem>
                    <MenuItem value="minuto">Minuto</MenuItem>
                  </TextField>
                  {editValue.duracion === 'dia' && (
                    <TextField
                      margin="dense"
                      label="Precio por día"
                      type="number"
                      fullWidth
                      variant="outlined"
                      value={editValue.precio_dia || ''}
                      onChange={e => setEditValue({ ...editValue, precio_dia: e.target.value })}
                      sx={{ borderRadius: 2, bgcolor: '#f7fafd', mb: 2 }}
                    />
                  )}
                  {editValue.duracion === 'hora' && (
                    <TextField
                      margin="dense"
                      label="Precio por hora"
                      type="number"
                      fullWidth
                      variant="outlined"
                      value={editValue.precio_hora || ''}
                      onChange={e => setEditValue({ ...editValue, precio_hora: e.target.value })}
                      sx={{ borderRadius: 2, bgcolor: '#f7fafd', mb: 2 }}
                    />
                  )}
                  {editValue.duracion === 'minuto' && (
                    <TextField
                      margin="dense"
                      label="Precio por minuto"
                      type="number"
                      fullWidth
                      variant="outlined"
                      value={editValue.precio_minuto || ''}
                      onChange={e => setEditValue({ ...editValue, precio_minuto: e.target.value })}
                      sx={{ borderRadius: 2, bgcolor: '#f7fafd', mb: 2 }}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label={editField === 'usuario.correo' ? 'Correo electrónico' : 'Nuevo valor'}
              type={editField === 'usuario.correo' ? 'email' : 'text'}
              fullWidth
              variant="outlined"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              sx={{ borderRadius: 2, bgcolor: '#f7fafd' }}
              error={editField === 'usuario.correo' && !!editValue && !/^\S+@\S+\.\S+$/.test(editValue)}
              helperText={editField === 'usuario.correo' && !!editValue && !/^\S+@\S+\.\S+$/.test(editValue) ? 'Formato de correo inválido' : ''}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setOpenEdit(false)} color="secondary" variant="outlined">Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={editField === 'usuario.correo' && !!editValue && !/^\S+@\S+\.\S+$/.test(editValue)}
          >
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
                // No pasar onEdit para deshabilitar edición
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

      {/* Modal de cambiar contraseña con diseño profesional */}
      <Dialog open={openPassword} onClose={() => setOpenPassword(false)}>
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', color: 'primary.main', pb: 0 }}>Cambiar Contraseña</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350, pt: 1 }}>
          <TextField
            label="Nueva contraseña"
            type="password"
            fullWidth
            variant="outlined"
            value={passwords.new}
            onChange={e => setPasswords({ ...passwords, new: e.target.value })}
            sx={{ borderRadius: 2, bgcolor: '#f7fafd' }}
          />
          <TextField
            label="Confirmar nueva contraseña"
            type="password"
            fullWidth
            variant="outlined"
            value={passwords.confirm}
            onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
            sx={{ borderRadius: 2, bgcolor: '#f7fafd' }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setOpenPassword(false)} color="secondary" variant="outlined">Cancelar</Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">Guardar</Button>
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