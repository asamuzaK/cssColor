/**
 * color
 *
 * Ref: CSS Color Module Level 4
 *      Sample code for Color Conversions
 *      https://w3c.github.io/csswg-drafts/css-color-4/#color-conversion-code
 */

import { createCacheKey, getCache, setCache } from './cache';
import { isString } from './common';
import {
  D50,
  MATRIX_A98_TO_XYZ,
  MATRIX_D50_TO_D65,
  MATRIX_D65_TO_D50,
  MATRIX_LMS_TO_XYZ,
  MATRIX_L_RGB_TO_XYZ,
  MATRIX_OKLAB_TO_LMS,
  MATRIX_P3_TO_XYZ,
  MATRIX_PROPHOTO_TO_XYZ_D50,
  MATRIX_REC2020_TO_XYZ,
  MATRIX_XYZ_TO_L_RGB,
  transformMatrix,
  validateColorComponents
} from './matrix';
import {
  transformLinearRgbToRgb,
  transformRgbToLinearRgb,
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
import { roundToPrecision } from './util';
import {
  ColorChannels,
  ComputedColorChannels,
  Options,
  MatchedRegExp,
  SpecifiedColorChannels,
  StringColorChannels,
  StringColorSpacedChannels,
  TriColorChannels
} from './typedef';

/* constants */
import {
  ANGLE,
  FN_COLOR,
  NONE,
  NUM,
  SYN_COLOR_TYPE,
  SYN_FN_COLOR,
  SYN_HSL,
  SYN_HSL_LV3,
  SYN_LCH,
  SYN_MOD,
  SYN_RGB_LV3,
  VAL_COMP,
  VAL_MIX,
  VAL_SPEC
} from './constant';
const NAMESPACE = 'color';

/* numeric constants */
const PPTH = 0.001;
const DUO = 2;
const TRIA = 3;
const QUAD = 4;
const OCT = 8;
const DEC = 10;
const DOZ = 12;
const HEX = 16;
const DEG_HALF = 180;
const DEG = 360;
const MAX_PCT = 100;
const MAX_RGB = 255;
const POW_SQR = 2;
const POW_CUBE = 3;
const LAB_L = 116;
const LAB_A = 500;
const LAB_B = 200;
const LAB_EPSILON = 216 / 24389;
const LAB_KAPPA = 24389 / 27;

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
const REG_ANGLE_TO_DEG = new RegExp(`^(${NUM})(${ANGLE})?$`);
const REG_PARSE_RGB = new RegExp(
  `^rgba?\\(\\s*(${SYN_MOD}|${SYN_RGB_LV3})\\s*\\)$`
);

/**
 * named colors
 */
export const NAMED_COLORS = {
  aliceblue: [0xf0, 0xf8, 0xff],
  antiquewhite: [0xfa, 0xeb, 0xd7],
  aqua: [0x00, 0xff, 0xff],
  aquamarine: [0x7f, 0xff, 0xd4],
  azure: [0xf0, 0xff, 0xff],
  beige: [0xf5, 0xf5, 0xdc],
  bisque: [0xff, 0xe4, 0xc4],
  black: [0x00, 0x00, 0x00],
  blanchedalmond: [0xff, 0xeb, 0xcd],
  blue: [0x00, 0x00, 0xff],
  blueviolet: [0x8a, 0x2b, 0xe2],
  brown: [0xa5, 0x2a, 0x2a],
  burlywood: [0xde, 0xb8, 0x87],
  cadetblue: [0x5f, 0x9e, 0xa0],
  chartreuse: [0x7f, 0xff, 0x00],
  chocolate: [0xd2, 0x69, 0x1e],
  coral: [0xff, 0x7f, 0x50],
  cornflowerblue: [0x64, 0x95, 0xed],
  cornsilk: [0xff, 0xf8, 0xdc],
  crimson: [0xdc, 0x14, 0x3c],
  cyan: [0x00, 0xff, 0xff],
  darkblue: [0x00, 0x00, 0x8b],
  darkcyan: [0x00, 0x8b, 0x8b],
  darkgoldenrod: [0xb8, 0x86, 0x0b],
  darkgray: [0xa9, 0xa9, 0xa9],
  darkgreen: [0x00, 0x64, 0x00],
  darkgrey: [0xa9, 0xa9, 0xa9],
  darkkhaki: [0xbd, 0xb7, 0x6b],
  darkmagenta: [0x8b, 0x00, 0x8b],
  darkolivegreen: [0x55, 0x6b, 0x2f],
  darkorange: [0xff, 0x8c, 0x00],
  darkorchid: [0x99, 0x32, 0xcc],
  darkred: [0x8b, 0x00, 0x00],
  darksalmon: [0xe9, 0x96, 0x7a],
  darkseagreen: [0x8f, 0xbc, 0x8f],
  darkslateblue: [0x48, 0x3d, 0x8b],
  darkslategray: [0x2f, 0x4f, 0x4f],
  darkslategrey: [0x2f, 0x4f, 0x4f],
  darkturquoise: [0x00, 0xce, 0xd1],
  darkviolet: [0x94, 0x00, 0xd3],
  deeppink: [0xff, 0x14, 0x93],
  deepskyblue: [0x00, 0xbf, 0xff],
  dimgray: [0x69, 0x69, 0x69],
  dimgrey: [0x69, 0x69, 0x69],
  dodgerblue: [0x1e, 0x90, 0xff],
  firebrick: [0xb2, 0x22, 0x22],
  floralwhite: [0xff, 0xfa, 0xf0],
  forestgreen: [0x22, 0x8b, 0x22],
  fuchsia: [0xff, 0x00, 0xff],
  gainsboro: [0xdc, 0xdc, 0xdc],
  ghostwhite: [0xf8, 0xf8, 0xff],
  gold: [0xff, 0xd7, 0x00],
  goldenrod: [0xda, 0xa5, 0x20],
  gray: [0x80, 0x80, 0x80],
  green: [0x00, 0x80, 0x00],
  greenyellow: [0xad, 0xff, 0x2f],
  grey: [0x80, 0x80, 0x80],
  honeydew: [0xf0, 0xff, 0xf0],
  hotpink: [0xff, 0x69, 0xb4],
  indianred: [0xcd, 0x5c, 0x5c],
  indigo: [0x4b, 0x00, 0x82],
  ivory: [0xff, 0xff, 0xf0],
  khaki: [0xf0, 0xe6, 0x8c],
  lavender: [0xe6, 0xe6, 0xfa],
  lavenderblush: [0xff, 0xf0, 0xf5],
  lawngreen: [0x7c, 0xfc, 0x00],
  lemonchiffon: [0xff, 0xfa, 0xcd],
  lightblue: [0xad, 0xd8, 0xe6],
  lightcoral: [0xf0, 0x80, 0x80],
  lightcyan: [0xe0, 0xff, 0xff],
  lightgoldenrodyellow: [0xfa, 0xfa, 0xd2],
  lightgray: [0xd3, 0xd3, 0xd3],
  lightgreen: [0x90, 0xee, 0x90],
  lightgrey: [0xd3, 0xd3, 0xd3],
  lightpink: [0xff, 0xb6, 0xc1],
  lightsalmon: [0xff, 0xa0, 0x7a],
  lightseagreen: [0x20, 0xb2, 0xaa],
  lightskyblue: [0x87, 0xce, 0xfa],
  lightslategray: [0x77, 0x88, 0x99],
  lightslategrey: [0x77, 0x88, 0x99],
  lightsteelblue: [0xb0, 0xc4, 0xde],
  lightyellow: [0xff, 0xff, 0xe0],
  lime: [0x00, 0xff, 0x00],
  limegreen: [0x32, 0xcd, 0x32],
  linen: [0xfa, 0xf0, 0xe6],
  magenta: [0xff, 0x00, 0xff],
  maroon: [0x80, 0x00, 0x00],
  mediumaquamarine: [0x66, 0xcd, 0xaa],
  mediumblue: [0x00, 0x00, 0xcd],
  mediumorchid: [0xba, 0x55, 0xd3],
  mediumpurple: [0x93, 0x70, 0xdb],
  mediumseagreen: [0x3c, 0xb3, 0x71],
  mediumslateblue: [0x7b, 0x68, 0xee],
  mediumspringgreen: [0x00, 0xfa, 0x9a],
  mediumturquoise: [0x48, 0xd1, 0xcc],
  mediumvioletred: [0xc7, 0x15, 0x85],
  midnightblue: [0x19, 0x19, 0x70],
  mintcream: [0xf5, 0xff, 0xfa],
  mistyrose: [0xff, 0xe4, 0xe1],
  moccasin: [0xff, 0xe4, 0xb5],
  navajowhite: [0xff, 0xde, 0xad],
  navy: [0x00, 0x00, 0x80],
  oldlace: [0xfd, 0xf5, 0xe6],
  olive: [0x80, 0x80, 0x00],
  olivedrab: [0x6b, 0x8e, 0x23],
  orange: [0xff, 0xa5, 0x00],
  orangered: [0xff, 0x45, 0x00],
  orchid: [0xda, 0x70, 0xd6],
  palegoldenrod: [0xee, 0xe8, 0xaa],
  palegreen: [0x98, 0xfb, 0x98],
  paleturquoise: [0xaf, 0xee, 0xee],
  palevioletred: [0xdb, 0x70, 0x93],
  papayawhip: [0xff, 0xef, 0xd5],
  peachpuff: [0xff, 0xda, 0xb9],
  peru: [0xcd, 0x85, 0x3f],
  pink: [0xff, 0xc0, 0xcb],
  plum: [0xdd, 0xa0, 0xdd],
  powderblue: [0xb0, 0xe0, 0xe6],
  purple: [0x80, 0x00, 0x80],
  rebeccapurple: [0x66, 0x33, 0x99],
  red: [0xff, 0x00, 0x00],
  rosybrown: [0xbc, 0x8f, 0x8f],
  royalblue: [0x41, 0x69, 0xe1],
  saddlebrown: [0x8b, 0x45, 0x13],
  salmon: [0xfa, 0x80, 0x72],
  sandybrown: [0xf4, 0xa4, 0x60],
  seagreen: [0x2e, 0x8b, 0x57],
  seashell: [0xff, 0xf5, 0xee],
  sienna: [0xa0, 0x52, 0x2d],
  silver: [0xc0, 0xc0, 0xc0],
  skyblue: [0x87, 0xce, 0xeb],
  slateblue: [0x6a, 0x5a, 0xcd],
  slategray: [0x70, 0x80, 0x90],
  slategrey: [0x70, 0x80, 0x90],
  snow: [0xff, 0xfa, 0xfa],
  springgreen: [0x00, 0xff, 0x7f],
  steelblue: [0x46, 0x82, 0xb4],
  tan: [0xd2, 0xb4, 0x8c],
  teal: [0x00, 0x80, 0x80],
  thistle: [0xd8, 0xbf, 0xd8],
  tomato: [0xff, 0x63, 0x47],
  turquoise: [0x40, 0xe0, 0xd0],
  violet: [0xee, 0x82, 0xee],
  wheat: [0xf5, 0xde, 0xb3],
  white: [0xff, 0xff, 0xff],
  whitesmoke: [0xf5, 0xf5, 0xf5],
  yellow: [0xff, 0xff, 0x00],
  yellowgreen: [0x9a, 0xcd, 0x32]
} as const satisfies {
  [key: string]: TriColorChannels;
};

/**
 * cache invalid color value
 * @param key - cache key
 * @param nullable - is nullable
 * @returns cached value
 */
export const cacheInvalidColorValue = (
  cacheKey: string,
  format: string,
  nullable: boolean = false
): SpecifiedColorChannels | string | null => {
  if (format === VAL_SPEC) {
    const res = '';
    setCache(cacheKey, res);
    return res;
  }
  if (nullable) {
    setCache(cacheKey, null);
    return null;
  }
  const res: SpecifiedColorChannels = ['rgb', 0, 0, 0, 0];
  setCache(cacheKey, res);
  return res;
};

/**
 * resolve invalid color value
 * @param format - output format
 * @param nullable - is nullable
 * @returns resolved value
 */
export const resolveInvalidColorValue = (
  format: string,
  nullable: boolean = false
): SpecifiedColorChannels | string | null => {
  switch (format) {
    case 'hsl':
    case 'hwb':
    case VAL_MIX: {
      return null;
    }
    case VAL_SPEC: {
      return '';
    }
    default: {
      if (nullable) {
        return null;
      }
      return ['rgb', 0, 0, 0, 0] as SpecifiedColorChannels;
    }
  }
};

/**
 * normalize color components
 * @param colorA - color components [v1, v2, v3, v4]
 * @param colorB - color components [v1, v2, v3, v4]
 * @param [skip] - skip validate
 * @returns result - [colorA, colorB]
 */
export const normalizeColorComponents = (
  colorA: [number | string, number | string, number | string, number | string],
  colorB: [number | string, number | string, number | string, number | string],
  skip: boolean = false
): [ColorChannels, ColorChannels] => {
  if (!Array.isArray(colorA)) {
    throw new TypeError(`${colorA} is not an array.`);
  } else if (colorA.length !== QUAD) {
    throw new Error(`Unexpected array length ${colorA.length}.`);
  }
  if (!Array.isArray(colorB)) {
    throw new TypeError(`${colorB} is not an array.`);
  } else if (colorB.length !== QUAD) {
    throw new Error(`Unexpected array length ${colorB.length}.`);
  }
  let i = 0;
  while (i < QUAD) {
    if (colorA[i] === NONE && colorB[i] === NONE) {
      colorA[i] = 0;
      colorB[i] = 0;
    } else if (colorA[i] === NONE) {
      colorA[i] = colorB[i] as number;
    } else if (colorB[i] === NONE) {
      colorB[i] = colorA[i] as number;
    }
    i++;
  }
  if (skip) {
    return [colorA as ColorChannels, colorB as ColorChannels];
  }
  const validatedColorA = validateColorComponents(colorA as ColorChannels, {
    minLength: QUAD,
    validateRange: false
  });
  const validatedColorB = validateColorComponents(colorB as ColorChannels, {
    minLength: QUAD,
    validateRange: false
  });
  return [validatedColorA as ColorChannels, validatedColorB as ColorChannels];
};

/**
 * number to hex string
 * @param value - numeric value
 * @returns hex string
 */
export const numberToHexString = (value: number): string => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${value} is not a number.`);
  } else {
    value = Math.round(value);
    if (value < 0 || value > MAX_RGB) {
      throw new RangeError(`${value} is not between 0 and ${MAX_RGB}.`);
    }
  }
  let hex = value.toString(HEX);
  if (hex.length === 1) {
    hex = `0${hex}`;
  }
  return hex;
};

/**
 * angle to deg
 * @param angle
 * @returns deg: 0..360
 */
export const angleToDeg = (angle: string): number => {
  if (isString(angle)) {
    angle = angle.trim();
  } else {
    throw new TypeError(`${angle} is not a string.`);
  }
  const GRAD = DEG / 400;
  const RAD = DEG / (Math.PI * DUO);
  if (!REG_ANGLE_TO_DEG.test(angle)) {
    throw new SyntaxError(`Invalid property value: ${angle}`);
  }
  const [, value, unit] = angle.match(REG_ANGLE_TO_DEG) as MatchedRegExp;
  let deg;
  switch (unit) {
    case 'grad':
      deg = parseFloat(value) * GRAD;
      break;
    case 'rad':
      deg = parseFloat(value) * RAD;
      break;
    case 'turn':
      deg = parseFloat(value) * DEG;
      break;
    default:
      deg = parseFloat(value);
  }
  deg %= DEG;
  if (deg < 0) {
    deg += DEG;
  } else if (Object.is(deg, -0)) {
    deg = 0;
  }
  return deg;
};

/**
 * parse alpha
 * @param [alpha] - alpha value
 * @returns alpha: 0..1
 */
export const parseAlpha = (alpha: string = ''): number => {
  if (isString(alpha)) {
    alpha = alpha.trim();
    if (!alpha) {
      alpha = '1';
    } else if (alpha === NONE) {
      alpha = '0';
    } else {
      let a;
      if (alpha.endsWith('%')) {
        a = parseFloat(alpha) / MAX_PCT;
      } else {
        a = parseFloat(alpha);
      }
      if (!Number.isFinite(a)) {
        throw new TypeError(`${a} is not a finite number.`);
      }
      if (a < PPTH) {
        alpha = '0';
      } else if (a > 1) {
        alpha = '1';
      } else {
        alpha = a.toFixed(TRIA);
      }
    }
  } else {
    alpha = '1';
  }
  return parseFloat(alpha);
};

/**
 * parse hex alpha
 * @param value - alpha value in hex string
 * @returns alpha: 0..1
 */
export const parseHexAlpha = (value: string): number => {
  if (isString(value)) {
    if (value === '') {
      throw new SyntaxError('Invalid property value: (empty string)');
    }
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  let alpha = parseInt(value, HEX);
  if (alpha <= 0) {
    return 0;
  }
  if (alpha >= MAX_RGB) {
    return 1;
  }
  const alphaMap = new Map();
  for (let i = 1; i < MAX_PCT; i++) {
    alphaMap.set(Math.round((i * MAX_RGB) / MAX_PCT), i);
  }
  if (alphaMap.has(alpha)) {
    alpha = alphaMap.get(alpha) / MAX_PCT;
  } else {
    alpha = Math.round(alpha / MAX_RGB / PPTH) * PPTH;
  }
  return parseFloat(alpha.toFixed(TRIA));
};

/**
 * convert rgb to hex color
 * @param rgb - [r, g, b, alpha] r|g|b: 0..255 alpha: 0..1
 * @returns hex color
 */
export const convertRgbToHex = (rgb: ColorChannels): string => {
  const [r, g, b, alpha] = validateColorComponents(rgb, {
    alpha: true,
    maxRange: MAX_RGB
  }) as ColorChannels;
  const rr = numberToHexString(r);
  const gg = numberToHexString(g);
  const bb = numberToHexString(b);
  const aa = numberToHexString(alpha * MAX_RGB);
  let hex;
  if (aa === 'ff') {
    hex = `#${rr}${gg}${bb}`;
  } else {
    hex = `#${rr}${gg}${bb}${aa}`;
  }
  return hex;
};

