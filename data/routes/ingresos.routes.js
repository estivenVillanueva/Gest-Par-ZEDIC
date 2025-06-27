import express from 'express';
import { 
  registrarIngreso, 
  registrarSalida, 
  listarIngresosActuales, 
  listarHistorial, 
  getIngresoConServicio,
  listarIngresosActualesPorParqueadero,
  listarHistorialPorParqueadero,
  eliminarIngreso
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
        // Calcular el valor automáticamente si no se envía valor_pagado
        let valorFinal = valor_pagado;
        if (valor_pagado === undefined || valor_pagado === null) {
          // Calcular diferencia de tiempo
          const entrada = new Date(ingresoInfo.hora_entrada);
          const salida = new Date();
          let diffMs = salida - entrada;
          let diffMin = Math.floor(diffMs / 60000);
          let diffHoras = Math.floor(diffMin / 60);
          let diffDias = Math.floor(diffHoras / 24);
          let minutosRestantes = diffMin % 60;
          let horasRestantes = diffHoras % 24;
          // Tomar tarifas del servicio
          const tarifaMin = Number(ingresoInfo.precio_minuto) || 0;
          const tarifaHora = Number(ingresoInfo.precio_hora) || 0;
          const tarifaDia = Number(ingresoInfo.precio_dia) || 0;
          valorFinal = (diffDias * tarifaDia) + (horasRestantes * tarifaHora) + (minutosRestantes * tarifaMin);
        }
        if (typeof valorFinal !== 'number' || valorFinal < 0) {
            return res.status(400).json({ error: 'El valor pagado no puede ser negativo.' });
        }
        const salida = await registrarSalida(id, valorFinal);
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
    const { parqueadero_id } = req.query;
    let ingresos;
    if (parqueadero_id) {
      ingresos = await listarIngresosActualesPorParqueadero(parqueadero_id);
    } else {
      ingresos = await listarIngresosActuales();
    }
    res.json(ingresos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar historial de ingresos
router.get('/historial', async (req, res) => {
  try {
    const { parqueadero_id } = req.query;
    let historial;
    if (parqueadero_id) {
      historial = await listarHistorialPorParqueadero(parqueadero_id);
    } else {
      historial = await listarHistorial();
    }
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

// Eliminar un ingreso por id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await eliminarIngreso(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Ingreso no encontrado' });
    }
    res.json({ success: true, data: eliminado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 