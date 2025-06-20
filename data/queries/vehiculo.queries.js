import { pool } from '../postgres.js';

export const vehiculoQueries = {
    // Crear un nuevo vehículo
    async createVehiculo({ placa, marca, modelo, color, tipo, usuario_id, parqueadero_id }) {
        const query = `
            INSERT INTO vehiculos (placa, marca, modelo, color, tipo, usuario_id, parqueadero_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const values = [placa, marca, modelo, color, tipo, usuario_id, parqueadero_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener vehículo por placa
    async getVehiculoByPlaca(placa) {
        const query = 'SELECT * FROM vehiculos WHERE placa = $1';
        const result = await pool.query(query, [placa]);
        return result.rows[0];
    },

    // Obtener todos los vehículos (opcional: filtrar por parqueadero_id)
    async getVehiculos({ parqueadero_id }) {
        let query = 'SELECT * FROM vehiculos';
        let values = [];
        if (parqueadero_id) {
            query += ' WHERE parqueadero_id = $1';
            values.push(parqueadero_id);
        }
        const result = await pool.query(query, values);
        return result.rows;
    },

    // Actualizar vehículo
    async updateVehiculo(placa, { marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id }) {
        const query = `
            UPDATE vehiculos
            SET marca = $1,
                modelo = $2,
                color = $3,
                tipo = $4,
                usuario_id = $5,
                parqueadero_id = $6,
                servicio_id = $8,
                updated_at = CURRENT_TIMESTAMP
            WHERE placa = $7
            RETURNING *
        `;
        const values = [marca, modelo, color, tipo, usuario_id, parqueadero_id, placa, servicio_id];
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