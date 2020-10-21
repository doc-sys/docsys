import express from 'express';
const router = express.Router()

import { checkMongoDBHealth, checkRedisHealth } from '../controller/index.controller';

/**
 * @api {get} / Server health
 * @apiName serverPingHealth
 * @apiGroup Root
 * @apiDescription Returns information on the server health
 * @apiSuccess {Object} healt Server health information
 * @apiError (500) InternalServerError Something went wron processing your request
 */
router.route('/').get([checkMongoDBHealth, checkRedisHealth], (req, res) => {
	res.status(200).json(res.locals.health)
})

export default router