// TODO: export later
/**
 * convert linear rgb to hex color
 * @param rgb - [r, g, b, alpha] r|g|b|alpha: 0..1
 * @param [skip] - skip validate
 * @returns hex color
 */
const convertLinearRgbToHex = (
  rgb: ColorChannels,
  skip: boolean = false
): string => {
  let r, g, b, alpha;
  if (skip) {
    [r, g, b, alpha] = rgb;
  } else {
    [r, g, b, alpha] = validateColorComponents(rgb, {
      minLength: QUAD
    }) as ColorChannels;
  }
  [r, g, b] = transformLinearRgbToRgb([r, g, b], true);
  const rr = numberToHexString(r);
  const gg = numberToHexString(g);
  const bb = numberToHexString(b);
  const aa = numberToHexString(alpha * MAX_RGB);
  let hex;
  if (aa === 'ff') {
    hex = `#${rr}${gg}${bb}`;
  } else {
    hex = `#${rr}${gg}${bb}${aa}`;
  }
  return hex;
};

/**
 * convert xyz to hex color
 * @param xyz - [x, y, z, alpha]
 * @returns hex color
 */
export const convertXyzToHex = (xyz: ColorChannels): string => {
  const [x, y, z, alpha] = validateColorComponents(xyz, {
    minLength: QUAD,
    validateRange: false
  }) as ColorChannels;
  const [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
  const hex = convertLinearRgbToHex(
    [
      Math.min(Math.max(r, 0), 1),
      Math.min(Math.max(g, 0), 1),
      Math.min(Math.max(b, 0), 1),
      alpha
    ],
    true
  );
  return hex;
};

/**
 * convert xyz D50 to hex color
 * @param xyz - [x, y, z, alpha]
 * @returns hex color
 */
export const convertXyzD50ToHex = (xyz: ColorChannels): string => {
  const [x, y, z, alpha] = validateColorComponents(xyz, {
    minLength: QUAD,
    validateRange: false
  }) as ColorChannels;
  const xyzD65 = transformMatrix(MATRIX_D50_TO_D65, [x, y, z], true);
  const [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, xyzD65, true);
  const hex = convertLinearRgbToHex([
    Math.min(Math.max(r, 0), 1),
    Math.min(Math.max(g, 0), 1),
    Math.min(Math.max(b, 0), 1),
    alpha
  ]);
  return hex;
};

/**
 * convert hex color to rgb
 * @param value - hex color value
 * @returns ColorChannels - [r, g, b, alpha] r|g|b: 0..255 alpha: 0..1
 */
export const convertHexToRgb = (value: string): ColorChannels => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  if (!(
    /^#[\da-f]{6}$/.test(value) ||
    /^#[\da-f]{3}$/.test(value) ||
    /^#[\da-f]{8}$/.test(value) ||
    /^#[\da-f]{4}$/.test(value)
  )) {
    throw new SyntaxError(`Invalid property value: ${value}`);
  }
  const arr: number[] = [];
  if (/^#[\da-f]{3}$/.test(value)) {
    const [, r, g, b] = value.match(
      /^#([\da-f])([\da-f])([\da-f])$/
    ) as MatchedRegExp;
    arr.push(
      parseInt(`${r}${r}`, HEX),
      parseInt(`${g}${g}`, HEX),
      parseInt(`${b}${b}`, HEX),
      1
    );
  } else if (/^#[\da-f]{4}$/.test(value)) {
    const [, r, g, b, alpha] = value.match(
      /^#([\da-f])([\da-f])([\da-f])([\da-f])$/
    ) as MatchedRegExp;
    arr.push(
      parseInt(`${r}${r}`, HEX),
      parseInt(`${g}${g}`, HEX),
      parseInt(`${b}${b}`, HEX),
      parseHexAlpha(`${alpha}${alpha}`)
    );
  } else if (/^#[\da-f]{8}$/.test(value)) {
    const [, r, g, b, alpha] = value.match(
      /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})$/
    ) as MatchedRegExp;
    arr.push(
      parseInt(r, HEX),
      parseInt(g, HEX),
      parseInt(b, HEX),
      parseHexAlpha(alpha)
    );
  } else {
    const [, r, g, b] = value.match(
      /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/
    ) as MatchedRegExp;
    arr.push(parseInt(r, HEX), parseInt(g, HEX), parseInt(b, HEX), 1);
  }
  return arr as ColorChannels;
};

