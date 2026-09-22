/**
 * color
 */

import { createCacheKey, getCache, setCache } from './cache';
import { isString } from './common';
import { convertHexToRgb, convertHexToXyz } from './hex';
import {
  MATRIX_D50_TO_D65,
  MATRIX_D65_TO_D50,
  MATRIX_XYZ_TO_L_RGB,
  transformMatrix
} from './matrix';
import {
  parseLab,
  parseLch,
  parseOklab,
  parseOklch,
  parseHsl,
  parseHwb,
  parseRgb,
  parseColorFunc
} from './parse';
import {
  transformLinearRgbToRgb,
  transformRgbToXyz,
  transformXyzD50ToLab,
  transformXyzD50ToLch,
  transformXyzD50ToRgb,
  transformXyzToHsl,
  transformXyzToHwb,
  transformXyzToOklab,
  transformXyzToOklch,
  transformXyzToRgb
} from './transform';
import { parseAlpha, resolveInvalidColorValue, roundToPrecision } from './util';
import {
  ColorChannels,
  ComputedColorChannels,
  Options,
  MatchedRegExp,
  SpecifiedColorChannels,
  StringColorSpacedChannels,
  TriColorChannels
} from './typedef';

/* constants */
import {
  FN_COLOR,
  NONE,
  SYN_COLOR_TYPE,
  SYN_FN_COLOR,
  SYN_HSL,
  SYN_HSL_LV3,
  SYN_LCH,
  SYN_MOD,
  VAL_COMP,
  VAL_MIX,
  VAL_SPEC
} from './constant';
import { NAMED_COLORS } from './named-color';
const NAMESPACE = 'color';

/* numeric constants */
const HEX = 16;
const MAX_RGB = 255;

/* regexp */
const REG_COLOR = new RegExp(`^(?:${SYN_COLOR_TYPE})$`);
const REG_CURRENT = /^currentColor$/i;
const REG_FN_COLOR = new RegExp(`^color\\(\\s*(${SYN_FN_COLOR})\\s*\\)$`);
const REG_HSL = new RegExp(`^hsla?\\(\\s*(${SYN_HSL}|${SYN_HSL_LV3})\\s*\\)$`);
const REG_HWB = new RegExp(`^hwb\\(\\s*(${SYN_HSL})\\s*\\)$`);
const REG_LAB = new RegExp(`^lab\\(\\s*(${SYN_MOD})\\s*\\)$`);
const REG_LCH = new RegExp(`^lch\\(\\s*(${SYN_LCH})\\s*\\)$`);
const REG_OKLAB = new RegExp(`^oklab\\(\\s*(${SYN_MOD})\\s*\\)$`);
const REG_OKLCH = new RegExp(`^oklch\\(\\s*(${SYN_LCH})\\s*\\)$`);
const REG_SPEC = /^(?:specifi|comput)edValue$/;

/**
 * parse color value
 * @param value - CSS color value
 * @param opt - options
 * @returns parsed color
 *   - ['xyz-(d50|d65)', x, y, z, alpha], ['rgb', r, g, b, alpha]
 *   - value, '(empty)', null
 */
