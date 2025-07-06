import { pool } from '../postgres.js';
import { parqueaderoQueries } from './parqueadero.queries.js';

// Registrar ingreso
async function registrarIngreso(vehiculo_id, observaciones = null) {
  const result = await pool.query(
    `INSERT INTO ingresos (vehiculo_id, observaciones) VALUES ($1, $2) RETURNING *`,
    [vehiculo_id, observaciones]
  );
  return result.rows[0];
}

// Registrar salida
async function registrarSalida(id, valor_pagado) {
  const result = await pool.query(
    `UPDATE ingresos SET hora_salida = NOW(), valor_pagado = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, valor_pagado]
  );
  return result.rows[0];
}

// Listar ingresos actuales (vehículos dentro)
async function listarIngresosActuales() {
  const result = await pool.query(
    `SELECT * FROM ingresos WHERE hora_salida IS NULL`
  );
  return result.rows;
}

// Listar historial de ingresos
async function listarHistorial() {
  const result = await pool.query(
    `SELECT * FROM ingresos ORDER BY hora_entrada DESC`
  );
  return result.rows;
}

// Obtener un ingreso con la información del servicio del vehículo
async function getIngresoConServicio(id) {
  const result = await pool.query(
    `SELECT
        i.id AS ingreso_id,
        i.hora_entrada,
        v.id AS vehiculo_id,
        s.tipo_cobro,
        s.precio,
        s.nombre AS servicio_nombre,
        s.precio_minuto,
        s.precio_hora,
        s.precio_dia
     FROM ingresos i
     JOIN vehiculos v ON i.vehiculo_id = v.id
     LEFT JOIN servicios s ON v.servicio_id = s.id
     WHERE i.id = $1`,
    [id]
  );
  return result.rows[0];
}

// Listar ingresos actuales (vehículos dentro) filtrando por parqueadero_id
async function listarIngresosActualesPorParqueadero(parqueadero_id) {
  const result = await pool.query(
    `SELECT i.*, v.placa FROM ingresos i
     JOIN vehiculos v ON i.vehiculo_id = v.id
     WHERE i.hora_salida IS NULL AND v.parqueadero_id = $1`,
    [parqueadero_id]
  );
  return result.rows;
}

// Listar historial de ingresos filtrando por parqueadero_id
async function listarHistorialPorParqueadero(parqueadero_id) {
  const result = await pool.query(
    `SELECT i.*, v.placa FROM ingresos i
     JOIN vehiculos v ON i.vehiculo_id = v.id
     WHERE v.parqueadero_id = $1
     ORDER BY i.hora_entrada DESC`,
    [parqueadero_id]
  );
  return result.rows;
}

// Eliminar un ingreso por id
async function eliminarIngreso(id) {
  const result = await pool.query('DELETE FROM ingresos WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

// Reporte profesional de ingresos con filtros avanzados
async function getReporteIngresos({ parqueadero_id, fecha_inicio, fecha_fin, tipo_servicio, estado_pago, page = 1, limit = 50 }) {
  let filtros = [];
  let valores = [];
  let idx = 1;

  if (parqueadero_id) {
    filtros.push(`v.parqueadero_id = $${idx++}`);
    valores.push(parqueadero_id);
  }
  if (fecha_inicio) {
    filtros.push(`i.hora_entrada >= $${idx++}`);
    valores.push(fecha_inicio);
  }
  if (fecha_fin) {
    filtros.push(`i.hora_entrada <= $${idx++}`);
    valores.push(fecha_fin);
  }
  if (tipo_servicio) {
    filtros.push(`LOWER(s.duracion) LIKE $${idx++}`);
    valores.push(`%${tipo_servicio.toLowerCase()}%`);
  }
  if (estado_pago) {
    // Eliminar filtro por estado_pago porque no hay relación con facturas
    // filtros.push(`LOWER(f.estado) = $${idx++}`);
    // valores.push(estado_pago.toLowerCase());
  }

  const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Detalles
  const detallesQuery = `
    SELECT i.id, i.hora_entrada, i.hora_salida, i.valor_pagado, v.placa, v.tipo, s.duracion AS tipo_servicio
    FROM ingresos i
    JOIN vehiculos v ON i.vehiculo_id = v.id
    LEFT JOIN servicios s ON v.servicio_id = s.id
    ${where}
    ORDER BY i.hora_entrada DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  const detalles = await pool.query(detallesQuery, [...valores, limit, offset]);

  // Total general
  const totalQuery = `
    SELECT COALESCE(SUM(i.valor_pagado),0) AS total
    FROM ingresos i
    JOIN vehiculos v ON i.vehiculo_id = v.id
    LEFT JOIN servicios s ON v.servicio_id = s.id
    ${where}
  `;
  const total = await pool.query(totalQuery, valores);

  // Agrupado por día
  const porDiaQuery = `
    SELECT TO_CHAR(i.hora_entrada, 'YYYY-MM-DD') AS fecha, COALESCE(SUM(i.valor_pagado),0) AS total
    FROM ingresos i
    JOIN vehiculos v ON i.vehiculo_id = v.id
    LEFT JOIN servicios s ON v.servicio_id = s.id
    ${where}
    GROUP BY fecha
    ORDER BY fecha DESC
    LIMIT 31
  `;
  const porDia = await pool.query(porDiaQuery, valores);

  // Agrupado por tipo de servicio
  const porServicioQuery = `
    SELECT COALESCE(s.duracion, 'Otro') AS tipo_servicio, COALESCE(SUM(i.valor_pagado),0) AS total
    FROM ingresos i
    JOIN vehiculos v ON i.vehiculo_id = v.id
    LEFT JOIN servicios s ON v.servicio_id = s.id
    ${where}
    GROUP BY tipo_servicio
    ORDER BY total DESC
  `;
  const porServicio = await pool.query(porServicioQuery, valores);

  return {
    total: total.rows[0]?.total || 0,
    por_dia: porDia.rows,
    por_servicio: porServicio.rows,
    detalles: detalles.rows
  };
}

// Reporte profesional de ocupación
async function getReporteOcupacion({ parqueadero_id, fecha_inicio, fecha_fin }) {
  if (!parqueadero_id) throw new Error('parqueadero_id es requerido');
  // Obtener capacidad
  const parqueadero = await parqueaderoQueries.getParqueaderoById(parqueadero_id);
  const capacidad = parqueadero?.capacidad || 0;
  if (!capacidad) throw new Error('No se encontró la capacidad del parqueadero');

  // Obtener ingresos (entradas y salidas) en el rango de fechas
  let filtros = ['v.parqueadero_id = $1'];
  let valores = [parqueadero_id];
  let idx = 2;
  if (fecha_inicio) {
    filtros.push('i.hora_entrada >= $' + idx);
    valores.push(fecha_inicio);
    idx++;
  }
  if (fecha_fin) {
    filtros.push('i.hora_entrada <= $' + idx);
    valores.push(fecha_fin);
    idx++;
  }
  const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

  // Obtener ocupación diaria: para cada día, contar cuántos vehículos estaban dentro
  const query = `
    SELECT d.fecha,
      (
        SELECT COUNT(*) FROM ingresos i2
        JOIN vehiculos v2 ON i2.vehiculo_id = v2.id
        WHERE v2.parqueadero_id = $1
          AND i2.hora_entrada <= d.fecha::date + interval '1 day' - interval '1 second'
          AND (i2.hora_salida IS NULL OR i2.hora_salida > d.fecha::date)
      ) AS ocupados
    FROM (
      SELECT generate_series(
        COALESCE($2::date, CURRENT_DATE - INTERVAL '6 days'),
        COALESCE($3::date, CURRENT_DATE),
        INTERVAL '1 day'
      ) AS fecha
    ) d
    ORDER BY d.fecha
  `;
  const fechas = [parqueadero_id, fecha_inicio, fecha_fin];
  const result = await pool.query(query, fechas);
  // Calcular porcentaje de ocupación
  const data = result.rows.map(r => ({
    fecha: r.fecha.toISOString().slice(0, 10),
    ocupados: Number(r.ocupados),
    capacidad,
    porcentaje: Math.round((Number(r.ocupados) / capacidad) * 100)
  }));
  return { capacidad, data };
}

export {
  registrarIngreso,
  registrarSalida,
  listarIngresosActuales,
  listarHistorial,
  getIngresoConServicio,
  listarIngresosActualesPorParqueadero,
  listarHistorialPorParqueadero,
  eliminarIngreso,
  getReporteIngresos,
  getReporteOcupacion,
}; 