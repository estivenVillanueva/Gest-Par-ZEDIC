import express from 'express';
import { usuarioQueries } from '../queries/usuario.queries.js';
import { parqueaderoQueries } from '../queries/parqueadero.queries.js';
import dns from 'dns';
import { promisify } from 'util';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { notificacionesQueries, crearYEmitirNotificacion } from '../queries/notificaciones.queries.js';

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
        // Validar formato de correo si se va a cambiar
        if (req.body.correo) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(req.body.correo)) {
                return res.status(400).json({ success: false, message: 'El formato del correo no es válido' });
            }
        }
        const usuarioActualizado = await usuarioQueries.updateUsuario(req.params.id, req.body);
        if (!usuarioActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        // Si el correo fue cambiado, enviar correo de verificación
        if (usuarioActualizado.nuevoToken) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'gestparzedic@gmail.com',
                    pass: 'bakmbvndonibatee'
                }
            });
            const urlVerificacion = `https://gest-par-zedic.onrender.com/api/usuarios/verificar/${usuarioActualizado.nuevoToken}`;
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background: #fafbfc;">
                    <h2 style="color: #2563EB;">¡Verifica tu nuevo correo en Gest-Par-ZEDIC!</h2>
                    <p>Hola <b>${usuarioActualizado.nombre}</b>,</p>
                    <p>Has solicitado cambiar tu correo. Para activar tu cuenta y poder acceder a todas las funcionalidades, por favor haz clic en el siguiente botón o enlace:</p>
                    <div style="text-align: center; margin: 24px 0;">
                        <a href="${urlVerificacion}" style="background: #2563EB; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Verificar mi nuevo correo</a>
                    </div>
                    <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                    <p style="word-break: break-all;">${urlVerificacion}</p>
                    <hr style="margin: 24px 0;">
                    <p style="color: #6b7280; font-size: 0.95em;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
                    <p style="color: #6b7280; font-size: 0.95em;">Equipo Gest-Par-ZEDIC</p>
                </div>
            `;
            await transporter.sendMail({
                from: 'Gest-Par-ZEDIC <gestparzedic@gmail.com>',
                to: usuarioActualizado.correo,
                subject: 'Verifica tu nuevo correo en Gest-Par-ZEDIC',
                html: htmlContent
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
                let parqueadero_id = null;
                if (usuario.tipo_usuario === 'admin') {
                    const parqueadero = await parqueaderoQueries.getParqueaderoByUsuarioId(usuario.id);
                    if (parqueadero) {
                        parqueadero_id = parqueadero.id;
                    }
                }
                return res.json({
                    success: true,
                    data: { ...usuario, parqueadero_id }
                });
            } else {
                // Existe con ese correo pero no con Google
                return res.status(400).json({
                    success: false,
                    message: 'Este correo ya está registrado sin Google. Usa tu método de acceso original.'
                });
            }
        }
        // Si no existe, crear nuevo usuario con verificación
        const token = crypto.randomBytes(32).toString('hex');
        usuario = await usuarioQueries.createUsuario({
            nombre,
            correo: email,
            foto,
            googleId,
            tipo_usuario: tipo_usuario || 'dueno',
            verificado: false,
            tokenVerificacion: token
        });
        // Buscar parqueadero asociado si es admin
        let parqueadero_id = null;
        if (usuario.tipo_usuario === 'admin') {
            const parqueadero = await parqueaderoQueries.getParqueaderoByUsuarioId(usuario.id);
            if (parqueadero) {
                parqueadero_id = parqueadero.id;
            }
        }
        // Configurar Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gestparzedic@gmail.com',
                pass: 'bakmbvndonibatee'
            }
        });
        const urlVerificacion = `https://gest-par-zedic.onrender.com/api/usuarios/verificar/${token}`;
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background: #fafbfc;">
                <h2 style="color: #2563EB;">¡Bienvenido/a a Gest-Par-ZEDIC!</h2>
                <p>Hola <b>${usuario.nombre}</b>,</p>
                <p>Gracias por registrarte en nuestra plataforma con Google. Para activar tu cuenta y poder acceder a todas las funcionalidades, por favor haz clic en el siguiente botón o enlace:</p>
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
        await transporter.sendMail({
            from: 'Gest-Par-ZEDIC <gestparzedic@gmail.com>',
            to: usuario.correo,
            subject: 'Confirma tu cuenta en Gest-Par-ZEDIC',
            html: htmlContent
        });
        res.json({
            success: true,
            message: 'Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.',
            data: { ...usuario, parqueadero_id }
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

// Crear notificación y emitir en tiempo real
router.post('/notificaciones', async (req, res) => {
  try {
    const notificacion = await crearYEmitirNotificacion(req.io, req.body);
    res.status(201).json({ success: true, data: notificacion });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar notificaciones por usuario
router.get('/:usuario_id/notificaciones', async (req, res) => {
  try {
    const notificaciones = await notificacionesQueries.listarPorUsuario(req.params.usuario_id);
    res.json({ success: true, data: notificaciones });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Marcar notificación como leída
router.put('/notificaciones/:id/leida', async (req, res) => {
  try {
    const notificacion = await notificacionesQueries.marcarLeida(req.params.id);
    res.json({ success: true, data: notificacion });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar notificaciones por parqueadero
router.get('/parqueadero/:parqueadero_id/notificaciones', async (req, res) => {
  try {
    const notificaciones = await notificacionesQueries.listarPorParqueadero(req.params.parqueadero_id);
    res.json({ success: true, data: notificaciones });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Marcar todas las notificaciones como leídas para un usuario
router.put('/notificaciones/:usuario_id/todas-leidas', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await notificacionesQueries.marcarTodasLeidas(usuario_id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al marcar todas como leídas', error: error.message });
  }
});

// Marcar todas las notificaciones como leídas para un parqueadero
router.put('/notificaciones/parqueadero/:parqueadero_id/todas-leidas', async (req, res) => {
  const { parqueadero_id } = req.params;
  const result = await notificacionesQueries.marcarTodasLeidasParqueadero(parqueadero_id);
  res.json({ success: true, data: result });
});

// Recuperar contraseña - enviar email con token
router.post('/reset-password', async (req, res) => {
    try {
        const { correo } = req.body;
        if (!correo) {
            return res.status(400).json({ success: false, message: 'Correo requerido' });
        }
        const usuario = await usuarioQueries.getUsuarioByCorreo(correo);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'No existe una cuenta con este correo electrónico' });
        }
        // Generar token y guardar en la base de datos
        const token = crypto.randomBytes(32).toString('hex');
        await usuarioQueries.setResetToken(usuario.id, token);
        // Configurar Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gestparzedic@gmail.com',
                pass: 'bakmbvndonibatee'
            }
        });
        const urlRecuperar = `https://gest-par-zedic.vercel.app/recuperar-contrasena/${token}`;
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background: #fafbfc;">
                <h2 style="color: #2563EB;">Recupera tu contraseña</h2>
                <p>Hola <b>${usuario.nombre}</b>,</p>
                <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente botón o enlace para crear una nueva contraseña:</p>
                <div style="text-align: center; margin: 24px 0;">
                    <a href="${urlRecuperar}" style="background: #2563EB; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Restablecer contraseña</a>
                </div>
                <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all;">${urlRecuperar}</p>
                <hr style="margin: 24px 0;">
                <p style="color: #6b7280; font-size: 0.95em;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
                <p style="color: #6b7280; font-size: 0.95em;">Equipo Gest-Par-ZEDIC</p>
            </div>
        `;
        await transporter.sendMail({
            from: 'Gest-Par-ZEDIC <gestparzedic@gmail.com>',
            to: usuario.correo,
            subject: 'Recupera tu contraseña en Gest-Par-ZEDIC',
            html: htmlContent
        });
        res.json({ success: true, message: 'Te hemos enviado un correo con instrucciones para restablecer tu contraseña.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al enviar el correo de recuperación', error: error.message });
    }
});

// Cambiar contraseña usando el token
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { nuevaContrasena } = req.body;
        if (!nuevaContrasena || nuevaContrasena.length < 6) {
            return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
        }
        const usuario = await usuarioQueries.resetPasswordWithToken(token, nuevaContrasena);
        if (!usuario) {
            return res.status(400).json({ success: false, message: 'Token inválido o expirado.' });
        }
        res.json({ success: true, message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error al actualizar la contraseña.' });
    }
});

// Eliminar notificación por id
router.delete('/notificaciones/:id', async (req, res) => {
  try {
    const notificacion = await notificacionesQueries.eliminarNotificacion(req.params.id);
    if (!notificacion) {
      return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    }
    res.json({ success: true, data: notificacion });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cambiar contraseña de usuario
router.put('/:id/password', async (req, res) => {
    try {
        const { nuevaContrasena } = req.body;
        if (!nuevaContrasena) {
            return res.status(400).json({ success: false, message: 'La nueva contraseña es requerida' });
        }
        const usuarioActualizado = await usuarioQueries.updatePassword(req.params.id, nuevaContrasena);
        if (!usuarioActualizado) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar contraseña', error: error.message });
    }
});

export const usuarioRoutes = router; 