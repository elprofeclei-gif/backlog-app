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
  uploadAvatar,
} from '../controllers/user.controller';

const router = Router();
const upload = multer({ storage });

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Obtener perfil del usuario logueado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 */
router.get('/me', authMiddleware, getMe);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Actualizar nombre del usuario logueado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
router.put('/me', authMiddleware, updateMe);

/**
 * @swagger
 * /api/users/password:
 *   put:
 *     summary: Cambiar contraseña del usuario logueado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 */
router.put('/password', authMiddleware, changePassword);

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: Subir imagen de perfil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar actualizado
 */
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

// --- RUTAS DE ADMIN ---

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios (Solo Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID (Solo Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del usuario
 */
router.get('/:id', authMiddleware, adminMiddleware, getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID (Solo Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put('/:id', authMiddleware, adminMiddleware, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID (Solo Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
