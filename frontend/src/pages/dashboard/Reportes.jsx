import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Chip, LinearProgress, Stack } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import GroupIcon from '@mui/icons-material/Group';

const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';
const COLORS = ['#2B6CA3', '#43a047', '#fbc02d', '#e53935', '#8e24aa'];

function Reportes() {
  const [loading, setLoading] = useState(true);
  const [ingresos, setIngresos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [ocupacion, setOcupacion] = useState({ total: 0, ocupados: 0 });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Ingresos históricos
      const ingresosRes = await fetch(`${API_URL}/api/ingresos/historial`);
      const ingresosData = await ingresosRes.json();
      setIngresos(ingresosData || []);
      // Facturas
      const facturasRes = await fetch(`${API_URL}/api/facturas`);
      const facturasData = await facturasRes.json();
      setFacturas(facturasData.data || []);
      // Vehículos
      const vehiculosRes = await fetch(`${API_URL}/api/vehiculos`);
      const vehiculosData = await vehiculosRes.json();
      setVehiculos(vehiculosData.data || []);
      // Servicios
      const serviciosRes = await fetch(`${API_URL}/api/servicios`);
      const serviciosData = await serviciosRes.json();
      setServicios(serviciosData.data || []);
      // Ocupación
      const total = vehiculosData.data.length;
      const ocupados = vehiculosData.data.filter(v => v.puesto && v.puesto !== 'No asignado').length;
      setOcupacion({ total, ocupados });
      setLoading(false);
    }
    fetchData();
  }, []);

  // Ingresos por mes
  const ingresosPorMes = {};
  ingresos.forEach(i => {
    const fecha = new Date(i.hora_entrada || i.fecha_creacion);
    const key = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
    ingresosPorMes[key] = (ingresosPorMes[key] || 0) + (i.valor_pagado || i.total || 0);
  });
  const ingresosMesData = Object.entries(ingresosPorMes).map(([mes, total]) => ({ mes, total }));

  // Pagos pendientes vs pagados
  const pagosPendientes = facturas.filter(f => f.estado?.toLowerCase() === 'pendiente').length;
  const pagosPagados = facturas.filter(f => f.estado?.toLowerCase() === 'pagado' || f.estado?.toLowerCase() === 'pagada').length;
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

  // Servicios activos por tipo
  const serviciosPorTipo = { Semanal: 0, Quincenal: 0, Mensual: 0, Ocasional: 0 };
  vehiculos.forEach(v => {
    const servicio = servicios.find(s => s.id === v.servicio_id);
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
  const totalServicios = servicios.length;
  const ingresosAcumulados = ingresos
    .filter(i => typeof i.valor_pagado === 'number' && i.valor_pagado > 0)
    .reduce((acc, i) => acc + i.valor_pagado, 0);
  const ocupacionPromedio = ocupacion.total ? Math.round((ocupacion.ocupados / ocupacion.total) * 100) : 0;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 2, px: { xs: 1, md: 3 }, bgcolor: '#f6f7fa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: '98vw',
        minHeight: '90vh',
        borderRadius: 2,
        bgcolor: '#fff',
        boxShadow: '0 6px 32px rgba(52,152,243,0.10)',
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 5 },
        mt: { xs: 2, md: 4 },
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>
        <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 3 }}>Estadísticas y Reportes</Typography>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box> : (
          <>
            {/* KPIs rápidos */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} md={3} lg={3}>
                <Paper sx={{ p: 1.5, borderRadius: 2, boxShadow: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 80, height: '100%' }}>
                  <DirectionsCarIcon sx={{ fontSize: 28, color: '#2B6CA3' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Total vehículos</Typography>
                    <Typography variant="h6" fontWeight={700}>{totalVehiculos}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3} lg={3}>
                <Paper sx={{ p: 1.5, borderRadius: 2, boxShadow: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 80, height: '100%' }}>
                  <EventAvailableIcon sx={{ fontSize: 28, color: '#43a047' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Total servicios</Typography>
                    <Typography variant="h6" fontWeight={700}>{totalServicios}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3} lg={3}>
                <Paper sx={{ p: 1.5, borderRadius: 2, boxShadow: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 80, height: '100%' }}>
                  <LocalAtmIcon sx={{ fontSize: 28, color: '#fbc02d' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Ingresos acumulados</Typography>
                    <Typography variant="h6" fontWeight={700}>{ingresosAcumulados.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3} lg={3}>
                <Paper sx={{ p: 1.5, borderRadius: 2, boxShadow: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 80, height: '100%' }}>
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
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#e3f2fd' }}>
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
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#e8f5e9' }}>
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
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#fffde7' }}>
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
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Ocupación actual</Typography>
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress variant="determinate" value={ocupacionPorcentaje} sx={{ height: 16, borderRadius: 8 }} />
                  </Box>
                  <Chip label={`${ocupacion.ocupados} de ${ocupacion.total} puestos ocupados (${ocupacionPorcentaje}%)`} color="primary" sx={{ fontSize: 16, p: 1 }} />
                </Paper>
              </Grid>
              {/* Vehículos por tipo (gráfica ancha) */}
              <Grid item xs={12} md={6} lg={6}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1, minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
      </Paper>
    </Box>
  );
}

export default Reportes; 