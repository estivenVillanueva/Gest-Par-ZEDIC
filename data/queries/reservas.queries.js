import { pool } from '../postgres.js';

// Crear una nueva reserva
async function crearReserva({ usuario_id, parqueadero_id, vehiculo_id, tipo_vehiculo, fecha_inicio, fecha_fin, estado, observaciones }) {
  const estadoFinal = estado || 'Pendiente';
  const result = await pool.query(
    `INSERT INTO reservas (usuario_id, parqueadero_id, vehiculo_id, tipo_vehiculo, fecha_inicio, fecha_fin, estado, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [usuario_id, parqueadero_id, vehiculo_id, tipo_vehiculo, fecha_inicio, fecha_fin, estadoFinal, observaciones]
  );
  return result.rows[0];
}

// Listar todas las reservas (opcional: por parqueadero o usuario)
async function listarReservas({ parqueadero_id, usuario_id } = {}) {
  let query = `SELECT r.*, p.nombre AS parqueadero_nombre, v.placa AS vehiculo_placa, u.nombre AS nombre_usuario
               FROM reservas r
               LEFT JOIN parqueaderos p ON r.parqueadero_id = p.id
               LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
               LEFT JOIN usuarios u ON r.usuario_id = u.id`;
  let values = [];
  if (parqueadero_id) {
    query += ' WHERE r.parqueadero_id = $1 AND r.visible_admin = TRUE';
    values.push(parqueadero_id);
  } else if (usuario_id) {
    query += ' WHERE r.usuario_id = $1';
    values.push(usuario_id);
  }
  query += ' ORDER BY r.created_at DESC';
  const result = await pool.query(query, values);
  return result.rows;
}

// Cambiar estado de reserva
async function cambiarEstadoReserva(id, estado) {
  const result = await pool.query(
    `UPDATE reservas SET estado = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, estado]
  );
  return result.rows[0];
}

// Verificar disponibilidad de cupos (ejemplo: contar reservas aceptadas para un parqueadero en una fecha)
async function cuposDisponibles(parqueadero_id, fecha_inicio, fecha_fin, max_cupos) {
  const result = await pool.query(
    `SELECT COUNT(*) FROM reservas WHERE parqueadero_id = $1 AND estado = 'Aprobada' AND ((fecha_inicio, fecha_fin) OVERLAPS ($2, $3))`,
    [parqueadero_id, fecha_inicio, fecha_fin]
  );
  return max_cupos - parseInt(result.rows[0].count, 10);
}

// Eliminar múltiples reservas por IDs
async function eliminarMultiplesReservas(ids) {
  const result = await pool.query(
    `DELETE FROM reservas WHERE id = ANY($1::int[]) RETURNING id`,
    [ids]
  );
  return result.rows.map(r => r.id);
}

// Inhabilitar múltiples reservas para el admin (visible_admin = FALSE)
async function inhabilitarMultiplesReservas(ids) {
  const result = await pool.query(
    `UPDATE reservas SET visible_admin = FALSE WHERE id = ANY($1::int[]) RETURNING id`,
    [ids]
  );
  return result.rows.map(r => r.id);
}

export default {
  crearReserva,
  listarReservas,
  cambiarEstadoReserva,
  cuposDisponibles,
  eliminarMultiplesReservas,
  inhabilitarMultiplesReservas
}; 