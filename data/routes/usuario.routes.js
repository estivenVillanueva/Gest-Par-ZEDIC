import express from 'express';
import { usuarioQueries } from '../queries/usuario.queries.js';
import { parqueaderoQueries } from '../queries/parqueadero.queries.js';
import dns from 'dns';
import { promisify } from 'util';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = express.Router();

const resolveMx = promisify(dns.resolveMx);

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
        // Generar token de verificación
        const token = crypto.randomBytes(32).toString('hex');
        // Crear usuario como no verificado
        const nuevoUsuario = await usuarioQueries.createUsuario({
            ...req.body,
            verificado: false,
            tokenVerificacion: token
        });

        // Configurar Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gestparzedic@gmail.com',
                pass: 'bakmbvndonibatee'
            }
        });

        const urlVerificacion = `https://gest-par-zedic.onrender.com/api/usuarios/verificar/${token}`;

        // Enviar correo de verificación
        await transporter.sendMail({
            from: 'gestparzedic@gmail.com',
            to: nuevoUsuario.correo,
            subject: 'Verifica tu correo',
            html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
                   <a href="${urlVerificacion}">${urlVerificacion}</a>`
        });

        res.status(201).json({
            success: true,
            data: nuevoUsuario,
            message: 'Usuario creado. Se ha enviado un correo de verificación.'
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

// Google Auth: registrar o loguear usuario con Google
router.post('/google-auth', async (req, res) => {
    try {
        const { email, nombre, foto, googleId } = req.body;
        // Buscar usuario por correo
        let usuario = await usuarioQueries.getUsuarioByCorreo(email);
        if (usuario) {
            if (usuario.googleId || usuario.googleid) {
                // Ya está registrado con Google, permitir login
                return res.json({
                    success: true,
                    data: usuario
                });
            } else {
                // Existe con ese correo pero no con Google
                return res.status(400).json({
                    success: false,
                    message: 'Este correo ya está registrado sin Google. Usa tu método de acceso original.'
                });
            }
        }
        // Si no existe, crear nuevo usuario
        usuario = await usuarioQueries.createUsuario({
            nombre,
            correo: email,
            foto,
            googleId,
            tipo_usuario: 'dueno', // o el tipo que prefieras por defecto
        });
        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        console.error('Error en google-auth:', error);
        res.status(500).json({
            success: false,
            message: 'Error en la autenticación con Google',
            error: error.message
        });
    }
});

// Endpoint para verificar si un correo ya está registrado
router.post('/verificar-email', async (req, res) => {
    try {
        const { email } = req.body;
        // Buscar usuario por correo en la base de datos
        const usuario = await usuarioQueries.getUsuarioByCorreo(email);
        res.json({ exists: !!usuario });
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar el correo electrónico' });
    }
});

// Endpoint para verificar si el dominio del correo es válido (tiene MX)
router.post('/verificar-correo-existente', async (req, res) => {
    try {
        const { email } = req.body;
        const domain = email.split('@')[1];
        try {
            const mxRecords = await resolveMx(domain);
            if (mxRecords && mxRecords.length > 0) {
                return res.json({ isValid: true });
            }
        } catch (error) {
            return res.json({ isValid: false });
        }
        return res.json({ isValid: false });
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar el dominio del correo' });
    }
});

// Endpoint para verificar el correo electrónico
router.get('/verificar/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const usuario = await usuarioQueries.getUsuarioByToken(token);
        if (!usuario) {
            return res.status(400).send('Token inválido o expirado');
        }
        await usuarioQueries.verificarUsuario(usuario.id);
        res.send('¡Correo verificado correctamente! Ya puedes iniciar sesión.');
    } catch (error) {
        res.status(500).send('Error al verificar el correo.');
    }
});

export const usuarioRoutes = router; 