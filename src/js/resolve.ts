/**
 * resolve
 */

import { CacheItem, LRUCache, NullObject } from './cache';
import {
  convertRgbToHex,
  resolveColorFunc,
  resolveColorMix,
  resolveColorValue
} from './color';
import { isString } from './common';
import { cssCalc } from './css-calc';
import { cssVar } from './css-var';
import { resolveRelativeColor } from './relative-color';
import { valueToJsonString } from './util';
import {
  ComputedColorChannels,
  Options,
  SpecifiedColorChannels
} from './typedef';

/* constants */
import {
  FN_COLOR,
  FN_MIX,
  SYN_FN_CALC,
  SYN_FN_REL,
  SYN_FN_VAR,
  VAL_COMP,
  VAL_SPEC
} from './constant';
const RGB_TRANSPARENT = 'rgba(0, 0, 0, 0)';

/* regexp */
const REG_FN_CALC = new RegExp(SYN_FN_CALC);
const REG_FN_REL = new RegExp(SYN_FN_REL);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * resolve CSS color
 * @param color
 *   - color value
 *   - system colors are not supported
 * @param [opt] - options
 * @param [opt.currentColor]
 *   - color to use for `currentcolor` keyword
 *   - if omitted, it will be treated as a missing color
 *     i.e. `rgb(none none none / none)`
 * @param [opt.customProperty]
 *   - custom properties
 *   - pair of `--` prefixed property name and value,
 *     e.g. `customProperty: { '--some-color': '#0000ff' }`
 *   - and/or `callback` function to get the value of the custom property,
 *     e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`
 * @param [opt.dimension]
 *   - dimension, convert relative length to pixels
 *   - pair of unit and it's value as a number in pixels,
 *     e.g. `dimension: { em: 12, rem: 16, vw: 10.26 }`
 *   - and/or `callback` function to get the value as a number in pixels,
 *     e.g. `dimension: { callback: convertUnitToPixel }`
 * @param [opt.format]
 *   - output format, one of below
 *   - `computedValue` (default), [computed value][139] of the color
 *   - `specifiedValue`, [specified value][140] of the color
 *   - `hex`, hex color notation, i.e. `rrggbb`
 *   - `hexAlpha`, hex color notation with alpha channel, i.e. `#rrggbbaa`
 * @returns
 *   - one of rgba?(), #rrggbb(aa)?, color-name, '(empty-string)',
 *     color(color-space r g b / alpha), color(color-space x y z / alpha),
 *     lab(l a b / alpha), lch(l c h / alpha), oklab(l a b / alpha),
 *     oklch(l c h / alpha), null
 *   - in `computedValue`, values are numbers, however `rgb()` values are
 *     integers
 *   - in `specifiedValue`, returns `empty string` for unknown and/or invalid
 *     color
 *   - in `hex`, returns `null` for `transparent`, and also returns `null` if
 *     any of `r`, `g`, `b`, `alpha` is not a number
 *   - in `hexAlpha`, returns `#00000000` for `transparent`,
 *     however returns `null` if any of `r`, `g`, `b`, `alpha` is not a number
 */
