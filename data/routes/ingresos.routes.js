const express = require('express');
const router = express.Router();
const ingresosQueries = require('../queries/ingresos.queries');

// Registrar ingreso
router.post('/', async (req, res) => {
  try {
    const { vehiculo_id, observaciones } = req.body;
    const ingreso = await ingresosQueries.registrarIngreso(vehiculo_id, observaciones);
    res.status(201).json(ingreso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar salida
router.put('/:id/salida', async (req, res) => {
  try {
    const { id } = req.params;
    const { valor_pagado } = req.body;
    const salida = await ingresosQueries.registrarSalida(id, valor_pagado);
    res.json(salida);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar ingresos actuales
router.get('/actuales', async (req, res) => {
  try {
    const ingresos = await ingresosQueries.listarIngresosActuales();
    res.json(ingresos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar historial de ingresos
router.get('/historial', async (req, res) => {
  try {
    const historial = await ingresosQueries.listarHistorial();
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 