import express from 'express';
import { 
  registrarIngreso, 
  registrarSalida, 
  listarIngresosActuales, 
  listarHistorial, 
  getIngresoConServicio 
} from '../queries/ingresos.queries.js';

const router = express.Router();

// Registrar ingreso
router.post('/', async (req, res) => {
  try {
    const { vehiculo_id, observaciones } = req.body;
    const ingreso = await registrarIngreso(vehiculo_id, observaciones);
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

    const ingresoInfo = await getIngresoConServicio(id);

    if (!ingresoInfo) {
      return res.status(404).json({ error: 'Registro de ingreso no encontrado' });
    }

    // Si no tiene servicio o es por uso, requiere pago
    if (!ingresoInfo.tipo_cobro || ingresoInfo.tipo_cobro === 'uso') {
        if (valor_pagado === undefined || valor_pagado === null) {
            return res.status(400).json({ error: 'Se requiere el valor pagado para este tipo de servicio.' });
        }
        const salida = await registrarSalida(id, valor_pagado);
        res.json(salida);
    } else { // tipo_cobro === 'periodo'
        const salida = await registrarSalida(id, 0);
        res.json(salida);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar ingresos actuales
router.get('/actuales', async (req, res) => {
  try {
    const ingresos = await listarIngresosActuales();
    res.json(ingresos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar historial de ingresos
router.get('/historial', async (req, res) => {
  try {
    const historial = await listarHistorial();
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un ingreso con la información del servicio del vehículo
router.get('/con-servicio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ingresoInfo = await getIngresoConServicio(id);
    if (!ingresoInfo) {
      return res.status(404).json({ error: 'Registro de ingreso no encontrado' });
    }
    res.json(ingresoInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 