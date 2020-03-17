/* eslint-disable camelcase */
/**
 * @swagger
 * components:
 *  schemas:
 *    Message:
 *      required:
 *        - content
 *        - pub_date
 *        - user
 *      type: object
 *      properties:
 *        content:
 *          type: string
 *          example: My first tweet!
 *        pub_date:
 *          type: string
 *          format: date-time
 *        user:
 *          type: string
 *          example: devops - drengene
 */
module.exports = class Message {
  constructor(content, pub_date, user) {
    this.content = content;
    this.pub_date = pub_date;
    this.user = user;
  }
};
