import { pool } from './postgres.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
    let client;
    try {
        // Obtener un cliente del pool
        client = await pool.connect();
        console.log('Conexión establecida con la base de datos');

        // Leer el archivo SQL
        const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        
        // Ejecutar el SQL
        await client.query(sql);
        
        console.log('Tabla de usuarios creada exitosamente');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message);
        if (error.code === '42P07') {
            console.log('La tabla ya existe, continuando...');
        } else {
            throw error;
        }
    } finally {
        // Liberar el cliente
        if (client) {
            client.release();
        }
        // No cerramos el pool aquí para mantener la conexión disponible
    }
}

// Ejecutar la inicialización
initDatabase().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
}); 