// data/postgres.js
// Conexión a PostgreSQL Cloud SQL usando variables de entorno

import { Client } from 'pg';

const client = new Client({
  host: process.env.PG_HOST, // Ejemplo: '35.225.217.73'
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE, // Ejemplo: 'gest-par-zedic-database'
  ssl: {
    rejectUnauthorized: false // Permite certificados autofirmados/no verificados
  }
});

export default client; 