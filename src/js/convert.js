/**
 * convert.js
 */

import { calc } from '@csstools/css-calc';
import { LRUCache } from 'lru-cache';
import {
  convertHexToRgb, convertRgbToHex, convertXyzD50ToHex, convertXyzD50ToLab,
  convertXyzD50ToLch, convertXyzToHex, convertXyzToHsl, convertXyzToHwb,
  convertXyzToOklab, convertXyzToOklch, convertXyzToRgb, convertXyzToXyzD50,
  numberToHexString, parseColorFunc, parseColorValue
} from './color.js';
import { getType, isString } from './common.js';
import { resolve } from './resolve.js';

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * convert color to xyz
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {boolean} [opt.d50] - xyz in d50 white point
 * @returns {Array.<number>} - [x, y, z, a] x|y|z|a: around 0..1
 */
export const colorToXyz = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const cacheKey = `{parse:${value},opt:${JSON.stringify(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  let x, y, z, a;
  if (/calc/.test(value)) {
    value = calc(value);
  }
  if (value.startsWith('color-mix')) {
    value = resolve(value, {
      format: 'spec'
    });
  }
  if (value.startsWith('color(')) {
    [, x, y, z, a] = parseColorFunc(value, opt);
  } else {
    [, x, y, z, a] = parseColorValue(value, opt);
  }
  cachedResults.set(cacheKey, [x, y, z, a]);
  return [x, y, z, a];
};

/**
 * convert hex color to rgb
 * @param {string} value - color value
 * @returns {Array.<number>} - [r, g, b, a] r|g|b: 0..255 a: 0..1
 */
export const hexToRgb = value => {
  const cacheKey =
    isString(value) && `{hexToRgb:${value.toLowerCase().trim()}}`;
  if (cacheKey && cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const res = convertHexToRgb(value);
  if (cacheKey) {
    cachedResults.set(cacheKey, res);
  }
  return res;
};

/**
 * convert number to hex string
 * @param {number} value - color value
 * @returns {string} - hex string
 */
export const numberToHex = value => {
  const cacheKey = typeof value === 'number' && `{numberToHex:${value}}`;
  if (cacheKey && cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const res = numberToHexString(value);
  if (cacheKey) {
    cachedResults.set(cacheKey, res);
  }
  return res;
};

/**
 * convert rgb to hex color
 * @param {Array.<number>} rgb - [r, g, b, a] r|g|b: 0..255 a: 0..1
 * @returns {string} - hex color;
 */
export const rgbToHex = rgb => {
  const cacheKey = `{name:rgbToHex,rgb:${JSON.stringify(rgb)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const res = convertRgbToHex(rgb);
  cachedResults.set(cacheKey, res);
  return res;
};

/**
 * convert xyz
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @param {string} name - function name
 * @returns {string|Array.<number>} - result
 */
export const convertXyz = (xyz, name) => {
  const cacheKey = `{${name}:${JSON.stringify(xyz)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  let res;
  switch (name) {
    case 'xyzD50ToHex': {
      res = convertXyzD50ToHex(xyz);
      break;
    }
    case 'xyzD50ToLab': {
      res = convertXyzD50ToLab(xyz);
      break;
    }
    case 'xyzD50ToLch': {
      res = convertXyzD50ToLch(xyz);
      break;
    }
    case 'xyzToHex': {
      res = convertXyzToHex(xyz);
      break;
    }
    case 'xyzToHsl': {
      res = convertXyzToHsl(xyz);
      break;
    }
    case 'xyzToHwb': {
      res = convertXyzToHwb(xyz);
      break;
    }
    case 'xyzToOklab': {
      res = convertXyzToOklab(xyz);
      break;
    }
    case 'xyzToOklch': {
      res = convertXyzToOklch(xyz);
      break;
    }
    case 'xyzToRgb': {
      res = convertXyzToRgb(xyz);
      break;
    }
    case 'xyzToXyzD50': {
      res = convertXyzToXyzD50(xyz);
      break;
    }
    default: {
      throw new Error(`Invalid converter name: ${name}`);
    }
  }
  cachedResults.set(cacheKey, res);
  return res;
};

/**
 * convert xyz D50 to hex color
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {string} - hex color
 */
export const xyzD50ToHex = xyz => convertXyz(xyz, 'xyzD50ToHex');

/**
 * convert xyz-d50 to lab
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {Array.<number>} - [l, a, b, aa] l: 0..100 a|b: -125..125 aa: 0..1
 */
export const xyzD50ToLab = xyz => convertXyz(xyz, 'xyzD50ToLab');

/**
 * convert xyz-d50 to lch
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {Array.<number>} - [l, c, h, a] l: 0..100 c: 0..150 h: 0..360 a: 0..1
 */
export const xyzD50ToLch = xyz => convertXyz(xyz, 'xyzD50ToLch');

/**
 * convert xyz to hex color
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {string} - hex color
 */
export const xyzToHex = xyz => convertXyz(xyz, 'xyzToHex');

/**
 * convert xyz to hsl
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {Array.<number>} - [h, s, l, a] h: 0..360 s|l: 0..100 a: 0..1
 */
export const xyzToHsl = xyz => convertXyz(xyz, 'xyzToHsl');

/**
 * convert xyz to hwb
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {Array.<number>} - [h, w, b, a] h: 0..360 w|b: 0..100 a: 0..1
 */
export const xyzToHwb = xyz => convertXyz(xyz, 'xyzToHwb');

/**
 * convert xyz to oklab
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {Array.<number>} - [l, a, b, aa] l|aa: 0..1 a|b: -0.4..0.4
 */
export const xyzToOklab = xyz => convertXyz(xyz, 'xyzToOklab');

/**
 * convert xyz to oklch
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {Array.<number>} - [l, c, h, aa] l|aa: 0..1 c: 0..0.4 h: 0..360
 */
export const xyzToOklch = xyz => convertXyz(xyz, 'xyzToOklch');

/**
 * convert xyz to rgb
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {Array.<number>} - [r, g, b, a] r|g|b: 0..255 a: 0..1
 */
export const xyzToRgb = xyz => convertXyz(xyz, 'xyzToRgb');

/**
 * convert xyz to xyz-d50
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 */
export const xyzToXyzD50 = xyz => convertXyz(xyz, 'xyzToXyzD50');

/* convert */
export const convert = {
  colorToXyz,
  hexToRgb,
  numberToHex,
  rgbToHex,
  xyzD50ToHex,
  xyzD50ToLab,
  xyzD50ToLch,
  xyzToHex,
  xyzToHsl,
  xyzToHwb,
  xyzToOklab,
  xyzToOklch,
  xyzToRgb,
  xyzToXyzD50
};
