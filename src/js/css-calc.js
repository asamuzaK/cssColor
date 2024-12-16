/**
 * css-calc.js
 */

import { calc } from '@csstools/css-calc';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { LRUCache } from 'lru-cache';
import { getType, isString } from './common.js';
import { valueToJsonString } from './util.js';

/* constants */
import {
  FUNC_CALC, FUNC_CALC_ESC, FUNC_VAR, FUNC_VAR_ESC, VAL_SPEC
} from './constant.js';
const {
  CloseParen: CLOSE_PAREN, Comment: COMMENT, Dimension: DIM, EOF,
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
 * resolve dimension
 * @param {Array} token - token
 * @param {object} [opt] - options
 * @param {object} [opt.dimension] - dimension
 * @returns {?string} - resolved value
 */
export const resolveDimension = (token, opt = {}) => {
  if (!Array.isArray(token)) {
    throw new TypeError(`Expected Array but got ${getType(token)}.`);
  }
  const [, value,,, detail = {}] = token;
  const { unit, value: relativeValue } = detail;
  const { dimension = {} } = opt;
  if (unit === 'px') {
    return value;
  }
  let res;
  if (unit && Number.isFinite(relativeValue)) {
    let pixelValue;
    if (Object.hasOwnProperty.call(dimension, unit)) {
      pixelValue = dimension[unit];
    } else if (typeof dimension.callback === 'function') {
      pixelValue = dimension.callback(unit);
    }
    if (Number.isFinite(pixelValue)) {
      res = `${relativeValue * pixelValue}px`;
    }
  }
  return res ?? null;
};

/**
 * parse tokens
 * @param {Array.<Array>} tokens - tokens
 * @param {object} [opt] - options
 * @returns {Array.<string>} - parsed tokens
 */
export const parseTokens = (tokens, opt) => {
  if (!Array.isArray(tokens)) {
    throw new TypeError(`Expected Array but got ${getType(tokens)}.`);
  }
  const res = [];
  while (tokens.length) {
    const token = tokens.shift();
    if (!Array.isArray(token)) {
      throw new TypeError(`Expected Array but got ${getType(token)}.`);
    }
    const [type, value] = token;
    switch (type) {
      case DIM: {
        let resolvedValue = resolveDimension(token, opt);
        if (!resolvedValue) {
          resolvedValue = value;
        }
        res.push(resolvedValue);
        break;
      }
      case W_SPACE: {
        if (res.length) {
          const lastValue = res[res.length - 1];
          if (!lastValue.endsWith('(') && lastValue !== ' ') {
            res.push(value);
          }
        }
        break;
      }
      case CLOSE_PAREN: {
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
        break;
      }
      default: {
        if (type !== COMMENT && type !== EOF) {
          res.push(value);
        }
      }
    }
  }
  return res;
};

/**
 * resolve CSS calc()
 * @param {string} value - color value including calc()
 * @param {object} [opt] - options
 * @param {object} [opt.dimension] - dimension
 * @param {string} [opt.format] - output format
 * @returns {?string} - value
 */
export const cssCalc = (value, opt = {}) => {
  const { format, dimension } = opt;
  if (value && isString(value)) {
    if (REG_FUNC_VAR.test(value)) {
      if (format === VAL_SPEC) {
        return value;
      // var() must be resolved before cssCalc()
      } else {
        throw new SyntaxError(`Unexpected token ${FUNC_VAR} found.`);
      }
    } else if (!REG_FUNC_CALC.test(value)) {
      return value;
    }
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  let cacheKey;
  if (typeof dimension?.callback !== 'function') {
    cacheKey = `{cssCalc:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const tokens = tokenize({ css: value });
  const values = parseTokens(tokens, opt);
  let color = calc(values.join(''));
  if (color && value.startsWith(FUNC_CALC) && format === VAL_SPEC) {
    color = `calc(${color})`;
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, color);
  }
  return color;
};
