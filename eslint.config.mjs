import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';
import neostandard from 'neostandard';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import regexp from 'eslint-plugin-regexp';

export default [
  ...neostandard({
    noStyle: true,
    ts: true
  }),
  jsdoc.configs['flat/recommended-typescript'],
  prettierRecommended,
  regexp.configs['flat/recommended'],
  {
    ignores: ['dist/']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.webextensions
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    plugins: {
      regexp
    },
    rules: {
      curly: ['error', 'all'],
      'no-await-in-loop': 'error',
      'no-loss-of-precision': 'off',
      'no-use-before-define': [
        'error',
        {
          allowNamedExports: false,
          classes: true,
          functions: false,
          variables: true
        }
      ],
      'prefer-object-has-own': 'error'
    }
  }
];