export const parseColorValue = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { d50 = false, format = '', nullable = false } = opt;
  if (!REG_COLOR.test(value)) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      return null;
    } else if (isString(res)) {
      return res as string;
    }
    return res as SpecifiedColorChannels;
  }
  let x = 0;
  let y = 0;
  let z = 0;
  let alpha = 0;
  // complement currentcolor as a missing color
  if (REG_CURRENT.test(value)) {
    if (format === VAL_COMP) {
      return ['rgb', 0, 0, 0, 0];
    }
    if (format === VAL_SPEC) {
      return value;
    }
    // named-color
  } else if (/^[a-z]+$/.test(value)) {
    if (Object.hasOwn(NAMED_COLORS, value)) {
      if (format === VAL_SPEC) {
        return value;
      }
      const [r, g, b] = NAMED_COLORS[
        value as keyof typeof NAMED_COLORS
      ] as TriColorChannels;
      alpha = 1;
      if (format === VAL_COMP) {
        return ['rgb', r, g, b, alpha];
      }
      [x, y, z] = transformRgbToXyz([r, g, b], true);
      if (d50) {
        [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
      }
    } else {
      switch (format) {
        case VAL_COMP: {
          if (nullable && value !== 'transparent') {
            return null;
          }
          return ['rgb', 0, 0, 0, 0];
        }
        case VAL_SPEC: {
          if (value === 'transparent') {
            return value;
          }
          return '';
        }
        case VAL_MIX: {
          if (value === 'transparent') {
            return ['rgb', 0, 0, 0, 0];
          }
          return null;
        }
        default:
      }
    }
    // hex-color
  } else if (value[0] === '#') {
    if (REG_SPEC.test(format)) {
      const rgb = convertHexToRgb(value);
      return ['rgb', ...rgb];
    }
    [x, y, z, alpha] = convertHexToXyz(value);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
    // lab()
  } else if (value.startsWith('lab')) {
    if (REG_SPEC.test(format)) {
      return parseLab(value, opt);
    }
    [, x, y, z, alpha] = parseLab(value) as ComputedColorChannels;
    if (!d50) {
      [x, y, z] = transformMatrix(MATRIX_D50_TO_D65, [x, y, z], true);
    }
    // lch()
  } else if (value.startsWith('lch')) {
    if (REG_SPEC.test(format)) {
      return parseLch(value, opt);
    }
    [, x, y, z, alpha] = parseLch(value) as ComputedColorChannels;
    if (!d50) {
      [x, y, z] = transformMatrix(MATRIX_D50_TO_D65, [x, y, z], true);
    }
    // oklab()
  } else if (value.startsWith('oklab')) {
    if (REG_SPEC.test(format)) {
      return parseOklab(value, opt);
    }
    [, x, y, z, alpha] = parseOklab(value) as ComputedColorChannels;
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
    // oklch()
  } else if (value.startsWith('oklch')) {
    if (REG_SPEC.test(format)) {
      return parseOklch(value, opt);
    }
    [, x, y, z, alpha] = parseOklch(value) as ComputedColorChannels;
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
  } else {
    let r, g, b;
    // hsl()
    if (value.startsWith('hsl')) {
      [, r, g, b, alpha] = parseHsl(value) as ComputedColorChannels;
      // hwb()
    } else if (value.startsWith('hwb')) {
      [, r, g, b, alpha] = parseHwb(value) as ComputedColorChannels;
      // rgb()
    } else {
      [, r, g, b, alpha] = parseRgb(value, opt) as ComputedColorChannels;
    }
    if (REG_SPEC.test(format)) {
      return ['rgb', Math.round(r), Math.round(g), Math.round(b), alpha];
    }
    [x, y, z] = transformRgbToXyz([r, g, b]);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
  }
  return [
    d50 ? 'xyz-d50' : 'xyz-d65',
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    alpha
  ];
};

/**
 * resolve color value
 * @param value - CSS color value
 * @param opt - options
 * @returns resolved color
 *   - [cs, v1, v2, v3, alpha], value, '(empty)', null
 */
