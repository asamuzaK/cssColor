/**
 * css-calc.js
 */

import { calc } from '@csstools/css-calc';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { LRUCache } from 'lru-cache';
import { isString } from './common.js';
import { roundToPrecision, valueToJsonString } from './util.js';

/* constants */
import {
  FUNC_MATH, FUNC_MATH_CALC, FUNC_MATH_VAR, FUNC_VAR, NAME_VAR, NUM, VAL_SPEC
} from './constant.js';
const {
  CloseParen: PAREN_CLOSE, Comment: COMMENT, Dimension: DIM, EOF,
  Function: FUNC, OpenParen: PAREN_OPEN, Whitespace: W_SPACE
} = TokenType;
const DEG_HALF = 180;
const HEX = 16;

/* regexp */
const REG_FUNC_MATH_CALC = new RegExp(FUNC_MATH_CALC);
const REG_FUNC_VAR = new RegExp(FUNC_VAR);
const REG_LENGTH = new RegExp(`^(${NUM})([a-z]+|%)$`);
const REG_START_MATH = new RegExp(FUNC_MATH);
const REG_START_MATH_VAR = new RegExp(FUNC_MATH_VAR);

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
    throw new TypeError(`${token} is not an array.`);
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
export const parseTokens = (tokens, opt = {}) => {
  if (!Array.isArray(tokens)) {
    throw new TypeError(`${tokens} is not an array.`);
  }
  const { format } = opt;
  const signFunc = new Set();
  let nest = 0;
  const res = [];
  while (tokens.length) {
    const token = tokens.shift();
    if (!Array.isArray(token)) {
      throw new TypeError(`${token} is not an array.`);
    }
    const [type, value] = token;
    switch (type) {
      case DIM: {
        let resolvedValue;
        if (format === VAL_SPEC && !signFunc.has(nest)) {
          resolvedValue = value;
        } else {
          resolvedValue = resolveDimension(token, opt);
          if (!resolvedValue) {
            resolvedValue = value;
          }
        }
        res.push(resolvedValue);
        break;
      }
      case FUNC:
      case PAREN_OPEN: {
        res.push(value);
        nest++;
        if (REG_START_MATH.test(value)) {
          signFunc.add(nest);
        }
        break;
      }
      case PAREN_CLOSE: {
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
        if (signFunc.has(nest)) {
          signFunc.delete(nest);
        }
        nest--;
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
  if (isString(value)) {
    if (REG_FUNC_VAR.test(value)) {
      if (format === VAL_SPEC) {
        return value;
      // var() must be resolved before cssCalc()
      } else {
        throw new SyntaxError(`Unexpected token ${NAME_VAR} found.`);
      }
    } else if (!REG_FUNC_MATH_CALC.test(value)) {
      return value;
    }
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string`);
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
  let resolvedValue = calc(values.join(''));
  if (REG_START_MATH_VAR.test(value)) {
    if (REG_LENGTH.test(resolvedValue)) {
      const [, val, unit] = REG_LENGTH.exec(resolvedValue);
      // FIXME:
      // workaround for https://github.com/csstools/postcss-plugins/issues/1544
      if (unit === 'rad') {
        resolvedValue =
          `${roundToPrecision(Number(val) * DEG_HALF / Math.PI, HEX)}deg`;
      } else {
        resolvedValue = `${roundToPrecision(Number(val), HEX)}${unit}`;
      }
    } else if (resolvedValue.includes('NaN * 1rad')) {
      resolvedValue = resolvedValue.replace('NaN * 1rad', 'NaN * 1deg');
    }
    // wrap with `calc()`
    if (resolvedValue && !REG_START_MATH_VAR.test(resolvedValue) &&
        format === VAL_SPEC) {
      resolvedValue = `calc(${resolvedValue})`;
    }
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, resolvedValue);
  }
  return resolvedValue;
};
