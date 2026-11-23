/**
 * CSS color serialization utilities.
 */

import { ColorData, SyntaxFlag } from '@csstools/css-color-parser';
import { convertHexToRgb } from '../converters/convert-hex';
import {
  ComputedColorChannels,
  Options,
  SpecifiedColorChannels
} from '../typedef';
import { isString } from '../utils/common';
import { parseColorGeneric, roundToPrecision } from '../utils/util';

/* constants */
import {
  DEC,
  DEG,
  DOZ,
  HEX,
  MAX_PCT,
  MAX_RGB,
  NONE,
  OCT,
  POW_SQR,
  TRIA,
  VAL_MIX,
  VAL_SPEC
} from '../utils/constant';
import { NAMED_COLORS } from './named-color';
const { HasNoneKeywords: HAS_NONE } = SyntaxFlag;

/* Regular expressions */
const REG_CURRENT = /^currentcolor$/i;
const REG_NAMED_COLOR = /^[a-z]+$/i;

/**
 * Serializes an alpha value.
 * @param value - The alpha value to serialize.
 * @returns - The serialized alpha value.
 */
export const serializeAlpha = (value: number): number => {
  if (typeof value !== 'number') {
    return Number.NaN;
  }
  if (Number.isNaN(value)) {
    return value;
  }
  const alpha = Math.min(1, Math.max(0, value));
  return roundToPrecision(alpha, HEX);
};

/**
 * Serializes HSL color data.
 * @param value - The HSL color data to serialize.
 * @param opt - The parsing options.
 * @returns The serialized color array.
 */
export const serializeHsl = (
  value: ColorData,
  opt: Options = {}
): SpecifiedColorChannels => {
  const { colorNotation, channels, alpha, syntaxFlags } = value;
  const [c1, c2, c3] = channels;
  const { format } = opt;
  const preserveNone = syntaxFlags.has(HAS_NONE) || format === VAL_MIX;
  if (preserveNone) {
    return [
      colorNotation,
      Number.isNaN(c1) ? NONE : roundToPrecision(c1, HEX),
      Number.isNaN(c2) ? NONE : roundToPrecision(c2, HEX),
      Number.isNaN(c3) ? NONE : roundToPrecision(c3, HEX),
      Number.isNaN(alpha) ? NONE : serializeAlpha(alpha as number)
    ];
  }
  const alphaValue = serializeAlpha(alpha as number);
  const h = (c1 / DEG) * DOZ;
  const s = Math.min(Math.max(c2, 0), MAX_PCT);
  const l = Math.min(Math.max(c3, 0), MAX_PCT) / MAX_PCT;
  const sa = (s / MAX_PCT) * Math.min(l, 1 - l);
  const rk = h % DOZ;
  const gk = (8 + h) % DOZ;
  const bk = (4 + h) % DOZ;
  const r = l - sa * Math.max(Math.min(rk - TRIA, TRIA ** POW_SQR - rk, 1), -1);
  const g = l - sa * Math.max(Math.min(gk - TRIA, TRIA ** POW_SQR - gk, 1), -1);
  const b = l - sa * Math.max(Math.min(bk - TRIA, TRIA ** POW_SQR - bk, 1), -1);
  return [
    'rgb',
    Math.min(Math.max(roundToPrecision(r * MAX_RGB, OCT), 0), MAX_RGB),
    Math.min(Math.max(roundToPrecision(g * MAX_RGB, OCT), 0), MAX_RGB),
    Math.min(Math.max(roundToPrecision(b * MAX_RGB, OCT), 0), MAX_RGB),
    alphaValue
  ];
};

/**
 * Serializes an HWB color data.
 * @param value - The HWB color data to serialize.
 * @param opt - The parsing options.
 * @returns The serialized color array.
 */
export const serializeHwb = (
  value: ColorData,
  opt: Options = {}
): SpecifiedColorChannels => {
  const { colorNotation, channels, alpha, syntaxFlags } = value;
  const [c1, c2, c3] = channels;
  const { format } = opt;
  const preserveNone = syntaxFlags.has(HAS_NONE) || format === VAL_MIX;
  if (preserveNone) {
    return [
      colorNotation,
      Number.isNaN(c1) ? NONE : roundToPrecision(c1, HEX),
      Number.isNaN(c2) ? NONE : roundToPrecision(c2, HEX),
      Number.isNaN(c3) ? NONE : roundToPrecision(c3, HEX),
      Number.isNaN(alpha) ? NONE : serializeAlpha(alpha as number)
    ];
  }
  const alphaValue = serializeAlpha(alpha as number);
  const h = c1;
  const wh = Math.min(Math.max(c2, 0), MAX_PCT) / MAX_PCT;
  const bk = Math.min(Math.max(c3, 0), MAX_PCT) / MAX_PCT;
  if (wh + bk >= 1) {
    const v = roundToPrecision((wh / (wh + bk)) * MAX_RGB, OCT);
    return ['rgb', v, v, v, serializeAlpha(alpha as number)];
  }
  const factor = (1 - wh - bk) / MAX_RGB;
  let [, r, g, b] = serializeHsl({
    colorNotation: 'hsl',
    channels: [h, 100, 50],
    alpha: 1,
    syntaxFlags: new Set()
  } as ColorData) as ComputedColorChannels;
  r = roundToPrecision((r * factor + wh) * MAX_RGB, OCT);
  g = roundToPrecision((g * factor + wh) * MAX_RGB, OCT);
  b = roundToPrecision((b * factor + wh) * MAX_RGB, OCT);
  return [
    'rgb',
    Math.min(Math.max(r, 0), MAX_RGB),
    Math.min(Math.max(g, 0), MAX_RGB),
    Math.min(Math.max(b, 0), MAX_RGB),
    alphaValue
  ];
};

