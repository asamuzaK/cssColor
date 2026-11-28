/**
 * Color transformation and matrix calculation utilities.
 */

import {
  ColorChannels,
  ComputedColorChannels,
  NumStrColorChannels,
  Options,
  ReadonlyColorMatrix,
  TriColorChannels,
  ValidateColorComponentsOptions
} from '../typedef';

/* Constants */
import {
  DEC,
  DEG,
  DEG_HALF,
  DUO,
  GAMMA,
  HALF,
  HEX,
  LAB_A,
  LAB_B,
  LAB_EPSILON,
  LAB_KAPPA,
  LAB_L,
  LINEAR_COEF,
  LINEAR_OFFSET,
  MAX_PCT,
  MAX_RGB,
  NONE,
  POW_LINEAR,
  POW_SQR,
  QUAD,
  SEXA,
  TRIA
} from '../utils/constant';
import {
  D50,
  MATRIX_A98_TO_XYZ,
  MATRIX_D50_TO_D65,
  MATRIX_D65_TO_D50,
  MATRIX_LMS_TO_OKLAB,
  MATRIX_L_RGB_TO_XYZ,
  MATRIX_P3_TO_XYZ,
  MATRIX_PROPHOTO_TO_XYZ_D50,
  MATRIX_REC2020_TO_XYZ,
  MATRIX_XYZ_D50_TO_PROPHOTO,
  MATRIX_XYZ_TO_A98,
  MATRIX_XYZ_TO_LMS,
  MATRIX_XYZ_TO_L_RGB,
  MATRIX_XYZ_TO_P3,
  MATRIX_XYZ_TO_REC2020
} from './matrix';
const PROPHOTO_GAMMA = 1.8;
const REC2020_ALPHA = 1.09929682680944;
const REC2020_BETA = 0.018053968510807;
const REC2020_COEF = 4.5 * REC2020_BETA;

/**
 * Validates color component values against specified ranges and length.
 * @param arr - The color components array.
 * @param opt - The validation options.
 * @param opt.alpha - Whether to ensure an alpha channel exists.
 * @param opt.minLength - The minimum allowed array length.
 * @param opt.maxLength - The maximum allowed array length.
 * @param opt.minRange - The minimum allowed value range.
 * @param opt.maxRange - The maximum allowed value range.
 * @param opt.validateRange - Whether to validate component value ranges.
 * @returns The validated color components array.
 */
