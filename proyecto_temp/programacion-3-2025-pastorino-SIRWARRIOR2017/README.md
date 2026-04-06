# PC Store - E-commerce de Componentes de PC

Sistema completo de e-commerce para venta de componentes de computadoras con panel de administración, carrito de compras y contacto de servicio técnico.

---

## 📋 Descripción del Proyecto

**PC Store** es una aplicación web fullstack para la venta de componentes de PC que incluye:

### Funcionalidades Principales

#### Para Clientes:
- 🔐 Registro e inicio de sesión con email y contraseña
- 🛍️ Catálogo de productos con búsqueda y filtros por categoría
- 🛒 Carrito de compras con gestión de cantidades
- 💳 Proceso de checkout y pago
- 📦 Historial de órdenes de compra
- 🔧 Información de servicio técnico
- 👤 Perfil de usuario
- 🖥️ PC Builder - Constructor de PC personalizado

#### Para Administradores:
- 📊 Dashboard con estadísticas y gráficos
- 📦 Gestión completa de productos (crear, editar, eliminar) con carga de imágenes
- 📋 Administración de órdenes y cambio de estados
- 🔧 Gestión de solicitudes de servicio técnico
- 👥 Administración de usuarios y roles
- 📈 Sistema de reportes

---

## 🚀 Inicio Rápido con Docker

### Requisitos Previos

- **Docker** - [Descargar aquí](https://www.docker.com/get-started)
- **Docker Compose** (incluido con Docker Desktop)

Para verificar la instalación:
```bash
docker --version
docker compose version
```

### Instalación e Inicio

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker compose up --build
```

**Salida esperada:**
```
[+] Building ...
[+] Running ...
backend-1  | ✅ Conexión a la base de datos exitosa
backend-1  | 📊 Sincronizando modelos con la base de datos...
backend-1  | ✅ Modelos sincronizados correctamente.
backend-1  | 🚀 Servidor ejecutándose en puerto 3000
frontend-1 | /docker-entrypoint.sh: Configuration complete; ready for start up
frontend-1 | 2024/xx/xx xx:xx:xx [notice] 1#1: using the "epoll" event method
```

### Acceder a la Aplicación

Abre tu navegador en: **http://localhost:80**

El backend no tiene puerto publicado en el host; solo el frontend Nginx expone el puerto 80.
Todas las peticiones a `/api` son proxyadas internamente al backend en el contenedor.

### Detener la Aplicación

Presiona `Ctrl+C` en la terminal o ejecuta:
```bash
docker compose down
```

### Desarrollo Local (Opcional)

Si prefieres desarrollo local sin Docker:

#### Requisitos
- Node.js (versión 16+) - [Descargar aquí](https://nodejs.org/)

#### Configuración
1. Configura `.env` en `BACKEND/` (copia de `.env.example`)
2. Configura `.env` en `FRONTEND/` (copia de `.env.example`)

#### Inicio
- Backend: `cd BACKEND && npm install && npm start`
- Frontend: `cd FRONTEND && npm install && npm run dev`

Accede en: **http://localhost:5173**

---

## 🔑 Credenciales de Acceso

### Usuario Administrador (Pre-configurado)
```
Email: admin@pcstore.com
Contraseña: admin123
```

### Usuario Cliente
- Puedes crear una cuenta nueva con email y contraseña desde la página de registro

---

## 🧪 Probar la API con request.http

El archivo `request.http` contiene todas las peticiones HTTP para probar los endpoints de la API de forma manual.

### ¿Cómo usar request.http?

#### 1. Instalar la Extensión en VS Code

- Abre VS Code
- Ve a Extensions (Ctrl+Shift+X o Cmd+Shift+X)
- Busca "REST Client" de Huachao Mao
- Instala la extensión

#### 2. Abrir el archivo

```bash
# En VS Code, abre el archivo:
request.http
```

#### 3. Ejecutar Peticiones

1. **Haz clic** en el texto "Send Request" que aparece sobre cada petición HTTP
2. La respuesta aparecerá en una nueva pestaña a la derecha

#### 4. Flujo de Prueba Recomendado

**Paso 1: Verificar que el backend esté corriendo**
```http
### Health Check
GET {{baseUrl}}/health
```

**Paso 2: Registrar un usuario nuevo**
```http
### Registrar nuevo usuario
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "phone": "+549261234567"
}
```

**Paso 3: Hacer login**
```http
### Login
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Paso 4: Copiar el token JWT**

