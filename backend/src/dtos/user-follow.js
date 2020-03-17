/**
 * @swagger
 * components:
 *  schemas:
 *    UserFollow:
 *      required:
 *        - username
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *          example: elonmusk
 */
module.exports = class UserFollow {
  constructor(username) {
    this.username = username;
  }
};
