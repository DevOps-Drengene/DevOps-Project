const promClient = require('prom-client');

const { collectDefaultMetrics } = promClient;
collectDefaultMetrics();

const sampleCounter = new promClient.Counter({
  name: 'minitwit_simulator_sample_counter',
  help: 'Sample counter for simulator of Minitwit',
});

const errorsCounter = new promClient.Counter({
  name: 'minitwit_simulator_errors_counter',
  help: 'The amount of errors sent to clients',
});

const usersCounter = new promClient.Gauge({
  name: 'minitwit_simulator_users_count',
  help: 'Number of users registered in minitwit simulator',
});

const postUsernameCounter = new promClient.Counter({
  name: 'minitwit_simulator_post_fllws_username_calls',
  help: 'The total number of POST /fllws/:username calls made',
});

const getCounter = new promClient.Counter({
  name: 'minitwit_simulator_get_msgs_calls',
  help: 'Number of GET /msgs calls made',
});

const lastGetTime = new promClient.Gauge({
  name: 'minitwit_simulator_get_msgs_time',
  help: 'The internal runtime of last GET /msgs call',
});

const getUsernameCounter = new promClient.Counter({
  name: 'minitwit_simulator_get_msgs:username_calls',
  help: 'Number of GET /msgs/:username calls made',
});

module.exports = {
  promClient,
  sampleCounter,
  errorsCounter,
  usersCounter,
  getUsernameCounter,
  postUsernameCounter,
  getCounter,
  lastGetTime,
};
