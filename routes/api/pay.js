const express = require('express');

const { validateBody } = require('../../utils');
const { schemas } = require('../../models/body.js');
const {
	getKeys,
	initConnection,
	payStatus,
} = require('../../controllers/payControllers');

const router = express.Router();

// routes
router.get('/init', initConnection);
router.post('/keys', validateBody(schemas.bodyValidateSchema), getKeys);
router.post('/status', payStatus);

// export
module.exports = router;
