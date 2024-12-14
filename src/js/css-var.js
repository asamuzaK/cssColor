/**
 * css-var.js
 */

import { calc } from '@csstools/css-calc';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { LRUCache } from 'lru-cache';
import { getType, isString } from './common.js';
import { isColor, valueToJsonString } from './util.js';

/* constants */
import { FUNC_CALC, FUNC_VAR } from './constant.js';
const {
  CloseParen: CLOSE_PAREN, Comment: COMMENT, Ident: IDENT, Whitespace: W_SPACE
} = TokenType;

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * resolve CSS variable
 * @param {Array.<Array>} tokens - tokens
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<string|Array|undefined>} - [tokens, resolvedValue]
 */
export function resolveCssVariable(tokens, opt = {}) {
  const { customProperty = {} } = opt;
  const items = [];
  while (tokens.length) {
    const token = tokens.shift();
    const [type, value] = token;
    // end of var()
    if (type === CLOSE_PAREN) {
      break;
    }
    // nested var()
    if (value === FUNC_VAR) {
      const [remainedTokens, item] = resolveCssVariable(tokens, {
        customProperty
      });
      tokens = remainedTokens;
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
    if (item.includes(FUNC_VAR)) {
      item = cssVar(item, {
        customProperty
      });
      if (item) {
        if (resolveAsColor) {
          if (isColor(item)) {
            resolvedValue = item;
          }
        } else {
          resolvedValue = item;
        }
      }
    } else if (item.includes(FUNC_CALC)) {
      item = calc(item, opt);
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
  const result = [];
  while (tokens.length) {
    const token = tokens.shift();
    const [type, value] = token;
    if (value === FUNC_VAR) {
      const [remainedTokens, resolvedValue] = resolveCssVariable(tokens, opt);
      if (!resolvedValue) {
        return null;
      }
      tokens = remainedTokens;
      result.push(resolvedValue);
    } else if (type === W_SPACE) {
      if (result.length) {
        const lastValue = result[result.length - 1];
        if (!lastValue.endsWith('(') && lastValue !== ' ') {
          result.push(value);
        }
      }
    } else if (type === CLOSE_PAREN) {
      if (result.length) {
        const lastValue = result[result.length - 1];
        if (lastValue === ' ') {
          result.splice(-1, 1, value);
        } else {
          result.push(value);
        }
      } else {
        result.push(value);
      }
    } else if (type !== COMMENT) {
      result.push(value);
    }
  }
  return result;
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
    if (!value.includes(FUNC_VAR)) {
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
    if (color.includes(FUNC_CALC)) {
      color = calc(color, opt);
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
