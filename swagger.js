const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'Documentation for your API',
    },
    servers: [
      {
        url: 'http://localhost:3001', // Update with your actual server URL
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Update with the actual path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
