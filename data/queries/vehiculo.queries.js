import { pool } from '../postgres.js';

export const vehiculoQueries = {
    // Crear un nuevo vehículo
    async createVehiculo({ placa, marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento }) {
        const query = `
            INSERT INTO vehiculos (placa, marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;
        const values = [placa, marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener vehículo por placa
    async getVehiculoByPlaca(placa) {
        const query = 'SELECT * FROM vehiculos WHERE placa = $1';
        const result = await pool.query(query, [placa]);
        return result.rows[0];
    },

    // Obtener todos los vehículos (opcional: filtrar por parqueadero_id o usuario_id)
    async getVehiculos({ parqueadero_id, usuario_id }) {
        let query = 'SELECT * FROM vehiculos';
        let values = [];
        if (parqueadero_id) {
            query += ' WHERE parqueadero_id = $1';
            values.push(parqueadero_id);
        } else if (usuario_id) {
            query += ' WHERE usuario_id = $1';
            values.push(usuario_id);
        }
        const result = await pool.query(query, values);
        return result.rows;
    },

    // Actualizar vehículo
    async updateVehiculo(placa, { marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento }) {
        const query = `
            UPDATE vehiculos
            SET marca = $1,
                modelo = $2,
                color = $3,
                tipo = $4,
                usuario_id = $5,
                parqueadero_id = $6,
                servicio_id = $8,
                dueno_nombre = $9,
                dueno_telefono = $10,
                dueno_email = $11,
                dueno_documento = $12,
                updated_at = CURRENT_TIMESTAMP
            WHERE placa = $7
            RETURNING *
        `;
        const values = [marca, modelo, color, tipo, usuario_id, parqueadero_id, placa, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Eliminar vehículo
    async deleteVehiculo(placa) {
        const query = 'DELETE FROM vehiculos WHERE placa = $1 RETURNING *';
        const result = await pool.query(query, [placa]);
        return result.rows[0];
    },

    // Obtener vehículo por ID
    async getVehiculoById(id) {
        const query = 'SELECT * FROM vehiculos WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Eliminar todos los vehículos de un parqueadero
    async deleteVehiculosByParqueaderoId(parqueadero_id) {
        const query = 'DELETE FROM vehiculos WHERE parqueadero_id = $1';
        const result = await pool.query(query, [parqueadero_id]);
        return result.rowCount; // Devuelve el número de vehículos eliminados
    }
}; 