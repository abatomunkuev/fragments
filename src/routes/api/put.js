const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

/**
 * Allows the authenticated user to update (i.e., replace) the data for their existing fragment with the specified id.
 */
module.exports = async (req, res) => {
  logger.info('User initiated PUT /v1/fragments/:id request');
  // Check if the Content-Type of the request matches the existing fragment's type
  const { type } = contentType.parse(req);
  // Get the raw binary data; express.raw() middleware stores Buffer in req.body
  const buffer = req.body;
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug({ fragment }, `User's ${req.user} Fragment`);

    if (type !== fragment.type) {
      logger.warn(
        "Error: Content-Type of the request does not match the existing fragment's type. Sending HTTP 400 with appropriate message"
      );
      return res
        .status(400)
        .json(
          createErrorResponse(
            400,
            "Content-Type of the request does not match the existing fragment's type"
          )
        );
    }

    logger.info('PUT route: updating Fragment');
    // Saving the new Fragment's raw data
    await fragment.setData(buffer);
    // Saving the updated Fragment metadata
    await fragment.save();
    logger.debug({ fragment }, `User's ${req.user} updated Fragment`);
    fragment.toJSON = () => {
      return {
        id: fragment.id,
        created: fragment.created,
        updated: fragment.updated,
        size: fragment.size,
        type: fragment.type,
        formats: fragment.formats,
      };
    };
    res.set('Content-Type', fragment.type);
    res.status(200).json(createSuccessResponse({ fragment: fragment }));
  } catch (error) {
    logger.warn('Error in PUT /v1/fragments/:id');
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
