// Import libraries
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// version and author from our package.json file
const { version, author } = require('../package.json'); // returns an object with data from package.json

const logger = require('./logger');
const pino = require('pino-http')({
    // Use our default logger instance, which is already configured
    logger,
});

// Instantiate Express app we can use to attach middleware and HTTP routes
const app = express()

// Logging middleware
app.use(pino);
// Security middleware
app.use(helmet());
// CORS middleware so we can make requests across origins
app.use(cors());
// gzip/deflate compression middleware
app.use(compression());

// Health check route
// If server is running, respond with 200 code "OK". If not, server isn't healthy
app.get('/', (req, res) => {
    // Only fetch the latest content from the server, not allowing a response to be reused by the client
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching 
    // See force validation
    res.setHeader('Cache-Control', 'no-cache');

    res.status(200).json({
        status: 'ok',
        author,
        githubUrl: 'https://github.com/abatomunkuev/Fragments',
        version
    })
})


// 404 Middleware to handle any requests for resources that can't be found 
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        error: {
            message: 'not found',
            code: 404
        }
    })
})

// Error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || 'unable to process request'
    
    // If this is a server error -> log
    if (status > 499) {
        logger.error({ err }, 'Error processing request')
    }

    res.status(status).json({
        status: 'error',
        error: {
            message,
            code: status
        }
    })
})

// Export our `app` so we can access it in server.js
module.exports = app