/**
 * color.js
 *
 * Ref: CSS Color Module Level 4
 *      §17. Sample code for Color Conversions
 *      https://w3c.github.io/csswg-drafts/css-color-4/#color-conversion-code
 */

import { getType, isString } from './common.js';

/* constants */
const PPTH = 0.001;
const HALF = 0.5;
const DUO = 2;
const TRIA = 3;
const QUAT = 4;
const DEC = 10;
const DOZ = 12;
const HEX = 16;
const SEXA = 60;
const DEG = 360;
const MAX_PCT = 100;
const MAX_RGB = 255;
const POW_SQR = 2;
const POW_CUBE = 3;
const POW_LINEAR = 2.4;
const LINEAR_COEF = 12.92;
const LINEAR_OFFSET = 0.055;
const LAB_L = 116;
const LAB_A = 500;
const LAB_B = 200;
const LAB_EPSILON = 216 / 24389;
const LAB_KAPPA = 24389 / 27;

/* white point */
const D50 = [0.3457 / 0.3585, 1.00000, (1.0 - 0.3457 - 0.3585) / 0.3585];
const MATRIX_D50_TO_D65 = [
  [0.955473421488075, -0.02309845494876471, 0.06325924320057072],
  [-0.0283697093338637, 1.0099953980813041, 0.021041441191917323],
  [0.012314014864481998, -0.020507649298898964, 1.330365926242124]
];
const MATRIX_D65_TO_D50 = [
  [1.0479297925449969, 0.022946870601609652, -0.05019226628920524],
  [0.02962780877005599, 0.9904344267538799, -0.017073799063418826],
  [-0.009243040646204504, 0.015055191490298152, 0.7518742814281371]
];

