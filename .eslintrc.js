module.exports = {
  root: true,
  env: {
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
}