/* src/routes.index.js
Date created: Sep 13 2022
*/
const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

// authorization middleware
const { authenticate } = require('../authorization/index');

// Create a router that we can use to mount our API
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, authenticate(), require('./api'));

// Health check route
// If server is running, respond with 200 code "OK". If not, server isn't healthy
router.get('/', (req, res) => {
  // Only fetch the latest content from the server, not allowing a response to be reused by the client
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  // See force validation
  res.setHeader('Cache-Control', 'no-cache');

  res.status(200).json({
    status: 'ok',
    author,
    githubUrl: 'https://github.com/abatomunkuev/Fragments',
    version,
  });
});

module.exports = router;
