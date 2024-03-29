const Joi = require('joi');

const bodyValidateSchema = Joi.object({
	name: Joi.string().max(50).required(),
	phone: Joi.string().max(30).required(),
	program: Joi.string().valid(
		'test',
		'samostijnyj',
		'standard',
		'vip',
		'rozkvitay'
	),
	amount: Joi.number().required(),
});

const schemas = {
	bodyValidateSchema,
};

module.exports = { schemas };
