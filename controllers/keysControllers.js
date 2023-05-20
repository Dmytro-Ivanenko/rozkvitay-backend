const SHA1 = require('crypto-js/sha1');
const { customAlphabet } = require('nanoid');

const { ctrlWrapper } = require('../decorators');
require('dotenv').config();

const { PUBLIC_KEY, PRIVATE_KEY } = process.env;
const nanoid = customAlphabet('1234567890', 8);

// Controllers

// get
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

	console.dir(JSON.stringify(dataParams));

	const data = Buffer.from(JSON.stringify(dataParams)).toString('base64');
	console.dir(`Data: ${data}`);
	const signString = PRIVATE_KEY + data + PRIVATE_KEY;
	console.dir(`SignString: ${signString}`);
	const cryptoString = SHA1(signString).toString();
	console.dir(`crypto: ${cryptoString}`);
	const signature = Buffer.from(cryptoString).toString('base64');
	console.dir(`Signature: ${signature}`);

	const dataForPay = {
		data,
		signature,
	};

	res.status(200).json(dataForPay);
};

module.exports = {
	getKeys: ctrlWrapper(getKeys),
};
