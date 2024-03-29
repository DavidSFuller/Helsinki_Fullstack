module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
    'commonjs': true,
    'jest': true
  },
  'extends': 'eslint:recommended',
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'quotes': [
      'error',
      'double'
    ],
  }
}
