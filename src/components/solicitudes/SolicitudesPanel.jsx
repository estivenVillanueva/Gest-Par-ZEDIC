import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';

const SolicitudCard = ({ solicitud }) => (
  <Card sx={{ mb: 2, borderRadius: '12px' }}>
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {solicitud.tipo}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {solicitud.descripcion}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Chip 
              label={solicitud.estado} 
              color={solicitud.estado === 'Pendiente' ? 'warning' : 'success'}
              size="small"
            />
            <Chip 
              label={solicitud.fecha} 
              variant="outlined"
              size="small"
            />
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const SolicitudesPanel = () => {
  const [open, setOpen] = useState(false);
  const [solicitud, setSolicitud] = useState({
    tipo: '',
    descripcion: '',
    estado: 'Pendiente',
  });

  const [solicitudes] = useState([
    {
      id: 1,
      tipo: 'Reserva de espacio',
      descripcion: 'Solicitud para reservar espacio mensual',
      estado: 'Pendiente',
      fecha: '2024-03-15'
    },
    {
      id: 2,
      tipo: 'Cambio de horario',
      descripcion: 'Solicitud para modificar horario de acceso',
      estado: 'Aprobado',
      fecha: '2024-03-14'
    }
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSolicitud(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Nueva solicitud:', solicitud);
    handleClose();
  };

  const tiposSolicitud = [
    'Reserva de espacio',
    'Cambio de horario',
    'Cancelación de servicio',
    'Otros'
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ListAltIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Solicitudes</Typography>
      </Box>

      {solicitudes.map((solicitud) => (
        <SolicitudCard key={solicitud.id} solicitud={solicitud} />
      ))}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        fullWidth
        sx={{ mt: 2 }}
      >
        Nueva Solicitud
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nueva Solicitud</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Tipo de solicitud"
              name="tipo"
              value={solicitud.tipo}
              onChange={handleChange}
              margin="normal"
            >
              {tiposSolicitud.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={solicitud.descripcion}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Enviar Solicitud
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SolicitudesPanel; 