export const validateColorComponents = (
  arr: ColorChannels | TriColorChannels,
  opt: ValidateColorComponentsOptions = {}
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
 * Normalizes two color components arrays by handling missing or none values.
 * @param colorA - The first color components array [v1, v2, v3, v4].
 * @param colorB - The second color components array [v1, v2, v3, v4].
 * @param [skip] - Whether to skip validation.
 * @returns A tuple of normalized color components: [colorA, colorB].
 */
export const normalizeColorComponents = (
  colorA: NumStrColorChannels,
  colorB: NumStrColorChannels,
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
 * Transforms a vector using a 3x3 color matrix.
 * @param mtx - The 3x3 color matrix.
 * @param vct - The vector to transform.
 * @param [skip] - Whether to skip validation.
 * @returns The transformed tri-color channels: [p1, p2, p3].
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

/**
 * Transforms sRGB channels to linear sRGB.
 * @param rgb - The sRGB channels: [r, g, b] (ranging from 0 to 1).
 * @param [skip] - Whether to skip validation.
 * @returns The linear RGB channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformSrgbToLinearRgb = (
  rgb: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let r, g, b;
  if (skip) {
    [r, g, b] = rgb;
  } else {
    [r, g, b] = validateColorComponents(rgb, {
      maxLength: TRIA
    });
  }
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
 * Transforms sRGB channels to XYZ.
 * @param rgb - The RGB channels: [r, g, b] (ranging from 0 to 1).
 * @param [skip] - Whether to skip validation.
 * @returns The XYZ color channels: [x, y, z].
 */
export const transformSrgbToXyz = (
  rgb: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let r, g, b;
  if (skip) {
    [r, g, b] = rgb;
  } else {
    [r, g, b] = validateColorComponents(rgb, {
      maxLength: TRIA
    }) as TriColorChannels;
  }
  const lRgb = transformSrgbToLinearRgb([r, g, b], true);
  return transformMatrix(MATRIX_L_RGB_TO_XYZ, lRgb, true);
};

/**
 * Transforms sRGB channels to XYZ-D50.
 * @param rgb - The RGB channels: [r, g, b] (ranging from 0 to 1).
 * @returns The XYZ-D50 color channels: [x, y, z].
 */
export const transformSrgbToXyzD50 = (
  rgb: TriColorChannels
): TriColorChannels => {
  const xyz = transformSrgbToXyz(rgb);
  return transformMatrix(MATRIX_D65_TO_D50, xyz, true);
};

/**
 * Transforms RGB channels to linear sRGB.
 * @param rgb - The RGB channels: [r, g, b] (ranging from 0 to 255).
 * @param [skip] - Whether to skip validation.
 * @returns The linear RGB channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformRgbToLinearRgb = (
  rgb: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let r, g, b;
  if (skip) {
    [r, g, b] = rgb;
  } else {
    [r, g, b] = validateColorComponents(rgb, {
      maxLength: TRIA,
      maxRange: MAX_RGB
    });
  }
  return transformSrgbToLinearRgb(
    [r / MAX_RGB, g / MAX_RGB, b / MAX_RGB],
    true
  );
};

/**
 * Transforms RGB channels to XYZ.
 * @param rgb - The RGB channels: [r, g, b] (ranging from 0 to 255).
 * @param [skip] - Whether to skip validation.
 * @returns The XYZ color channels: [x, y, z].
 */
export const transformRgbToXyz = (
  rgb: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let r, g, b;
  if (skip) {
    [r, g, b] = rgb;
  } else {
    [r, g, b] = validateColorComponents(rgb, {
      maxLength: TRIA,
      maxRange: MAX_RGB
    }) as TriColorChannels;
  }
  const lRgb = transformRgbToLinearRgb([r, g, b], true);
  return transformMatrix(MATRIX_L_RGB_TO_XYZ, lRgb, true);
};

/**
 * Transforms RGB channels to XYZ-D50.
 * @param rgb - The RGB channels: [r, g, b] (ranging from 0 to 255).
 * @returns The XYZ-D50 color channels: [x, y, z].
 */
export const transformRgbToXyzD50 = (
  rgb: TriColorChannels
): TriColorChannels => {
  const xyz = transformRgbToXyz(rgb);
  return transformMatrix(MATRIX_D65_TO_D50, xyz, true);
};

/**
 * Transforms linear RGB channels to sRGB.
 * @param rgb - The linear RGB channels: [r, g, b] (ranging from 0 to 1).
 * @param [skip] - Whether to skip validation.
 * @returns The sRGB channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformLinearRgbToSrgb = (
  rgb: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let r, g, b;
  if (skip) {
    [r, g, b] = rgb;
  } else {
    [r, g, b] = validateColorComponents(rgb, {
      maxLength: TRIA
    });
  }
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
  return [r, g, b];
};

/**
 * Transforms linear RGB channels to RGB.
 * @param rgb - The linear RGB channels: [r, g, b] (ranging from 0 to 1).
 * @param [round] - Whether to round the resulting values.
 * @param [skip] - Whether to skip validation.
 * @returns The RGB channels: [r, g, b] (ranging from 0 to 255).
 */
export const transformLinearRgbToRgb = (
  rgb: TriColorChannels,
  round: boolean = false,
  skip: boolean = false
): TriColorChannels => {
  let rr, gg, bb;
  if (skip) {
    [rr, gg, bb] = rgb;
  } else {
    [rr, gg, bb] = validateColorComponents(rgb, {
      maxLength: TRIA
    });
  }
  let [r, g, b] = transformLinearRgbToSrgb([rr, gg, bb], true);
  r *= MAX_RGB;
  g *= MAX_RGB;
  b *= MAX_RGB;
  return [
    round ? Math.round(r) : r,
    round ? Math.round(g) : g,
    round ? Math.round(b) : b
  ];
};

/**
 * Transforms linear Display P3 channels to Display P3.
 * @param p3 - The linear Display P3 channels: [r, g, b] (ranging from 0 to 1).
 * @returns The Display P3 channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformLinearP3ToP3 = (
  p3: TriColorChannels
): TriColorChannels => {
  let [r, g, b] = validateColorComponents(p3, {
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
  return [r, g, b];
};

/**
 * Transforms linear ProPhoto RGB channels to ProPhoto RGB.
 * @param prophoto - The linear ProPhoto RGB channels: [r, g, b] (ranging from 0 to 1).
 * @returns The ProPhoto RGB channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformLinearProphotoToProphoto = (
  prophoto: TriColorChannels
): TriColorChannels => {
  let [r, g, b] = validateColorComponents(prophoto, {
    maxLength: TRIA
  });
  const PROPHOTO_COEF = PROPHOTO_GAMMA / HEX;
  if (r < PROPHOTO_COEF) {
    r /= PROPHOTO_GAMMA;
  } else {
    r = Math.pow(r, 1 / PROPHOTO_GAMMA);
  }
  if (g < PROPHOTO_COEF) {
    g /= PROPHOTO_GAMMA;
  } else {
    g = Math.pow(g, 1 / PROPHOTO_GAMMA);
  }
  if (b < PROPHOTO_COEF) {
    b /= PROPHOTO_GAMMA;
  } else {
    b = Math.pow(b, 1 / PROPHOTO_GAMMA);
  }
  return [r, g, b];
};

/**
 * Transforms linear Rec. 2020 channels to Rec. 2020.
 * @param rec2020 - The linear Rec. 2020 channels: [r, g, b] (ranging from 0 to 1).
 * @returns The Rec. 2020 channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformLinearRec2020ToRec2020 = (
  rec2020: TriColorChannels
): TriColorChannels => {
  let [r, g, b] = validateColorComponents(rec2020, {
    maxLength: TRIA
  });
  if (r < REC2020_COEF) {
    r *= 4.5;
  } else {
    r = REC2020_ALPHA * Math.pow(r, 0.45) - (REC2020_ALPHA - 1);
  }
  if (g < REC2020_COEF) {
    g *= 4.5;
  } else {
    g = REC2020_ALPHA * Math.pow(g, 0.45) - (REC2020_ALPHA - 1);
  }
  if (b < REC2020_COEF) {
    b *= 4.5;
  } else {
    b = REC2020_ALPHA * Math.pow(b, 0.45) - (REC2020_ALPHA - 1);
  }
  return [r, g, b];
};

/**
 * Transforms linear Adobe RGB channels to Adobe RGB (1998).
 * @param a98 - The linear Adobe RGB channels: [r, g, b] (ranging from 0 to 1).
 * @returns The Adobe RGB channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformLinearA98ToA98 = (
  a98: TriColorChannels
): TriColorChannels => {
  const [r, g, b] = validateColorComponents(a98, {
    maxLength: TRIA
  });
  return [
    Math.pow(r, 1 / GAMMA),
    Math.pow(g, 1 / GAMMA),
    Math.pow(b, 1 / GAMMA)
  ];
};

/**
 * Transforms LAB channels to XYZ-D50.
 * @param lab - The LAB cchannels: [l, a, b].
 * @param [skip] - Whether to skip validation.
 * @returns The XYZ-D50 channels: [x, y, z].
 */
/*
export const transformLabToXyzD50 = (
  lab: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
};
*/

/**
 * Transforms XYZ (D65) channels to XYZ-D50.
 * @param xyz - The XYZ channels: [x, y, z].
 * @returns The XYZ-D50 channels: [x, y, z].
 */
export const transformXyzToXyzD50 = (
  xyz: TriColorChannels
): TriColorChannels => {
  const [x, y, z] = validateColorComponents(xyz, {
    maxLength: TRIA,
    validateRange: false
  }) as TriColorChannels;
  return transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
};

/**
 * Transforms XYZ channels to sRGB.
 * @param xyz - The XYZ channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The RGB channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformXyzToSrgb = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let x, y, z;
  if (skip) {
    [x, y, z] = xyz;
  } else {
    [x, y, z] = validateColorComponents(xyz, {
      maxLength: TRIA,
      validateRange: false
    }) as TriColorChannels;
  }
  const [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
  return transformLinearRgbToSrgb(
    [
      Math.min(Math.max(r, 0), 1),
      Math.min(Math.max(g, 0), 1),
      Math.min(Math.max(b, 0), 1)
    ],
    true
  );
};

/**
 * Transforms XYZ channels to RGB.
 * @param xyz - The XYZ channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The RGB channels: [r, g, b] (ranging from 0 to 255).
 */
export const transformXyzToRgb = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let x, y, z;
  if (skip) {
    [x, y, z] = xyz;
  } else {
    [x, y, z] = validateColorComponents(xyz, {
      maxLength: TRIA,
      validateRange: false
    }) as TriColorChannels;
  }
  const [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
  return transformLinearRgbToRgb(
    [
      Math.min(Math.max(r, 0), 1),
      Math.min(Math.max(g, 0), 1),
      Math.min(Math.max(b, 0), 1)
    ],
    true
  );
};

/**
 * Transforms XYZ channels to HSL.
 * @param xyz - The XYZ channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The HSL channels: [h, s, l].
 */
export const transformXyzToHsl = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  const [rr, gg, bb] = transformXyzToRgb(xyz, skip);
  const r = rr / MAX_RGB;
  const g = gg / MAX_RGB;
  const b = bb / MAX_RGB;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) * HALF * MAX_PCT;
  let h, s;
  if (Math.round(l) === 0 || Math.round(l) === MAX_PCT) {
    h = 0;
    s = 0;
  } else {
    s = (d / (1 - Math.abs(max + min - 1))) * MAX_PCT;
    if (s === 0) {
      h = 0;
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
          h = (r - g) / d + QUAD;
          break;
      }
      h = (h * SEXA) % DEG;
      if (h < 0) {
        h += DEG;
      }
    }
  }
  return [h, s, l];
};

