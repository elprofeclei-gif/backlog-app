import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Crear un tablero
export const createBoard = async (req: Request, res: Response) => {
  const { title, color } = req.body;
  const userId = req.userId!;

  try {
    const board = await prisma.board.create({
      data: { title, color: color || 'blue', userId },
    });
    res.status(201).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener todos los tableros del usuario
export const getBoards = async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    const boards = await prisma.board.findMany({
      where: { userId },
      include: {
        lists: {
          select: {
            _count: { select: { tasks: true } }, // Obtiene el conteo de tareas por lista
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener un tablero por ID
export const getBoardById = async (req: Request, res: Response) => {
  const id = req.params.id as string; // <-- Forzar tipo string
  const userId = req.userId!;

  try {
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        lists: {
          include: { tasks: true },
          orderBy: { createdAt: 'asc' },
        },
      }, // <-- Cambiado 'tasks' por 'lists' con sus 'tasks' dentro
    });

    if (!board || board.userId !== userId) {
      return res.status(404).json({ message: 'Tablero no encontrado' });
    }

    res.json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Eliminar un tablero
export const deleteBoard = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.userId!;

  try {
    const board = await prisma.board.findUnique({ where: { id } });
    if (!board || board.userId !== userId) {
      return res.status(404).json({ message: 'Tablero no encontrado' });
    }

    await prisma.board.delete({ where: { id } });
    res.json({ message: 'Tablero eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Actualizar tablero
export const updateBoard = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { title, color } = req.body;
  try {
    const updatedBoard = await prisma.board.update({
      where: { id },
      data: { title, color },
    });
    res.json(updatedBoard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
