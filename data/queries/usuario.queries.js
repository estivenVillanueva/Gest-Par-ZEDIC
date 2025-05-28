import { pool } from '../postgres.js';
import bcrypt from 'bcrypt';
import { parqueaderoQueries } from './parqueadero.queries.js';

export const usuarioQueries = {
    // Crear un nuevo usuario
    async createUsuario({ nombre, correo, password, ubicacion, tipo_usuario, rol_id, telefono, googleId, foto }) {
        console.log('Objeto recibido en createUsuario:', { nombre, correo, password, ubicacion, tipo_usuario, rol_id, telefono, googleId, foto });
        const correoFinal = (correo || '').trim();
        const nombreFinal = (nombre || '').trim();
        const ubicacionFinal = (ubicacion || '').trim();
        const tipoFinal = tipo_usuario || '';
        const telefonoFinal = telefono || '';
        const rolIdFinal = rol_id || 1;
        const googleIdFinal = googleId || null;
        const fotoFinal = foto || null;

        if (!correoFinal) throw new Error('El campo correo es requerido');
        // Permitir usuarios Google sin password
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const values = [nombreFinal, correoFinal, hashedPassword, ubicacionFinal, tipoFinal, rolIdFinal, telefonoFinal, googleIdFinal, fotoFinal];
        console.log('Valores enviados a la base de datos:', values);

        const query = `
            INSERT INTO usuarios (nombre, correo, password, ubicacion, tipo_usuario, rol_id, telefono, googleid, foto)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const result = await pool.query(query, values);
        const usuario = result.rows[0];

        // Si el usuario es admin, crear parqueadero asociado automáticamente
        if (usuario.tipo_usuario === 'admin') {
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
    async updateUsuario(id, { nombre, correo, ubicacion, telefono }) {
        const query = `
            UPDATE usuarios
            SET nombre = $1, correo = $2, ubicacion = $3, telefono = $4
            WHERE id = $5
            RETURNING *
        `;
        const values = [nombre, correo, ubicacion, telefono, id];
        const result = await pool.query(query, values);
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
    }
}; 