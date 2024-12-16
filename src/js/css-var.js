/**
 * css-var.js
 */

import { calc } from '@csstools/css-calc';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { LRUCache } from 'lru-cache';
import { getType, isString } from './common.js';
import { isColor, valueToJsonString } from './util.js';

/* constants */
import { FUNC_CALC_ESC, FUNC_VAR, FUNC_VAR_ESC } from './constant.js';
const {
  CloseParen: CLOSE_PAREN, Comment: COMMENT, EOF, Ident: IDENT,
  Whitespace: W_SPACE
} = TokenType;

/* regexp */
const REG_FUNC_CALC = new RegExp(FUNC_CALC_ESC);
const REG_FUNC_VAR = new RegExp(FUNC_VAR_ESC);

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * resolve custom property
 * @param {Array.<Array>} tokens - tokens
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<string|Array|undefined>} - [tokens, resolvedValue]
 */
export function resolveCustomProperty(tokens, opt = {}) {
  if (!Array.isArray(tokens)) {
    throw new TypeError(`Expected Array but got ${getType(tokens)}.`);
  }
  const { customProperty = {} } = opt;
  const items = [];
  while (tokens.length) {
    const token = tokens.shift();
    if (!Array.isArray(token)) {
      throw new TypeError(`Expected Array but got ${getType(token)}.`);
    }
    const [type, value] = token;
    // end of var()
    if (type === CLOSE_PAREN) {
      break;
    }
    // nested var()
    if (value === FUNC_VAR) {
      const [restTokens, item] = resolveCustomProperty(tokens, opt);
      tokens = restTokens;
      if (item) {
        items.push(item);
      }
    } else if (type === IDENT) {
      if (value.startsWith('--')) {
        if (Object.hasOwnProperty.call(customProperty, value)) {
          items.push(customProperty[value]);
        } else if (typeof customProperty.callback === 'function') {
          const item = customProperty.callback(value);
          if (item) {
            items.push(item);
          }
        }
      } else if (value) {
        items.push(value);
      }
    }
  }
  let resolveAsColor;
  if (items.length > 1) {
    const lastValue = items[items.length - 1];
    resolveAsColor = isColor(lastValue);
  }
  let resolvedValue;
  for (let item of items) {
    item = item.trim();
    if (REG_FUNC_VAR.test(item)) {
      // recurse cssVar()
      item = cssVar(item, opt);
      if (item) {
        if (resolveAsColor) {
          if (isColor(item)) {
            resolvedValue = item;
          }
        } else {
          resolvedValue = item;
        }
      }
    } else if (REG_FUNC_CALC.test(item)) {
      item = calc(item);
      if (resolveAsColor) {
        if (isColor(item)) {
          resolvedValue = item;
        }
      } else {
        resolvedValue = item;
      }
    } else if (item &&
               !/^(?:inherit|initial|revert(?:-layer)?|unset)$/.test(item)) {
      if (resolveAsColor) {
        if (isColor(item)) {
          resolvedValue = item;
        }
      } else {
        resolvedValue = item;
      }
    }
    if (resolvedValue) {
      break;
    }
  }
  return [tokens, resolvedValue];
}

/**
 * parse tokens
 * @param {Array.<Array>} tokens - tokens
 * @param {object} [opt] - options
 * @returns {?Array.<Array>} - parsed tokens
 */
export function parseTokens(tokens, opt = {}) {
  const res = [];
  while (tokens.length) {
    const token = tokens.shift();
    const [type, value] = token;
    if (value === FUNC_VAR) {
      const [restTokens, resolvedValue] = resolveCustomProperty(tokens, opt);
      if (!resolvedValue) {
        return null;
      }
      tokens = restTokens;
      res.push(resolvedValue);
    } else if (type === W_SPACE) {
      if (res.length) {
        const lastValue = res[res.length - 1];
        if (!lastValue.endsWith('(') && lastValue !== ' ') {
          res.push(value);
        }
      }
    } else if (type === CLOSE_PAREN) {
      if (res.length) {
        const lastValue = res[res.length - 1];
        if (lastValue === ' ') {
          res.splice(-1, 1, value);
        } else {
          res.push(value);
        }
      } else {
        res.push(value);
      }
    } else if (type !== COMMENT && type !== EOF) {
      res.push(value);
    }
  }
  return res;
}

/**
 * resolve CSS var()
 * @param {string} value - color value including var()
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {?string} - value
 */
export function cssVar(value, opt = {}) {
  if (value && isString(value)) {
    if (!REG_FUNC_VAR.test(value)) {
      return value;
    }
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof customProperty?.callback !== 'function') {
    cacheKey = `{cssVar:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const tokens = tokenize({ css: value });
  const values = parseTokens(tokens, opt);
  if (Array.isArray(values)) {
    let color = values.join('');
    if (REG_FUNC_CALC.test(color)) {
      color = calc(color);
    }
    if (cacheKey) {
      cachedResults.set(cacheKey, color);
    }
    return color;
  } else {
    if (cacheKey) {
      cachedResults.set(cacheKey, null);
    }
    return null;
  }
}
