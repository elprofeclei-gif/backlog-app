import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createBoard,
  getBoards,
  getBoardById,
  deleteBoard,
  updateBoard,
} from '../controllers/board.controller';

const router = Router();

router.use(authMiddleware);

router.post('/', createBoard);
router.get('/', getBoards);
router.get('/:id', getBoardById);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

export default router;
