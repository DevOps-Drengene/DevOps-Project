const promBundle = require('express-prom-bundle');

module.exports = promBundle({
  includeMethod: true,
  includePath: true,
  promClient: {
    collectDefaultMetrics: {}, // empty objects === all
  },
  normalizePath: [
    // collect paths like "/fllws/Cherelle%20Yeaton" as just one "/fllws/#name"
    ['^/fllws/.*', '/fllws/#name'],

    // collect paths like "/msgs/Cherelle%20Yeaton" as just one "/msgs/#name"
    ['^/msgs/.*', '/msgs/#name'],
  ],
});