/**
 * Transforms XYZ channels to HWB.
 * @param xyz - The XYZ channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The HWB channels: [h, w, b].
 */
export const transformXyzToHwb = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  const [r, g, b] = transformXyzToRgb(xyz, skip);
  const wh = Math.min(r, g, b) / MAX_RGB;
  const bk = 1 - Math.max(r, g, b) / MAX_RGB;
  let h;
  if (wh + bk === 1) {
    h = 0;
  } else {
    [h] = transformXyzToHsl(xyz);
  }
  return [h, wh * MAX_PCT, bk * MAX_PCT];
};

/**
 * Transforms XYZ channels to Oklab.
 * @param xyz - The XYZ channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The Oklab channels: [l, a, b].
 */
export const transformXyzToOklab = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let x, y, z;
  if (skip) {
    [x, y, z] = xyz;
  } else {
    [x, y, z] = validateColorComponents(xyz, {
      maxLength: TRIA,
      validateRange: false
    }) as TriColorChannels;
  }
  const lms = transformMatrix(MATRIX_XYZ_TO_LMS, [x, y, z], true);
  const xyzLms = lms.map((c: number) => Math.cbrt(c)) as TriColorChannels;
  let [l, a, b] = transformMatrix(MATRIX_LMS_TO_OKLAB, xyzLms, true);
  l = Math.min(Math.max(l, 0), 1);
  const lPct = Math.round(parseFloat(l.toFixed(QUAD)) * MAX_PCT);
  if (lPct === 0 || lPct === MAX_PCT) {
    a = 0;
    b = 0;
  }
  return [l, a, b];
};

