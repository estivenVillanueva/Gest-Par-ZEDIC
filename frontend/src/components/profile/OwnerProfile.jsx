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

const fields = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'correo', label: 'Correo' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'direccion', label: 'Dirección' }
];

const estadosCuenta = [
  { value: 'Activo', label: 'Activo' },
  { value: 'Inactivo', label: 'Inactivo' }
];

const OwnerProfile = () => {
  const [profile, setProfile] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    rol: 'Dueño de Vehículo',
    estado: 'Activo',
    fechaRegistro: '2023-10-01',
    ultimaActividad: '2024-06-10 14:23',
    vehiculos: 2,
    reservas: 5,
    pagos: 4
  });
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [openDelete, setOpenDelete] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // TODO: Reemplazar por llamada real a la API
    setProfile(prev => ({
      ...prev,
      nombre: 'Juan Pérez',
      correo: 'juan@email.com',
      telefono: '123456789',
      direccion: 'Calle 123',
      rol: 'Dueño de Vehículo',
      estado: 'Activo',
      fechaRegistro: '2023-10-01',
      ultimaActividad: '2024-06-10 14:23',
      vehiculos: 2,
      reservas: 5,
      pagos: 4
    }));
  }, []);

  const handleEdit = (field) => {
    setEditField(field.key);
    setEditValue(profile[field.key]);
    setOpenEdit(true);
  };

  const handleSaveEdit = () => {
    setProfile(prev => ({ ...prev, [editField]: editValue }));
    setOpenEdit(false);
    setSnackbar({ open: true, message: 'Campo actualizado', severity: 'success' });
    // TODO: Llamar API para actualizar
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      setSnackbar({ open: true, message: 'Las contraseñas no coinciden', severity: 'error' });
      return;
    }
    setOpenPassword(false);
    setSnackbar({ open: true, message: 'Contraseña actualizada', severity: 'success' });
    // TODO: Llamar API para cambiar contraseña
  };

  const handleDeleteAccount = () => {
    setOpenDelete(false);
    setSnackbar({ open: true, message: 'Cuenta eliminada', severity: 'success' });
    // TODO: Llamar API para eliminar cuenta
  };

  const handleEstadoChange = (e) => {
    setProfile(prev => ({ ...prev, estado: e.target.value }));
    setSnackbar({ open: true, message: 'Estado de la cuenta actualizado', severity: 'success' });
  };

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
            <Chip label={profile.rol} color="primary" sx={{ mr: 1 }} />
            <Select
              value={profile.estado}
              onChange={handleEstadoChange}
              size="small"
              sx={{
                fontWeight: 600,
                ml: 1,
                bgcolor: profile.estado === 'Activo' ? 'success.main' : 'grey.400',
                color: '#fff',
                borderRadius: 2,
                '& .MuiSelect-select': { py: 0.5, px: 2 },
                minWidth: 110
              }}
              variant="outlined"
              disableUnderline
            >
              {estadosCuenta.map((estado) => (
                <MenuItem key={estado.value} value={estado.value}>{estado.label}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ mt: isMobile ? 2 : 0, textAlign: isMobile ? 'left' : 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Fecha de registro: <b>{profile.fechaRegistro}</b>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Última actividad: <b>{profile.ultimaActividad}</b>
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
            {fields.map((field) => (
              <Box key={field.key} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ minWidth: 90, fontWeight: 500, color: 'text.secondary' }}>
                  {field.label}:
                </Typography>
                <TextField
                  value={profile[field.key]}
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
                <Button variant="text" color="info" startIcon={<HelpOutlineIcon />} sx={{ textTransform: 'none', fontWeight: 500 }}>
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
                <Typography variant="h4" fontWeight={700} color="primary.main">{profile.vehiculos}</Typography>
                <Typography variant="body2" color="text.secondary">Vehículos</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h4" fontWeight={700} color="primary.main">{profile.reservas}</Typography>
                <Typography variant="body2" color="text.secondary">Reservas</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h4" fontWeight={700} color="primary.main">{profile.pagos}</Typography>
                <Typography variant="body2" color="text.secondary">Pagos</Typography>
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
              Última actualización del perfil: {profile.ultimaActividad}
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
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Contraseña actual"
              type="password"
              fullWidth
              value={passwords.current}
              onChange={e => setPasswords({ ...passwords, current: e.target.value })}
            />
            <TextField
              label="Nueva contraseña"
              type="password"
              fullWidth
              value={passwords.new}
              onChange={e => setPasswords({ ...passwords, new: e.target.value })}
            />
            <TextField
              label="Confirmar nueva contraseña"
              type="password"
              fullWidth
              value={passwords.confirm}
              onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPassword(false)}>Cancelar</Button>
            <Button onClick={handlePasswordChange} variant="contained">Guardar</Button>
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

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default OwnerProfile; 