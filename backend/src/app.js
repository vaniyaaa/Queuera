const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const routes = require('./routes/index.js');
const errorHandler = require('./middleware/error.middleware.js');
const logger = require('./utils/logger.js');

const app = express();

const ALLOWED_ORIGINS = [
  'http://localhost:3001',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`[cors] blocked origin=${origin} allowed=${ALLOWED_ORIGINS.join(',')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1', routes);

app.use(errorHandler);

module.exports = app;
