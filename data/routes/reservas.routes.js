const express = require('express');
const router = express.Router();
const reservasQueries = require('../queries/reservas.queries');

// Crear reserva
router.post('/', async (req, res) => {
  try {
    const reserva = await reservasQueries.crearReserva(req.body);
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
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cambiar estado de reserva
router.put('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    const reserva = await reservasQueries.cambiarEstadoReserva(req.params.id, estado);
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

module.exports = router; 