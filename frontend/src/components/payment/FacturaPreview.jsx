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
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: 'primary.main',
        color: 'white',
        pb: 1
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Receipt />
          <Typography variant="h6">
            Factura #{id ?? 'No disponible'}
          </Typography>
        </Box>
        <Chip 
          label={getEstadoText(estado)}
          color={getEstadoColor(estado)}
          size="small"
          sx={{ color: 'white' }}
        />
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Información de la Factura */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                Información de la Factura
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Número de Factura
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    #{id ?? 'No disponible'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Emisión
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(fecha_creacion ?? fecha ?? null) || 'No disponible'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Estado
                  </Typography>
                  <Chip 
                    label={getEstadoText(estado)}
                    color={getEstadoColor(estado)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {formatCurrency(totalNumber)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Información del Parqueadero */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Parqueadero
              </Typography>
              {parqueadero ? (
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {parqueadero.nombre || 'No registrado'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {parqueadero.direccion || 'Dirección no disponible'}
                  </Typography>
                  {parqueadero.telefono && (
                    <Typography variant="body2" color="text.secondary">
                      <Phone sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      {parqueadero.telefono}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Información del parqueadero no disponible
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Información del Vehículo */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                <DirectionsCar sx={{ mr: 1, verticalAlign: 'middle' }} />
                Vehículo
              </Typography>
              {vehiculo ? (
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {vehiculo.marca && vehiculo.modelo 
                      ? `${vehiculo.marca} ${vehiculo.modelo}`
                      : 'Marca y modelo no registrados'
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Color: {vehiculo.color || 'No registrado'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tipo: {vehiculo.tipo || 'No registrado'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placa: {vehiculo.placa || 'No registrada'}
                  </Typography>
                  {vehiculo.puesto && (
                    <Typography variant="body2" color="text.secondary">
                      Puesto: {vehiculo.puesto}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Información del vehículo no disponible
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Información del Usuario */}
          {usuario && (
            <>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Información del Usuario
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Nombre
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {usuario.nombre || 'No registrado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Apellido
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {usuario.apellido || 'No registrado'}
                      </Typography>
                    </Grid>
                    {usuario.telefono && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          <Phone sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          Teléfono
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {usuario.telefono}
                        </Typography>
                      </Grid>
                    )}
                    {usuario.email && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          <Email sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {usuario.email}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </>
          )}

          {/* Detalles de la Factura */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                Detalles de Servicios
              </Typography>
              {detalles && detalles.length > 0 ? (
                <Box>
                  {detalles.map((detalle, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 1,
                        borderBottom: index < detalles.length - 1 ? '1px solid #e0e0e0' : 'none'
                      }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {detalle.servicio_nombre || detalle.servicio?.nombre || 'Servicio no especificado'}
                        </Typography>
                        {detalle.descripcion && (
                          <Typography variant="body2" color="text.secondary">
                            {detalle.descripcion}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {formatCurrency(Number(detalle.precio_unitario || detalle.precio || detalle.subtotal || 0))}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay detalles de servicios disponibles
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Total */}
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pt: 2,
              borderTop: '2px solid #e0e0e0'
            }}>
              <Typography variant="h6" fontWeight="bold">
                Total a Pagar
              </Typography>
              <Typography variant="h5" color="primary.main" fontWeight="bold">
                {formatCurrency(totalNumber)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          startIcon={<Close />}
          sx={{ borderRadius: 2 }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FacturaPreview; 