/**
 * Serializes a CSS color value into its color channel representation.
 * @param value - The CSS color value string to parse.
 * @param opt - The resolution options.
 * @returns The parsed color channels array, string, or null.
 */
export const serializeColorValue = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (!isString(value)) {
    throw new TypeError(`${value} is not a string.`);
  }
  value = value.trim();
  const { colorSpace, currentColor, format } = opt;
  if (REG_CURRENT.test(value)) {
    if (format === VAL_SPEC) {
      return value.toLowerCase();
    }
    // Missing currentcolor.
    if (!isString(currentColor) || !currentColor.trim()) {
      return ['srgb', NONE, NONE, NONE, NONE];
    }
    value = currentColor.trim();
  }
  if (REG_NAMED_COLOR.test(value)) {
    const lowerValue = value.toLowerCase();
    if (
      lowerValue === 'transparent' ||
      Object.hasOwn(NAMED_COLORS, lowerValue)
    ) {
      if (format === VAL_SPEC) {
        return lowerValue;
      }
      value = lowerValue;
    } else {
      return null;
    }
  }
  if (/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) {
    const [r, g, b, a] = convertHexToRgb(value);
    if (colorSpace === 'srgb') {
      return [
        'srgb',
        roundToPrecision(r / MAX_RGB, DEC),
        roundToPrecision(g / MAX_RGB, DEC),
        roundToPrecision(b / MAX_RGB, DEC),
        roundToPrecision(a, DEC)
      ];
    }
    return ['rgb', r, g, b, a];
  }
  const parsed = parseColorGeneric(value);
  if (!parsed) {
    return null;
  }
  const { colorNotation, channels, alpha, syntaxFlags } = parsed;
  const [c1, c2, c3] = channels;
  const preserveNone = syntaxFlags.has(HAS_NONE) || format === VAL_MIX;
  const alphaValue = serializeAlpha(alpha as number);
  const alphaValueIsNaN = Number.isNaN(alphaValue);
  switch (colorNotation) {
    case 'hsl': {
      return serializeHsl(parsed, opt);
    }
    case 'hwb': {
      return serializeHwb(parsed, opt);
    }
    case 'rgb': {
      if (preserveNone || colorSpace === 'srgb') {
        return [
          'srgb',
          Number.isNaN(c1) ? NONE : roundToPrecision(c1, DEC),
          Number.isNaN(c2) ? NONE : roundToPrecision(c2, DEC),
          Number.isNaN(c3) ? NONE : roundToPrecision(c3, DEC),
          alphaValueIsNaN ? NONE : alphaValue
        ];
      }
      return [
        colorNotation,
        roundToPrecision(c1 * MAX_RGB, OCT),
        roundToPrecision(c2 * MAX_RGB, OCT),
        roundToPrecision(c3 * MAX_RGB, OCT),
        roundToPrecision(alphaValue as number, OCT)
      ];
    }
    case 'srgb':
    case 'display-p3':
    case 'a98-rgb': {
      return [
        colorNotation,
        preserveNone && Number.isNaN(c1) ? NONE : roundToPrecision(c1, DEC),
        preserveNone && Number.isNaN(c2) ? NONE : roundToPrecision(c2, DEC),
        preserveNone && Number.isNaN(c3) ? NONE : roundToPrecision(c3, DEC),
        preserveNone && alphaValueIsNaN ? NONE : alphaValue
      ];
    }
    case 'srgb-linear':
    case 'display-p3-linear':
    case 'prophoto-rgb':
    case 'rec2020': {
      return [
        colorNotation,
        preserveNone && Number.isNaN(c1) ? NONE : roundToPrecision(c1, DOZ),
        preserveNone && Number.isNaN(c2) ? NONE : roundToPrecision(c2, DOZ),
        preserveNone && Number.isNaN(c3) ? NONE : roundToPrecision(c3, DOZ),
        preserveNone && alphaValueIsNaN ? NONE : alphaValue
      ];
    }
    default: {
      return [
        colorNotation,
        preserveNone && Number.isNaN(c1) ? NONE : roundToPrecision(c1, HEX),
        preserveNone && Number.isNaN(c2) ? NONE : roundToPrecision(c2, HEX),
        preserveNone && Number.isNaN(c3) ? NONE : roundToPrecision(c3, HEX),
        preserveNone && alphaValueIsNaN ? NONE : alphaValue
      ];
    }
  }
};
