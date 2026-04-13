# Dockerfile para el backend
FROM node:18-alpine

# Instalar dependencias del sistema para bcrypt y otras
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Crear directorio para la base de datos
RUN mkdir -p /app/database

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]