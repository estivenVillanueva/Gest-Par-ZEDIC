import 'dotenv/config';
import client from './postgres.js';

async function selectTest() {
  try {
    await client.connect();
    const res = await client.query('SELECT * FROM test_conexion ORDER BY id DESC');
    console.log('Datos en test_conexion:');
    console.table(res.rows);
  } catch (err) {
    console.error('Error al consultar:', err);
  } finally {
    await client.end();
  }
}

selectTest(); 