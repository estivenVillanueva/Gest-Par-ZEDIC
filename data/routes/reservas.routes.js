import express from 'express';
import reservasQueries from '../queries/reservas.queries.js';
import { crearYEmitirNotificacion } from '../queries/notificaciones.queries.js';

const router = express.Router();

// Crear reserva
router.post('/', async (req, res) => {
  try {
    const reserva = await reservasQueries.crearReserva(req.body);
    // Notificación automática
    await crearYEmitirNotificacion(req.io, {
      usuario_id: reserva.usuario_id || null,
      parqueadero_id: reserva.parqueadero_id || null,
      titulo: 'Nueva solicitud de reserva',
      mensaje: `Se ha realizado una solicitud de reserva para el parqueadero.`,
      tipo: 'reserva'
    });
    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar reservas (todas, por parqueadero o usuario)
router.get('/', async (req, res) => {
  try {
    const { parqueadero_id, usuario_id } = req.query;
    const reservas = await reservasQueries.listarReservas({ parqueadero_id, usuario_id });
    res.json({ data: reservas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cambiar estado de reserva
router.put('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    const reserva = await reservasQueries.cambiarEstadoReserva(req.params.id, estado);
    // Notificar al dueño del vehículo si la reserva fue aprobada o rechazada
    if (reserva && (estado === 'Aprobada' || estado === 'Rechazada')) {
      // Notificación para el usuario dueño del vehículo
      await crearYEmitirNotificacion(req.io, {
        usuario_id: reserva.usuario_id || null,
        parqueadero_id: reserva.parqueadero_id || null,
        titulo: `Reserva ${estado === 'Aprobada' ? 'aprobada' : 'rechazada'}`,
        mensaje: `Tu reserva para el parqueadero ha sido ${estado === 'Aprobada' ? 'aprobada' : 'rechazada'}.`,
        tipo: 'reserva'
      });
      // Notificación para el admin
      await crearYEmitirNotificacion(req.io, {
        parqueadero_id: reserva.parqueadero_id || null,
        titulo: `Has ${estado === 'Aprobada' ? 'aprobado' : 'rechazado'} una reserva`,
        mensaje: `Has ${estado === 'Aprobada' ? 'aprobado' : 'rechazado'} una reserva para el parqueadero.`,
        tipo: 'reserva'
      });
    }
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar cupos disponibles
router.get('/cupos', async (req, res) => {
  try {
    const { parqueadero_id, fecha_inicio, fecha_fin, max_cupos } = req.query;
    const cupos = await reservasQueries.cuposDisponibles(parqueadero_id, fecha_inicio, fecha_fin, max_cupos);
    res.json({ cupos_disponibles: cupos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar múltiples reservas
router.delete('/batch', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de IDs.' });
    }
    const result = await reservasQueries.inhabilitarMultiplesReservas(ids);
    res.json({ success: true, inhabilitadas: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inhabilitar una sola reserva para el admin
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await reservasQueries.inhabilitarMultiplesReservas([id]);
    res.json({ success: true, inhabilitada: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 