/* color space */
const MATRIX_L_RGB_TO_XYZ = [
  [506752 / 1228815, 87881 / 245763, 12673 / 70218],
  [87098 / 409605, 175762 / 245763, 12673 / 175545],
  [7918 / 409605, 87881 / 737289, 1001167 / 1053270]
];
const MATRIX_XYZ_TO_L_RGB = [
  [12831 / 3959, -329 / 214, -1974 / 3959],
  [-851781 / 878810, 1648619 / 878810, 36519 / 878810],
  [705 / 12673, -2585 / 12673, 705 / 667]
];
const MATRIX_XYZ_TO_LMS = [
  [0.8190224379967030, 0.3619062600528904, -0.1288737815209879],
  [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
  [0.0481771893596242, 0.2642395317527308, 0.6335478284694309]
];
const MATRIX_LMS_TO_XYZ = [
  [1.2268798758459243, -0.5578149944602171, 0.2813910456659647],
  [-0.0405757452148008, 1.1122868032803170, -0.0717110580655164],
  [-0.0763729366746601, -0.4214933324022432, 1.5869240198367816]
];
const MATRIX_OKLAB_TO_LMS = [
  [1.0000000000000000, 0.3963377773761749, 0.2158037573099136],
  [1.0000000000000000, -0.1055613458156586, -0.0638541728258133],
  [1.0000000000000000, -0.0894841775298119, -1.2914855480194092]
];
const MATRIX_LMS_TO_OKLAB = [
  [0.2104542683093140, 0.7936177747023054, -0.0040720430116193],
  [1.9779985324311684, -2.4285922420485799, 0.4505937096174110],
  [0.0259040424655478, 0.7827717124575296, -0.8086757549230774]
];
const MATRIX_P3_TO_XYZ = [
  [608311 / 1250200, 189793 / 714400, 198249 / 1000160],
  [35783 / 156275, 247089 / 357200, 198249 / 2500400],
  [0 / 1, 32229 / 714400, 5220557 / 5000800]
];
const MATRIX_REC2020_TO_XYZ = [
  [63426534 / 99577255, 20160776 / 139408157, 47086771 / 278816314],
  [26158966 / 99577255, 472592308 / 697040785, 8267143 / 139408157],
  [0 / 1, 19567812 / 697040785, 295819943 / 278816314]
];
const MATRIX_A98_TO_XYZ = [
  [573536 / 994567, 263643 / 1420810, 187206 / 994567],
  [591459 / 1989134, 6239551 / 9945670, 374412 / 4972835],
  [53769 / 1989134, 351524 / 4972835, 4929758 / 4972835]
];
const MATRIX_PROPHOTO_TO_XYZ_D50 = [
  [0.79776664490064230, 0.13518129740053308, 0.03134773412839220],
  [0.28807482881940130, 0.71183523424187300, 0.00008993693872564],
  [0.00000000000000000, 0.00000000000000000, 0.82510460251046020]
];

/* syntax */
const NONE = 'none';
const SYN_ANGLE = 'deg|g?rad|turn';
const SYN_SRGB = 'srgb(?:-linear)?';
const SYN_COLOR_SPACE_XYZ = 'xyz(?:-d(?:50|65))?';
const SYN_COLOR_SPACE_COLOR_MIX =
  `(?:ok)?l(?:ab|ch)|h(?:sl|wb)|${SYN_SRGB}|${SYN_COLOR_SPACE_XYZ}`;
const SYN_COLOR_SPACE_RGB =
  `(?:a98|prophoto)-rgb|display-p3|rec2020|${SYN_SRGB}`;
const SYN_NUM =
  '[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?';
const SYN_PCT = `${SYN_NUM}%`;
const SYN_HSL = `(?:${SYN_NUM}(?:${SYN_ANGLE})?|${NONE})(?:\\s+(?:${SYN_PCT}|${SYN_NUM}|${NONE})){2}(?:\\s*\\/\\s*(?:${SYN_NUM}|${SYN_PCT}|${NONE}))?`;
const SYN_HSL_LV3 = `${SYN_NUM}(?:${SYN_ANGLE})?(?:\\s*,\\s*${SYN_PCT}){2}(?:\\s*,\\s*(?:${SYN_NUM}|${SYN_PCT}))?`;
const SYN_RGB = `(?:${SYN_NUM}|${SYN_PCT}|${NONE})(?:\\s+(?:${SYN_NUM}|${SYN_PCT}|${NONE})){2}(?:\\s*\\/\\s*(?:${SYN_NUM}|${SYN_PCT}|${NONE}))?`;
const SYN_RGB_LV3 = `(?:${SYN_NUM}(?:\\s*,\\s*${SYN_NUM}){2}|${SYN_PCT}(?:\\s*,\\s*${SYN_PCT}){2})(?:\\s*,\\s*(?:${SYN_NUM}|${SYN_PCT}))?`;
const SYN_LAB = `(?:${SYN_NUM}|${SYN_PCT}|${NONE})(?:\\s+(?:${SYN_NUM}|${SYN_PCT}|${NONE})){2}(?:\\s*\\/\\s*(?:${SYN_NUM}|${SYN_PCT}|${NONE}))?`;
const SYN_LCH = `(?:(?:${SYN_NUM}|${SYN_PCT}|${NONE})\\s+){2}(?:${SYN_NUM}(?:${SYN_ANGLE})?|${NONE})(?:\\s*\\/\\s*(?:${SYN_NUM}|${SYN_PCT}|${NONE}))?`;
const SYN_COLOR_FUNC = `(?:${SYN_COLOR_SPACE_RGB}|${SYN_COLOR_SPACE_XYZ})(?:\\s+(?:${SYN_NUM}|${SYN_PCT}|${NONE})){3}(?:\\s*\\/\\s*(?:${SYN_NUM}|${SYN_PCT}|${NONE}))?`;
const SYN_COLOR_TYPE = `[a-z]+|#(?:[\\da-f]{3}|[\\da-f]{4}|[\\da-f]{6}|[\\da-f]{8})|hsla?\\(\\s*(?:${SYN_HSL}|${SYN_HSL_LV3})\\s*\\)|hwb\\(\\s*${SYN_HSL}\\s*\\)|rgba?\\(\\s*(?:${SYN_RGB}|${SYN_RGB_LV3})\\s*\\)|(?:ok)?lab\\(\\s*${SYN_LAB}\\s*\\)|(?:ok)?lch\\(\\s*${SYN_LCH}\\s*\\)|color\\(\\s*${SYN_COLOR_FUNC}\\s*\\)`;
const SYN_COLOR_MIX_PART = `(?:${SYN_COLOR_TYPE})(?:\\s+${SYN_PCT})?`;
const SYN_COLOR_MIX = `color-mix\\(\\s*in\\s+(${SYN_COLOR_SPACE_COLOR_MIX})\\s*,\\s*(${SYN_COLOR_MIX_PART})\\s*,\\s*(${SYN_COLOR_MIX_PART})\\s*\\)`;

/* regexp */
const REG_COLOR = new RegExp(`^(?:${SYN_COLOR_TYPE})$`);
const REG_COLOR_MIX = new RegExp(`^${SYN_COLOR_MIX}$`);
const REG_COLOR_FUNC = new RegExp(`^color\\(\\s*(${SYN_COLOR_FUNC})\\s*\\)$`);
const REG_CURRENT_COLOR = /^currentColor$/i;
const REG_HSL = new RegExp(`^hsla?\\(\\s*(${SYN_HSL}|${SYN_HSL_LV3})\\s*\\)$`);
const REG_HWB = new RegExp(`^hwb\\(\\s*(${SYN_HSL})\\s*\\)$`);
const REG_LAB = new RegExp(`^lab\\(\\s*(${SYN_LAB})\\s*\\)$`);
const REG_LCH = new RegExp(`^lch\\(\\s*(${SYN_LCH})\\s*\\)$`);
const REG_OKLAB = new RegExp(`^oklab\\(\\s*(${SYN_LAB})\\s*\\)$`);
const REG_OKLCH = new RegExp(`^oklch\\(\\s*(${SYN_LCH})\\s*\\)$`);
// TODO: rename spec to computedValue
const REG_SPEC = /^spec(?:ifiedValue)?$/;

/* named colors */
const NAMED_COLORS = {
  aliceblue: [0xF0, 0xF8, 0xFF],
  antiquewhite: [0xFA, 0xEB, 0xD7],
  aqua: [0x00, 0xFF, 0xFF],
  aquamarine: [0x7F, 0xFF, 0xD4],
  azure: [0xF0, 0xFF, 0xFF],
  beige: [0xF5, 0xF5, 0xDC],
  bisque: [0xFF, 0xE4, 0xC4],
  black: [0x00, 0x00, 0x00],
  blanchedalmond: [0xFF, 0xEB, 0xCD],
  blue: [0x00, 0x00, 0xFF],
  blueviolet: [0x8A, 0x2B, 0xE2],
  brown: [0xA5, 0x2A, 0x2A],
  burlywood: [0xDE, 0xB8, 0x87],
  cadetblue: [0x5F, 0x9E, 0xA0],
  chartreuse: [0x7F, 0xFF, 0x00],
  chocolate: [0xD2, 0x69, 0x1E],
  coral: [0xFF, 0x7F, 0x50],
  cornflowerblue: [0x64, 0x95, 0xED],
  cornsilk: [0xFF, 0xF8, 0xDC],
  crimson: [0xDC, 0x14, 0x3C],
  cyan: [0x00, 0xFF, 0xFF],
  darkblue: [0x00, 0x00, 0x8B],
  darkcyan: [0x00, 0x8B, 0x8B],
  darkgoldenrod: [0xB8, 0x86, 0x0B],
  darkgray: [0xA9, 0xA9, 0xA9],
  darkgreen: [0x00, 0x64, 0x00],
  darkgrey: [0xA9, 0xA9, 0xA9],
  darkkhaki: [0xBD, 0xB7, 0x6B],
  darkmagenta: [0x8B, 0x00, 0x8B],
  darkolivegreen: [0x55, 0x6B, 0x2F],
  darkorange: [0xFF, 0x8C, 0x00],
  darkorchid: [0x99, 0x32, 0xCC],
  darkred: [0x8B, 0x00, 0x00],
  darksalmon: [0xE9, 0x96, 0x7A],
  darkseagreen: [0x8F, 0xBC, 0x8F],
  darkslateblue: [0x48, 0x3D, 0x8B],
  darkslategray: [0x2F, 0x4F, 0x4F],
  darkslategrey: [0x2F, 0x4F, 0x4F],
  darkturquoise: [0x00, 0xCE, 0xD1],
  darkviolet: [0x94, 0x00, 0xD3],
  deeppink: [0xFF, 0x14, 0x93],
  deepskyblue: [0x00, 0xBF, 0xFF],
  dimgray: [0x69, 0x69, 0x69],
  dimgrey: [0x69, 0x69, 0x69],
  dodgerblue: [0x1E, 0x90, 0xFF],
  firebrick: [0xB2, 0x22, 0x22],
  floralwhite: [0xFF, 0xFA, 0xF0],
  forestgreen: [0x22, 0x8B, 0x22],
  fuchsia: [0xFF, 0x00, 0xFF],
  gainsboro: [0xDC, 0xDC, 0xDC],
  ghostwhite: [0xF8, 0xF8, 0xFF],
  gold: [0xFF, 0xD7, 0x00],
  goldenrod: [0xDA, 0xA5, 0x20],
  gray: [0x80, 0x80, 0x80],
  green: [0x00, 0x80, 0x00],
  greenyellow: [0xAD, 0xFF, 0x2F],
  grey: [0x80, 0x80, 0x80],
  honeydew: [0xF0, 0xFF, 0xF0],
  hotpink: [0xFF, 0x69, 0xB4],
  indianred: [0xCD, 0x5C, 0x5C],
  indigo: [0x4B, 0x00, 0x82],
  ivory: [0xFF, 0xFF, 0xF0],
  khaki: [0xF0, 0xE6, 0x8C],
  lavender: [0xE6, 0xE6, 0xFA],
  lavenderblush: [0xFF, 0xF0, 0xF5],
  lawngreen: [0x7C, 0xFC, 0x00],
  lemonchiffon: [0xFF, 0xFA, 0xCD],
  lightblue: [0xAD, 0xD8, 0xE6],
  lightcoral: [0xF0, 0x80, 0x80],
  lightcyan: [0xE0, 0xFF, 0xFF],
  lightgoldenrodyellow: [0xFA, 0xFA, 0xD2],
  lightgray: [0xD3, 0xD3, 0xD3],
  lightgreen: [0x90, 0xEE, 0x90],
  lightgrey: [0xD3, 0xD3, 0xD3],
  lightpink: [0xFF, 0xB6, 0xC1],
  lightsalmon: [0xFF, 0xA0, 0x7A],
  lightseagreen: [0x20, 0xB2, 0xAA],
  lightskyblue: [0x87, 0xCE, 0xFA],
  lightslategray: [0x77, 0x88, 0x99],
  lightslategrey: [0x77, 0x88, 0x99],
  lightsteelblue: [0xB0, 0xC4, 0xDE],
  lightyellow: [0xFF, 0xFF, 0xE0],
  lime: [0x00, 0xFF, 0x00],
  limegreen: [0x32, 0xCD, 0x32],
  linen: [0xFA, 0xF0, 0xE6],
  magenta: [0xFF, 0x00, 0xFF],
  maroon: [0x80, 0x00, 0x00],
  mediumaquamarine: [0x66, 0xCD, 0xAA],
  mediumblue: [0x00, 0x00, 0xCD],
  mediumorchid: [0xBA, 0x55, 0xD3],
  mediumpurple: [0x93, 0x70, 0xDB],
  mediumseagreen: [0x3C, 0xB3, 0x71],
  mediumslateblue: [0x7B, 0x68, 0xEE],
  mediumspringgreen: [0x00, 0xFA, 0x9A],
  mediumturquoise: [0x48, 0xD1, 0xCC],
  mediumvioletred: [0xC7, 0x15, 0x85],
  midnightblue: [0x19, 0x19, 0x70],
  mintcream: [0xF5, 0xFF, 0xFA],
  mistyrose: [0xFF, 0xE4, 0xE1],
  moccasin: [0xFF, 0xE4, 0xB5],
  navajowhite: [0xFF, 0xDE, 0xAD],
  navy: [0x00, 0x00, 0x80],
  oldlace: [0xFD, 0xF5, 0xE6],
  olive: [0x80, 0x80, 0x00],
  olivedrab: [0x6B, 0x8E, 0x23],
  orange: [0xFF, 0xA5, 0x00],
  orangered: [0xFF, 0x45, 0x00],
  orchid: [0xDA, 0x70, 0xD6],
  palegoldenrod: [0xEE, 0xE8, 0xAA],
  palegreen: [0x98, 0xFB, 0x98],
  paleturquoise: [0xAF, 0xEE, 0xEE],
  palevioletred: [0xDB, 0x70, 0x93],
  papayawhip: [0xFF, 0xEF, 0xD5],
  peachpuff: [0xFF, 0xDA, 0xB9],
  peru: [0xCD, 0x85, 0x3F],
  pink: [0xFF, 0xC0, 0xCB],
  plum: [0xDD, 0xA0, 0xDD],
  powderblue: [0xB0, 0xE0, 0xE6],
  purple: [0x80, 0x00, 0x80],
  rebeccapurple: [0x66, 0x33, 0x99],
  red: [0xFF, 0x00, 0x00],
  rosybrown: [0xBC, 0x8F, 0x8F],
  royalblue: [0x41, 0x69, 0xE1],
  saddlebrown: [0x8B, 0x45, 0x13],
  salmon: [0xFA, 0x80, 0x72],
  sandybrown: [0xF4, 0xA4, 0x60],
  seagreen: [0x2E, 0x8B, 0x57],
  seashell: [0xFF, 0xF5, 0xEE],
  sienna: [0xA0, 0x52, 0x2D],
  silver: [0xC0, 0xC0, 0xC0],
  skyblue: [0x87, 0xCE, 0xEB],
  slateblue: [0x6A, 0x5A, 0xCD],
  slategray: [0x70, 0x80, 0x90],
  slategrey: [0x70, 0x80, 0x90],
  snow: [0xFF, 0xFA, 0xFA],
  springgreen: [0x00, 0xFF, 0x7F],
  steelblue: [0x46, 0x82, 0xB4],
  tan: [0xD2, 0xB4, 0x8C],
  teal: [0x00, 0x80, 0x80],
  thistle: [0xD8, 0xBF, 0xD8],
  tomato: [0xFF, 0x63, 0x47],
  turquoise: [0x40, 0xE0, 0xD0],
  violet: [0xEE, 0x82, 0xEE],
  wheat: [0xF5, 0xDE, 0xB3],
  white: [0xFF, 0xFF, 0xFF],
  whitesmoke: [0xF5, 0xF5, 0xF5],
  yellow: [0xFF, 0xFF, 0x00],
  yellowgreen: [0x9A, 0xCD, 0x32]
};

/**
 * validate color components
 * @param {Array} arr - array of color components
 * @param {object} [opt] - options
 * @param {boolean} [opt.alpha] - alpha channel
 * @param {number} [opt.minLength] - min length
 * @param {number} [opt.maxLength] - max length
 * @param {number} [opt.minRange] - min range
 * @param {number} [opt.maxRange] - max range
 * @param {boolean} [opt.validateRange] - validate range
 * @returns {Array} - arr
 */
export const validateColorComponents = (arr, opt = {}) => {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected Array but got ${getType(arr)}.`);
  }
  const {
    alpha = false,
    minLength = TRIA,
    maxLength = QUAT,
    minRange = 0,
    maxRange = 1,
    validateRange = true
  } = opt;
  if (typeof minLength !== 'number') {
    throw new TypeError(`Expected Number but got ${getType(minLength)}.`);
  } else if (Number.isNaN(minLength)) {
    throw new TypeError(`${minLength} is not a number.`);
  }
  if (typeof maxLength !== 'number') {
    throw new TypeError(`Expected Number but got ${getType(maxLength)}.`);
  } else if (Number.isNaN(maxLength)) {
    throw new TypeError(`${maxLength} is not a number.`);
  }
  if (typeof minRange !== 'number') {
    throw new TypeError(`Expected Number but got ${getType(minRange)}.`);
  } else if (Number.isNaN(minRange)) {
    throw new TypeError(`${minRange} is not a number.`);
  }
  if (typeof maxRange !== 'number') {
    throw new TypeError(`Expected Number but got ${getType(maxRange)}.`);
  } else if (Number.isNaN(maxRange)) {
    throw new TypeError(`${maxRange} is not a number.`);
  }
  const l = arr.length;
  if (l < minLength || l > maxLength) {
    let msg;
    if (minLength === maxLength) {
      msg = `Expected array length of ${maxLength} but got ${l}.`;
    } else {
      msg =
        `Expected array length of ${minLength} or ${maxLength} but got ${l}.`;
    }
    throw new Error(msg);
  }
  let i = 0;
  while (i < l) {
    const v = arr[i];
    if (typeof v !== 'number') {
      throw new TypeError(`Expected Number but got ${getType(v)}.`);
    } else if (Number.isNaN(v)) {
      throw new TypeError(`${v} is not a number.`);
    } else if (i < TRIA && validateRange && (v < minRange || v > maxRange)) {
      throw new RangeError(`${v} is not between ${minRange} and ${maxRange}.`);
    } else if (i === TRIA && (v < 0 || v > 1)) {
      throw new RangeError(`${v} is not between 0 and 1.`);
    }
    i++;
  }
  if (alpha && l === TRIA) {
    arr.push(1);
  }
  return arr;
};

/**
 * transform matrix
 * @param {Array.<Array.<number>>} mtx - 3 * 3 matrix
 * @param {Array.<number>} vct - vector
 * @param {boolean} skip - skip alidate
 * @returns {Array.<number>} - [p1, p2, p3]
 */
export const transformMatrix = (mtx, vct, skip = false) => {
  if (!Array.isArray(mtx)) {
    throw new TypeError(`Expected Array but got ${getType(mtx)}.`);
  } else if (mtx.length !== TRIA) {
    throw new Error(`Expected array length of 3 but got ${mtx.length}.`);
  } else if (!skip) {
    for (let i of mtx) {
      i = validateColorComponents(i, {
        maxLength: TRIA,
        validateRange: false
      });
    }
  }
  const [
    [r1c1, r1c2, r1c3],
    [r2c1, r2c2, r2c3],
    [r3c1, r3c2, r3c3]
  ] = mtx;
  let v1, v2, v3;
  if (skip) {
    [v1, v2, v3] = vct;
  } else {
    [v1, v2, v3] = validateColorComponents(vct, {
      maxLength: TRIA,
      validateRange: false
    });
  }
  const p1 = r1c1 * v1 + r1c2 * v2 + r1c3 * v3;
  const p2 = r2c1 * v1 + r2c2 * v2 + r2c3 * v3;
  const p3 = r3c1 * v1 + r3c2 * v2 + r3c3 * v3;
  return [p1, p2, p3];
};

/**
 * re-insert missing color components
 * @param {string} value - value
 * @param {Array} color - array of color components [r, g, b, a]|[l, c, h, a]
 * @returns {Array<number|string>} - [v1, v2, v3, v4]
 */
export const reInsertMissingColorComponents = (value, color = []) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const [v1, v2, v3, v4] = color;
  let v1m, v2m, v3m, v4m;
  if (/none/.test(value)) {
    const regRgb = new RegExp(`^rgba?\\(\\s*(${SYN_RGB})\\s*\\)$`);
    const regHsl = new RegExp(`^h(?:sla?|wb)\\(\\s*(${SYN_HSL})\\s*\\)$`);
    const regLab = new RegExp(`^(?:ok)?lab\\(\\s*(${SYN_LAB})\\s*\\)$`);
    const regLch = new RegExp(`^(?:ok)?lch\\(\\s*(${SYN_LCH})\\s*\\)$`);
    // rgb()
    if (regRgb.test(value)) {
      [v1m, v2m, v3m, v4m] =
        value.match(regRgb)[1].replace('/', ' ').split(/\s+/);
    // color()
    } else if (REG_COLOR_FUNC.test(value)) {
      [, v1m, v2m, v3m, v4m] =
        value.match(REG_COLOR_FUNC)[1].replace('/', ' ').split(/\s+/);
    // hsl()
    } else if (value.startsWith('hsl') && regHsl.test(value)) {
      [v3m, v2m, v1m, v4m] =
        value.match(regHsl)[1].replace('/', ' ').split(/\s+/);
    // hwb()
    } else if (value.startsWith('hwb') && regHsl.test(value)) {
      [v3m, , , v4m] = value.match(regHsl)[1].replace('/', ' ').split(/\s+/);
    // lab(), oklab()
    } else if (regLab.test(value)) {
      [v1m, , , v4m] = value.match(regLab)[1].replace('/', ' ').split(/\s+/);
    // lch(), oklch()
    } else if (regLch.test(value)) {
      [v1m, v2m, v3m, v4m] =
        value.match(regLch)[1].replace('/', ' ').split(/\s+/);
    }
  }
  return [
    v1m === NONE ? v1m : v1,
    v2m === NONE ? v2m : v2,
    v3m === NONE ? v3m : v3,
    v4m === NONE ? v4m : v4
  ];
};

/**
 * normalize color components
 * @param {Array} colorA - array of color components [v1, v2, v3, v4]
 * @param {Array} colorB - array of color components [v1, v2, v3, v4]
 * @param {boolean} skip - skip validate
 * @returns {Array.<Array.<number>>} - [colorA, colorB]
 */
export const normalizeColorComponents = (colorA, colorB, skip = false) => {
  if (!Array.isArray(colorA)) {
    throw new TypeError(`Expected Array but got ${getType(colorA)}.`);
  } else if (colorA.length !== QUAT) {
    throw new Error(`Expected array length of 4 but got ${colorA.length}.`);
  }
  if (!Array.isArray(colorB)) {
    throw new TypeError(`Expected Array but got ${getType(colorB)}.`);
  } else if (colorB.length !== QUAT) {
    throw new Error(`Expected array length of 4 but got ${colorB.length}.`);
  }
  let i = 0;
  while (i < QUAT) {
    if (colorA[i] === NONE && colorB[i] === NONE) {
      colorA[i] = 0;
      colorB[i] = 0;
    } else if (colorA[i] === NONE) {
      colorA[i] = colorB[i];
    } else if (colorB[i] === NONE) {
      colorB[i] = colorA[i];
    }
    i++;
  }
  if (!skip) {
    colorA = validateColorComponents(colorA, {
      minLength: QUAT,
      validateRange: false
    });
    colorB = validateColorComponents(colorB, {
      minLength: QUAT,
      validateRange: false
    });
  }
  return [colorA, colorB];
};

/**
 * number to hex string
 * @param {number} value - color value
 * @returns {string} - hex string
 */
export const numberToHexString = value => {
  if (typeof value !== 'number') {
    throw new TypeError(`Expected Number but got ${getType(value)}.`);
  } else if (Number.isNaN(value)) {
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
 * @param {string} angle - angle
 * @returns {number} - deg 0..360
 */
export const angleToDeg = angle => {
  if (isString(angle)) {
    angle = angle.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(angle)}.`);
  }
  const GRAD = DEG / 400;
  const RAD = DEG / (Math.PI * DUO);
  const reg = new RegExp(`^(${SYN_NUM})(${SYN_ANGLE})?$`);
  if (!reg.test(angle)) {
    throw new SyntaxError(`Invalid property value: ${angle}`);
  }
  const [, val, unit] = angle.match(reg);
  const value = val.startsWith('.') ? `0${val}` : val;
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
 * @param {?string} [a] - alpha value
 * @returns {number} - a: 0..1
 */
