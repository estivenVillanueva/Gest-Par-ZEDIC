import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Chip, LinearProgress, Stack } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import GroupIcon from '@mui/icons-material/Group';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TimelineIcon from '@mui/icons-material/Timeline';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../../../logic/AuthContext';
import { Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { useMemo } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';
const COLORS = ['#2B6CA3', '#43a047', '#fbc02d', '#e53935', '#8e24aa'];
const PIE_COLORS = ['#2B6CA3', '#43a047', '#fbc02d', '#e53935', '#8e24aa', '#ff9800', '#00bcd4', '#9c27b0'];

function Reportes() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ingresos, setIngresos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [ocupacion, setOcupacion] = useState({ total: 0, ocupados: 0 });
  const [parqueaderoId, setParqueaderoId] = useState(null);
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    tipo_servicio: '',
    estado_pago: '',
    page: 0,
    limit: 10,
  });
  const [reporte, setReporte] = useState(null);
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [filtrosOcup, setFiltrosOcup] = useState({
    fecha_inicio: '',
    fecha_fin: '',
  });
  const [reporteOcup, setReporteOcup] = useState(null);
  const [loadingOcup, setLoadingOcup] = useState(false);
  const [filtrosPagos, setFiltrosPagos] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    usuario_nombre: '',
    estado: '',
    page: 0,
    limit: 10,
  });
  const [reportePagos, setReportePagos] = useState(null);
  const [loadingPagos, setLoadingPagos] = useState(false);
  const [filtrosUsuarios, setFiltrosUsuarios] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    page: 0,
    limit: 10,
  });
  const [reporteUsuarios, setReporteUsuarios] = useState(null);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [filtrosVehiculos, setFiltrosVehiculos] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    tipo: '',
    page: 0,
    limit: 10,
  });
  const [reporteVehiculos, setReporteVehiculos] = useState(null);
  const [loadingVehiculos, setLoadingVehiculos] = useState(false);
  const [filtrosServicios, setFiltrosServicios] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    page: 0,
    limit: 10,
  });
  const [reporteServicios, setReporteServicios] = useState(null);
  const [loadingServicios, setLoadingServicios] = useState(false);

  useEffect(() => {
    // Determinar el parqueadero_id del usuario logueado
    if (currentUser) {
      if (currentUser.parqueadero_id) {
        setParqueaderoId(currentUser.parqueadero_id);
      } else if (currentUser.id && currentUser.tipo_usuario === 'admin') {
        // Si es admin y no tiene parqueadero_id directo, intentar obtenerlo desde el backend
        fetch(`${API_URL}/api/parqueaderos/usuario/${currentUser.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.data && data.data.id) setParqueaderoId(data.data.id);
          });
      }
    }
  }, [currentUser]);

  useEffect(() => {
    async function fetchData() {
      if (!parqueaderoId) return;
      setLoading(true);
      // Ingresos históricos
      const ingresosRes = await fetch(`${API_URL}/api/ingresos/historial?parqueadero_id=${parqueaderoId}`);
      const ingresosData = await ingresosRes.json();
      setIngresos(ingresosData || []);
      // Facturas
      const facturasRes = await fetch(`${API_URL}/api/facturas?parqueadero_id=${parqueaderoId}`);
      const facturasData = await facturasRes.json();
      setFacturas(facturasData.data || []);
      // Vehículos
      const vehiculosRes = await fetch(`${API_URL}/api/vehiculos?parqueadero_id=${parqueaderoId}`);
      const vehiculosData = await vehiculosRes.json();
      setVehiculos(vehiculosData.data || []);
      // Servicios
      const serviciosRes = await fetch(`${API_URL}/api/servicios?parqueadero_id=${parqueaderoId}`);
      const serviciosData = await serviciosRes.json();
      setServicios(serviciosData.data || []);
      // Ocupación
      const total = vehiculosData.data.length;
      const ocupados = vehiculosData.data.filter(v => v.puesto && v.puesto !== 'No asignado').length;
      setOcupacion({ total, ocupados });
      setLoading(false);
    }
    fetchData();
  }, [parqueaderoId]);

  // Filtrar servicios: solo los que están asociados a vehículos activos
  const serviciosConActividad = servicios.filter(s => vehiculos.some(v => v.servicio_id === s.id));

  // Filtrar facturas: solo las asociadas a vehículos activos
  const facturasConActividad = facturas.filter(f => vehiculos.some(v => v.id === f.vehiculo_id));

  // Ingresos por mes
  const ingresosPorMes = {};
  ingresos.forEach(i => {
    const fecha = new Date(i.hora_entrada || i.fecha_creacion);
    const key = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
    ingresosPorMes[key] = (ingresosPorMes[key] || 0) + (i.valor_pagado || i.total || 0);
  });
  const ingresosMesData = Object.entries(ingresosPorMes).map(([mes, total]) => ({ mes, total }));

  // Pagos pendientes vs pagados (solo con actividad)
  const pagosPendientes = facturasConActividad.filter(f => f.estado?.toLowerCase() === 'pendiente').length;
  const pagosPagados = facturasConActividad.filter(f => f.estado?.toLowerCase() === 'pagado' || f.estado?.toLowerCase() === 'pagada').length;
  const pagosPieData = [
    { name: 'Pendientes', value: pagosPendientes },
    { name: 'Pagados', value: pagosPagados }
  ];

  // Vehículos por tipo
  const tipos = {};
  vehiculos.forEach(v => {
    const tipo = v.tipo || 'Otro';
    tipos[tipo] = (tipos[tipo] || 0) + 1;
  });
  const vehiculosTipoData = Object.entries(tipos).map(([tipo, cantidad]) => ({ tipo, cantidad }));

  // Servicios activos por tipo (solo con actividad)
  const serviciosPorTipo = { Semanal: 0, Quincenal: 0, Mensual: 0, Ocasional: 0 };
  vehiculos.forEach(v => {
    const servicio = serviciosConActividad.find(s => s.id === v.servicio_id);
    const duracion = (servicio?.duracion || '').toLowerCase();
    if (duracion.includes('semana')) serviciosPorTipo.Semanal++;
    else if (duracion.includes('quincena')) serviciosPorTipo.Quincenal++;
    else if (duracion.includes('mes')) serviciosPorTipo.Mensual++;
    else serviciosPorTipo.Ocasional++;
  });
  const serviciosTipoData = Object.entries(serviciosPorTipo).map(([tipo, cantidad]) => ({ tipo, cantidad }));

  // Ingresos de vehículos por día (últimos 7 días)
  const hoy = new Date();
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - (6 - i));
    return d;
  });
  const ingresosPorDia = dias.map(dia => {
    const fechaStr = dia.toISOString().slice(0, 10);
    const cantidad = ingresos.filter(i => (i.hora_entrada || i.fecha_creacion || '').slice(0, 10) === fechaStr).length;
    return { dia: dia.toLocaleDateString('es-CO', { weekday: 'short' }), cantidad };
  });

  // Ocupación actual
  const ocupacionPorcentaje = ocupacion.total ? Math.round((ocupacion.ocupados / ocupacion.total) * 100) : 0;

  // KPIs rápidos
  const totalVehiculos = vehiculos.length;
  const totalServicios = serviciosConActividad.length;
  const ingresosAcumulados = ingresos
    .filter(i => typeof i.valor_pagado === 'number' && i.valor_pagado > 0)
    .reduce((acc, i) => acc + i.valor_pagado, 0);
  const ocupacionPromedio = ocupacion.total ? Math.round((ocupacion.ocupados / ocupacion.total) * 100) : 0;

  // Opciones para selects
  const tiposServicio = [
    { value: '', label: 'Todos' },
    { value: 'mensual', label: 'Mensual' },
    { value: 'quincenal', label: 'Quincenal' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'ocasional', label: 'Ocasional' },
  ];
  const estadosPago = [
    { value: '', label: 'Todos' },
    { value: 'pagado', label: 'Pagado' },
    { value: 'pendiente', label: 'Pendiente' },
  ];

  // Fetch del reporte profesional
  useEffect(() => {
    if (!parqueaderoId) return;
    setLoadingReporte(true);
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtros).filter(([k, v]) => v !== '' && v !== null)),
      page: filtros.page + 1,
      limit: filtros.limit,
    });
    fetch(`${API_URL}/api/ingresos/reporte?${params.toString()}`)
      .then(res => res.json())
      .then(data => setReporte(data.data))
      .finally(() => setLoadingReporte(false));
  }, [parqueaderoId, filtros]);

  // Fetch del reporte profesional de ocupación
  useEffect(() => {
    if (!parqueaderoId) return;
    setLoadingOcup(true);
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtrosOcup).filter(([k, v]) => v !== '' && v !== null)),
    });
    fetch(`${API_URL}/api/ingresos/ocupacion/reporte?${params.toString()}`)
      .then(res => res.json())
      .then(data => setReporteOcup(data.data))
      .finally(() => setLoadingOcup(false));
  }, [parqueaderoId, filtrosOcup]);

  // Fetch del reporte profesional de pagos pendientes
  useEffect(() => {
    if (!parqueaderoId) return;
    setLoadingPagos(true);
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtrosPagos).filter(([k, v]) => v !== '' && v !== null)),
      page: filtrosPagos.page + 1,
      limit: filtrosPagos.limit,
    });
    fetch(`${API_URL}/api/pagos/pendientes/reporte?${params.toString()}`)
      .then(res => res.json())
      .then(data => setReportePagos(data.data))
      .finally(() => setLoadingPagos(false));
  }, [parqueaderoId, filtrosPagos]);

  // Fetch del reporte profesional de usuarios frecuentes
  useEffect(() => {
    if (!parqueaderoId) return;
    setLoadingUsuarios(true);
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtrosUsuarios).filter(([k, v]) => v !== '' && v !== null)),
      page: filtrosUsuarios.page + 1,
      limit: filtrosUsuarios.limit,
    });
    fetch(`${API_URL}/api/usuarios/frecuentes/reporte?${params.toString()}`)
      .then(res => res.json())
      .then(data => setReporteUsuarios(data.data))
      .finally(() => setLoadingUsuarios(false));
  }, [parqueaderoId, filtrosUsuarios]);

  // Fetch del reporte profesional de vehículos frecuentes
  useEffect(() => {
    if (!parqueaderoId) return;
    setLoadingVehiculos(true);
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtrosVehiculos).filter(([k, v]) => v !== '' && v !== null)),
      page: filtrosVehiculos.page + 1,
      limit: filtrosVehiculos.limit,
    });
    fetch(`${API_URL}/api/vehiculos/frecuentes/reporte?${params.toString()}`)
      .then(res => res.json())
      .then(data => setReporteVehiculos(data.data))
      .finally(() => setLoadingVehiculos(false));
  }, [parqueaderoId, filtrosVehiculos]);

  // Fetch del reporte profesional de servicios más contratados
  useEffect(() => {
    if (!parqueaderoId) return;
    setLoadingServicios(true);
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtrosServicios).filter(([k, v]) => v !== '' && v !== null)),
      page: filtrosServicios.page + 1,
      limit: filtrosServicios.limit,
    });
    fetch(`${API_URL}/api/servicios/contratados/reporte?${params.toString()}`)
      .then(res => res.json())
      .then(data => setReporteServicios(data.data))
      .finally(() => setLoadingServicios(false));
  }, [parqueaderoId, filtrosServicios]);

  // Handlers de filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(f => ({ ...f, [name]: value, page: 0 }));
  };
  const handleChangePage = (_, newPage) => setFiltros(f => ({ ...f, page: newPage }));
  const handleChangeRowsPerPage = (e) => setFiltros(f => ({ ...f, limit: parseInt(e.target.value, 10), page: 0 }));

  const handleFiltroOcupChange = (e) => {
    const { name, value } = e.target;
    setFiltrosOcup(f => ({ ...f, [name]: value }));
  };

  const handleFiltroPagosChange = (e) => {
    const { name, value } = e.target;
    setFiltrosPagos(f => ({ ...f, [name]: value, page: 0 }));
  };
  const handleChangePagePagos = (_, newPage) => setFiltrosPagos(f => ({ ...f, page: newPage }));
  const handleChangeRowsPerPagePagos = (e) => setFiltrosPagos(f => ({ ...f, limit: parseInt(e.target.value, 10), page: 0 }));

  const handleFiltroUsuariosChange = (e) => {
    const { name, value } = e.target;
    setFiltrosUsuarios(f => ({ ...f, [name]: value, page: 0 }));
  };
  const handleChangePageUsuarios = (_, newPage) => setFiltrosUsuarios(f => ({ ...f, page: newPage }));
  const handleChangeRowsPerPageUsuarios = (e) => setFiltrosUsuarios(f => ({ ...f, limit: parseInt(e.target.value, 10), page: 0 }));

  const handleFiltroVehiculosChange = (e) => {
    const { name, value } = e.target;
    setFiltrosVehiculos(f => ({ ...f, [name]: value, page: 0 }));
  };
  const handleChangePageVehiculos = (_, newPage) => setFiltrosVehiculos(f => ({ ...f, page: newPage }));
  const handleChangeRowsPerPageVehiculos = (e) => setFiltrosVehiculos(f => ({ ...f, limit: parseInt(e.target.value, 10), page: 0 }));

  const handleFiltroServiciosChange = (e) => {
    const { name, value } = e.target;
    setFiltrosServicios(f => ({ ...f, [name]: value, page: 0 }));
  };
  const handleChangePageServicios = (_, newPage) => setFiltrosServicios(f => ({ ...f, page: newPage }));
  const handleChangeRowsPerPageServicios = (e) => setFiltrosServicios(f => ({ ...f, limit: parseInt(e.target.value, 10), page: 0 }));

  // Función para exportar
  const handleExport = (tipo) => {
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtros).filter(([k, v]) => v !== '' && v !== null)),
      page: filtros.page + 1,
      limit: filtros.limit,
    });
    const url = `${API_URL}/api/ingresos/reporte/export/${tipo}?${params.toString()}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-ingresos.${tipo === 'excel' ? 'xlsx' : 'pdf'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para exportar ocupación
  const handleExportOcup = (tipo) => {
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtrosOcup).filter(([k, v]) => v !== '' && v !== null)),
    });
    const url = `${API_URL}/api/ingresos/ocupacion/reporte/export/${tipo}?${params.toString()}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-ocupacion.${tipo === 'excel' ? 'xlsx' : 'pdf'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPagos = (tipo) => {
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtrosPagos).filter(([k, v]) => v !== '' && v !== null)),
      page: filtrosPagos.page + 1,
      limit: filtrosPagos.limit,
    });
    const url = `${API_URL}/api/pagos/pendientes/reporte/export/${tipo}?${params.toString()}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-pagos-pendientes.${tipo === 'excel' ? 'xlsx' : 'pdf'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportUsuarios = (tipo) => {
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtrosUsuarios).filter(([k, v]) => v !== '' && v !== null)),
      page: filtrosUsuarios.page + 1,
      limit: filtrosUsuarios.limit,
    });
    const url = `${API_URL}/api/usuarios/frecuentes/reporte/export/${tipo}?${params.toString()}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-usuarios-frecuentes.${tipo === 'excel' ? 'xlsx' : 'pdf'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportVehiculos = (tipo) => {
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtrosVehiculos).filter(([k, v]) => v !== '' && v !== null)),
      page: filtrosVehiculos.page + 1,
      limit: filtrosVehiculos.limit,
    });
    const url = `${API_URL}/api/vehiculos/frecuentes/reporte/export/${tipo}?${params.toString()}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-vehiculos-frecuentes.${tipo === 'excel' ? 'xlsx' : 'pdf'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportServicios = (tipo) => {
    const params = new URLSearchParams({
      parqueadero_id: parqueaderoId,
      ...Object.fromEntries(Object.entries(filtrosServicios).filter(([k, v]) => v !== '' && v !== null)),
      page: filtrosServicios.page + 1,
      limit: filtrosServicios.limit,
    });
    const url = `${API_URL}/api/servicios/contratados/reporte/export/${tipo}?${params.toString()}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-servicios-contratados.${tipo === 'excel' ? 'xlsx' : 'pdf'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 2, px: { xs: 1, md: 3 }, bgcolor: '#f6f7fa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={2} sx={{ width: '100%', maxWidth: '100vw', bgcolor: '#fff', p: { xs: 1, md: 2 }, boxShadow: '0 4px 24px rgba(52,152,243,0.08)', borderRadius: 0 }}>
        {/* Sección: Estadísticas y Reportes */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 3 }}>Estadísticas y Reportes</Typography>
          {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box> : (
            <>
              {/* KPIs rápidos */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3} lg={3}>
                  <Paper sx={{ p: 1.5, borderRadius: 0, boxShadow: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 80, height: '100%' }}>
                    <DirectionsCarIcon sx={{ fontSize: 28, color: '#2B6CA3' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Total vehículos</Typography>
                      <Typography variant="h6" fontWeight={700}>{totalVehiculos}</Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3} lg={3}>
                  <Paper sx={{ p: 1.5, borderRadius: 0, boxShadow: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 80, height: '100%' }}>
                    <EventAvailableIcon sx={{ fontSize: 28, color: '#43a047' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Total servicios</Typography>
                      <Typography variant="h6" fontWeight={700}>{totalServicios}</Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3} lg={3}>
                  <Paper sx={{ p: 1.5, borderRadius: 0, boxShadow: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 80, height: '100%' }}>
                    <LocalAtmIcon sx={{ fontSize: 28, color: '#fbc02d' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Ingresos acumulados</Typography>
                      <Typography variant="h6" fontWeight={700}>{ingresosAcumulados.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3} lg={3}>
                  <Paper sx={{ p: 1.5, borderRadius: 0, boxShadow: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 80, height: '100%' }}>
                    <GroupIcon sx={{ fontSize: 28, color: '#8e24aa' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Ocupación promedio</Typography>
                      <Typography variant="h6" fontWeight={700}>{ocupacionPromedio}%</Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Gráficas principales tipo mosaico */}
              <Grid container spacing={3} sx={{ mb: 2 }}>
                {/* Ingresos por mes (gráfica ancha) */}
                <Grid item xs={12} md={8} lg={8}>
                  <Paper sx={{ p: 3, borderRadius: 0, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#e3f2fd' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <MonetizationOnIcon sx={{ fontSize: 24, color: '#2B6CA3', mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={700}>Ingresos por mes</Typography>
                    </Box>
                    {ingresosMesData.length === 0 ? (
                      <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Typography color="text.secondary" fontSize={16}>Sin datos para mostrar</Typography>
                      </Box>
                    ) : (
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={ingresosMesData}>
                          <XAxis dataKey="mes" fontSize={13} />
                          <YAxis fontSize={13} />
                          <Tooltip />
                          <Bar dataKey="total" fill="#2B6CA3" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Paper>
                </Grid>
                {/* Servicios activos por tipo (pie) */}
                <Grid item xs={12} md={4} lg={4}>
                  <Paper sx={{ p: 3, borderRadius: 0, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#e8f5e9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <EventAvailableIcon sx={{ fontSize: 24, color: '#43a047', mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={700}>Servicios activos por tipo</Typography>
                    </Box>
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie data={serviciosTipoData} dataKey="cantidad" nameKey="tipo" cx="50%" cy="50%" outerRadius={100} label fontSize={13}>
                          {serviciosTipoData.map((entry, idx) => <Cell key={entry.tipo} fill={COLORS[idx % COLORS.length]} />)}
                        </Pie>
                        <Legend fontSize={13} />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                {/* Ingresos de vehículos (últimos 7 días) */}
                <Grid item xs={12} md={6} lg={6}>
                  <Paper sx={{ p: 3, borderRadius: 0, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#fffde7' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <DirectionsCarIcon sx={{ fontSize: 24, color: '#fbc02d', mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={700}>Ingresos de vehículos (últimos 7 días)</Typography>
                    </Box>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={ingresosPorDia}>
                        <XAxis dataKey="dia" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="cantidad" fill="#fbc02d" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                {/* Pagos pendientes vs pagados */}
                <Grid item xs={12} md={3} lg={3}>
                  <Paper sx={{ p: 3, borderRadius: 0, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Pagos pendientes vs pagados</Typography>
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie data={pagosPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fontSize={12}>
                          {pagosPieData.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
                        </Pie>
                        <Legend fontSize={12} />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                {/* Ocupación actual */}
                <Grid item xs={12} md={3} lg={3}>
                  <Paper sx={{ p: 3, borderRadius: 0, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Ocupación actual</Typography>
                    <Box sx={{ width: '100%', mb: 2 }}>
                      <LinearProgress variant="determinate" value={ocupacionPorcentaje} sx={{ height: 16, borderRadius: 8 }} />
                    </Box>
                    <Chip label={`${ocupacion.ocupados} de ${ocupacion.total} puestos ocupados (${ocupacionPorcentaje}%)`} color="primary" sx={{ fontSize: 16, p: 1 }} />
                  </Paper>
                </Grid>
                {/* Vehículos por tipo (gráfica ancha) */}
                <Grid item xs={12} md={6} lg={6}>
                  <Paper sx={{ p: 3, borderRadius: 0, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Vehículos por tipo</Typography>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={vehiculosTipoData} barCategoryGap={40}>
                        <XAxis dataKey="tipo" fontSize={13} />
                        <YAxis fontSize={13} />
                        <Tooltip />
                        <Bar dataKey="cantidad" fill="#43a047" radius={[8, 8, 0, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
        {/* Sección: Reporte profesional de Ingresos */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>Reporte profesional de Ingresos</Typography>
          {/* Filtros y exportación */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
            <TextField label="Fecha inicio" type="date" name="fecha_inicio" value={filtros.fecha_inicio} onChange={handleFiltroChange} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Fecha fin" type="date" name="fecha_fin" value={filtros.fecha_fin} onChange={handleFiltroChange} size="small" InputLabelProps={{ shrink: true }} />
            <TextField select label="Tipo de servicio" name="tipo_servicio" value={filtros.tipo_servicio} onChange={handleFiltroChange} size="small" sx={{ minWidth: 150 }}>
              {tiposServicio.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField select label="Estado de pago" name="estado_pago" value={filtros.estado_pago} onChange={handleFiltroChange} size="small" sx={{ minWidth: 150 }}>
              {estadosPago.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExport('excel')}
              sx={{ ml: 2 }}
            >
              Exportar Excel
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExport('pdf')}
            >
              Exportar PDF
            </Button>
          </Box>
          {/* KPIs */}
          {loadingReporte ? <CircularProgress /> : reporte && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>Total ingresos: <span style={{ color: '#2B6CA3' }}>{Number(reporte.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</span></Typography>
            </Box>
          )}
          {/* Gráficas */}
          {reporte && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                  <Typography variant="subtitle2">Ingresos por día</Typography>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={reporte.por_dia}>
                      <XAxis dataKey="fecha" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="total" fill="#2B6CA3" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
                  <Typography variant="subtitle2">Ingresos por tipo de servicio</Typography>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={reporte.por_servicio}>
                      <XAxis dataKey="tipo_servicio" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="total" fill="#43a047" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          )}
          {/* Tabla detallada */}
          {reporte && (
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha entrada</TableCell>
                    <TableCell>Fecha salida</TableCell>
                    <TableCell>Placa</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Servicio</TableCell>
                    <TableCell>Estado pago</TableCell>
                    <TableCell align="right">Valor pagado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reporte.detalles.map(row => (
                    <TableRow key={row.id}>
                      <TableCell>{row.hora_entrada ? new Date(row.hora_entrada).toLocaleString() : ''}</TableCell>
                      <TableCell>{row.hora_salida ? new Date(row.hora_salida).toLocaleString() : ''}</TableCell>
                      <TableCell>{row.placa}</TableCell>
                      <TableCell>{row.tipo}</TableCell>
                      <TableCell>{row.tipo_servicio}</TableCell>
                      <TableCell>{row.estado_pago}</TableCell>
                      <TableCell align="right">{row.valor_pagado ? row.valor_pagado.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }) : ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={-1} // Desconocido, solo paginación hacia adelante
                page={filtros.page}
                onPageChange={handleChangePage}
                rowsPerPage={filtros.limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
                nextIconButtonProps={{ disabled: reporte.detalles.length < filtros.limit }}
                backIconButtonProps={{ disabled: filtros.page === 0 }}
                rowsPerPageOptions={[10, 20, 50]}
                labelDisplayedRows={({ from, to }) => `${from}-${to}`}
              />
            </TableContainer>
          )}
        </Box>
        {/* Sección: Reporte profesional de Ocupación */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight={700} color="secondary.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><TimelineIcon /> Reporte profesional de Ocupación</Typography>
          {/* Filtros y exportación */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
            <TextField label="Fecha inicio" type="date" name="fecha_inicio" value={filtrosOcup.fecha_inicio} onChange={handleFiltroOcupChange} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Fecha fin" type="date" name="fecha_fin" value={filtrosOcup.fecha_fin} onChange={handleFiltroOcupChange} size="small" InputLabelProps={{ shrink: true }} />
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExportOcup('excel')}
              sx={{ ml: 2 }}
            >
              Exportar Excel
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExportOcup('pdf')}
            >
              Exportar PDF
            </Button>
          </Box>
          {/* Gráfica y tabla */}
          {loadingOcup ? <CircularProgress /> : reporteOcup && (
            <>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Capacidad: {reporteOcup.capacidad} puestos</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={reporteOcup.data}>
                  <XAxis dataKey="fecha" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="ocupados" fill="#fbc02d" name="Ocupados" />
                  <Bar dataKey="porcentaje" fill="#2B6CA3" name="% Ocupación" yAxisId="right" />
                </BarChart>
              </ResponsiveContainer>
              <TableContainer component={Paper} sx={{ maxHeight: 300, mt: 2 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Ocupados</TableCell>
                      <TableCell>Capacidad</TableCell>
                      <TableCell>% Ocupación</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reporteOcup.data.map(row => (
                      <TableRow key={row.fecha}>
                        <TableCell>{row.fecha}</TableCell>
                        <TableCell>{row.ocupados}</TableCell>
                        <TableCell>{row.capacidad}</TableCell>
                        <TableCell>{row.porcentaje}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
        {/* Sección: Reporte profesional de Pagos Pendientes y Vencidos */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight={700} color="error.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><PaymentIcon /> Reporte profesional de Pagos Pendientes y Vencidos</Typography>
          {/* Filtros y exportación */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
            <TextField label="Fecha inicio" type="date" name="fecha_inicio" value={filtrosPagos.fecha_inicio} onChange={handleFiltroPagosChange} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Fecha fin" type="date" name="fecha_fin" value={filtrosPagos.fecha_fin} onChange={handleFiltroPagosChange} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Usuario" name="usuario_nombre" value={filtrosPagos.usuario_nombre} onChange={handleFiltroPagosChange} size="small" />
            <TextField select label="Estado" name="estado" value={filtrosPagos.estado} onChange={handleFiltroPagosChange} size="small" sx={{ minWidth: 150 }}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="vencida">Vencida</MenuItem>
            </TextField>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExportPagos('excel')}
              sx={{ ml: 2 }}
            >
              Exportar Excel
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExportPagos('pdf')}
            >
              Exportar PDF
            </Button>
          </Box>
          {/* KPIs y gráficas */}
          {loadingPagos ? <CircularProgress /> : reportePagos && (
            <>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Total adeudado: <span style={{ color: '#e53935' }}>{Number(reportePagos.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</span></Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: '#ffebee' }}>
                    <Typography variant="subtitle2">Pagos por estado</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={reportePagos.por_estado}>
                        <XAxis dataKey="estado" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="cantidad" fill="#e53935" name="Cantidad" />
                        <Bar dataKey="total" fill="#fbc02d" name="Total adeudado" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                    <Typography variant="subtitle2">Top usuarios con más deuda</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={reportePagos.por_usuario}>
                        <XAxis dataKey="usuario_nombre" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="total" fill="#2B6CA3" name="Total adeudado" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
              {/* Tabla detallada */}
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Placa</TableCell>
                      <TableCell>Servicio</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha creación</TableCell>
                      <TableCell>Fecha vencimiento</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportePagos.detalles.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.usuario_nombre}</TableCell>
                        <TableCell>{row.placa}</TableCell>
                        <TableCell>{row.servicio_nombre}</TableCell>
                        <TableCell>{row.estado}</TableCell>
                        <TableCell>{row.fecha_creacion ? new Date(row.fecha_creacion).toLocaleDateString() : ''}</TableCell>
                        <TableCell>{row.fecha_vencimiento ? new Date(row.fecha_vencimiento).toLocaleDateString() : ''}</TableCell>
                        <TableCell align="right">{row.total ? row.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }) : ''}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={-1}
                  page={filtrosPagos.page}
                  onPageChange={handleChangePagePagos}
                  rowsPerPage={filtrosPagos.limit}
                  onRowsPerPageChange={handleChangeRowsPerPagePagos}
                  labelRowsPerPage="Filas por página"
                  nextIconButtonProps={{ disabled: reportePagos.detalles.length < filtrosPagos.limit }}
                  backIconButtonProps={{ disabled: filtrosPagos.page === 0 }}
                  rowsPerPageOptions={[10, 20, 50]}
                  labelDisplayedRows={({ from, to }) => `${from}-${to}`}
                />
              </TableContainer>
            </>
          )}
        </Box>
        {/* Sección: Reporte profesional de Usuarios Frecuentes */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight={700} color="success.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><PeopleIcon /> Reporte profesional de Usuarios Frecuentes</Typography>
          {/* Filtros y exportación */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
            <TextField label="Fecha inicio" type="date" name="fecha_inicio" value={filtrosUsuarios.fecha_inicio} onChange={handleFiltroUsuariosChange} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Fecha fin" type="date" name="fecha_fin" value={filtrosUsuarios.fecha_fin} onChange={handleFiltroUsuariosChange} size="small" InputLabelProps={{ shrink: true }} />
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExportUsuarios('excel')}
              sx={{ ml: 2 }}
            >
              Exportar Excel
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExportUsuarios('pdf')}
            >
              Exportar PDF
            </Button>
          </Box>
          {/* Gráficas */}
          {loadingUsuarios ? <CircularProgress /> : reporteUsuarios && reporteUsuarios.length > 0 && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
                  <Typography variant="subtitle2">Ingresos por usuario</Typography>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={reporteUsuarios}>
                      <XAxis dataKey="usuario_nombre" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="ingresos" fill="#43a047" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                  <Typography variant="subtitle2">Distribución de ingresos</Typography>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={reporteUsuarios} dataKey="ingresos" nameKey="usuario_nombre" cx="50%" cy="50%" outerRadius={70} label>
                        {reporteUsuarios.map((entry, idx) => <Cell key={entry.usuario_nombre} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                      </Pie>
                      <Legend fontSize={12} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          )}
          {/* Tabla de usuarios frecuentes */}
          {loadingUsuarios ? <CircularProgress /> : reporteUsuarios && (
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Ingresos</TableCell>
                    <TableCell>Primer ingreso</TableCell>
                    <TableCell>Último ingreso</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reporteUsuarios.map(row => (
                    <TableRow key={row.usuario_nombre + row.primer_ingreso}>
                      <TableCell>{row.usuario_nombre}</TableCell>
                      <TableCell>{row.ingresos}</TableCell>
                      <TableCell>{row.primer_ingreso ? new Date(row.primer_ingreso).toLocaleDateString() : ''}</TableCell>
                      <TableCell>{row.ultimo_ingreso ? new Date(row.ultimo_ingreso).toLocaleDateString() : ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={-1}
                page={filtrosUsuarios.page}
                onPageChange={handleChangePageUsuarios}
                rowsPerPage={filtrosUsuarios.limit}
                onRowsPerPageChange={handleChangeRowsPerPageUsuarios}
                labelRowsPerPage="Filas por página"
                nextIconButtonProps={{ disabled: reporteUsuarios.length < filtrosUsuarios.limit }}
                backIconButtonProps={{ disabled: filtrosUsuarios.page === 0 }}
                rowsPerPageOptions={[10, 20, 50]}
                labelDisplayedRows={({ from, to }) => `${from}-${to}`}
              />
            </TableContainer>
          )}
        </Box>
        {/* Sección: Reporte profesional de Vehículos Frecuentes */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><DirectionsCarFilledIcon /> Reporte profesional de Vehículos Frecuentes</Typography>
          {/* Filtros y exportación */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
            <TextField label="Fecha inicio" type="date" name="fecha_inicio" value={filtrosVehiculos.fecha_inicio} onChange={handleFiltroVehiculosChange} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Fecha fin" type="date" name="fecha_fin" value={filtrosVehiculos.fecha_fin} onChange={handleFiltroVehiculosChange} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Tipo" name="tipo" value={filtrosVehiculos.tipo} onChange={handleFiltroVehiculosChange} size="small" select sx={{ minWidth: 120 }}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="carro">Carro</MenuItem>
              <MenuItem value="moto">Moto</MenuItem>
              <MenuItem value="bicicleta">Bicicleta</MenuItem>
              <MenuItem value="otro">Otro</MenuItem>
            </TextField>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExportVehiculos('excel')}
              sx={{ ml: 2 }}
            >
              Exportar Excel
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExportVehiculos('pdf')}
            >
              Exportar PDF
            </Button>
          </Box>
          {/* Gráficas */}
          {loadingVehiculos ? <CircularProgress /> : reporteVehiculos && reporteVehiculos.length > 0 && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                  <Typography variant="subtitle2">Ingresos por vehículo</Typography>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={reporteVehiculos}>
                      <XAxis dataKey="placa" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="ingresos" fill="#2B6CA3" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
                  <Typography variant="subtitle2">Distribución por tipo</Typography>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={Object.values((reporteVehiculos||[]).reduce((acc, v) => { acc[v.tipo] = acc[v.tipo] ? { ...acc[v.tipo], ingresos: acc[v.tipo].ingresos + Number(v.ingresos) } : { tipo: v.tipo, ingresos: Number(v.ingresos) }; return acc; }, {}))} dataKey="ingresos" nameKey="tipo" cx="50%" cy="50%" outerRadius={70} label>
                        {Object.values((reporteVehiculos||[]).reduce((acc, v) => { acc[v.tipo] = acc[v.tipo] ? { ...acc[v.tipo], ingresos: acc[v.tipo].ingresos + Number(v.ingresos) } : { tipo: v.tipo, ingresos: Number(v.ingresos) }; return acc; }, {})).map((entry, idx) => <Cell key={entry.tipo} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                      </Pie>
                      <Legend fontSize={12} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          )}
          {/* Tabla de vehículos frecuentes */}
          {loadingVehiculos ? <CircularProgress /> : reporteVehiculos && (
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Placa</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Ingresos</TableCell>
                    <TableCell>Primer ingreso</TableCell>
                    <TableCell>Último ingreso</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reporteVehiculos.map(row => (
                    <TableRow key={row.placa + row.primer_ingreso}>
                      <TableCell>{row.placa}</TableCell>
                      <TableCell>{row.tipo}</TableCell>
                      <TableCell>{row.ingresos}</TableCell>
                      <TableCell>{row.primer_ingreso ? new Date(row.primer_ingreso).toLocaleDateString() : ''}</TableCell>
                      <TableCell>{row.ultimo_ingreso ? new Date(row.ultimo_ingreso).toLocaleDateString() : ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={-1}
                page={filtrosVehiculos.page}
                onPageChange={handleChangePageVehiculos}
                rowsPerPage={filtrosVehiculos.limit}
                onRowsPerPageChange={handleChangeRowsPerPageVehiculos}
                labelRowsPerPage="Filas por página"
                nextIconButtonProps={{ disabled: reporteVehiculos.length < filtrosVehiculos.limit }}
                backIconButtonProps={{ disabled: filtrosVehiculos.page === 0 }}
                rowsPerPageOptions={[10, 20, 50]}
                labelDisplayedRows={({ from, to }) => `${from}-${to}`}
              />
            </TableContainer>
          )}
        </Box>
        {/* Sección: Reporte profesional de Servicios Más Contratados */}
        <Box>
          <Typography variant="h5" fontWeight={700} color="warning.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><StarIcon /> Reporte profesional de Servicios Más Contratados</Typography>
          {/* Filtros y exportación */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
            <TextField label="Fecha inicio" type="date" name="fecha_inicio" value={filtrosServicios.fecha_inicio} onChange={handleFiltroServiciosChange} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Fecha fin" type="date" name="fecha_fin" value={filtrosServicios.fecha_fin} onChange={handleFiltroServiciosChange} size="small" InputLabelProps={{ shrink: true }} />
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExportServicios('excel')}
              sx={{ ml: 2 }}
            >
              Exportar Excel
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExportServicios('pdf')}
            >
              Exportar PDF
            </Button>
          </Box>
          {/* Gráficas */}
          {loadingServicios ? <CircularProgress /> : reporteServicios && reporteServicios.length > 0 && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, bgcolor: '#fffde7' }}>
                  <Typography variant="subtitle2">Servicios más contratados</Typography>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={reporteServicios}>
                      <XAxis dataKey="servicio_nombre" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#ff9800" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                  <Typography variant="subtitle2">Participación por servicio</Typography>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={reporteServicios} dataKey="cantidad" nameKey="servicio_nombre" cx="50%" cy="50%" outerRadius={70} label>
                        {reporteServicios.map((entry, idx) => <Cell key={entry.servicio_nombre} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                      </Pie>
                      <Legend fontSize={12} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          )}
          {/* Tabla de servicios más contratados */}
          {loadingServicios ? <CircularProgress /> : reporteServicios && (
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Servicio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reporteServicios.map(row => (
                    <TableRow key={row.servicio_nombre}>
                      <TableCell>{row.servicio_nombre}</TableCell>
                      <TableCell>{row.cantidad}</TableCell>
                      <TableCell>{row.total ? Number(row.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }) : ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={-1}
                page={filtrosServicios.page}
                onPageChange={handleChangePageServicios}
                rowsPerPage={filtrosServicios.limit}
                onRowsPerPageChange={handleChangeRowsPerPageServicios}
                labelRowsPerPage="Filas por página"
                nextIconButtonProps={{ disabled: reporteServicios.length < filtrosServicios.limit }}
                backIconButtonProps={{ disabled: filtrosServicios.page === 0 }}
                rowsPerPageOptions={[10, 20, 50]}
                labelDisplayedRows={({ from, to }) => `${from}-${to}`}
              />
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default Reportes; 