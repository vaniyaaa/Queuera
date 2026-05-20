const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'logs/error.log',
    }),
  ],
});

module.exports = logger;
