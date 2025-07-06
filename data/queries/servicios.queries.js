import { pool } from '../postgres.js';

export const serviciosQueries = {
    // Crear un nuevo servicio
    async createServicio({ nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto = 0, precio_hora = 0, precio_dia = 0, tipo_vehiculo }) {
        // Normalizar campos numéricos vacíos a null o a un valor válido
        let safePrecio = precio;
        if (safePrecio === '' || safePrecio === undefined || safePrecio === null) {
            if (duracion === 'minuto') safePrecio = precio_minuto || 0;
            else if (duracion === 'hora') safePrecio = precio_hora || 0;
            else if (duracion === 'día' || duracion === 'dia') safePrecio = precio_dia || 0;
            else safePrecio = 0;
        }
        // Copiar precio a precio_minuto, precio_hora o precio_dia si corresponde
        let safePrecioMinuto = (precio_minuto === '' || precio_minuto === 0 || precio_minuto === null || precio_minuto === undefined)
            ? ((duracion === 'minuto' && safePrecio) ? safePrecio : 0)
            : precio_minuto;
        let safePrecioHora = (precio_hora === '' || precio_hora === 0 || precio_hora === null || precio_hora === undefined)
            ? ((duracion === 'hora' && safePrecio) ? safePrecio : 0)
            : precio_hora;
        let safePrecioDia = (precio_dia === '' || precio_dia === 0 || precio_dia === null || precio_dia === undefined)
            ? (((duracion === 'día' || duracion === 'dia') && safePrecio) ? safePrecio : 0)
            : precio_dia;
        console.log('--- CREAR SERVICIO ---');
        console.log('Datos recibidos:', { nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto, precio_hora, precio_dia, tipo_vehiculo });
        try {
            const query = `
                INSERT INTO servicios (nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto, precio_hora, precio_dia, tipo_vehiculo)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *
            `;
            const values = [nombre, descripcion, safePrecio, duracion, estado, parqueadero_id, tipo_cobro, safePrecioMinuto, safePrecioHora, safePrecioDia, tipo_vehiculo];
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
    async updateServicio(id, { nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto = 0, precio_hora = 0, precio_dia = 0, tipo_vehiculo }) {
        console.log('--- ACTUALIZAR SERVICIO ---');
        console.log('Datos recibidos:', { id, nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, precio_minuto, precio_hora, precio_dia, tipo_vehiculo });
        try {
            // Copiar precio a precio_minuto, precio_hora o precio_dia si corresponde
            let safePrecioMinuto = (precio_minuto === '' || precio_minuto === 0 || precio_minuto === null || precio_minuto === undefined)
                ? ((duracion === 'minuto' && precio) ? precio : 0)
                : precio_minuto;
            let safePrecioHora = (precio_hora === '' || precio_hora === 0 || precio_hora === null || precio_hora === undefined)
                ? ((duracion === 'hora' && precio) ? precio : 0)
                : precio_hora;
            let safePrecioDia = (precio_dia === '' || precio_dia === 0 || precio_dia === null || precio_dia === undefined)
                ? (((duracion === 'día' || duracion === 'dia') && precio) ? precio : 0)
                : precio_dia;
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
                    precio_dia = $10,
                    tipo_vehiculo = $11
                WHERE id = $12
                RETURNING *
            `;
            const values = [nombre, descripcion, precio, duracion, estado, parqueadero_id, tipo_cobro, safePrecioMinuto, safePrecioHora, safePrecioDia, tipo_vehiculo, id];
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
    },

    // Obtener todos los servicios
    async getAllServicios() {
        const query = 'SELECT * FROM servicios';
        const result = await pool.query(query);
        return result.rows;
    },

    // Marcar servicio como inactivo
    async inactivarServicio(id) {
        const query = 'UPDATE servicios SET estado = $1 WHERE id = $2 RETURNING *';
        const result = await pool.query(query, ['inactivo', id]);
        return result.rows[0];
    },

    // Reporte profesional de servicios más contratados
    async getReporteServiciosContratados({ parqueadero_id, fecha_inicio, fecha_fin, page = 1, limit = 20 }) {
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
        const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Servicios más contratados
        const query = `
            SELECT s.nombre AS servicio_nombre, COUNT(i.id) AS cantidad, COALESCE(SUM(i.valor_pagado),0) AS total
            FROM ingresos i
            JOIN vehiculos v ON i.vehiculo_id = v.id
            JOIN servicios s ON v.servicio_id = s.id
            ${where}
            GROUP BY s.nombre
            ORDER BY cantidad DESC, total DESC
            LIMIT $${idx} OFFSET $${idx + 1}
        `;
        const result = await pool.query(query, [...valores, limit, offset]);
        return result.rows;
    }
}; 