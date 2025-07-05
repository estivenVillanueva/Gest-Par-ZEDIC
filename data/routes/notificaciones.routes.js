import express from 'express';
import { notificacionesQueries } from '../queries/notificaciones.queries.js';

const router = express.Router();

// Eliminar todas las notificaciones de un usuario
router.delete('/usuario/:usuario_id', async (req, res) => {
  try {
    const usuario_id = req.params.usuario_id;
    const eliminadas = await notificacionesQueries.eliminarTodasPorUsuario(usuario_id);
    res.json({ success: true, eliminadas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar notificaciones', error: error.message });
  }
});

export default router; 