import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getLists = async (req: Request, res: Response) => {
  const boardId = req.params.boardId as string;

  try {
    const lists = await prisma.list.findMany({
      where: { boardId },
      include: { tasks: true },
      orderBy: { order: 'asc' },
    });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const createList = async (req: Request, res: Response) => {
  const { title, boardId } = req.body;
  try {
    // Contamos cuántas listas hay para asignarle el orden al final
    const listCount = await prisma.list.count({ where: { boardId } });
    const list = await prisma.list.create({
      data: { title, boardId, order: listCount },
    });
    res.status(201).json(list);
  } catch (error) {
    console.error(error);
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

// NUEVA FUNCIÓN: Reordenar listas
export const reorderLists = async (req: Request, res: Response) => {
  const { lists } = req.body; // Array de { id, order }
  try {
    const updatePromises = lists.map((list: { id: string; order: number }) =>
      prisma.list.update({
        where: { id: list.id },
        data: { order: list.order },
      })
    );
    await prisma.$transaction(updatePromises);
    res.json({ message: 'Orden de listas actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al reordenar listas' });
  }
};
