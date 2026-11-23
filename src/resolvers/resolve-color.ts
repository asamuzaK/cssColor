/**
 * CSS color resolution and processing utilities.
 */

import { transformXyzToRgb } from '../matrix/transform';
import { convertColorToRgb } from '../converters/convert-color';
import { convertRgbToHex } from '../converters/convert-hex';
import {
  ColorChannels,
  ComputedColorChannels,
  Options,
  SpecifiedColorChannels
} from '../typedef';
import { createCacheKey, getCache, setCache } from '../utils/cache';
import { isString } from '../utils/common';
import { cssCalc, resolveVar } from '../utils/css-calc-var';
import { resolveInvalidColorValue, splitValue } from '../utils/util';
import { resolveColorMix } from './color-mix';
import { parseColorFunc } from './parse-color';
import { resolveRelativeColor } from './relative-color';
import { serializeColorValue } from './serialize';

/* constants */
import {
  SYN_COLOR_TYPE,
  SYN_FN_CALC,
  SYN_FN_REL,
  SYN_FN_VAR,
  SYN_MIX,
  VAL_COMP,
  VAL_MIX,
  VAL_SPEC
} from '../utils/constant';
import { NAMED_COLORS } from './named-color';
const NAMESPACE = 'resolve-color';
const RGB_TRANSPARENT = 'rgba(0, 0, 0, 0)';

