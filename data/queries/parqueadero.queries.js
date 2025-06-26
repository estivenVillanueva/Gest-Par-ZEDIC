import { pool } from '../postgres.js';

export const parqueaderoQueries = {
    // Crear un nuevo parqueadero
    async createParqueadero({ nombre, ubicacion, capacidad, precio_hora, estado, telefono, email, direccion, horarios, descripcion, usuario_id, latitud, longitud, logo_url, portada_url }) {
        const query = `
            INSERT INTO parqueaderos (nombre, ubicacion, capacidad, precio_hora, estado, telefono, email, direccion, horarios, descripcion, usuario_id, latitud, longitud, logo_url, portada_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
        `;
        const values = [nombre, ubicacion, capacidad, precio_hora, estado, telefono, email, direccion, horarios, descripcion, usuario_id, latitud, longitud, logo_url || null, portada_url || null];
        const result = await pool.query(query, values);
        return this._withDefaultImages(result.rows[0]);
    },

    // Obtener un parqueadero por ID
    async getParqueaderoById(id) {
        const query = 'SELECT * FROM parqueaderos WHERE id = $1';
        const result = await pool.query(query, [id]);
        return this._withDefaultImages(result.rows[0]);
    },

    // Obtener todos los parqueaderos
    async getAllParqueaderos() {
        const query = 'SELECT * FROM parqueaderos';
        const result = await pool.query(query);
        return result.rows.map(this._withDefaultImages);
    },

    // Actualizar un parqueadero
    async updateParqueadero(id, { nombre, ubicacion, capacidad, precio_hora, estado, telefono, email, direccion, horarios, descripcion, logo_url, portada_url }) {
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
                descripcion = $10,
                logo_url = $11,
                portada_url = $12
            WHERE id = $13
            RETURNING *
        `;
        const values = [nombre, ubicacion, capacidad, precio_hora, estado, telefono, email, direccion, horarios, descripcion, logo_url || null, portada_url || null, id];
        const result = await pool.query(query, values);
        return this._withDefaultImages(result.rows[0]);
    },

    // Eliminar un parqueadero
    async deleteParqueadero(id) {
        const query = 'DELETE FROM parqueaderos WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Obtener parqueadero por usuario_id
    async getParqueaderoByUsuarioId(usuario_id) {
        const query = 'SELECT * FROM parqueaderos WHERE usuario_id = $1';
        const result = await pool.query(query, [usuario_id]);
        return this._withDefaultImages(result.rows[0]);
    },

    // Actualizar latitud y longitud de un parqueadero
    async updateParqueaderoLatLng(id, latitud, longitud) {
        const query = `
            UPDATE parqueaderos
            SET latitud = $1, longitud = $2
            WHERE id = $3
            RETURNING *
        `;
        const values = [latitud, longitud, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Función auxiliar para poner imágenes predeterminadas
    _withDefaultImages(parqueadero) {
        if (!parqueadero) return parqueadero;
        return {
            ...parqueadero,
            logo_url: parqueadero.logo_url || 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Parking_icon.svg',
            portada_url: parqueadero.portada_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
        };
    }
}; 