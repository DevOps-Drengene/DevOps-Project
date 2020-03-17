const express = require('express');
const updateLatest = require('../middleware/updateLatest');
const UserRepository = require('../repositories/UserRepository');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 */

/**
 * @swagger
 * paths:
 *  /register:
 *    post:
 *      summary: Register new user
 *      tags: [User]
 *      parameters:
 *        - name: latest
 *          in: query
 *          description: latest id sent by simulator api
 *          required: false
 *          style: form
 *          explode: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        description: User object that needs to be added to the database
 *        content:
 *          application/json:
 *            schema:
 *              required:
 *                - email
 *                - pwd
 *                - username
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: Muhammad Ali
 *                email:
 *                  type: string
 *                  example: ali@itu.dk
 *                pwd:
 *                  type: string
 *                  example: securepwd
 *        required: true
 *      responses:
 *        "204":
 *          description: User registered
 *        "400":
 *          description: Error on insert with description
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post('/register', updateLatest, async (req, res) => {
  const { username, email, pwd } = req.body;

  const user = await UserRepository.getByUsername(username);
  if (user) throw new Error('Bad Request: That username is already taken');

  await UserRepository.create(username, email, pwd);

  return res.status(204).send();
});

module.exports = router;
