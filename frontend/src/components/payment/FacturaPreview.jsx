import React from 'react';
import { Box, Typography, Divider, Avatar } from '@mui/material';

const DEFAULT_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Parking_icon.svg';

const FacturaPreview = ({ factura, parqueadero, vehiculo, detalles, numIngresos, numSalidas }) => {
  // Log de depuración
  console.log('FacturaPreview props:', { factura, parqueadero, vehiculo, detalles, numIngresos, numSalidas });

  // Datos del parqueadero
  const logo = parqueadero?.logo_url || DEFAULT_LOGO_URL;
  const nombreParqueadero = parqueadero?.nombre || 'Parqueadero';
  const telefono = parqueadero?.telefono || 'No especificado';
  const email = parqueadero?.email || 'No especificado';

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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={logo} alt="Logo" sx={{ width: 70, height: 70, mr: 2, bgcolor: 'white', border: '2px solid #1976d2' }} />
        <Box>
          <Typography variant="h6" fontWeight={700}>{nombreParqueadero}</Typography>
          <Typography variant="body2">Tel: {telefono}</Typography>
          <Typography variant="body2">Email: {email}</Typography>
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
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
        <Typography variant="h6" fontWeight={800}>Total:&nbsp;</Typography>
        <Typography variant="h5" color="primary" fontWeight={900}>
          ${parseFloat(factura.total || factura.valor_total || 0).toLocaleString('es-CO')}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
        ¡Gracias por preferirnos!<br />
        Esta factura es válida para efectos legales. Consulte términos y condiciones en www.zedic.com
      </Typography>
    </Box>
  );
};

export default FacturaPreview; 