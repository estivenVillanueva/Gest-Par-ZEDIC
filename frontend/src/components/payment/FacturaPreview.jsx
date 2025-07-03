import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Grid, 
  Divider,
  Chip
} from '@mui/material';
import { 
  Receipt, 
  DirectionsCar, 
  LocationOn, 
  Person,
  Phone,
  Email,
  Close
} from '@mui/icons-material';

// Estilos para impresión y visualización profesional
const styles = `
@media print {
  body * { visibility: hidden !important; }
  #factura-print-area, #factura-print-area * { visibility: visible !important; }
  #factura-print-area { position: absolute; left: 0; top: 0; width: 100vw; background: white; box-shadow: none; }
  .no-print { display: none !important; }
}
#factura-print-area {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #fff;
  color: #222;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 32px 32px 16px 32px;
  max-width: 900px;
  margin: 0 auto;
}
.factura-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1.5px solid #e0e0e0;
  padding-bottom: 18px;
  margin-bottom: 24px;
}
.factura-logo {
  height: 60px;
  width: 60px;
  object-fit: contain;
  margin-right: 18px;
  border-radius: 8px;
  background: #f5f5f5;
}
.factura-header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.factura-header-datos {
  text-align: right;
  min-width: 220px;
}
.factura-header-datos .chip {
  margin-top: 8px;
  font-size: 1rem;
  font-weight: 600;
}
.factura-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 2px 0;
}
.factura-info-table {
  width: 100%;
  margin-bottom: 24px;
  border-collapse: collapse;
}
.factura-info-table td {
  padding: 4px 8px;
  font-size: 1rem;
}
.factura-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 8px;
  margin-top: 16px;
}
.factura-details-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  background: #fafbfc;
}
.factura-details-table th, .factura-details-table td {
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
  text-align: left;
}
.factura-details-table th {
  background: #f5f5f5;
  font-weight: 600;
}
.factura-total-row {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1976d2;
  background: #f5f5f5;
  padding: 10px 0 10px 0;
  border-radius: 6px;
  margin-top: 8px;
}
.factura-footer {
  text-align: center;
  font-size: 0.95rem;
  color: #888;
  margin-top: 32px;
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
}
`;