export const resolveColorValue = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
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
    return cachedResult.item as SpecifiedColorChannels | string | null;
  }
  if (!REG_COLOR.test(value)) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      setCache(cacheKey, null);
      return null;
    }
    setCache(cacheKey, res);
    if (isString(res)) {
      return res as string;
    }
    return res as SpecifiedColorChannels;
  }
  let cs = '';
  let r = 0;
  let g = 0;
  let b = 0;
  let alpha = 0;
  // complement currentcolor as a missing color
  if (REG_CURRENT.test(value)) {
    if (format === VAL_SPEC) {
      setCache(cacheKey, value);
      return value;
    }
    // named-color
  } else if (/^[a-z]+$/.test(value)) {
    if (Object.hasOwn(NAMED_COLORS, value)) {
      if (format === VAL_SPEC) {
        setCache(cacheKey, value);
        return value;
      }
      [r, g, b] = NAMED_COLORS[
        value as keyof typeof NAMED_COLORS
      ] as TriColorChannels;
      alpha = 1;
    } else {
      switch (format) {
        case VAL_SPEC: {
          if (value === 'transparent') {
            setCache(cacheKey, value);
            return value;
          }
          const res = '';
          setCache(cacheKey, res);
          return res;
        }
        case VAL_MIX: {
          if (value === 'transparent') {
            const res: SpecifiedColorChannels = ['rgb', 0, 0, 0, 0];
            setCache(cacheKey, res);
            return res;
          }
          setCache(cacheKey, null);
          return null;
        }
        case VAL_COMP:
        default: {
          if (nullable && value !== 'transparent') {
            setCache(cacheKey, null);
            return null;
          }
          const res: SpecifiedColorChannels = ['rgb', 0, 0, 0, 0];
          setCache(cacheKey, res);
          return res;
        }
      }
    }
    // hex-color
  } else if (value[0] === '#') {
    [r, g, b, alpha] = convertHexToRgb(value);
    // hsl()
  } else if (value.startsWith('hsl')) {
    [, r, g, b, alpha] = parseHsl(value, opt) as ComputedColorChannels;
    // hwb()
  } else if (value.startsWith('hwb')) {
    [, r, g, b, alpha] = parseHwb(value, opt) as ComputedColorChannels;
    // lab(), lch()
  } else if (/^l(?:ab|ch)/.test(value)) {
    let x, y, z;
    if (value.startsWith('lab')) {
      [cs, x, y, z, alpha] = parseLab(value, opt) as ComputedColorChannels;
    } else {
      [cs, x, y, z, alpha] = parseLch(value, opt) as ComputedColorChannels;
    }
    if (REG_SPEC.test(format)) {
      const res: SpecifiedColorChannels = [cs, x, y, z, alpha];
      setCache(cacheKey, res);
      return res;
    }
    [r, g, b] = transformXyzD50ToRgb([x, y, z]);
    // oklab(), oklch()
  } else if (/^okl(?:ab|ch)/.test(value)) {
    let x, y, z;
    if (value.startsWith('oklab')) {
      [cs, x, y, z, alpha] = parseOklab(value, opt) as ComputedColorChannels;
    } else {
      [cs, x, y, z, alpha] = parseOklch(value, opt) as ComputedColorChannels;
    }
    if (REG_SPEC.test(format)) {
      const res: SpecifiedColorChannels = [cs, x, y, z, alpha];
      setCache(cacheKey, res);
      return res;
    }
    [r, g, b] = transformXyzToRgb([x, y, z]);
    // rgb()
  } else {
    [, r, g, b, alpha] = parseRgb(value, opt) as ComputedColorChannels;
  }
  if (format === VAL_MIX && colorSpace === 'srgb') {
    const res: SpecifiedColorChannels = [
      'srgb',
      r / MAX_RGB,
      g / MAX_RGB,
      b / MAX_RGB,
      alpha
    ];
    setCache(cacheKey, res);
    return res;
  }
  const res: SpecifiedColorChannels = [
    'rgb',
    Math.round(r),
    Math.round(g),
    Math.round(b),
    alpha
  ];
  setCache(cacheKey, res);
  return res;
};

/**
 * resolve color()
 * @param value - color function value
 * @param opt - options
 * @returns resolved color - [cs, v1, v2, v3, alpha], '(empty)', null
 */
