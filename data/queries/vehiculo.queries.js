import { pool } from '../postgres.js';

export const vehiculoQueries = {
    // Crear un nuevo vehículo
    async createVehiculo({ placa, marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento, puesto }) {
        const query = `
            INSERT INTO vehiculos (placa, marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento, puesto)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *
        `;
        const values = [placa, marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento, puesto];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener vehículo por placa
    async getVehiculoByPlaca(placa) {
        const query = 'SELECT * FROM vehiculos WHERE LOWER(placa) = LOWER($1)';
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
    async updateVehiculo(placa, { marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento, puesto }) {
        const query = `
            UPDATE vehiculos
            SET marca = $1,
                modelo = $2,
                color = $3,
                tipo = $4,
                usuario_id = $5,
                parqueadero_id = $6,
                servicio_id = $7,
                dueno_nombre = $8,
                dueno_telefono = $9,
                dueno_email = $10,
                dueno_documento = $11,
                puesto = $12,
                updated_at = CURRENT_TIMESTAMP
            WHERE placa = $13
            RETURNING *
        `;
        const values = [marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento, puesto, placa];
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
    },

    // Validar si un puesto está ocupado
    async isPuestoOcupado(parqueadero_id, puesto, placaExcluir = null) {
        let query = 'SELECT 1 FROM vehiculos WHERE parqueadero_id = $1 AND puesto = $2';
        let values = [parqueadero_id, puesto];
        if (placaExcluir) {
            query += ' AND placa != $3';
            values.push(placaExcluir);
        }
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    },

    // Reporte profesional de vehículos frecuentes
    async getReporteVehiculosFrecuentes({ parqueadero_id, fecha_inicio, fecha_fin, tipo, page = 1, limit = 20 }) {
        let filtros = ['v.parqueadero_id = $1'];
        let valores = [parqueadero_id];
        let idx = 2;
        if (fecha_inicio) {
            filtros.push('i.hora_entrada >= $' + idx);
            valores.push(fecha_inicio);
            idx++;
        }
        if (fecha_fin) {
            filtros.push('i.hora_entrada <= $' + idx);
            valores.push(fecha_fin);
            idx++;
        }
        if (tipo) {
            filtros.push('LOWER(v.tipo) = $' + idx);
            valores.push(tipo.toLowerCase());
            idx++;
        }
        const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Vehículos frecuentes
        const query = `
            SELECT v.placa, v.tipo, COUNT(i.id) AS ingresos, MIN(i.hora_entrada) AS primer_ingreso, MAX(i.hora_entrada) AS ultimo_ingreso
            FROM ingresos i
            JOIN vehiculos v ON i.vehiculo_id = v.id
            ${where}
            GROUP BY v.placa, v.tipo
            ORDER BY ingresos DESC
            LIMIT $${idx} OFFSET $${idx + 1}
        `;
        const result = await pool.query(query, [...valores, limit, offset]);
        return result.rows;
    }
}; 