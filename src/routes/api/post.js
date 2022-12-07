/* src/routes/api/post.js
Date created: Oct 5 2022
*/
const { Fragment, FRAGMENT_TYPES } = require('../../model/fragment');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * POST /fragments
 *
 * Creates a new fragment for the current user (i.e., authenticated user).
 */
module.exports = async (req, res) => {
  logger.info('User initiated POST /v1/fragments/ request');
  // Get the content type of the request
  const { type } = contentType.parse(req);
  // Get the raw binary data; express.raw() middleware stores Buffer in req.body
  const buffer = req.body;
  // Check if the provided type is in the supported type list
  if (!Fragment.isSupportedType(type)) {
    logger.warn('Error in POST /v1/fragments/, unsupported type. Sending HTTP 415 with message');
    logger.warn(`Provided type ${type} is not supported`);
    return res
      .status(415)
      .json(
        createErrorResponse(
          415,
          `Provided type is not supported. See the following list of supported types: ${FRAGMENT_TYPES.join()}`
        )
      );
  }
  try {
    logger.info('POST route: creating Fragment');
    const fragment = new Fragment({ ownerId: req.user, type: type });
    // Saving the Fragment's raw data
    await fragment.setData(buffer);
    // Saving the Fragment metadata
    await fragment.save();
    // Retrieving added fragment
    const createdFragment = await Fragment.byId(req.user, fragment.id);
    logger.debug({ createdFragment }, 'Created fragment');
    logger.debug('String value from buffer: ' + buffer.toString());
    // Set Location header
    logger.debug({ location: apiUrl + '/v1/fragments/' + fragment.id }, 'Location');
    logger.debug('Fragment content type: ' + fragment.type);
    res.location(apiUrl + '/v1/fragments/' + fragment.id);
    return res.status(201).json(createSuccessResponse({ fragment: createdFragment }));
  } catch (error) {
    logger.error('Error in POST /v1/fragments/. Sending HTTP 500 with message');
    logger.error(error, 'Unhandled error');
    return res.status(500).json(createErrorResponse(500, error));
  }
};
