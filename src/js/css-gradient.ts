/**
 * css-gradient
 */

import { CacheItem, createCacheKey, getCache, setCache } from './cache';
import { isString } from './common';
import { Options } from './typedef';
import { isColor } from './util';

/* constants */
import {
  ANGLE,
  CS_HUE,
  CS_RECT,
  LENGTH,
  NUM,
  NUM_POSITIVE,
  PCT
} from './constant';
const NAMESPACE = 'css-gradient';
const DIM_ANGLE = `${NUM}(?:${ANGLE})`;
const DIM_ANGLE_PCT = `${DIM_ANGLE}|${PCT}`;
const DIM_LEN = `${NUM}(?:${LENGTH})|0`;
const DIM_LEN_PCT = `${DIM_LEN}|${PCT}`;
const DIM_LEN_PCT_POSI = `${NUM_POSITIVE}(?:${LENGTH}|%)|0`;
const DIM_LEN_POSI = `${NUM_POSITIVE}(?:${LENGTH})|0`;
const CTR = 'center';
const L_R = 'left|right';
const T_B = 'top|bottom';
const S_E = 'start|end';
const AXIS_X = `${L_R}|x-(?:${S_E})`;
const AXIS_Y = `${T_B}|y-(?:${S_E})`;
const BLOCK = `block-(?:${S_E})`;
const INLINE = `inline-(?:${S_E})`;
const POS_1 = `${CTR}|${AXIS_X}|${AXIS_Y}|${BLOCK}|${INLINE}|${DIM_LEN_PCT}`;
const POS_2 = [
  `(?:${CTR}|${AXIS_X})\\s+(?:${CTR}|${AXIS_Y})`,
  `(?:${CTR}|${AXIS_Y})\\s+(?:${CTR}|${AXIS_X})`,
  `(?:${CTR}|${AXIS_X}|${DIM_LEN_PCT})\\s+(?:${CTR}|${AXIS_Y}|${DIM_LEN_PCT})`,
  `(?:${CTR}|${BLOCK})\\s+(?:${CTR}|${INLINE})`,
  `(?:${CTR}|${INLINE})\\s+(?:${CTR}|${BLOCK})`,
  `(?:${CTR}|${S_E})\\s+(?:${CTR}|${S_E})`
].join('|');
const POS_4 = [
  `(?:${AXIS_X})\\s+(?:${DIM_LEN_PCT})\\s+(?:${AXIS_Y})\\s+(?:${DIM_LEN_PCT})`,
  `(?:${AXIS_Y})\\s+(?:${DIM_LEN_PCT})\\s+(?:${AXIS_X})\\s+(?:${DIM_LEN_PCT})`,
  `(?:${BLOCK})\\s+(?:${DIM_LEN_PCT})\\s+(?:${INLINE})\\s+(?:${DIM_LEN_PCT})`,
  `(?:${INLINE})\\s+(?:${DIM_LEN_PCT})\\s+(?:${BLOCK})\\s+(?:${DIM_LEN_PCT})`,
  `(?:${S_E})\\s+(?:${DIM_LEN_PCT})\\s+(?:${S_E})\\s+(?:${DIM_LEN_PCT})`
].join('|');
const RAD_EXTENT = '(?:clos|farth)est-(?:corner|side)';
const RAD_SIZE = [
  `${RAD_EXTENT}(?:\\s+${RAD_EXTENT})?`,
  `${DIM_LEN_POSI}`,
  `(?:${DIM_LEN_PCT_POSI})\\s+(?:${DIM_LEN_PCT_POSI})`
].join('|');
const RAD_SHAPE = 'circle|ellipse';
const FROM_ANGLE = `from\\s+${DIM_ANGLE}`;
const AT_POSITION = `at\\s+(?:${POS_1}|${POS_2}|${POS_4})`;
const TO_SIDE_CORNER = `to\\s+(?:${L_R}(?:\\s${T_B})?|${T_B}(?:\\s${L_R})?)`;
const IN_COLOR_SPACE = `in\\s+(?:${CS_RECT}|${CS_HUE})`;

