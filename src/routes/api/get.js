/* src/routes/api/get.js
Date created: Sep 13 2022
*/
// SuccessResponse and ErrorResponse message constructors
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  if (req.query.expand) {
    logger.info('User initiated GET /v1/fragments?expand=1 request');
    logger.debug(typeof req.query.expand, 'Query: expand type');
    logger.debug(req.query.expand, 'Query: expand');
  } else {
    logger.info('User initiated GET /v1/fragments request');
  }
  try {
    const fragments = await Fragment.byUser(req.user, req.query.expand);
    logger.debug({ fragments }, `List of fragments for the user ${req.user}`);
    return res.status(200).json(createSuccessResponse({ fragments: fragments }));
  } catch (error) {
    logger.error(error, 'Error in GET /v1/fragments request. Sending HTTP 500 with message');
    return res.status(500).json(createErrorResponse(500, error));
  }
};
