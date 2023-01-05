const express = require('express');
const logger = require('morgan');
const cors = require('cors')

const indexRouter = require('./routes/index');

const app = express();

app.use(cors());

app.use(logger(process.env.NODE_ENV === "production" ? undefined : 'dev'));
app.use(express.json());

app.use('/icons', indexRouter);
app.use(express.static('public'));

module.exports = app;
