import { pool } from '../postgres.js';

export const vehiculoQueries = {
    // Crear un nuevo vehículo
    async createVehiculo({ placa, marca, color, puesto, idParqueadero }) {
        const query = `
            INSERT INTO vehiculo (placa, marca, color, puesto, id_parqueadero)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [placa, marca, color, puesto, idParqueadero];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener vehículo por placa
    async getVehiculoByPlaca(placa) {
        const query = 'SELECT * FROM vehiculo WHERE placa = $1';
        const result = await pool.query(query, [placa]);
        return result.rows[0];
    },

    // Obtener vehículos por parqueadero
    async getVehiculosByParqueadero(idParqueadero) {
        const query = 'SELECT * FROM vehiculo WHERE id_parqueadero = $1';
        const result = await pool.query(query, [idParqueadero]);
        return result.rows;
    },

    // Actualizar vehículo
    async updateVehiculo(placa, { marca, color, puesto, idParqueadero }) {
        const query = `
            UPDATE vehiculo
            SET marca = $1,
                color = $2,
                puesto = $3,
                id_parqueadero = $4
            WHERE placa = $5
            RETURNING *
        `;
        const values = [marca, color, puesto, idParqueadero, placa];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Eliminar vehículo
    async deleteVehiculo(placa) {
        const query = 'DELETE FROM vehiculo WHERE placa = $1 RETURNING *';
        const result = await pool.query(query, [placa]);
        return result.rows[0];
    },

    // Verificar disponibilidad de puesto
    async checkPuestoDisponible(puesto, idParqueadero) {
        const query = 'SELECT * FROM vehiculo WHERE puesto = $1 AND id_parqueadero = $2';
        const result = await pool.query(query, [puesto, idParqueadero]);
        return result.rows.length === 0;
    }
}; 