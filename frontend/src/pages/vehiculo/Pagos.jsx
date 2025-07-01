import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAuth } from '../../../logic/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';

function Pagos() {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState(0);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    setLoading(true);
    fetch(`${API_URL}/api/facturas/usuario/${currentUser.id}`)
      .then(res => res.json())
      .then(data => setFacturas(data.data || []))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const pendientes = facturas.filter(f => f.estado?.toLowerCase() === 'pendiente');
  const pagadas = facturas.filter(f => ['pagado', 'pagada'].includes((f.estado || '').toLowerCase()));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f6f7fa', py: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={4} sx={{ width: '95vw', maxWidth: 1200, borderRadius: 0, p: { xs: 2, sm: 3, md: 5 }, boxShadow: '0 8px 32px rgba(43,108,163,0.13)', mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 3, fontSize: { xs: '1.3rem', sm: '1.7rem' }, textAlign: 'center', width: '100%' }}>Mis Pagos</Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary" textColor="primary" variant="fullWidth" sx={{ mb: 3, width: '100%' }}>
          <Tab label={`Pendientes (${pendientes.length})`} sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' } }} />
          <Tab label={`Pagados (${pagadas.length})`} sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' } }} />
        </Tabs>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, width: '100%' }}><CircularProgress /></Box>
        ) : (
          <>
            {/* Vista tipo tarjetas en xs */}
            <Box sx={{ width: '100%', display: { xs: 'block', sm: 'none' } }}>
              {((tab === 0 ? pendientes : pagadas).length === 0) ? (
                <Paper sx={{ p: 2, textAlign: 'center', mb: 2 }}>No hay pagos {tab === 0 ? 'pendientes' : 'realizados'}.</Paper>
              ) : (
                (tab === 0 ? pendientes : pagadas).map(f => (
                  <Paper key={f.id} sx={{ mb: 2, p: 2, borderRadius: 0, boxShadow: '0 2px 12px rgba(52,152,243,0.10)' }}>
                    <Typography variant="subtitle1" fontWeight={700}>{f.parqueadero_nombre}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{f.parqueadero_direccion}</Typography>
                    <Typography variant="body2"><b>Vehículo:</b> {f.vehiculo_placa}</Typography>
                    <Typography variant="body2"><b>Servicio:</b> {f.servicio_nombre}</Typography>
                    <Typography variant="body2"><b>Monto:</b> ${f.total}</Typography>
                    <Typography variant="body2"><b>Fecha:</b> {tab === 0 ? (f.fecha_vencimiento ? new Date(f.fecha_vencimiento).toLocaleDateString() : '-') : (f.fecha_pago ? new Date(f.fecha_pago).toLocaleDateString() : '-')}</Typography>
                    <Chip label={f.estado} color={f.estado?.toLowerCase() === 'pendiente' ? 'warning' : 'success'} sx={{ mt: 1 }} />
                  </Paper>
                ))
              )}
            </Box>
            {/* Vista tabla en sm+ */}
            <Box sx={{ width: '100%', overflowX: 'auto', display: { xs: 'none', sm: 'block' } }}>
              <TableContainer component={Paper} sx={{ minWidth: 600, boxShadow: 'none', borderRadius: 0 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Parqueadero</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Vehículo</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Servicio</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Monto</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(tab === 0 ? pendientes : pagadas).map(f => (
                      <TableRow key={f.id}>
                        <TableCell>{f.parqueadero_nombre}<br /><span style={{ fontSize: 12, color: '#888' }}>{f.parqueadero_direccion}</span></TableCell>
                        <TableCell>{f.vehiculo_placa}</TableCell>
                        <TableCell>{f.servicio_nombre}</TableCell>
                        <TableCell>${f.total}</TableCell>
                        <TableCell>
                          <Chip label={f.estado} color={f.estado?.toLowerCase() === 'pendiente' ? 'warning' : 'success'} />
                        </TableCell>
                        <TableCell>
                          {tab === 0 ? (f.fecha_vencimiento ? new Date(f.fecha_vencimiento).toLocaleDateString() : '-') : (f.fecha_pago ? new Date(f.fecha_pago).toLocaleDateString() : '-')}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(tab === 0 ? pendientes : pagadas).length === 0 && (
                      <TableRow><TableCell colSpan={6} align="center">No hay pagos {tab === 0 ? 'pendientes' : 'realizados'}.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Pagos; 