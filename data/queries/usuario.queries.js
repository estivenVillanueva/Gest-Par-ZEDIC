import { pool } from '../postgres.js';
import bcrypt from 'bcrypt';
import { parqueaderoQueries } from './parqueadero.queries.js';

export const usuarioQueries = {
    // Crear un nuevo usuario
    async createUsuario({ nombre, correo, password, ubicacion, tipo_usuario, rol_id, telefono, googleId, foto, verificado = false, tokenVerificacion = null }) {
        console.log('Objeto recibido en createUsuario:', { nombre, correo, password, ubicacion, tipo_usuario, rol_id, telefono, googleId, foto, verificado, tokenVerificacion });
        const correoFinal = (correo || '').trim();
        const nombreFinal = (nombre || '').trim();
        const ubicacionFinal = (ubicacion || '').trim();
        const tipoFinal = tipo_usuario || '';
        const telefonoFinal = telefono || '';
        const rolIdFinal = rol_id || 1;
        const googleIdFinal = googleId || null;
        const fotoFinal = foto || null;
        const verificadoFinal = verificado;
        const tokenVerificacionFinal = tokenVerificacion;

        if (!correoFinal) throw new Error('El campo correo es requerido');
        // Permitir usuarios Google sin password
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const values = [nombreFinal, correoFinal, hashedPassword, ubicacionFinal, tipoFinal, rolIdFinal, telefonoFinal, googleIdFinal, fotoFinal, verificadoFinal, tokenVerificacionFinal];
        console.log('Valores enviados a la base de datos:', values);

        const query = `
            INSERT INTO usuarios (nombre, correo, password, ubicacion, tipo_usuario, rol_id, telefono, googleid, foto, verificado, tokenverificacion)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
        const result = await pool.query(query, values);
        const usuario = result.rows[0];

        // Si el usuario es admin, crear parqueadero asociado automáticamente SOLO si no existe uno
        if (usuario.tipo_usuario === 'admin') {
            const existente = await parqueaderoQueries.getParqueaderoByUsuarioId(usuario.id);
            if (!existente) {
                await parqueaderoQueries.createParqueadero({
                    nombre: 'Parqueadero de ' + usuario.nombre,
                    ubicacion: usuario.ubicacion || '',
                    capacidad: 0,
                    precio_hora: 0,
                    estado: 'Activo',
                    telefono: usuario.telefono || '',
                    email: usuario.correo,
                    direccion: usuario.ubicacion || '',
                    horarios: '',
                    descripcion: '',
                    usuario_id: usuario.id
                });
            }
        }

        return usuario;
    },

    // Obtener usuario por correo
    async getUsuarioByCorreo(email) {
        const query = 'SELECT * FROM usuarios WHERE correo = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    // Obtener usuario por ID
    async getUsuarioById(id) {
        const query = 'SELECT * FROM usuarios WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Actualizar usuario
    async updateUsuario(id, data) {
        console.log('DATA RECIBIDA EN UPDATE:', data);
        const { nombre, correo, ubicacion, telefono } = data;
        const tipoUsuarioFinal = data.tipo_usuario || data.tipoUsuario;
        console.log('tipoUsuarioFinal usado en UPDATE:', tipoUsuarioFinal);
        console.log('Valores para UPDATE:', [nombre, correo, ubicacion, telefono, tipoUsuarioFinal, id]);
        const query = `
            UPDATE usuarios
            SET nombre = $1, correo = $2, ubicacion = $3, telefono = $4, tipo_usuario = $5
            WHERE id = $6
            RETURNING *
        `;
        const values = [nombre, correo, ubicacion, telefono, tipoUsuarioFinal, id];
        const result = await pool.query(query, values);
        console.log('RESULTADO DEL UPDATE:', result.rows[0]);
        return result.rows[0];
    },

    // Eliminar usuario
    async deleteUsuario(id) {
        const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Verificar credenciales
    async verifyCredentials(correo, password) {
        console.log('Buscando usuario con correo:', correo); // Log de depuración
        const usuario = await this.getUsuarioByCorreo(correo);
        console.log('Usuario encontrado:', usuario); // Log de depuración
        if (!usuario) return null;

        // Solo permitir login si el usuario está verificado
        if (!usuario.verificado) {
            throw new Error('Debes verificar tu correo antes de iniciar sesión.');
        }

        const validPassword = await bcrypt.compare(password, usuario.password);
        console.log('Password válido:', validPassword); // Log de depuración
        if (!validPassword) return null;

        // No devolver la contraseña en la respuesta
        const { password: _, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;
    },

    // Actualizar contraseña
    async updatePassword(id, nuevaContrasena) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);

        const query = `
            UPDATE usuarios
            SET contrasena = $1
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [hashedPassword, id]);
        return result.rows[0];
    },

    // Buscar usuario por Google ID
    async getUsuarioByGoogleId(googleId) {
        const query = 'SELECT * FROM usuarios WHERE googleid = $1';
        const result = await pool.query(query, [googleId]);
        return result.rows[0];
    },

    // Buscar usuario por token de verificación
    async getUsuarioByToken(token) {
        const query = 'SELECT * FROM usuarios WHERE tokenverificacion = $1';
        const result = await pool.query(query, [token]);
        return result.rows[0];
    },

    // Marcar usuario como verificado y eliminar el token
    async verificarUsuario(id) {
        const query = `
            UPDATE usuarios
            SET verificado = true, tokenverificacion = NULL
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}; 