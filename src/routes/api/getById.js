const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');

/**
 * Gets an authenticated user's fragment data (i.e., raw binary data) with the given id
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const data = await fragment.getData();
    res.type(fragment.type);
    res.setHeader('content-length', fragment.size);
    return res.status(200).send(data);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json(createErrorResponse(404, error.message));
    }
    return res.status(500).json(createErrorResponse(500, error));
  }
};
