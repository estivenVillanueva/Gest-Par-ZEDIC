import { parqueaderoQueries } from './queries/parqueadero.queries.js';

// Cambia este ID por uno que exista en tu tabla usuarios
const usuario_id = 1;

async function testInsert() {
  try {
    console.log('Iniciando inserción de parqueadero...');
    const nuevoParqueadero = await parqueaderoQueries.createParqueadero({
      nombre: 'Parqueadero de Prueba',
      ubicacion: 'Calle 123 #45-67',
      capacidad: 50,
      precio_hora: 2500,
      estado: 'activo',
      telefono: '3001234567',
      email: 'prueba@correo.com',
      direccion: 'Calle 123 #45-67',
      horarios: '24/7',
      descripcion: 'Parqueadero de prueba para test',
      usuario_id: usuario_id
    });
    console.log('Parqueadero insertado correctamente:', nuevoParqueadero);
  } catch (error) {
    console.error('Error al insertar parqueadero:', error);
  }
}

console.log('Ejecutando testInsert...');
testInsert(); 