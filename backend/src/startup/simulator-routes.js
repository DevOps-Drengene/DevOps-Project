const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/simulator-swagger');
const latestRoute = require('../routes/latest');
const authenticateRoute = require('../routes/authenticate');
const followsRoute = require('../routes/follows');
const messageRoute = require('../routes/messages');
const metricsRoute = require('../routes/metrics');
const errorMiddleware = require('../middleware/error');

/**
 * Sets up routes and middlware for simulator REST API
 */
module.exports = function (app) {
  // Parsing middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Simulator routes
  app.use('', authenticateRoute);
  app.use('/msgs', messageRoute);
  app.use('/fllws', followsRoute);
  app.use('/latest', latestRoute);
  app.use('/metrics', metricsRoute);

  // Simulator docs
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpec));

  // Error handler middleware
  app.use(errorMiddleware);
};