export const parseAlpha = a => {
  if (isString(a)) {
    a = a.trim();
    if (!a) {
      a = 1;
    } else if (a === NONE) {
      a = 0;
    } else {
      if (a.startsWith('.')) {
        a = `0${a}`;
      }
      if (a.endsWith('%')) {
        a = parseFloat(a) / MAX_PCT;
      } else {
        a = parseFloat(a);
      }
      if (Number.isNaN(a)) {
        throw new TypeError(`${a} is not a number.`);
      }
      if (a < PPTH) {
        a = 0;
      } else if (a > 1) {
        a = 1;
      } else {
        a = parseFloat(a.toFixed(3));
      }
    }
  } else {
    a = 1;
  }
  return a;
};

/**
 * parse hex alpha
 * @param {string} value - alpha value in hex string
 * @returns {number} - a: 0..1
 */
export const parseHexAlpha = value => {
  if (isString(value)) {
    if (value === '') {
      throw new SyntaxError('Invalid property value: (empty string)');
    }
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  let a = parseInt(value, HEX);
  if (a <= 0) {
    return 0;
  }
  if (a >= MAX_RGB) {
    return 1;
  }
  const alphaMap = new Map();
  for (let i = 1; i < MAX_PCT; i++) {
    alphaMap.set(Math.round(i * MAX_RGB / MAX_PCT), i);
  }
  if (alphaMap.has(a)) {
    a = alphaMap.get(a) / MAX_PCT;
  } else {
    a = Math.round(a / MAX_RGB / PPTH) * PPTH;
  }
  return parseFloat(a.toFixed(3));
};

/**
 * convert rgb to linear rgb
 * @param {Array.<number>} rgb - [r, g, b] r|g|b: 0..255
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [r, g, b] r|g|b: 0..1
 */
export const convertRgbToLinearRgb = (rgb, skip = false) => {
  let rr, gg, bb;
  if (skip) {
    [rr, gg, bb] = rgb;
  } else {
    [rr, gg, bb] = validateColorComponents(rgb, {
      maxLength: TRIA,
      maxRange: MAX_RGB
    });
  }
  let r = rr / MAX_RGB;
  let g = gg / MAX_RGB;
  let b = bb / MAX_RGB;
  const COND_POW = 0.04045;
  if (r > COND_POW) {
    r = Math.pow((r + LINEAR_OFFSET) / (1 + LINEAR_OFFSET), POW_LINEAR);
  } else {
    r /= LINEAR_COEF;
  }
  if (g > COND_POW) {
    g = Math.pow((g + LINEAR_OFFSET) / (1 + LINEAR_OFFSET), POW_LINEAR);
  } else {
    g /= LINEAR_COEF;
  }
  if (b > COND_POW) {
    b = Math.pow((b + LINEAR_OFFSET) / (1 + LINEAR_OFFSET), POW_LINEAR);
  } else {
    b /= LINEAR_COEF;
  }
  return [r, g, b];
};

/**
 * convert rgb to xyz
 * @param {Array.<number>} rgb - [r, g, b, [a]] r|g|b: 0..255 a: 0..1
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [x, y, z, a] x|y|z|a: 0..1
 */
export const convertRgbToXyz = (rgb, skip = false) => {
  let r, g, b, a;
  if (skip) {
    [r, g, b, a] = rgb;
  } else {
    [r, g, b, a] = validateColorComponents(rgb, {
      alpha: true,
      maxRange: MAX_RGB
    });
  }
  const [rr, gg, bb] = convertRgbToLinearRgb([r, g, b], true);
  const [x, y, z] = transformMatrix(MATRIX_L_RGB_TO_XYZ, [rr, gg, bb], true);
  return [x, y, z, a];
};

/**
 * convert rgb to xyz-d50
 * @param {Array.<number>} rgb - [r, g, b, [a]] r|g|b: 0..255 a: 0..1
 * @returns {Array.<number>} - [x, y, z, a] x|y|z|a: 0..1
 */
export const convertRgbToXyzD50 = rgb => {
  const [xx, yy, zz, a] = convertRgbToXyz(rgb);
  const [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [xx, yy, zz], true);
  return [x, y, z, a];
};

/**
 * convert rgb to hex color
 * @param {Array.<number>} rgb - [r, g, b, a] r|g|b: 0..255 a: 0..1
 * @returns {string} - hex color
 */
export const convertRgbToHex = rgb => {
  const [r, g, b, a] = validateColorComponents(rgb, {
    alpha: true,
    maxRange: MAX_RGB
  });
  const rr = numberToHexString(r);
  const gg = numberToHexString(g);
  const bb = numberToHexString(b);
  const aa = numberToHexString(a * MAX_RGB);
  let hex;
  if (aa === 'ff') {
    hex = `#${rr}${gg}${bb}`;
  } else {
    hex = `#${rr}${gg}${bb}${aa}`;
  }
  return hex;
};

/**
 * convert linear rgb to rgb
 * @param {Array.<number>} rgb - [r, g, b] r|g|b: 0..1
 * @param {boolean} round - round result
 * @returns {Array.<number>} - [r, g, b] r|g|b: 0..255
 */
export const convertLinearRgbToRgb = (rgb, round = false) => {
  let [r, g, b] = validateColorComponents(rgb, {
    maxLength: TRIA
  });
  const COND_POW = 809 / 258400;
  if (r > COND_POW) {
    r = Math.pow(r, 1 / POW_LINEAR) * (1 + LINEAR_OFFSET) - LINEAR_OFFSET;
  } else {
    r *= LINEAR_COEF;
  }
  if (g > COND_POW) {
    g = Math.pow(g, 1 / POW_LINEAR) * (1 + LINEAR_OFFSET) - LINEAR_OFFSET;
  } else {
    g *= LINEAR_COEF;
  }
  if (b > COND_POW) {
    b = Math.pow(b, 1 / POW_LINEAR) * (1 + LINEAR_OFFSET) - LINEAR_OFFSET;
  } else {
    b *= LINEAR_COEF;
  }
  return [
    round ? Math.round(r * MAX_RGB) : r * MAX_RGB,
    round ? Math.round(g * MAX_RGB) : g * MAX_RGB,
    round ? Math.round(b * MAX_RGB) : b * MAX_RGB
  ];
};

/**
 * convert linear rgb to hex color
 * @param {Array.<number>} rgb - [r, g, b, a] r|g|b|a: 0..1
 * @param {boolean} skip - skip validate
 * @returns {string} - hex color
 */
export const convertLinearRgbToHex = (rgb, skip = false) => {
  let r, g, b, a;
  if (skip) {
    [r, g, b, a] = rgb;
  } else {
    [r, g, b, a] = validateColorComponents(rgb, {
      minLength: QUAT
    });
  }
  [r, g, b] = convertLinearRgbToRgb([r, g, b], true);
  const rr = numberToHexString(r);
  const gg = numberToHexString(g);
  const bb = numberToHexString(b);
  const aa = numberToHexString(a * MAX_RGB);
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
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {string} - hex color
 */
export const convertXyzToHex = xyz => {
  const [x, y, z, a] = validateColorComponents(xyz, {
    minLength: QUAT,
    validateRange: false
  });
  const [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
  const hex = convertLinearRgbToHex([
    Math.min(Math.max(r, 0), 1),
    Math.min(Math.max(g, 0), 1),
    Math.min(Math.max(b, 0), 1),
    a
  ], true);
  return hex;
};

/**
 * convert xyz D50 to hex color
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {string} - hex color
 */
export const convertXyzD50ToHex = xyz => {
  const [x, y, z, a] = validateColorComponents(xyz, {
    minLength: QUAT,
    validateRange: false
  });
  const xyzD65 = transformMatrix(MATRIX_D50_TO_D65, [x, y, z], true);
  const [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, xyzD65, true);
  const hex = convertLinearRgbToHex([
    Math.min(Math.max(r, 0), 1),
    Math.min(Math.max(g, 0), 1),
    Math.min(Math.max(b, 0), 1),
    a
  ]);
  return hex;
};

/**
 * convert xyz to rgb
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [r, g, b, a] r|g|b: 0..255 a: 0..1
 */
export const convertXyzToRgb = (xyz, skip = false) => {
  let x, y, z, a;
  if (skip) {
    [x, y, z, a] = xyz;
  } else {
    [x, y, z, a] = validateColorComponents(xyz, {
      validateRange: false
    });
  }
  let [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
  [r, g, b] = convertLinearRgbToRgb([
    Math.min(Math.max(r, 0), 1),
    Math.min(Math.max(g, 0), 1),
    Math.min(Math.max(b, 0), 1)
  ], true);
  return [r, g, b, a];
};

/**
 * convert xyz to xyz-d50
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @returns {Array.<number>} - [x, y, z, a] x|y|z|a: 0..1
 */
export const convertXyzToXyzD50 = xyz => {
  const [xx, yy, zz, a] = validateColorComponents(xyz, {
    validateRange: false
  });
  const [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [xx, yy, zz], true);
  return [x, y, z, a];
};

/**
 * convert xyz to hsl
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [h, s, l, a] h: 0..360 s|l: 0..100 a: 0..1
 */
export const convertXyzToHsl = (xyz, skip = false) => {
  const [rr, gg, bb, a] = convertXyzToRgb(xyz, skip);
  const r = rr / MAX_RGB;
  const g = gg / MAX_RGB;
  const b = bb / MAX_RGB;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) * HALF * MAX_PCT;
  let h, s;
  if (Math.round(l) === 0 || Math.round(l) === MAX_PCT) {
    h = NONE;
    s = NONE;
  } else {
    s = d / (1 - Math.abs(max + min - 1)) * MAX_PCT;
    if (s === 0) {
      h = NONE;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d;
          break;
        case g:
          h = (b - r) / d + DUO;
          break;
        case b:
        default:
          h = (r - g) / d + QUAT;
          break;
      }
      h = h * SEXA % DEG;
      if (h < 0) {
        h += DEG;
      }
    }
  }
  return [h, s, l, a];
};

/**
 * convert xyz to hwb
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [h, w, b, a] h: 0..360 w|b: 0..100 a: 0..1
 */
export const convertXyzToHwb = (xyz, skip = false) => {
  const [r, g, b, a] = convertXyzToRgb(xyz, skip);
  const w = Math.min(r, g, b) / MAX_RGB;
  const bk = 1 - Math.max(r, g, b) / MAX_RGB;
  let h;
  if (w + bk === 1) {
    h = NONE;
  } else {
    [h] = convertXyzToHsl(xyz);
  }
  return [
    h,
    w * MAX_PCT,
    bk * MAX_PCT,
    a
  ];
};

/**
 * convert xyz to oklab
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [l, a, b, aa] l|aa: 0..1 a|b: -0.4..0.4
 */
export const convertXyzToOklab = (xyz, skip = false) => {
  let x, y, z, aa;
  if (skip) {
    [x, y, z, aa] = xyz;
  } else {
    [x, y, z, aa] = validateColorComponents(xyz, {
      validateRange: false
    });
  }
  const lms = transformMatrix(MATRIX_XYZ_TO_LMS, [x, y, z], true);
  const xyzLms = lms.map(c => Math.cbrt(c));
  let [l, a, b] = transformMatrix(MATRIX_LMS_TO_OKLAB, xyzLms, true);
  l = Math.min(Math.max(l, 0), 1);
  const lPct = Math.round(parseFloat(l.toFixed(QUAT)) * MAX_PCT);
  if (lPct === 0 || lPct === MAX_PCT) {
    a = NONE;
    b = NONE;
  }
  return [l, a, b, aa];
};

/**
 * convert xyz to oklch
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [l, c, h, aa] l|aa: 0..1 c: 0..0.4 h: 0..360
 */
export const convertXyzToOklch = (xyz, skip = false) => {
  const [l, a, b, aa] = convertXyzToOklab(xyz, skip);
  let c, h;
  const lPct = Math.round(parseFloat(l.toFixed(QUAT)) * MAX_PCT);
  if (lPct === 0 || lPct === MAX_PCT) {
    c = NONE;
    h = NONE;
  } else {
    c =
      Math.max(Math.sqrt(Math.pow(a, POW_SQR) + Math.pow(b, POW_SQR)), 0);
    if (parseFloat(c.toFixed(QUAT)) === 0) {
      h = NONE;
    } else {
      h = Math.atan2(b, a) * DEG * HALF / Math.PI;
      if (h < 0) {
        h += DEG;
      }
    }
  }
  return [l, c, h, aa];
};

/**
 * convert xyz D50 to rgb
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [r, g, b, a] r|g|b: 0..255 a: 0..1
 */
export const convertXyzD50ToRgb = (xyz, skip = false) => {
  let x, y, z, a;
  if (skip) {
    [x, y, z, a] = xyz;
  } else {
    [x, y, z, a] = validateColorComponents(xyz, {
      minLength: QUAT,
      validateRange: false
    });
  }
  const xyzD65 = transformMatrix(MATRIX_D50_TO_D65, [x, y, z], true);
  const [r, g, b] = convertXyzToRgb(xyzD65, true);
  return [r, g, b, a];
};

/**
 * convert xyz-d50 to lab
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [l, a, b, aa] l: 0..100 a|b: -125..125 aa: 0..1
 */
export const convertXyzD50ToLab = (xyz, skip = false) => {
  let x, y, z, aa;
  if (skip) {
    [x, y, z, aa] = xyz;
  } else {
    [x, y, z, aa] = validateColorComponents(xyz, {
      validateRange: false
    });
  }
  const xyzD50 = [x, y, z].map((val, i) => val / D50[i]);
  const [f0, f1, f2] = xyzD50.map(val => val > LAB_EPSILON
    ? Math.cbrt(val)
    : (val * LAB_KAPPA + HEX) / LAB_L
  );
  const l = Math.min(Math.max((LAB_L * f1) - HEX, 0), MAX_PCT);
  let a, b;
  if (l === 0 || l === MAX_PCT) {
    a = NONE;
    b = NONE;
  } else {
    a = (f0 - f1) * LAB_A;
    b = (f1 - f2) * LAB_B;
  }
  return [l, a, b, aa];
};

/**
 * convert xyz-d50 to lch
 * @param {Array.<number>} xyz - [x, y, z, a] x|y|z|a: 0..1
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [l, c, h, a] l: 0..100 c: 0..150 h: 0..360 a: 0..1
 */
export const convertXyzD50ToLch = (xyz, skip = false) => {
  const [l, a, b, aa] = convertXyzD50ToLab(xyz, skip);
  let c, h;
  if (l === 0 || l === MAX_PCT) {
    c = NONE;
    h = NONE;
  } else {
    c =
      Math.max(Math.sqrt(Math.pow(a, POW_SQR) + Math.pow(b, POW_SQR)), 0);
    h = Math.atan2(b, a) * DEG * HALF / Math.PI;
    if (h < 0) {
      h += DEG;
    }
  }
  return [l, c, h, aa];
};

/**
 * convert hex color to rgb
 * @param {string} value - color value
 * @returns {Array.<number>} - [r, g, b, a] r|g|b: 0..255 a: 0..1
 */
export const convertHexToRgb = value => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  if (!(/^#[\da-f]{6}$/.test(value) || /^#[\da-f]{3}$/.test(value) ||
        /^#[\da-f]{8}$/.test(value) || /^#[\da-f]{4}$/.test(value))) {
    throw new SyntaxError(`Invalid property value: ${value}`);
  }
  const arr = [];
  if (/^#[\da-f]{6}$/.test(value)) {
    const [, r, g, b] = value.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/);
    arr.push(
      parseInt(r, HEX),
      parseInt(g, HEX),
      parseInt(b, HEX),
      1
    );
  } else if (/^#[\da-f]{3}$/.test(value)) {
    const [, r, g, b] = value.match(/^#([\da-f])([\da-f])([\da-f])$/);
    arr.push(
      parseInt(`${r}${r}`, HEX),
      parseInt(`${g}${g}`, HEX),
      parseInt(`${b}${b}`, HEX),
      1
    );
  } else if (/^#[\da-f]{8}$/.test(value)) {
    const [, r, g, b, a] =
      value.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})$/);
    arr.push(
      parseInt(r, HEX),
      parseInt(g, HEX),
      parseInt(b, HEX),
      parseHexAlpha(a)
    );
  } else if (/^#[\da-f]{4}$/.test(value)) {
    const [, r, g, b, a] =
      value.match(/^#([\da-f])([\da-f])([\da-f])([\da-f])$/);
    arr.push(
      parseInt(`${r}${r}`, HEX),
      parseInt(`${g}${g}`, HEX),
      parseInt(`${b}${b}`, HEX),
      parseHexAlpha(`${a}${a}`)
    );
  }
  return arr;
};

