const express = require('express');
const UserRepository = require('../repositories/UserRepository');

module.exports = (updateLatest, notReqFromSimulator, handleError) => {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    try {
      updateLatest(req);

      const { username, email, pwd } = req.body;

      const user = await UserRepository.getByUsername(username);
      if (user) throw new Error('Bad Request: That username is already taken');

      await UserRepository.create(username, email, pwd);

      return res.status(204).send();
    } catch (err) {
      return handleError(err, res);
    }
  });

  return router;
};
