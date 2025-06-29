import React from 'react';
import { Box, Typography, Divider, Avatar } from '@mui/material';

const DEFAULT_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Parking_icon.svg';

const FacturaPreview = ({ factura, parqueadero, vehiculo, detalles, numIngresos, numSalidas }) => {
  if (!factura) return null;
  // Datos del parqueadero
  const logo = parqueadero?.logo_url || DEFAULT_LOGO_URL;
  const nombre = parqueadero?.nombre || 'Gest-Par ZEDIC';
  const direccion = parqueadero?.direccion || 'No especificada';
  const telefono = parqueadero?.telefono || 'No especificado';
  const email = parqueadero?.email || 'No especificado';
  const horarios = parqueadero?.horarios || '';
  const descripcion = parqueadero?.descripcion || '';

  // Datos del cliente
  const clienteNombre = vehiculo?.dueno_nombre || factura.usuario_nombre || 'No registrado';
  const clientePlaca = vehiculo?.placa || factura.placa || 'No registrado';
  const clienteTelefono = vehiculo?.dueno_telefono || factura.dueno_telefono || '';
  const clienteEmail = vehiculo?.dueno_email || factura.dueno_email || '';
  const marca = vehiculo?.marca || 'No registrado';
  const modelo = vehiculo?.modelo || 'No registrado';
  const color = vehiculo?.color || 'No registrado';
  const tipo = vehiculo?.tipo || 'No registrado';
  const servicio = factura.servicio_nombre || 'No registrado';
  const fechaEmision = factura.fecha_creacion ? new Date(factura.fecha_creacion).toLocaleString() : 'No registrado';

  return (
    <Box className="factura-modal" sx={{ p: 4, bgcolor: '#fff', borderRadius: 2, maxWidth: 600, mx: 'auto', boxShadow: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #1976d2', pb: 2, mb: 2 }}>
        <Avatar src={logo} alt="Logo" sx={{ width: 80, height: 80, mr: 2, bgcolor: 'white', border: '2px solid #1976d2' }} />
        <Box>
          <Typography variant="h6" fontWeight={700}>{nombre}</Typography>
          <Typography variant="body2">Dirección: {direccion}</Typography>
          <Typography variant="body2">Tel: {telefono}</Typography>
          <Typography variant="body2">Email: {email}</Typography>
          {horarios && <Typography variant="body2">Horarios: {horarios}</Typography>}
        </Box>
        <Box flex={1} />
        <Typography variant="h5" color="primary" fontWeight={700}>Factura #{factura.id || ''}</Typography>
      </Box>
      {descripcion && (
        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>{descripcion}</Typography>
      )}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2"><strong>Cliente:</strong> {clienteNombre}</Typography>
        <Typography variant="subtitle2"><strong>Placa:</strong> {clientePlaca}</Typography>
        {clienteTelefono && <Typography variant="subtitle2"><strong>Teléfono:</strong> {clienteTelefono}</Typography>}
        {clienteEmail && <Typography variant="subtitle2"><strong>Email:</strong> {clienteEmail}</Typography>}
        <Typography variant="subtitle2"><strong>Marca:</strong> {marca}</Typography>
        <Typography variant="subtitle2"><strong>Modelo:</strong> {modelo}</Typography>
        <Typography variant="subtitle2"><strong>Color:</strong> {color}</Typography>
        <Typography variant="subtitle2"><strong>Tipo:</strong> {tipo}</Typography>
        <Typography variant="subtitle2"><strong>Servicio:</strong> {servicio}</Typography>
        <Typography variant="subtitle2"><strong>Fecha de emisión:</strong> {fechaEmision}</Typography>
        <Typography variant="subtitle2"><strong>Entradas registradas:</strong> {numIngresos}</Typography>
        <Typography variant="subtitle2"><strong>Salidas registradas:</strong> {numSalidas}</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #bbb', padding: 8, background: '#e3f2fd', color: '#1976d2' }}>Servicio</th>
              <th style={{ border: '1px solid #bbb', padding: 8, background: '#e3f2fd', color: '#1976d2' }}>Cantidad</th>
              <th style={{ border: '1px solid #bbb', padding: 8, background: '#e3f2fd', color: '#1976d2' }}>Precio unitario</th>
              <th style={{ border: '1px solid #bbb', padding: 8, background: '#e3f2fd', color: '#1976d2' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(detalles && detalles.length > 0)
              ? detalles.map((det, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #bbb', padding: 8 }}>{det.servicio_nombre || det.tipo_servicio || 'No registrado'}</td>
                  <td style={{ border: '1px solid #bbb', padding: 8 }}>{det.cantidad || 1}</td>
                  <td style={{ border: '1px solid #bbb', padding: 8 }}>${parseFloat(det.precio_unitario || 0).toLocaleString('es-CO')}</td>
                  <td style={{ border: '1px solid #bbb', padding: 8 }}>${parseFloat(det.subtotal || det.valor_total || 0).toLocaleString('es-CO')}</td>
                </tr>
              ))
              : <tr><td colSpan={4} style={{ textAlign: 'center', padding: 8 }}>Sin detalles</td></tr>}
          </tbody>
        </table>
      </Box>
      <Typography variant="h6" align="right" sx={{ fontWeight: 700, mt: 2 }}>
        Total: ${parseFloat(factura.total || factura.valor_total || 0).toLocaleString('es-CO')}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" align="center" color="text.secondary">
        ¡Gracias por preferirnos!<br />
        Esta factura es válida para efectos legales. Consulte términos y condiciones en www.zedic.com
      </Typography>
    </Box>
  );
};

export default FacturaPreview; 