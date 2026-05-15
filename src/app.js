const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const routes = require('./routes/index.js');
const errorHandler = require('./middleware/error.middleware.js');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1', routes);

app.use(errorHandler);

module.exports = app;
