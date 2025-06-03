import { pool } from '../postgres.js';

export const serviciosQueries = {
    // Crear un nuevo servicio
    async createServicio({ nombre, precio, tipo, parqueadero_id }) {
        const query = `
            INSERT INTO servicios (nombre, precio, tipo, parqueadero_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [nombre, precio, tipo, parqueadero_id];
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
        const query = 'SELECT * FROM servicios WHERE id_parqueadero = $1';
        const result = await pool.query(query, [idParqueadero]);
        return result.rows;
    },

    // Actualizar servicio
    async updateServicio(id, { nombre, precio, tipo, idParqueadero }) {
        const query = `
            UPDATE servicios
            SET nombre = $1,
                precio = $2,
                tipo = $3,
                id_parqueadero = $4
            WHERE id = $5
            RETURNING *
        `;
        const values = [nombre, precio, tipo, idParqueadero, id];
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