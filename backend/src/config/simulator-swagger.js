const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ITU minitwit simulator API',
      description: 'API docs for ITU minitwit simulator REST API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js', './src/dtos/*.js'],
};

module.exports = swaggerJsdoc(options);
