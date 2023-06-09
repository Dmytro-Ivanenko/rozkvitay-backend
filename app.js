const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const keyRouter = require('./routes/api/pay');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'combined';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', keyRouter);

app.use((req, res) => {
	res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
	const { status = 500, message = 'Server error' } = err;
	res.status(status).json({ message });
});

module.exports = app;
