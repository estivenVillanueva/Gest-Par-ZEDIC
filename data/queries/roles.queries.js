import { pool } from '../postgres.js';

export const administradorQueries = {
    // Crear un nuevo administrador
    async createAdministrador({ idUsuario, idParqueadero }) {
        const query = `
            INSERT INTO administrador (id_usuario, id_parqueadero)
            VALUES ($1, $2)
            RETURNING *
        `;
        const values = [idUsuario, idParqueadero];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener administrador por ID de usuario
    async getAdministradorByUsuarioId(idUsuario) {
        const query = `
            SELECT a.*, u.nombre, u.correo, p.nombre_parqueadero
            FROM administrador a
            JOIN usuario u ON a.id_usuario = u.id
            JOIN parqueadero p ON a.id_parqueadero = p.id
            WHERE a.id_usuario = $1
        `;
        const result = await pool.query(query, [idUsuario]);
        return result.rows[0];
    },

    // Obtener administradores por parqueadero
    async getAdministradoresByParqueadero(idParqueadero) {
        const query = `
            SELECT a.*, u.nombre, u.correo
            FROM administrador a
            JOIN usuario u ON a.id_usuario = u.id
            WHERE a.id_parqueadero = $1
        `;
        const result = await pool.query(query, [idParqueadero]);
        return result.rows;
    },

    // Eliminar administrador
    async deleteAdministrador(idUsuario) {
        const query = 'DELETE FROM administrador WHERE id_usuario = $1 RETURNING *';
        const result = await pool.query(query, [idUsuario]);
        return result.rows[0];
    }
};

export const clienteQueries = {
    // Crear un nuevo cliente
    async createCliente({ idUsuario, idVehiculo }) {
        const query = `
            INSERT INTO cliente (id_usuario, id_vehiculo)
            VALUES ($1, $2)
            RETURNING *
        `;
        const values = [idUsuario, idVehiculo];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener cliente por ID de usuario
    async getClienteByUsuarioId(idUsuario) {
        const query = `
            SELECT c.*, u.nombre, u.correo, v.placa, v.marca, v.color
            FROM cliente c
            JOIN usuario u ON c.id_usuario = u.id
            JOIN vehiculo v ON c.id_vehiculo = v.id
            WHERE c.id_usuario = $1
        `;
        const result = await pool.query(query, [idUsuario]);
        return result.rows[0];
    },

    // Obtener clientes por vehículo
    async getClientesByVehiculo(idVehiculo) {
        const query = `
            SELECT c.*, u.nombre, u.correo
            FROM cliente c
            JOIN usuario u ON c.id_usuario = u.id
            WHERE c.id_vehiculo = $1
        `;
        const result = await pool.query(query, [idVehiculo]);
        return result.rows;
    },

    // Eliminar cliente
    async deleteCliente(idUsuario) {
        const query = 'DELETE FROM cliente WHERE id_usuario = $1 RETURNING *';
        const result = await pool.query(query, [idUsuario]);
        return result.rows[0];
    }
}; 