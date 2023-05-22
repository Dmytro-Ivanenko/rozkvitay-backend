const { customAlphabet } = require('nanoid');
var base64 = require('base-64');
var utf8 = require('utf8');

const LiqPay = require('../utils/liqpay');
const { ctrlWrapper } = require('../decorators');
const { sendEmail } = require('../utils');
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
	const description = `Для сплати послуги за програмою ${program}. Ім'я: ${name}; Телефон: ${phone}; ID замовлення: ${orderNum}`;

	const dataParams = {
		public_key: PUBLIC_KEY,
		version: 3,
		action: 'pay',
		amount,
		currency: 'UAH',
		description,
		order_id: orderNum,
		server_url: 'https://rozkvitay-b.onrender.com/status',
	};

	const dataForPay = await liqpay.cnb_object(dataParams);

	res.status(200).json(dataForPay);
};

// response from liqpay with pay status
const payStatus = async (req, res) => {
	const { data, signature } = req.body;

	const str = PRIVATE_KEY + data + PRIVATE_KEY;
	const mySign = liqpay.str_to_sign(str);

	if (mySign !== signature) {
		console.log('Invalid signature');
		return;
	}

	const bytes = base64.decode(data);
	const decData = JSON.parse(utf8.decode(bytes));

	const {
		order_id,
		status,
		amount,
		completion_date,
		create_date,
		description,
		end_date,
		err_code,
		err_description,
		ip,
		is_3ds,
		liqpay_order_id,
		payment_id,
		paytype,
		receiver_commission,
		sender_card_mask2,
		sender_card_type,
		sender_commission,
		sender_first_name,
		sender_last_name,
		sender_phone,
	} = decData;

	const messageData = {
		to: 'd.ivanenko@ukr.net',
		subject: `Rozkvitay замовлення номер: ${order_id}  статус оплати: ${status}`,
		html: `
<p>Номер замовлення: ${order_id}</p>
<p>Cтатус оплати: ${status}</p>
<p>Cума оплати: ${amount}</p>
<p>Дата списання коштів: ${new Date(completion_date)}</p>
<p>Дата створення платежу: ${new Date(create_date)}</p>
<p>Коментар до платежу: ${description}</p>
<p>Дата завершення/зміни платежу: ${new Date(end_date)}</p>
<p>Код помилки: ${err_code}</p>
<p>Опис помилки: ${err_description}</p>
<p>IP адреса відправника: ${ip}</p>
<p>3DS перевірка: ${is_3ds}</p>
<p>Order_id платежу в системі LiqPay: ${liqpay_order_id}</p>
<p>Id платежу в системі LiqPay: ${payment_id}</p>
<p>Спосіб оплати: ${paytype}</p>
<p>Комісія з одержувача у валюті платежу: ${receiver_commission}</p>
<p>Карта відправника: ${sender_card_mask2}</p>
<p>Тип картки відправника MC/Visa: ${sender_card_type}</p>
<p>Комісія з відправника у валюті платежу: ${sender_commission}</p>
<p>Ім'я відправника: ${sender_first_name}</p>
<p>Прізвище відправника: ${sender_last_name}</p>
<p>Телефон відправника: ${sender_phone}</p>`,
	};

	await sendEmail(messageData);

	res.status(200).json({
		decData,
	});
};

module.exports = {
	initConnection: ctrlWrapper(initConnection),
	getKeys: ctrlWrapper(getKeys),
	payStatus: ctrlWrapper(payStatus),
};