/**
 * Transforms XYZ channels to Oklch.
 * @param xyz - The XYZ channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The Oklch channels: [l, c, h].
 */
export const transformXyzToOklch = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  const [l, a, b] = transformXyzToOklab(xyz, skip);
  let c, h;
  const lPct = Math.round(parseFloat(l.toFixed(QUAD)) * MAX_PCT);
  if (lPct === 0 || lPct === MAX_PCT) {
    c = 0;
    h = 0;
  } else {
    c = Math.max(Math.sqrt(Math.pow(a, POW_SQR) + Math.pow(b, POW_SQR)), 0);
    if (parseFloat(c.toFixed(QUAD)) === 0) {
      h = 0;
    } else {
      h = (Math.atan2(b, a) * DEG_HALF) / Math.PI;
      if (h < 0) {
        h += DEG;
      }
    }
  }
  return [l, c, h];
};

/**
 * Transforms XYZ channels to Display P3.
 * @param xyz - The XYZ channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The Display P3 channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformXyzToDisplayP3 = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let x, y, z;
  if (skip) {
    [x, y, z] = xyz;
  } else {
    [x, y, z] = validateColorComponents(xyz, {
      maxLength: TRIA,
      validateRange: false
    }) as TriColorChannels;
  }
  const [r, g, b] = transformMatrix(MATRIX_XYZ_TO_P3, [x, y, z], true);
  return transformLinearP3ToP3([
    Math.min(Math.max(r, 0), 1),
    Math.min(Math.max(g, 0), 1),
    Math.min(Math.max(b, 0), 1)
  ]);
};

/**
 * Transforms XYZ channels to linear Display P3.
 * @param xyz - The XYZ channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The linear Display P3 channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformXyzToLinearP3 = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let x, y, z;
  if (skip) {
    [x, y, z] = xyz;
  } else {
    [x, y, z] = validateColorComponents(xyz, {
      maxLength: TRIA,
      validateRange: false
    }) as TriColorChannels;
  }
  return transformMatrix(MATRIX_XYZ_TO_P3, [x, y, z], true);
};

/**
 * Transforms XYZ channels to Adobe RGB (1998).
 * @param xyz - The XYZ channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The Adobe RGB channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformXyzToA98Rgb = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let x, y, z;
  if (skip) {
    [x, y, z] = xyz;
  } else {
    [x, y, z] = validateColorComponents(xyz, {
      maxLength: TRIA,
      validateRange: false
    }) as TriColorChannels;
  }
  const [r, g, b] = transformMatrix(MATRIX_XYZ_TO_A98, [x, y, z], true);
  return transformLinearA98ToA98([
    Math.min(Math.max(r, 0), 1),
    Math.min(Math.max(g, 0), 1),
    Math.min(Math.max(b, 0), 1)
  ]);
};

/**
 * Transforms XYZ channels to Rec. 2020.
 * @param xyz - The XYZ channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The Rec. 2020 channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformXyzToRec2020 = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let x, y, z;
  if (skip) {
    [x, y, z] = xyz;
  } else {
    [x, y, z] = validateColorComponents(xyz, {
      maxLength: TRIA,
      validateRange: false
    }) as TriColorChannels;
  }
  const [r, g, b] = transformMatrix(MATRIX_XYZ_TO_REC2020, [x, y, z], true);
  return transformLinearRec2020ToRec2020([
    Math.min(Math.max(r, 0), 1),
    Math.min(Math.max(g, 0), 1),
    Math.min(Math.max(b, 0), 1)
  ]);
};

/**
 * Transforms XYZ-D50 channels to sRGB.
 * @param xyz - The XYZ-D50 channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The RGB channels: [r, g, b] (ranging from 0 to 255).
 */
