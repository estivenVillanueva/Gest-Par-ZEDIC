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

export {
    getPagosPendientes,
    getHistorialPagos,
    marcarComoPagada
}; 