/* src/routes/api/get.js
Date created: Sep 13 2022
*/
// SuccessResponse and ErrorResponse message constructors
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const fragments = await Fragment.byUser(req.user);
    return res.status(200).json(createSuccessResponse({ fragments: fragments }));
  } catch (error) {
    return res.status(500).json(createErrorResponse(500, error));
  }
};
