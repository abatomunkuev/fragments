// Import libraries
// Gracefully shutdown our server
const stoppable = require('stoppable');
// Logger instance
const logger = require('./logger');
// Express app instance
const app = require('./app');
// Get the desired port from the process environment. Default to `8080`
const port = parseInt(process.env.PORT || 8080, 10);

// Start a server listening on this port
const server = stoppable(
    app.listen(port, () => {
      // Log a message that the server has started, and which port it's using.
      logger.info({ port }, `Server started`);
    })
);
// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;