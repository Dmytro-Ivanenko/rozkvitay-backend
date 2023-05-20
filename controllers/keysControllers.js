// const sha1 = require('sha1');
// const { base64encode } = require('nodejs-base64');

const LiqPay = require('liqpay');
const { customAlphabet } = require('nanoid');
const { ctrlWrapper } = require('../decorators');
require('dotenv').config();

const { PUBLIC_KEY, PRIVATE_KEY } = process.env;

const liqpay = new LiqPay(PUBLIC_KEY, PRIVATE_KEY);
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

	const dataForPay = await liqpay.cnb_object(dataParams);

	// const data = base64encode(JSON.stringify(dataParams));
	// console.dir(`Data: ${data}`);

	// const signString = PRIVATE_KEY + data + PRIVATE_KEY;
	// console.dir(`SignString: ${signString}`);

	// // const cryptoString = SHA1(signString).toString();
	// // console.dir(`crypto: ${cryptoString}`);

	// const signature = base64encode(sha1(signString));
	// console.dir(`Signature: ${signature}`);

	// const dataForPay = {
	// 	data: 'eyJwdWJsaWNfa2V5Ijoic2FuZGJveF9pNjExMTUyNDgyODAiLCJ2ZXJzaW9uIjozLCJhY3Rpb24iOiJwYXkiLCJhbW91bnQiOiI0MDAwIiwiY3VycmVuY3kiOiJVQUgiLCJkZXNjcmlwdGlvbiI6ItCU0LvRjyDRgdC/0LvQsNGC0Lgg0L/QvtGB0LvRg9Cz0Lgg0LfQsCDQv9GA0L7Qs9GA0LDQvNC+0Y4gc3RhbmRhcmQuINCG0Lwn0Y86TWFyazsg0KLQtdC70LXRhNC+0L06KzM4MDYzODkyMzY5MDsgSUQg0LfQsNC80L7QstC70LXQvdC90Y86MzEzMTI3MDUiLCJvcmRlcl9pZCI6IjMxMzEyNzA1In0=',
	// 	signature: '2J10oTK2uZPTSBkl5hgwu7sCAgc=',
	// };

	res.status(200).json(dataForPay);
};

module.exports = {
	getKeys: ctrlWrapper(getKeys),
};
