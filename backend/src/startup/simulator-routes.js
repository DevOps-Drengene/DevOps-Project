const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/simulator-swagger');
const { authenticate, messages, follows, latest } = require('../routes');
const errorMiddleware = require('../middleware/error');
const metricsMiddleware = require('../middleware/metrics');

/**
 * Sets up routes and middleware for simulator REST API
 */
module.exports = (app) => {
  // Parsing middleware
  // Has to be **before** the routes
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Prometheus metrics middleware
  // Has to be **before** the routes
  app.use(metricsMiddleware);

  // Simulator routes
  app.use('', authenticate);
  app.use('/msgs', messages);
  app.use('/fllws', follows);
  app.use('/latest', latest);

  // Simulator docs
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpec));

  // Error handler middleware
  // Has to be **after** the routes
  app.use(errorMiddleware);
};
