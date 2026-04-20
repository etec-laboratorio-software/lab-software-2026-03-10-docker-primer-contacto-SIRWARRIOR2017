# Dockerización del Proyecto PC Store

Este proyecto ha sido dockerizado para facilitar el despliegue. Incluye un backend en Node.js/Express con SQLite y un frontend en React/Vite servido con Nginx.

## Requisitos

- Docker
- Docker Compose

## Instrucciones para ejecutar

1. Asegúrate de tener Docker y Docker Compose instalados.

2. Navega al directorio raíz del proyecto.

3. Ejecuta el siguiente comando para construir y levantar los contenedores:

   ```bash
   docker-compose up --build
   ```

4. El frontend estará disponible en `http://localhost:80` (el backend está proxyeado internamente, no expuesto directamente).

## Servicios

- **backend**: API REST en Node.js, accesible internamente en el contenedor.
- **frontend**: Aplicación React servida con Nginx en puerto 80, con proxy a la API.

## Notas

- La base de datos SQLite se persiste en un volumen para no perder datos entre reinicios.
- Los archivos subidos se almacenan en `BACKEND/public/uploads`.
- El JWT_SECRET ha sido generado automáticamente; en producción, considera usar un secreto más seguro o variables de entorno.

## Desarrollo

Para desarrollo, puedes modificar los archivos y reconstruir con `docker-compose up --build`.

Si necesitas cambiar configuraciones, edita los Dockerfiles o docker-compose.yml según sea necesario.