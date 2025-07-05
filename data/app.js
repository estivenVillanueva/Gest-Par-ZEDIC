import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { parqueaderoRoutes } from './routes/parqueadero.routes.js';
import { usuarioRoutes } from './routes/usuario.routes.js';
import { vehiculoRoutes } from './routes/vehiculo.routes.js';
import { serviciosRoutes } from './routes/servicios.routes.js';
import { facturaRoutes } from './routes/factura.routes.js';
import { rolesRoutes } from './routes/roles.routes.js';
import ingresosRoutes from './routes/ingresos.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import pagosRoutes from './routes/pagos.routes.js';
import notificacionesRoutes from './routes/notificaciones.routes.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://gest-par-zedic.onrender.com',
  'https://gest-par-zedic-9gcy.vercel.app',
  'https://gest-par-zedic-9gcy-301zqwufh-estivenvillanuevas-projects.vercel.app'
];

function corsOrigin(origin, callback) {
  if (
    !origin ||
    allowedOrigins.includes(origin) ||
    /^https:\/\/gest-par-zedic-9gcy-.*\.vercel\.app$/.test(origin)
  ) {
    callback(null, true);
  } else {
    console.warn('CORS bloqueado para el origen:', origin);
    callback(new Error('Not allowed by CORS'));
  }
}

app.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  console.log('[GLOBAL LOG] Petición recibida:', req.method, req.originalUrl);
  next();
});

// Rutas
app.use('/api/parqueaderos', parqueaderoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/ingresos', ingresosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

// Manejar preflight OPTIONS para todas las rutas
app.options('*', cors({
  origin: corsOrigin,
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

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
}); 