import { pool } from '../postgres.js';

export const facturaQueries = {
    // Crear una nueva factura
    async createFactura({ fechaIngreso, fechaSalida, valorTotal, idServicio }) {
        const query = `
            INSERT INTO factura (fecha_ingreso, fecha_salida, valor_total, id_servicio)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [fechaIngreso, fechaSalida, valorTotal, idServicio];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener factura por ID
    async getFacturaById(id) {
        const query = `
            SELECT f.*, s.nombre as servicio_nombre, s.precio as servicio_precio
            FROM factura f
            JOIN servicios s ON f.id_servicio = s.id
            WHERE f.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Actualizar factura
    async updateFactura(id, { fechaIngreso, fechaSalida, valorTotal, idServicio }) {
        const query = `
            UPDATE factura
            SET fecha_ingreso = $1,
                fecha_salida = $2,
                valor_total = $3,
                id_servicio = $4
            WHERE id = $5
            RETURNING *
        `;
        const values = [fechaIngreso, fechaSalida, valorTotal, idServicio, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Eliminar factura
    async deleteFactura(id) {
        const query = 'DELETE FROM factura WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

export const detalleFacturaQueries = {
    // Crear un nuevo detalle de factura
    async createDetalleFactura({ tipoServicio, precioUnitario, valorTotal, idFactura, idServicio }) {
        const query = `
            INSERT INTO detalle_factura (tipo_servicio, precio_unitario, valor_total, id_factura, id_servicio)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [tipoServicio, precioUnitario, valorTotal, idFactura, idServicio];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener detalles de factura por ID de factura
    async getDetallesByFacturaId(idFactura) {
        const query = `
            SELECT df.*, s.nombre as servicio_nombre
            FROM detalle_factura df
            JOIN servicios s ON df.id_servicio = s.id
            WHERE df.id_factura = $1
        `;
        const result = await pool.query(query, [idFactura]);
        return result.rows;
    },

    // Actualizar detalle de factura
    async updateDetalleFactura(id, { tipoServicio, precioUnitario, valorTotal, idFactura, idServicio }) {
        const query = `
            UPDATE detalle_factura
            SET tipo_servicio = $1,
                precio_unitario = $2,
                valor_total = $3,
                id_factura = $4,
                id_servicio = $5
            WHERE id = $6
            RETURNING *
        `;
        const values = [tipoServicio, precioUnitario, valorTotal, idFactura, idServicio, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Eliminar detalle de factura
    async deleteDetalleFactura(id) {
        const query = 'DELETE FROM detalle_factura WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}; 