/**
 * convert hex color to linear rgb
 * @param value - hex color value
 * @returns ColorChannels - [r, g, b, alpha] r|g|b|alpha: 0..1
 */
export const convertHexToLinearRgb = (value: string): ColorChannels => {
  const [rr, gg, bb, alpha] = convertHexToRgb(value);
  const [r, g, b] = transformRgbToLinearRgb([rr, gg, bb], true);
  return [r, g, b, alpha];
};

/**
 * convert hex color to xyz
 * @param value - hex color value
 * @returns ColorChannels - [x, y, z, alpha]
 */
export const convertHexToXyz = (value: string): ColorChannels => {
  const [r, g, b, alpha] = convertHexToLinearRgb(value);
  const [x, y, z] = transformMatrix(MATRIX_L_RGB_TO_XYZ, [r, g, b], true);
  return [x, y, z, alpha];
};

/**
 * parse rgb()
 * @param value - rgb color value
 * @param opt - options
 * @returns parsed color - ['rgb', r, g, b, alpha], '(empty)', null
 */
export const parseRgb = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '', nullable = false } = opt;
  if (!REG_PARSE_RGB.test(value)) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      return null;
    } else if (isString(res)) {
      return res as string;
    }
    return res as SpecifiedColorChannels;
  }
  const [, val] = value.match(REG_PARSE_RGB) as MatchedRegExp;
  const [v1, v2, v3, v4 = ''] = val.match(/[^\s,/]+/g) as StringColorChannels;
  let r, g, b;
  if (v1 === NONE) {
    r = 0;
  } else {
    if (v1.endsWith('%')) {
      r = (parseFloat(v1) * MAX_RGB) / MAX_PCT;
    } else {
      r = parseFloat(v1);
    }
    r = Math.min(Math.max(roundToPrecision(r, OCT), 0), MAX_RGB);
  }
  if (v2 === NONE) {
    g = 0;
  } else {
    if (v2.endsWith('%')) {
      g = (parseFloat(v2) * MAX_RGB) / MAX_PCT;
    } else {
      g = parseFloat(v2);
    }
    g = Math.min(Math.max(roundToPrecision(g, OCT), 0), MAX_RGB);
  }
  if (v3 === NONE) {
    b = 0;
  } else {
    if (v3.endsWith('%')) {
      b = (parseFloat(v3) * MAX_RGB) / MAX_PCT;
    } else {
      b = parseFloat(v3);
    }
    b = Math.min(Math.max(roundToPrecision(b, OCT), 0), MAX_RGB);
  }
  const alpha = parseAlpha(v4);
  return ['rgb', r, g, b, format === VAL_MIX && v4 === NONE ? NONE : alpha];
};