/* regexp */
const REG_COLOR = new RegExp(`^(?:${SYN_COLOR_TYPE})$`, 'i');
const REG_COLOR_FUNC_NAMES =
  /^(?:(?:ok)?l(?:ab|ch)|color(?:-mix)?|hsla?|hwb|rgba?|var)\(/i;
const REG_COLOR_MIX = new RegExp(SYN_MIX, 'i');
const REG_CURRENT = /^currentcolor$/i;
const REG_FN_CALC = new RegExp(SYN_FN_CALC, 'i');
const REG_FN_COLOR = /^color\(/i;
const REG_FN_LIGHT_DARK = /^light-dark\(/i;
const REG_FN_MIX = /^color-mix\(/i;
const REG_FN_REL = new RegExp(SYN_FN_REL, 'i');
const REG_FN_VAR = new RegExp(SYN_FN_VAR, 'i');
const REG_NAMED_COLOR = /^[a-z]+$/i;
const REG_TRANSPARENT = /^transparent$/i;

/**
 * Resolves a CSS color value into its color channel representation.
 * @param value - The CSS color value string to resolve.
 * @param opt - The resolution options.
 * @returns The resolved color channels array, a string representation, an empty string, or null.
 */
export const resolveColorValue = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (!isString(value)) {
    throw new TypeError(`${value} is not a string.`);
  }
  value = value.trim();
  const { colorSpace = '', format = '', nullable = false } = opt;
  const cacheKey: string = createCacheKey(
    {
      namespace: NAMESPACE,
      name: 'resolveColorValue',
      value
    },
    opt
  );
  const cachedResult = getCache(cacheKey);
  if (cachedResult !== false) {
    const { item } = cachedResult;
    if (Array.isArray(item)) {
      return [...item] as SpecifiedColorChannels;
    }
    return item as string | null;
  }
  const serializedValue = serializeColorValue(value, opt);
  if (!serializedValue) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      setCache(cacheKey, null);
      return null;
    }
    setCache(cacheKey, res);
    if (isString(res)) {
      return res as string;
    }
    return [...res] as SpecifiedColorChannels;
  }
  if (format === VAL_SPEC) {
    setCache(cacheKey, serializedValue);
    if (isString(serializedValue)) {
      return serializedValue as string;
    }
    return [...serializedValue] as SpecifiedColorChannels;
  }
  if (format === VAL_COMP) {
    setCache(cacheKey, serializedValue);
    return [...serializedValue] as SpecifiedColorChannels;
  }
  const [cn, v1, v2, v3, alpha] = serializedValue;
  if (format === VAL_MIX && (!colorSpace || cn === colorSpace)) {
    setCache(cacheKey, serializedValue);
    return [...serializedValue] as SpecifiedColorChannels;
  }
  if (!colorSpace && (cn === 'rgb' || cn === 'srgb')) {
    setCache(cacheKey, serializedValue);
    return [...serializedValue] as SpecifiedColorChannels;
  }
  const serializedColor = `${cn}(${v1} ${v2} ${v3} / ${alpha})`;
  const [r, g, b] = convertColorToRgb(serializedColor) as ColorChannels;
  const rgbValue = ['rgb', Math.round(r), Math.round(g), Math.round(b), alpha];
  setCache(cacheKey, rgbValue);
  return [...rgbValue] as SpecifiedColorChannels;
};

/**
 * Resolves a generic color() CSS function value.
 * @param value - The color function value string to resolve.
 * @param opt - The resolution options.
 * @returns The resolved color channels array, an empty string, or null.
 */
export const resolveColorFunc = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (!isString(value)) {
    return null;
  }
  value = value.trim();
  const { colorSpace = '', format = '', nullable = false } = opt;
  const cacheKey: string = createCacheKey(
    {
      namespace: NAMESPACE,
      name: 'resolveColorFunc',
      value
    },
    opt
  );
  const cachedResult = getCache(cacheKey);
  if (cachedResult !== false) {
    const { item } = cachedResult;
    if (Array.isArray(item)) {
      return [...item] as SpecifiedColorChannels;
    }
    return item as string | null;
  }
  const serializedValue = serializeColorValue(value, opt);
  if (!serializedValue) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      setCache(cacheKey, null);
      return null;
    }
    setCache(cacheKey, res);
    if (isString(res)) {
      return res as string;
    }
    return [...res] as SpecifiedColorChannels;
  }
  if (format === VAL_SPEC || format === VAL_COMP) {
    setCache(cacheKey, serializedValue);
    return [...serializedValue] as SpecifiedColorChannels;
  }
  const [cn, , , , alpha] = serializedValue;
  if (format === VAL_MIX && (!colorSpace || cn === colorSpace)) {
    setCache(cacheKey, serializedValue);
    return [...serializedValue] as SpecifiedColorChannels;
  }
  if (!format && !colorSpace && (cn === 'rgb' || cn === 'srgb')) {
    setCache(cacheKey, serializedValue);
    return [...serializedValue] as SpecifiedColorChannels;
  }
  // FIXME: Use serializedValue for parseColorFunc
  const [, x, y, z] = parseColorFunc(value, opt) as ComputedColorChannels;
  const [r, g, b] = transformXyzToRgb([x, y, z], true);
  const rgbValue = ['rgb', r, g, b, alpha];
  setCache(cacheKey, rgbValue);
  return [...rgbValue] as SpecifiedColorChannels;
};

/**
 * Resolves a CSS color string based on the given options.
 * @param value - The CSS color string to resolve.
 * @param opt - The resolution options.
 * @returns The resolved color string, or null if resolution fails.
 */
