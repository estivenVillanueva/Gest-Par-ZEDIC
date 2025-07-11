import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
  Button,
  Grid,
  Chip,
  Tooltip,
  MenuItem,
  Select,
  useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../../logic/AuthContext';

const fields = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'correo', label: 'Correo' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'ubicacion', label: 'Ubicación' }
];

const estadosCuenta = [
  { value: 'Activo', label: 'Activo' },
  { value: 'Inactivo', label: 'Inactivo' }
];

const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';

const OwnerProfile = () => {
  const { currentUser, setError, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [openDelete, setOpenDelete] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openHelp, setOpenHelp] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);
  const [reservas, setReservas] = useState([]);

  // Cargar datos reales del usuario
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const res = await fetch(`${API_URL}/api/usuarios/${currentUser.data?.id || currentUser.id}`);
        const data = await res.json();
        setProfile(data.data);
      } catch (err) {
        setError('No se pudo cargar el perfil');
      }
    };
    fetchProfile();
  }, [currentUser, setError]);

  // Obtener vehículos y reservas del usuario
  useEffect(() => {
    if (!profile) return;
    // Vehículos
    fetch(`${API_URL}/api/vehiculos?usuario_id=${profile.id}`)
      .then(res => res.json())
      .then(data => setVehiculos(data.data || []));
    // Reservas
    fetch(`${API_URL}/api/reservas?usuario_id=${profile.id}`)
      .then(res => res.json())
      .then(data => setReservas(data.data || []));
  }, [profile]);

  // Editar campo
  const handleEdit = (field) => {
    setEditField(field.key);
    setEditValue(profile[field.key] || '');
    setOpenEdit(true);
  };

  // Guardar edición
  const handleSaveEdit = async () => {
    try {
      // Solo los campos permitidos
      const updated = {
        nombre: editField === 'nombre' ? editValue : profile.nombre,
        correo: editField === 'correo' ? editValue : profile.correo,
        tipo_usuario: profile.tipo_usuario,
        ubicacion: editField === 'ubicacion' ? editValue : profile.ubicacion,
        telefono: editField === 'telefono' ? (editValue || '') : (profile.telefono || ''),
      };
      const res = await fetch(`${API_URL}/api/usuarios/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error('Error al actualizar');
      const data = await res.json();
      setProfile(data.data);
      if (editField === 'correo' && data.data && data.data.verificado === false) {
        setSnackbar({
          open: true,
          message: '¡Correo actualizado! Revisa tu nuevo correo para verificarlo.',
          severity: 'info'
        });
      } else {
        setSnackbar({ open: true, message: 'Campo actualizado', severity: 'success' });
      }
      setOpenEdit(false);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al actualizar', severity: 'error' });
    }
  };

  // Cambiar estado
  const handleEstadoChange = async (e) => {
    try {
      const updated = { ...profile, estado: e.target.value };
      const res = await fetch(`${API_URL}/api/usuarios/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error('Error al actualizar estado');
      const data = await res.json();
      setProfile(data.data);
      setSnackbar({ open: true, message: 'Estado de la cuenta actualizado', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al actualizar estado', severity: 'error' });
    }
  };

  // Cambiar contraseña
  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      setSnackbar({ open: true, message: 'Las contraseñas no coinciden', severity: 'error' });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${profile.id}/password`, {
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

  // Eliminar cuenta
  const handleDeleteAccount = async () => {
    setOpenDelete(false);
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${profile.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar cuenta');
      setSnackbar({ open: true, message: 'Cuenta eliminada', severity: 'success' });
      await logout();
      window.location.href = '/';
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al eliminar cuenta', severity: 'error' });
    }
  };

  if (!profile) {
    return <Box sx={{ p: 6, textAlign: 'center' }}><Typography>Cargando perfil...</Typography></Box>;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'linear-gradient(120deg, #f6f7fa 60%, #e3eaf6 100%)',
        px: { xs: 1, sm: 2, md: 0 },
        py: { xs: 2, md: 6 },
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          bgcolor: '#fff',
          borderRadius: 0,
          boxShadow: '0 8px 32px rgba(43,108,163,0.10)',
          p: { xs: 2, sm: 4, md: 6 },
          minHeight: 600,
        }}
      >
        {/* Encabezado */}
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: 0.5, mb: 0.5 }}>
              {profile.nombre}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
              {profile.correo}
            </Typography>
            <Chip label={profile.rol || 'Dueño de Vehículo'} color="primary" sx={{ mr: 1 }} />
          </Box>
          <Box sx={{ mt: isMobile ? 2 : 0, textAlign: isMobile ? 'left' : 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Fecha de registro: <b>{profile.created_at ? profile.created_at.split('T')[0] : ''}</b>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Última actividad: <b>{profile.updated_at ? profile.updated_at.split('T')[0] : ''}</b>
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={4}>
          {/* Columna izquierda: Información y acciones */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} mb={2} color="primary.main">
              Información Personal
            </Typography>
            {/* Mostrar el ID de usuario como el primer campo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ minWidth: 90, fontWeight: 500, color: 'text.secondary' }}>
                ID:
              </Typography>
              <TextField
                value={profile.id}
                variant="standard"
                size="small"
                fullWidth
                disabled
                InputProps={{
                  disableUnderline: true,
                  sx: { fontWeight: 500, color: 'text.primary', pl: 1 }
                }}
              />
            </Box>
            {fields.map((field) => (
              <Box key={field.key} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ minWidth: 90, fontWeight: 500, color: 'text.secondary' }}>
                  {field.label}:
                </Typography>
                <TextField
                  value={profile[field.key] || ''}
                  variant="standard"
                  size="small"
                  fullWidth
                  disabled
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontWeight: 500, color: 'text.primary', pl: 1 }
                  }}
                />
                <IconButton onClick={() => handleEdit(field)} sx={{ ml: 1 }} aria-label={`Editar ${field.label}`}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 1.5, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
              onClick={() => setOpenPassword(true)}
              startIcon={<LockIcon />}
            >
              Cambiar Contraseña
            </Button>
            <Button
              variant="text"
              color="error"
              fullWidth
              sx={{ textTransform: 'none', fontWeight: 500, fontSize: 15, borderRadius: 2 }}
              onClick={() => setOpenDelete(true)}
              startIcon={<DeleteIcon />}
            >
              Eliminar Cuenta
            </Button>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mt: 2 }}>
              <Tooltip title="¿Necesitas ayuda?">
                <Button variant="text" color="info" startIcon={<HelpOutlineIcon />} sx={{ textTransform: 'none', fontWeight: 500 }} onClick={() => setOpenHelp(true)}>
                  Ayuda y Soporte
                </Button>
              </Tooltip>
            </Box>
          </Grid>
          {/* Columna derecha: Estadísticas y seguridad */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} mb={2} color="primary.main">
              Estadísticas Rápidas
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h4" fontWeight={700} color="primary.main">{vehiculos.length}</Typography>
                <Typography variant="body2" color="text.secondary">Vehículos</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h4" fontWeight={700} color="primary.main">{reservas.length}</Typography>
                <Typography variant="body2" color="text.secondary">Reservas</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight={600} mb={2} color="primary.main">
              Zona de Seguridad
            </Typography>
            <Box sx={{ bgcolor: '#f3f7fa', borderRadius: 2, p: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                • Usa una contraseña segura y no la compartas.<br />
                • Revisa tu actividad regularmente.<br />
                • Si detectas algo sospechoso, contacta soporte.
              </Typography>
            </Box>
            <Typography variant="caption" color="text.disabled">
              Última actualización del perfil: {profile.updated_at ? profile.updated_at.split('T')[0] : ''}
            </Typography>
          </Grid>
        </Grid>

        {/* Editar campo */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Editar {fields.find(f => f.key === editField)?.label}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={fields.find(f => f.key === editField)?.label}
              type="text"
              fullWidth
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>

        {/* Cambiar contraseña */}
        <Dialog open={openPassword} onClose={() => setOpenPassword(false)}>
          <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', color: 'primary.main', pb: 0 }}>Cambiar Contraseña</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350, pt: 1 }}>
            <TextField
              label="Contraseña actual"
              type="password"
              fullWidth
              variant="outlined"
              value={passwords.current}
              onChange={e => setPasswords({ ...passwords, current: e.target.value })}
              sx={{ borderRadius: 2, bgcolor: '#f7fafd' }}
            />
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
          <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
            <Button onClick={() => setOpenPassword(false)} color="inherit" sx={{ borderRadius: 2 }}>Cancelar</Button>
            <Button onClick={handlePasswordChange} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600 }}>Guardar</Button>
          </DialogActions>
        </Dialog>

        {/* Confirmar eliminación */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>¿Eliminar cuenta?</DialogTitle>
          <DialogContent>
            <Typography>Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar tu cuenta?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
            <Button onClick={handleDeleteAccount} color="error" variant="contained">Eliminar</Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de Ayuda y Soporte */}
        <Dialog open={openHelp} onClose={() => setOpenHelp(false)}>
          <DialogTitle>Ayuda y Soporte</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              ¿Necesitas ayuda con tu cuenta o tienes algún problema?
            </Typography>
            <Typography variant="body2" gutterBottom>
              • Consulta la sección de preguntas frecuentes (próximamente).<br />
              • Si tienes problemas con tu perfil, vehículos o reservas, revisa que tu información esté actualizada.<br />
              • Para soporte técnico, escribe a <b>gestparzedic@gmail.com</b> o utiliza el formulario de contacto en la web.<br />
              • Si detectas actividad sospechosa, cambia tu contraseña y contacta soporte inmediatamente.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHelp(false)} color="primary">Cerrar</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default OwnerProfile; 