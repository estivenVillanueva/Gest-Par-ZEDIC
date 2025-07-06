import express from 'express';
import { 
    getPagosPendientes, 
    getHistorialPagos, 
    marcarComoPagada,
    getReportePagosPendientes
} from '../queries/pagos.queries.js';
import { facturaQueries } from '../queries/factura.queries.js';
import { crearYEmitirNotificacion } from '../queries/notificaciones.queries.js';
import { pool } from '../postgres.js';

const router = express.Router();

// Endpoint profesional para reporte de pagos pendientes y vencidos
router.get('/pendientes/reporte', async (req, res) => {
  try {
    const { parqueadero_id, fecha_inicio, fecha_fin, usuario_nombre, estado, page, limit } = req.query;
    const result = await getReportePagosPendientes({ parqueadero_id, fecha_inicio, fecha_fin, usuario_nombre, estado, page, limit });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al generar el reporte de pagos pendientes', error: error.message });
  }
});

// Obtener pagos pendientes y vencidos de un parqueadero
router.get('/pendientes/:parqueaderoId', async (req, res) => {
    try {
        await facturaQueries.generateFacturasPeriodicas();
        const { parqueaderoId } = req.params;
        const pendientes = await getPagosPendientes(parqueaderoId);
        // Notificar al admin por cada pago pendiente
        for (const pendiente of pendientes) {
          // Buscar si ya existe una notificación para esta factura pendiente
          const existe = await pool.query(
            `SELECT 1 FROM notificaciones WHERE parqueadero_id = $1 AND tipo = 'pago_pendiente' AND mensaje LIKE $2`,
            [parqueaderoId, `%factura #${pendiente.id}%`]
          );
          if (existe.rows.length === 0) {
            await crearYEmitirNotificacion(req.io, {
              usuario_id: null,
              parqueadero_id: parqueaderoId,
              titulo: 'Pago pendiente',
              mensaje: `El usuario ${pendiente.usuario_nombre} con placa ${pendiente.placa} todavía tiene pendiente el pago de la factura #${pendiente.id}.`,
              tipo: 'pago_pendiente'
            });
          }
        }
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
          parqueadero_id: facturaPagada.parqueadero_id || null,
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