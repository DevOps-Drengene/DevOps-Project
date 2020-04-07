const express = require('express');
const winston = require('../config/winston');
const updateLatest = require('../middleware/updateLatest');
const simulatorAuth = require('../middleware/simulatorAuth');
const slower = require('../middleware/slower');
const UserRepository = require('../repositories/UserRepository');
const MessageRepository = require('../repositories/MessageRepository');
const { NotFoundError } = require('../errors');

const router = express.Router();

async function getUser(username) {
  const user = await UserRepository.getByUsername(username);
  if (!user) throw new NotFoundError(`User ${username} not found`);
  return user;
}

/**
 * @swagger
 * tags:
 *   name: Messages
 */

/**
 * @swagger
 * paths:
 *  /msgs:
 *    get:
 *      summary: Get all messages
 *      tags: [Messages]
 *      parameters:
 *        - name: Authorization
 *          in: header
 *          required: true
 *          style: simple
 *          explode: false
 *          schema:
 *            type: string
 *            example: Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh
 *        - name: "no"
 *          in: query
 *          description: Number of messages to return
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
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Message'
 *        403:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        default:
 *          description: Unexpected error
 */
router.get('/', [simulatorAuth, updateLatest, slower], async (req, res) => {
  const { no: noMsgs = 100 } = req.query;
  const messages = await MessageRepository.getAll(noMsgs);

  return res.send(messages);
});

/**
 * @swagger
 * paths:
 *  /msgs/{username}:
 *    get:
 *      summary: Get messages by username
 *      description: Returns messages by username
 *      tags: [Messages]
 *      parameters:
 *        - name: Authorization
 *          in: header
 *          required: true
 *          style: simple
 *          explode: false
 *          schema:
 *            type: string
 *            example: Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh
 *        - name: "username"
 *          in: path
 *          description: username of user to return
 *          required: true
 *          style: simple
 *          explode: false
 *          schema:
 *            type: string
 *            example: elonmusk
 *        - name: "no"
 *          in: query
 *          description: Number of messages to return
 *          required: false
 *          style: form
 *          explode: true
 *          schema:
 *            type: integer
 *        - name: latest
 *          in: query
 *          description: latest id sent by simulator api
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
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Message'
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
router.get('/:username', updateLatest, async (req, res) => {
  const { no: noMsgs = 100 } = req.query;

  const user = await getUser(req.params.username);
  const messages = await MessageRepository.getMessagesByUser(user, noMsgs);

  winston.info(`${req.params.username}'s messages have been viewed`);

  return res.send(messages);
});

/**
 * @swagger
 * paths:
 *  /msgs/{username}:
 *    post:
 *      summary: Create message for user
 *      tags: [Messages]
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
 *          description: Username of user to create message for
 *          required: true
 *          style: simple
 *          explode: false
 *          schema:
 *            type: string
 *            example: elonmusk
 *        - name: latest
 *          in: query
 *          description: latest id sent by simulator api
 *          required: false
 *          style: form
 *          explode: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        description: Message object that needs to be added to the database
 *        content:
 *          application/json:
 *            schema:
 *              required:
 *                - content
 *              type: object
 *              properties:
 *                content:
 *                  type: string
 *                  example: Hey, whats up?
 *        required: true
 *      responses:
 *        204:
 *          description: Successfully created
 *        403:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        default:
 *          description: Unexpected error
 */
router.post('/:username', [simulatorAuth, updateLatest], async (req, res) => {
  const { username } = req.params;
  const { content } = req.body;

  const user = await getUser(username);
  await MessageRepository.create(user, content);

  winston.info(`${username} has posted the message "${content}"`);

  return res.status(204).send();
});

module.exports = router;
