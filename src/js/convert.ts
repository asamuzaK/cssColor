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
import { NullObject, valueToJsonString } from './util';
import type { ColorChannels, ComputedColorChannels, Options } from './typedef';

/* constants */
import { SYN_FN_CALC, SYN_FN_REL, SYN_FN_VAR, VAL_COMP } from './constant';

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
 * @param value - color value
 * @param [opt] - options
 * @returns value
 */
export const preProcess = (
  value: string,
  opt: Options = {}
): string | NullObject => {
  if (isString(value)) {
    value = value.trim();
    if (!value) {
      return new NullObject();
    }
  } else {
    return new NullObject();
  }
  const { customProperty = {}, dimension = {} } = opt;
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{preProcess:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as string | NullObject;
    }
  }
  if (REG_FN_VAR.test(value)) {
    const resolvedValue = cssVar(value, opt);
    if (resolvedValue instanceof NullObject) {
      if (cacheKey) {
        cachedResults.set(cacheKey, resolvedValue);
      }
      return resolvedValue;
    }
    value = resolvedValue;
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
 * @param value - color value
 * @returns hex string: 00..ff
 */
export const numberToHex = (value: number): string => {
  const cacheKey = `{numberToHex:${value}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey) as string;
  }
  const hex = numberToHexString(value);
  cachedResults.set(cacheKey, hex);
  return hex;
};

/**
 * convert color to hex
 * @param value - color value
 * @param [opt] - options
 * @param [opt.alpha] - enable alpha channel
 * @returns #rrggbb | #rrggbbaa | null
 */
export const colorToHex = (value: string, opt: Options = {}): string | null => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue instanceof NullObject) {
      return null;
    }
    value = resolvedValue.toLowerCase();
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
      const res = cachedResults.get(cacheKey);
      if (isString(res)) {
        return res;
      }
      return null;
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
  if (isString(hex)) {
    if (cacheKey) {
      cachedResults.set(cacheKey, hex);
    }
    return hex;
  }
  const nullObj = new NullObject();
  if (cacheKey) {
    cachedResults.set(cacheKey, nullObj);
  }
  return null;
};

/**
 * convert color to hsl
 * @param value - color value
 * @param [opt] - options
 * @returns ColorChannels - [h, s, l, alpha]
 */
export const colorToHsl = (value: string, opt: Options = {}): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue instanceof NullObject) {
      return [0, 0, 0, 0];
    }
    value = resolvedValue.toLowerCase();
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
 * @param value - color value
 * @param [opt] - options
 * @returns ColorChannels - [h, w, b, alpha]
 */
export const colorToHwb = (value: string, opt: Options = {}): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue instanceof NullObject) {
      return [0, 0, 0, 0];
    }
    value = resolvedValue.toLowerCase();
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
 * @param value - color value
 * @param [opt] - options
 * @returns ColorChannels - [l, a, b, alpha]
 */
export const colorToLab = (value: string, opt: Options = {}): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue instanceof NullObject) {
      return [0, 0, 0, 0];
    }
    value = resolvedValue.toLowerCase();
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
  const lab = convertColorToLab(value, opt) as ColorChannels;
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};

/**
 * convert color to lch
 * @param value - color value
 * @param [opt] - options
 * @returns ColorChannels - [l, c, h, alpha]
 */
export const colorToLch = (value: string, opt: Options = {}): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue instanceof NullObject) {
      return [0, 0, 0, 0];
    }
    value = resolvedValue.toLowerCase();
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
 * @param value - color value
 * @param [opt] - options
 * @returns ColorChannels - [l, a, b, alpha]
 */
export const colorToOklab = (
  value: string,
  opt: Options = {}
): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue instanceof NullObject) {
      return [0, 0, 0, 0];
    }
    value = resolvedValue.toLowerCase();
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
  const lab = convertColorToOklab(value, opt) as ColorChannels;
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};

/**
 * convert color to oklch
 * @param value - color value
 * @param [opt] - options
 * @returns ColorChannels - [l, c, h, alpha]
 */
export const colorToOklch = (
  value: string,
  opt: Options = {}
): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue instanceof NullObject) {
      return [0, 0, 0, 0];
    }
    value = resolvedValue.toLowerCase();
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
 * @param value - color value
 * @param [opt] - options
 * @returns ColorChannels - [r, g, b, alpha]
 */
export const colorToRgb = (value: string, opt: Options = {}): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue instanceof NullObject) {
      return [0, 0, 0, 0];
    }
    value = resolvedValue.toLowerCase();
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
  const rgb = convertColorToRgb(value, opt) as ColorChannels;
  if (cacheKey) {
    cachedResults.set(cacheKey, rgb);
  }
  return rgb;
};

/**
 * convert color to xyz
 * @param value - color value
 * @param [opt] - options
 * @returns ColorChannels - [x, y, z, alpha]
 */
export const colorToXyz = (value: string, opt: Options = {}): ColorChannels => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue instanceof NullObject) {
      return [0, 0, 0, 0];
    }
    value = resolvedValue.toLowerCase();
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
    [, ...xyz] = parseColorFunc(value, opt) as ComputedColorChannels;
  } else {
    [, ...xyz] = parseColorValue(value, opt) as ComputedColorChannels;
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, xyz);
  }
  return xyz as ColorChannels;
};

/**
 * convert color to xyz-d50
 * @param value - color value
 * @param [opt] - options
 * @returns ColorChannels - [x, y, z, alpha]
 */
export const colorToXyzD50 = (
  value: string,
  opt: Options = {}
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
