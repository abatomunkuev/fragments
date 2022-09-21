module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    // see:
    // https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
    jest: true,
  },
  extends: 'eslint:recommended',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {},
};
