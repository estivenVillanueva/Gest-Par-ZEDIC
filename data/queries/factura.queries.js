import { pool } from '../postgres.js';
import { vehiculoQueries } from './vehiculo.queries.js';
import { serviciosQueries } from './servicios.queries.js';

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
    },

    // Generar facturas periódicas automáticamente
    async generateFacturasPeriodicas() {
        // 1. Obtener todos los vehículos con servicio periódico
        const vehiculos = await pool.query(`
            SELECT v.*, s.tipo_cobro, s.precio, s.id as servicio_id, s.nombre as servicio_nombre
            FROM vehiculos v
            JOIN servicios s ON v.servicio_id = s.id
            WHERE s.tipo_cobro = 'periodo'
        `);
        for (const vehiculo of vehiculos.rows) {
            // 2. Buscar la última factura generada para este vehículo y servicio
            const { rows: facturas } = await pool.query(
                `SELECT * FROM facturas WHERE vehiculo_id = $1 AND servicio_id = $2 ORDER BY fecha_vencimiento DESC LIMIT 1`,
                [vehiculo.id, vehiculo.servicio_id]
            );
            let fechaInicio;
            if (facturas.length > 0) {
                fechaInicio = new Date(facturas[0].fecha_vencimiento);
            } else {
                fechaInicio = new Date(vehiculo.created_at);
            }
            // 3. Calcular cuántos ciclos han pasado desde la última factura
            const hoy = new Date();
            let cicloDias = 30;
            if (vehiculo.servicio_nombre.toLowerCase().includes('semanal')) cicloDias = 7;
            if (vehiculo.servicio_nombre.toLowerCase().includes('quincenal')) cicloDias = 15;
            // Generar facturas por cada ciclo no facturado
            let fechaCiclo = new Date(fechaInicio);
            while (fechaCiclo < hoy) {
                // Siguiente ciclo
                const fechaVencimiento = new Date(fechaCiclo);
                fechaVencimiento.setDate(fechaVencimiento.getDate() + cicloDias);
                // Verificar si ya existe factura para este periodo
                const { rows: existe } = await pool.query(
                    `SELECT 1 FROM facturas WHERE vehiculo_id = $1 AND servicio_id = $2 AND fecha_creacion = $3`,
                    [vehiculo.id, vehiculo.servicio_id, fechaCiclo]
                );
                if (existe.length === 0) {
                    // Crear factura pendiente
                    const facturaRes = await pool.query(
                        `INSERT INTO facturas (usuario_id, parqueadero_id, vehiculo_id, servicio_id, total, estado, fecha_creacion, fecha_vencimiento)
                         VALUES ($1, $2, $3, $4, $5, 'pendiente', $6, $7) RETURNING id`,
                        [vehiculo.usuario_id, vehiculo.parqueadero_id, vehiculo.id, vehiculo.servicio_id, vehiculo.precio, fechaCiclo, fechaVencimiento]
                    );
                    const facturaId = facturaRes.rows[0].id;
                    // Crear detalle de factura automáticamente
                    await pool.query(
                        `INSERT INTO factura_detalles (factura_id, servicio_id, cantidad, precio_unitario, subtotal, created_at, updated_at)
                         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
                        [facturaId, vehiculo.servicio_id, 1, vehiculo.precio, vehiculo.precio]
                    );
                }
                // Avanzar al siguiente ciclo
                fechaCiclo = new Date(fechaVencimiento);
            }
        }
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