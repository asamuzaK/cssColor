/**
 * convert
 */

import { LRUCache } from 'lru-cache';
import {
  convertColorToHsl,
  convertColorToHwb,
  convertColorToLab,
  convertColorToLch,
  convertColorToOklab,
  convertColorToOklch,
  convertColorToRgb,
  numberToHexString,
  parseColorFunc,
  parseColorValue
} from './color';
import { isString } from './common';
import { cssCalc } from './css-calc';
import { cssVar } from './css-var';
import { resolveRelativeColor } from './relative-color';
import { resolve } from './resolve';
import { valueToJsonString } from './util';
import type { ColorChannels, IOptions } from './util';

/* constants */
import { SYN_FN_CALC, SYN_FN_REL, SYN_FN_VAR, VAL_COMP } from './constant.js';

/* regexp */
const REG_FN_CALC = new RegExp(SYN_FN_CALC);
const REG_FN_REL = new RegExp(SYN_FN_REL);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * pre process
 * @param {string} value - color value
 * @param {IOptions} [opt] - options
 * @returns {?string} - value
 */
export const preProcess = (
  value: string,
  opt: IOptions = {}
): string | null => {
  if (isString(value)) {
    value = value.trim();
    if (!value) {
      return null;
    }
  } else {
    return null;
  }
  const { customProperty = {}, dimension = {} } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{preProcess:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as string | null;
    }
  }
  if (REG_FN_VAR.test(value)) {
    const resolvedValue = cssVar(value, opt);
    if (resolvedValue) {
      value = resolvedValue;
    } else {
      if (cacheKey) {
        cachedResults.set(cacheKey, null!);
      }
      return null;
    }
  }
  if (REG_FN_REL.test(value)) {
    value = resolveRelativeColor(value, opt) as string;
  } else if (REG_FN_CALC.test(value)) {
    value = cssCalc(value, opt);
  }
  if (value.startsWith('color-mix')) {
    value = resolve(value, {
      format: VAL_COMP
    }) as string;
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, value);
  }
  return value;
};

/**
 * convert number to hex string
 * @param {number} value - color value
 * @returns {string} - hex string: 00..ff
 */
export const numberToHex = (value: number): string => {
  const cacheKey = typeof value === 'number' && `{numberToHex:${value}}`;
  if (cacheKey && cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey) as string;
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
 * @param {IOptions} [opt] - options
 * @param {boolean} [opt.alpha] - enable alpha channel
 * @returns {?string} - #rrggbb | #rrggbbaa | null
 */
export const colorToHex = (
  value: string,
  opt: IOptions = {}
): string | null => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return null!;
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { alpha = false, customProperty = {}, dimension = {} } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{colorToHex:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as string | null;
    }
  }
  let hex;
  if (alpha) {
    opt.format = 'hexAlpha';
    hex = resolve(value, opt);
  } else {
    opt.format = 'hex';
    hex = resolve(value, opt);
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, hex!);
  }
  return hex as string | null;
};

/**
 * convert color to hsl
 * @param {string} value - color value
 * @param {IOptions} [opt] - options
 * @returns {Array.<number>} - [h, s, l, alpha]
 */
export const colorToHsl = (
  value: string,
  opt: IOptions = {}
): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty = {}, dimension = {} } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{colorToHsl:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as ColorChannels;
    }
  }
  opt.format = 'hsl';
  const hsl = convertColorToHsl(value, opt) as ColorChannels;
  if (cacheKey) {
    cachedResults.set(cacheKey, hsl);
  }
  return hsl;
};

/**
 * convert color to hwb
 * @param {string} value - color value
 * @param {IOptions} [opt] - options
 * @returns {Array.<number>} - [h, w, b, alpha]
 */
export const colorToHwb = (
  value: string,
  opt: IOptions = {}
): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty = {}, dimension = {} } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{colorToHwb:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as ColorChannels;
    }
  }
  opt.format = 'hwb';
  const hwb = convertColorToHwb(value, opt) as ColorChannels;
  if (cacheKey) {
    cachedResults.set(cacheKey, hwb);
  }
  return hwb;
};

/**
 * convert color to lab
 * @param {string} value - color value
 * @param {IOptions} [opt] - options
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export const colorToLab = (
  value: string,
  opt: IOptions = {}
): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty = {}, dimension = {} } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{colorToLab:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as ColorChannels;
    }
  }
  const lab = convertColorToLab(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};

/**
 * convert color to lch
 * @param {string} value - color value
 * @param {IOptions} [opt] - options
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export const colorToLch = (
  value: string,
  opt: IOptions = {}
): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty = {}, dimension = {} } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{colorToLch:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as ColorChannels;
    }
  }
  const lch = convertColorToLch(value, opt) as ColorChannels;
  if (cacheKey) {
    cachedResults.set(cacheKey, lch);
  }
  return lch;
};

/**
 * convert color to oklab
 * @param {string} value - color value
 * @param {IOptions} [opt] - options
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export const colorToOklab = (
  value: string,
  opt: IOptions = {}
): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty = {}, dimension = {} } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{colorToOklab:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as ColorChannels;
    }
  }
  const lab = convertColorToOklab(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};

/**
 * convert color to oklch
 * @param {string} value - color value
 * @param {IOptions} [opt] - options
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export const colorToOklch = (
  value: string,
  opt: IOptions = {}
): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty = {}, dimension = {} } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{colorToOklch:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as ColorChannels;
    }
  }
  const lch = convertColorToOklch(value, opt) as ColorChannels;
  if (cacheKey) {
    cachedResults.set(cacheKey, lch);
  }
  return lch;
};

/**
 * convert color to rgb
 * @param {string} value - color value
 * @param {IOptions} [opt] - options
 * @returns {Array.<number>} - [r, g, b, alpha]
 */
export const colorToRgb = (
  value: string,
  opt: IOptions = {}
): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty = {}, dimension = {} } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{colorToRgb:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as ColorChannels;
    }
  }
  const rgb = convertColorToRgb(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, rgb);
  }
  return rgb;
};

/**
 * convert color to xyz
 * @param {string} value - color value
 * @param {IOptions} [opt] - options
 * @param {object} [opt.d50] - white poin in d50
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export const colorToXyz = (
  value: string,
  opt: IOptions = {}
): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty = {}, dimension = {} } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{colorToXyz:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as ColorChannels;
    }
  }
  let xyz;
  if (value.startsWith('color(')) {
    [, ...xyz] = parseColorFunc(value, opt) as [
      string,
      number,
      number,
      number,
      number
    ];
  } else {
    [, ...xyz] = parseColorValue(value, opt) as [
      string,
      number,
      number,
      number,
      number
    ];
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, xyz);
  }
  return xyz as ColorChannels;
};

/**
 * convert color to xyz-d50
 * @param {string} value - color value
 * @param {IOptions} [opt] - options
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export const colorToXyzD50 = (
  value: string,
  opt: IOptions = {}
): ColorChannels => {
  opt.d50 = true;
  return colorToXyz(value, opt);
};

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