/**
 * convert hex color to linear rgb
 * @param {string} value - color value
 * @returns {Array.<number>} - [r, g, b, a] r|g|b|a: 0..1
 */
export const convertHexToLinearRgb = value => {
  const [rr, gg, bb, a] = convertHexToRgb(value);
  const [r, g, b] = convertRgbToLinearRgb([rr, gg, bb], true);
  return [r, g, b, a];
};

/**
 * convert hex color to xyz
 * @param {string} value - color value
 * @returns {Array.<number>} - [x, y, z, a] x|y|z|a: 0..1
 */
export const convertHexToXyz = value => {
  const [r, g, b, a] = convertHexToLinearRgb(value);
  const [x, y, z] = transformMatrix(MATRIX_L_RGB_TO_XYZ, [r, g, b], true);
  return [x, y, z, a];
};

/**
 * parse rgb()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|string}
 *   - ['rgb', r, g, b, a] | '<empty string>'
 */
export const parseRgb = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { format } = opt;
  const reg = new RegExp(`^rgba?\\(\\s*(${SYN_RGB}|${SYN_RGB_LV3})\\s*\\)$`);
  if (!reg.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  const [, val] = value.match(reg);
  let [r, g, b, a] = val.replace(/[,/]/g, ' ').split(/\s+/);
  if (r === NONE) {
    r = 0;
  } else {
    if (r.startsWith('.')) {
      r = `0${r}`;
    }
    if (r.endsWith('%')) {
      r = parseFloat(r) * MAX_RGB / MAX_PCT;
    } else {
      r = parseFloat(r);
    }
    r = Math.min(Math.max(parseFloat(r.toPrecision(6)), 0), MAX_RGB);
  }
  if (g === NONE) {
    g = 0;
  } else {
    if (g.startsWith('.')) {
      g = `0${g}`;
    }
    if (g.endsWith('%')) {
      g = parseFloat(g) * MAX_RGB / MAX_PCT;
    } else {
      g = parseFloat(g);
    }
    g = Math.min(Math.max(parseFloat(g.toPrecision(6)), 0), MAX_RGB);
  }
  if (b === NONE) {
    b = 0;
  } else {
    if (b.startsWith('.')) {
      b = `0${b}`;
    }
    if (b.endsWith('%')) {
      b = parseFloat(b) * MAX_RGB / MAX_PCT;
    } else {
      b = parseFloat(b);
    }
    b = Math.min(Math.max(parseFloat(b.toPrecision(6)), 0), MAX_RGB);
  }
  a = parseAlpha(a);
  return ['rgb', r, g, b, a];
};

/**
 * parse hsl()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|string}
 *   - ['rgb', r, g, b, a] | '<empty string>'
 */
export const parseHsl = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { format } = opt;
  if (!REG_HSL.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  const [, val] = value.match(REG_HSL);
  let [h, s, l, a] = val.replace(/[,/]/g, ' ').split(/\s+/);
  if (h === NONE) {
    if (format !== 'hsl') {
      h = 0;
    }
  } else {
    h = angleToDeg(h);
  }
  if (s === NONE) {
    if (format !== 'hsl') {
      s = 0;
    }
  } else {
    if (s.startsWith('.')) {
      s = `0${s}`;
    }
    s = Math.min(Math.max(parseFloat(s), 0), MAX_PCT);
  }
  if (l === NONE) {
    if (format !== 'hsl') {
      l = 0;
    }
  } else {
    if (l.startsWith('.')) {
      l = `0${l}`;
    }
    l = Math.min(Math.max(parseFloat(l), 0), MAX_PCT);
  }
  if (a !== NONE || format !== 'hsl') {
    a = parseAlpha(a);
  }
  if (format === 'hsl') {
    return [format, h, s, l, a];
  }
  const ll = l / MAX_PCT;
  const sa = s / MAX_PCT * Math.min(ll, 1 - ll);
  const rk = (h / DEG * DOZ) % DOZ;
  const gk = (8 + h / DEG * DOZ) % DOZ;
  const bk = (4 + h / DEG * DOZ) % DOZ;
  const r =
    ll - sa * Math.max(-1, Math.min(rk - TRIA, TRIA ** POW_SQR - rk, 1));
  const g =
    ll - sa * Math.max(-1, Math.min(gk - TRIA, TRIA ** POW_SQR - gk, 1));
  const b =
    ll - sa * Math.max(-1, Math.min(bk - TRIA, TRIA ** POW_SQR - bk, 1));
  return [
    'rgb',
    Math.min(Math.max(parseFloat((r * MAX_RGB).toPrecision(6)), 0), MAX_RGB),
    Math.min(Math.max(parseFloat((g * MAX_RGB).toPrecision(6)), 0), MAX_RGB),
    Math.min(Math.max(parseFloat((b * MAX_RGB).toPrecision(6)), 0), MAX_RGB),
    a
  ];
};

/**
 * parse hwb()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|string}
 *   - ['rgb', r, g, b, a] | '<empty string>'
 */
