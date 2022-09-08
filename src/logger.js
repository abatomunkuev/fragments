/* Logger
Date created: Sep 8 2022
Date updated: 
*/

// Use 'info' as a standard log level if not specified
const options  = { level: process.env.LOG_LEVEL || 'info' }

// make the logs easier to read 
if (options.level === 'debug') {
    options.transport = {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    };
}

// Create and export a Pino Logger instance:
// https://getpino.io/#/docs/api?id=logger
module.exports = require('pino')(options);
