import express from 'express';
import { usuarioQueries } from '../queries/usuario.queries.js';
import { parqueaderoQueries } from '../queries/parqueadero.queries.js';

const router = express.Router();

// Obtener usuario por correo
router.get('/correo/:correo', async (req, res) => {
    try {
        const usuario = await usuarioQueries.getUsuarioByCorreo(req.params.correo);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await usuarioQueries.getUsuarioById(req.params.id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        console.log('Datos recibidos en registro:', req.body); // Log de depuración
        const nuevoUsuario = await usuarioQueries.createUsuario(req.body);
        // Si el usuario es admin, crear parqueadero automáticamente
        if (nuevoUsuario.tipo_usuario === 'admin') {
            await parqueaderoQueries.createParqueadero({
                nombre: '',
                ubicacion: '',
                capacidad: 0,
                precio_hora: '',
                estado: 'Activo',
                telefono: '',
                email: '',
                direccion: '',
                horarios: '',
                descripcion: '',
                usuario_id: nuevoUsuario.id // Relación
            });
        }
        res.status(201).json({
            success: true,
            data: nuevoUsuario
        });
    } catch (error) {
        console.error('Error al crear usuario (detalle):', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
    try {
        console.log('Datos recibidos para actualizar:', req.body); // <-- Log para depuración
        const usuarioActualizado = await usuarioQueries.updateUsuario(req.params.id, req.body);
        if (!usuarioActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            success: true,
            data: usuarioActualizado
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error); // <-- Imprime el error completo
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
    try {
        const usuarioEliminado = await usuarioQueries.deleteUsuario(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        console.log('Dato recibido en login:', req.body); // Log de depuración
        const { correo, password, contrasena } = req.body;
        const pass = password || contrasena;
        const usuario = await usuarioQueries.verifyCredentials(correo, pass);
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        console.error('Error en login:', error); // Log de error
        res.status(500).json({
            success: false,
            message: 'Error en el login',
            error: error.message
        });
    }
});

export const usuarioRoutes = router; 