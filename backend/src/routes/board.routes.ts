import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createBoard,
  getBoards,
  getBoardById,
  deleteBoard,
  updateBoard,
  reorderBoards,
} from '../controllers/board.controller';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * /api/boards:
 *   post:
 *     summary: Crear un nuevo tablero
 *     tags: [Boards]
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
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tablero creado
 */
router.post('/', createBoard);

/**
 * @swagger
 * /api/boards:
 *   get:
 *     summary: Obtener todos los tableros del usuario
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tableros
 */
router.get('/', getBoards);
/**
 * @swagger
 * /api/boards/reorder:
 *   put:
 *     summary: Reordenar tableros arrastrando y soltando
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     order:
 *                       type: number
 *     responses:
 *       200:
 *         description: Orden de los tableros actualizado
 */
router.put('/reorder', reorderBoards); // <-- Nueva ruta

/**
 * @swagger
 * /api/boards/{id}:
 *   get:
 *     summary: Obtener un tablero por ID (incluye listas y tareas)
 *     tags: [Boards]
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
 *         description: Datos del tablero
 */
router.get('/:id', getBoardById);

/**
 * @swagger
 * /api/boards/{id}:
 *   put:
 *     summary: Actualizar título de un tablero
 *     tags: [Boards]
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
 *         description: Tablero actualizado
 */
router.put('/:id', updateBoard);

/**
 * @swagger
 * /api/boards/{id}:
 *   delete:
 *     summary: Eliminar un tablero
 *     tags: [Boards]
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
 *         description: Tablero eliminado
 */
router.delete('/:id', deleteBoard);

export default router;
