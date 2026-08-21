import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export const getMe = async (req: Request, res: Response) => {
  const userId = req.userId!;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, image: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { name, image } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, image },
      select: { id: true, email: true, name: true, image: true, role: true },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (!user.password)
      return res.status(400).json({ message: 'Esta cuenta usa Google. Inicia sesión con Google.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'La contraseña actual es incorrecta' });

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: 'La nueva contraseña no puede ser igual a la actual' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// --- RUTAS DE ADMIN ---

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, image: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, image, role } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, image, role },
      select: { id: true, email: true, name: true, image: true, role: true },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  const userId = req.userId!;
  try {
    // @ts-ignore
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }
    // @ts-ignore
    const imageUrl = req.file.path;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
      select: { id: true, email: true, name: true, image: true, role: true },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al subir la imagen' });
  }
};

// --- REPORTES Y RESPALDOS ---

// Obtener estadísticas generales del sistema (Solo Admin)
export const getSystemStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalBoards = await prisma.board.count();
    const totalLists = await prisma.list.count(); // <-- Nuevo
    const totalTasks = await prisma.task.count();

    const completedTasks = await prisma.task.count({
      where: { completed: true },
    });

    const pendingTasks = totalTasks - completedTasks;

    res.json({
      totalUsers,
      totalBoards,
      totalLists, // <-- Nuevo
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

export const getDatabaseBackup = async (req: Request, res: Response) => {
  const format = (req.query.format as string) || 'json';
  const table = (req.query.table as string) || 'all';

  try {
    if (format === 'json') {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      });
      const boards = await prisma.board.findMany();
      const lists = await prisma.list.findMany();
      const tasks = await prisma.task.findMany();

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="backlog_backup_completo.json"');
      return res.json({ exportedAt: new Date().toISOString(), users, boards, lists, tasks });
    }

    let header = '';
    let rows = '';
    let filename = '';

    if (table === 'users') {
      const users = await prisma.user.findMany();
      header = 'ID,Nombre,Email,Rol,FechaRegistro\n';
      rows = users
        .map(
          (u) =>
            `"${u.id}","${u.name || ''}","${u.email}","${u.role}","${u.createdAt.toISOString()}"`
        )
        .join('\n');
      filename = 'usuarios.csv';
    } else if (table === 'boards') {
      const boards = await prisma.board.findMany();
      header = 'ID,Titulo,Color,UserID,FechaRegistro\n';
      rows = boards
        .map(
          (b) =>
            `"${b.id}","${b.title.replace(/"/g, '""')}","${b.color}","${b.userId}","${b.createdAt.toISOString()}"`
        )
        .join('\n');
      filename = 'tableros.csv';
    } else if (table === 'lists') {
      const lists = await prisma.list.findMany();
      header = 'ID,Titulo,BoardID,FechaRegistro\n';
      rows = lists
        .map(
          (l) =>
            `"${l.id}","${l.title.replace(/"/g, '""')}","${l.boardId}","${l.createdAt.toISOString()}"`
        )
        .join('\n');
      filename = 'listas.csv';
    } else if (table === 'tasks') {
      const tasks = await prisma.task.findMany();
      header = 'ID,Titulo,Completada,FechaLimite,Etiqueta,ListID,UserID,FechaRegistro\n';
      rows = tasks
        .map(
          (t) =>
            `"${t.id}","${t.title.replace(/"/g, '""')}",${t.completed},"${t.dueDate ? t.dueDate.toISOString() : ''}","${t.label || ''}","${t.listId}","${t.userId}","${t.createdAt.toISOString()}"`
        )
        .join('\n');
      filename = 'tareas.csv';
    } else {
      return res.status(400).json({ message: 'Tabla no válida para CSV' });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(header + rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar el respaldo' });
  }
};

// Reporte de actividad de usuarios (Formato CSV)
export const getActivityReport = async (req: Request, res: Response) => {
  try {
    // Consulta anidada: Traemos el usuario, sus tableros, y contamos las listas de cada tablero
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        boards: {
          select: {
            _count: { select: { lists: true } },
          },
        },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const completedTasks = await prisma.task.groupBy({
      by: ['userId'],
      where: { completed: true },
      _count: { id: true },
    });

    // Generamos el CSV incluyendo TotalListas
    const header =
      'Nombre,Email,Rol,FechaRegistro,TotalTableros,TotalListas,TotalTareas,TareasCompletadas\n';

    const rows = users
      .map((u) => {
        const completed = completedTasks.find((t) => t.userId === u.id)?._count.id || 0;
        // Sumamos las listas de todos los tableros del usuario
        const totalLists = u.boards.reduce((acc, board) => acc + board._count.lists, 0);
        const totalBoards = u.boards.length;

        return `"${u.name || 'Sin nombre'}","${u.email}","${u.role}","${u.createdAt.toISOString().split('T')[0]}",${totalBoards},${totalLists},${u._count.tasks},${completed}`;
      })
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_actividad_usuarios.csv"');
    return res.send(header + rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar el reporte de actividad' });
  }
};