/* regexp */
const REG_GRAD = /^(?:repeating-)?(?:conic|linear|radial)-gradient\(/;
const REG_GRAD_CAPT = /^((?:repeating-)?(?:conic|linear|radial)-gradient)\(/;

/* type definitions */
/**
 * @typedef Gradient - parsed CSS gradient
 * @property value
 * @property type
 * @property colorStopList
 * @property [gradientLine]
 */
interface Gradient {
  value: string;
  type: string;
  colorStopList: string[];
  gradientLine?: string;
}

/**
 * get gradient type
 * @param value
 * @returns gradient type
 */
export const getGradientType = (value: string): string => {
  if (isString(value)) {
    value = value.trim();
    if (REG_GRAD.test(value)) {
      const [, type = ''] = value.match(REG_GRAD_CAPT) as RegExpExecArray;
      return type;
    }
  }
  return '';
};

/**
 * validate gradient line
 * @param value
 * @param type
 * @param [opt]
 * @returns result
 */
export const validateGradientLine = (value: string, type: string): boolean => {
  if (isString(value) && isString(type)) {
    value = value.trim();
    type = type.trim();
    const isConic = /^(?:repeating-)?conic-gradient$/.test(type);
    const isLinear = /^(?:repeating-)?linear-gradient$/.test(type);
    const isRadial = /^(?:repeating-)?radial-gradient$/.test(type);
    if (isConic) {
      /*
       * <conic-gradient-line> = [
       *   [ [ from <angle> ]? [ at <position> ]? ] ||
       *   <color-interpolation-method>
       * ]
       */
      const conicLine = [
        `${FROM_ANGLE}(?:\\s+${AT_POSITION})?(?:\\s+${IN_COLOR_SPACE})?`,
        `${AT_POSITION}(?:\\s+${IN_COLOR_SPACE})?`,
        `${IN_COLOR_SPACE}(?:\\s+${FROM_ANGLE})?(?:\\s+${AT_POSITION})?`
      ].join('|');
      const reg = new RegExp(`^${conicLine}$`);
      return reg.test(value);
    } else if (isRadial) {
      /*
       * <radial-gradient-line> = [
       *   [ [ <radial-shape> || <radial-size> ]? [ at <position> ]? ] ||
       *   <color-interpolation-method>]?
       */
      const radialLine = [
        `(?:${RAD_SHAPE})(?:\\s+(?:${RAD_SIZE}))?(\\s+${AT_POSITION})?(?:${IN_COLOR_SPACE})?`,
        `(?:${RAD_SIZE})(?:\\s+(?:${RAD_SHAPE}))?(\\s+${AT_POSITION})?(?:${IN_COLOR_SPACE})?`,
        `${AT_POSITION}(?:${IN_COLOR_SPACE})?`,
        `${IN_COLOR_SPACE}(?:\\s+${RAD_SHAPE})(?:\\s+(?:${RAD_SIZE}))?(\\s+${AT_POSITION})?`,
        `${IN_COLOR_SPACE}(?:\\s+${RAD_SIZE})(?:\\s+(?:${RAD_SHAPE}))?(\\s+${AT_POSITION})?`,
        `${IN_COLOR_SPACE}(\\s+${AT_POSITION})?`
      ].join('|');
      const reg = new RegExp(`^${radialLine}$`);
      return reg.test(value);
    } else if (isLinear) {
      /*
       * <linear-gradient-line> = [
       *   [ <angle> | to <side-or-corner> ] ||
       *   <color-interpolation-method>
       * ]
       */
      const linearLine = [
        `(?:${DIM_ANGLE}|${TO_SIDE_CORNER})(?:\\s+${IN_COLOR_SPACE})?`,
        `${IN_COLOR_SPACE}(?:\\s+(?:${DIM_ANGLE}|${TO_SIDE_CORNER}))?`
      ].join('|');
      const reg = new RegExp(`^${linearLine}$`);
      return reg.test(value);
    }
  }
  return false;
};

/**
 * validate color stop list
 * @param list
 * @param type
 * @param [opt]
 * @returns result
 */
export const validateColorStopList = (
  list: string[],
  type: string,
  opt: Options = {}
): boolean => {
  if (Array.isArray(list)) {
    const isConic = /^(?:repeating-)?conic-gradient$/.test(type);
    const dimension = isConic ? DIM_ANGLE_PCT : DIM_LEN_PCT;
    const regColorHint = new RegExp(`^(?:${dimension})$`);
    const regDimension = new RegExp(`(?:\\s+(?:${dimension})){1,2}$`);
    const arr = [];
    for (const item of list) {
      if (isString(item)) {
        if (regColorHint.test(item)) {
          arr.push('hint');
        } else {
          const color = item.replace(regDimension, '');
          if (isColor(color, opt)) {
            arr.push('color');
          } else {
            return false;
          }
        }
      }
    }
    const value = arr.join(',');
    return /^color(?:,(?:hint,)?color)+$/.test(value);
  }
  return false;
};

/**
 * parse CSS gradient
 * @param value
 * @param [opt]
 * @returns parsed result
 */
export const parseGradient = (
  value: string,
  opt: Options = {}
): Gradient | null => {
  if (isString(value)) {
    value = value.trim();
    const cacheKey: string = createCacheKey(
      {
        namespace: NAMESPACE,
        name: 'parseGradient',
        value
      },
      opt
    );
    const cachedResult = getCache(cacheKey);
    if (cachedResult instanceof CacheItem) {
      if (cachedResult.isNull) {
        return null;
      }
      return cachedResult.item as Gradient;
    }
    const type = getGradientType(value);
    if (type) {
      const gradientValue = value.replace(REG_GRAD, '').replace(/\)$/, '');
      const [gradientLineOrColorStop, ...colorStopList] = gradientValue.split(
        /\s{0,255},\s{0,255}/
      ) as [string, ...string[]];
      const isConic = /^(?:repeating-)?conic-gradient$/.test(type);
      const dimension = isConic ? DIM_ANGLE_PCT : DIM_LEN_PCT;
      const regDimension = new RegExp(`(?:\\s+(?:${dimension})){1,2}$`);
      let isColorStop = false;
      if (regDimension.test(gradientLineOrColorStop)) {
        const colorStop = gradientLineOrColorStop.replace(regDimension, '');
        if (isColor(colorStop, opt)) {
          isColorStop = true;
        }
      } else if (isColor(gradientLineOrColorStop, opt)) {
        isColorStop = true;
      }
      if (isColorStop) {
        colorStopList.unshift(gradientLineOrColorStop);
        const valid = validateColorStopList(colorStopList, type, opt);
        if (valid) {
          const res: Gradient = {
            value,
            type,
            colorStopList
          };
          setCache(cacheKey, res);
          return res;
        }
      } else {
        const gradientLine = gradientLineOrColorStop;
        const valid =
          validateGradientLine(gradientLine, type) &&
          validateColorStopList(colorStopList, type, opt);
        if (valid) {
          const res: Gradient = {
            value,
            type,
            colorStopList,
            gradientLine
          };
          setCache(cacheKey, res);
          return res;
        }
      }
    }
    setCache(cacheKey, null);
    return null;
  }
  return null;
};

/**
 * is CSS gradient
 * @param value
 * @param [opt]
 * @returns result
 */
export const isGradient = (value: string, opt: Options = {}): boolean => {
  const gradient = parseGradient(value, opt);
  return gradient !== null;
};
