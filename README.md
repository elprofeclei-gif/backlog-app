📋 Backlog App (Trello Clone)
CI PipelineReactTypeScriptNode.jsExpressPrismaPostgreSQLTailwindCSS

Aplicación full-stack de gestión de tareas estilo Kanban (similar a Trello). Permite a los usuarios crear múltiples tableros, listas y tarjetas, arrastrar y soltar para reorganizar, y gestionar su flujo de trabajo de forma visual y dinámica.

🚀 Ver aplicación en vivo: https://backlog-app-self.vercel.app/login

✨ Características Principales
Autenticación Múltiple: Email/Contraseña (JWT + Bcrypt) e integración de Google OAuth 2.0.
Roles de Usuario: Sistema de permisos (ADMIN / USER). El primer usuario es automáticamente Administrador.
Tableros Dinámicos: Crea, edita, elimina y reordena tableros arrastrándolos. Personaliza el color de fondo de cada tablero (12 colores disponibles).
Listas y Tarjetas (CRUD): Crea listas y tarjetas. Arrastra y suelta para reordenarlas dentro de la misma lista o moverlas entre listas.
Etiquetas y Fechas: Asigna etiquetas de color y fechas de vencimiento a las tarjetas (se ponen en rojo si vencen).
Edición Inline: Edita los títulos de tableros, listas y tarjetas con un solo clic.
Gestión de Perfil: Cambio de nombre, avatar (Cloudinary) y contraseña con validación estricta.
Recuperación de Contraseña: Flujo completo mediante envío de correos electrónicos (Resend).
Interfaz Moderna: Diseño responsivo construido con Tailwind CSS, incluye Modo Oscuro/Claro, Skeleton Loaders, Notificaciones Toast y validación de formularios (React Hook Form + Zod).
API Documentada: Documentación interactiva con Swagger UI.
Monitoreo: Captura de errores en tiempo real con Sentry.
🛠️ Stack Tecnológico
Frontend:

React + Vite
TypeScript
Tailwind CSS
React Router DOM
@hello-pangea/dnd (Drag & Drop)
React Hook Form + Zod (Validación)
Axios
Vitest + Testing Library (Unit Testing)
Backend:

Node.js + Express
TypeScript
Prisma ORM
JWT (Autenticación)
Multer + Cloudinary (Subida de archivos)
Google Auth Library (OAuth)
Resend (Servicio de correos)
Swagger (Documentación API)
Supertest (Integration Testing)
Base de Datos:

PostgreSQL (Hosteado en Neon)
DevOps & Arquitectura:

Patrón MVC (Modelo-Vista-Controlador).
GitHub Actions (CI/CD para testing automatizado).
Husky + lint-staged (Git Hooks para calidad de código).
Docker (Dockerizado para desarrollo local).
Vercel (Frontend Deploy).
Render (Backend Deploy).
💻 Instalación y Ejecución Local
Clona el repositorio:
git clone https://github.com/elprofeclei-gif/backlog-app.gitcd backlog-app
Configurar Backend (backend/.env):
env

DATABASE_URL="tu_url_de_neon"
JWT_SECRET="tu_clave_secreta"
GOOGLE_CLIENT_ID="tu_google_client_id"
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
RESEND_API_KEY="tu_resend_api_key"
bash

cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
Configurar Frontend (frontend/.env):
env

VITE_API_URL="http://localhost:3001/api"
bash

cd frontend
npm install
npm run dev
Abre http://localhost:5173 en tu navegador.
🐳 Ejecutar con Docker (Opcional)
El proyecto incluye configuración de Docker. Si tienes Docker instalado, simplemente ejecuta desde la raíz del proyecto:

bash

docker-compose up --build
(Asegúrate de tener un archivo .env en la raíz con las variables de entorno necesarias).

📖 Documentación de la API
Una vez que el backend esté corriendo, puedes acceder a la documentación interactiva de la API en:
http://localhost:3001/api-docs
