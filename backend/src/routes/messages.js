const express = require('express');
const promClient = require('prom-client');
const UserRepository = require('../repositories/UserRepository');
const MessageRepository = require('../repositories/MessageRepository');

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

const postUsernameCounter = new promClient.Counter({
  name: 'minitwit_simulator_post_msgs:username_calls',
  help: 'Number of POST /msgs/:username calls made',
});

module.exports = (updateLatest, notReqFromSimulator, handleError) => {
  const router = express.Router();

  async function getUser(username) {
    const user = await UserRepository.getByUsername(username);
    if (!user) throw new Error(`User ${username} not found`);
    return user;
  }

  router.get('/', async (req, res) => {
    getCounter.inc();
    lastGetTime.setToCurrentTime();
    const endTimer = lastGetTime.startTimer();
    try {
      updateLatest(req);

      const { no: noMsgs = 100 } = req.query;
      const messages = await MessageRepository.getAll(noMsgs);

      endTimer();

      return res.send(messages);
    } catch (err) {
      endTimer();
      return handleError(err, res);
    }
  });

  router.get('/:username', async (req, res) => {
    getUsernameCounter.inc();
    try {
      updateLatest(req);

      const { no: noMsgs = 100 } = req.query;

      const user = await getUser(req.params.username);
      const messages = await MessageRepository.getMessagesByUser(user, noMsgs);

      return res.send(messages);
    } catch (err) {
      return handleError(err, res);
    }
  });

  router.post('/:username', async (req, res) => {
    postUsernameCounter.inc();
    try {
      updateLatest(req);
      notReqFromSimulator(req, res);

      const user = await getUser(req.params.username);
      await MessageRepository.create(user, req.body.content);

      return res.status(204).send();
    } catch (err) {
      return handleError(err, res);
    }
  });

  return router;
};
