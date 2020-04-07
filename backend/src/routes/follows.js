const express = require('express');
const updateLatest = require('../middleware/updateLatest');
const simulatorAuth = require('../middleware/simulatorAuth');
const UserRepository = require('../repositories/UserRepository');
const winston = require('../config/winston');
const { BadRequestError, NotFoundError } = require('../errors');

const router = express.Router();

async function getUser(username) {
  const user = await UserRepository.getByUsername(username);

  if (!user) throw new NotFoundError(`User ${username} not found`);

  return user;
}

/**
 * @swagger
 * paths:
 *  /fllws/{username}:
 *    get:
 *      summary: Get followers of user
 *      description: Returns followers by username
 *      parameters:
 *        - name: Authorization
 *          in: header
 *          required: true
 *          style: simple
 *          explode: false
 *          schema:
 *            type: string
 *            example: Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh
 *        - name: username
 *          in: path
 *          description: Username of user to find followers of
 *          required: true
 *          style: simple
 *          explode: false
 *          schema:
 *            type: string
 *            example: elonmusk
 *        - name: "no"
 *          in: query
 *          description: Number of followers to return
 *          required: false
 *          style: form
 *          explode: true
 *          schema:
 *            type: integer
 *        - name: latest
 *          in: query
 *          description: Latest id sent by simulator api
 *          required: false
 *          style: form
 *          explode: true
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                required:
 *                  - follows
 *                type: object
 *                properties:
 *                  follows:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/UserFollow'
 *        403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        404:
 *          description: User not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        default:
 *          description: Unexpected error
 */
router.get('/:username', [simulatorAuth, updateLatest], async (req, res) => {
  const { no: noFollowers = 100 } = req.body;
  const { username } = req.params;

  winston.info(`Get followers for username: ${username}`);

  const user = await getUser(username);
  const followRes = await UserRepository.getFollowing(user, noFollowers);
  const follows = followRes.map((flw) => flw.username);

  return res.send({ follows });
});

/**
 * @swagger
 * paths:
 *  /fllws/{username}:
 *    post:
 *      summary: Set follower for user
 *      parameters:
 *        - name: Authorization
 *          in: header
 *          required: true
 *          style: simple
 *          explode: false
 *          schema:
 *            type: string
 *            example: Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh
 *        - name: username
 *          in: path
 *          description: Username of user to set follower for
 *          required: true
 *          style: simple
 *          explode: false
 *          schema:
 *            type: string
 *            example: elonmusk
 *        - name: latest
 *          in: query
 *          description: Latest id sent by simulator api
 *          required: false
 *          style: form
 *          explode: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - type: object
 *                  properties:
 *                    follow:
 *                      type: string
 *                      example: elonmusk
 *                - type: object
 *                  properties:
 *                    unfollow:
 *                      type: string
 *                      example: elonmusk
 *              example:
 *                follow: elonmusk
 *      responses:
 *        204:
 *          description: Successfully set follow
 *        400:
 *          description: Invalid input
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        403:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        404:
 *          description: User not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        default:
 *          description: Unexpected error
 */
router.post('/:username', [simulatorAuth, updateLatest], async (req, res) => {
  const { username } = req.params;

  const user = await getUser(username);
  const keys = Object.keys(req.body);

  if (keys.includes('follow')) {
    const userToFollow = await getUser(req.body.follow);
    winston.info(`${user.username} follows ${userToFollow.username}`);
    await UserRepository.addFollow(user, userToFollow);
    return res.status(204).send();
  }

  if (keys.includes('unfollow')) {
    const userToUnFollow = await getUser(req.body.unfollow);
    winston.info(`${user.username} unfollows ${userToUnFollow.username}`);
    await UserRepository.removeFollow(user, userToUnFollow);
    return res.status(204).send();
  }

  throw new BadRequestError(`Neither the follow or the unfollow key was given in request for username ${username}`);
});

module.exports = router;
