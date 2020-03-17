/* eslint-disable camelcase */
/**
 * @swagger
 * components:
 *  schemas:
 *    Error:
 *      required:
 *        - error_msg
 *      type: object
 *      properties:
 *        error_msg:
 *          type: string
 *          description: Text explaining error
 *          example: Required input not provided
 */
module.exports = class Error {
  constructor(error_msg) {
    this.error_msg = error_msg;
  }
};
