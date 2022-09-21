/* src/routes/api/get.js
Date created: Sep 13 2022
*/
// SuccessResponse and ErrorResponse message constructors
const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  res.status(200).json(createSuccessResponse({ fragments: [] }));
  /*
  res.status(200).json({
    status: 'ok',
    fragments: [],
  });
  */
};