export const parseHwb = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { format } = opt;
  if (!REG_HWB.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  const [, val] = value.match(REG_HWB);
  let [h, w, b, a] = val.replace('/', ' ').split(/\s+/);
  if (h === NONE) {
    if (format !== 'hwb') {
      h = 0;
    }
  } else {
    h = angleToDeg(h);
  }
  if (w === NONE) {
    if (format !== 'hwb') {
      w = 0;
    }
  } else {
    if (w.startsWith('.')) {
      w = `0${w}`;
    }
    w = Math.min(Math.max(parseFloat(w), 0), MAX_PCT) / MAX_PCT;
  }
  if (b === NONE) {
    if (format !== 'hwb') {
      b = 0;
    }
  } else {
    if (b.startsWith('.')) {
      b = `0${b}`;
    }
    b = Math.min(Math.max(parseFloat(b), 0), MAX_PCT) / MAX_PCT;
  }
  if (a !== NONE || format !== 'hwb') {
    a = parseAlpha(a);
  }
  if (format === 'hwb') {
    return [
      format,
      h,
      w === NONE ? w : w * MAX_PCT,
      b === NONE ? b : b * MAX_PCT,
      a
    ];
  }
  if (w + b >= 1) {
    const v = parseFloat(((w / (w + b)) * MAX_RGB).toPrecision(6));
    return ['rgb', v, v, v, a];
  }
  const factor = (1 - w - b) / MAX_RGB;
  let [, rr, gg, bb] = parseHsl(`hsl(${h} 100 50)`);
  rr = parseFloat(((rr * factor + w) * MAX_RGB).toPrecision(6));
  gg = parseFloat(((gg * factor + w) * MAX_RGB).toPrecision(6));
  bb = parseFloat(((bb * factor + w) * MAX_RGB).toPrecision(6));
  return [
    'rgb',
    Math.min(Math.max(rr, 0), MAX_RGB),
    Math.min(Math.max(gg, 0), MAX_RGB),
    Math.min(Math.max(bb, 0), MAX_RGB),
    a
  ];
};

/**
 + parse lab()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|string}
 *   - [xyz-d50, x, y, z, aa] | ['lab', l, a, b, aa] | '<empty string>'
 */
export const parseLab = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { format } = opt;
  if (!REG_LAB.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  const COEF_PCT = 1.25;
  const COND_POW = 8;
  const [, val] = value.match(REG_LAB);
  let [l, a, b, aa] = val.replace('/', ' ').split(/\s+/);
  if (l === NONE) {
    if (!REG_SPEC.test(format)) {
      l = 0;
    }
  } else {
    if (l.startsWith('.')) {
      l = `0${l}`;
    }
    if (l.endsWith('%')) {
      l = parseFloat(l);
      if (l > MAX_PCT) {
        l = MAX_PCT;
      }
    } else {
      l = parseFloat(l);
    }
    if (l < 0) {
      l = 0;
    }
  }
  if (a === NONE) {
    if (!REG_SPEC.test(format)) {
      a = 0;
    }
  } else {
    if (a.startsWith('.')) {
      a = `0${a}`;
    }
    if (a.endsWith('%')) {
      a = parseFloat(a) * COEF_PCT;
    } else {
      a = parseFloat(a);
    }
  }
  if (b === NONE) {
    if (!REG_SPEC.test(format)) {
      b = 0;
    }
  } else {
    if (b.endsWith('%')) {
      b = parseFloat(b) * COEF_PCT;
    } else {
      b = parseFloat(b);
    }
  }
  if (aa !== NONE || !REG_SPEC.test(format)) {
    aa = parseAlpha(aa);
  }
  if (REG_SPEC.test(format)) {
    return [
      'lab',
      l === NONE ? l : parseFloat(l.toPrecision(6)),
      a === NONE ? a : parseFloat(a.toPrecision(6)),
      b === NONE ? b : parseFloat(b.toPrecision(6)),
      aa
    ];
  }
  const fl = (l + HEX) / LAB_L;
  const fa = (a / LAB_A + fl);
  const fb = (fl - b / LAB_B);
  const powFl = Math.pow(fl, POW_CUBE);
  const powFa = Math.pow(fa, POW_CUBE);
  const powFb = Math.pow(fb, POW_CUBE);
  const xyz = [
    powFa > LAB_EPSILON ? powFa : (fa * LAB_L - HEX) / LAB_KAPPA,
    l > COND_POW ? powFl : l / LAB_KAPPA,
    powFb > LAB_EPSILON ? powFb : (fb * LAB_L - HEX) / LAB_KAPPA
  ];
  const [x, y, z] = xyz.map((val, i) => val * D50[i]);
  return ['xyz-d50',
    parseFloat(x.toPrecision(6)),
    parseFloat(y.toPrecision(6)),
    parseFloat(z.toPrecision(6)),
    aa
  ];
};

/**
 + parse lch()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|string}
 *   - ['xyz-d50', x, y, z, aa] | ['lch', l, c, h, aa] | '<empty string>'
 */
export const parseLch = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { format } = opt;
  if (!REG_LCH.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  const COEF_PCT = 1.5;
  const [, val] = value.match(REG_LCH);
  let [l, c, h, aa] = val.replace('/', ' ').split(/\s+/);
  if (l === NONE) {
    if (!REG_SPEC.test(format)) {
      l = 0;
    }
  } else {
    if (l.startsWith('.')) {
      l = `0${l}`;
    }
    l = parseFloat(l);
    if (l < 0) {
      l = 0;
    }
  }
  if (c === NONE) {
    if (!REG_SPEC.test(format)) {
      c = 0;
    }
  } else {
    if (c.startsWith('.')) {
      c = `0${c}`;
    }
    if (c.endsWith('%')) {
      c = parseFloat(c) * COEF_PCT;
    } else {
      c = parseFloat(c);
    }
  }
  if (h === NONE) {
    if (!REG_SPEC.test(format)) {
      h = 0;
    }
  } else {
    h = angleToDeg(h);
  }
  if (aa !== NONE || !REG_SPEC.test(format)) {
    aa = parseAlpha(aa);
  }
  if (REG_SPEC.test(format)) {
    return [
      'lch',
      l === NONE ? l : parseFloat(l.toPrecision(6)),
      c === NONE ? c : parseFloat(c.toPrecision(6)),
      h === NONE ? h : parseFloat(h.toPrecision(6)),
      aa
    ];
  }
  const a = c * Math.cos(h * Math.PI / (DEG * HALF));
  const b = c * Math.sin(h * Math.PI / (DEG * HALF));
  const [, x, y, z] = parseLab(`lab(${l} ${a} ${b})`);
  return [
    'xyz-d50',
    parseFloat(x.toPrecision(6)),
    parseFloat(y.toPrecision(6)),
    parseFloat(z.toPrecision(6)),
    aa
  ];
};

/**
 * parse oklab()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|string}
 *   - ['xyz-d65', x, y, z, aa] | ['oklab', l, a, b, aa] | '<empty string>'
 */
export const parseOklab = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { format } = opt;
  if (!REG_OKLAB.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  const COEF_PCT = 0.4;
  const [, val] = value.match(REG_OKLAB);
  let [l, a, b, aa] = val.replace('/', ' ').split(/\s+/);
  if (l === NONE) {
    if (!REG_SPEC.test(format)) {
      l = 0;
    }
  } else {
    if (l.startsWith('.')) {
      l = `0${l}`;
    }
    if (l.endsWith('%')) {
      l = parseFloat(l) / MAX_PCT;
    } else {
      l = parseFloat(l);
    }
    if (l < 0) {
      l = 0;
    }
  }
  if (a === NONE) {
    if (!REG_SPEC.test(format)) {
      a = 0;
    }
  } else {
    if (a.startsWith('.')) {
      a = `0${a}`;
    }
    if (a.endsWith('%')) {
      a = parseFloat(a) * COEF_PCT / MAX_PCT;
    } else {
      a = parseFloat(a);
    }
  }
  if (b === NONE) {
    if (!REG_SPEC.test(format)) {
      b = 0;
    }
  } else {
    if (b.endsWith('%')) {
      b = parseFloat(b) * COEF_PCT / MAX_PCT;
    } else {
      b = parseFloat(b);
    }
  }
  if (aa !== NONE || !REG_SPEC.test(format)) {
    aa = parseAlpha(aa);
  }
  if (REG_SPEC.test(format)) {
    return [
      'oklab',
      l === NONE ? l : parseFloat(l.toPrecision(6)),
      a === NONE ? a : parseFloat(a.toPrecision(6)),
      b === NONE ? b : parseFloat(b.toPrecision(6)),
      aa
    ];
  }
  const lms = transformMatrix(MATRIX_OKLAB_TO_LMS, [l, a, b]);
  const xyzLms = lms.map(c => Math.pow(c, POW_CUBE));
  const [x, y, z] = transformMatrix(MATRIX_LMS_TO_XYZ, xyzLms, true);
  return [
    'xyz-d65',
    parseFloat(x.toPrecision(6)),
    parseFloat(y.toPrecision(6)),
    parseFloat(z.toPrecision(6)),
    aa
  ];
};

/**
 * parse oklch()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|string}
 *   - ['xyz-d65', x, y, z, aa] | ['oklch', l, c, h, aa] | <empty-string>
 */
export const parseOklch = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { format } = opt;
  if (!REG_OKLCH.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  const COEF_PCT = 0.4;
  const [, val] = value.match(REG_OKLCH);
  let [l, c, h, aa] = val.replace('/', ' ').split(/\s+/);
  if (l === NONE) {
    if (!REG_SPEC.test(format)) {
      l = 0;
    }
  } else {
    if (l.startsWith('.')) {
      l = `0${l}`;
    }
    if (l.endsWith('%')) {
      l = parseFloat(l) / MAX_PCT;
    } else {
      l = parseFloat(l);
    }
    if (l < 0) {
      l = 0;
    }
  }
  if (c === NONE) {
    if (!REG_SPEC.test(format)) {
      c = 0;
    }
  } else {
    if (c.startsWith('.')) {
      c = `0${c}`;
    }
    if (c.endsWith('%')) {
      c = parseFloat(c) * COEF_PCT / MAX_PCT;
    } else {
      c = parseFloat(c);
    }
    if (c < 0) {
      c = 0;
    }
  }
  if (h === NONE) {
    if (!REG_SPEC.test(format)) {
      h = 0;
    }
  } else {
    h = angleToDeg(h);
  }
  if (aa !== NONE || !REG_SPEC.test(format)) {
    aa = parseAlpha(aa);
  }
  if (REG_SPEC.test(format)) {
    return [
      'oklch',
      l === NONE ? l : parseFloat(l.toPrecision(6)),
      c === NONE ? c : parseFloat(c.toPrecision(6)),
      h === NONE ? h : parseFloat(h.toPrecision(6)),
      aa
    ];
  }
  const a = c * Math.cos(h * Math.PI / (DEG * HALF));
  const b = c * Math.sin(h * Math.PI / (DEG * HALF));
  const lms = transformMatrix(MATRIX_OKLAB_TO_LMS, [l, a, b]);
  const xyzLms = lms.map(cl => Math.pow(cl, POW_CUBE));
  const [x, y, z] = transformMatrix(MATRIX_LMS_TO_XYZ, xyzLms, true);
  return [
    'xyz-d65',
    parseFloat(x.toPrecision(6)),
    parseFloat(y.toPrecision(6)),
    parseFloat(z.toPrecision(6)),
    aa
  ];
};

/**
 * parse color()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {boolean} [opt.d50] - xyz in d50 white point
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|string}
 *   - ['xyz-d50'|'xyz-d65', x, y, z, a] | [cs, r, g, b, a] | '<empty string>'
 */
export const parseColorFunc = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { d50, format } = opt;
  if (!REG_COLOR_FUNC.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  const [, val] = value.match(REG_COLOR_FUNC);
  let [cs, v1, v2, v3, v4] = val.replace('/', ' ').split(/\s+/);
  let r, g, b, a;
  if (v1 === NONE) {
    if (REG_SPEC.test(format)) {
      r = v1;
    } else {
      r = 0;
    }
  } else {
    if (v1.startsWith('.')) {
      v1 = `0${v1}`;
    }
    r = v1.endsWith('%') ? parseFloat(v1) / MAX_PCT : parseFloat(v1);
  }
  if (v2 === NONE) {
    if (REG_SPEC.test(format)) {
      g = v2;
    } else {
      g = 0;
    }
  } else {
    if (v2.startsWith('.')) {
      v2 = `0${v2}`;
    }
    g = v2.endsWith('%') ? parseFloat(v2) / MAX_PCT : parseFloat(v2);
  }
  if (v3 === NONE) {
    if (REG_SPEC.test(format)) {
      b = v3;
    } else {
      b = 0;
    }
  } else {
    if (v3.startsWith('.')) {
      v3 = `0${v3}`;
    }
    b = v3.endsWith('%') ? parseFloat(v3) / MAX_PCT : parseFloat(v3);
  }
  if (v4 === NONE && REG_SPEC.test(format)) {
    a = v4;
  } else {
    a = parseAlpha(v4);
  }
  if (REG_SPEC.test(format)) {
    if (cs === 'xyz') {
      cs = 'xyz-d65';
    }
    return [
      cs,
      r === NONE ? r : parseFloat(r.toPrecision(6)),
      g === NONE ? g : parseFloat(g.toPrecision(6)),
      b === NONE ? b : parseFloat(b.toPrecision(6)),
      a
    ];
  }
  let x, y, z;
  // srgb
  if (cs === 'srgb') {
    [x, y, z] = convertRgbToXyz([r * MAX_RGB, g * MAX_RGB, b * MAX_RGB]);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
  // srgb-linear
  } else if (cs === 'srgb-linear') {
    [x, y, z] = transformMatrix(MATRIX_L_RGB_TO_XYZ, [r, g, b]);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
  // display-p3
  } else if (cs === 'display-p3') {
    const linearRgb = convertRgbToLinearRgb([
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
    });
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
    });
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
    });
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
  }
  return [
    d50 ? 'xyz-d50' : 'xyz-d65',
    parseFloat(x.toPrecision(6)),
    parseFloat(y.toPrecision(6)),
    parseFloat(z.toPrecision(6)),
    a
  ];
};

