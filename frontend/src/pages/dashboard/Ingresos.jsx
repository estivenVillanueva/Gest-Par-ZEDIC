import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, Box, Autocomplete, Card, CardContent, Divider
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Ingresos() {
  const [ingresos, setIngresos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [openIngreso, setOpenIngreso] = useState(false);
  const [placa, setPlaca] = useState('');
  const [vehiculo, setVehiculo] = useState(null);
  const [observaciones, setObservaciones] = useState('');
  const [openSalida, setOpenSalida] = useState(false);
  const [salidaId, setSalidaId] = useState(null);
  const [valorPagado, setValorPagado] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [placasOptions, setPlacasOptions] = useState([]);
  const [loadingPlaca, setLoadingPlaca] = useState(false);

  useEffect(() => {
    fetchIngresos();
    fetchHistorial();
    fetchPlacas();
  }, []);

  const fetchIngresos = async () => {
    const res = await axios.get(`${API_URL}/ingresos/actuales`);
    setIngresos(res.data);
  };

  const fetchHistorial = async () => {
    const res = await axios.get(`${API_URL}/ingresos/historial`);
    setHistorial(res.data);
  };

  const fetchPlacas = async () => {
    const res = await axios.get(`${API_URL}/vehiculos`);
    if (res.data && res.data.data) {
      setPlacasOptions(res.data.data.map(v => v.placa));
    }
  };

  const handleBuscarVehiculo = async (placaBuscada) => {
    setLoadingPlaca(true);
    setVehiculo(null);
    try {
      const res = await axios.get(`${API_URL}/vehiculos/placa/${placaBuscada}`);
      if (res.data && res.data.data) {
        setVehiculo(res.data.data);
      } else {
        setVehiculo(null);
      }
    } catch {
      setVehiculo(null);
    }
    setLoadingPlaca(false);
  };

  const handleRegistrarIngreso = async () => {
    if (!vehiculo) {
      setSnackbar({ open: true, message: 'Debes seleccionar un vehículo válido', severity: 'error' });
      return;
    }
    try {
      await axios.post(`${API_URL}/ingresos`, { vehiculo_id: vehiculo.id, observaciones });
      setSnackbar({ open: true, message: 'Ingreso registrado', severity: 'success' });
      setOpenIngreso(false);
      setPlaca('');
      setVehiculo(null);
      setObservaciones('');
      fetchIngresos();
      fetchHistorial();
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al registrar ingreso', severity: 'error' });
    }
  };

  const handleRegistrarSalida = async () => {
    try {
      await axios.put(`${API_URL}/ingresos/${salidaId}/salida`, { valor_pagado: valorPagado });
      setSnackbar({ open: true, message: 'Salida registrada', severity: 'success' });
      setOpenSalida(false);
      setSalidaId(null);
      setValorPagado('');
      fetchIngresos();
      fetchHistorial();
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al registrar salida', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, bgcolor: '#f4f6fa', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary.main">
        <DirectionsCarIcon sx={{ mr: 1, fontSize: 36, verticalAlign: 'middle' }} /> Gestión de Ingresos
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 3, borderRadius: 3, fontWeight: 600, boxShadow: 2 }} onClick={() => setOpenIngreso(true)}>
        Registrar Ingreso
      </Button>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }} color="text.secondary">Vehículos dentro del parqueadero</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#e3f2fd' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Vehículo</TableCell>
              <TableCell>Hora de Entrada</TableCell>
              <TableCell>Observaciones</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingresos.map((ing) => (
              <TableRow key={ing.id}>
                <TableCell>{ing.id}</TableCell>
                <TableCell>{ing.vehiculo_id}</TableCell>
                <TableCell>{new Date(ing.hora_entrada).toLocaleString()}</TableCell>
                <TableCell>{ing.observaciones}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="secondary" sx={{ borderRadius: 2 }} onClick={() => { setOpenSalida(true); setSalidaId(ing.id); }}>
                    Registrar Salida
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mt: 4, mb: 1 }} color="text.secondary">Historial de ingresos y salidas</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#e3f2fd' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Vehículo</TableCell>
              <TableCell>Hora de Entrada</TableCell>
              <TableCell>Hora de Salida</TableCell>
              <TableCell>Valor Pagado</TableCell>
              <TableCell>Observaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historial.map((ing) => (
              <TableRow key={ing.id}>
                <TableCell>{ing.id}</TableCell>
                <TableCell>{ing.vehiculo_id}</TableCell>
                <TableCell>{new Date(ing.hora_entrada).toLocaleString()}</TableCell>
                <TableCell>{ing.hora_salida ? new Date(ing.hora_salida).toLocaleString() : '-'}</TableCell>
                <TableCell>{ing.valor_pagado || '-'}</TableCell>
                <TableCell>{ing.observaciones}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogo para registrar ingreso */}
      <Dialog open={openIngreso} onClose={() => setOpenIngreso(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>Registrar Ingreso</DialogTitle>
        <DialogContent>
          <Autocomplete
            freeSolo
            options={placasOptions}
            value={placa}
            onInputChange={(e, newValue) => {
              setPlaca(newValue);
              if (newValue && newValue.length >= 3) handleBuscarVehiculo(newValue);
              else setVehiculo(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar por placa"
                margin="normal"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  )
                }}
              />
            )}
          />
          {loadingPlaca && <Typography color="info.main">Buscando vehículo...</Typography>}
          {vehiculo && (
            <Card sx={{ mt: 2, mb: 2, bgcolor: '#f5faff', borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>Vehículo seleccionado:</Typography>
                <Typography variant="body2">Placa: <b>{vehiculo.placa}</b></Typography>
                <Typography variant="body2">Marca: {vehiculo.marca}</Typography>
                <Typography variant="body2">Modelo: {vehiculo.modelo}</Typography>
                <Typography variant="body2">Color: {vehiculo.color}</Typography>
                <Typography variant="body2">Tipo: {vehiculo.tipo}</Typography>
              </CardContent>
            </Card>
          )}
          {!vehiculo && placa.length >= 3 && !loadingPlaca && (
            <Alert severity="warning">No se encontró un vehículo con esa placa.</Alert>
          )}
          <TextField
            label="Observaciones"
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            sx={{ borderRadius: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIngreso(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleRegistrarIngreso} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo para registrar salida */}
      <Dialog open={openSalida} onClose={() => setOpenSalida(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>Registrar Salida</DialogTitle>
        <DialogContent>
          <TextField
            label="Valor Pagado"
            value={valorPagado}
            onChange={e => setValorPagado(e.target.value)}
            fullWidth
            margin="normal"
            type="number"
            sx={{ borderRadius: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSalida(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleRegistrarSalida} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
            Registrar Salida
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
} 