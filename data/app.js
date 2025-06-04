import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { parqueaderoRoutes } from './routes/parqueadero.routes.js';
import { usuarioRoutes } from './routes/usuario.routes.js';
import { vehiculoRoutes } from './routes/vehiculo.routes.js';
import { serviciosRoutes } from './routes/servicios.routes.js';
import { facturaRoutes } from './routes/factura.routes.js';
import { rolesRoutes } from './routes/roles.routes.js';

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://gest-par-zedic.onrender.com',
  'https://gest-par-zedic-9gcy.vercel.app',
  'https://gest-par-zedic-9gcy-301zqwufh-estivenvillanuevas-projects.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/gest-par-zedic-9gcy-.*\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rutas
app.use('/api/parqueaderos', parqueaderoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/roles', rolesRoutes);

// Manejar preflight OPTIONS para todas las rutas
app.options('*', cors({
  origin: function(origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/gest-par-zedic-9gcy-.*\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const startServer = (port) => {
    const numericPort = typeof port === 'string' ? parseInt(port, 10) : port;
    app.listen(numericPort, () => {
        console.log(`Servidor corriendo en el puerto ${numericPort}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`El puerto ${numericPort} está en uso, intentando con el puerto ${numericPort + 1}`);
            startServer(numericPort + 1);
        } else {
            console.error('Error al iniciar el servidor:', err);
        }
    });
};

const PORT = process.env.PORT || 3000;
startServer(PORT); 