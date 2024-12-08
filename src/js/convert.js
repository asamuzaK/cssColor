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
import { stringifyOptions } from './util.js';

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
  const cacheKey = `{preProcess:${value},opt:${stringifyOptions(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  if (value.includes(FUNC_VAR)) {
    value = cssVar(value, opt);
    if (!value) {
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
  const cacheKey = `{colorToHex:${value},opt:${stringifyOptions(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const { alpha } = opt;
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
  const cacheKey = `{colorToHsl:${value},opt:${stringifyOptions(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const hsl = convertColorToHsl(value, {
    format: 'hsl'
  });
  cachedResults.set(cacheKey, hsl);
  return hsl;
};

/**
 * convert color to hwb
 * @param {string} value - color value
 * @param {object} [opt] - options
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
  const cacheKey = `{colorToHwb:${value},opt:${stringifyOptions(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
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
  const cacheKey = `{colorToLab:${value},opt:${stringifyOptions(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const lab = convertColorToLab(value);
  cachedResults.set(cacheKey, lab);
  return lab;
};

/**
 * convert color to lch
 * @param {string} value - color value
 * @param {object} [opt] - options
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
  const cacheKey = `{colorToLch:${value},opt:${stringifyOptions(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const lch = convertColorToLch(value);
  cachedResults.set(cacheKey, lch);
  return lch;
};

/**
 * convert color to oklab
 * @param {string} value - color value
 * @param {object} [opt] - options
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
  const cacheKey = `{colorToOklab:${value},opt:${stringifyOptions(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const lab = convertColorToOklab(value);
  cachedResults.set(cacheKey, lab);
  return lab;
};

/**
 * convert color to oklch
 * @param {string} value - color value
 * @param {object} [opt] - options
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
  const cacheKey = `{colorToOklch:${value},opt:${stringifyOptions(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const lch = convertColorToOklch(value);
  cachedResults.set(cacheKey, lch);
  return lch;
};

/**
 * convert color to rgb
 * @param {string} value - color value
 * @param {object} [opt] - options
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
  const cacheKey = `{colorToRgb:${value},opt:${stringifyOptions(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const rgb = convertColorToRgb(value);
  cachedResults.set(cacheKey, rgb);
  return rgb;
};

/**
 * convert color to xyz
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {boolean} [opt.d50] - xyz in d50 white point
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
  const cacheKey = `{colorToXyz:${value},opt:${stringifyOptions(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  let xyz;
  if (value.startsWith('color(')) {
    [, ...xyz] = parseColorFunc(value, opt);
  } else {
    [, ...xyz] = parseColorValue(value, opt);
  }
  cachedResults.set(cacheKey, xyz);
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
