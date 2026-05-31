const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const models = require('./models');
const logger = require('./utils/logger');
const { initDatabase } = require('./scripts/init');

const app = express();
const PORT = process.env.PORT || 3000;

// ============ VALIDACIÓN DE VARIABLES DE ENTORNO CRÍTICAS ============
if (!process.env.JWT_SECRET) {
  logger.error('FATAL: JWT_SECRET is not defined in environment variables');
  console.error('❌ ERROR: JWT_SECRET no está configurado. El servidor no puede iniciar de forma segura.');
  process.exit(1);
}

// ============ MIDDLEWARES DE SEGURIDAD ============
// Helmet para headers de seguridad HTTP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http://localhost:5173"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Permitir recursos cross-origin
}));

// Compresión de respuestas HTTP
app.use(compression());

// Rate limiting general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por IP
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting específico para autenticación (más restrictivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 intentos de login
  message: 'Demasiados intentos de inicio de sesión, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // no cuenta requests exitosos
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ============ MIDDLEWARES BÁSICOS ============
// Configurar CORS para permitir el frontend y credenciales cuando sea necesario
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes de productos)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ============ IMPORTAR RUTAS ============
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const orderItemRoutes = require('./routes/orderItems');
const serviceRequestRoutes = require('./routes/serviceRequests');
const cartRoutes = require('./routes/cart');
const siteSettingsRoutes = require('./routes/siteSettings');

// ============ RUTAS BÁSICAS ============
app.get('/', (req, res) => {
  res.json({
    message: 'PC Store Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      health: '/health'
    }
  });
});

app.get('/health', async (req, res) => {
  try {
    await testConnection();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      details: err.message
    });
  }
});

// ============ RUTAS DE LA API ============
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/site-settings', siteSettingsRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// ============ MANEJO DE ERRORES ============
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);

  // En producción, no exponer detalles del error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong!'
    : err.message;

  const errorResponse = {
    error: message,
    status: statusCode
  };

  // Solo incluir stack trace en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
});

// ============ INICIO DEL SERVIDOR ============
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();

    // Inicializar la base de datos (sincronizar, seedear si es necesario)
    logger.info('🔄 Inicializando base de datos...');
    await initDatabase();
    logger.info('✅ Base de datos inicializada correctamente.');

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      logger.info(`🌐 API disponible en: http://localhost:${PORT}`);
      logger.info(`🔒 Modo: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🛡️ Seguridad: Helmet activo, Rate limiting activo`);
    });
  } catch (error) {
    logger.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();