/**
 * parse hsl()
 * @param value - hsl color value
 * @param opt - options
 * @returns parsed color - ['rgb', r, g, b, alpha], '(empty)', null
 */
export const parseHsl = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '', nullable = false } = opt;
  if (!REG_HSL.test(value)) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      return null;
    } else if (isString(res)) {
      return res as string;
    }
    return res as SpecifiedColorChannels;
  }
  const [, val] = value.match(REG_HSL) as MatchedRegExp;
  const [v1, v2, v3, v4 = ''] = val.match(/[^\s,/]+/g) as StringColorChannels;
  let h, s, l;
  if (v1 === NONE) {
    h = 0;
  } else {
    h = angleToDeg(v1);
  }
  if (v2 === NONE) {
    s = 0;
  } else {
    s = Math.min(Math.max(parseFloat(v2), 0), MAX_PCT);
  }
  if (v3 === NONE) {
    l = 0;
  } else {
    l = Math.min(Math.max(parseFloat(v3), 0), MAX_PCT);
  }
  const alpha = parseAlpha(v4);
  if (format === 'hsl') {
    return [
      format,
      v1 === NONE ? v1 : h,
      v2 === NONE ? v2 : s,
      v3 === NONE ? v3 : l,
      v4 === NONE ? v4 : alpha
    ];
  }
  h = (h / DEG) * DOZ;
  l /= MAX_PCT;
  const sa = (s / MAX_PCT) * Math.min(l, 1 - l);
  const rk = h % DOZ;
  const gk = (8 + h) % DOZ;
  const bk = (4 + h) % DOZ;
  const r = l - sa * Math.max(-1, Math.min(rk - TRIA, TRIA ** POW_SQR - rk, 1));
  const g = l - sa * Math.max(-1, Math.min(gk - TRIA, TRIA ** POW_SQR - gk, 1));
  const b = l - sa * Math.max(-1, Math.min(bk - TRIA, TRIA ** POW_SQR - bk, 1));
  return [
    'rgb',
    Math.min(Math.max(roundToPrecision(r * MAX_RGB, OCT), 0), MAX_RGB),
    Math.min(Math.max(roundToPrecision(g * MAX_RGB, OCT), 0), MAX_RGB),
    Math.min(Math.max(roundToPrecision(b * MAX_RGB, OCT), 0), MAX_RGB),
    alpha
  ];
};

