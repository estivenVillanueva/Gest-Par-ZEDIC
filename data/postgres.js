// data/postgres.js
// Conexión a PostgreSQL Cloud SQL usando variables de entorno

import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: 'postgres://adminGest-Par-Zedic:%7Bt17T%3ExJgq%3FKj%5Eoh@35.225.217.73:5432/gest-par-zedic-database',
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