const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

/**
 * Allows the authenticated user to get (i.e., read) the metadata for one of their existing fragments with the specified id
 */
module.exports = async (req, res) => {
  logger.info('User initiated GET /v1/fragments/:id/info request');
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug({ fragment }, `User's ${req.user} Fragment`);
    return res.status(200).json(createSuccessResponse({ fragment: fragment }));
  } catch (error) {
    logger.warn('Error in GET /v1/fragments/:id/info');
    if (error.message.includes('not found')) {
      logger.warn(
        `Fragment with id ${req.params.id} not found. Sending HTTP 404 with appropriate message`
      );
      return res.status(404).json(createErrorResponse(404, error.message));
    }
    logger.error(error, 'Unhandled error');
    return res.status(500).json(createErrorResponse(500, error));
  }
};
