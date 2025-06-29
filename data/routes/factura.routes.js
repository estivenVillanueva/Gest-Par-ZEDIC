import express from 'express';
import { facturaQueries, detalleFacturaQueries, getFacturaCompletaById } from '../queries/factura.queries.js';
import { crearYEmitirNotificacion } from '../utils/notificacion.utils.js';

const router = express.Router();

// Rutas para Factura
router.get('/:id', async (req, res) => {
    try {
        const factura = await facturaQueries.getFacturaById(req.params.id);
        if (!factura) {
            return res.status(404).json({
                success: false,
                message: 'Factura no encontrada'
            });
        }
        res.json({
            success: true,
            data: factura
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener factura',
            error: error.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { detalles, ...facturaData } = req.body;
        // Crear la factura principal
        const nuevaFactura = await facturaQueries.createFactura(facturaData);
        let detallesInsertados = [];
        if (detalles && Array.isArray(detalles) && detalles.length > 0) {
            for (const detalle of detalles) {
                const detalleData = { ...detalle, factura_id: nuevaFactura.id };
                const det = await detalleFacturaQueries.createDetalleFactura(detalleData);
                detallesInsertados.push(det);
            }
        }
        // Notificar al dueño si la factura es pendiente
        if (nuevaFactura && (nuevaFactura.estado === 'pendiente' || nuevaFactura.estado === 'Pendiente')) {
          const { usuario_id, parqueadero_id } = nuevaFactura;
          await crearYEmitirNotificacion(req.io, {
            usuario_id: usuario_id || null,
            parqueadero_id: parqueadero_id || null,
            titulo: 'Factura pendiente',
            mensaje: 'Tienes una nueva factura pendiente de pago.',
            tipo: 'factura'
          });
        }
        res.status(201).json({
            success: true,
            data: { ...nuevaFactura, detalles: detallesInsertados }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear factura',
            error: error.message
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const facturaActualizada = await facturaQueries.updateFactura(req.params.id, req.body);
        if (!facturaActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Factura no encontrada'
            });
        }
        res.json({
            success: true,
            data: facturaActualizada
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar factura',
            error: error.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const facturaEliminada = await facturaQueries.deleteFactura(req.params.id);
        if (!facturaEliminada) {
            return res.status(404).json({
                success: false,
                message: 'Factura no encontrada'
            });
        }
        res.json({
            success: true,
            message: 'Factura eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar factura',
            error: error.message
        });
    }
});

// Rutas para DetalleFactura
router.get('/:idFactura/detalles', async (req, res) => {
    try {
        const detalles = await detalleFacturaQueries.getDetallesByFacturaId(req.params.idFactura);
        res.json({
            success: true,
            data: detalles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener detalles de factura',
            error: error.message
        });
    }
});

router.post('/detalles', async (req, res) => {
    try {
        const nuevoDetalle = await detalleFacturaQueries.createDetalleFactura(req.body);
        res.status(201).json({
            success: true,
            data: nuevoDetalle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear detalle de factura',
            error: error.message
        });
    }
});

router.put('/detalles/:id', async (req, res) => {
    try {
        const detalleActualizado = await detalleFacturaQueries.updateDetalleFactura(req.params.id, req.body);
        if (!detalleActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Detalle de factura no encontrado'
            });
        }
        res.json({
            success: true,
            data: detalleActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar detalle de factura',
            error: error.message
        });
    }
});

router.delete('/detalles/:id', async (req, res) => {
    try {
        const detalleEliminado = await detalleFacturaQueries.deleteDetalleFactura(req.params.id);
        if (!detalleEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Detalle de factura no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Detalle de factura eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar detalle de factura',
            error: error.message
        });
    }
});

// Nueva ruta para obtener factura completa
router.get('/completa/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getFacturaCompletaById(id);
    if (!data) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const facturaRoutes = router; 