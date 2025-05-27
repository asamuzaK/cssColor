import regexp from 'eslint-plugin-regexp';
import globals from 'globals';
import neostandard from 'neostandard';

export default [
  ...neostandard({
    noStyle: true,
    semi: true,
    ts: true
  }),
  regexp.configs['flat/recommended'],
  {
    ignores: ['dist/browser']
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
      'import-x/order': [
        'error',
        {
          alphabetize: {
            order: 'ignore',
            caseInsensitive: false
          }
        }
      ],
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
