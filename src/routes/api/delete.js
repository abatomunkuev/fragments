const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info('User initiated DELETE /v1/fragments/{id} request');
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug({ fragment }, `User's ${req.user} Fragment`);
    logger.info('DELETE route: deleting Fragment');
    await Fragment.delete(req.user, req.params.id);
    res.status(200).json(createSuccessResponse());
  } catch (error) {
    if (error.message.includes('not found')) {
      logger.warn(
        `Fragment with id ${req.params.id} not found. Sending HTTP 404 with appropriate message`
      );
      return res
        .status(404)
        .json(createErrorResponse(404, `Fragment with id ${req.params.id} not found.`));
    }
    res.status(500).json(createErrorResponse(500, error.message));
  }
};
