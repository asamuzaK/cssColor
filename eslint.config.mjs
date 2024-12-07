import importX from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import regexp from 'eslint-plugin-regexp';
import globals from 'globals';
import neostandard, { plugins as neostdplugins } from 'neostandard';

export default [
  ...neostandard({
    semi: true
  }),
  jsdoc.configs['flat/recommended'],
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
      '@stylistic': neostdplugins['@stylistic'],
      'import-x': importX,
      regexp
    },
    rules: {
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never'
      }],
      'import-x/order': ['error', {
        alphabetize: {
          order: 'ignore',
          caseInsensitive: false
        }
      }],
      'no-await-in-loop': 'error',
      'no-loss-of-precision': 'off',
      'no-use-before-define': ['error', {
        allowNamedExports: false,
        classes: true,
        functions: false,
        variables: true
      }]
    }
  }
];