export const transformXyzD50ToSrgb = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let x, y, z;
  if (skip) {
    [x, y, z] = xyz;
  } else {
    [x, y, z] = validateColorComponents(xyz, {
      maxLength: TRIA,
      validateRange: false
    }) as TriColorChannels;
  }
  const xyzD65 = transformMatrix(MATRIX_D50_TO_D65, [x, y, z], true);
  return transformXyzToSrgb(xyzD65, true);
};

/**
 * Transforms XYZ-D50 channels to RGB.
 * @param xyz - The XYZ-D50 channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The RGB channels: [r, g, b] (ranging from 0 to 255).
 */
export const transformXyzD50ToRgb = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let x, y, z;
  if (skip) {
    [x, y, z] = xyz;
  } else {
    [x, y, z] = validateColorComponents(xyz, {
      maxLength: TRIA,
      validateRange: false
    }) as TriColorChannels;
  }
  const xyzD65 = transformMatrix(MATRIX_D50_TO_D65, [x, y, z], true);
  return transformXyzToRgb(xyzD65, true);
};

/**
 * Transforms XYZ-D50 channels to LAB.
 * @param xyz - The XYZ-D50 channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The LAB channels: [l, a, b].
 */
export const transformXyzD50ToLab = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let x, y, z;
  if (skip) {
    [x, y, z] = xyz;
  } else {
    [x, y, z] = validateColorComponents(xyz, {
      maxLength: TRIA,
      validateRange: false
    }) as TriColorChannels;
  }
  const xyzD50 = [x, y, z].map(
    (val: number, i: number) => val / (D50[i] as number)
  );
  const [f0, f1, f2] = xyzD50.map((val: number) =>
    val > LAB_EPSILON ? Math.cbrt(val) : (LAB_KAPPA * val + 16) / LAB_L
  ) as TriColorChannels;
  const l = Math.min(Math.max(LAB_L * f1 - HEX, 0), MAX_PCT);
  let a, b;
  if (l === 0 || l === MAX_PCT) {
    a = 0;
    b = 0;
  } else {
    a = (f0 - f1) * LAB_A;
    b = (f1 - f2) * LAB_B;
  }
  return [l, a, b];
};

