import express from 'express';
import { 
  registrarIngreso, 
  registrarSalida, 
  listarIngresosActuales, 
  listarHistorial, 
  getIngresoConServicio,
  listarIngresosActualesPorParqueadero,
  listarHistorialPorParqueadero,
  eliminarIngreso,
  getReporteIngresos,
  getReporteOcupacion
} from '../queries/ingresos.queries.js';
import { serviciosQueries } from '../queries/servicios.queries.js';
import { vehiculoQueries } from '../queries/vehiculo.queries.js';
import exceljs from 'exceljs';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Registrar ingreso
router.post('/', async (req, res) => {
  try {
    const { vehiculo_id, observaciones } = req.body;

    // Obtener el vehículo y su parqueadero
    const vehiculo = await vehiculoQueries.getVehiculoById(vehiculo_id);
    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    // Buscar el servicio correcto del parqueadero actual según la duración
    const servicios = await serviciosQueries.getServiciosByParqueadero(vehiculo.parqueadero_id);
    let servicioCorrecto = null;
    if (vehiculo.servicio_id) {
      // Buscar el servicio del vehículo
      const servicioVehiculo = servicios.find(s => s.id === vehiculo.servicio_id);
      if (servicioVehiculo) {
        // Si el servicio del vehículo es de tipo_cobro 'periodo', NO cambiarlo
        if ((servicioVehiculo.tipo_cobro || '').toLowerCase() === 'periodo') {
          servicioCorrecto = servicioVehiculo;
        } else if ((servicioVehiculo.duracion || '').toLowerCase() === 'minuto') {
          servicioCorrecto = servicios.find(s => (s.duracion || '').toLowerCase() === 'minuto');
        } else if ((servicioVehiculo.duracion || '').toLowerCase() === 'hora') {
          servicioCorrecto = servicios.find(s => (s.duracion || '').toLowerCase() === 'hora');
        } else if ((servicioVehiculo.duracion || '').toLowerCase() === 'día' || (servicioVehiculo.duracion || '').toLowerCase() === 'dia') {
          servicioCorrecto = servicios.find(s => ['día','dia'].includes((s.duracion || '').toLowerCase()));
        }
      }
    }
    // Si no se encontró por el tipo del vehículo, buscar por prioridad: minuto, hora, día
    if (!servicioCorrecto) {
      servicioCorrecto = servicios.find(s => (s.duracion || '').toLowerCase() === 'minuto')
        || servicios.find(s => (s.duracion || '').toLowerCase() === 'hora')
        || servicios.find(s => ['día','dia'].includes((s.duracion || '').toLowerCase()));
    }
    // Solo actualizar el servicio_id si el servicio actual NO es de tipo_cobro 'periodo' y el nuevo es diferente
    if (servicioCorrecto && vehiculo.servicio_id !== servicioCorrecto.id && (servicioCorrecto.tipo_cobro || '').toLowerCase() !== 'periodo') {
      await vehiculoQueries.updateVehiculo(vehiculo.placa, { ...vehiculo, servicio_id: servicioCorrecto.id });
    }

    // Registrar el ingreso normalmente
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

// Endpoint profesional para reportes de ingresos
router.get('/reporte', async (req, res) => {
  try {
    const { parqueadero_id, fecha_inicio, fecha_fin, tipo_servicio, estado_pago, page = 1, limit = 50, exportar } = req.query;
    const result = await getReporteIngresos({ parqueadero_id, fecha_inicio, fecha_fin, tipo_servicio, estado_pago, page, limit, exportar });
    if (exportar === 'excel') {
      // Aquí podrías generar y devolver un archivo Excel
      // Por ahora, solo devolvemos los datos
      return res.json({ success: true, export: 'excel', data: result });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al generar el reporte de ingresos', error: error.message });
  }
});

// Exportar a Excel
router.get('/reporte/export/excel', async (req, res) => {
  try {
    const params = req.query;
    const reporte = await getReporteIngresos(params);
    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet('Ingresos');
    sheet.columns = [
      { header: 'Fecha entrada', key: 'hora_entrada', width: 22 },
      { header: 'Fecha salida', key: 'hora_salida', width: 22 },
      { header: 'Placa', key: 'placa', width: 12 },
      { header: 'Tipo', key: 'tipo', width: 10 },
      { header: 'Servicio', key: 'tipo_servicio', width: 14 },
      { header: 'Estado pago', key: 'estado_pago', width: 14 },
      { header: 'Valor pagado', key: 'valor_pagado', width: 16 },
    ];
    reporte.detalles.forEach(row => sheet.addRow(row));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte-ingresos.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al exportar a Excel', error: error.message });
  }
});

// Exportar a PDF
router.get('/reporte/export/pdf', async (req, res) => {
  try {
    const params = req.query;
    const reporte = await getReporteIngresos(params);
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte-ingresos.pdf"');
    doc.pipe(res);
    doc.fontSize(18).text('Reporte de Ingresos', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    // Tabla
    const headers = ['Fecha entrada', 'Fecha salida', 'Placa', 'Tipo', 'Servicio', 'Estado pago', 'Valor pagado'];
    doc.text(headers.join(' | '));
    doc.moveDown(0.5);
    reporte.detalles.forEach(row => {
      doc.text([
        row.hora_entrada ? new Date(row.hora_entrada).toLocaleString() : '',
        row.hora_salida ? new Date(row.hora_salida).toLocaleString() : '',
        row.placa,
        row.tipo,
        row.tipo_servicio,
        row.estado_pago,
        row.valor_pagado ? row.valor_pagado.toLocaleString('es-CO') : ''
      ].join(' | '));
    });
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al exportar a PDF', error: error.message });
  }
});

// Endpoint profesional para reporte de ocupación
router.get('/ocupacion/reporte', async (req, res) => {
  try {
    const { parqueadero_id, fecha_inicio, fecha_fin } = req.query;
    const result = await getReporteOcupacion({ parqueadero_id, fecha_inicio, fecha_fin });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al generar el reporte de ocupación', error: error.message });
  }
});

// Exportar reporte de ocupación a Excel
router.get('/ocupacion/reporte/export/excel', async (req, res) => {
  try {
    const params = req.query;
    const reporte = await getReporteOcupacion(params);
    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet('Ocupacion');
    sheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 14 },
      { header: 'Ocupados', key: 'ocupados', width: 12 },
      { header: 'Capacidad', key: 'capacidad', width: 12 },
      { header: '% Ocupación', key: 'porcentaje', width: 14 },
    ];
    reporte.data.forEach(row => sheet.addRow(row));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte-ocupacion.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al exportar a Excel', error: error.message });
  }
});

// Exportar reporte de ocupación a PDF
router.get('/ocupacion/reporte/export/pdf', async (req, res) => {
  try {
    const params = req.query;
    const reporte = await getReporteOcupacion(params);
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte-ocupacion.pdf"');
    doc.pipe(res);
    doc.fontSize(18).text('Reporte de Ocupación', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    // Tabla
    const headers = ['Fecha', 'Ocupados', 'Capacidad', '% Ocupación'];
    doc.text(headers.join(' | '));
    doc.moveDown(0.5);
    reporte.data.forEach(row => {
      doc.text([
        row.fecha,
        row.ocupados,
        row.capacidad,
        `${row.porcentaje}%`
      ].join(' | '));
    });
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al exportar a PDF', error: error.message });
  }
});

export default router; 