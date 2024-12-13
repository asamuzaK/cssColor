/**
 * convert.js
 */

import { calc } from '@csstools/css-calc';
import { LRUCache } from 'lru-cache';
import {
  convertColorToHsl, convertColorToHwb, convertColorToLab, convertColorToLch,
  convertColorToOklab, convertColorToOklch, convertColorToRgb,
  numberToHexString, parseColorFunc, parseColorValue
} from './color.js';
import { getType, isString } from './common.js';
import { cssVar } from './css-var.js';
import { resolve } from './resolve.js';
import { valueToJsonString } from './util.js';

/* constants */
import { FUNC_CALC, FUNC_VAR, VAL_COMP } from './constant.js';

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * pre process
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {?string} - value
 */
export const preProcess = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
    if (!value) {
      return null;
    }
  } else {
    return null;
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof customProperty?.callback !== 'function') {
    cacheKey = `{preProcess:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  if (value.includes(FUNC_VAR)) {
    value = cssVar(value, opt);
    if (!value) {
      if (cacheKey) {
        cachedResults.set(cacheKey, null);
      }
      return null;
    }
  }
  if (value.includes(FUNC_CALC)) {
    value = calc(value, opt);
  }
  if (value.startsWith('color-mix')) {
    value = resolve(value, {
      format: VAL_COMP
    });
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, value);
  }
  return value;
};

/**
 * convert number to hex string
 * @param {number} value - color value
 * @returns {string} - hex string: 00..ff
 */
export const numberToHex = value => {
  const cacheKey = typeof value === 'number' && `{numberToHex:${value}}`;
  if (cacheKey && cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const hex = numberToHexString(value);
  if (cacheKey) {
    cachedResults.set(cacheKey, hex);
  }
  return hex;
};

/**
 * convert color to hex
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {boolean} [opt.alpha] - return in #rrggbbaa notation
 * @param {object} [opt.customProperty] - custom properties
 * @returns {?string} - #rrggbb | #rrggbbaa | null
 */
export const colorToHex = (value, opt = {}) => {
  if (isString(value)) {
    value = preProcess(value, opt);
    if (value) {
      value = value.toLowerCase();
    } else {
      return null;
    }
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { alpha, customProperty } = opt;
  let cacheKey;
  if (typeof customProperty?.callback !== 'function') {
    cacheKey = `{colorToHex:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  let hex;
  if (alpha) {
    hex = resolve(value, {
      format: 'hexAlpha'
    });
  } else {
    hex = resolve(value, {
      format: 'hex'
    });
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, hex);
  }
  return hex;
};

/**
 * convert color to hsl
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<number>} - [h, s, l, alpha]
 */
export const colorToHsl = (value, opt = {}) => {
  if (isString(value)) {
    value = preProcess(value, opt);
    if (value) {
      value = value.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof customProperty?.callback !== 'function') {
    cacheKey = `{colorToHsl:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const hsl = convertColorToHsl(value, {
    format: 'hsl'
  });
  if (cacheKey) {
    cachedResults.set(cacheKey, hsl);
  }
  return hsl;
};

/**
 * convert color to hwb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<number>} - [h, w, b, alpha]
 */
export const colorToHwb = (value, opt = {}) => {
  if (isString(value)) {
    value = preProcess(value, opt);
    if (value) {
      value = value.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof customProperty?.callback !== 'function') {
    cacheKey = `{colorToHwb:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const hwb = convertColorToHwb(value, {
    format: 'hwb'
  });
  cachedResults.set(cacheKey, hwb);
  return hwb;
};

/**
 * convert color to lab
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export const colorToLab = (value, opt = {}) => {
  if (isString(value)) {
    value = preProcess(value, opt);
    if (value) {
      value = value.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof customProperty?.callback !== 'function') {
    cacheKey = `{colorToLab:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lab = convertColorToLab(value);
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};

/**
 * convert color to lch
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export const colorToLch = (value, opt = {}) => {
  if (isString(value)) {
    value = preProcess(value, opt);
    if (value) {
      value = value.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof customProperty?.callback !== 'function') {
    cacheKey = `{colorToLch:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lch = convertColorToLch(value);
  if (cacheKey) {
    cachedResults.set(cacheKey, lch);
  }
  return lch;
};

/**
 * convert color to oklab
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export const colorToOklab = (value, opt = {}) => {
  if (isString(value)) {
    value = preProcess(value, opt);
    if (value) {
      value = value.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof customProperty?.callback !== 'function') {
    cacheKey = `{colorToOklab:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lab = convertColorToOklab(value);
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};

/**
 * convert color to oklch
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export const colorToOklch = (value, opt = {}) => {
  if (isString(value)) {
    value = preProcess(value, opt);
    if (value) {
      value = value.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof customProperty?.callback !== 'function') {
    cacheKey = `{colorToOklch:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lch = convertColorToOklch(value);
  if (cacheKey) {
    cachedResults.set(cacheKey, lch);
  }
  return lch;
};

/**
 * convert color to rgb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<number>} - [r, g, b, alpha]
 */
export const colorToRgb = (value, opt = {}) => {
  if (isString(value)) {
    value = preProcess(value, opt);
    if (value) {
      value = value.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof customProperty?.callback !== 'function') {
    cacheKey = `{colorToRgb:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const rgb = convertColorToRgb(value);
  if (cacheKey) {
    cachedResults.set(cacheKey, rgb);
  }
  return rgb;
};

/**
 * convert color to xyz
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export const colorToXyz = (value, opt = {}) => {
  if (isString(value)) {
    value = preProcess(value, opt);
    if (value) {
      value = value.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof customProperty?.callback !== 'function') {
    cacheKey = `{colorToXyz:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  let xyz;
  if (value.startsWith('color(')) {
    [, ...xyz] = parseColorFunc(value, opt);
  } else {
    [, ...xyz] = parseColorValue(value, opt);
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, xyz);
  }
  return xyz;
};

/**
 * convert color to xyz-d50
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export const colorToXyzD50 = (value, opt = {}) => {
  opt.d50 = true;
  return colorToXyz(value, opt);
};

/* convert */
export const convert = {
  colorToHex,
  colorToHsl,
  colorToHwb,
  colorToLab,
  colorToLch,
  colorToOklab,
  colorToOklch,
  colorToRgb,
  colorToXyz,
  colorToXyzD50,
  numberToHex
};