export const resolve = (value: string, opt: Options = {}): string | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const {
    currentColor = '',
    customProperty = {},
    dimension = {},
    format = VAL_COMP
  } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{resolve:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      const cachedResult = cachedResults.get(cacheKey) as CacheItem;
      if (cachedResult.isNull) {
        return null;
      }
      return cachedResult.item as string;
    }
  }
  if (REG_FN_VAR.test(value)) {
    if (format === VAL_SPEC) {
      if (cacheKey) {
        cachedResults.set(cacheKey, new CacheItem(value));
      }
      return value;
    }
    const resolvedValue = cssVar(value, opt);
    if (resolvedValue instanceof NullObject) {
      switch (format) {
        case 'hex':
        case 'hexAlpha': {
          if (cacheKey) {
            cachedResults.set(cacheKey, resolvedValue);
          }
          return null;
        }
        default: {
          const res = RGB_TRANSPARENT;
          if (cacheKey) {
            cachedResults.set(cacheKey, new CacheItem(res));
          }
          return res;
        }
      }
    } else {
      value = resolvedValue;
    }
  }
  if (opt.format !== format) {
    opt.format = format;
  }
  value = value.toLowerCase();
  if (REG_FN_REL.test(value)) {
    const resolvedValue = resolveRelativeColor(value, opt);
    if (format === VAL_COMP) {
      let res = '';
      if (resolvedValue instanceof NullObject) {
        res = RGB_TRANSPARENT;
      } else {
        res = resolvedValue;
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, new CacheItem(res));
      }
      return res;
    }
    if (format === VAL_SPEC) {
      let res = '';
      if (resolvedValue instanceof NullObject) {
        res = '';
      } else {
        res = resolvedValue;
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, new CacheItem(res));
      }
      return res;
    }
    if (resolvedValue instanceof NullObject) {
      value = '';
    } else {
      value = resolvedValue;
    }
  }
  if (REG_FN_CALC.test(value)) {
    value = cssCalc(value, opt);
  }
  let cs = '';
  let r = NaN;
  let g = NaN;
  let b = NaN;
  let alpha = NaN;
  if (value === 'transparent') {
    switch (format) {
      case VAL_SPEC: {
        if (cacheKey) {
          cachedResults.set(cacheKey, new CacheItem(value));
        }
        return value;
      }
      case 'hex': {
        if (cacheKey) {
          cachedResults.set(cacheKey, new NullObject());
        }
        return null;
      }
      case 'hexAlpha': {
        const res = '#00000000';
        if (cacheKey) {
          cachedResults.set(cacheKey, new CacheItem(res));
        }
        return res;
      }
      case VAL_COMP:
      default: {
        const res = RGB_TRANSPARENT;
        if (cacheKey) {
          cachedResults.set(cacheKey, new CacheItem(res));
        }
        return res;
      }
    }
  } else if (value === 'currentcolor') {
    if (format === VAL_SPEC) {
      if (cacheKey) {
        cachedResults.set(cacheKey, new CacheItem(value));
      }
      return value;
    }
    if (currentColor) {
      if (currentColor.startsWith(FN_MIX)) {
        [cs, r, g, b, alpha] = resolveColorMix(
          currentColor,
          opt
        ) as ComputedColorChannels;
      } else if (currentColor.startsWith(FN_COLOR)) {
        [cs, r, g, b, alpha] = resolveColorFunc(
          currentColor,
          opt
        ) as ComputedColorChannels;
      } else {
        [cs, r, g, b, alpha] = resolveColorValue(
          currentColor,
          opt
        ) as ComputedColorChannels;
      }
    } else if (format === VAL_COMP) {
      const res = RGB_TRANSPARENT;
      if (cacheKey) {
        cachedResults.set(cacheKey, new CacheItem(res));
      }
      return res;
    }
  } else if (format === VAL_SPEC) {
    if (value.startsWith(FN_MIX)) {
      const res = resolveColorMix(value, opt) as string;
      if (cacheKey) {
        cachedResults.set(cacheKey, new CacheItem(res));
      }
      return res;
    } else if (value.startsWith(FN_COLOR)) {
      const [scs, rr, gg, bb, aa] = resolveColorFunc(
        value,
        opt
      ) as SpecifiedColorChannels;
      let res = '';
      if (aa === 1) {
        res = `color(${scs} ${rr} ${gg} ${bb})`;
      } else {
        res = `color(${scs} ${rr} ${gg} ${bb} / ${aa})`;
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, new CacheItem(res));
      }
      return res;
    } else {
      const rgb = resolveColorValue(value, opt);
      if (!rgb) {
        const res = '';
        if (cacheKey) {
          cachedResults.set(cacheKey, new CacheItem(res));
        }
        return res;
      }
      const [scs, rr, gg, bb, aa] = rgb as SpecifiedColorChannels;
      let res = '';
      if (scs === 'rgb') {
        if (aa === 1) {
          res = `${scs}(${rr}, ${gg}, ${bb})`;
        } else {
          res = `${scs}a(${rr}, ${gg}, ${bb}, ${aa})`;
        }
      } else if (aa === 1) {
        res = `${scs}(${rr} ${gg} ${bb})`;
      } else {
        res = `${scs}(${rr} ${gg} ${bb} / ${aa})`;
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, new CacheItem(res));
      }
      return res;
    }
  } else if (/currentcolor/.test(value)) {
    if (currentColor) {
      value = value.replace(/currentcolor/g, currentColor);
    }
    if (/transparent/.test(value)) {
      value = value.replace(/transparent/g, RGB_TRANSPARENT);
    }
    if (value.startsWith(FN_MIX)) {
      [cs, r, g, b, alpha] = resolveColorMix(
        value,
        opt
      ) as ComputedColorChannels;
    }
  } else if (/transparent/.test(value)) {
    value = value.replace(/transparent/g, RGB_TRANSPARENT);
    if (value.startsWith(FN_MIX)) {
      [cs, r, g, b, alpha] = resolveColorMix(
        value,
        opt
      ) as ComputedColorChannels;
    }
  } else if (value.startsWith(FN_MIX)) {
    [cs, r, g, b, alpha] = resolveColorMix(value, opt) as ComputedColorChannels;
  } else if (value.startsWith(FN_COLOR)) {
    [cs, r, g, b, alpha] = resolveColorFunc(
      value,
      opt
    ) as ComputedColorChannels;
  } else if (value) {
    [cs, r, g, b, alpha] = resolveColorValue(
      value,
      opt
    ) as ComputedColorChannels;
  }
  let res = '';
  switch (format) {
    case 'hex': {
      if (
        Number.isNaN(r) ||
        Number.isNaN(g) ||
        Number.isNaN(b) ||
        Number.isNaN(alpha) ||
        alpha === 0
      ) {
        if (cacheKey) {
          cachedResults.set(cacheKey, new NullObject());
        }
        return null;
      }
      res = convertRgbToHex([r, g, b, 1]);
      break;
    }
    case 'hexAlpha': {
      if (
        Number.isNaN(r) ||
        Number.isNaN(g) ||
        Number.isNaN(b) ||
        Number.isNaN(alpha)
      ) {
        if (cacheKey) {
          cachedResults.set(cacheKey, new NullObject());
        }
        return null;
      }
      res = convertRgbToHex([r, g, b, alpha]);
      break;
    }
    case VAL_COMP:
    default: {
      switch (cs) {
        case 'rgb': {
          if (alpha === 1) {
            res = `${cs}(${r}, ${g}, ${b})`;
          } else {
            res = `${cs}a(${r}, ${g}, ${b}, ${alpha})`;
          }
          break;
        }
        case 'lab':
        case 'lch':
        case 'oklab':
        case 'oklch': {
          if (alpha === 1) {
            res = `${cs}(${r} ${g} ${b})`;
          } else {
            res = `${cs}(${r} ${g} ${b} / ${alpha})`;
          }
          break;
        }
        // color()
        default: {
          if (alpha === 1) {
            res = `color(${cs} ${r} ${g} ${b})`;
          } else {
            res = `color(${cs} ${r} ${g} ${b} / ${alpha})`;
          }
        }
      }
    }
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, new CacheItem(res));
  }
  return res;
};