/**
 * parse color value
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {boolean} [opt.d50] - xyz in d50 white point
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|string}
 *   - ['xyz-d50'|'xyz-d65', x, y, z, a] | ['rgb', r, g, b, a] | 'value?'
 */
export const parseColorValue = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { d50, format } = opt;
  // unknown color and/or invalid color
  if (!REG_COLOR.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  let x, y, z, a;
  // complement currentcolor as a missing color
  if (REG_CURRENT_COLOR.test(value)) {
    if (format === 'spec') {
      return ['rgb', 0, 0, 0, 0];
    }
    if (format === 'specifiedValue') {
      return value;
    }
    x = 0;
    y = 0;
    z = 0;
    a = 0;
  // named-color
  } else if (/^[a-z]+$/.test(value)) {
    if (Object.prototype.hasOwnProperty.call(NAMED_COLORS, value)) {
      if (format === 'specifiedValue') {
        return value;
      }
      const [r, g, b] = NAMED_COLORS[value];
      a = 1;
      if (format === 'spec') {
        return ['rgb', r, g, b, a];
      }
      [x, y, z] = convertRgbToXyz([r, g, b], true);
      if (d50) {
        [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
      }
    } else {
      if (format === 'spec') {
        return ['rgb', 0, 0, 0, 0];
      }
      if (format === 'specifiedValue') {
        if (value === 'transparent') {
          return value;
        }
        return '';
      }
      x = 0;
      y = 0;
      z = 0;
      a = 0;
    }
  // hex-color
  } else if (value.startsWith('#')) {
    if (REG_SPEC.test(format)) {
      const [r, g, b, aa] = convertHexToRgb(value);
      return ['rgb', r, g, b, aa];
    }
    [x, y, z, a] = convertHexToXyz(value);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
  // lab()
  } else if (value.startsWith('lab')) {
    if (REG_SPEC.test(format)) {
      return parseLab(value, {
        format
      });
    }
    [, x, y, z, a] = parseLab(value);
    if (!d50) {
      [x, y, z] = transformMatrix(MATRIX_D50_TO_D65, [x, y, z], true);
    }
  // lch()
  } else if (value.startsWith('lch')) {
    if (REG_SPEC.test(format)) {
      return parseLch(value, {
        format
      });
    }
    [, x, y, z, a] = parseLch(value);
    if (!d50) {
      [x, y, z] = transformMatrix(MATRIX_D50_TO_D65, [x, y, z], true);
    }
  // oklab()
  } else if (value.startsWith('oklab')) {
    if (REG_SPEC.test(format)) {
      return parseOklab(value, {
        format
      });
    }
    [, x, y, z, a] = parseOklab(value);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
  // oklch()
  } else if (value.startsWith('oklch')) {
    if (REG_SPEC.test(format)) {
      return parseOklch(value, {
        format
      });
    }
    [, x, y, z, a] = parseOklch(value);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
  } else {
    let r, g, b;
    // hsl()
    if (value.startsWith('hsl')) {
      [, r, g, b, a] = parseHsl(value);
    // hwb()
    } else if (value.startsWith('hwb')) {
      [, r, g, b, a] = parseHwb(value);
    // rgb()
    } else {
      [, r, g, b, a] = parseRgb(value);
    }
    if (REG_SPEC.test(format)) {
      return [
        'rgb',
        Math.round(r),
        Math.round(g),
        Math.round(b),
        a
      ];
    }
    [x, y, z] = convertRgbToXyz([r, g, b]);
    if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
  }
  return [
    d50 ? 'xyz-d50' : 'xyz-d65',
    parseFloat(x.toPrecision(6)),
    parseFloat(y.toPrecision(6)),
    parseFloat(z.toPrecision(6)),
    a
  ];
};

/**
 * resolve color value
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|string} - [cs, v1, v2, v3, a] | 'value?'
 */
export const resolveColorValue = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { format } = opt;
  // unknown color and/or invalid color
  if (!REG_COLOR.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  let cs, r, g, b, a;
  // complement currentcolor as a missing color
  if (REG_CURRENT_COLOR.test(value)) {
    if (format === 'specifiedValue') {
      return value;
    }
    r = 0;
    g = 0;
    b = 0;
    a = 0;
  // named-color
  } else if (/^[a-z]+$/.test(value)) {
    if (Object.prototype.hasOwnProperty.call(NAMED_COLORS, value)) {
      if (format === 'specifiedValue') {
        return value;
      }
      [r, g, b] = NAMED_COLORS[value];
      a = 1;
    } else {
      if (format === 'specifiedValue') {
        if (value === 'transparent') {
          return value;
        }
        return '';
      }
      r = 0;
      g = 0;
      b = 0;
      a = 0;
    }
  // hex-color
  } else if (value.startsWith('#')) {
    [r, g, b, a] = convertHexToRgb(value);
  // lab(), lch()
  } else if (/^l(?:ab|ch)/.test(value)) {
    let x, y, z;
    if (value.startsWith('lab')) {
      [cs, x, y, z, a] = parseLab(value, {
        format
      });
    } else {
      [cs, x, y, z, a] = parseLch(value, {
        format
      });
    }
    if (REG_SPEC.test(format)) {
      return [cs, x, y, z, a];
    }
    [r, g, b, a] = convertXyzD50ToRgb([x, y, z, a]);
  // oklab(), oklch()
  } else if (/^okl(?:ab|ch)/.test(value)) {
    let x, y, z;
    if (value.startsWith('oklab')) {
      [cs, x, y, z, a] = parseOklab(value, {
        format
      });
    } else {
      [cs, x, y, z, a] = parseOklch(value, {
        format
      });
    }
    if (REG_SPEC.test(format)) {
      return [cs, x, y, z, a];
    }
    [r, g, b, a] = convertXyzToRgb([x, y, z, a]);
  // rgb()
  } else if (value.startsWith('rgb')) {
    [, r, g, b, a] = parseRgb(value);
  // hsl()
  } else if (value.startsWith('hsl')) {
    [, r, g, b, a] = parseHsl(value);
  // hwb()
  } else if (value.startsWith('hwb')) {
    [, r, g, b, a] = parseHwb(value);
  }
  return [
    'rgb',
    Math.round(r),
    Math.round(g),
    Math.round(b),
    a
  ];
};

/**
 * resolve color()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|string}
 *   - [cs, v1, v2, v3, a] | '<empty string>'
 */
export const resolveColorFunc = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { format } = opt;
  if (!REG_COLOR_FUNC.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  const [cs, x, y, z, a] = parseColorFunc(value, opt);
  if (REG_SPEC.test(format)) {
    return [cs, x, y, z, a];
  }
  const [r, g, b] = convertXyzToRgb([x, y, z], true);
  return ['rgb', r, g, b, a];
};

/**
 * convert color value to linear rgb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @returns {Array.<number>} - [r, g, b, a] r|g|b|a: 0..1
 */
export const convertColorToLinearRgb = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  let r, g, b, a, x, y, z;
  if (value.startsWith('color(')) {
    const [, val] = value.match(REG_COLOR_FUNC);
    const [cs] = val.replace('/', ' ').split(/\s+/);
    if (cs === 'srgb-linear') {
      [, r, g, b, a] = resolveColorFunc(value, {
        format: 'spec'
      });
    } else {
      [, x, y, z, a] = parseColorFunc(value);
      [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
    }
  } else {
    [, x, y, z, a] = parseColorValue(value);
    [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
  }
  return [
    Math.min(Math.max(r, 0), 1),
    Math.min(Math.max(g, 0), 1),
    Math.min(Math.max(b, 0), 1),
    a
  ];
};

/**
 * convert color value to rgb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @returns {Array.<number>} - [r, g, b, a] r|g|b: 0..255 a: 0..1
 */
export const convertColorToRgb = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  let r, g, b, a;
  if (value.startsWith('color(')) {
    const [, val] = value.match(REG_COLOR_FUNC);
    const [cs] = val.replace('/', ' ').split(/\s+/);
    if (cs === 'srgb') {
      [, r, g, b, a] = resolveColorFunc(value, {
        format: 'spec'
      });
      r *= MAX_RGB;
      g *= MAX_RGB;
      b *= MAX_RGB;
    } else {
      [, r, g, b, a] = resolveColorFunc(value);
    }
  } else if (/^(?:ok)?l(?:ab|ch)/.test(value)) {
    [r, g, b, a] = convertColorToLinearRgb(value);
    [r, g, b] = convertLinearRgbToRgb([r, g, b]);
  } else {
    [, r, g, b, a] = resolveColorValue(value, {
      format: 'spec'
    });
  }
  return [r, g, b, a];
};

/**
 * convert color value to xyz
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {boolean} [opt.d50] - xyz in d50 white point
 * @returns {Array.<number>} - [x, y, z, a] x|y|z|a: 0..1
 */
export const convertColorToXyz = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { d50 } = opt;
  let x, y, z, a;
  if (value.startsWith('color(')) {
    const [, val] = value.match(REG_COLOR_FUNC);
    const [cs] = val.replace('/', ' ').split(/\s+/);
    if (d50) {
      if (cs === 'xyz-d50') {
        [, x, y, z, a] = resolveColorFunc(value, {
          format: 'spec'
        });
      } else {
        [, x, y, z, a] = parseColorFunc(value, {
          d50
        });
      }
    } else if (/^xyz(?:-d65)?$/.test(cs)) {
      [, x, y, z, a] = resolveColorFunc(value, {
        format: 'spec'
      });
    } else {
      [, x, y, z, a] = parseColorFunc(value);
    }
  } else {
    [, x, y, z, a] = parseColorValue(value, {
      d50
    });
  }
  return [x, y, z, a];
};

/**
 * convert color value to hsl
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @returns {Array.<number>} - [h, s, l, a]
 */
export const convertColorToHsl = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  let h, s, l, a, x, y, z;
  if (REG_HSL.test(value)) {
    [, h, s, l, a] = parseHsl(value, {
      format: 'hsl'
    });
    return [h, s, l, a];
  } else if (value.startsWith('color(')) {
    [, x, y, z, a] = parseColorFunc(value);
  } else {
    [, x, y, z, a] = parseColorValue(value);
  }
  [h, s, l] = convertXyzToHsl([x, y, z], true);
  return [h, s, l, a];
};

/**
 * convert color value to hwb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @returns {Array.<number>} - [h, w, b, a]
 */
export const convertColorToHwb = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  let h, w, b, a, x, y, z;
  if (REG_HWB.test(value)) {
    [, h, w, b, a] = parseHwb(value, {
      format: 'hwb'
    });
    return [h, w, b, a];
  } else if (value.startsWith('color(')) {
    [, x, y, z, a] = parseColorFunc(value);
  } else {
    [, x, y, z, a] = parseColorValue(value);
  }
  [h, w, b] = convertXyzToHwb([x, y, z], true);
  return [h, w, b, a];
};

/**
 * convert color value to lab
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @returns {Array.<number>} - [l, a, b, aa]
 */
export const convertColorToLab = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  let l, a, b, aa, x, y, z;
  if (REG_LAB.test(value)) {
    [, l, a, b, aa] = parseLab(value, {
      format: 'spec'
    });
    return [l, a, b, aa];
  } else if (value.startsWith('color(')) {
    [, x, y, z, aa] = parseColorFunc(value, {
      d50: true
    });
  } else {
    [, x, y, z, aa] = parseColorValue(value, {
      d50: true
    });
  }
  [l, a, b] = convertXyzD50ToLab([x, y, z], true);
  return [l, a, b, aa];
};

/**
 * convert color value to lch
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @returns {Array.<number>} - [l, c, h, aa]
 */