La respuesta del login incluirá un token JWT. Ejemplo:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Paso 5: Actualizar el token en las variables**

Al inicio del archivo `request.http`, actualiza la variable:
```http
@token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Paso 6: Probar endpoints protegidos**

Ahora puedes ejecutar peticiones que requieren autenticación:
```http
### Obtener carrito del usuario
GET {{baseUrl}}/api/cart
Authorization: Bearer {{token}}
```

#### 5. Variables Disponibles

El archivo usa variables para facilitar las pruebas:

```http
@baseUrl = http://localhost
@token = your_jwt_token_here          # Token de usuario normal
@adminToken = your_admin_jwt_token_here  # Token de administrador
```

Para obtener el token de admin:
1. Haz login con: `admin@pcstore.com` / `admin123`
2. Copia el token de la respuesta
3. Pégalo en `@adminToken`

#### 6. Ejemplos de Peticiones Comunes

**Ver todos los productos:**
```http
GET {{baseUrl}}/api/products
```

**Agregar producto al carrito:**
```http
POST {{baseUrl}}/api/cart
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

**Crear una orden (checkout):**
```http
POST {{baseUrl}}/api/orders
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "shippingAddress": "Calle Falsa 123, Ciudad",
  "shippingMethod": "standard",
  "paymentMethod": "credit_card"
}
```

