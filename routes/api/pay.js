const express = require('express');

const { validateBody } = require('../../utils');
const { schemas } = require('../../models/body.js');
const { getKeys } = require('../../controllers/keysControllers');

const router = express.Router();

// routes
router.post('/keys', validateBody(schemas.bodyValidateSchema), getKeys);

// export
module.exports = router;
