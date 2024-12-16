/**
 * resolve.js
 */

import { LRUCache } from 'lru-cache';
import {
  convertRgbToHex, resolveColorFunc, resolveColorMix, resolveColorValue
} from './color.js';
import { getType, isString } from './common.js';
import { cssCalc } from './css-calc.js';
import { cssVar } from './css-var.js';
import { valueToJsonString } from './util.js';

/* constants */
import {
  FUNC_CALC_ESC, FUNC_COLOR, FUNC_MIX, FUNC_VAR_ESC, VAL_COMP, VAL_SPEC
} from './constant.js';
const RGB_TRANSPARENT = 'rgba(0, 0, 0, 0)';

/* regexp */
const REG_FUNC_CALC = new RegExp(FUNC_CALC_ESC);
const REG_FUNC_VAR = new RegExp(FUNC_VAR_ESC);

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * resolve CSS color
 * @param {string} color - color value
 *   - system colors are not supported
 * @param {object} [opt] - options
 * @param {string} [opt.currentColor]
 *   - color to use for `currentcolor` keyword
 *   - if omitted, it will be treated as a missing color
 *     i.e. `rgb(none none none / none)`
 * @param {object} [opt.customProperty]
 *   - custom properties
 *   - pair of `--` prefixed property name and value,
 *     e.g. `customProperty: { '--some-color': '#0000ff' }`
 *   - and/or `callback` function to get the value of the custom property,
 *     e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`
 * @param {object} [opt.dimension]
 *   - dimension, convert relative length to pixels
 *   - pair of unit and it's value as a number in pixels,
 *     e.g. `dimension: { em: 12, rem: 16, vw: 10.26 }`
 *   - and/or `callback` function to get the value as a number in pixels,
 *     e.g. `dimension: { callback: convertUnitToPixel }`
 * @param {string} [opt.format]
 *   - output format, one of below
 *   - `computedValue` (default), [computed value][139] of the color
 *   - `specifiedValue`, [specified value][140] of the color
 *   - `hex`, hex color notation, i.e. `rrggbb`
 *   - `hexAlpha`, hex color notation with alpha channel, i.e. `#rrggbbaa`
 * @param {*} [opt.key] - key e.g. CSS property `background-color`
 * @returns {?string|Array}
 *   - one of rgba?(), #rrggbb(aa)?, color-name, '(empty-string)',
 *     color(color-space r g b / alpha), color(color-space x y z / alpha),
 *     lab(l a b / alpha), lch(l c h / alpha), oklab(l a b / alpha),
 *     oklch(l c h / alpha), null or [key, rgba?()] etc. if `key` is specified
 *   - in `computedValue`, values are numbers, however `rgb()` values are
 *     integers
 *   - in `specifiedValue`, returns `empty string` for unknown and/or invalid
 *     color
 *   - in `rgb`, values are rounded to integers,
 *     and returns `rgba(0, 0, 0, 0)` for unknown and/or invalid color
 *   - in `hex`, returns `null` for `transparent`, and also returns `null` if
 *     any of `r`, `g`, `b`, `alpha` is not a number
 *   - in `hexAlpha`, returns `#00000000` for `transparent`,
 *     however returns `null` if any of `r`, `g`, `b`, `alpha` is not a number
 */
