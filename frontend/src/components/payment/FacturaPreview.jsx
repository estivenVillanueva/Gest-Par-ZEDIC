import React from 'react';
import { Box, Typography, Divider, Avatar } from '@mui/material';
import logoZedic from '../../assets/safeparking.png';

const FacturaPreview = ({ factura, vehiculo, detalles, numIngresos, numSalidas }) => {
  // Log de depuración
  console.log('FacturaPreview props:', { factura, vehiculo, detalles, numIngresos, numSalidas });

  // Branding ZEDIC
  const logo = logoZedic;
  const nombreApp = 'ZEDIC - Gestión de Parqueaderos Inteligente';
  const web = 'www.zedic.com';

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
    <Box className="factura-modal" sx={{
      p: 4, bgcolor: '#fff', borderRadius: 3, maxWidth: 500, mx: 'auto', boxShadow: 4, minWidth: 350
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
        <Avatar src={logo} alt="Logo ZEDIC" sx={{ width: 70, height: 70, mr: 2, bgcolor: 'white', border: '2px solid #1976d2' }} />
        <Box>
          <Typography variant="h6" fontWeight={700}>{nombreApp}</Typography>
          <Typography variant="body2" color="primary">{web}</Typography>
        </Box>
      </Box>
      <Typography variant="h4" color="primary" fontWeight={800} align="center" sx={{ mb: 2 }}>
        Factura #{factura.id || ''}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>Fecha de emisión:</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>{fechaEmision}</Typography>
        <Typography variant="subtitle1" fontWeight={700}>Cliente:</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>{clienteNombre}</Typography>
        <Typography variant="subtitle1" fontWeight={700}>Placa:</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>{clientePlaca}</Typography>
        <Typography variant="subtitle1" fontWeight={700}>Marca:</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>{marca}</Typography>
        <Typography variant="subtitle1" fontWeight={700}>Modelo:</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>{modelo}</Typography>
        <Typography variant="subtitle1" fontWeight={700}>Color:</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>{color}</Typography>
        <Typography variant="subtitle1" fontWeight={700}>Tipo:</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>{tipo}</Typography>
        <Typography variant="subtitle1" fontWeight={700}>Servicio:</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>{servicio}</Typography>
      </Box>
      {/* Mostrar detalles de la factura si existen */}
      {detalles && detalles.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Detalles:</Typography>
          {detalles.map((detalle, idx) => (
            <Box key={detalle.id || idx} sx={{ mb: 1, pl: 2 }}>
              <Typography variant="body2"><b>Servicio:</b> {detalle.servicio_nombre}</Typography>
              <Typography variant="body2"><b>Cantidad:</b> {detalle.cantidad}</Typography>
              <Typography variant="body2"><b>Precio unitario:</b> ${parseFloat(detalle.precio_unitario).toLocaleString('es-CO')}</Typography>
              <Typography variant="body2"><b>Subtotal:</b> ${parseFloat(detalle.subtotal).toLocaleString('es-CO')}</Typography>
            </Box>
          ))}
        </Box>
      )}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
        <Typography variant="h6" fontWeight={800}>Total:&nbsp;</Typography>
        <Typography variant="h5" color="primary" fontWeight={900}>
          ${parseFloat(factura.total || factura.valor_total || 0).toLocaleString('es-CO')}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
        ¡Gracias por preferir ZEDIC!<br />
        Factura generada por ZEDIC - Gestión de Parqueaderos Inteligente.<br />
        Consulte términos y condiciones en <a href="https://www.zedic.com" target="_blank" rel="noopener noreferrer">www.zedic.com</a>
      </Typography>
    </Box>
  );
};

export default FacturaPreview; 