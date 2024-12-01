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
import { resolve } from './resolve.js';

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * pre process
 * @param {string} value - color value
 * @returns {string} - value
 */
export const preProcess = value => {
  if (value && isString(value)) {
    if (/calc/.test(value)) {
      value = calc(value);
    }
    if (value.startsWith('color-mix')) {
      value = resolve(value, {
        format: 'computedValue'
      });
    }
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
 * @returns {string} - #rrggbb|#rrggbbaa
 */
export const colorToHex = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const cacheKey = `{colorToHex:${value},opt:${JSON.stringify(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  value = preProcess(value);
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
 * @returns {Array.<number>} - [h, s, l, a]
 */
export const colorToHsl = value => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const cacheKey = `{colorToHsl:${value}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  value = preProcess(value);
  const hsl = convertColorToHsl(value, {
    format: 'hsl'
  });
  cachedResults.set(cacheKey, hsl);
  return hsl;
};

/**
 * convert color to hwb
 * @param {string} value - color value
 * @returns {Array.<number>} - [h, w, b, a]
 */
export const colorToHwb = value => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const cacheKey = `{colorToHwb:${value}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  value = preProcess(value);
  const hwb = convertColorToHwb(value, {
    format: 'hwb'
  });
  cachedResults.set(cacheKey, hwb);
  return hwb;
};

/**
 * convert color to lab
 * @param {string} value - color value
 * @returns {Array.<number>} - [l, a, b, aa]
 */
export const colorToLab = value => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const cacheKey = `{colorToLab:${value}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  value = preProcess(value);
  const lab = convertColorToLab(value);
  cachedResults.set(cacheKey, lab);
  return lab;
};

/**
 * convert color to lch
 * @param {string} value - color value
 * @returns {Array.<number>} - [l, c, h, aa]
 */
export const colorToLch = value => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const cacheKey = `{colorToLch:${value}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  value = preProcess(value);
  const lch = convertColorToLch(value);
  cachedResults.set(cacheKey, lch);
  return lch;
};

/**
 * convert color to oklab
 * @param {string} value - color value
 * @returns {Array.<number>} - [l, a, b, aa]
 */
export const colorToOklab = value => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const cacheKey = `{colorToOklab:${value}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  value = preProcess(value);
  const lab = convertColorToOklab(value);
  cachedResults.set(cacheKey, lab);
  return lab;
};

/**
 * convert color to oklch
 * @param {string} value - color value
 * @returns {Array.<number>} - [l, c, h, aa]
 */
export const colorToOklch = value => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const cacheKey = `{colorToOklch:${value}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  value = preProcess(value);
  const lch = convertColorToOklch(value);
  cachedResults.set(cacheKey, lch);
  return lch;
};

/**
 * convert color to rgb
 * @param {string} value - color value
 * @returns {Array.<number>} - [r, g, b, a]
 */
export const colorToRgb = value => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const cacheKey = `{colorToRgb:${value}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  value = preProcess(value);
  const rgb = convertColorToRgb(value);
  cachedResults.set(cacheKey, rgb);
  return rgb;
};

/**
 * convert color to xyz
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {boolean} [opt.d50] - xyz in d50 white point
 * @returns {Array.<number>} - [x, y, z, a]
 */
export const colorToXyz = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const cacheKey = `{colorToXyz:${value},opt:${JSON.stringify(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  value = preProcess(value);
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
 * @returns {Array.<number>} - [x, y, z, a]
 */
export const colorToXyzD50 = value => colorToXyz(value, { d50: true });

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
