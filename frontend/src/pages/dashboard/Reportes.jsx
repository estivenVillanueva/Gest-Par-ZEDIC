import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Chip, LinearProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';
const COLORS = ['#2B6CA3', '#43a047', '#fbc02d', '#e53935', '#8e24aa'];

function Reportes() {
  const [loading, setLoading] = useState(true);
  const [ingresos, setIngresos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
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

  // Ocupación actual
  const ocupacionPorcentaje = ocupacion.total ? Math.round((ocupacion.ocupados / ocupacion.total) * 100) : 0;

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, minHeight: '100vh', bgcolor: '#f6f7fa' }}>
      <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 3 }}>Estadísticas y Reportes</Typography>
      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box> : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Ingresos por mes</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ingresosMesData}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#2B6CA3" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Pagos pendientes vs pagados</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pagosPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pagosPieData.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Vehículos por tipo</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={vehiculosTipoData}>
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#43a047" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Ocupación actual</Typography>
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress variant="determinate" value={ocupacionPorcentaje} sx={{ height: 16, borderRadius: 8 }} />
              </Box>
              <Chip label={`${ocupacion.ocupados} de ${ocupacion.total} puestos ocupados (${ocupacionPorcentaje}%)`} color="primary" sx={{ fontSize: 18, p: 2 }} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Reportes; 