export const resolveColorFunc = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
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
    return cachedResult.item as SpecifiedColorChannels | string | null;
  }
  if (!REG_FN_COLOR.test(value)) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      setCache(cacheKey, null);
      return null;
    }
    setCache(cacheKey, res);
    if (isString(res)) {
      return res as string;
    }
    return res as SpecifiedColorChannels;
  }
  const [cs, v1, v2, v3, v4] = parseColorFunc(
    value,
    opt
  ) as SpecifiedColorChannels;
  if (REG_SPEC.test(format) || (format === VAL_MIX && cs === colorSpace)) {
    const res: SpecifiedColorChannels = [cs, v1, v2, v3, v4];
    setCache(cacheKey, res);
    return res;
  }
  const x = parseFloat(`${v1}`);
  const y = parseFloat(`${v2}`);
  const z = parseFloat(`${v3}`);
  const alpha = parseAlpha(`${v4}`);
  const [r, g, b] = transformXyzToRgb([x, y, z], true);
  const res: SpecifiedColorChannels = ['rgb', r, g, b, alpha];
  setCache(cacheKey, res);
  return res;
};

/**
 * convert color value to linear rgb
 * @param value - CSS color value
 * @param opt - options
 * @returns ColorChannels | null - [r, g, b, alpha] r|g|b|alpha: 0..1
 */
export const convertColorToLinearRgb = (
  value: string,
  opt: {
    colorSpace?: string;
    format?: string;
  } = {}
): ColorChannels | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { colorSpace = '', format = '' } = opt;
  let cs = '';
  let r, g, b, alpha, x, y, z;
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return null;
    }
    [cs, x, y, z, alpha] = xyz as ComputedColorChannels;
    if (cs === colorSpace) {
      return [x, y, z, alpha];
    }
    [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
  } else if (value.startsWith(FN_COLOR)) {
    const [, val] = value.match(REG_FN_COLOR) as MatchedRegExp;
    const [cs] = val.match(/[^\s,/]+/g) as StringColorSpacedChannels;
    if (cs === 'srgb-linear') {
      [, r, g, b, alpha] = resolveColorFunc(value, {
        format: VAL_COMP
      }) as ComputedColorChannels;
    } else {
      [, x, y, z, alpha] = parseColorFunc(value) as ComputedColorChannels;
      [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
    }
  } else {
    [, x, y, z, alpha] = parseColorValue(value) as ComputedColorChannels;
    [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
  }
  return [
    Math.min(Math.max(r, 0), 1),
    Math.min(Math.max(g, 0), 1),
    Math.min(Math.max(b, 0), 1),
    alpha
  ];
};

/**
 * convert color value to rgb
 * @param value - CSS color value
 * @param opt - options
 * @returns ColorChannels | null - [r, g, b, alpha] r|g|b: 0..255 alpha: 0..1
 */
export const convertColorToRgb = (
  value: string,
  opt: Options = {}
): ColorChannels | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '' } = opt;
  let r, g, b, alpha;
  if (format === VAL_MIX) {
    let rgb;
    if (value.startsWith(FN_COLOR)) {
      rgb = resolveColorFunc(value, opt);
    } else {
      rgb = resolveColorValue(value, opt);
    }
    if (rgb === null) {
      return null;
    }
    [, r, g, b, alpha] = rgb as ComputedColorChannels;
  } else if (value.startsWith(FN_COLOR)) {
    const [, val] = value.match(REG_FN_COLOR) as MatchedRegExp;
    const [cs] = val.match(/[^\s,/]+/g) as StringColorSpacedChannels;
    if (cs === 'srgb') {
      [, r, g, b, alpha] = resolveColorFunc(value, {
        format: VAL_COMP
      }) as ComputedColorChannels;
      r *= MAX_RGB;
      g *= MAX_RGB;
      b *= MAX_RGB;
    } else {
      [, r, g, b, alpha] = resolveColorFunc(value) as ComputedColorChannels;
    }
  } else if (/^(?:ok)?l(?:ab|ch)/.test(value)) {
    [r, g, b, alpha] = convertColorToLinearRgb(value) as ColorChannels;
    [r, g, b] = transformLinearRgbToRgb([r, g, b]);
  } else {
    [, r, g, b, alpha] = resolveColorValue(value, {
      format: VAL_COMP
    }) as ComputedColorChannels;
  }
  return [r, g, b, alpha];
};

