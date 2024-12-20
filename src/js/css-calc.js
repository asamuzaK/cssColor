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
  FUNC_CALC_ESC, FUNC_CALC_VAR_ESC, FUNC_VAR, FUNC_VAR_ESC, NUM, VAL_SPEC
} from './constant.js';
const {
  CloseParen: PAREN_CLOSE, Comment: COMMENT, Dimension: DIM, EOF,
  Function: FUNC, OpenParen: PAREN_OPEN, Whitespace: W_SPACE
} = TokenType;

/* regexp */
const REG_CALC_START = new RegExp(`^${FUNC_CALC_VAR_ESC}`);
const REG_FUNC_CALC = new RegExp(FUNC_CALC_ESC);
const REG_FUNC_SIGN = /^(?:abs|sign)\($/;
const REG_FUNC_VAR = new RegExp(FUNC_VAR_ESC);
const REG_LENGTH = new RegExp(`^(${NUM})([a-z]+|%)$`);

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
  const { dimension = {}, format } = opt;
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
    } else if (/^(?:ch|ex|lh)$/.test(unit) &&
               Object.hasOwnProperty.call(dimension, 'em')) {
      const { em } = dimension;
      if (unit === 'lh') {
        pixelValue = em * 1.2;
      } else {
        pixelValue = em / 2;
      }
    } else if (/^(?:rch|rex|rlh)$/.test(unit) &&
               Object.hasOwnProperty.call(dimension, 'rem')) {
      const { rem } = dimension;
      if (unit === 'rlh') {
        pixelValue = rem * 1.2;
      } else {
        pixelValue = rem / 2;
      }
    } else if (format === VAL_SPEC) {
      const lengthInPx = {
        ch: 8,
        cm: 96 / 2.54,
        em: 16,
        ex: 8,
        in: 96,
        lh: 1.2 * 16,
        mm: 96 / 2.54 / 10,
        pc: 16,
        pt: 16 / 12,
        q: 96 / 2.54 / 40,
        rch: 8,
        rem: 16,
        rex: 8,
        rlh: 1.2 * 16
      };
      if (Object.hasOwnProperty.call(lengthInPx, unit)) {
        pixelValue = lengthInPx[unit];
      }
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
    throw new TypeError(`Expected Array but got ${getType(tokens)}.`);
  }
  const { format } = opt;
  const signFunc = new Set();
  let nest = 0;
  const res = [];
  while (tokens.length) {
    const token = tokens.shift();
    if (!Array.isArray(token)) {
      throw new TypeError(`Expected Array but got ${getType(token)}.`);
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
        if (REG_FUNC_SIGN.test(value)) {
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
  let resolvedValue = calc(values.join(''));
  if (REG_CALC_START.test(value)) {
    if (REG_LENGTH.test(resolvedValue)) {
      const [, val, unit] = REG_LENGTH.exec(resolvedValue);
      resolvedValue = `${parseFloat(Number(val).toPrecision(6))}${unit}`;
    }
    // wrap with `calc()`
    if (resolvedValue && format === VAL_SPEC) {
      resolvedValue = `calc(${resolvedValue})`;
    }
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, resolvedValue);
  }
  return resolvedValue;
};
