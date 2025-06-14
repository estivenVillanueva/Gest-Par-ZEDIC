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

export default {
  registrarIngreso,
  registrarSalida,
  listarIngresosActuales,
  listarHistorial
}; 