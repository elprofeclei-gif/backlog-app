import multer from 'multer';
import path from 'path';

// Configuración para guardar archivos localmente
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Carpeta donde se guardarán
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para evitar sobreescribir imágenes
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});
