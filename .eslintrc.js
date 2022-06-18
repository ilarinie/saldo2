/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:react/recommended', 'plugin:react/jsx-runtime'],
  ignorePatterns: ['node_modules'],
  rules: {
    'max-len': [
      'error',
      {
        code: 250,
      },
    ],
    'semi': ['warn', 'never'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
