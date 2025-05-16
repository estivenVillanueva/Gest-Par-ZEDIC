import { pool } from '../postgres.js';
import bcrypt from 'bcrypt';

export const usuarioQueries = {
    // Crear un nuevo usuario
    async createUsuario({ nombre, email, password, ubicacion, tipoUsuario, tipo_usuario }) {
        console.log('Password recibido para hash:', password); // Log de depuración
        if (!password) {
            throw new Error('El campo password es requerido');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Usar tipo_usuario si existe, si no, usar tipoUsuario
        const tipo = tipo_usuario || tipoUsuario;

        const query = `
            INSERT INTO usuarios (nombre, correo, password, ubicacion, tipo_usuario)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [nombre, email, hashedPassword, ubicacion, tipo];
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
    async updateUsuario(id, { nombre, email, ubicacion }) {
        const query = `
            UPDATE usuarios
            SET nombre = $1, correo = $2, ubicacion = $3
            WHERE id = $4
            RETURNING *
        `;
        const values = [nombre, email, ubicacion, id];
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