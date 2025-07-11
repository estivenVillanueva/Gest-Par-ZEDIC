import express from 'express';
import { serviciosQueries } from '../queries/servicios.queries.js';

const router = express.Router();

// Obtener servicio por ID
router.get('/:id', async (req, res) => {
    try {
        const servicio = await serviciosQueries.getServicioById(req.params.id);
        if (!servicio) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }
        res.json({
            success: true,
            data: servicio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener servicio',
            error: error.message
        });
    }
});

// Obtener servicios por parqueadero
router.get('/parqueadero/:idParqueadero', async (req, res) => {
    try {
        const servicios = await serviciosQueries.getServiciosByParqueadero(req.params.idParqueadero);
        res.json({
            success: true,
            data: servicios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener servicios',
            error: error.message
        });
    }
});

// Obtener todos los servicios
router.get('/', async (req, res) => {
    try {
        const servicios = await serviciosQueries.getAllServicios();
        res.json({
            success: true,
            data: servicios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener servicios',
            error: error.message
        });
    }
});

// Crear un nuevo servicio
router.post('/', async (req, res) => {
    try {
        // Asegurarse de que tipo_vehiculo esté presente en el body
        const nuevoServicio = await serviciosQueries.createServicio({
            ...req.body,
            tipo_vehiculo: req.body.tipo_vehiculo
        });
        res.status(201).json({
            success: true,
            data: nuevoServicio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear servicio',
            error: error.message
        });
    }
});

// Actualizar servicio
router.put('/:id', async (req, res) => {
    try {
        // Asegurarse de que tipo_vehiculo esté presente en el body
        const servicioActualizado = await serviciosQueries.updateServicio(req.params.id, {
            ...req.body,
            tipo_vehiculo: req.body.tipo_vehiculo
        });
        if (!servicioActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }
        res.json({
            success: true,
            data: servicioActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar servicio',
            error: error.message
        });
    }
});

// Eliminar servicio
router.delete('/:id', async (req, res) => {
    try {
        const servicioEliminado = await serviciosQueries.deleteServicio(req.params.id);
        if (!servicioEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Servicio eliminado correctamente'
        });
    } catch (error) {
        // Si es error de restricción de clave foránea, marcar como inactivo
        if (error.code === '23503') { // Código de error de Postgres para restricción de clave foránea
            try {
                const inactivado = await serviciosQueries.inactivarServicio(req.params.id);
                return res.status(200).json({
                    success: true,
                    message: 'El servicio tiene dependencias y no se puede eliminar, pero ha sido desactivado (estado = inactivo).',
                    data: inactivado
                });
            } catch (err2) {
                return res.status(500).json({
                    success: false,
                    message: 'No se pudo eliminar ni desactivar el servicio',
                    error: err2.message
                });
            }
        }
        res.status(500).json({
            success: false,
            message: 'Error al eliminar servicio',
            error: error.message
        });
    }
});

// Endpoint profesional para reporte de servicios más contratados
router.get('/contratados/reporte', async (req, res) => {
  try {
    const { parqueadero_id, fecha_inicio, fecha_fin, page, limit } = req.query;
    const result = await serviciosQueries.getReporteServiciosContratados({ parqueadero_id, fecha_inicio, fecha_fin, page, limit });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al generar el reporte de servicios más contratados', error: error.message });
  }
});

export const serviciosRoutes = router; 