const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
/**
 * Gets an authenticated user's fragment data (i.e., raw binary data) with the given id
 */
module.exports = async (req, res) => {
  logger.info('User initiated GET /v1/fragments/:id request');
  const extension = req.params.id.split('.').length == 1 ? null : '.' + req.params.id.split('.')[1];
  const id = req.params.id.split('.').length == 1 ? req.params.id : req.params.id.split('.')[0];
  let data;
  let type;
  try {
    const fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, `User's ${req.user} Fragment`);
    // Here we are checking if the extension exists, and check if it is in supported formats
    if (extension) {
      if (fragment.validExtensions.includes(extension)) {
        // Convert fragments data
        const { convertedData, mimeType } = await fragment.getConvertedData(extension);
        logger.debug({ convertedData }, `convertedData`);
        logger.debug({ mimeType }, `mimeType`);
        data = convertedData;
        type = mimeType;
      } else {
        logger.warn(
          'Error in GET /v1/fragments/:id.ext, invalid/unsupported conversion extension. Sending HTTP 415 with message'
        );
        logger.warn(`Provided type ${extension} is invalid / not supported`);
        return res
          .status(415)
          .json(
            createErrorResponse(415, `Provided conversion extension is invalid/not supported.`)
          );
      }
    } else {
      // Otherwise, set to rawData
      data = await fragment.getData();
      type = fragment.type;
    }
    res.set('Content-Type', type);
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