/**
 * convert color value to xyz
 * @param value - CSS color value
 * @param opt - options
 * @returns ColorChannels | null - [x, y, z, alpha]
 */
export const convertColorToXyz = (
  value: string,
  opt: Options = {}
): ColorChannels | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { d50 = false, format = '' } = opt;
  let x, y, z, alpha;
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return null;
    }
    [, x, y, z, alpha] = xyz as ComputedColorChannels;
  } else if (value.startsWith(FN_COLOR)) {
    const [, val] = value.match(REG_FN_COLOR) as MatchedRegExp;
    const [cs] = val.match(/[^\s,/]+/g) as StringColorSpacedChannels;
    if (d50) {
      if (cs === 'xyz-d50') {
        [, x, y, z, alpha] = resolveColorFunc(value, {
          format: VAL_COMP
        }) as ComputedColorChannels;
      } else {
        [, x, y, z, alpha] = parseColorFunc(
          value,
          opt
        ) as ComputedColorChannels;
      }
    } else if (/^xyz(?:-d65)?$/.test(cs)) {
      [, x, y, z, alpha] = resolveColorFunc(value, {
        format: VAL_COMP
      }) as ComputedColorChannels;
    } else {
      [, x, y, z, alpha] = parseColorFunc(value) as ComputedColorChannels;
    }
  } else {
    [, x, y, z, alpha] = parseColorValue(value, opt) as ComputedColorChannels;
  }
  return [x, y, z, alpha];
};

/**
 * convert color value to hsl
 * @param value - CSS color value
 * @param opt - options
 * @returns ColorChannels | null - [h, s, l, alpha], hue may be powerless
 */
export const convertColorToHsl = (
  value: string,
  opt: Options = {}
): ColorChannels | [number | string, number, number, number] | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '' } = opt;
  let h, s, l, alpha;
  if (REG_HSL.test(value)) {
    [, h, s, l, alpha] = parseHsl(value, {
      format: 'hsl'
    }) as ComputedColorChannels;
    if (format === 'hsl') {
      return [Math.round(h), Math.round(s), Math.round(l), alpha];
    }
    return [h, s, l, alpha];
  }
  let x, y, z;
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return null;
    }
    [, x, y, z, alpha] = xyz as ComputedColorChannels;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value) as ComputedColorChannels;
  } else {
    [, x, y, z, alpha] = parseColorValue(value) as ComputedColorChannels;
  }
  [h, s, l] = transformXyzToHsl([x, y, z], true) as TriColorChannels;
  if (format === 'hsl') {
    return [Math.round(h), Math.round(s), Math.round(l), alpha];
  }
  return [format === VAL_MIX && s === 0 ? NONE : h, s, l, alpha];
};

/**
 * convert color value to hwb
 * @param value - CSS color value
 * @param opt - options
 * @returns ColorChannels | null - [h, w, b, alpha], hue may be powerless
 */
export const convertColorToHwb = (
  value: string,
  opt: Options = {}
): ColorChannels | [number | string, number, number, number] | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '' } = opt;
  let h, w, b, alpha;
  if (REG_HWB.test(value)) {
    [, h, w, b, alpha] = parseHwb(value, {
      format: 'hwb'
    }) as ComputedColorChannels;
    if (format === 'hwb') {
      return [Math.round(h), Math.round(w), Math.round(b), alpha];
    }
    return [h, w, b, alpha];
  }
  let x, y, z;
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return null;
    }
    [, x, y, z, alpha] = xyz as ComputedColorChannels;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value) as ComputedColorChannels;
  } else {
    [, x, y, z, alpha] = parseColorValue(value) as ComputedColorChannels;
  }
  [h, w, b] = transformXyzToHwb([x, y, z], true) as TriColorChannels;
  if (format === 'hwb') {
    return [Math.round(h), Math.round(w), Math.round(b), alpha];
  }
  return [format === VAL_MIX && w + b >= 100 ? NONE : h, w, b, alpha];
};

/**
 * convert color value to lab
 * @param value - CSS color value
 * @param opt - options
 * @returns ColorChannels | null - [l, a, b, alpha]
 */
