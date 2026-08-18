import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import boardRoutes from './routes/board.routes';
import listRoutes from './routes/list.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import fs from 'fs';

// Crear carpeta de uploads si no existe
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' })); // En producción es mejor configurar esto con la URL exacta de Vercel, pero '*' nos sirve para probar
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Backlog API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
