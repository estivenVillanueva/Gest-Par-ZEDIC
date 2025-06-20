import { pool } from '../postgres.js';

// Registrar ingreso
async function registrarIngreso(vehiculo_id, observaciones = null) {
  const result = await pool.query(
    `INSERT INTO ingresos (vehiculo_id, observaciones) VALUES ($1, $2) RETURNING *`,
    [vehiculo_id, observaciones]
  );
  return result.rows[0];
}

// Registrar salida
async function registrarSalida(id, valor_pagado) {
  const result = await pool.query(
    `UPDATE ingresos SET hora_salida = NOW(), valor_pagado = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, valor_pagado]
  );
  return result.rows[0];
}

// Listar ingresos actuales (vehículos dentro)
async function listarIngresosActuales() {
  const result = await pool.query(
    `SELECT * FROM ingresos WHERE hora_salida IS NULL`
  );
  return result.rows;
}

// Listar historial de ingresos
async function listarHistorial() {
  const result = await pool.query(
    `SELECT * FROM ingresos ORDER BY hora_entrada DESC`
  );
  return result.rows;
}

// Obtener un ingreso con la información del servicio del vehículo
async function getIngresoConServicio(id) {
  const result = await pool.query(
    `SELECT
        i.id AS ingreso_id,
        i.hora_entrada,
        v.id AS vehiculo_id,
        s.tipo_cobro,
        s.precio,
        s.nombre AS servicio_nombre
     FROM ingresos i
     JOIN vehiculos v ON i.vehiculo_id = v.id
     LEFT JOIN servicios s ON v.servicio_id = s.id
     WHERE i.id = $1`,
    [id]
  );
  return result.rows[0];
}

export {
  registrarIngreso,
  registrarSalida,
  listarIngresosActuales,
  listarHistorial,
  getIngresoConServicio
}; 