module.exports = {
  env: {
    browser: true,
<<<<<<< HEAD
    commonjs: true,
=======
>>>>>>> setup
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
<<<<<<< HEAD
  },
  rules: {
    'comma-dangle':0
  }
=======
    sourceType: 'module',
  },
  rules: {
    "comma-dangle": 0
  },
>>>>>>> setup
};
