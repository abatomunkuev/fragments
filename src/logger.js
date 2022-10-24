/* src/logger.js
Date created: Sep 8 2022
*/

// Use 'info' as a standard log level if not specified
const options = { level: process.env.LOG_LEVEL || 'info' };
// Determine if it is in development mode or production
const isDev = process.env.NODE_ENV !== 'production';

// make the logs easier to read
if (isDev && options.level === 'debug') {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

// Create and export a Pino Logger instance:
// https://getpino.io/#/docs/api?id=logger
module.exports = require('pino')(options);
