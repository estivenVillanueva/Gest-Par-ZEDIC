// data/postgres.js
// Conexión a PostgreSQL Cloud SQL usando variables de entorno

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST, // La IP pública de tu instancia de Cloud SQL
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // Necesario para conexiones SSL con Cloud SQL
    }
});

// Probar la conexión
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error al conectar con la base de datos:', err.stack);
    }
    console.log('Conexión exitosa a la base de datos PostgreSQL en Google Cloud SQL');
    release();
}); 