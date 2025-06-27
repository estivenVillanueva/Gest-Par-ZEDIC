import { pool } from '../postgres.js';

export const serviciosQueries = {
    // Crear un nuevo servicio
    async createServicio({ nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto = 0, precio_hora = 0, precio_dia = 0 }) {
        console.log('--- CREAR SERVICIO ---');
        console.log('Datos recibidos:', { nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto, precio_hora, precio_dia });
        try {
            const query = `
                INSERT INTO servicios (nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto, precio_hora, precio_dia)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *
            `;
            const values = [nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto, precio_hora, precio_dia];
            console.log('Query:', query);
            console.log('Values:', values);
            const result = await pool.query(query, values);
            console.log('Resultado de inserción:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear servicio:', error);
            throw error;
        }
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
    async updateServicio(id, { nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto = 0, precio_hora = 0, precio_dia = 0 }) {
        console.log('--- ACTUALIZAR SERVICIO ---');
        console.log('Datos recibidos:', { id, nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto, precio_hora, precio_dia });
        try {
            const query = `
                UPDATE servicios
                SET nombre = $1,
                    descripcion = $2,
                    precio = $3,
                    duracion = $4,
                    estado = $5,
                    parqueadero_id = $6,
                    tipo_cobro = $7,
                    precio_minuto = $8,
                    precio_hora = $9,
                    precio_dia = $10
                WHERE id = $11
                RETURNING *
            `;
            const values = [nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto, precio_hora, precio_dia, id];
            console.log('Query:', query);
            console.log('Values:', values);
            const result = await pool.query(query, values);
            console.log('Resultado de actualización:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar servicio:', error);
            throw error;
        }
    },

    // Eliminar servicio
    async deleteServicio(id) {
        const query = 'DELETE FROM servicios WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}; 