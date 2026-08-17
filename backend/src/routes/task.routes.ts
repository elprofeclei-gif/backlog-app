import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createTask, updateTask, deleteTask } from '../controllers/task.controller';

const router = Router();

// Proteger todas las rutas de tareas
router.use(authMiddleware);

// Rutas
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