/**
 * Transforms XYZ-D50 channels to LCH.
 * @param xyz - The XYZ-D50 channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The LCH channels: [l, c, h].
 */
export const transformXyzD50ToLch = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  const [l, a, b] = transformXyzD50ToLab(xyz, skip);
  let c, h;
  if (l === 0 || l === MAX_PCT) {
    c = 0;
    h = 0;
  } else {
    c = Math.max(Math.sqrt(Math.pow(a, POW_SQR) + Math.pow(b, POW_SQR)), 0);
    h = (Math.atan2(b, a) * DEG_HALF) / Math.PI;
    if (h < 0) {
      h += DEG;
    }
  }
  return [l, c, h];
};

/**
 * Transforms XYZ channels to ProPhoto RGB.
 * @param xyz - The XYZ channels: [x, y, z].
 * @param [skip] - Whether to skip validation.
 * @returns The ProPhoto RGB channels: [r, g, b] (ranging from 0 to 1).
 */
export const transformXyzD50ToProphotoRgb = (
  xyz: TriColorChannels,
  skip: boolean = false
): TriColorChannels => {
  let x, y, z;
  if (skip) {
    [x, y, z] = xyz;
  } else {
    [x, y, z] = validateColorComponents(xyz, {
      maxLength: TRIA,
      validateRange: false
    }) as TriColorChannels;
  }
  const [r, g, b] = transformMatrix(
    MATRIX_XYZ_D50_TO_PROPHOTO,
    [x, y, z],
    true
  );
  return transformLinearProphotoToProphoto([
    Math.min(Math.max(r, 0), 1),
    Math.min(Math.max(g, 0), 1),
    Math.min(Math.max(b, 0), 1)
  ]);
};

