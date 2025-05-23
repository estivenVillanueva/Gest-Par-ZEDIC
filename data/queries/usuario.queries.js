import { pool } from '../postgres.js';
import bcrypt from 'bcrypt';

export const usuarioQueries = {
    // Crear un nuevo usuario
    async createUsuario(obj) {
        console.log('Objeto recibido en createUsuario:', obj);
        const correoFinal = (obj.correo || obj.Correo || obj.email || obj.Email || '').trim();
        const nombreFinal = (obj.nombre || obj.Nombre || '').trim();
        const passwordFinal = obj.password || obj.Password || '';
        const ubicacionFinal = (obj.ubicacion || obj.Ubicacion || '').trim();
        const tipoFinal = obj.tipo_usuario || obj.tipoUsuario || obj.Tipo_usuario || obj.TipoUsuario || '';
        const telefonoFinal = obj.telefono || obj.Telefono || '';

        if (!correoFinal) throw new Error('El campo correo es requerido');
        if (!passwordFinal) throw new Error('El campo password es requerido');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordFinal, salt);

        const values = [nombreFinal, correoFinal, hashedPassword, ubicacionFinal, tipoFinal, telefonoFinal];
        console.log('Valores enviados a la base de datos:', values);

        const query = `
            INSERT INTO usuarios (nombre, correo, password, ubicacion, tipo_usuario, telefono)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const result = await pool.query(query, values);
        return result.rows[0];
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
    }
}; 