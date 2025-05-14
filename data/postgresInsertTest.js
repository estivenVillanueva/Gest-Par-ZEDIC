import 'dotenv/config';
import client from './postgres.js';

async function insertTest() {
  try {
    await client.connect();
    // Crear la tabla si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_conexion (
        id SERIAL PRIMARY KEY,
        mensaje TEXT,
        fecha TIMESTAMP DEFAULT NOW()
      );
    `);
    // Insertar un mensaje de prueba
    const res = await client.query(
      'INSERT INTO test_conexion (mensaje) VALUES ($1) RETURNING *',
      ['¡Hola desde Node.js!']
    );
    console.log('Dato insertado:', res.rows[0]);
  } catch (err) {
    console.error('Error al insertar:', err);
  } finally {
    await client.end();
  }
}

insertTest(); 