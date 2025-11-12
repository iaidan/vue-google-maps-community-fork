module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    google: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },

  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': ['off'],

    // User-requested formatting rules
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    curly: ['error', 'all'],
    'brace-style': ['error', '1tbs'],
  },
};
