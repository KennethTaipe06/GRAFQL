const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Define el esquema
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Define los resolvers
const root = {
  hello: () => {
    return '¡Hola Mundo!';
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
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
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