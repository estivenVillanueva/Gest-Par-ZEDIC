import db from '../postgres.js';

// Crear una nueva reserva
async function crearReserva({ usuario_id, parqueadero_id, vehiculo_id, fecha_inicio, fecha_fin, estado }) {
  const result = await db.query(
    `INSERT INTO reservas (usuario_id, parqueadero_id, vehiculo_id, fecha_inicio, fecha_fin, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [usuario_id, parqueadero_id, vehiculo_id, fecha_inicio, fecha_fin, estado]
  );
  return result.rows[0];
}

// Listar todas las reservas (opcional: por parqueadero o usuario)
async function listarReservas({ parqueadero_id, usuario_id } = {}) {
  let query = 'SELECT * FROM reservas';
  let values = [];
  if (parqueadero_id) {
    query += ' WHERE parqueadero_id = $1';
    values.push(parqueadero_id);
  } else if (usuario_id) {
    query += ' WHERE usuario_id = $1';
    values.push(usuario_id);
  }
  query += ' ORDER BY created_at DESC';
  const result = await db.query(query, values);
  return result.rows;
}

// Cambiar estado de reserva
async function cambiarEstadoReserva(id, estado) {
  const result = await db.query(
    `UPDATE reservas SET estado = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, estado]
  );
  return result.rows[0];
}

// Verificar disponibilidad de cupos (ejemplo: contar reservas aceptadas para un parqueadero en una fecha)
async function cuposDisponibles(parqueadero_id, fecha_inicio, fecha_fin, max_cupos) {
  const result = await db.query(
    `SELECT COUNT(*) FROM reservas WHERE parqueadero_id = $1 AND estado = 'Aprobada' AND ((fecha_inicio, fecha_fin) OVERLAPS ($2, $3))`,
    [parqueadero_id, fecha_inicio, fecha_fin]
  );
  return max_cupos - parseInt(result.rows[0].count, 10);
}

export default {
  crearReserva,
  listarReservas,
  cambiarEstadoReserva,
  cuposDisponibles
}; 