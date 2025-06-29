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
  const pagadas = facturas.filter(f => f.estado?.toLowerCase() === 'pagado' || f.estado?.toLowerCase() === 'pagada');

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, minHeight: '100vh', bgcolor: '#f6f7fa' }}>
      <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 3 }}>Mis Pagos</Typography>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab label={`Pendientes (${pendientes.length})`} />
          <Tab label={`Pagados (${pagadas.length})`} />
        </Tabs>
      </Paper>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parqueadero</TableCell>
                <TableCell>Vehículo</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
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
      )}
    </Box>
  );
}

export default Pagos; 