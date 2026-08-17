import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getLists = async (req: Request, res: Response) => {
  const boardId = req.params.boardId as string;
  const userId = req.userId!;
  try {
    const lists = await prisma.list.findMany({
      where: { boardId },
      include: { tasks: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const createList = async (req: Request, res: Response) => {
  const { title, boardId } = req.body;
  const userId = req.userId!;
  try {
    const list = await prisma.list.create({ data: { title, boardId } });
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const deleteList = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    await prisma.list.delete({ where: { id } });
    res.json({ message: 'Lista eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Actualizar lista
export const updateList = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { title } = req.body;
  try {
    const updatedList = await prisma.list.update({
      where: { id },
      data: { title },
    });
    res.json(updatedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
