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

        // Personalizar el correo de verificación
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background: #fafbfc;">
                <h2 style="color: #2563EB;">¡Bienvenido/a a Gest-Par-ZEDIC!</h2>
                <p>Hola <b>${nuevoUsuario.nombre}</b>,</p>
                <p>Gracias por registrarte en nuestra plataforma. Para activar tu cuenta y poder acceder a todas las funcionalidades, por favor haz clic en el siguiente botón o enlace:</p>
                <div style="text-align: center; margin: 24px 0;">
                    <a href="${urlVerificacion}" style="background: #2563EB; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Verificar mi cuenta</a>
                </div>
                <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all;">${urlVerificacion}</p>
                <hr style="margin: 24px 0;">
                <p style="color: #6b7280; font-size: 0.95em;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
                <p style="color: #6b7280; font-size: 0.95em;">Equipo Gest-Par-ZEDIC</p>
            </div>
        `;

        // Enviar correo de verificación
        await transporter.sendMail({
            from: 'Gest-Par-ZEDIC <gestparzedic@gmail.com>',
            to: nuevoUsuario.correo,
            subject: 'Confirma tu cuenta en Gest-Par-ZEDIC',
            html: htmlContent
        });

        res.status(201).json({
            success: true,
            message: 'Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.'
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

        // Buscar parqueadero asociado si es admin
        let parqueadero_id = null;
        if (usuario.tipo_usuario === 'admin') {
            // Importar aquí para evitar problemas de dependencias circulares
            const { parqueaderoQueries } = require('../queries/parqueadero.queries.js');
            const parqueadero = await parqueaderoQueries.getParqueaderoByUsuarioId(usuario.id);
            if (parqueadero) {
                parqueadero_id = parqueadero.id;
            }
        }

        // Devolver usuario + parqueadero_id
        res.json({
            success: true,
            data: { ...usuario, parqueadero_id }
        });
    } catch (error) {
        // Si el error es por usuario no verificado o credenciales, devolver 401 y el mensaje
        return res.status(401).json({
            success: false,
            message: error.message || 'Error en el login'
        });
    }
});

// Google Auth: registrar o loguear usuario con Google
router.post('/google-auth', async (req, res) => {
    try {
        const { email, nombre, foto, googleId, tipo_usuario } = req.body;
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
        const tipoUsuarioFinal = tipo_usuario || 'dueno';
        usuario = await usuarioQueries.createUsuario({
            nombre,
            correo: email,
            foto,
            googleId,
            tipo_usuario: tipoUsuarioFinal,
        });
        console.log('Usuario creado con Google:', usuario);
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
            return res.send(`
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 32px; background: #fafbfc; text-align: center;">
                    <h2 style="color: #DC2626;">¡Enlace inválido o expirado!</h2>
                    <p>El enlace de verificación no es válido o ya fue utilizado.</p>
                    <a href="https://gest-par-zedic-9gcy.vercel.app/acceder" style="display: inline-block; margin-top: 24px; background: #2563EB; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Ir a Iniciar Sesión</a>
                </div>
            `);
        }
        await usuarioQueries.verificarUsuario(usuario.id);
        res.send(`
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 32px; background: #fafbfc; text-align: center;">
                <h2 style="color: #2563EB;">¡Cuenta verificada correctamente!</h2>
                <p>Tu correo ha sido verificado exitosamente.<br>Ya puedes iniciar sesión en la plataforma.</p>
                <a href="https://gest-par-zedic-9gcy.vercel.app/acceder" style="display: inline-block; margin-top: 24px; background: #2563EB; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Ir a Iniciar Sesión</a>
            </div>
        `);
    } catch (error) {
        res.status(500).send('Error al verificar el correo.');
    }
});

export const usuarioRoutes = router; 