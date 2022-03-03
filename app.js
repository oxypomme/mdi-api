const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger(process.env.NODE_ENV === "production" ? undefined : 'dev'));
app.use(express.json());

app.use('/icons', indexRouter);

module.exports = app;