export const convertColorToLab = (
  value: string,
  opt: Options = {}
): ColorChannels | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '' } = opt;
  let l, a, b, alpha;
  if (REG_LAB.test(value)) {
    [, l, a, b, alpha] = parseLab(value, {
      format: VAL_COMP
    }) as ComputedColorChannels;
    return [l, a, b, alpha];
  }
  let x, y, z;
  if (format === VAL_MIX) {
    let xyz;
    opt.d50 = true;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return null;
    }
    [, x, y, z, alpha] = xyz as ComputedColorChannels;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value, {
      d50: true
    }) as ComputedColorChannels;
  } else {
    [, x, y, z, alpha] = parseColorValue(value, {
      d50: true
    }) as ComputedColorChannels;
  }
  [l, a, b] = transformXyzD50ToLab([x, y, z], true);
  return [l, a, b, alpha];
};

/**
 * convert color value to lch
 * @param value - CSS color value
 * @param opt - options
 * @returns ColorChannels | null - [l, c, h, alpha], hue may be powerless
 */
export const convertColorToLch = (
  value: string,
  opt: Options = {}
): ColorChannels | [number, number, number | string, number] | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '' } = opt;
  let l, c, h, alpha;
  if (REG_LCH.test(value)) {
    [, l, c, h, alpha] = parseLch(value, {
      format: VAL_COMP
    }) as ComputedColorChannels;
    return [l, c, h, alpha];
  }
  let x, y, z;
  if (format === VAL_MIX) {
    let xyz;
    opt.d50 = true;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return null;
    }
    [, x, y, z, alpha] = xyz as ComputedColorChannels;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value, {
      d50: true
    }) as ComputedColorChannels;
  } else {
    [, x, y, z, alpha] = parseColorValue(value, {
      d50: true
    }) as ComputedColorChannels;
  }
  [l, c, h] = transformXyzD50ToLch([x, y, z], true);
  return [l, c, format === VAL_MIX && c === 0 ? NONE : h, alpha];
};

/**
 * convert color value to oklab
 * @param value - CSS color value
 * @param opt - options
 * @returns ColorChannels | null - [l, a, b, alpha]
 */
export const convertColorToOklab = (
  value: string,
  opt: Options = {}
): ColorChannels | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '' } = opt;
  let l, a, b, alpha;
  if (REG_OKLAB.test(value)) {
    [, l, a, b, alpha] = parseOklab(value, {
      format: VAL_COMP
    }) as ComputedColorChannels;
    return [l, a, b, alpha];
  }
  let x, y, z;
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return null;
    }
    [, x, y, z, alpha] = xyz as ComputedColorChannels;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value) as ComputedColorChannels;
  } else {
    [, x, y, z, alpha] = parseColorValue(value) as ComputedColorChannels;
  }
  [l, a, b] = transformXyzToOklab([x, y, z], true);
  return [l, a, b, alpha];
};

/**
 * convert color value to oklch
 * @param value - CSS color value
 * @param opt - options
 * @returns ColorChannels | null - [l, c, h, alpha], hue may be powerless
 */
export const convertColorToOklch = (
  value: string,
  opt: Options = {}
): ColorChannels | [number, number, number | string, number] | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '' } = opt;
  let l, c, h, alpha;
  if (REG_OKLCH.test(value)) {
    [, l, c, h, alpha] = parseOklch(value, {
      format: VAL_COMP
    }) as ComputedColorChannels;
    return [l, c, h, alpha];
  }
  let x, y, z;
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return null;
    }
    [, x, y, z, alpha] = xyz as ComputedColorChannels;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value) as ComputedColorChannels;
  } else {
    [, x, y, z, alpha] = parseColorValue(value) as ComputedColorChannels;
  }
  [l, c, h] = transformXyzToOklch([x, y, z], true) as TriColorChannels;
  return [l, c, format === VAL_MIX && c === 0 ? NONE : h, alpha];
};
