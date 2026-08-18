📋 Backlog App (Trello Clone)
CI PipelineReactTypeScriptNode.jsExpressPrismaPostgreSQLTailwindCSS

Aplicación full-stack de gestión de tareas estilo Kanban (similar a Trello). Permite a los usuarios crear múltiples tableros, listas y tarjetas, así como arrastrar y soltar tarjetas entre listas para organizar su flujo de trabajo de forma visual y dinámica.

🚀 Ver aplicación en vivo: https://backlog-app-self.vercel.app/login

✨ Características Principales
Autenticación Múltiple: Inicio de sesión con Email/Contraseña (JWT + Bcrypt) e integración de Google OAuth 2.0.
Roles de Usuario: Sistema de permisos (ADMIN / USER). El primer usuario registrado es automáticamente Administrador.
Tableros Dinámicos: Crea, edita y elimina tableros con colores personalizables.
Listas y Tarjetas (CRUD): Crea listas dentro de los tableros y tarjetas dentro de las listas.
Drag & Drop (Arrastrar y Soltar): Mueve las tarjetas entre listas o reordénalas dentro de la misma lista de forma fluida.
Edición Inline: Edita los títulos de tableros, listas y tarjetas con un solo clic.
Gestión de Perfil: Cambio de nombre de usuario, avatar (subida de imágenes) y cambio de contraseña con validación.
Recuperación de Contraseña: Flujo completo de "Olvidé mi contraseña" mediante envío de correos electrónicos (Resend).
Interfaz Moderna: Diseño responsivo construido con Tailwind CSS, incluyendo Modo Oscuro/Claro.
API Documentada: Documentación interactiva con Swagger UI.
🛠️ Stack Tecnológico
Frontend:

React + Vite
TypeScript
Tailwind CSS
React Router DOM
@hello-pangea/dnd (Drag & Drop)
Axios
Vitest + Testing Library (Unit Testing)
Backend:

Node.js + Express
TypeScript
Prisma ORM
JWT (Autenticación)
Multer (Subida de archivos)
Google Auth Library (OAuth)
Resend (Servicio de correos)
Swagger (Documentación API)
Supertest (Integration Testing)
Base de Datos:

PostgreSQL (Hosteado en Neon)
DevOps & CI/CD:

GitHub Actions (Testing automatizado)
Husky + lint-staged (Git Hooks)
Vercel (Frontend Deploy)
Render (Backend Deploy)
Arquitectura:

Patrón MVC (Modelo-Vista-Controlador) tanto en backend como en frontend (Hooks como controladores).
💻 Instalación y Ejecución Local
Clona el repositorio:
git clone https://github.com/elprofeclei-gif/backlog-app.gitcd backlog-app
Configurar Backend (backend/.env):
env

DATABASE_URL="tu_url_de_neon"
JWT_SECRET="tu_clave_secreta"
GOOGLE_CLIENT_ID="tu_google_client_id"
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
📖 Documentación de la API
Una vez que el backend esté corriendo, puedes acceder a la documentación interactiva de la API en:
http://localhost:3001/api-docs
