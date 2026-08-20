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

# Generar el cliente de Prisma
RUN npx prisma generate

# Exponer el puerto
EXPOSE 3001

# Comando para correr (forzamos el schema para que no dé error en Docker)
CMD ["npx", "prisma", "db", "push", "--accept-data-loss", "&&", "npm", "run", "dev"]