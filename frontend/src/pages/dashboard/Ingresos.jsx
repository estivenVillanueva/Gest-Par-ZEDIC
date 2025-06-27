import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, Box, Autocomplete, Card, CardContent, Divider, MenuItem
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../../../logic/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';

export default function Ingresos() {
  const { currentUser } = useAuth();
  const [ingresos, setIngresos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [openIngreso, setOpenIngreso] = useState(false);
  const [placa, setPlaca] = useState('');
  const [vehiculo, setVehiculo] = useState(null);
  const [observaciones, setObservaciones] = useState('');
  const [salidaInfo, setSalidaInfo] = useState(null);
  const [openSalida, setOpenSalida] = useState(false);
  const [openConfirmSalidaSinCosto, setOpenConfirmSalidaSinCosto] = useState(false);
  const [valorPagado, setValorPagado] = useState('');
  const [errorValorPagado, setErrorValorPagado] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [placasOptions, setPlacasOptions] = useState([]);
  const [loadingPlaca, setLoadingPlaca] = useState(false);
  const [historialLimit, setHistorialLimit] = useState(10);
  const [filtroPlaca, setFiltroPlaca] = useState('');
  const [servicioVehiculo, setServicioVehiculo] = useState(null);
  const [placaError, setPlacaError] = useState('');
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState({ dias: 0, horas: 0, minutos: 0 });
  const [valorCalculado, setValorCalculado] = useState(0);
  const [puestosDisponibles, setPuestosDisponibles] = useState([]);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    fetchIngresos();
    fetchHistorial();
    fetchPlacas();
  }, []);

  useEffect(() => {
    const tiposCobroConContador = ['uso', 'hora', 'minuto', 'día', 'dias', 'días'];
    if (openSalida && salidaInfo && salidaInfo.hora_entrada && tiposCobroConContador.includes((salidaInfo.tipo_cobro || '').toLowerCase())) {
      const entrada = new Date(salidaInfo.hora_entrada);
      const tarifaMin = Number(salidaInfo.precio_minuto) || 0;
      const tarifaHora = Number(salidaInfo.precio_hora) || 0;
      const tarifaDia = Number(salidaInfo.precio_dia) || 0;
      const tipoCobro = (salidaInfo.tipo_cobro || '').toLowerCase();
      function actualizarTiempoYValor() {
        const ahora = new Date();
        let diffMs = ahora - entrada;
        let diffMin = Math.floor(diffMs / 60000);
        let diffHoras = Math.floor(diffMin / 60);
        let diffDias = Math.floor(diffHoras / 24);
        let minutosRestantes = diffMin % 60;
        let horasRestantes = diffHoras % 24;
        setTiempoTranscurrido({ dias: diffDias, horas: horasRestantes, minutos: minutosRestantes });
        let valor = 0;
        if (tipoCobro === 'uso') {
          valor = (diffDias * tarifaDia) + (horasRestantes * tarifaHora) + (minutosRestantes * tarifaMin);
        } else if (tipoCobro === 'hora') {
          valor = diffHoras * tarifaHora + minutosRestantes * tarifaMin;
        } else if (tipoCobro === 'minuto') {
          valor = diffMin * tarifaMin;
        } else if (['día', 'dias', 'días'].includes(tipoCobro)) {
          valor = diffDias * tarifaDia + horasRestantes * tarifaHora + minutosRestantes * tarifaMin;
        }
        setValorCalculado(valor);
      }
      actualizarTiempoYValor();
      timerRef.current = setInterval(actualizarTiempoYValor, 1000);
      return () => clearInterval(timerRef.current);
    } else {
      setTiempoTranscurrido({ dias: 0, horas: 0, minutos: 0 });
      setValorCalculado(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [openSalida, salidaInfo]);

  useEffect(() => {
    const fetchPuestos = async () => {
      if (openIngreso && currentUser?.parqueadero_id) {
        try {
          const parqueaderoRes = await axios.get(`${API_URL}/api/parqueaderos/${currentUser.parqueadero_id}`);
          const capacidadParq = parqueaderoRes.data?.data?.capacidad || 0;
          const vehiculosRes = await axios.get(`${API_URL}/api/vehiculos?parqueadero_id=${currentUser.parqueadero_id}`);
          const ocupados = vehiculosRes.data?.data?.map(v => v.puesto).filter(Boolean);
          let disponibles = [];
          for (let i = 1; i <= capacidadParq; i++) {
            if (!ocupados.includes(i)) {
              disponibles.push(i);
            }
          }
          setPuestosDisponibles(disponibles);
        } catch (e) {
          setPuestosDisponibles([]);
        }
      }
    };
    fetchPuestos();
    if (!openIngreso) {
      setPuestoSeleccionado('');
    }
  }, [openIngreso, currentUser]);

  const fetchIngresos = async () => {
    if (!currentUser?.parqueadero_id) return;
    const res = await axios.get(`${API_URL}/api/ingresos/actuales?parqueadero_id=${currentUser.parqueadero_id}`);
    setIngresos(res.data);
  };

  const fetchHistorial = async () => {
    if (!currentUser?.parqueadero_id) return;
    const res = await axios.get(`${API_URL}/api/ingresos/historial?parqueadero_id=${currentUser.parqueadero_id}`);
    setHistorial(res.data);
  };

  const fetchPlacas = async () => {
    try {
      if (!currentUser?.parqueadero_id) return;
      const res = await axios.get(`${API_URL}/api/vehiculos?parqueadero_id=${currentUser.parqueadero_id}`);
      if (res.data && res.data.data) {
        setPlacasOptions(res.data.data.map(v => v.placa));
      }
    } catch (e) {
      setPlacasOptions([]);
    }
  };

  const handleBuscarVehiculo = async (placaBuscada) => {
    setLoadingPlaca(true);
    setVehiculo(null);
    setServicioVehiculo(null);
    try {
      const res = await axios.get(`${API_URL}/api/vehiculos/placa/${placaBuscada}`);
      if (res.data && res.data.data) {
        setVehiculo(res.data.data);
        // Si el vehículo tiene servicio_id, obtener el servicio
        if (res.data.data.servicio_id) {
          try {
            const resServicio = await axios.get(`${API_URL}/api/servicios/${res.data.data.servicio_id}`);
            if (resServicio.data && resServicio.data.data) {
              setServicioVehiculo(resServicio.data.data);
            } else {
              setServicioVehiculo(null);
            }
          } catch {
            setServicioVehiculo(null);
          }
        } else {
          setServicioVehiculo(null);
        }
      } else {
        setVehiculo(null);
        setServicioVehiculo(null);
      }
    } catch (e) {
      setVehiculo(null);
      setServicioVehiculo(null);
    }
    setLoadingPlaca(false);
  };

  const handleRegistrarIngreso = async () => {
    if (!vehiculo && placa) {
      try {
        // Buscar el servicio por minuto del parqueadero
        const resServicios = await axios.get(`${API_URL}/api/servicios/parqueadero/${currentUser?.parqueadero_id}`);
        let servicioMinuto = null;
        if (resServicios.data && resServicios.data.data) {
          servicioMinuto = resServicios.data.data.find(s => (s.duracion || '').toLowerCase() === 'minuto');
        }
        if (!servicioMinuto) {
          setSnackbar({ open: true, message: 'No hay servicio por minuto configurado para este parqueadero.', severity: 'error' });
          return;
        }
        if (!puestoSeleccionado) {
          setSnackbar({ open: true, message: 'Debes seleccionar un puesto disponible.', severity: 'error' });
          return;
        }
        const resVehiculo = await axios.post(`${API_URL}/api/vehiculos`, {
          placa,
          marca: '',
          modelo: '',
          color: '',
          tipo: 'ocasional',
          usuario_id: null,
          parqueadero_id: currentUser?.parqueadero_id,
          servicio_id: servicioMinuto.id,
          puesto: Number(puestoSeleccionado)
        });
        setVehiculo(resVehiculo.data.data);
        await axios.post(`${API_URL}/api/ingresos`, { vehiculo_id: resVehiculo.data.data.id, observaciones });
        setSnackbar({ open: true, message: 'Ingreso rápido registrado', severity: 'success' });
        setOpenIngreso(false);
        setPlaca('');
        setVehiculo(null);
        setObservaciones('');
        setPuestoSeleccionado('');
        fetchIngresos();
        fetchHistorial();
        return;
      } catch (e) {
        setSnackbar({ open: true, message: 'Error al registrar ingreso rápido', severity: 'error' });
        return;
      }
    }
    if (!vehiculo) {
      setSnackbar({ open: true, message: 'Debes seleccionar un vehículo válido', severity: 'error' });
      return;
    }
    if (!puestoSeleccionado) {
      setSnackbar({ open: true, message: 'Debes seleccionar un puesto disponible.', severity: 'error' });
      return;
    }
    try {
      // Actualizar el puesto del vehículo antes de registrar el ingreso
      await axios.put(`${API_URL}/api/vehiculos/${vehiculo.placa.toUpperCase()}`, {
        marca: vehiculo.marca || '',
        modelo: vehiculo.modelo || '',
        color: vehiculo.color || '',
        tipo: vehiculo.tipo || 'ocasional',
        usuario_id: vehiculo.usuario_id || null,
        parqueadero_id: currentUser?.parqueadero_id,
        servicio_id: vehiculo.servicio_id || (servicioVehiculo && servicioVehiculo.id) || undefined,
        dueno_nombre: vehiculo.dueno_nombre || '',
        dueno_telefono: vehiculo.dueno_telefono || '',
        dueno_email: vehiculo.dueno_email || '',
        dueno_documento: vehiculo.dueno_documento || '',
        puesto: Number(puestoSeleccionado)
      });
      await axios.post(`${API_URL}/api/ingresos`, { vehiculo_id: vehiculo.id, observaciones });
      setSnackbar({ open: true, message: 'Ingreso registrado', severity: 'success' });
      setOpenIngreso(false);
      setPlaca('');
      setVehiculo(null);
      setObservaciones('');
      setPuestoSeleccionado('');
      fetchIngresos();
      fetchHistorial();
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al registrar ingreso', severity: 'error' });
    }
  };

  const handleOpenSalidaDialog = async (ingreso) => {
    try {
      const res = await axios.get(`${API_URL}/api/ingresos/con-servicio/${ingreso.id}`);
      const info = { ...res.data, ingreso_id: ingreso.id };
      setSalidaInfo(info);
      if (info.tipo_cobro === 'periodo') {
        setOpenConfirmSalidaSinCosto(true);
      } else {
        setOpenSalida(true);
      }
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al verificar el servicio', severity: 'error' });
    }
  };

  const handleConfirmarSalidaSinCosto = () => {
    if (salidaInfo && salidaInfo.ingreso_id) {
      handleRegistrarSalida(salidaInfo.ingreso_id, 0);
    }
    setOpenConfirmSalidaSinCosto(false);
    setSalidaInfo(null);
  };

  const handleRegistrarSalida = async (id, valor) => {
    let valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico < 0) {
      setErrorValorPagado('El valor pagado no puede ser negativo.');
      return;
    }
    if (valorNumerico > 0 && valorNumerico < 100) {
      setErrorValorPagado('El valor pagado debe ser mínimo 100 pesos.');
      return;
    }
    // Redondear al múltiplo de 50 más cercano
    valorNumerico = Math.round(valorNumerico / 50) * 50;
    setErrorValorPagado('');
    try {
      await axios.put(`${API_URL}/api/ingresos/${id}/salida`, { valor_pagado: valorNumerico });
      setSnackbar({ open: true, message: `Salida registrada correctamente. Valor redondeado a $${valorNumerico}` , severity: 'success' });
      setOpenSalida(false);
      setSalidaInfo(null);
      setValorPagado('');
      fetchIngresos();
      fetchHistorial();
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al registrar la salida', severity: 'error' });
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
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
        {/* Tarjeta de vehículos dentro */}
        <Card sx={{ flex: 1, borderRadius: 4, boxShadow: 4, p: 2, bgcolor: '#f8fafc' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
              🚗 Vehículos dentro del parqueadero
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
              <Table size="small">
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
                  {ingresos.map((ing, idx) => (
                    <TableRow key={ing.id} sx={{ bgcolor: idx % 2 === 0 ? '#f5faff' : 'white', transition: 'background 0.2s', '&:hover': { bgcolor: '#e3f2fd' } }}>
                      <TableCell>{ing.id}</TableCell>
                      <TableCell><strong>{ing.placa || ing.vehiculo_id}</strong> <span style={{ marginLeft: 8, color: '#388e3c', fontWeight: 600, fontSize: 12, background: '#e8f5e9', borderRadius: 8, padding: '2px 8px' }}>Dentro</span></TableCell>
                      <TableCell>{new Date(ing.hora_entrada).toLocaleString()}</TableCell>
                      <TableCell>{ing.observaciones}</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="success" startIcon={<CheckCircleOutlineIcon />} sx={{ borderRadius: 2, fontWeight: 600 }} onClick={() => handleOpenSalidaDialog(ing)}>
                          Registrar Salida
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Historial moderno */}
      <Card sx={{ borderRadius: 4, boxShadow: 4, p: 2, bgcolor: '#f8fafc', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
            📋 Historial de ingresos y salidas
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              label="Filtrar por placa"
              value={filtroPlaca}
              onChange={e => setFiltroPlaca(e.target.value)}
              size="small"
              sx={{ width: 200, mr: 2 }}
            />
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
            <Table size="small">
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
                {historial
                  .filter(ing =>
                    !filtroPlaca ||
                    (ing.placa && ing.placa.toLowerCase().includes(filtroPlaca.toLowerCase()))
                  )
                  .slice(0, historialLimit)
                  .map((ing, idx) => (
                    <TableRow key={ing.id} sx={{ bgcolor: idx % 2 === 0 ? '#f5faff' : 'white', transition: 'background 0.2s', '&:hover': { bgcolor: '#e3f2fd' } }}>
                      <TableCell>{ing.id}</TableCell>
                      <TableCell><strong>{ing.placa || ing.vehiculo_id}</strong> {ing.hora_salida ? <span style={{ marginLeft: 8, color: '#1976d2', fontWeight: 600, fontSize: 12, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Fuera</span> : <span style={{ marginLeft: 8, color: '#388e3c', fontWeight: 600, fontSize: 12, background: '#e8f5e9', borderRadius: 8, padding: '2px 8px' }}>Dentro</span>}</TableCell>
                      <TableCell>{new Date(ing.hora_entrada).toLocaleString()}</TableCell>
                      <TableCell>{ing.hora_salida ? new Date(ing.hora_salida).toLocaleString() : '-'}</TableCell>
                      <TableCell>
                        {
                          (ing.valor_pagado !== null && ing.valor_pagado !== undefined && ing.valor_pagado !== '')
                            ? Number(ing.valor_pagado).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })
                            : '-'
                        }
                      </TableCell>
                      <TableCell>{ing.observaciones}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {historial.length > historialLimit && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <Button variant="outlined" onClick={() => setHistorialLimit(historialLimit + 10)}>
                Ver más
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialogo para registrar ingreso */}
      <Dialog open={openIngreso} onClose={() => setOpenIngreso(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>Registrar Ingreso</DialogTitle>
        <DialogContent>
          <Autocomplete
            freeSolo
            options={placasOptions}
            value={placa}
            onInputChange={(e, newValue) => {
              let value = (newValue || '').toUpperCase();
              if (value.length > 6) {
                setPlacaError('La placa debe tener máximo 6 caracteres');
                value = value.slice(0, 6);
              } else {
                setPlacaError('');
              }
              setPlaca(value);
              if (value && value.length >= 3) handleBuscarVehiculo(value);
              else setVehiculo(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar por placa"
                margin="normal"
                fullWidth
                inputProps={{ ...params.inputProps, maxLength: 6 }}
                error={!!placaError}
                helperText={placaError || 'Máximo 6 caracteres. Solo mayúsculas.'}
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
                {servicioVehiculo && (
                  <Typography variant="body2" sx={{ mt: 1 }}><b>Tipo de servicio:</b> {servicioVehiculo.nombre}</Typography>
                )}
              </CardContent>
            </Card>
          )}
          {vehiculo === null && placa && (
            <Box sx={{ my: 2 }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                No se encontró un vehículo con esa placa.
              </Alert>
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  try {
                    const resVehiculo = await axios.post(`${API_URL}/api/vehiculos`, {
                      placa,
                      marca: '',
                      modelo: '',
                      color: '',
                      tipo: 'ocasional',
                      usuario_id: null,
                      parqueadero_id: currentUser?.parqueadero_id
                    });
                    setVehiculo(resVehiculo.data.data);
                    await axios.post(`${API_URL}/api/ingresos`, { vehiculo_id: resVehiculo.data.data.id, observaciones });
                    setSnackbar({ open: true, message: 'Ingreso rápido registrado', severity: 'success' });
                    setOpenIngreso(false);
                    setPlaca('');
                    setVehiculo(null);
                    setObservaciones('');
                    fetchIngresos();
                    fetchHistorial();
                  } catch (e) {
                    setSnackbar({ open: true, message: 'Error al registrar ingreso rápido', severity: 'error' });
                  }
                }}
                fullWidth
              >
                Registrar ingreso rápido con esta placa
              </Button>
            </Box>
          )}
          <TextField
            margin="normal"
            fullWidth
            select
            label="Puesto"
            name="puesto"
            value={puestoSeleccionado}
            onChange={e => setPuestoSeleccionado(e.target.value)}
            required
            sx={{ mt: 2 }}
            helperText={puestosDisponibles.length === 0 ? 'No hay puestos disponibles' : 'Selecciona un puesto disponible'}
            disabled={puestosDisponibles.length === 0}
          >
            <MenuItem value="">No asignado</MenuItem>
            {puestosDisponibles.map(p => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>
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
          <Button onClick={handleRegistrarIngreso} variant="contained" color="primary" sx={{ borderRadius: 2 }} disabled={!!placaError || placa.length !== 6}>
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo para registrar salida POR USO */}
      <Dialog open={openSalida} onClose={() => setOpenSalida(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>Registrar Salida</DialogTitle>
        <DialogContent>
          <Typography>Vehículo con servicio por uso. Por favor, ingrese el valor a pagar.</Typography>
          {salidaInfo && ['uso', 'hora', 'minuto', 'día', 'dias', 'días'].includes((salidaInfo.tipo_cobro || '').toLowerCase()) && (
            <Box sx={{ my: 2, p: 2, bgcolor: '#f5faff', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="primary">Tiempo transcurrido:</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                {tiempoTranscurrido.dias > 0 && `${tiempoTranscurrido.dias}d `}
                {tiempoTranscurrido.horas}h {tiempoTranscurrido.minutos}m
              </Typography>
              <Typography variant="subtitle2" color="primary">Valor calculado:</Typography>
              <Typography variant="h5" fontWeight={700} color="success.main">
                {valorCalculado.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Typography>
            </Box>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Valor Pagado"
            type="number"
            fullWidth
            variant="outlined"
            value={valorPagado}
            onChange={(e) => {
              const value = e.target.value;
              const num = parseFloat(value);
              if (num < 0) {
                setErrorValorPagado('El valor pagado no puede ser negativo.');
              } else if (num > 0 && num < 100) {
                setErrorValorPagado('El valor pagado debe ser mínimo 100 pesos.');
              } else {
                setErrorValorPagado('');
              }
              setValorPagado(value);
            }}
            error={!!errorValorPagado}
            helperText={errorValorPagado || `Sugerido: ${valorCalculado.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSalida(false)}>Cancelar</Button>
          <Button
            onClick={() => handleRegistrarSalida(salidaInfo.ingreso_id, valorPagado)}
            variant="contained"
            color="primary"
            disabled={!!errorValorPagado || valorPagado === ''}
          >
            Registrar Salida
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo para confirmar salida POR PERIODO */}
      <Dialog open={openConfirmSalidaSinCosto} onClose={() => setOpenConfirmSalidaSinCosto(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'success.main' }}>Confirmar Salida</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 40 }}/>
            <Typography>
              El vehículo tiene un servicio de <strong>{salidaInfo?.servicio_nombre}</strong>.
              <br/>
              ¿Confirmas la salida sin costo?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmSalidaSinCosto(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarSalidaSinCosto} variant="contained" color="success">
            Confirmar y Registrar Salida
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