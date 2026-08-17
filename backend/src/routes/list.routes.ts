import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getLists, createList, deleteList, updateList } from '../controllers/list.controller';

const router = Router();
router.use(authMiddleware);

router.get('/:boardId', getLists);
router.post('/', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);

export default router;
