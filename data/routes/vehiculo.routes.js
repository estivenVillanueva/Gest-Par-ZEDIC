import express from 'express';
import { vehiculoQueries } from '../queries/vehiculo.queries.js';
import { facturaQueries } from '../queries/factura.queries.js';
import { crearYEmitirNotificacion } from '../queries/notificaciones.queries.js';

const router = express.Router();

// Obtener todos los vehículos (opcional: filtrar por parqueadero_id o usuario_id)
router.get('/', async (req, res) => {
    try {
        const { parqueadero_id, usuario_id } = req.query;
        const vehiculos = await vehiculoQueries.getVehiculos({ parqueadero_id, usuario_id });
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

// Obtener vehículo por ID
router.get('/:id', async (req, res) => {
    try {
        const vehiculo = await vehiculoQueries.getVehiculoById(req.params.id);
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

// Crear un nuevo vehículo
router.post('/', async (req, res) => {
    try {
        const { placa, marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento, puesto } = req.body;
        // Validar que el puesto esté disponible
        if (puesto) {
            const ocupado = await vehiculoQueries.isPuestoOcupado(parqueadero_id, puesto);
            if (ocupado) {
                return res.status(400).json({ success: false, message: 'El puesto ya está ocupado.' });
            }
        }
        const nuevoVehiculo = await vehiculoQueries.createVehiculo({ placa, marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento, puesto });
        // Generar facturas periódicas después de crear el vehículo
        await facturaQueries.generateFacturasPeriodicas();
        // Notificación automática
        await crearYEmitirNotificacion(req.io, {
          usuario_id: usuario_id || null,
          titulo: 'Nuevo vehículo registrado',
          mensaje: `Se ha registrado el vehículo ${placa} en el sistema.`,
          tipo: 'vehiculo'
        });
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
        const { marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento, puesto } = req.body;
        // Validar que el puesto esté disponible (excepto si es el mismo vehículo)
        if (puesto) {
            const ocupado = await vehiculoQueries.isPuestoOcupado(parqueadero_id, puesto, req.params.placa);
            if (ocupado) {
                return res.status(400).json({ success: false, message: 'El puesto ya está ocupado.' });
            }
        }
        const vehiculoActualizado = await vehiculoQueries.updateVehiculo(req.params.placa, { marca, modelo, color, tipo, usuario_id, parqueadero_id, servicio_id, dueno_nombre, dueno_telefono, dueno_email, dueno_documento, puesto });
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

// Eliminar todos los vehículos de un parqueadero
router.delete('/parqueadero/:parqueadero_id', async (req, res) => {
    try {
        const { parqueadero_id } = req.params;
        const eliminados = await vehiculoQueries.deleteVehiculosByParqueaderoId(parqueadero_id);
        res.json({
            success: true,
            message: `Se eliminaron ${eliminados} vehículos del parqueadero.`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar los vehículos del parqueadero',
            error: error.message
        });
    }
});

export const vehiculoRoutes = router; 