const { customAlphabet } = require('nanoid');
const LiqPay = require('../utils/liqpay');
const { ctrlWrapper } = require('../decorators');
require('dotenv').config();

const { PUBLIC_KEY, PRIVATE_KEY } = process.env;
const liqpay = new LiqPay(PUBLIC_KEY, PRIVATE_KEY);
const nanoid = customAlphabet('1234567890', 8);

// CONTROLLERS

// waking up the server on Render
const initConnection = async (req, res) => {
	res.status(200).json({ message: 'Service is active' });
};

// get data end signature
const getKeys = async (req, res) => {
	const { name, phone, program, amount } = req.body;

	const orderNum = nanoid();
	const description = `Для сплати послуги за програмою ${program}. Ім'я:${name}; Телефон:${phone}; ID замовлення:${orderNum}`;

	const dataParams = {
		public_key: PUBLIC_KEY,
		version: 3,
		action: 'pay',
		amount,
		currency: 'UAH',
		description,
		order_id: orderNum,
	};

	const dataForPay = await liqpay.cnb_object(dataParams);

	res.status(200).json(dataForPay);
};

module.exports = {
	initConnection: ctrlWrapper(initConnection),
	getKeys: ctrlWrapper(getKeys),
};
