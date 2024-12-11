const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Define el esquema de GraphQL
// Aquí se define un esquema simple con una consulta llamada 'hello' que devuelve un String
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Define los resolvers de GraphQL
// Los resolvers son funciones que resuelven las consultas definidas en el esquema
const root = {
  hello: () => {
    return '¡Hola Mundo!'; // Esta función devuelve el mensaje '¡Hola Mundo!' cuando se consulta 'hello'
  },
};

// Configura el servidor Express
const app = express();

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Hola Mundo',
      version: '1.0.0',
      description: 'Documentación de la API de Hola Mundo',
    },
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /graphql:
 *   post:
 *     summary: Ejecutar consultas GraphQL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 example: "{ hello }"
 *     responses:
 *       200:
 *         description: Éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     hello:
 *                       type: string
 *                       example: "¡Hola Mundo!"
 */
// Configura el middleware de GraphQL
// Este middleware procesa las consultas GraphQL enviadas a la ruta '/graphql'
app.use('/graphql', graphqlHTTP({
  schema: schema, // Esquema de GraphQL
  rootValue: root, // Resolvers de GraphQL
  graphiql: true, // Habilita la interfaz GraphiQL para probar consultas
}));

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Hola Mundo');
});

// Inicia el servidor
app.listen(4000, () => {
  console.log('Servidor ejecutándose en http://localhost:4000');
  console.log('Documentación Swagger en http://localhost:4000/api-docs');
});