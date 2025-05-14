import 'dotenv/config';
import client from './postgres.js';

async function testConnection() {
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('¡Conexión exitosa! Fecha/hora del servidor:', res.rows[0].now);
  } catch (err) {
    console.error('Error al conectar a PostgreSQL:', err);
  } finally {
    await client.end();
  }
}

testConnection(); 