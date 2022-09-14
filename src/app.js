/* src/app.js
Date created: Sep 8 2022
*/
// Import libraries
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const logger = require('./logger');
const pino = require('pino-http')({
  // Use our default logger instance, which is already configured
  logger,
});

// Instantiate Express app we can use to attach middleware and HTTP routes
const app = express();

// Logging middleware
app.use(pino);
// Security middleware
app.use(helmet());
// CORS middleware so we can make requests across origins
app.use(cors());
// gzip/deflate compression middleware
app.use(compression());

// Define routes
app.use('/', require('./routes'));

// 404 Middleware to handle any requests for resources that can't be found
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});

// Error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  // If this is a server error -> log
  if (status > 499) {
    logger.error({ err }, 'Error processing request');
  }

  res.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
    },
  });
});

// Export our `app` so we can access it in server.js
module.exports = app;
