import { pool } from '../postgres.js';

export const parqueaderoQueries = {
    // Crear un nuevo parqueadero
    async createParqueadero({ nombre, ubicacion, capacidad, precio_hora, estado, telefono, email, direccion, horarios, descripcion }) {
        const query = `
            INSERT INTO parqueaderos (nombre, ubicacion, capacidad, precio_hora, estado, telefono, email, direccion, horarios, descripcion)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const values = [nombre, ubicacion, capacidad, precio_hora, estado, telefono, email, direccion, horarios, descripcion];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener un parqueadero por ID
    async getParqueaderoById(id) {
        const query = 'SELECT * FROM parqueaderos WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Obtener todos los parqueaderos
    async getAllParqueaderos() {
        const query = 'SELECT * FROM parqueaderos';
        const result = await pool.query(query);
        return result.rows;
    },

    // Actualizar un parqueadero
    async updateParqueadero(id, { nombre, ubicacion, capacidad, precio_hora, estado, telefono, email, direccion, horarios, descripcion }) {
        const query = `
            UPDATE parqueaderos
            SET nombre = $1,
                ubicacion = $2,
                capacidad = $3,
                precio_hora = $4,
                estado = $5,
                telefono = $6,
                email = $7,
                direccion = $8,
                horarios = $9,
                descripcion = $10
            WHERE id = $11
            RETURNING *
        `;
        const values = [nombre, ubicacion, capacidad, precio_hora, estado, telefono, email, direccion, horarios, descripcion, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Eliminar un parqueadero
    async deleteParqueadero(id) {
        const query = 'DELETE FROM parqueaderos WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}; 