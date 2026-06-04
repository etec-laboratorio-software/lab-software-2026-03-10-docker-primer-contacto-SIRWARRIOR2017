# Docker básico

Este repositorio contiene un ejemplo mínimo de Docker Compose que sirve `index.html` con nginx.

## Archivos

- `docker-basico.yml`: definición original del servicio.
- `docker-compose.yml`: alias estándar para ejecutar con Docker Compose.
- `index.html`: página estática servida por nginx.

## Cómo ejecutar

1. Instala Docker y Docker Compose.
2. Desde la raíz del repo, ejecuta:

```bash
docker compose up
```

3. Abre en tu navegador:

```text
http://localhost:8080
```


