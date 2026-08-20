# Usar imagen oficial de Node
FROM node:20-alpine

# Crear carpeta de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Comando para correr Vite y permitir conexiones externas (necesario en Docker)
CMD ["npm", "run", "dev", "--", "--host"]