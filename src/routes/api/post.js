/* src/routes/api/post.js
Date created: Oct 5 2022
*/
const { Fragment, FRAGMENT_TYPES } = require('../../model/fragment');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const { createSuccessResponse, createErrorResponse } = require('../../response');

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Creates a new fragment for the current user (i.e., authenticated user).
 */
module.exports = async (req, res) => {
  // Get the content type of the request
  const { type } = contentType.parse(req);
  // Check if the provided type is in the supported type list
  if (!Fragment.isSupportedType(type)) {
    return res
      .status(415)
      .json(
        createErrorResponse(
          415,
          `Provided type is not supported. See the following list of supported types: ${FRAGMENT_TYPES.join()}`
        )
      );
  }
  // Get the raw binary data; express.raw() middleware stores Buffer in req.body
  const buffer = req.body;
  try {
    const fragment = new Fragment({ ownerId: req.user, type: type });
    // Saving the Fragment metadata
    await fragment.save();
    // Saving the Fragment's raw data
    await fragment.setData(buffer);
    // Retrieving added fragment
    const created_fragment = await Fragment.byId(req.user, fragment.id);
    // Set Location header
    res.location(apiUrl + '/v1/fragments/' + fragment.id);
    return res.status(201).json(createSuccessResponse({ fragment: created_fragment }));
  } catch (error) {
    return res.status(500).json(createErrorResponse(500, error));
  }
};
