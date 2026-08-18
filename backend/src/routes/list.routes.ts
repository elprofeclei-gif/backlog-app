import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getLists, createList, deleteList, updateList } from '../controllers/list.controller';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * /api/lists/{boardId}:
 *   get:
 *     summary: Obtener listas de un tablero
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de listas con sus tareas
 */
router.get('/:boardId', getLists);

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Crear una lista en un tablero
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               boardId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lista creada
 */
router.post('/', createList);

/**
 * @swagger
 * /api/lists/{id}:
 *   put:
 *     summary: Actualizar título de una lista
 *     tags: [Lists]
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
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lista actualizada
 */
router.put('/:id', updateList);

/**
 * @swagger
 * /api/lists/{id}:
 *   delete:
 *     summary: Eliminar una lista
 *     tags: [Lists]
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
 *         description: Lista eliminada
 */
router.delete('/:id', deleteList);

export default router;
