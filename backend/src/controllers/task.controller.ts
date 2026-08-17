import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createTask = async (req: Request, res: Response) => {
  const { title, listId } = req.body;
  const userId = req.userId!;
  try {
    const task = await prisma.task.create({ data: { title, listId, userId } });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { title, completed, listId } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        completed,
        listId, // Si se envía, actualiza la lista (para arrastrar)
      },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
