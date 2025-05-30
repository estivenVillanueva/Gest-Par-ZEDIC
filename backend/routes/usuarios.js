const express = require('express');
const router = express.Router();
const dns = require('dns');
const { promisify } = require('util');
const resolveMx = promisify(dns.resolveMx);

// Verificar si un correo ya está registrado
router.post('/verificar-email', async (req, res) => {
  try {
    const { email } = req.body;
    // Aquí deberías verificar en tu base de datos si el correo existe
    // Por ahora retornamos false como ejemplo
    res.json({ exists: false });
  } catch (error) {
    console.error('Error al verificar email:', error);
    res.status(500).json({ error: 'Error al verificar el correo electrónico' });
  }
});

// Verificar si el dominio del correo es válido
router.post('/verificar-correo-existente', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Extraer el dominio del correo
    const domain = email.split('@')[1];
    
    // Verificar si el dominio tiene registros MX (servidores de correo)
    try {
      const mxRecords = await resolveMx(domain);
      if (mxRecords && mxRecords.length > 0) {
        // El dominio es válido y tiene servidores de correo
        return res.json({ isValid: true });
      }
    } catch (error) {
      // Si hay error al resolver MX, el dominio no es válido
      return res.json({ isValid: false });
    }
    
    return res.json({ isValid: false });
  } catch (error) {
    console.error('Error al verificar correo:', error);
    res.status(500).json({ error: 'Error al verificar el correo electrónico' });
  }
});

module.exports = router; 