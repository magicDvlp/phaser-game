module.exports = {
  'env': {
    'browser': true,
    'es2022': true,
    'node': true,
    'amd': true,
    'jquery': true,
  },
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'extends': [
    'eslint:recommended',
    'google',
  ],
  'rules': {
    'linebreak-style': 0,
    'arrow-parens': ['error', 'as-needed'],
    'require-jsdoc': 0,
    'eol-last': 0,
  },
};