/**
 * Transforms color function channels to XYZ.
 * @param channels - The color channels.
 * @param [opt] - The resolution options.
 * @returns The XYZ channels: [x, y, z], or null if invalid or unsupported.
 */
export const transformColorFunctionChannelsToXyz = (
  channels: ComputedColorChannels,
  opt: Options = {}
): TriColorChannels | null => {
  const [cs, c1, c2, c3] = channels;
  const v1 = Number.isNaN(c1) ? 0 : c1;
  const v2 = Number.isNaN(c2) ? 0 : c2;
  const v3 = Number.isNaN(c3) ? 0 : c3;
  const { d50 } = opt;
  switch (cs) {
    case 'srgb': {
      const xyz = transformSrgbToXyz([v1, v2, v3]);
      if (d50) {
        return transformMatrix(MATRIX_D65_TO_D50, xyz, true);
      }
      return xyz;
    }
    case 'srgb-linear': {
      const xyz = transformMatrix(MATRIX_L_RGB_TO_XYZ, [v1, v2, v3]);
      if (d50) {
        return transformMatrix(MATRIX_D65_TO_D50, xyz, true);
      }
      return xyz;
    }
    case 'display-p3': {
      const lRgb = transformSrgbToLinearRgb([v1, v2, v3]);
      const xyz = transformMatrix(MATRIX_P3_TO_XYZ, lRgb);
      if (d50) {
        return transformMatrix(MATRIX_D65_TO_D50, xyz, true);
      }
      return xyz;
    }
    case 'rec2020': {
      const rgb = [v1, v2, v3].map(c => {
        let cl;
        if (c < REC2020_BETA * REC2020_COEF * DEC) {
          cl = c / (REC2020_COEF * DEC);
        } else {
          cl = Math.pow(
            (c + REC2020_ALPHA - 1) / REC2020_ALPHA,
            1 / REC2020_COEF
          );
        }
        return cl;
      }) as TriColorChannels;
      const xyz = transformMatrix(MATRIX_REC2020_TO_XYZ, rgb);
      if (d50) {
        return transformMatrix(MATRIX_D65_TO_D50, xyz, true);
      }
      return xyz;
    }
    case 'a98-rgb': {
      const POW_A98 = 563 / 256;
      const rgb = [v1, v2, v3].map(c => {
        const cl = Math.pow(c, POW_A98);
        return cl;
      }) as TriColorChannels;
      const xyz = transformMatrix(MATRIX_A98_TO_XYZ, rgb);
      if (d50) {
        return transformMatrix(MATRIX_D65_TO_D50, xyz, true);
      }
      return xyz;
    }
    case 'prophoto-rgb': {
      const PROPHOTO_GAMMA = 1.8;
      const rgb = [v1, v2, v3].map(c => {
        let cl;
        if (c > 1 / (HEX * DUO)) {
          cl = Math.pow(c, PROPHOTO_GAMMA);
        } else {
          cl = c / HEX;
        }
        return cl;
      }) as TriColorChannels;
      const xyzD50 = transformMatrix(MATRIX_PROPHOTO_TO_XYZ_D50, rgb);
      if (d50) {
        return xyzD50;
      }
      return transformMatrix(MATRIX_D50_TO_D65, xyzD50, true);
    }
    case 'xyz':
    case 'xyz-d65': {
      if (d50) {
        return transformMatrix(MATRIX_D65_TO_D50, [v1, v2, v3]);
      }
      return [v1, v2, v3];
    }
    case 'xyz-d50': {
      if (d50) {
        return [v1, v2, v3];
      }
      return transformMatrix(MATRIX_D50_TO_D65, [v1, v2, v3]);
    }
    // Unsupported color space.
    default: {
      return null;
    }
  }
};
