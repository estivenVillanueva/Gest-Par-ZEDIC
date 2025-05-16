import { pool } from '../postgres.js';

export const parqueaderoQueries = {
    // Crear un nuevo parqueadero
    async createParqueadero({ nombreParqueadero, direccion, cupos, numerosPuestos, logo, telefono }) {
        const query = `
            INSERT INTO parqueadero (nombre_parqueadero, direccion, cupos, numeros_puestos, logo, telefono)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [nombreParqueadero, direccion, cupos, numerosPuestos, logo, telefono];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener un parqueadero por ID
    async getParqueaderoById(id) {
        const query = 'SELECT * FROM parqueadero WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Obtener todos los parqueaderos
    async getAllParqueaderos() {
        const query = 'SELECT * FROM parqueadero';
        const result = await pool.query(query);
        return result.rows;
    },

    // Actualizar un parqueadero
    async updateParqueadero(id, { nombreParqueadero, direccion, cupos, numerosPuestos, logo, telefono }) {
        const query = `
            UPDATE parqueadero
            SET nombre_parqueadero = $1,
                direccion = $2,
                cupos = $3,
                numeros_puestos = $4,
                logo = $5,
                telefono = $6
            WHERE id = $7
            RETURNING *
        `;
        const values = [nombreParqueadero, direccion, cupos, numerosPuestos, logo, telefono, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Eliminar un parqueadero
    async deleteParqueadero(id) {
        const query = 'DELETE FROM parqueadero WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}; 