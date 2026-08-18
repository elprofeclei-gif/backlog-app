import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backlog API',
      version: '1.0.0',
      description:
        'API para aplicación de gestión de tareas estilo Trello (Kanban). Incluye Auth, Boards, Lists y Tasks.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desarrollo',
      },
      {
        url: 'https://backlog-app-v1lf.onrender.com', // Tu URL de producción
        description: 'Servidor de Producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'], // Aquí le decimos que lea tus archivos de rutas
};

export const swaggerSpec = swaggerJsDoc(swaggerOptions);
