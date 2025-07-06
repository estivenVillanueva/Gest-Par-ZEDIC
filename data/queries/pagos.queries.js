import { pool } from '../postgres.js';

async function getPagosPendientes(parqueaderoId) {
  const result = await pool.query(
    `SELECT
        f.id,
        f.total,
        f.estado,
        f.fecha_creacion,
        f.fecha_vencimiento,
        COALESCE(u.nombre, v.dueno_nombre) AS usuario_nombre,
        v.placa,
        s.nombre AS servicio_nombre
     FROM facturas f
     LEFT JOIN usuarios u ON f.usuario_id = u.id
     JOIN vehiculos v ON f.vehiculo_id = v.id
     JOIN servicios s ON v.servicio_id = s.id
     WHERE f.parqueadero_id = $1 AND f.estado IN ('pendiente', 'vencida')
     ORDER BY f.fecha_vencimiento ASC`,
    [parqueaderoId]
  );
  return result.rows;
}

async function getHistorialPagos(parqueaderoId) {
  const result = await pool.query(
    `SELECT
        f.id,
        f.total,
        f.estado,
        f.fecha_pago,
        f.metodo_pago,
        COALESCE(u.nombre, v.dueno_nombre) AS usuario_nombre,
        v.placa,
        s.nombre AS servicio_nombre
     FROM facturas f
     LEFT JOIN usuarios u ON f.usuario_id = u.id
     JOIN vehiculos v ON f.vehiculo_id = v.id
     JOIN servicios s ON v.servicio_id = s.id
     WHERE f.parqueadero_id = $1 AND f.estado = 'pagada'
     ORDER BY f.fecha_pago DESC`,
    [parqueaderoId]
  );
  return result.rows;
}

async function marcarComoPagada(facturaId, metodoPago) {
    const result = await pool.query(
      `UPDATE facturas
       SET estado = 'pagada',
           fecha_pago = NOW(),
           metodo_pago = $2,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [facturaId, metodoPago]
    );
    return result.rows[0];
}

// Reporte profesional de pagos pendientes y vencidos
async function getReportePagosPendientes({ parqueadero_id, fecha_inicio, fecha_fin, usuario_nombre, estado, page = 1, limit = 50 }) {
  let filtros = ['f.parqueadero_id = $1'];
  let valores = [parqueadero_id];
  let idx = 2;
  if (fecha_inicio) {
    filtros.push('f.fecha_vencimiento >= $' + idx);
    valores.push(fecha_inicio);
    idx++;
  }
  if (fecha_fin) {
    filtros.push('f.fecha_vencimiento <= $' + idx);
    valores.push(fecha_fin);
    idx++;
  }
  if (usuario_nombre) {
    filtros.push('LOWER(COALESCE(u.nombre, v.dueno_nombre)) LIKE $' + idx);
    valores.push(`%${usuario_nombre.toLowerCase()}%`);
    idx++;
  }
  if (estado) {
    filtros.push('LOWER(f.estado) = $' + idx);
    valores.push(estado.toLowerCase());
    idx++;
  } else {
    filtros.push(`f.estado IN ('pendiente', 'vencida')`);
  }
  const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Detalles
  const detallesQuery = `
    SELECT f.id, f.total, f.estado, f.fecha_creacion, f.fecha_vencimiento, COALESCE(u.nombre, v.dueno_nombre) AS usuario_nombre, v.placa, s.nombre AS servicio_nombre
    FROM facturas f
    LEFT JOIN usuarios u ON f.usuario_id = u.id
    JOIN vehiculos v ON f.vehiculo_id = v.id
    JOIN servicios s ON v.servicio_id = s.id
    ${where}
    ORDER BY f.fecha_vencimiento ASC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  const detalles = await pool.query(detallesQuery, [...valores, limit, offset]);

  // Total general
  const totalQuery = `
    SELECT COALESCE(SUM(f.total),0) AS total
    FROM facturas f
    LEFT JOIN usuarios u ON f.usuario_id = u.id
    JOIN vehiculos v ON f.vehiculo_id = v.id
    JOIN servicios s ON v.servicio_id = s.id
    ${where}
  `;
  const total = await pool.query(totalQuery, valores);

  // Agrupado por estado
  const porEstadoQuery = `
    SELECT f.estado, COUNT(*) AS cantidad, COALESCE(SUM(f.total),0) AS total
    FROM facturas f
    LEFT JOIN usuarios u ON f.usuario_id = u.id
    JOIN vehiculos v ON f.vehiculo_id = v.id
    JOIN servicios s ON v.servicio_id = s.id
    ${where}
    GROUP BY f.estado
    ORDER BY f.estado
  `;
  const porEstado = await pool.query(porEstadoQuery, valores);

  // Agrupado por usuario
  const porUsuarioQuery = `
    SELECT COALESCE(u.nombre, v.dueno_nombre) AS usuario_nombre, COUNT(*) AS cantidad, COALESCE(SUM(f.total),0) AS total
    FROM facturas f
    LEFT JOIN usuarios u ON f.usuario_id = u.id
    JOIN vehiculos v ON f.vehiculo_id = v.id
    JOIN servicios s ON v.servicio_id = s.id
    ${where}
    GROUP BY usuario_nombre
    ORDER BY total DESC
    LIMIT 10
  `;
  const porUsuario = await pool.query(porUsuarioQuery, valores);

  return {
    total: total.rows[0]?.total || 0,
    por_estado: porEstado.rows,
    por_usuario: porUsuario.rows,
    detalles: detalles.rows
  };
}

export {
    getPagosPendientes,
    getHistorialPagos,
    marcarComoPagada,
    getReportePagosPendientes
}; 