const Joi = require('joi');

const bodyValidateSchema = Joi.object({
	name: Joi.string().required(),
	phone: Joi.string().required(),
	program: Joi.string().valid('test', 'standard', 'vip'),
	amount: Joi.number().required(),
});

const schemas = {
	bodyValidateSchema,
};

module.exports = { schemas };
