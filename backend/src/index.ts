import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet'; // <-- Nuevo
import rateLimit from 'express-rate-limit'; // <-- Nuevo
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import boardRoutes from './routes/board.routes';
import listRoutes from './routes/list.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

// Crear carpeta de uploads si no existe
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3001;

// 1. HELMET: Configura cabeceras HTTP de seguridad (oculta que usas Express, etc.)
app.use(helmet());

// 2. CORS RESTRINGIDO: Solo permite peticiones desde tu frontend real
const allowedOrigins = [
  'http://localhost:5173', // Desarrollo local
  'https://backlog-app-self.vercel.app', // Producción (Vercel)
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Si la petición no tiene origen (ej: Postman) o está en la lista, la permitimos
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
  })
);

// 3. RATE LIMITING: Evita ataques de fuerza bruta en el login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limita a 10 peticiones por IP cada 15 minutos
  message: { message: 'Demasiados intentos desde esta IP, por favor intenta en 15 minutos.' },
});

// Middlewares básicos
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Rutas
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Backlog API is running' });
});

// Aplicamos el limitador SOLO a las rutas de autenticación
app.use('/api/auth', authLimiter, authRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Solo escuchamos si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Exportamos la app para poder probarla con Supertest
export { app };
