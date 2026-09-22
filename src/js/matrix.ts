/**
 * matrix
 */

import {
  ColorChannels,
  ReadonlyColorMatrix,
  ReadonlyTriColorChannels,
  TriColorChannels
} from './typedef';

/* constants */
import { NONE } from './constant';

/* numeric constants */
const TRIA = 3;
const QUAD = 4;

/* white point */
export const D50: ReadonlyTriColorChannels = [
  0.3457 / 0.3585,
  1.0,
  (1.0 - 0.3457 - 0.3585) / 0.3585
] as const;

/* conversion matrices */
export const MATRIX_D50_TO_D65: ReadonlyColorMatrix = [
  [0.955473421488075, -0.02309845494876471, 0.06325924320057072],
  [-0.0283697093338637, 1.0099953980813041, 0.021041441191917323],
  [0.012314014864481998, -0.020507649298898964, 1.330365926242124]
] as const;

export const MATRIX_D65_TO_D50: ReadonlyColorMatrix = [
  [1.0479297925449969, 0.022946870601609652, -0.05019226628920524],
  [0.02962780877005599, 0.9904344267538799, -0.017073799063418826],
  [-0.009243040646204504, 0.015055191490298152, 0.7518742814281371]
] as const;

export const MATRIX_L_RGB_TO_XYZ: ReadonlyColorMatrix = [
  [506752 / 1228815, 87881 / 245763, 12673 / 70218],
  [87098 / 409605, 175762 / 245763, 12673 / 175545],
  [7918 / 409605, 87881 / 737289, 1001167 / 1053270]
] as const;

export const MATRIX_XYZ_TO_L_RGB: ReadonlyColorMatrix = [
  [12831 / 3959, -329 / 214, -1974 / 3959],
  [-851781 / 878810, 1648619 / 878810, 36519 / 878810],
  [705 / 12673, -2585 / 12673, 705 / 667]
] as const;

export const MATRIX_XYZ_TO_LMS: ReadonlyColorMatrix = [
  [0.819022437996703, 0.3619062600528904, -0.1288737815209879],
  [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
  [0.0481771893596242, 0.2642395317527308, 0.6335478284694309]
] as const;

export const MATRIX_LMS_TO_XYZ: ReadonlyColorMatrix = [
  [1.2268798758459243, -0.5578149944602171, 0.2813910456659647],
  [-0.0405757452148008, 1.112286803280317, -0.0717110580655164],
  [-0.0763729366746601, -0.4214933324022432, 1.5869240198367816]
] as const;

export const MATRIX_OKLAB_TO_LMS: ReadonlyColorMatrix = [
  [1.0, 0.3963377773761749, 0.2158037573099136],
  [1.0, -0.1055613458156586, -0.0638541728258133],
  [1.0, -0.0894841775298119, -1.2914855480194092]
] as const;

export const MATRIX_LMS_TO_OKLAB: ReadonlyColorMatrix = [
  [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
  [1.9779985324311684, -2.4285922420485799, 0.450593709617411],
  [0.0259040424655478, 0.7827717124575296, -0.8086757549230774]
] as const;

export const MATRIX_P3_TO_XYZ: ReadonlyColorMatrix = [
  [608311 / 1250200, 189793 / 714400, 198249 / 1000160],
  [35783 / 156275, 247089 / 357200, 198249 / 2500400],
  [0 / 1, 32229 / 714400, 5220557 / 5000800]
] as const;

export const MATRIX_REC2020_TO_XYZ: ReadonlyColorMatrix = [
  [63426534 / 99577255, 20160776 / 139408157, 47086771 / 278816314],
  [26158966 / 99577255, 472592308 / 697040785, 8267143 / 139408157],
  [0 / 1, 19567812 / 697040785, 295819943 / 278816314]
] as const;

export const MATRIX_A98_TO_XYZ: ReadonlyColorMatrix = [
  [573536 / 994567, 263643 / 1420810, 187206 / 994567],
  [591459 / 1989134, 6239551 / 9945670, 374412 / 4972835],
  [53769 / 1989134, 351524 / 4972835, 4929758 / 4972835]
] as const;

export const MATRIX_PROPHOTO_TO_XYZ_D50: ReadonlyColorMatrix = [
  [0.7977666449006423, 0.13518129740053308, 0.0313477341283922],
  [0.2880748288194013, 0.711835234241873, 0.00008993693872564],
  [0.0, 0.0, 0.8251046025104602]
] as const;

/**
 * validate color components
 * @param arr - color components
 * @param opt - options
 * @param opt.alpha - alpha channel
 * @param opt.minLength - min length
 * @param opt.maxLength - max length
 * @param opt.minRange - min range
 * @param opt.maxRange - max range
 * @param opt.validateRange - validate range
 * @returns result - validated color components
 */
export const validateColorComponents = (
  arr: ColorChannels | TriColorChannels,
  opt: {
    alpha?: boolean;
    minLength?: number;
    maxLength?: number;
    minRange?: number;
    maxRange?: number;
    validateRange?: boolean;
  } = {}
): ColorChannels | TriColorChannels => {
  if (!Array.isArray(arr)) {
    throw new TypeError(`${arr} is not an array.`);
  }
  const {
    alpha = false,
    minLength = TRIA,
    maxLength = QUAD,
    minRange = 0,
    maxRange = 1,
    validateRange = true
  } = opt;
  if (!Number.isFinite(minLength)) {
    throw new TypeError(`${minLength} is not a number.`);
  }
  if (!Number.isFinite(maxLength)) {
    throw new TypeError(`${maxLength} is not a number.`);
  }
  if (!Number.isFinite(minRange)) {
    throw new TypeError(`${minRange} is not a number.`);
  }
  if (!Number.isFinite(maxRange)) {
    throw new TypeError(`${maxRange} is not a number.`);
  }
  const l = arr.length;
  if (l < minLength || l > maxLength) {
    throw new Error(`Unexpected array length ${l}.`);
  }
  let i = 0;
  while (i < l) {
    const v = arr[i] as number;
    if (!Number.isFinite(v)) {
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
 * transform matrix
 * @param mtx - 3 * 3 matrix
 * @param vct - vector
 * @param [skip] - skip validate
 * @returns TriColorChannels - [p1, p2, p3]
 */
export const transformMatrix = (
  mtx: ReadonlyColorMatrix,
  vct: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  if (!Array.isArray(mtx)) {
    throw new TypeError(`${mtx} is not an array.`);
  } else if (mtx.length !== TRIA) {
    throw new Error(`Unexpected array length ${mtx.length}.`);
  } else if (!skip) {
    for (let i of mtx) {
      i = validateColorComponents(i as TriColorChannels, {
        maxLength: TRIA,
        validateRange: false
      }) as TriColorChannels;
    }
  }
  const [[r1c1, r1c2, r1c3], [r2c1, r2c2, r2c3], [r3c1, r3c2, r3c3]] = mtx;
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
