import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const FacturaPreview = ({ factura, parqueadero, vehiculo, detalles, numIngresos, numSalidas }) => {
  // Log de depuración
  console.log('FacturaPreview props:', { factura, parqueadero, vehiculo, detalles, numIngresos, numSalidas });

  // Datos del cliente y vehículo
  const clienteNombre = vehiculo?.dueno_nombre || factura?.usuario_nombre || 'No registrado';
  const clientePlaca = vehiculo?.placa || factura?.placa || 'No registrado';
  const marca = vehiculo?.marca || 'No registrado';
  const modelo = vehiculo?.modelo || 'No registrado';
  const color = vehiculo?.color || 'No registrado';
  const tipo = vehiculo?.tipo || 'No registrado';
  const servicio = factura?.servicio_nombre || 'No registrado';
  const fechaEmision = factura?.fecha_creacion ? new Date(factura.fecha_creacion).toLocaleString() : 'No registrado';

  if (!factura) return null;

  return (
    <Box className="factura-modal" sx={{ p: 4, bgcolor: '#fff', borderRadius: 2, maxWidth: 600, mx: 'auto', boxShadow: 3 }}>
      <Typography variant="h5" color="primary" fontWeight={700} align="center">Factura #{factura.id || ''}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2"><strong>Fecha de emisión:</strong> {fechaEmision}</Typography>
      <Typography variant="subtitle2"><strong>Cliente:</strong> {clienteNombre}</Typography>
      <Typography variant="subtitle2"><strong>Placa:</strong> {clientePlaca}</Typography>
      <Typography variant="subtitle2"><strong>Marca:</strong> {marca}</Typography>
      <Typography variant="subtitle2"><strong>Modelo:</strong> {modelo}</Typography>
      <Typography variant="subtitle2"><strong>Color:</strong> {color}</Typography>
      <Typography variant="subtitle2"><strong>Tipo:</strong> {tipo}</Typography>
      <Typography variant="subtitle2"><strong>Servicio:</strong> {servicio}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" align="right" sx={{ fontWeight: 700, mt: 2 }}>
        Total: ${parseFloat(factura.total || factura.valor_total || 0).toLocaleString('es-CO')}
      </Typography>
    </Box>
  );
};

export default FacturaPreview; 