// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const FRAGMENT_TYPES = [
  `text/plain`,
  `text/markdown`,
  `text/html`,
  `application/json`,
  /*
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
  */
];

const validateArgs = (ownerId, content_type, size) => {
  // REQUIRED ARGUMENTS
  if (!ownerId) {
    throw new Error('ownerId argument is required');
  }
  if (!content_type) {
    throw new Error('type argument is required');
  }
  const { type } = contentType.parse(content_type);

  // Check if it is in supported types
  if (!FRAGMENT_TYPES.includes(type)) {
    throw new Error(
      `Unsupported type. Please see the following supported types: ${FRAGMENT_TYPES.join()}`
    );
  }

  if (typeof size !== 'number') {
    throw new Error('size argument must be a number');
  }
  if (size < 0) {
    throw new Error('size cannot be negative');
  }
};

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    // Validate arguments
    validateArgs(ownerId, type, size);
    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const result = await readFragment(ownerId, id);
    if (!result) {
      throw new Error(`Fragment with id: ${id} for user: ${ownerId} not found.`);
    }
    return result;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    // Updates the time
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error("Fragment's data type is not Buffer type");
    }
    this.size = Buffer.byteLength(data);
    this.updated = new Date().toISOString();
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const { type } = contentType.parse(this.type);
    const regex = new RegExp('text/(plain|markdown|html)');
    return regex.test(type);
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const validExt = {
      'text/plain': ['.txt'],
      'text/markdown': ['.md', '.html', '.txt'],
      'text/html': ['.html', '.txt'],
      'application/json': ['.json', '.txt'],
    };
    let supportedExtensions;
    switch (this.mimeType) {
      case 'text/plain':
        supportedExtensions = validExt['text/plain'];
        break;
      case 'text/markdown':
        supportedExtensions = validExt['text/markdown'];
        break;
      case 'text/html':
        supportedExtensions = validExt['text/html'];
        break;
      case 'application/json':
        supportedExtensions = validExt['application/json'];
        break;
      default:
        supportedExtensions = [];
        break;
    }
    return supportedExtensions;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const { type } = contentType.parse(value);
    return FRAGMENT_TYPES.includes(type);
  }
}

module.exports.Fragment = Fragment;
module.exports.FRAGMENT_TYPES = FRAGMENT_TYPES;