/**
 * parse hwb()
 * @param value - hwb color value
 * @param opt - options
 * @returns parsed color - ['rgb', r, g, b, alpha], '(empty)', null
 */
export const parseHwb = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '', nullable = false } = opt;
  if (!REG_HWB.test(value)) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      return null;
    } else if (isString(res)) {
      return res as string;
    }
    return res as SpecifiedColorChannels;
  }
  const [, val] = value.match(REG_HWB) as MatchedRegExp;
  const [v1, v2, v3, v4 = ''] = val.match(/[^\s,/]+/g) as StringColorChannels;
  let h, wh, bk;
  if (v1 === NONE) {
    h = 0;
  } else {
    h = angleToDeg(v1);
  }
  if (v2 === NONE) {
    wh = 0;
  } else {
    wh = Math.min(Math.max(parseFloat(v2), 0), MAX_PCT) / MAX_PCT;
  }
  if (v3 === NONE) {
    bk = 0;
  } else {
    bk = Math.min(Math.max(parseFloat(v3), 0), MAX_PCT) / MAX_PCT;
  }
  const alpha = parseAlpha(v4);
  if (format === 'hwb') {
    return [
      format,
      v1 === NONE ? v1 : h,
      v2 === NONE ? v2 : wh * MAX_PCT,
      v3 === NONE ? v3 : bk * MAX_PCT,
      v4 === NONE ? v4 : alpha
    ];
  }
  if (wh + bk >= 1) {
    const v = roundToPrecision((wh / (wh + bk)) * MAX_RGB, OCT);
    return ['rgb', v, v, v, alpha];
  }
  const factor = (1 - wh - bk) / MAX_RGB;
  let [, r, g, b] = parseHsl(`hsl(${h} 100 50)`) as ComputedColorChannels;
  r = roundToPrecision((r * factor + wh) * MAX_RGB, OCT);
  g = roundToPrecision((g * factor + wh) * MAX_RGB, OCT);
  b = roundToPrecision((b * factor + wh) * MAX_RGB, OCT);
  return [
    'rgb',
    Math.min(Math.max(r, 0), MAX_RGB),
    Math.min(Math.max(g, 0), MAX_RGB),
    Math.min(Math.max(b, 0), MAX_RGB),
    alpha
  ];
};

