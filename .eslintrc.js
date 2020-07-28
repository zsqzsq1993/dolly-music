module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // customer rules
    'indent': 0,
    'eol-last': 0,
    'space-before-function-paren': 0,
    'no-trailing-spaces': 0,
    'space-in-parens': 0,
    'no-multi-spaces': 0,
    'object-curly-spacing': 0,
    'quote-props': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'prefer-rest-params': 0,
    'prefer-spread': 0
  }
}
