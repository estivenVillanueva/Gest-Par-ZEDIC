import express from 'express';
import { parqueaderoQueries } from '../queries/parqueadero.queries.js';

const router = express.Router();

// Obtener todos los parqueaderos
router.get('/', async (req, res) => {
    try {
        const parqueaderos = await parqueaderoQueries.getAllParqueaderos();
        res.json({
            success: true,
            data: parqueaderos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener parqueaderos',
            error: error.message
        });
    }
});

// Obtener parqueadero por usuario_id
router.get('/usuario/:usuario_id', async (req, res) => {
    try {
        const parqueadero = await parqueaderoQueries.getParqueaderoByUsuarioId(req.params.usuario_id);
        if (!parqueadero) {
            return res.status(404).json({
                success: false,
                message: 'Parqueadero no encontrado para este usuario'
            });
        }
        res.json({
            success: true,
            data: parqueadero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener parqueadero por usuario',
            error: error.message
        });
    }
});

// Obtener un parqueadero por ID
router.get('/:id', async (req, res) => {
    try {
        const parqueadero = await parqueaderoQueries.getParqueaderoById(req.params.id);
        if (!parqueadero) {
            return res.status(404).json({
                success: false,
                message: 'Parqueadero no encontrado'
            });
        }
        res.json({
            success: true,
            data: parqueadero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener parqueadero',
            error: error.message
        });
    }
});

// Crear un nuevo parqueadero
router.post('/', async (req, res) => {
    console.log('Llamada a POST /api/parqueaderos con body:', req.body);
    try {
        const nuevoParqueadero = await parqueaderoQueries.createParqueadero(req.body);
        // Crear automáticamente un servicio vacío asociado a este parqueadero
        try {
            // Importar aquí para evitar dependencias circulares
            const { serviciosQueries } = await import('../queries/servicios.queries.js');
            console.log('Intentando crear servicio vacío para parqueadero:', nuevoParqueadero.id);
            const servicioCreado = await serviciosQueries.createServicio({
                nombre: null, // o '' si prefieres
                precio: null,
                tipo: null,
                parqueadero_id: nuevoParqueadero.id // nombre correcto
            });
            console.log('Servicio vacío creado correctamente:', servicioCreado);
        } catch (servicioError) {
            // Devolver el error en la respuesta para depuración
            console.error('Error al crear servicio vacío:', servicioError);
            return res.status(500).json({
                success: false,
                message: 'Error al crear servicio vacío',
                error: servicioError.message
            });
        }
        res.status(201).json({
            success: true,
            data: nuevoParqueadero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear parqueadero',
            error: error.message
        });
    }
});

// Actualizar un parqueadero
router.put('/:id', async (req, res) => {
    try {
        console.log('Datos recibidos para actualizar parqueadero:', req.body, 'ID:', req.params.id);
        const parqueaderoActualizado = await parqueaderoQueries.updateParqueadero(req.params.id, req.body);
        if (!parqueaderoActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Parqueadero no encontrado'
            });
        }
        res.json({
            success: true,
            data: parqueaderoActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar parqueadero',
            error: error.message
        });
    }
});

// Eliminar un parqueadero
router.delete('/:id', async (req, res) => {
    try {
        const parqueaderoEliminado = await parqueaderoQueries.deleteParqueadero(req.params.id);
        if (!parqueaderoEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Parqueadero no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Parqueadero eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar parqueadero',
            error: error.message
        });
    }
});

export const parqueaderoRoutes = router; 