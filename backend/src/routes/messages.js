const express = require('express');
const UserRepository = require('../repositories/UserRepository');
const MessageRepository = require('../repositories/MessageRepository');

module.exports = (updateLatest, notReqFromSimulator, handleError) => {
  const router = express.Router();

  async function getUser(username) {
    const user = await UserRepository.getByUsername(username);
    if (!user) throw new Error(`User ${username} not found`);
    return user;
  }

  router.get('/', async (req, res) => {
    try {
      updateLatest(req);

      const { no: noMsgs = 100 } = req.query;
      const messages = await MessageRepository.getAll(noMsgs);

      return res.send(messages);
    } catch (err) {
      return handleError(err, res);
    }
  });

  router.get('/:username', async (req, res) => {
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
