import { pool } from '../postgres.js';

export const notificacionesQueries = {
  // Crear una notificación
  async crearNotificacion({ usuario_id, parqueadero_id, titulo, mensaje, tipo }) {
    const query = `
      INSERT INTO notificaciones (usuario_id, parqueadero_id, titulo, mensaje, tipo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [usuario_id, parqueadero_id, titulo, mensaje, tipo];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Listar notificaciones por usuario
  async listarPorUsuario(usuario_id) {
    const query = `
      SELECT * FROM notificaciones
      WHERE usuario_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `;
    const result = await pool.query(query, [usuario_id]);
    return result.rows;
  },

  // Listar notificaciones por parqueadero
  async listarPorParqueadero(parqueadero_id) {
    const query = `
      SELECT * FROM notificaciones
      WHERE parqueadero_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `;
    const result = await pool.query(query, [parqueadero_id]);
    return result.rows;
  },

  // Marcar notificación como leída
  async marcarLeida(id) {
    const query = `
      UPDATE notificaciones SET leida = TRUE WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Marcar todas las notificaciones como leídas para un usuario
  async marcarTodasLeidas(usuario_id) {
    const query = `
      UPDATE notificaciones SET leida = TRUE WHERE usuario_id = $1 RETURNING *
    `;
    const result = await pool.query(query, [usuario_id]);
    return result.rows;
  },

  // Marcar todas las notificaciones de un parqueadero como leídas
  async marcarTodasLeidasParqueadero(parqueadero_id) {
    const query = 'UPDATE notificaciones SET leida = TRUE WHERE parqueadero_id = $1 RETURNING *';
    const result = await pool.query(query, [parqueadero_id]);
    return result.rows;
  },

  // Eliminar notificación por id
  async eliminarNotificacion(id) {
    const query = `DELETE FROM notificaciones WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

// Función para crear y emitir notificación en tiempo real
export async function crearYEmitirNotificacion(io, notificacion) {
  const nueva = await notificacionesQueries.crearNotificacion(notificacion);
  io.emit('nueva_notificacion', nueva);
  return nueva;
} 