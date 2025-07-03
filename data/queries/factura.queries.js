import { pool } from '../postgres.js';
import { vehiculoQueries } from './vehiculo.queries.js';
import { serviciosQueries } from './servicios.queries.js';

export const facturaQueries = {
    // Crear una nueva factura
    async createFactura({ usuario_id, parqueadero_id, vehiculo_id, servicio_id, total, estado = 'pendiente', fecha_creacion = new Date(), fecha_vencimiento }) {
        const query = `
            INSERT INTO facturas (usuario_id, parqueadero_id, vehiculo_id, servicio_id, total, estado, fecha_creacion, fecha_vencimiento)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const values = [usuario_id, parqueadero_id, vehiculo_id, servicio_id, total, estado, fecha_creacion, fecha_vencimiento];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obtener factura por ID
    async getFacturaById(id) {
        const query = `
            SELECT f.*, s.nombre as servicio_nombre, s.precio as servicio_precio
            FROM facturas f
            JOIN servicios s ON f.id_servicio = s.id
            WHERE f.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Actualizar factura
    async updateFactura(id, { fechaIngreso, fechaSalida, valorTotal, idServicio }) {
        const query = `
            UPDATE facturas
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
        const query = 'DELETE FROM facturas WHERE id = $1 RETURNING *';
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
        console.log('[PERIODICAS] Vehículos encontrados para facturación periódica:', vehiculos.rows.length);
        for (const vehiculo of vehiculos.rows) {
            console.log('[PERIODICAS] Procesando vehículo:', vehiculo.id, vehiculo.placa, 'usuario_id:', vehiculo.usuario_id, 'parqueadero_id:', vehiculo.parqueadero_id, 'servicio_id:', vehiculo.servicio_id);
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
                    console.log('[PERIODICAS] Creando factura para vehículo:', vehiculo.id, 'usuario_id:', vehiculo.usuario_id, 'parqueadero_id:', vehiculo.parqueadero_id, 'servicio_id:', vehiculo.servicio_id, 'fecha_creacion:', fechaCiclo, 'fecha_vencimiento:', fechaVencimiento);
                    // Crear factura pendiente
                    const facturaRes = await pool.query(
                        `INSERT INTO facturas (usuario_id, parqueadero_id, vehiculo_id, servicio_id, total, estado, fecha_creacion, fecha_vencimiento)
                         VALUES ($1, $2, $3, $4, $5, 'pendiente', $6, $7) RETURNING id`,
                        [vehiculo.usuario_id, vehiculo.parqueadero_id, vehiculo.id, vehiculo.servicio_id, vehiculo.precio, fechaCiclo, fechaVencimiento]
                    );
                    const facturaId = facturaRes.rows[0].id;
                    console.log('[PERIODICAS] Factura creada con id:', facturaId, 'para vehiculo_id:', vehiculo.id);
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
    },

    // Listar todas las facturas de un usuario
    async getFacturasByUsuarioId(usuario_id) {
        const query = `
            SELECT f.*, p.nombre as parqueadero_nombre, p.direccion as parqueadero_direccion, v.placa as vehiculo_placa, s.nombre as servicio_nombre
            FROM facturas f
            LEFT JOIN parqueaderos p ON f.parqueadero_id = p.id
            LEFT JOIN vehiculos v ON f.vehiculo_id = v.id
            LEFT JOIN servicios s ON f.servicio_id = s.id
            WHERE f.usuario_id = $1
            ORDER BY f.fecha_creacion DESC
        `;
        const result = await pool.query(query, [usuario_id]);
        return result.rows;
    },

    // Listar todas las facturas
    async getAllFacturas() {
        const query = `
            SELECT f.*, p.nombre as parqueadero_nombre, p.direccion as parqueadero_direccion, v.placa as vehiculo_placa, s.nombre as servicio_nombre
            FROM facturas f
            LEFT JOIN parqueaderos p ON f.parqueadero_id = p.id
            LEFT JOIN vehiculos v ON f.vehiculo_id = v.id
            LEFT JOIN servicios s ON f.servicio_id = s.id
            ORDER BY f.fecha_creacion DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    }
};

export const detalleFacturaQueries = {
    // Crear un nuevo detalle de factura
    async createDetalleFactura({ tipoServicio, precioUnitario, valorTotal, idFactura, idServicio }) {
        const query = `
            INSERT INTO factura_detalles (tipo_servicio, precio_unitario, valor_total, factura_id, id_servicio)
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
            FROM factura_detalles df
            JOIN servicios s ON df.servicio_id = s.id
            WHERE df.factura_id = $1
        `;
        const result = await pool.query(query, [idFactura]);
        return result.rows;
    },

    // Actualizar detalle de factura
    async updateDetalleFactura(id, { tipoServicio, precioUnitario, valorTotal, idFactura, idServicio }) {
        const query = `
            UPDATE factura_detalles
            SET tipo_servicio = $1,
                precio_unitario = $2,
                valor_total = $3,
                factura_id = $4,
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
        const query = 'DELETE FROM factura_detalles WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

// Obtener factura completa por ID (con detalles, parqueadero, vehículo, logo, entradas/salidas)
async function getFacturaCompletaById(id) {
    console.log('[FACTURA] Buscando factura completa para id:', id);
    // 1. Obtener la factura y su servicio
    const facturaQuery = `
        SELECT f.*, s.nombre as servicio_nombre, s.precio as servicio_precio, f.parqueadero_id, f.vehiculo_id
        FROM facturas f
        JOIN servicios s ON f.servicio_id = s.id
        WHERE f.id = $1
    `;
    let facturaRes;
    let factura;
    try {
        facturaRes = await pool.query(facturaQuery, [id]);
        factura = facturaRes.rows[0];
        console.log('[FACTURA] Resultado consulta factura:', facturaRes.rows);
        if (!factura) {
            console.log('[FACTURA] No se encontró factura para id:', id);
            return null;
        }
        console.log('[FACTURA] Factura encontrada:', factura);
        console.log('[FACTURA] parqueadero_id:', factura?.parqueadero_id, 'vehiculo_id:', factura?.vehiculo_id);
    } catch (e) {
        console.error('[FACTURA][ERROR] Error consultando factura:', e);
        return null;
    }

    // 2. Obtener detalles de la factura (si no hay, devuelve [])
    let detalles = [];
    try {
        detalles = await detalleFacturaQueries.getDetallesByFacturaId(id) || [];
        console.log('[FACTURA] Detalles encontrados:', detalles);
    } catch (e) {
        detalles = [];
        console.error('[FACTURA][ERROR] Error obteniendo detalles:', e);
    }

    // 3. Obtener datos del parqueadero (si no hay, devuelve null)
    let parqueadero = null;
    try {
        const parqueaderoQuery = 'SELECT * FROM parqueaderos WHERE id = $1';
        const parqueaderoRes = await pool.query(parqueaderoQuery, [factura.parqueadero_id]);
        parqueadero = parqueaderoRes.rows[0] || null;
        console.log('[FACTURA] Parqueadero encontrado:', parqueadero);
    } catch (e) {
        parqueadero = null;
        console.error('[FACTURA][ERROR] Error obteniendo parqueadero:', e);
    }

    // 4. Obtener datos del vehículo (si no hay, devuelve null)
    let vehiculo = null;
    try {
        console.log('[FACTURA] Buscando vehículo con id:', factura.vehiculo_id, 'tipo:', typeof factura.vehiculo_id);
        const vehiculoQuery = 'SELECT * FROM vehiculos WHERE id = $1';
        const vehiculoRes = await pool.query(vehiculoQuery, [factura.vehiculo_id]);
        console.log('[FACTURA] Resultado consulta vehículo:', vehiculoRes.rows);
        vehiculo = vehiculoRes.rows[0] || null;
        if (vehiculo) {
            vehiculo.marca = vehiculo.marca || null;
            vehiculo.modelo = vehiculo.modelo || null;
            vehiculo.color = vehiculo.color || null;
            vehiculo.tipo = vehiculo.tipo || null;
            console.log('[FACTURA] Vehículo encontrado (con campos clave):', vehiculo);
        } else {
            console.log('[FACTURA] No se encontró vehículo con id:', factura.vehiculo_id);
        }
    } catch (e) {
        vehiculo = null;
        console.error('[FACTURA][ERROR] Error obteniendo vehículo:', e);
    }

    // 5. Contar ingresos y salidas del vehículo (si no hay, devuelve 0)
    let numIngresos = 0;
    let numSalidas = 0;
    try {
        const ingresosQuery = 'SELECT COUNT(*) FROM ingresos WHERE vehiculo_id = $1';
        const ingresosRes = await pool.query(ingresosQuery, [factura.vehiculo_id]);
        numIngresos = parseInt(ingresosRes.rows[0]?.count || '0', 10);
        // Para salidas, cuenta los ingresos con hora_salida no nula
        const salidasQuery = 'SELECT COUNT(*) FROM ingresos WHERE vehiculo_id = $1 AND hora_salida IS NOT NULL';
        const salidasRes = await pool.query(salidasQuery, [factura.vehiculo_id]);
        numSalidas = parseInt(salidasRes.rows[0]?.count || '0', 10);
    } catch (e) {
        numIngresos = 0;
        numSalidas = 0;
        console.error('[FACTURA][ERROR] Error contando ingresos/salidas:', e);
    }

    // Devolver los datos principales de la factura al nivel raíz
    return {
        id: factura.id,
        fecha_creacion: factura.fecha_creacion,
        estado: factura.estado,
        total: factura.total,
        usuario_id: factura.usuario_id,
        parqueadero_id: factura.parqueadero_id,
        vehiculo_id: factura.vehiculo_id,
        servicio_id: factura.servicio_id,
        servicio_nombre: factura.servicio_nombre,
        servicio_precio: factura.servicio_precio,
        detalles,
        parqueadero,
        vehiculo,
        numIngresos,
        numSalidas
    };
}

export { getFacturaCompletaById }; 