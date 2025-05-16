import express from 'express';
import { administradorQueries, clienteQueries } from '../queries/roles.queries.js';

const router = express.Router();

// Rutas para Administrador
router.get('/administrador/:idUsuario', async (req, res) => {
    try {
        const administrador = await administradorQueries.getAdministradorByUsuarioId(req.params.idUsuario);
        if (!administrador) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }
        res.json({
            success: true,
            data: administrador
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener administrador',
            error: error.message
        });
    }
});

router.get('/administrador/parqueadero/:idParqueadero', async (req, res) => {
    try {
        const administradores = await administradorQueries.getAdministradoresByParqueadero(req.params.idParqueadero);
        res.json({
            success: true,
            data: administradores
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener administradores',
            error: error.message
        });
    }
});

router.post('/administrador', async (req, res) => {
    try {
        const nuevoAdministrador = await administradorQueries.createAdministrador(req.body);
        res.status(201).json({
            success: true,
            data: nuevoAdministrador
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear administrador',
            error: error.message
        });
    }
});

router.delete('/administrador/:idUsuario', async (req, res) => {
    try {
        const administradorEliminado = await administradorQueries.deleteAdministrador(req.params.idUsuario);
        if (!administradorEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Administrador eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar administrador',
            error: error.message
        });
    }
});

// Rutas para Cliente
router.get('/cliente/:idUsuario', async (req, res) => {
    try {
        const cliente = await clienteQueries.getClienteByUsuarioId(req.params.idUsuario);
        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }
        res.json({
            success: true,
            data: cliente
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener cliente',
            error: error.message
        });
    }
});

router.get('/cliente/vehiculo/:idVehiculo', async (req, res) => {
    try {
        const clientes = await clienteQueries.getClientesByVehiculo(req.params.idVehiculo);
        res.json({
            success: true,
            data: clientes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener clientes',
            error: error.message
        });
    }
});

router.post('/cliente', async (req, res) => {
    try {
        const nuevoCliente = await clienteQueries.createCliente(req.body);
        res.status(201).json({
            success: true,
            data: nuevoCliente
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear cliente',
            error: error.message
        });
    }
});

router.delete('/cliente/:idUsuario', async (req, res) => {
    try {
        const clienteEliminado = await clienteQueries.deleteCliente(req.params.idUsuario);
        if (!clienteEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Cliente eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar cliente',
            error: error.message
        });
    }
});

export const rolesRoutes = router; 