const express = require('express');
const metrics = require('../utils/metrics');

const router = express.Router();

/**
 * @swagger
 * path:
 *  /latest:
 *    get:
 *      summary: Get latest accepted id
 *      responses:
 *        200:
 *          description: Returns latest accepted id by API
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  latest:
 *                    type: integer
 *                    example: 12
 *        default:
 *          description: Unexpected error
 */
router.get('/', async (_req, res) => {
  metrics.sampleCounter.inc();
  return res.send({ latest: global.latestCounter });
});

module.exports = router;
