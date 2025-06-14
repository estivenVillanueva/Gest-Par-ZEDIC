import { pool } from '../postgres.js';

export const serviciosQueries = {
    // Crear un nuevo servicio
    async createServicio({ nombre, descripcion, precio, duracion, estado, parqueadero_id }) {
        const query = `
            INSERT INTO servicios (nombre, descripcion, precio, duracion, estado, parqueadero_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [nombre, descripcion, precio, duracion, estado, parqueadero_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener servicio por ID
    async getServicioById(id) {
        const query = 'SELECT * FROM servicios WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Obtener servicios por parqueadero
    async getServiciosByParqueadero(idParqueadero) {
        const query = 'SELECT * FROM servicios WHERE parqueadero_id = $1';
        const result = await pool.query(query, [idParqueadero]);
        return result.rows;
    },

    // Actualizar servicio
    async updateServicio(id, { nombre, descripcion, precio, duracion, estado, parqueadero_id }) {
        const query = `
            UPDATE servicios
            SET nombre = $1,
                descripcion = $2,
                precio = $3,
                duracion = $4,
                estado = $5,
                parqueadero_id = $6
            WHERE id = $7
            RETURNING *
        `;
        const values = [nombre, descripcion, precio, duracion, estado, parqueadero_id, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Eliminar servicio
    async deleteServicio(id) {
        const query = 'DELETE FROM servicios WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}; 