const FacturaPreview = ({ 
  open, 
  onClose, 
  id, 
  fecha, 
  fecha_creacion,
  total, 
  estado, 
  parqueadero, 
  vehiculo, 
  detalles = [],
  usuario,
  ...otherProps 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pagado':
        return '#388e3c';
      case 'pendiente':
        return '#f57c00';
      case 'cancelado':
        return '#d32f2f';
      default:
        return '#757575';
    }
  };

  const getEstadoText = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pagado':
        return 'Pagado';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado || 'No definido';
    }
  };

  // Log para depuración
  console.log('FacturaPreview props:', { id, fecha, fecha_creacion, total, estado, detalles });

  // Ajuste para el total (ahora siempre viene como prop directo)
  const totalNumber = Number(total) || 0;

  // Logo del parqueadero o nombre
  const logoUrl = parqueadero?.logo_url || '';
  const nombreParqueadero = parqueadero?.nombre || 'Parqueadero';
  const direccionParqueadero = parqueadero?.direccion || parqueadero?.ubicacion || '';
  const telefonoParqueadero = parqueadero?.telefono || '';
  const emailParqueadero = parqueadero?.email || '';

  return (
    <>
      <style>{styles}</style>
      {/* Área oculta para impresión, siempre renderizada */}
      <div id="factura-print-area" style={{ display: 'none' }}>
        {/* Cabecera profesional */}
        <div className="factura-header">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo parqueadero" className="factura-logo" />
            ) : (
              <Box className="factura-logo" sx={{ bgcolor: '#e3e3e3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1976d2' }}>{nombreParqueadero[0]}</Box>
            )}
            <div className="factura-header-info">
              <span className="factura-title">{nombreParqueadero}</span>
              <Typography variant="body2" color="text.secondary">{direccionParqueadero}</Typography>
              {telefonoParqueadero && <Typography variant="body2" color="text.secondary"><Phone sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />{telefonoParqueadero}</Typography>}
              {emailParqueadero && <Typography variant="body2" color="text.secondary">Email: {emailParqueadero}</Typography>}
            </div>
          </div>
          <div className="factura-header-datos">
            <Typography variant="h6" sx={{ color: '#222', fontWeight: 700 }}>Factura #{id}</Typography>
            <Chip label={getEstadoText(estado)} sx={{ bgcolor: getEstadoColor(estado), color: 'white', fontWeight: 700, mt: 1 }} className="chip" />
          </div>
        </div>
        {/* Información principal */}
        <table className="factura-info-table">
          <tbody>
            <tr>
              <td><b>Fecha de Emisión:</b></td>
              <td>{formatDate(fecha_creacion ?? fecha ?? null)}</td>
              <td><b>Estado:</b></td>
              <td>{getEstadoText(estado)}</td>
            </tr>
            <tr>
              <td><b>Número de Factura:</b></td>
              <td>#{id}</td>
              <td><b>Total:</b></td>
              <td>{formatCurrency(totalNumber)}</td>
            </tr>
          </tbody>
        </table>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <div className="factura-section-title"><DirectionsCar sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />Vehículo</div>
            {vehiculo ? (
              <>
                <Typography variant="body1" fontWeight="medium">{vehiculo.marca} {vehiculo.modelo}</Typography>
                <Typography variant="body2" color="text.secondary">Color: {vehiculo.color}</Typography>
                <Typography variant="body2" color="text.secondary">Tipo: {vehiculo.tipo}</Typography>
                <Typography variant="body2" color="text.secondary">Placa: {vehiculo.placa}</Typography>
                {vehiculo.puesto && <Typography variant="body2" color="text.secondary">Puesto: {vehiculo.puesto}</Typography>}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">Información del vehículo no disponible</Typography>
            )}
          </Grid>
          <Grid item xs={12} md={7}>
            <div className="factura-section-title">Detalles de Servicios</div>
            <table className="factura-details-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalles && detalles.length > 0 ? (
                  detalles.map((detalle, idx) => (
                    <tr key={idx}>
                      <td>{detalle.servicio_nombre || 'Servicio'}</td>
                      <td>{detalle.cantidad || 1}</td>
                      <td>{formatCurrency(Number(detalle.precio_unitario || 0))}</td>
                      <td>{formatCurrency(Number(detalle.subtotal || 0))}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4}>No hay detalles de servicios disponibles</td></tr>
                )}
              </tbody>
            </table>
            <div className="factura-total-row" style={{ textAlign: 'right', marginTop: 8 }}>
              Total a Pagar {formatCurrency(totalNumber)}
            </div>
          </Grid>
        </Grid>
        <div className="factura-footer">
          ¡Gracias por preferir nuestros servicios!<br />
          Esta factura fue generada por el sistema de gestión de parqueaderos.<br />
          <span style={{ fontSize: '0.85em' }}>Consulte términos y condiciones en la administración del parqueadero.</span>
        </div>
      </div>
      {/* Modal visual para pantalla */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          {/* Cabecera profesional */}
          <div className="factura-header">
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo parqueadero" className="factura-logo" />
              ) : (
                <Box className="factura-logo" sx={{ bgcolor: '#e3e3e3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1976d2' }}>{nombreParqueadero[0]}</Box>
              )}
              <div className="factura-header-info">
                <span className="factura-title">{nombreParqueadero}</span>
                <Typography variant="body2" color="text.secondary">{direccionParqueadero}</Typography>
                {telefonoParqueadero && <Typography variant="body2" color="text.secondary"><Phone sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />{telefonoParqueadero}</Typography>}
                {emailParqueadero && <Typography variant="body2" color="text.secondary">Email: {emailParqueadero}</Typography>}
              </div>
            </div>
            <div className="factura-header-datos">
              <Typography variant="h6" sx={{ color: '#222', fontWeight: 700 }}>Factura #{id}</Typography>
              <Chip label={getEstadoText(estado)} sx={{ bgcolor: getEstadoColor(estado), color: 'white', fontWeight: 700, mt: 1 }} className="chip" />
            </div>
          </div>
          {/* Información principal */}
          <table className="factura-info-table">
            <tbody>
              <tr>
                <td><b>Fecha de Emisión:</b></td>
                <td>{formatDate(fecha_creacion ?? fecha ?? null)}</td>
                <td><b>Estado:</b></td>
                <td>{getEstadoText(estado)}</td>
              </tr>
              <tr>
                <td><b>Número de Factura:</b></td>
                <td>#{id}</td>
                <td><b>Total:</b></td>
                <td>{formatCurrency(totalNumber)}</td>
              </tr>
            </tbody>
          </table>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <div className="factura-section-title"><DirectionsCar sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />Vehículo</div>
              {vehiculo ? (
                <>
                  <Typography variant="body1" fontWeight="medium">{vehiculo.marca} {vehiculo.modelo}</Typography>
                  <Typography variant="body2" color="text.secondary">Color: {vehiculo.color}</Typography>
                  <Typography variant="body2" color="text.secondary">Tipo: {vehiculo.tipo}</Typography>
                  <Typography variant="body2" color="text.secondary">Placa: {vehiculo.placa}</Typography>
                  {vehiculo.puesto && <Typography variant="body2" color="text.secondary">Puesto: {vehiculo.puesto}</Typography>}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">Información del vehículo no disponible</Typography>
              )}
            </Grid>
            <Grid item xs={12} md={7}>
              <div className="factura-section-title">Detalles de Servicios</div>
              <table className="factura-details-table">
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles && detalles.length > 0 ? (
                    detalles.map((detalle, idx) => (
                      <tr key={idx}>
                        <td>{detalle.servicio_nombre || 'Servicio'}</td>
                        <td>{detalle.cantidad || 1}</td>
                        <td>{formatCurrency(Number(detalle.precio_unitario || 0))}</td>
                        <td>{formatCurrency(Number(detalle.subtotal || 0))}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4}>No hay detalles de servicios disponibles</td></tr>
                  )}
                </tbody>
              </table>
              <div className="factura-total-row" style={{ textAlign: 'right', marginTop: 8 }}>
                Total a Pagar {formatCurrency(totalNumber)}
              </div>
            </Grid>
          </Grid>
          <div className="factura-footer">
            ¡Gracias por preferir nuestros servicios!<br />
            Esta factura fue generada por el sistema de gestión de parqueaderos.<br />
            <span style={{ fontSize: '0.85em' }}>Consulte términos y condiciones en la administración del parqueadero.</span>
          </div>
        </DialogContent>
        <DialogActions className="no-print">
          <Button onClick={onClose} variant="outlined" startIcon={<Close />} sx={{ borderRadius: 2 }}>
            Cerrar
          </Button>
          <Button onClick={() => window.print()} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
            Imprimir factura
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FacturaPreview; 