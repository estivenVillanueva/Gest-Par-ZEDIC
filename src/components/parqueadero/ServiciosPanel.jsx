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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ServiciosPanel = () => {
  const [open, setOpen] = useState(false);
  const [servicio, setServicio] = useState({
    tipo: '',
    nombre: '',
    tarifa: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServicio(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Aquí irá la lógica para guardar el servicio
    console.log('Nuevo servicio:', servicio);
    handleClose();
  };

  const tiposServicio = [
    'Por hora',
    'Mensual',
    'Quincenal',
    'Otros'
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        fullWidth
      >
        Tipos de servicio del parqueadero
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Añadir servicio</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Tipo de servicio"
              name="tipo"
              value={servicio.tipo}
              onChange={handleChange}
              margin="normal"
            >
              {tiposServicio.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Nombre servicio"
              name="nombre"
              value={servicio.nombre}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Tarifa del servicio"
              name="tarifa"
              type="number"
              value={servicio.tarifa}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Añadir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiciosPanel; 