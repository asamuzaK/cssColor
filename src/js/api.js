/**
 * api.js
 */

import { calc } from '@csstools/css-calc';
import { LRUCache } from 'lru-cache';
import {
  convertRgbToHex, parseColorFunc, parseColorValue, resolveColorFunc,
  resolveColorMix, resolveColorValue
} from './color.js';
import { getType, isString } from './common.js';
export { convert } from './convert.js';

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * resolve CSS color
 * @param {string} color - color value
 *   - system colors are not supported
 * @param {object} [opt] - options
 * @param {string} [opt.currentColor] - color to use for `currentcolor` keyword
 * @param {string} [opt.format] - `spec`, `rgb`, `array`, `hex` or `hexAlpha`
 *   - defaults to `spec` if omitted
 *   - `hexAlpha` is a hex color notation with alpha channel, i.e. #rrggbbaa
 * @param {*} [opt.key] - key e.g. CSS property `background-color`
 * @returns {?string|Array}
 *   - rgba?(), color(space r g b / a), color(space x y z / a),
 *     lab(l a b / A), lch(l c h / a), oklab(l a b / a), oklch(l c h / a),
 *     [r, g, b, a], #rrggbb(aa)?, null
 *     and [key, rgba?()] etc. if `key` is specified
 *   - in `spec`, each value is a floating point number
 *   - in `rgb`, `r`, `g`, `b` values are rounded to integers,
 *     and returns empty string if any of `r`, `g`, `b`, `a` is not a number
 *   - in `array`, values are an rgb array and each value is a floating point,
 *     and if any of `r`, `g`, `b`, `a` is not a number then they stay as is,
 *     e.g. [undefined, undefined, undefined, undefined]
 *   - in `hex`, `transparent` resolves as `null`,
 *     also returns `null` if any of `r`, `g`, `b`, `a` is not a number
 *   - in `hexAlpha`, `transparent` resolves as `#00000000`,
 *     and returns `null` if any of `r`, `g`, `b`, `a` is not a number
 */
export const resolve = (color, opt = {}) => {
  if (isString(color)) {
    color = color.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(color)}.`);
  }
  const cacheKey =
    `{resolve:${color.toLowerCase()},opt:${JSON.stringify(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const { currentColor, format = 'spec', key } = opt;
  let r, g, b, a;
  if (/calc/i.test(color)) {
    color = calc(color);
  }
  let res;
  if (/^currentcolor$/i.test(color)) {
    if (currentColor) {
      if (currentColor.startsWith('color-mix')) {
        // TODO: color(space x y z / a)
        /*
        if (format === 'spec') {
          // res =
          // cachedResults.set(cacheKey, res);
          // return res;
        }
        */
        [r, g, b, a] = resolveColorMix(currentColor);
      } else if (currentColor.startsWith('color(')) {
        // TODO: color(space r g b / a) | color(space x y z / a)
        /*
        if (format === 'spec') {
          // res =
          // cachedResults.set(cacheKey, res);
          // return res;
        }
        */
        [r, g, b, a] = resolveColorFunc(currentColor);
      } else {
        // TODO: lab(), lch(), oklab(), oklch()
        /*
        if (format === 'spec') {
          // res =
          // cachedResults.set(cacheKey, res);
          // return res;
        }
        */
        [r, g, b, a] = resolveColorValue(currentColor);
      }
    } else {
      r = 0;
      g = 0;
      b = 0;
      a = 0;
    }
  } else if (/currentcolor/i.test(color)) {
    if (/transparent/i.test(color)) {
      color = color.replace(/transparent/gi, 'rgba(0, 0, 0, 0)');
    }
    if (currentColor && color.startsWith('color-mix')) {
      color = color.replace(/currentcolor/gi, currentColor);
      // TODO: color(space r g b / a) | color(space x y z / a)
      /*
      if (format === 'spec') {
        // res =
        // cachedResults.set(cacheKey, res);
        // return res;
      }
      */
      [r, g, b, a] = resolveColorMix(color);
    }
  } else if (/^transparent$/i.test(color)) {
    r = 0;
    g = 0;
    b = 0;
    a = 0;
  } else if (/transparent/i.test(color)) {
    color = color.replace(/transparent/gi, 'rgba(0, 0, 0, 0)');
    if (color.startsWith('color-mix')) {
      // TODO: color(space r g b / a) | color(space x y z / a)
      /*
      if (format === 'spec') {
        // res =
        // cachedResults.set(cacheKey, res);
        // return res;
      }
      */
      [r, g, b, a] = resolveColorMix(color);
    }
  } else if (color.startsWith('color-mix')) {
    // TODO: color(space r g b / a) | color(space x y z / a)
    /*
    if (format === 'spec') {
      // res =
      // cachedResults.set(cacheKey, res);
      // return res;
    }
    */
    [r, g, b, a] = resolveColorMix(color);
  } else if (color.startsWith('color(')) {
    // TODO: color(space r g b / a) | color(space x y z / a)
    /*
    if (format === 'spec') {
      // res =
      // cachedResults.set(cacheKey, res);
      // return res;
    }
    */
    [r, g, b, a] = resolveColorFunc(color);
  } else {
    // TODO: lab(), lch(), oklab(), oklch()
    /*
    if (format === 'spec') {
      // res =
      // cachedResults.set(cacheKey, res);
      // return res;
    }
    */
    [r, g, b, a] = resolveColorValue(color);
  }
  switch (format) {
    case 'array': {
      if (key) {
        res = [key, [r, g, b, a]];
      } else {
        res = [r, g, b, a];
      }
      break;
    }
    case 'hex': {
      let hex;
      if (/^transparent$/i.test(color) || isNaN(r) || isNaN(g) || isNaN(b)) {
        hex = null;
      } else {
        hex = convertRgbToHex([r, g, b]);
      }
      if (key) {
        res = [key, hex];
      } else {
        res = hex;
      }
      break;
    }
    case 'hexAlpha': {
      let hex;
      if (/^transparent$/i.test(color)) {
        hex = '#00000000';
      } else if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
        hex = null;
      } else {
        hex = convertRgbToHex([r, g, b, a]);
      }
      if (key) {
        res = [key, hex];
      } else {
        res = hex;
      }
      break;
    }
    case 'rgb':
    default: {
      let rgb;
      if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
        rgb = '';
      } else {
        if (format === 'rgb') {
          r = Math.round(r);
          g = Math.round(g);
          b = Math.round(b);
        }
        if (a === 1) {
          rgb = `rgb(${r}, ${g}, ${b})`;
        } else {
          rgb = `rgba(${r}, ${g}, ${b}, ${a})`;
        }
      }
      if (key) {
        res = [key, rgb];
      } else {
        res = rgb;
      }
    }
  }
  cachedResults.set(cacheKey, res);
  return res;
};

/**
 * parse CSS color
 * @param {string} value - color value
 *  - color-mix() and system colors are not supported
 * @param {object} [opt] - options
 * @param {boolean} [opt.d50] - xyz in d50 white point
 * @returns {Array.<number>} - [x, y, z, a] x|y|z: around 0..1 a: 0..1
 */
export const parse = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
    if (value.startsWith('color-mix(')) {
      throw new Error('color-mix() is not supported.');
    }
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const cacheKey = `{parse:${value.toLowerCase()},opt:${JSON.stringify(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  let xyz;
  if (/calc/i.test(value)) {
    value = calc(value);
  }
  if (value.startsWith('color(')) {
    xyz = parseColorFunc(value, opt);
  } else {
    xyz = parseColorValue(value, opt);
  }
  cachedResults.set(cacheKey, xyz);
  return xyz;
};
