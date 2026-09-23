/**
 * gradient-util
 */

import { isValidColor, resolveColor } from '../resolvers/resolve-color';
import {
  MatchedRegExp,
  Options,
  ValidateGradientLine,
  ValidateColorStops
} from '../typedef';
import { isString } from '../utils/common';

/* constants */
import {
  ANGLE,
  CS_HUE,
  CS_RECT,
  LENGTH,
  NUM,
  NUM_POSITIVE,
  PCT,
  VAL_SPEC
} from '../utils/constant';
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
const TO_SIDE_CORNER = `to\\s+(?:(?:${L_R})(?:\\s(?:${T_B}))?|(?:${T_B})(?:\\s(?:${L_R}))?)`;
const IN_COLOR_SPACE = `in\\s+(?:${CS_RECT}|${CS_HUE})`;
const LINE_SYNTAX_LINEAR = [
  `(?:${DIM_ANGLE}|${TO_SIDE_CORNER})(?:\\s+${IN_COLOR_SPACE})?`,
  `${IN_COLOR_SPACE}(?:\\s+(?:${DIM_ANGLE}|${TO_SIDE_CORNER}))?`
].join('|');
const LINE_SYNTAX_RADIAL = [
  `(?:${RAD_SHAPE})(?:\\s+(?:${RAD_SIZE}))?(?:\\s+${AT_POSITION})?(?:\\s+${IN_COLOR_SPACE})?`,
  `(?:${RAD_SIZE})(?:\\s+(?:${RAD_SHAPE}))?(?:\\s+${AT_POSITION})?(?:\\s+${IN_COLOR_SPACE})?`,
  `${AT_POSITION}(?:\\s+${IN_COLOR_SPACE})?`,
  `${IN_COLOR_SPACE}(?:\\s+${RAD_SHAPE})(?:\\s+(?:${RAD_SIZE}))?(?:\\s+${AT_POSITION})?`,
  `${IN_COLOR_SPACE}(?:\\s+${RAD_SIZE})(?:\\s+(?:${RAD_SHAPE}))?(?:\\s+${AT_POSITION})?`,
  `${IN_COLOR_SPACE}(?:\\s+${AT_POSITION})?`
].join('|');
const LINE_SYNTAX_CONIC = [
  `${FROM_ANGLE}(?:\\s+${AT_POSITION})?(?:\\s+${IN_COLOR_SPACE})?`,
  `${AT_POSITION}(?:\\s+${IN_COLOR_SPACE})?`,
  `${IN_COLOR_SPACE}(?:\\s+${FROM_ANGLE})?(?:\\s+${AT_POSITION})?`
].join('|');
const DEFAULT_LINEAR = [/to\s+bottom/];
const DEFAULT_RADIAL = [/ellipse/, /farthest-corner/, /at\s+center/];
const DEFAULT_CONIC = [/at\s+center/];
const COLOR_OPT = {
  format: VAL_SPEC,
  nullable: true
};

/* regexp */
const IS_CONIC = /^(?:repeating-)?conic-gradient$/;
const IS_LINEAR = /^(?:repeating-)?linear-gradient$/;
const IS_RADIAL = /^(?:repeating-)?radial-gradient$/;
const REG_COLOR_HINT_CONIC = new RegExp(`^(?:${DIM_ANGLE_PCT})$`);
const REG_COLOR_HINT_NON_CONIC = new RegExp(`^(?:${DIM_LEN_PCT})$`);
const REG_DIM_CONIC = new RegExp(`(?:\\s+(?:${DIM_ANGLE_PCT})){1,2}$`);
const REG_DIM_NON_CONIC = new RegExp(`(?:\\s+(?:${DIM_LEN_PCT})){1,2}$`);
const REG_GRAD = /^(?:repeating-)?(?:conic|linear|radial)-gradient\(/;
const REG_GRAD_CAPT = /^((?:repeating-)?(?:conic|linear|radial)-gradient)\(/;
const REG_LINE_CONIC = new RegExp(`^(?:${LINE_SYNTAX_CONIC})$`);
const REG_LINE_LINEAR = new RegExp(`^(?:${LINE_SYNTAX_LINEAR})$`);
const REG_LINE_RADIAL = new RegExp(`^(?:${LINE_SYNTAX_RADIAL})$`);

/**
 * get gradient type
 * @param value - gradient value
 * @returns gradient type
 */
export const getGradientType = (value: string): string => {
  if (isString(value)) {
    value = value.trim();
    if (REG_GRAD.test(value)) {
      const [, type] = value.match(REG_GRAD_CAPT) as MatchedRegExp;
      return type;
    }
  }
  return '';
};

/**
 * validate gradient line
 * @param value - gradient line value
 * @param type - gradient type
 * @returns result
 */
export const validateGradientLine = (
  value: string,
  type: string
): ValidateGradientLine => {
  if (isString(value) && isString(type)) {
    value = value.trim();
    type = type.trim();
    let reg: RegExp | null = null;
    let defaultValues: RegExp[] = [];

    if (IS_LINEAR.test(type)) {
      reg = REG_LINE_LINEAR;
      defaultValues = DEFAULT_LINEAR;
    } else if (IS_RADIAL.test(type)) {
      reg = REG_LINE_RADIAL;
      defaultValues = DEFAULT_RADIAL;
    } else if (IS_CONIC.test(type)) {
      reg = REG_LINE_CONIC;
      defaultValues = DEFAULT_CONIC;
    }
    if (reg) {
      const valid = reg.test(value);
      if (valid) {
        let line = value;
        for (const defaultValue of defaultValues) {
          line = line.replace(defaultValue, '');
        }
        line = line.replace(/\s{2,}/g, ' ').trim();
        return { line, valid };
      }
      return { valid, line: value };
    }
  }
  return { line: value, valid: false };
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
): ValidateColorStops => {
  if (Array.isArray(list) && list.length > 1) {
    const isConic = IS_CONIC.test(type);
    const regColorHint = isConic
      ? REG_COLOR_HINT_CONIC
      : REG_COLOR_HINT_NON_CONIC;
    const regDimension = isConic ? REG_DIM_CONIC : REG_DIM_NON_CONIC;
    const valueList: string[] = [];
    // State tracker: 'color' or 'hint'
    let prevType = '';
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (isString(item)) {
        if (regColorHint.test(item)) {
          // Hints cannot be the first item, and two hints cannot be adjacent
          if (i === 0 || prevType === 'hint') {
            return { colorStops: list, valid: false };
          }
          prevType = 'hint';
          valueList.push(item);
        } else {
          const itemColor = item.replace(regDimension, '');
          if (isValidColor(itemColor, COLOR_OPT)) {
            const resolvedColor = resolveColor(itemColor, opt) as string;
            prevType = 'color';
            valueList.push(item.replace(itemColor, resolvedColor));
          } else {
            return { colorStops: list, valid: false };
          }
        }
      } else {
        return { colorStops: list, valid: false };
      }
    }
    // The last item must be a color, not a hint
    if (prevType !== 'color') {
      return { colorStops: list, valid: false };
    }
    return { valid: true, colorStops: valueList };
  }
  return { colorStops: list, valid: false };
};
