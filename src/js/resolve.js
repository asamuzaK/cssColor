/**
 * resolve.js
 */

import { calc } from '@csstools/css-calc';
import { LRUCache } from 'lru-cache';
import {
  convertRgbToHex, resolveColorFunc, resolveColorMix, resolveColorValue
} from './color.js';
import { getType, isString } from './common.js';

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
 * @param {string} [opt.format]
 *   - output format, one of `computedValue` (default), `specifiedValue`,
 *     `rgb`, `hex`, `hexAlpha`
 *   - `hexAlpha` is a hex color notation with alpha channel, i.e. #rrggbbaa
 * @param {*} [opt.key] - key e.g. CSS property `background-color`
 * @returns {?string|Array}
 *   - returns one of rgba?(), color(space r g b / a), color(space x y z / a),
 *     lab(l a b / A), lch(l c h / a), oklab(l a b / A), oklch(l c h / a),
 *     #rrggbb(aa)?, null, and, if `key` is specified, [key, rgba?()] etc.
 *   - in `spec`, returned values are numbers, however rgb() values are integers
 *   - in `rgb`, values are rounded to integers, and returns `rgba(0, 0, 0, 0)`
 *     for unknown colors
 *   - in `hex`, `transparent` value is resolved as `null`, also returns `null`
 *     if any of `r`, `g`, `b`, `a` is not a number
 *   - in `hexAlpha`, `transparent` resolves as `#00000000`, and returns `null`
 *     if any of `r`, `g`, `b`, `a` is not a number
 */
export const resolve = (color, opt = {}) => {
  if (isString(color)) {
    color = color.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(color)}.`);
  }
  const cacheKey = `{resolve:${color},opt:${JSON.stringify(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const { currentColor, format = 'computedValue', key } = opt;
  let cs, r, g, b, a;
  if (/calc/.test(color)) {
    color = calc(color);
  }
  if (color === 'transparent') {
    switch (format) {
      case 'computedValue': {
        return 'rgba(0, 0, 0, 0)';
      }
      case 'specifiedValue': {
        return color;
      }
      case 'hex': {
        return null;
      }
      case 'hexAlpha': {
        return '#00000000';
      }
      default: {
        r = 0;
        g = 0;
        b = 0;
        a = 0;
      }
    }
  } else if (color === 'currentcolor') {
    if (format === 'specifiedValue') {
      return color;
    }
    if (currentColor) {
      if (currentColor.startsWith('color-mix')) {
        [cs, r, g, b, a] = resolveColorMix(currentColor, {
          format
        });
      } else if (currentColor.startsWith('color(')) {
        [cs, r, g, b, a] = resolveColorFunc(currentColor, {
          format
        });
      } else {
        [cs, r, g, b, a] = resolveColorValue(currentColor, {
          format
        });
      }
    } else if (format === 'computedValue') {
      return 'rgba(0, 0, 0, 0)';
    }
  } else if (format === 'specifiedValue') {
    if (color.startsWith('color-mix')) {
      return resolveColorMix(color, {
        format
      });
    } else if (color.startsWith('color(')) {
      [cs, r, g, b, a] = resolveColorFunc(color, {
        format
      });
      if (a === 1) {
        return `color(${cs} ${r} ${g} ${b})`;
      }
      return `color(${cs} ${r} ${g} ${b} / ${a})`;
    } else {
      return resolveColorValue(color, {
        format
      });
    }
  } else if (/currentcolor/.test(color)) {
    if (currentColor) {
      color = color.replace(/currentcolor/g, currentColor);
    }
    if (/transparent/.test(color)) {
      color = color.replace(/transparent/g, 'rgba(0, 0, 0, 0)');
    }
    if (color.startsWith('color-mix')) {
      [cs, r, g, b, a] = resolveColorMix(color, {
        format
      });
    }
  } else if (/transparent/.test(color)) {
    color = color.replace(/transparent/g, 'rgba(0, 0, 0, 0)');
    if (color.startsWith('color-mix')) {
      [cs, r, g, b, a] = resolveColorMix(color, {
        format
      });
    }
  } else if (color.startsWith('color-mix')) {
    [cs, r, g, b, a] = resolveColorMix(color, {
      format
    });
  } else if (color.startsWith('color(')) {
    [cs, r, g, b, a] = resolveColorFunc(color, {
      format
    });
  } else {
    [cs, r, g, b, a] = resolveColorValue(color, {
      format
    });
  }
  let res;
  switch (format) {
    case 'hex': {
      let hex;
      if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a) || a === 0) {
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
      if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
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
    case 'rgb': {
      let rgb;
      if (a === 1) {
        rgb = `rgb(${r}, ${g}, ${b})`;
      } else {
        rgb = `rgba(${r}, ${g}, ${b}, ${a})`;
      }
      if (key) {
        res = [key, rgb];
      } else {
        res = rgb;
      }
      break;
    }
    case 'computedValue':
    default: {
      let value;
      switch (cs) {
        case 'rgb': {
          if (a === 1) {
            value = `${cs}(${r}, ${g}, ${b})`;
          } else {
            value = `${cs}a(${r}, ${g}, ${b}, ${a})`;
          }
          break;
        }
        case 'lab':
        case 'lch':
        case 'oklab':
        case 'oklch': {
          if (a === 1) {
            value = `${cs}(${r} ${g} ${b})`;
          } else {
            value = `${cs}(${r} ${g} ${b} / ${a})`;
          }
          break;
        }
        // color()
        default: {
          if (a === 1) {
            value = `color(${cs} ${r} ${g} ${b})`;
          } else {
            value = `color(${cs} ${r} ${g} ${b} / ${a})`;
          }
        }
      }
      if (key) {
        res = [key, value];
      } else {
        res = value;
      }
    }
  }
  cachedResults.set(cacheKey, res);
  return res;
};
