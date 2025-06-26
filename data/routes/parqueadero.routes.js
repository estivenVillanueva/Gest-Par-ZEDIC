import express from 'express';
import { parqueaderoQueries } from '../queries/parqueadero.queries.js';
import { geocodeAddress } from '../geocode_parqueaderos.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

cloudinary.config({
  cloud_name: 'dnuddkdyr',
  api_key: '542441745859528',
  api_secret: '44AJNiggQhxObvbIUrl0TU6MDFc'
});

const upload = multer({ storage: multer.memoryStorage() });

// Obtener todos los parqueaderos
router.get('/', async (req, res) => {
    try {
        const parqueaderos = await parqueaderoQueries.getAllParqueaderos();
        res.json({
            success: true,
            data: parqueaderos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener parqueaderos',
            error: error.message
        });
    }
});

// Obtener parqueadero por usuario_id
router.get('/usuario/:usuario_id', async (req, res) => {
    try {
        const parqueadero = await parqueaderoQueries.getParqueaderoByUsuarioId(req.params.usuario_id);
        if (!parqueadero) {
            return res.status(404).json({
                success: false,
                message: 'Parqueadero no encontrado para este usuario'
            });
        }
        res.json({
            success: true,
            data: parqueadero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener parqueadero por usuario',
            error: error.message
        });
    }
});

// Obtener un parqueadero por ID
router.get('/:id', async (req, res) => {
    try {
        const parqueadero = await parqueaderoQueries.getParqueaderoById(req.params.id);
        if (!parqueadero) {
            return res.status(404).json({
                success: false,
                message: 'Parqueadero no encontrado'
            });
        }
        res.json({
            success: true,
            data: parqueadero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener parqueadero',
            error: error.message
        });
    }
});

// Crear un nuevo parqueadero
router.post('/', async (req, res) => {
    console.log('Llamada a POST /api/parqueaderos con body:', req.body);
    try {
        let { direccion } = req.body;
        let latitud = null;
        let longitud = null;
        if (direccion) {
            try {
                const coords = await geocodeAddress(`${direccion}, Colombia`);
                if (coords) {
                    latitud = coords.lat;
                    longitud = coords.lng;
                }
            } catch (geoError) {
                console.error('Error al geocodificar dirección:', geoError);
            }
        }
        const nuevoParqueadero = await parqueaderoQueries.createParqueadero({ ...req.body, latitud, longitud });
        console.log('Parqueadero creado:', nuevoParqueadero);
        try {
            const { serviciosQueries } = await import('../queries/servicios.queries.js');
            // Crear servicio vacío asociado al parqueadero
            const servicioCreado = await serviciosQueries.createServicio({
                nombre: '',
                descripcion: '',
                precio: null,
                duracion: null,
                estado: '',
                parqueadero_id: nuevoParqueadero.id
            });
            console.log('Servicio vacío creado correctamente:', servicioCreado);
        } catch (servicioError) {
            console.error('Error al crear servicio vacío:', servicioError);
        }
        res.status(201).json({
            success: true,
            data: nuevoParqueadero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear parqueadero',
            error: error.message
        });
    }
});

// Actualizar un parqueadero
router.put('/:id', async (req, res) => {
    try {
        console.log('Datos recibidos para actualizar parqueadero:', req.body, 'ID:', req.params.id);
        const parqueaderoActualizado = await parqueaderoQueries.updateParqueadero(req.params.id, req.body);
        if (!parqueaderoActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Parqueadero no encontrado'
            });
        }
        res.json({
            success: true,
            data: parqueaderoActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar parqueadero',
            error: error.message
        });
    }
});

// Eliminar un parqueadero
router.delete('/:id', async (req, res) => {
    try {
        const parqueaderoEliminado = await parqueaderoQueries.deleteParqueadero(req.params.id);
        if (!parqueaderoEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Parqueadero no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Parqueadero eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar parqueadero',
            error: error.message
        });
    }
});

// Endpoint para subir imágenes a Cloudinary
router.post('/upload-image', upload.single('file'), async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'parqueaderos' },
      (error, result) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        res.json({ success: true, url: result.secure_url });
      }
    );
    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export const parqueaderoRoutes = router; 