/*!
 * CSS color - Resolve, parse, convert CSS color.
 * @license MIT
 * @copyright asamuzaK (Kazz)
 * @see {@link https://github.com/asamuzaK/cssColor/blob/main/LICENSE}
 */

import {
  convertRgbToHex, convertXyzD50ToLab, convertXyzD50ToLch, convertXyzToHex,
  convertXyzToHsl, convertXyzToHwb, convertXyzToOklab, convertXyzToOklch,
  convertXyzToRgb, convertXyzToXyzD50, parseColorFunc, parseColorValue,
  resolveColorFunc, resolveColorMix, resolveColorValue
} from './js/color.js';
import { getType, isString } from './js/common.js';

/**
 * resolve CSS color
 * @param {string} color - color value
 *   - system colors are not supported
 * @param {object} [opt] - options
 * @param {string} [opt.currentColor] - color to use for `currentcolor` keyword
 * @param {string} [opt.format] - `rgb`(default), `array`, `hex` or `hexAlpha`
 *   - `hexAlpha` is a hex color notation with alpha channel, i.e. #rrggbbaa
 * @param {*} [opt.key] - key e.g. CSS property `background-color`
 * @returns {?string|Array} - rgba?(), [r, g, b, a], #rrggbb(aa)?, null
 *   - if `key` is specified, [key, rgba?()|[r, g, b, a]|#rrggbb(aa)?|null]
 *   - in `rgb`, `r`, `g`, `b` values are rounded,
 *     resolves as empty string if any of `r`, `g`, `b`, `a` is not a number
 *   - in `array`, values are floating point,
 *     if any of `r`, `g`, `b`, `a` is not a number then they stay as is,
 *     e.g. [undefined, undefined, undefined, undefined]
 *   - in `hex`, `transparent` resolves as `null`,
 *     also resolves as `null` if any of `r`, `g`, `b`, `a` is not a number
 *   - in `hexAlpha`, resolves as `null` if any of `r`, `g`, `b`, `a` is not a number
 */
export const resolve = (color, opt = {}) => {
  if (isString(color)) {
    color = color.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(color)}.`);
  }
  const { currentColor, format, key } = opt;
  let r, g, b, a;
  if (/^currentcolor$/i.test(color)) {
    if (currentColor) {
      if (currentColor.startsWith('color-mix')) {
        [r, g, b, a] = resolveColorMix(currentColor);
      } else if (currentColor.startsWith('color(')) {
        [r, g, b, a] = resolveColorFunc(currentColor);
      } else {
        [r, g, b, a] = resolveColorValue(currentColor);
      }
    } else {
      r = 0;
      g = 0;
      b = 0;
      a = 0;
    }
  } else if (/^transparent$/i.test(color)) {
    r = 0;
    g = 0;
    b = 0;
    a = 0;
  } else if (color.startsWith('color-mix')) {
    [r, g, b, a] = resolveColorMix(color);
  } else if (color.startsWith('color(')) {
    [r, g, b, a] = resolveColorFunc(color);
  } else {
    [r, g, b, a] = resolveColorValue(color);
  }
  let res;
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
    default: {
      let rgb;
      if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
        rgb = '';
      } else {
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
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
  const { d50 } = opt;
  let xyz;
  if (value.startsWith('color(')) {
    xyz = parseColorFunc(value, d50);
  } else {
    xyz = parseColorValue(value, d50);
  }
  return xyz;
};

/**
 * convert
 * @property {Function} rgbToHex - convert rgb to hex
 * @property {Function} xyzD50ToHex - convert xyz d50 to hex
 * @property {Function} xyzD50ToLab - convert xyz d50 to lab
 * @property {Function} xyzD50ToLch - convert xyz d50 to lch
 * @property {Function} xyzD50ToRgb - convert xyz d50 to rgb
 * @property {Function} xyzToHex - convert xyz to hex
 * @property {Function} xyzToHsl - convert xyz to hsl
 * @property {Function} xyzToHwb - convert xyz to hwb
 * @property {Function} xyzToOklab - convert xyz to oklab
 * @property {Function} xyzToOklch - convert xyz to oklch
 * @property {Function} xyzToRgb - convert xyz to rgb
 * @property {Function} xyzToXyzD50 - convert xyz to xyz d50
 */
export const convert = {
  rgbToHex: convertRgbToHex,
  xyzD50ToLab: convertXyzD50ToLab,
  xyzD50ToLch: convertXyzD50ToLch,
  xyzToHex: convertXyzToHex,
  xyzToHsl: convertXyzToHsl,
  xyzToHwb: convertXyzToHwb,
  xyzToOklab: convertXyzToOklab,
  xyzToOklch: convertXyzToOklch,
  xyzToRgb: convertXyzToRgb,
  xyzToXyzD50: convertXyzToXyzD50
};
