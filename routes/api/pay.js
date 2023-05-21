const express = require('express');

const { validateBody } = require('../../utils');
const { schemas } = require('../../models/body.js');
const { getKeys, initConnection } = require('../../controllers/payControllers');

const router = express.Router();

// routes
router.get('/init', initConnection);
router.post('/keys', validateBody(schemas.bodyValidateSchema), getKeys);

// export
module.exports = router;