/**
 * parse lab()
 * @param value - lab color value
 * @param opt - options
 * @returns parsed color
 *   - [xyz-d50, x, y, z, alpha], ['lab', l, a, b, alpha], '(empty)', null
 */
export const parseLab = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '', nullable = false } = opt;
  if (!REG_LAB.test(value)) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      return null;
    } else if (isString(res)) {
      return res as string;
    }
    return res as SpecifiedColorChannels;
  }
  const COEF_PCT = 1.25;
  const COND_POW = 8;
  const [, val] = value.match(REG_LAB) as MatchedRegExp;
  const [v1, v2, v3, v4 = ''] = val.match(/[^\s,/]+/g) as StringColorChannels;
  let l, a, b;
  if (v1 === NONE) {
    l = 0;
  } else {
    if (v1.endsWith('%')) {
      l = parseFloat(v1);
      if (l > MAX_PCT) {
        l = MAX_PCT;
      }
    } else {
      l = parseFloat(v1);
    }
    if (l < 0) {
      l = 0;
    }
  }
  if (v2 === NONE) {
    a = 0;
  } else {
    a = v2.endsWith('%') ? parseFloat(v2) * COEF_PCT : parseFloat(v2);
  }
  if (v3 === NONE) {
    b = 0;
  } else {
    b = v3.endsWith('%') ? parseFloat(v3) * COEF_PCT : parseFloat(v3);
  }
  const alpha = parseAlpha(v4);
  if (REG_SPEC.test(format)) {
    return [
      'lab',
      v1 === NONE ? v1 : roundToPrecision(l, HEX),
      v2 === NONE ? v2 : roundToPrecision(a, HEX),
      v3 === NONE ? v3 : roundToPrecision(b, HEX),
      v4 === NONE ? v4 : alpha
    ];
  }
  const fl = (l + HEX) / LAB_L;
  const fa = a / LAB_A + fl;
  const fb = fl - b / LAB_B;
  const powFl = Math.pow(fl, POW_CUBE);
  const powFa = Math.pow(fa, POW_CUBE);
  const powFb = Math.pow(fb, POW_CUBE);
  const xyz = [
    powFa > LAB_EPSILON ? powFa : (fa * LAB_L - HEX) / LAB_KAPPA,
    l > COND_POW ? powFl : l / LAB_KAPPA,
    powFb > LAB_EPSILON ? powFb : (fb * LAB_L - HEX) / LAB_KAPPA
  ];
  const [x, y, z] = xyz.map(
    (val, i) => val * (D50[i] as number)
  ) as TriColorChannels;
  return [
    'xyz-d50',
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    alpha
  ];
};

/**
 * parse lch()
 * @param value - lch color value
 * @param opt - options
 * @returns parsed color
 *   - ['xyz-d50', x, y, z, alpha], ['lch', l, c, h, alpha], '(empty)', null
 */
