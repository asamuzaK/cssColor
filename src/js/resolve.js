/**
 * resolve.js
 */

import { calc } from '@csstools/css-calc';
import { LRUCache } from 'lru-cache';
import {
  convertRgbToHex, resolveColorFunc, resolveColorMix, resolveColorValue
} from './color.js';
import { getType, isString } from './common.js';
import { cssVar } from './css-var.js';
import { stringifyOptions } from './util.js';

/* constants */
import { FUNC_CALC, FUNC_VAR, VAL_COMP, VAL_SPEC } from './constant.js';

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
 *   - returns one of rgba?(), #rrggbb(aa)?, color-name, '(empty-string)',
 *     color(color-space r g b / alpha), color(color-space x y z / alpha),
 *     lab(l a b / alpha), lch(l c h / alpha), oklab(l a b / alpha),
 *     oklch(l c h / alpha), null or [key, rgba?()] etc. if `key` is specified
 *   - in `spec`, returned values are numbers, however rgb() values are integers
 *   - in `rgb`, values are rounded to integers, and returns `rgba(0, 0, 0, 0)`
 *     for unknown colors
 *   - in `hex`, `transparent` value is resolved as `null`, also returns `null`
 *     if any of `r`, `g`, `b`, `alpha` is not a number
 *   - in `hexAlpha`, `transparent` resolves as `#00000000`, and returns `null`
 *     if any of `r`, `g`, `b`, `alpha` is not a number
 */
export const resolve = (color, opt = {}) => {
  if (isString(color)) {
    color = color.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(color)}.`);
  }
  const cacheKey = `{resolve:${color},opt:${stringifyOptions(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const { currentColor, format = VAL_COMP, key } = opt;
  let cs, r, g, b, alpha;
  if (color.includes(FUNC_VAR)) {
    if (format === VAL_SPEC) {
      return color;
    }
    color = cssVar(color, opt);
    if (!color) {
      switch (format) {
        case 'hex':
        case 'hexAlpha': {
          return null;
        }
        default: {
          return 'rgba(0, 0, 0, 0)';
        }
      }
    }
  }
  color = color.toLowerCase();
  if (color.includes(FUNC_CALC)) {
    color = calc(color, opt);
  }
  if (color === 'transparent') {
    switch (format) {
      case VAL_COMP: {
        return 'rgba(0, 0, 0, 0)';
      }
      case VAL_SPEC: {
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
        alpha = 0;
      }
    }
  } else if (color === 'currentcolor') {
    if (format === VAL_SPEC) {
      return color;
    }
    if (currentColor) {
      if (currentColor.startsWith('color-mix')) {
        [cs, r, g, b, alpha] = resolveColorMix(currentColor, {
          format
        });
      } else if (currentColor.startsWith('color(')) {
        [cs, r, g, b, alpha] = resolveColorFunc(currentColor, {
          format
        });
      } else {
        [cs, r, g, b, alpha] = resolveColorValue(currentColor, {
          format
        });
      }
    } else if (format === VAL_COMP) {
      return 'rgba(0, 0, 0, 0)';
    }
  } else if (format === VAL_SPEC) {
    if (color.startsWith('color-mix')) {
      return resolveColorMix(color, {
        format
      });
    } else if (color.startsWith('color(')) {
      [cs, r, g, b, alpha] = resolveColorFunc(color, {
        format
      });
      if (alpha === 1) {
        return `color(${cs} ${r} ${g} ${b})`;
      }
      return `color(${cs} ${r} ${g} ${b} / ${alpha})`;
    } else {
      const rgb = resolveColorValue(color, {
        format
      });
      if (!rgb) {
        return '';
      }
      [cs, r, g, b, alpha] = rgb;
      if (cs === 'rgb') {
        if (alpha === 1) {
          return `${cs}(${r}, ${g}, ${b})`;
        }
        return `${cs}a(${r}, ${g}, ${b}, ${alpha})`;
      }
      if (alpha === 1) {
        return `${cs}(${r} ${g} ${b})`;
      }
      return `${cs}(${r} ${g} ${b} / ${alpha})`;
    }
  } else if (/currentcolor/.test(color)) {
    if (currentColor) {
      color = color.replace(/currentcolor/g, currentColor);
    }
    if (/transparent/.test(color)) {
      color = color.replace(/transparent/g, 'rgba(0, 0, 0, 0)');
    }
    if (color.startsWith('color-mix')) {
      [cs, r, g, b, alpha] = resolveColorMix(color, {
        format
      });
    }
  } else if (/transparent/.test(color)) {
    color = color.replace(/transparent/g, 'rgba(0, 0, 0, 0)');
    if (color.startsWith('color-mix')) {
      [cs, r, g, b, alpha] = resolveColorMix(color, {
        format
      });
    }
  } else if (color.startsWith('color-mix')) {
    [cs, r, g, b, alpha] = resolveColorMix(color, {
      format
    });
  } else if (color.startsWith('color(')) {
    [cs, r, g, b, alpha] = resolveColorFunc(color, {
      format
    });
  } else if (color) {
    [cs, r, g, b, alpha] = resolveColorValue(color, {
      format
    });
  }
  let res;
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
  cachedResults.set(cacheKey, res);
  return res;
};