export const convertColorToLch = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  let l, c, h, aa, x, y, z;
  if (REG_LCH.test(value)) {
    [, l, c, h, aa] = parseLch(value, {
      format: 'spec'
    });
    return [l, c, h, aa];
  } else if (value.startsWith('color(')) {
    [, x, y, z, aa] = parseColorFunc(value, {
      d50: true
    });
  } else {
    [, x, y, z, aa] = parseColorValue(value, {
      d50: true
    });
  }
  [l, c, h] = convertXyzD50ToLch([x, y, z], true);
  return [l, c, h, aa];
};

/**
 * convert color value to oklab
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @returns {Array.<number>} - [l, a, b, aa]
 */
export const convertColorToOklab = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  let l, a, b, aa, x, y, z;
  if (REG_OKLAB.test(value)) {
    [, l, a, b, aa] = parseOklab(value, {
      format: 'spec'
    });
    return [l, a, b, aa];
  } else if (value.startsWith('color(')) {
    [, x, y, z, aa] = parseColorFunc(value);
  } else {
    [, x, y, z, aa] = parseColorValue(value);
  }
  [l, a, b] = convertXyzToOklab([x, y, z], true);
  return [l, a, b, aa];
};

/**
 * convert color value to oklch
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @returns {Array.<number>} - [l, c, h, aa]
 */
export const convertColorToOklch = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  let l, c, h, aa, x, y, z;
  if (REG_OKLCH.test(value)) {
    [, l, c, h, aa] = parseOklch(value, {
      format: 'spec'
    });
    return [l, c, h, aa];
  } else if (value.startsWith('color(')) {
    [, x, y, z, aa] = parseColorFunc(value);
  } else {
    [, x, y, z, aa] = parseColorValue(value);
  }
  [l, c, h] = convertXyzToOklch([x, y, z], true);
  return [l, c, h, aa];
};

/**
 * resolve color-mix()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] format - output format
 * @returns {Array.<string|number>|string} - [cs, v1, v2, v3, a] | 'value?'
 */