export const parseLch = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '', nullable = false } = opt;
  if (!REG_LCH.test(value)) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      return null;
    } else if (isString(res)) {
      return res as string;
    }
    return res as SpecifiedColorChannels;
  }
  const COEF_PCT = 1.5;
  const [, val] = value.match(REG_LCH) as MatchedRegExp;
  const [v1, v2, v3, v4 = ''] = val.match(/[^\s,/]+/g) as StringColorChannels;
  let l, c, h;
  if (v1 === NONE) {
    l = 0;
  } else {
    l = parseFloat(v1);
    if (l < 0) {
      l = 0;
    }
  }
  if (v2 === NONE) {
    c = 0;
  } else {
    c = v2.endsWith('%') ? parseFloat(v2) * COEF_PCT : parseFloat(v2);
  }
  if (v3 === NONE) {
    h = 0;
  } else {
    h = angleToDeg(v3);
  }
  const alpha = parseAlpha(v4);
  if (REG_SPEC.test(format)) {
    return [
      'lch',
      v1 === NONE ? v1 : roundToPrecision(l, HEX),
      v2 === NONE ? v2 : roundToPrecision(c, HEX),
      v3 === NONE ? v3 : roundToPrecision(h, HEX),
      v4 === NONE ? v4 : alpha
    ];
  }
  const a = c * Math.cos((h * Math.PI) / DEG_HALF);
  const b = c * Math.sin((h * Math.PI) / DEG_HALF);
  const [, x, y, z] = parseLab(`lab(${l} ${a} ${b})`) as ComputedColorChannels;
  return [
    'xyz-d50',
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    alpha as number
  ];
};

/**
 * parse oklab()
 * @param value - oklab color value
 * @param opt - options
 * @returns parsed color
 *   - ['xyz-d65', x, y, z, alpha], ['oklab', l, a, b, alpha], '(empty)', null
 */
export const parseOklab = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '', nullable = false } = opt;
  if (!REG_OKLAB.test(value)) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      return null;
    } else if (isString(res)) {
      return res as string;
    }
    return res as SpecifiedColorChannels;
  }
  const COEF_PCT = 0.4;
  const [, val] = value.match(REG_OKLAB) as MatchedRegExp;
  const [v1, v2, v3, v4 = ''] = val.match(/[^\s,/]+/g) as StringColorChannels;
  let l, a, b;
  if (v1 === NONE) {
    l = 0;
  } else {
    l = v1.endsWith('%') ? parseFloat(v1) / MAX_PCT : parseFloat(v1);
    if (l < 0) {
      l = 0;
    }
  }
  if (v2 === NONE) {
    a = 0;
  } else if (v2.endsWith('%')) {
    a = (parseFloat(v2) * COEF_PCT) / MAX_PCT;
  } else {
    a = parseFloat(v2);
  }
  if (v3 === NONE) {
    b = 0;
  } else if (v3.endsWith('%')) {
    b = (parseFloat(v3) * COEF_PCT) / MAX_PCT;
  } else {
    b = parseFloat(v3);
  }
  const alpha = parseAlpha(v4);
  if (REG_SPEC.test(format)) {
    return [
      'oklab',
      v1 === NONE ? v1 : roundToPrecision(l, HEX),
      v2 === NONE ? v2 : roundToPrecision(a, HEX),
      v3 === NONE ? v3 : roundToPrecision(b, HEX),
      v4 === NONE ? v4 : alpha
    ];
  }
  const lms = transformMatrix(MATRIX_OKLAB_TO_LMS, [l, a, b]);
  const xyzLms = lms.map(c => Math.pow(c, POW_CUBE)) as TriColorChannels;
  const [x, y, z] = transformMatrix(MATRIX_LMS_TO_XYZ, xyzLms, true);
  return [
    'xyz-d65',
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    alpha as number
  ];
};

/**
 * parse oklch()
 * @param value - oklch color value
 * @param opt - options
 * @returns parsed color
 *   - ['xyz-d65', x, y, z, alpha], ['oklch', l, c, h, alpha], '(empty)', null
 */
export const parseOklch = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format = '', nullable = false } = opt;
  if (!REG_OKLCH.test(value)) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      return null;
    } else if (isString(res)) {
      return res as string;
    }
    return res as SpecifiedColorChannels;
  }
  const COEF_PCT = 0.4;
  const [, val] = value.match(REG_OKLCH) as MatchedRegExp;
  const [v1, v2, v3, v4 = ''] = val.match(/[^\s,/]+/g) as StringColorChannels;
  let l, c, h;
  if (v1 === NONE) {
    l = 0;
  } else {
    l = v1.endsWith('%') ? parseFloat(v1) / MAX_PCT : parseFloat(v1);
    if (l < 0) {
      l = 0;
    }
  }
  if (v2 === NONE) {
    c = 0;
  } else {
    if (v2.endsWith('%')) {
      c = (parseFloat(v2) * COEF_PCT) / MAX_PCT;
    } else {
      c = parseFloat(v2);
    }
    if (c < 0) {
      c = 0;
    }
  }
  if (v3 === NONE) {
    h = 0;
  } else {
    h = angleToDeg(v3);
  }
  const alpha = parseAlpha(v4);
  if (REG_SPEC.test(format)) {
    return [
      'oklch',
      v1 === NONE ? v1 : roundToPrecision(l, HEX),
      v2 === NONE ? v2 : roundToPrecision(c, HEX),
      v3 === NONE ? v3 : roundToPrecision(h, HEX),
      v4 === NONE ? v4 : alpha
    ];
  }
  const a = c * Math.cos((h * Math.PI) / DEG_HALF);
  const b = c * Math.sin((h * Math.PI) / DEG_HALF);
  const lms = transformMatrix(MATRIX_OKLAB_TO_LMS, [l, a, b]);
  const xyzLms = lms.map(cc => Math.pow(cc, POW_CUBE)) as TriColorChannels;
  const [x, y, z] = transformMatrix(MATRIX_LMS_TO_XYZ, xyzLms, true);
  return [
    'xyz-d65',
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    alpha
  ];
};