**Crear producto (solo admin):**
```http
POST {{baseUrl}}/api/products
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "Tarjeta Gráfica RTX 4090",
  "description": "GPU de alta gama",
  "price": 250000,
  "stock": 5,
  "categoryId": 1,
  "brand": "NVIDIA"
}
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** + **Express** - Servidor y API REST
- **Sequelize** + **SQLite** - ORM y base de datos
- **JWT (jsonwebtoken)** - Autenticación y autorización
- **Multer** - Carga de imágenes
- **bcrypt** - Encriptación de contraseñas
- **Helmet.js** - Headers de seguridad HTTP
- **Winston** - Logger profesional
- **Express Rate Limit** - Protección contra ataques de fuerza bruta
- **Express Validator** - Validación y sanitización de datos
- **Compression** - Compresión de respuestas HTTP

### Frontend
- **React 18** + **Vite** - Framework y bundler
- **Material-UI (MUI)** - Componentes UI
- **React Router** - Navegación con lazy loading
- **React Hot Toast** - Notificaciones
- **Lucide React** - Iconos
- **Axios** - Cliente HTTP con retry logic y timeout
- **Error Boundaries** - Manejo robusto de errores

---

## 🔒 Características de Seguridad

Este proyecto implementa múltiples capas de seguridad tanto en el backend como en el frontend:

### Backend
- ✅ **Validación JWT obligatoria** - El servidor no inicia sin `JWT_SECRET` configurado
- ✅ **Rate Limiting** - Protección contra ataques de fuerza bruta (5 intentos de login cada 15 minutos)
- ✅ **Helmet.js** - Headers de seguridad HTTP (CSP, X-Frame-Options, etc.)
- ✅ **Express Validator** - Validación y sanitización completa de todos los inputs
- ✅ **Contraseñas seguras** - Requisitos: 8+ caracteres, mayúsculas, minúsculas y números
- ✅ **Hashing con bcrypt** - Contraseñas hasheadas con 10 rounds de salt
- ✅ **Contraseñas temporales seguras** - Generadas con `crypto.randomBytes()`
- ✅ **Logger profesional (Winston)** - No expone información sensible en producción
- ✅ **Manejo de errores diferenciado** - Mensajes detallados en desarrollo, genéricos en producción
- ✅ **Compresión HTTP** - Respuestas comprimidas con gzip
- ✅ **JSON.parse seguro** - Try/catch en todos los parseos de JSON
- ✅ **CORS configurado** - Solo permite solicitudes del frontend autorizado

### Frontend
- ✅ **Validación de tarjetas (Algoritmo de Luhn)** - Valida números de tarjeta de crédito reales
- ✅ **Validación de contraseñas robusta** - 8+ caracteres con requisitos de complejidad
- ✅ **Timeout en requests (30s)** - Previene requests colgados
- ✅ **Retry logic con exponential backoff** - Reintenta automáticamente fallos de red
- ✅ **Error Boundaries** - Captura y maneja errores de React gracefully
- ✅ **Lazy Loading** - Carga componentes bajo demanda (mejora performance)
- ✅ **Variables de entorno** - URLs y configuración externalizadas
- ✅ **Auto-logout por inactividad** - Sesión expira después de 30 minutos de inactividad
- ✅ **Detección de usuarios bloqueados** - Manejo automático de cuentas bloqueadas

### Validaciones Implementadas
- **Productos**: Nombre, precio, stock, categoría con sanitización HTML
- **Usuarios**: Email, teléfono, dirección, roles
- **Órdenes**: Items mínimos, direcciones válidas, estados
- **Autenticación**: Email válido, contraseñas seguras
- **Tarjetas de crédito**: Algoritmo de Luhn, CVV según tipo de tarjeta, fecha de expiración

---

## 📁 Estructura del Proyecto

```
programacion-3-2025-pastorino-SIRWARRIOR2017/
├── BACKEND/
│   ├── src/
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── models/           # Modelos de base de datos (Sequelize)
│   │   ├── routes/           # Rutas de la API REST
│   │   ├── middleware/       # Autenticación JWT y validaciones
│   │   ├── validators/       # Express-validator schemas
│   │   ├── utils/            # Utilidades (logger)
│   │   ├── config/           # Configuración (DB, Passport)
│   │   └── app.js           # Punto de entrada del servidor
│   ├── logs/                 # Logs de Winston (error.log, combined.log)
│   ├── public/uploads/       # Imágenes de productos subidas
│   ├── database.sqlite       # Base de datos SQLite
│   ├── .env                 # Variables de entorno (NO commitear)
│   └── .env.example         # Ejemplo de variables de entorno
│
├── FRONTEND/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── ErrorBoundary.jsx  # Manejo de errores React
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/           # Páginas de la aplicación
│   │   │   ├── admin/       # Panel administrativo
│   │   │   └── user/        # Páginas de usuario
│   │   ├── contexts/        # Context API (AuthContext, CartContext, etc.)
│   │   ├── services/        # API client (axios)
│   │   ├── utils/           # Utilidades (validación de tarjetas)
│   │   ├── theme.js         # Tema personalizado Material-UI
│   │   └── App.jsx          # Componente principal con lazy loading
│   ├── .env                 # Variables de entorno del frontend
│   ├── .env.example         # Ejemplo de variables de entorno
│   └── package.json
│
├── request.http              # Archivo de pruebas HTTP para REST Client
└── README.md                # Documentación completa del proyecto
```

---

## ❓ Solución de Problemas

### El backend no inicia

```bash
# Verifica que el puerto 3000 no esté en uso
lsof -i :3000

# Reinstala dependencias
cd BACKEND
rm -rf node_modules package-lock.json
npm install
```

### El frontend no inicia

```bash
# Verifica que el puerto 5173 no esté en uso
lsof -i :5173

# Reinstala dependencias
cd FRONTEND
rm -rf node_modules package-lock.json
npm install
```

### Las imágenes no se ven

```bash
# Crea la carpeta de uploads si no existe
mkdir -p BACKEND/public/uploads
```

### Resetear la base de datos

```bash
cd BACKEND
rm database.sqlite
npm start  # Se creará una nueva base de datos con el usuario admin
```

---

## 📚 Comandos Rápidos

### Backend
```bash
cd BACKEND
npm install          # Instalar dependencias
npm start           # Iniciar servidor (producción)
npm run dev         # Iniciar con nodemon (desarrollo)
```

### Frontend
```bash
cd FRONTEND
npm install          # Instalar dependencias
npm run dev         # Servidor de desarrollo
npm run build       # Build para producción
```

---

## 📞 Contacto

Proyecto desarrollado para la materia **Programación 3 - 2025**

---

**¡Listo para empezar!**

```bash
# Terminal 1 - Backend
cd BACKEND && npm install && npm start

# Terminal 2 - Frontend
cd FRONTEND && npm install && npm run dev

# Abre http://localhost:5173 en tu navegador
```