export const resolveColorMix = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`Expected String but got ${getType(value)}.`);
  }
  const { format } = opt;
  if (!REG_COLOR_MIX.test(value)) {
    if (format === 'specifiedValue') {
      return '';
    } else {
      return ['rgb', 0, 0, 0, 0];
    }
  }
  const CC_LCH = 'lch(none none none / none)';
  const CC_RGB = 'rgb(none none none / none)';
  const regColorPart =
    new RegExp(`^(${SYN_COLOR_TYPE})(?:\\s+(${SYN_PCT}))?$`);
  const [, colorSpace, colorPartA, colorPartB] = value.match(REG_COLOR_MIX);
  const [, colorA, pctA] = colorPartA.match(regColorPart);
  const [, colorB, pctB] = colorPartB.match(regColorPart);
  // normalize percentages and set multipler
  let pA, pB, m;
  if (pctA && pctB) {
    const p1 = parseFloat(pctA) / MAX_PCT;
    const p2 = parseFloat(pctB) / MAX_PCT;
    if (p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1) {
      if (format === 'specifiedValue') {
        return '';
      } else {
        return ['rgb', 0, 0, 0, 0];
      }
    }
    const factor = p1 + p2;
    if (factor === 0) {
      if (format === 'specifiedValue') {
        return '';
      } else {
        return ['rgb', 0, 0, 0, 0];
      }
    }
    pA = p1 / factor;
    pB = p2 / factor;
    m = factor < 1 ? factor : 1;
  } else {
    if (pctA) {
      pA = parseFloat(pctA) / MAX_PCT;
      if (pA < 0 || pA > 1) {
        if (format === 'specifiedValue') {
          return '';
        } else {
          return ['rgb', 0, 0, 0, 0];
        }
      }
      pB = 1 - pA;
    } else if (pctB) {
      pB = parseFloat(pctB) / MAX_PCT;
      if (pB < 0 || pB > 1) {
        if (format === 'specifiedValue') {
          return '';
        } else {
          return ['rgb', 0, 0, 0, 0];
        }
      }
      pA = 1 - pB;
    } else {
      pA = HALF;
      pB = HALF;
    }
    m = 1;
  }
  if (format === 'specifiedValue') {
    let valueA, valueB;
    if (colorA.startsWith('color(')) {
      valueA = parseColorFunc(colorA, {
        format
      });
      if (Array.isArray(valueA)) {
        const [v1, v2, v3, v4, v5] = [...valueA];
        if (v5 === 1) {
          valueA = `color(${v1} ${v2} ${v3} ${v4})`;
        } else {
          valueA = `color(${v1} ${v2} ${v3} ${v4} / ${v5})`;
        }
      }
    } else {
      valueA = parseColorValue(colorA, {
        format
      });
      if (Array.isArray(valueA)) {
        const [v1, v2, v3, v4, v5] = [...valueA];
        if (v5 === 1) {
          if (v1 === 'rgb') {
            valueA = `${v1}(${v2}, ${v3}, ${v4})`;
          } else {
            valueA = `${v1}(${v2} ${v3} ${v4})`;
          }
        } else if (v1 === 'rgb') {
          valueA = `${v1}a(${v2}, ${v3}, ${v4}, ${v5})`;
        } else {
          valueA = `${v1}(${v2} ${v3} ${v4} / ${v5})`;
        }
      }
    }
    if (colorB.startsWith('color(')) {
      valueB = parseColorFunc(colorB, {
        format
      });
      if (Array.isArray(valueB)) {
        const [v1, v2, v3, v4, v5] = [...valueB];
        if (v5 === 1) {
          valueB = `color(${v1} ${v2} ${v3} ${v4})`;
        } else {
          valueB = `color(${v1} ${v2} ${v3} ${v4} / ${v5})`;
        }
      }
    } else {
      valueB = parseColorValue(colorB, {
        format
      });
      if (Array.isArray(valueB)) {
        const [v1, v2, v3, v4, v5] = [...valueB];
        if (v5 === 1) {
          if (v1 === 'rgb') {
            valueB = `${v1}(${v2}, ${v3}, ${v4})`;
          } else {
            valueB = `${v1}(${v2} ${v3} ${v4})`;
          }
        } else if (v1 === 'rgb') {
          valueB = `${v1}a(${v2}, ${v3}, ${v4}, ${v5})`;
        } else {
          valueB = `${v1}(${v2} ${v3} ${v4} / ${v5})`;
        }
      }
    }
    if (pctA && pctB) {
      valueA += ` ${parseFloat(pctA)}%`;
      valueB += ` ${parseFloat(pctB)}%`;
    } else if (pctA) {
      const pA = parseFloat(pctA);
      if (pA !== MAX_PCT * HALF) {
        valueA += ` ${pA}%`;
      }
    } else if (pctB) {
      const pA = MAX_PCT - parseFloat(pctB);
      if (pA !== MAX_PCT * HALF) {
        valueA += ` ${pA}%`;
      }
    }
    return `color-mix(in ${colorSpace}, ${valueA}, ${valueB})`;
  }
  let r, g, b, a;
  // in srgb
  if (colorSpace === 'srgb') {
    let rgbA = convertColorToRgb(colorA);
    let rgbB = convertColorToRgb(colorB);
    if (REG_CURRENT_COLOR.test(colorA)) {
      rgbA = reInsertMissingColorComponents(CC_RGB, rgbA);
    } else if (colorA.includes(NONE)) {
      rgbA = reInsertMissingColorComponents(colorA, rgbA);
    }
    if (REG_CURRENT_COLOR.test(colorB)) {
      rgbB = reInsertMissingColorComponents(CC_RGB, rgbB);
    } else if (colorB.includes(NONE)) {
      rgbB = reInsertMissingColorComponents(colorB, rgbB);
    }
    const [
      [rA, gA, bA, aA],
      [rB, gB, bB, aB]
    ] = normalizeColorComponents(rgbA, rgbB, true);
    const factorA = aA * pA;
    const factorB = aB * pB;
    a = (factorA + factorB);
    if (a === 0) {
      r = rA * pA + rB * pB;
      g = gA * pA + gB * pB;
      b = bA * pA + bB * pB;
    } else {
      r = (rA * factorA + rB * factorB) / a;
      g = (gA * factorA + gB * factorB) / a;
      b = (bA * factorA + bB * factorB) / a;
      a = parseFloat(a.toFixed(3));
    }
    if (format === 'spec') {
      return [
        colorSpace,
        parseFloat((r / MAX_RGB).toPrecision(6)),
        parseFloat((g / MAX_RGB).toPrecision(6)),
        parseFloat((b / MAX_RGB).toPrecision(6)),
        a
      ];
    }
  // in srgb-linear
  } else if (colorSpace === 'srgb-linear') {
    let rgbA = convertColorToLinearRgb(colorA);
    let rgbB = convertColorToLinearRgb(colorB);
    if (REG_CURRENT_COLOR.test(colorA)) {
      rgbA = reInsertMissingColorComponents(CC_RGB, rgbA);
    } else if (colorA.includes(NONE)) {
      rgbA = reInsertMissingColorComponents(colorA, rgbA);
    }
    if (REG_CURRENT_COLOR.test(colorB)) {
      rgbB = reInsertMissingColorComponents(CC_RGB, rgbB);
    } else if (colorB.includes(NONE)) {
      rgbB = reInsertMissingColorComponents(colorB, rgbB);
    }
    const [
      [rA, gA, bA, aA],
      [rB, gB, bB, aB]
    ] = normalizeColorComponents(rgbA, rgbB, true);
    const factorA = aA * pA;
    const factorB = aB * pB;
    a = (factorA + factorB);
    if (a === 0) {
      r = (rA * pA + rB * pB);
      g = (gA * pA + gB * pB);
      b = (bA * pA + bB * pB);
    } else {
      r = (rA * factorA + rB * factorB) / a;
      g = (gA * factorA + gB * factorB) / a;
      b = (bA * factorA + bB * factorB) / a;
      a = parseFloat(a.toFixed(3));
    }
    if (format === 'spec') {
      return [
        colorSpace,
        parseFloat(r.toPrecision(6)),
        parseFloat(g.toPrecision(6)),
        parseFloat(b.toPrecision(6)),
        a
      ];
    }
    r *= MAX_RGB;
    g *= MAX_RGB;
    b *= MAX_RGB;
  // in xyz, xyz-d65
  } else if (/^xyz(?:-d65)?$/.test(colorSpace)) {
    let xyzA = convertColorToXyz(colorA);
    let xyzB = convertColorToXyz(colorB);
    if (REG_CURRENT_COLOR.test(colorA)) {
      xyzA = reInsertMissingColorComponents(CC_RGB, xyzA);
    } else if (colorA.includes(NONE)) {
      xyzA = reInsertMissingColorComponents(colorA, xyzA);
    }
    if (REG_CURRENT_COLOR.test(colorB)) {
      xyzB = reInsertMissingColorComponents(CC_RGB, xyzB);
    } else if (colorB.includes(NONE)) {
      xyzB = reInsertMissingColorComponents(colorB, xyzB);
    }
    const [
      [xA, yA, zA, aA],
      [xB, yB, zB, aB]
    ] = normalizeColorComponents(xyzA, xyzB, true);
    const factorA = aA * pA;
    const factorB = aB * pB;
    a = (factorA + factorB);
    let x, y, z;
    if (a === 0) {
      x = xA * pA + xB * pB;
      y = yA * pA + yB * pB;
      z = zA * pA + zB * pB;
    } else {
      x = (xA * factorA + xB * factorB) / a;
      y = (yA * factorA + yB * factorB) / a;
      z = (zA * factorA + zB * factorB) / a;
      a = parseFloat(a.toFixed(3));
    }
    if (format === 'spec') {
      return [
        'xyz-d65',
        parseFloat(x.toPrecision(6)),
        parseFloat(y.toPrecision(6)),
        parseFloat(z.toPrecision(6)),
        a
      ];
    }
    [r, g, b] = convertXyzToRgb([x, y, z], true);
  // in xyz-d50
  } else if (colorSpace === 'xyz-d50') {
    let xyzA = convertColorToXyz(colorA, {
      d50: true
    });
    let xyzB = convertColorToXyz(colorB, {
      d50: true
    });
    if (REG_CURRENT_COLOR.test(colorA)) {
      xyzA = reInsertMissingColorComponents(CC_RGB, xyzA);
    } else if (colorA.includes(NONE)) {
      xyzA = reInsertMissingColorComponents(colorA, xyzA);
    }
    if (REG_CURRENT_COLOR.test(colorB)) {
      xyzB = reInsertMissingColorComponents(CC_RGB, xyzB);
    } else if (colorB.includes(NONE)) {
      xyzB = reInsertMissingColorComponents(colorB, xyzB);
    }
    const [
      [xA, yA, zA, aA],
      [xB, yB, zB, aB]
    ] = normalizeColorComponents(xyzA, xyzB, true);
    const factorA = aA * pA;
    const factorB = aB * pB;
    a = (factorA + factorB);
    let x, y, z;
    if (a === 0) {
      x = xA * pA + xB * pB;
      y = yA * pA + yB * pB;
      z = zA * pA + zB * pB;
    } else {
      x = (xA * factorA + xB * factorB) / a;
      y = (yA * factorA + yB * factorB) / a;
      z = (zA * factorA + zB * factorB) / a;
      a = parseFloat(a.toFixed(3));
    }
    if (format === 'spec') {
      return [
        colorSpace,
        parseFloat(x.toPrecision(6)),
        parseFloat(y.toPrecision(6)),
        parseFloat(z.toPrecision(6)),
        a
      ];
    }
    [r, g, b] = convertXyzD50ToRgb([x, y, z, a], true);
  // in hsl
  } else if (colorSpace === 'hsl') {
    let [hA, sA, lA, aA] = convertColorToHsl(colorA);
    let [hB, sB, lB, aB] = convertColorToHsl(colorB);
    if (REG_CURRENT_COLOR.test(colorA)) {
      [lA, sA, hA, aA] =
        reInsertMissingColorComponents(CC_LCH, [lA, sA, hA, aA]);
    } else if (colorA.includes(NONE)) {
      [lA, sA, hA, aA] =
        reInsertMissingColorComponents(colorA, [lA, sA, hA, aA]);
    }
    if (REG_CURRENT_COLOR.test(colorB)) {
      [lB, sB, hB, aB] =
        reInsertMissingColorComponents(CC_LCH, [lB, sB, hB, aB]);
    } else if (colorB.includes(NONE)) {
      [lB, sB, hB, aB] =
        reInsertMissingColorComponents(colorB, [lB, sB, hB, aB]);
    }
    [
      [hA, sA, lA, aA],
      [hB, sB, lB, aB]
    ] = normalizeColorComponents([hA, sA, lA, aA], [hB, sB, lB, aB], true);
    const factorA = aA * pA;
    const factorB = aB * pB;
    a = (factorA + factorB);
    const h = (hA * pA + hB * pB) % DEG;
    let s, l;
    if (a === 0) {
      s = sA * pA + sB * pB;
      l = lA * pA + lB * pB;
    } else {
      s = (sA * factorA + sB * factorB) / a;
      l = (lA * factorA + lB * factorB) / a;
      a = parseFloat(a.toFixed(3));
    }
    [r, g, b] = convertColorToRgb(`hsl(${h} ${s}% ${l}%)`);
    if (format === 'spec') {
      return [
        'srgb',
        parseFloat((r / MAX_RGB).toPrecision(6)),
        parseFloat((g / MAX_RGB).toPrecision(6)),
        parseFloat((b / MAX_RGB).toPrecision(6)),
        a
      ];
    }
  // in hwb
  } else if (colorSpace === 'hwb') {
    let [hA, wA, bA, aA] = convertColorToHwb(colorA);
    let [hB, wB, bB, aB] = convertColorToHwb(colorB);
    if (REG_CURRENT_COLOR.test(colorA)) {
      [,, hA, aA] =
        reInsertMissingColorComponents(CC_LCH, [null, null, hA, aA]);
    } else if (colorA.includes(NONE)) {
      [,, hA, aA] =
        reInsertMissingColorComponents(colorA, [null, null, hA, aA]);
    }
    if (REG_CURRENT_COLOR.test(colorB)) {
      [,, hB, aB] =
        reInsertMissingColorComponents(CC_LCH, [null, null, hB, aB]);
    } else if (colorB.includes(NONE)) {
      [,, hB, aB] =
        reInsertMissingColorComponents(colorB, [null, null, hB, aB]);
    }
    [
      [hA, wA, bA, aA],
      [hB, wB, bB, aB]
    ] = normalizeColorComponents([hA, wA, bA, aA], [hB, wB, bB, aB], true);
    const factorA = aA * pA;
    const factorB = aB * pB;
    a = (factorA + factorB);
    const h = (hA * pA + hB * pB) % DEG;
    let w, bk;
    if (a === 0) {
      w = wA * pA + wB * pB;
      bk = bA * pA + bB * pB;
    } else {
      w = (wA * factorA + wB * factorB) / a;
      bk = (bA * factorA + bB * factorB) / a;
      a = parseFloat(a.toFixed(3));
    }
    [r, g, b] = convertColorToRgb(`hwb(${h} ${w}% ${bk}%)`);
    if (format === 'spec') {
      return [
        'srgb',
        parseFloat((r / MAX_RGB).toPrecision(6)),
        parseFloat((g / MAX_RGB).toPrecision(6)),
        parseFloat((b / MAX_RGB).toPrecision(6)),
        a
      ];
    }
  // in lab
  } else if (colorSpace === 'lab') {
    let [lA, aA, bA, aaA] = convertColorToLab(colorA);
    let [lB, aB, bB, aaB] = convertColorToLab(colorB);
    if (REG_CURRENT_COLOR.test(colorA)) {
      [lA,,, aaA] =
        reInsertMissingColorComponents(CC_LCH, [lA, null, null, aaA]);
    } else if (colorA.includes(NONE)) {
      [lA,,, aaA] =
        reInsertMissingColorComponents(colorA, [lA, null, null, aaA]);
    }
    if (REG_CURRENT_COLOR.test(colorB)) {
      [lB,,, aaB] =
        reInsertMissingColorComponents(CC_LCH, [lB, null, null, aaB]);
    } else if (colorB.includes(NONE)) {
      [lB,,, aaB] =
        reInsertMissingColorComponents(colorB, [lB, null, null, aaB]);
    }
    [
      [lA, aA, bA, aaA],
      [lB, aB, bB, aaB]
    ] = normalizeColorComponents([lA, aA, bA, aaA], [lB, aB, bB, aaB], true);
    const factorA = aaA * pA;
    const factorB = aaB * pB;
    a = (factorA + factorB);
    let l, aX, bY;
    if (a === 0) {
      l = lA * pA + lB * pB;
      aX = aA * pA + aB * pB;
      bY = bA * pA + bB * pB;
    } else {
      l = (lA * factorA + lB * factorB) / a;
      aX = (aA * factorA + aB * factorB) / a;
      bY = (bA * factorA + bB * factorB) / a;
      a = parseFloat(a.toFixed(3));
    }
    if (format === 'spec') {
      return [
        colorSpace,
        parseFloat(l.toPrecision(6)),
        parseFloat(aX.toPrecision(6)),
        parseFloat(bY.toPrecision(6)),
        a
      ];
    }
    [, r, g, b] = resolveColorValue(`${colorSpace}(${l} ${aX} ${bY})`);
  // in lch
  } else if (colorSpace === 'lch') {
    let lchA = convertColorToLch(colorA);
    let lchB = convertColorToLch(colorB);
    if (REG_CURRENT_COLOR.test(colorA)) {
      lchA = reInsertMissingColorComponents(CC_LCH, lchA);
    } else if (colorA.includes(NONE)) {
      lchA = reInsertMissingColorComponents(colorA, lchA);
    }
    if (REG_CURRENT_COLOR.test(colorB)) {
      lchB = reInsertMissingColorComponents(CC_LCH, lchB);
    } else if (colorB.includes(NONE)) {
      lchB = reInsertMissingColorComponents(colorB, lchB);
    }
    const [
      [lA, cA, hA, aA],
      [lB, cB, hB, aB]
    ] = normalizeColorComponents(lchA, lchB, true);
    const factorA = aA * pA;
    const factorB = aB * pB;
    a = (factorA + factorB);
    let l, c, h;
    if (a === 0) {
      l = lA * pA + lB * pB;
      c = cA * pA + cB * pB;
      h = hA * pA + hB * pB;
    } else {
      l = (lA * factorA + lB * factorB) / a;
      c = (cA * factorA + cB * factorB) / a;
      h = (hA * factorA + hB * factorB) / a;
      a = parseFloat(a.toFixed(3));
    }
    if (format === 'spec') {
      return [
        colorSpace,
        parseFloat(l.toPrecision(6)),
        parseFloat(c.toPrecision(6)),
        parseFloat(h.toPrecision(6)),
        a
      ];
    }
    [, r, g, b] = resolveColorValue(`${colorSpace}(${l} ${c} ${h})`);
  // in oklab
  } else if (colorSpace === 'oklab') {
    let [lA, aA, bA, aaA] = convertColorToOklab(colorA);
    let [lB, aB, bB, aaB] = convertColorToOklab(colorB);
    if (REG_CURRENT_COLOR.test(colorA)) {
      [lA,,, aaA] =
        reInsertMissingColorComponents(CC_LCH, [lA, null, null, aaA]);
    } else if (colorA.includes(NONE)) {
      [lA,,, aaA] =
        reInsertMissingColorComponents(colorA, [lA, null, null, aaA]);
    }
    if (REG_CURRENT_COLOR.test(colorB)) {
      [lA,,, aaB] =
        reInsertMissingColorComponents(CC_LCH, [lB, null, null, aaB]);
    } else if (colorB.includes(NONE)) {
      [lB,,, aaB] =
        reInsertMissingColorComponents(colorB, [lB, null, null, aaB]);
    }
    [
      [lA, aA, bA, aaA],
      [lB, aB, bB, aaB]
    ] = normalizeColorComponents([lA, aA, bA, aaA], [lB, aB, bB, aaB], true);
    const factorA = aaA * pA;
    const factorB = aaB * pB;
    a = (factorA + factorB);
    let l, aX, bY;
    if (a === 0) {
      l = lA * pA + lB * pB;
      aX = aA * pA + aB * pB;
      bY = bA * pA + bB * pB;
    } else {
      l = (lA * factorA + lB * factorB) / a;
      aX = (aA * factorA + aB * factorB) / a;
      bY = (bA * factorA + bB * factorB) / a;
      a = parseFloat(a.toFixed(3));
    }
    if (format === 'spec') {
      return [
        colorSpace,
        parseFloat(l.toPrecision(6)),
        parseFloat(aX.toPrecision(6)),
        parseFloat(bY.toPrecision(6)),
        a
      ];
    }
    [, r, g, b] = resolveColorValue(`${colorSpace}(${l} ${aX} ${bY})`);
  // in oklch
  } else if (colorSpace === 'oklch') {
    let lchA = convertColorToOklch(colorA);
    let lchB = convertColorToOklch(colorB);
    if (REG_CURRENT_COLOR.test(colorA)) {
      lchA = reInsertMissingColorComponents(CC_LCH, lchA);
    } else if (colorA.includes(NONE)) {
      lchA = reInsertMissingColorComponents(colorA, lchA);
    }
    if (REG_CURRENT_COLOR.test(colorB)) {
      lchB = reInsertMissingColorComponents(CC_LCH, lchB);
    } else if (colorB.includes(NONE)) {
      lchB = reInsertMissingColorComponents(colorB, lchB);
    }
    if (colorA.includes(NONE)) {
      lchA = reInsertMissingColorComponents(colorA, lchA);
    }
    if (colorB.includes(NONE)) {
      lchB = reInsertMissingColorComponents(colorB, lchB);
    }
    const [
      [lA, cA, hA, aaA],
      [lB, cB, hB, aaB]
    ] = normalizeColorComponents(lchA, lchB, true);
    const factorA = aaA * pA;
    const factorB = aaB * pB;
    a = (factorA + factorB);
    let l, c, h;
    if (a === 0) {
      l = lA * pA + lB * pB;
      c = cA * pA + cB * pB;
      h = hA * pA + hB * pB;
    } else {
      l = (lA * factorA + lB * factorB) / a;
      c = (cA * factorA + cB * factorB) / a;
      h = (hA * factorA + hB * factorB) / a;
      a = parseFloat(a.toFixed(3));
    }
    if (format === 'spec') {
      return [
        colorSpace,
        parseFloat(l.toPrecision(6)),
        parseFloat(c.toPrecision(6)),
        parseFloat(h.toPrecision(6)),
        a
      ];
    }
    [, r, g, b] = resolveColorValue(`${colorSpace}(${l} ${c} ${h})`);
  }
  return [
    'rgb',
    Math.round(r),
    Math.round(g),
    Math.round(b),
    parseFloat((a * m).toFixed(3))
  ];
};
