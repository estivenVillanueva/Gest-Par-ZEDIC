import express from 'express';
import { vehiculoQueries } from '../queries/vehiculo.queries.js';

const router = express.Router();

// Obtener vehículo por placa
router.get('/placa/:placa', async (req, res) => {
    try {
        const vehiculo = await vehiculoQueries.getVehiculoByPlaca(req.params.placa);
        if (!vehiculo) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        res.json({
            success: true,
            data: vehiculo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener vehículo',
            error: error.message
        });
    }
});

// Obtener vehículos por parqueadero
router.get('/parqueadero/:idParqueadero', async (req, res) => {
    try {
        const vehiculos = await vehiculoQueries.getVehiculosByParqueadero(req.params.idParqueadero);
        res.json({
            success: true,
            data: vehiculos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener vehículos',
            error: error.message
        });
    }
});

// Crear un nuevo vehículo
router.post('/', async (req, res) => {
    try {
        const nuevoVehiculo = await vehiculoQueries.createVehiculo(req.body);
        res.status(201).json({
            success: true,
            data: nuevoVehiculo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear vehículo',
            error: error.message
        });
    }
});

// Actualizar vehículo
router.put('/:placa', async (req, res) => {
    try {
        const vehiculoActualizado = await vehiculoQueries.updateVehiculo(req.params.placa, req.body);
        if (!vehiculoActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        res.json({
            success: true,
            data: vehiculoActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar vehículo',
            error: error.message
        });
    }
});

// Eliminar vehículo
router.delete('/:placa', async (req, res) => {
    try {
        const vehiculoEliminado = await vehiculoQueries.deleteVehiculo(req.params.placa);
        if (!vehiculoEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Vehículo eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar vehículo',
            error: error.message
        });
    }
});

// Verificar disponibilidad de puesto
router.get('/verificar-puesto/:puesto/:idParqueadero', async (req, res) => {
    try {
        const disponible = await vehiculoQueries.checkPuestoDisponible(
            req.params.puesto,
            req.params.idParqueadero
        );
        res.json({
            success: true,
            data: { disponible }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al verificar disponibilidad',
            error: error.message
        });
    }
});

export const vehiculoRoutes = router; 