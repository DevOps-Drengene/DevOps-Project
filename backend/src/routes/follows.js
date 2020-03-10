const express = require('express');
const promClient = require('prom-client');
const UserRepository = require('../repositories/UserRepository');

const getUsernameCounter = new promClient.Counter({
  name: 'minitwit_simulator_get_fllws_username_calls',
  help: 'The total number of GET /fllws/:username calls made',
});

const postUsernameCounter = new promClient.Counter({
  name: 'minitwit_simulator_post_fllws_username_calls',
  help: 'The total number of POST /fllws/:username calls made',
});

module.exports = (updateLatest, notReqFromSimulator, handleError) => {
  const router = express.Router();

  async function getUser(username) {
    const user = await UserRepository.getByUsername(username);
    if (!user) throw new Error(`User ${username} not found`);
    return user;
  }

  router.get('/:username', async (req, res) => {
    getUsernameCounter.inc();
    try {
      updateLatest(req);
      notReqFromSimulator(req, res);

      const { no: noFollowers = 100 } = req.body;

      const user = await getUser(req.params.username);
      const followRes = await UserRepository.getFollowing(user, noFollowers);
      const follows = followRes.map((flw) => flw.username);

      return res.send({ follows });
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
      const keys = Object.keys(req.body);

      if (keys.includes('follow')) {
        const userToFollow = await getUser(req.body.follow);
        await UserRepository.addFollow(user, userToFollow);
        return res.status(204).send();
      }

      if (keys.includes('unfollow')) {
        const userToUnFollow = await getUser(req.body.unfollow);
        await UserRepository.removeFollow(user, userToUnFollow);
        return res.status(204).send();
      }

      throw new Error('Bad Request: Neither the follow or the unfollow key was given in request');
    } catch (err) {
      return handleError(err, res);
    }
  });

  return router;
};