export const resolve = (color, opt = {}) => {
  if (isString(color)) {
    color = color.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(color)}.`);
  }
  const { currentColor, customProperty, format = VAL_COMP, key } = opt;
  let cacheKey;
  if (!REG_FUNC_VAR.test(color) ||
      typeof customProperty?.callback !== 'function') {
    cacheKey = `{resolve:${color},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  let res, cs, r, g, b, alpha;
  if (REG_FUNC_VAR.test(color)) {
    if (format === VAL_SPEC) {
      if (cacheKey) {
        cachedResults.set(cacheKey, color);
      }
      return color;
    }
    color = cssVar(color, opt);
    if (!color) {
      switch (format) {
        case 'hex':
        case 'hexAlpha': {
          if (cacheKey) {
            cachedResults.set(cacheKey, null);
          }
          return null;
        }
        default: {
          res = RGB_TRANSPARENT;
          if (cacheKey) {
            cachedResults.set(cacheKey, res);
          }
          return res;
        }
      }
    }
  }
  if (opt.format !== format) {
    opt.format = format;
  }
  color = color.toLowerCase();
  if (REG_FUNC_CALC.test(color)) {
    color = cssCalc(color, opt);
  }
  if (color === 'transparent') {
    switch (format) {
      case VAL_COMP: {
        res = RGB_TRANSPARENT;
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
      case VAL_SPEC: {
        if (cacheKey) {
          cachedResults.set(cacheKey, color);
        }
        return color;
      }
      case 'hex': {
        if (cacheKey) {
          cachedResults.set(cacheKey, null);
        }
        return null;
      }
      case 'hexAlpha': {
        res = '#00000000';
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
      default: {
        r = 0;
        g = 0;
        b = 0;
        alpha = 0;
      }
    }
  } else if (color === 'currentcolor') {
    if (format === VAL_SPEC) {
      if (cacheKey) {
        cachedResults.set(cacheKey, color);
      }
      return color;
    }
    if (currentColor) {
      if (currentColor.startsWith(FUNC_MIX)) {
        [cs, r, g, b, alpha] = resolveColorMix(currentColor, opt);
      } else if (currentColor.startsWith(FUNC_COLOR)) {
        [cs, r, g, b, alpha] = resolveColorFunc(currentColor, opt);
      } else {
        [cs, r, g, b, alpha] = resolveColorValue(currentColor, opt);
      }
    } else if (format === VAL_COMP) {
      res = RGB_TRANSPARENT;
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    }
  } else if (format === VAL_SPEC) {
    if (color.startsWith(FUNC_MIX)) {
      res = resolveColorMix(color, opt);
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    } else if (color.startsWith(FUNC_COLOR)) {
      [cs, r, g, b, alpha] = resolveColorFunc(color, opt);
      if (alpha === 1) {
        res = `color(${cs} ${r} ${g} ${b})`;
      } else {
        res = `color(${cs} ${r} ${g} ${b} / ${alpha})`;
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    } else {
      const rgb = resolveColorValue(color, opt);
      if (!rgb) {
        res = '';
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
      [cs, r, g, b, alpha] = rgb;
      if (cs === 'rgb') {
        if (alpha === 1) {
          res = `${cs}(${r}, ${g}, ${b})`;
        } else {
          res = `${cs}a(${r}, ${g}, ${b}, ${alpha})`;
        }
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
      if (alpha === 1) {
        res = `${cs}(${r} ${g} ${b})`;
      } else {
        res = `${cs}(${r} ${g} ${b} / ${alpha})`;
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    }
  } else if (/currentcolor/.test(color)) {
    if (currentColor) {
      color = color.replace(/currentcolor/g, currentColor);
    }
    if (/transparent/.test(color)) {
      color = color.replace(/transparent/g, RGB_TRANSPARENT);
    }
    if (color.startsWith(FUNC_MIX)) {
      [cs, r, g, b, alpha] = resolveColorMix(color, opt);
    }
  } else if (/transparent/.test(color)) {
    color = color.replace(/transparent/g, RGB_TRANSPARENT);
    if (color.startsWith(FUNC_MIX)) {
      [cs, r, g, b, alpha] = resolveColorMix(color, opt);
    }
  } else if (color.startsWith(FUNC_MIX)) {
    [cs, r, g, b, alpha] = resolveColorMix(color, opt);
  } else if (color.startsWith(FUNC_COLOR)) {
    [cs, r, g, b, alpha] = resolveColorFunc(color, opt);
  } else if (color) {
    [cs, r, g, b, alpha] = resolveColorValue(color, opt);
  }
  switch (format) {
    case 'hex': {
      let hex;
      if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(alpha) || alpha === 0) {
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
      if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(alpha)) {
        hex = null;
      } else {
        hex = convertRgbToHex([r, g, b, alpha]);
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
      if (alpha === 1) {
        rgb = `rgb(${r}, ${g}, ${b})`;
      } else {
        rgb = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      if (key) {
        res = [key, rgb];
      } else {
        res = rgb;
      }
      break;
    }
    case VAL_COMP:
    default: {
      let value;
      switch (cs) {
        case 'rgb': {
          if (alpha === 1) {
            value = `${cs}(${r}, ${g}, ${b})`;
          } else {
            value = `${cs}a(${r}, ${g}, ${b}, ${alpha})`;
          }
          break;
        }
        case 'lab':
        case 'lch':
        case 'oklab':
        case 'oklch': {
          if (alpha === 1) {
            value = `${cs}(${r} ${g} ${b})`;
          } else {
            value = `${cs}(${r} ${g} ${b} / ${alpha})`;
          }
          break;
        }
        // color()
        default: {
          if (alpha === 1) {
            value = `color(${cs} ${r} ${g} ${b})`;
          } else {
            value = `color(${cs} ${r} ${g} ${b} / ${alpha})`;
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
  if (cacheKey) {
    cachedResults.set(cacheKey, res);
  }
  return res;
};
