import express from 'express';
import { 
    getPagosPendientes, 
    getHistorialPagos, 
    marcarComoPagada 
} from '../queries/pagos.queries.js';
import { facturaQueries } from '../queries/factura.queries.js';
import { crearYEmitirNotificacion } from '../queries/notificaciones.queries.js';

const router = express.Router();

// Obtener pagos pendientes y vencidos de un parqueadero
router.get('/pendientes/:parqueaderoId', async (req, res) => {
    try {
        await facturaQueries.generateFacturasPeriodicas();
        const { parqueaderoId } = req.params;
        const pendientes = await getPagosPendientes(parqueaderoId);
        res.json(pendientes);
    } catch (error) {
        console.error('Error al obtener pagos pendientes:', error);
        res.status(500).json({ error: error.message });
    }
});

// Obtener historial de pagos de un parqueadero
router.get('/historial/:parqueaderoId', async (req, res) => {
    try {
        await facturaQueries.generateFacturasPeriodicas();
        const { parqueaderoId } = req.params;
        const historial = await getHistorialPagos(parqueaderoId);
        res.json(historial);
    } catch (error) {
        console.error('Error al obtener historial de pagos:', error);
        res.status(500).json({ error: error.message });
    }
});

// Marcar una factura como pagada
router.put('/:facturaId/pagar', async (req, res) => {
    try {
        const { facturaId } = req.params;
        const { metodo_pago } = req.body;
        if (!metodo_pago) {
            return res.status(400).json({ error: 'El método de pago es requerido.' });
        }
        const facturaPagada = await marcarComoPagada(facturaId, metodo_pago);
        // Notificación automática
        await crearYEmitirNotificacion(req.io, {
          usuario_id: facturaPagada.usuario_id || null,
          titulo: 'Pago registrado',
          mensaje: `Se ha registrado el pago de la factura #${facturaId}.`,
          tipo: 'pago'
        });
        res.json(facturaPagada);
    } catch (error) {
        console.error('Error al marcar factura como pagada:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router; 