export const resolveColor = (
  value: string,
  opt: Options = {}
): string | null => {
  if (!isString(value)) {
    throw new TypeError(`${value} is not a string.`);
  }
  value = value.trim();
  const {
    colorScheme = 'normal',
    currentColor = '',
    format = VAL_COMP,
    nullable = false
  } = opt;
  if (isString(currentColor) && /currentcolor/i.test(currentColor)) {
    throw new SyntaxError(
      `Unexpected currentcolor keyword in ${currentColor}.`
    );
  }
  const cacheKey: string = createCacheKey(
    { namespace: NAMESPACE, name: 'resolve', value },
    opt
  );
  const cachedResult = getCache(cacheKey);
  if (cachedResult !== false) {
    return cachedResult.item as string | null;
  }
  // 1. var() resolution
  if (REG_FN_VAR.test(value)) {
    if (format === VAL_SPEC) {
      setCache(cacheKey, value);
      return value;
    }
    const resolvedVar = resolveVar(value, opt);
    if (resolvedVar === null) {
      const res = resolveInvalidColorValue(format, nullable, true);
      if (res === null) {
        setCache(cacheKey, null);
        return null;
      }
      setCache(cacheKey, res);
      return res as string;
    }
    value = resolvedVar;
  }
  if (opt.format !== format) {
    opt.format = format;
  }
  // 2. light-dark() resolution
  if (REG_FN_LIGHT_DARK.test(value) && value.endsWith(')')) {
    const colorParts = value.replace(REG_FN_LIGHT_DARK, '').replace(/\)$/, '');
    const [light = '', dark = ''] = splitValue(colorParts, { delimiter: ',' });
    // Invalid light-dark
    if (!light || !dark) {
      const res = resolveInvalidColorValue(format, nullable, true) as
        string | null;
      setCache(cacheKey, res);
      return res;
    }
    if (format === VAL_SPEC) {
      const lightColor = resolveColor(light, opt);
      const darkColor = resolveColor(dark, opt);
      const res =
        lightColor && darkColor
          ? `light-dark(${lightColor}, ${darkColor})`
          : '';
      setCache(cacheKey, res);
      return res;
    }
    const chosen = colorScheme === 'dark' ? dark : light;
    const resolved = resolveColor(chosen, opt);
    setCache(cacheKey, resolved);
    return resolved;
  }
  // 3. Relative Color resolution
  if (REG_FN_REL.test(value)) {
    const resolvedRel = resolveRelativeColor(value, opt, resolveColor);
    if (resolvedRel === null) {
      const res = resolveInvalidColorValue(format, nullable, true) as
        string | null;
      setCache(cacheKey, res);
      return res;
    }
    if (format === VAL_SPEC) {
      setCache(cacheKey, resolvedRel);
      return resolvedRel;
    }
    value = resolvedRel;
  }
  // 4. calc() resolution
  if (REG_FN_CALC.test(value)) {
    value = cssCalc(value, opt);
  }
  // 5. Keyword & Color-space resolution
  let cs = '';
  let r = NaN;
  let g = NaN;
  let b = NaN;
  let alpha = NaN;
  if (REG_TRANSPARENT.test(value)) {
    let res: string | null;
    switch (format) {
      case VAL_SPEC: {
        res = value;
        break;
      }
      case 'hex': {
        res = null;
        break;
      }
      case 'hexAlpha': {
        res = '#00000000';
        break;
      }
      default: {
        res = RGB_TRANSPARENT;
      }
    }
    setCache(cacheKey, res);
    return res;
  }
  if (REG_CURRENT.test(value)) {
    if (format === VAL_SPEC) {
      setCache(cacheKey, value);
      return value;
    }
    if (currentColor) {
      let resolvedCurrent;
      if (REG_FN_MIX.test(currentColor)) {
        resolvedCurrent = resolveColorMix(currentColor, opt, resolveColor);
      } else if (REG_FN_COLOR.test(currentColor)) {
        resolvedCurrent = resolveColorFunc(currentColor, opt);
      } else {
        resolvedCurrent = resolveColorValue(currentColor, opt);
      }
      if (resolvedCurrent === null) {
        const res = resolveInvalidColorValue(format, nullable, true) as
          string | null;
        setCache(cacheKey, res);
        return res;
      }
      [cs, r, g, b, alpha] = resolvedCurrent as ComputedColorChannels;
    } else {
      const res = resolveInvalidColorValue(format, nullable, true) as
        string | null;
      setCache(cacheKey, res);
      return res;
    }
  } else if (format === VAL_SPEC) {
    let res = '';
    if (REG_FN_MIX.test(value)) {
      const mixRes = resolveColorMix(value, opt, resolveColor);
      if (isString(mixRes) && mixRes) {
        res = mixRes;
      }
    } else if (REG_FN_COLOR.test(value)) {
      const funcRes = resolveColorFunc(value, opt);
      if (Array.isArray(funcRes)) {
        const [scs, rr, gg, bb, aa] = funcRes as SpecifiedColorChannels;
        res =
          aa === 1
            ? `color(${scs} ${rr} ${gg} ${bb})`
            : `color(${scs} ${rr} ${gg} ${bb} / ${aa})`;
      }
    } else {
      const rgb = resolveColorValue(value, opt);
      if (Array.isArray(rgb)) {
        const [scs, rr, gg, bb, aa] = rgb as SpecifiedColorChannels;
        if (scs === 'rgb') {
          res =
            aa === 1
              ? `${scs}(${rr}, ${gg}, ${bb})`
              : `${scs}a(${rr}, ${gg}, ${bb}, ${aa})`;
        } else {
          res =
            aa === 1
              ? `${scs}(${rr} ${gg} ${bb})`
              : `${scs}(${rr} ${gg} ${bb} / ${aa})`;
        }
      } else if (rgb) {
        res = rgb;
      }
    }
    setCache(cacheKey, res);
    return res;
  } else if (REG_FN_MIX.test(value)) {
    if (currentColor) {
      value = value.replace(/currentcolor/gi, currentColor);
    }
    value = value.replace(/transparent/gi, RGB_TRANSPARENT);
    const resolvedMix = resolveColorMix(value, opt, resolveColor);
    if (resolvedMix === null) {
      setCache(cacheKey, null);
      return null;
    }
    [cs, r, g, b, alpha] = resolvedMix as ComputedColorChannels;
  } else if (REG_FN_COLOR.test(value)) {
    const resolvedFunc = resolveColorFunc(value, opt);
    if (resolvedFunc === null) {
      setCache(cacheKey, null);
      return null;
    }
    [cs, r, g, b, alpha] = resolvedFunc as ComputedColorChannels;
  } else if (value) {
    const resolvedVal = resolveColorValue(value, opt);
    if (resolvedVal === null) {
      setCache(cacheKey, null);
      return null;
    }
    [cs, r, g, b, alpha] = resolvedVal as ComputedColorChannels;
  }
  // 6. Format Finalization
  let finalRes: string | null = '';
  switch (format) {
    case 'hex':
    case 'hexAlpha': {
      // FIXME: Check later.
      if (
        Number.isNaN(r) ||
        Number.isNaN(g) ||
        Number.isNaN(b) ||
        Number.isNaN(alpha)
      ) {
        finalRes = null;
      } else {
        finalRes = convertRgbToHex([r, g, b, format === 'hex' ? 1 : alpha]);
      }
      break;
    }
    default: {
      if (cs === 'rgb') {
        finalRes =
          alpha === 1
            ? `${cs}(${r}, ${g}, ${b})`
            : `${cs}a(${r}, ${g}, ${b}, ${alpha})`;
      } else if (['lab', 'lch', 'oklab', 'oklch'].includes(cs)) {
        finalRes =
          alpha === 1
            ? `${cs}(${r} ${g} ${b})`
            : `${cs}(${r} ${g} ${b} / ${alpha})`;
      } else {
        finalRes =
          alpha === 1
            ? `color(${cs} ${r} ${g} ${b})`
            : `color(${cs} ${r} ${g} ${b} / ${alpha})`;
      }
    }
  }
  setCache(cacheKey, finalRes);
  return finalRes;
};

/**
 * Validates whether a given value is a recognizable and valid CSS color.
 * @param value - The value to validate.
 * @param opt - The resolution options.
 * @returns True if the value is a valid color, otherwise false.
 */
export const isValidColor = (value: unknown, opt: Options = {}): boolean => {
  if (!isString(value)) {
    return false;
  }
  const color = value.trim();
  if (!color) {
    return false;
  }
  if (REG_NAMED_COLOR.test(color)) {
    const loweredColor = color.toLowerCase();
    return (
      loweredColor === 'currentcolor' ||
      loweredColor === 'transparent' ||
      Object.hasOwn(NAMED_COLORS, loweredColor)
    );
  }
  if (REG_COLOR.test(color) || REG_COLOR_MIX.test(color)) {
    return true;
  }
  if (REG_COLOR_FUNC_NAMES.test(color)) {
    const options = {
      ...opt,
      nullable: true
    };
    return !!resolveColor(color, options);
  }
  return false;
};
