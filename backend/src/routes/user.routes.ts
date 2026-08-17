import { Router } from 'express';
import multer from 'multer';
import { storage } from '../lib/cloudinary';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import {
  getMe,
  updateMe,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadAvatar, // <-- Importado aquí
} from '../controllers/user.controller';

const router = Router();
const upload = multer({ storage }); // Configurar Multer con Cloudinary

// Rutas para el usuario logueado (cualquiera autenticado)
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);
router.put('/password', authMiddleware, changePassword);

// Ruta para subir imagen de perfil
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

// Rutas solo para Admin (CRUD completo sobre usuarios)
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/:id', authMiddleware, adminMiddleware, getUserById);
router.put('/:id', authMiddleware, adminMiddleware, updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
