const { customAlphabet } = require('nanoid');
const moment = require('moment');
require('moment-timezone');

var base64 = require('base-64');
var utf8 = require('utf8');

const LiqPay = require('../utils/liqpay');
const { ctrlWrapper } = require('../decorators');
const { sendEmail } = require('../utils');
const { HttpError } = require('../helpers');

require('dotenv').config();

const { PUBLIC_KEY, PRIVATE_KEY } = process.env;
const liqpay = new LiqPay(PUBLIC_KEY, PRIVATE_KEY);
const nanoid = customAlphabet('1234567890', 8);

moment.locale('uk-UA');
moment.tz.setDefault('Europe/Kiev');

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
		result_url: 'https://rozkvitay.net.ua',
	};

	const dataForPay = await liqpay.cnb_object(dataParams);

	res.status(200).json(dataForPay);
};

// invite to telegram
const getInvite = async (req, res) => {
	const orderNum = nanoid();
	const description = `Для сплати послуги за програмою "Rozkvitay". ID замовлення: ${orderNum}`;

	const dataParams = {
		public_key: PUBLIC_KEY,
		version: 3,
		action: 'pay',
		// amount: 750,
		amount: 550,
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
		throw HttpError(400);
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
		to: 'rozkvitay.team@gmail.com',
		subject: `Rozkvitay замовлення номер: ${order_id}  статус оплати: ${status}`,
		html: `
<table>
    <tr>
        <th>Номер замовлення:</th>
        <td>${order_id}</td>
    </tr>
    <tr>
        <th>Cтатус оплати:</th>
        <td>${status}</td>
    </tr>
    <tr>
        <th>Cума оплати:</th>
        <td>${amount}</td>
    </tr>
    <tr>
        <th>Дата списання коштів:</th>
        <td>${moment.unix(completion_date / 1000).format('DD-MM-YYYY HH:mm:ss')}
				
		</td>
    </tr>
    <tr>
        <th>Дата створення платежу:</th>
        <td>${moment.unix(create_date / 1000).format('DD-MM-YYYY HH:mm:ss')}</td>
    </tr>
    <tr>
        <th>Коментар до платежу:</th>
        <td>${description}</td>
    </tr>
    <tr>
        <th>Дата завершення/зміни платежу:</th>
        <td>${moment.unix(end_date / 1000).format('DD-MM-YYYY HH:mm:ss')}</td>
    </tr>
    <tr>
        <th>Код помилки:</th>
        <td>${err_code}</td>
    </tr>
    <tr>
        <th>Опис помилки: </th>
        <td>${err_description}</td>
    </tr>
    <tr>
        <th>IP адреса відправника:</th>
        <td>${ip}</td>
    </tr>
    <tr>
        <th>3DS перевірка:</th>
        <td>${is_3ds}</td>
    </tr>
    <tr>
        <th>Order_id платежу в системі LiqPay:</th>
        <td>${liqpay_order_id}</td>
    </tr>
    <tr>
        <th>Id платежу в системі LiqPay:</th>
        <td>${payment_id}</td>
    </tr>
    <tr>
        <th>Спосіб оплати:</th>
        <td>${paytype}</td>
    </tr>
    <tr>
        <th>Комісія з одержувача у валюті платежу:</th>
        <td>${receiver_commission}</td>
    </tr>
    <tr>
        <th>Карта відправника: </th>
        <td> ${sender_card_mask2}</td>
    </tr>
    <tr>
        <th>Тип картки відправника MC/Visa:</th>
        <td>${sender_card_type}</td>
    </tr>
    <tr>
        <th>Комісія з відправника у валюті платежу:</th>
        <td>${sender_commission}</td>
    </tr>
    <tr>
        <th>Ім'я відправника:</th>
        <td>${sender_first_name}</td>
    </tr>
    <tr>
        <th>Прізвище відправника: </th>
        <td>${sender_last_name}</td>
    </tr>
	<tr>
        <th>Телефон відправника: </th>
        <td>${sender_phone}</td>
    </tr>
</table>`,
	};

	await sendEmail(messageData);

	res.status(200).json({
		message: `success`,
	});
};

module.exports = {
	initConnection: ctrlWrapper(initConnection),
	getKeys: ctrlWrapper(getKeys),
	payStatus: ctrlWrapper(payStatus),
	getInvite: ctrlWrapper(getInvite),
};
