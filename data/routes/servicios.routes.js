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

// Crear un nuevo servicio
router.post('/', async (req, res) => {
    try {
        const nuevoServicio = await serviciosQueries.createServicio(req.body);
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
        const servicioActualizado = await serviciosQueries.updateServicio(req.params.id, req.body);
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
        res.status(500).json({
            success: false,
            message: 'Error al eliminar servicio',
            error: error.message
        });
    }
});

export const serviciosRoutes = router; 