/**
 * parse color()
 * @param value - color function value
 * @param opt - options
 * @returns parsed color
 *   - ['xyz-(d50|d65)', x, y, z, alpha], [cs, r, g, b, alpha], '(empty)', null
 */
export const parseColorFunc = (
  value: string,
  opt: Options = {}
): SpecifiedColorChannels | string | null => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { colorSpace = '', d50 = false, format = '', nullable = false } = opt;
  if (!REG_FN_COLOR.test(value)) {
    const res = resolveInvalidColorValue(format, nullable);
    if (res === null) {
      return null;
    } else if (isString(res)) {
      return res as string;
    }
    return res as SpecifiedColorChannels;
  }
  const [, val] = value.match(REG_FN_COLOR) as MatchedRegExp;
  let [cs, v1, v2, v3, v4 = ''] = val.match(
    /[^\s,/]+/g
  ) as StringColorSpacedChannels;
  let r, g, b;
  if (cs === 'xyz') {
    cs = 'xyz-d65';
  }
  if (v1 === NONE) {
    r = 0;
  } else {
    r = v1.endsWith('%') ? parseFloat(v1) / MAX_PCT : parseFloat(v1);
  }
  if (v2 === NONE) {
    g = 0;
  } else {
    g = v2.endsWith('%') ? parseFloat(v2) / MAX_PCT : parseFloat(v2);
  }
  if (v3 === NONE) {
    b = 0;
  } else {
    b = v3.endsWith('%') ? parseFloat(v3) / MAX_PCT : parseFloat(v3);
  }
  const alpha = parseAlpha(v4);
  if (REG_SPEC.test(format) || (format === VAL_MIX && cs === colorSpace)) {
    return [
      cs,
      v1 === NONE ? v1 : roundToPrecision(r, DEC),
      v2 === NONE ? v2 : roundToPrecision(g, DEC),
      v3 === NONE ? v3 : roundToPrecision(b, DEC),
      v4 === NONE ? v4 : alpha
    ];
  }
  let x = 0;
  let y = 0;
  let z = 0;
  // srgb-linear
  if (cs === 'srgb-linear') {
    [x, y, z] = transformMatrix(MATRIX_L_RGB_TO_XYZ, [r, g, b]);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
    // display-p3
  } else if (cs === 'display-p3') {
    const linearRgb = transformRgbToLinearRgb([
      r * MAX_RGB,
      g * MAX_RGB,
      b * MAX_RGB
    ]);
    [x, y, z] = transformMatrix(MATRIX_P3_TO_XYZ, linearRgb);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
    // rec2020
  } else if (cs === 'rec2020') {
    const ALPHA = 1.09929682680944;
    const BETA = 0.018053968510807;
    const REC_COEF = 0.45;
    const rgb = [r, g, b].map(c => {
      let cl;
      if (c < BETA * REC_COEF * DEC) {
        cl = c / (REC_COEF * DEC);
      } else {
        cl = Math.pow((c + ALPHA - 1) / ALPHA, 1 / REC_COEF);
      }
      return cl;
    }) as TriColorChannels;
    [x, y, z] = transformMatrix(MATRIX_REC2020_TO_XYZ, rgb);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
    // a98-rgb
  } else if (cs === 'a98-rgb') {
    const POW_A98 = 563 / 256;
    const rgb = [r, g, b].map(c => {
      const cl = Math.pow(c, POW_A98);
      return cl;
    }) as TriColorChannels;
    [x, y, z] = transformMatrix(MATRIX_A98_TO_XYZ, rgb);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
    // prophoto-rgb
  } else if (cs === 'prophoto-rgb') {
    const POW_PROPHOTO = 1.8;
    const rgb = [r, g, b].map(c => {
      let cl;
      if (c > 1 / (HEX * DUO)) {
        cl = Math.pow(c, POW_PROPHOTO);
      } else {
        cl = c / HEX;
      }
      return cl;
    }) as TriColorChannels;
    [x, y, z] = transformMatrix(MATRIX_PROPHOTO_TO_XYZ_D50, rgb);
    if (!d50) {
      [x, y, z] = transformMatrix(MATRIX_D50_TO_D65, [x, y, z], true);
    }
    // xyz, xyz-d50, xyz-d65
  } else if (/^xyz(?:-d(?:50|65))?$/.test(cs)) {
    [x, y, z] = [r, g, b];
    if (cs === 'xyz-d50') {
      if (!d50) {
        [x, y, z] = transformMatrix(MATRIX_D50_TO_D65, [x, y, z]);
      }
    } else if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
    // srgb
  } else {
    [x, y, z] = transformRgbToXyz([r * MAX_RGB, g * MAX_RGB, b * MAX_RGB]);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
  }
  return [
    d50 ? 'xyz-d50' : 'xyz-d65',
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    format === VAL_MIX && v4 === NONE ? v4 : alpha
  ];
};

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
