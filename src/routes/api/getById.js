const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
/**
 * Gets an authenticated user's fragment data (i.e., raw binary data) with the given id
 */
module.exports = async (req, res) => {
  logger.info('User initiated GET /v1/fragments/:id request');
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug({ fragment }, `User's ${req.user} Fragment`);
    const data = await fragment.getData();
    logger.debug({ data }, `Fragment's data, Fragment ID ${fragment.id}`);
    res.type(fragment.type);
    res.setHeader('content-length', fragment.size);
    return res.status(200).send(data);
  } catch (error) {
    logger.warn('Error in GET /v1/fragments/:id');
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
