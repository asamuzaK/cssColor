/**
 * gradient-util
 */

import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { isValidColor, resolveColor } from '../resolvers/resolve-color';
import { Options, ValidateGradientLine, ValidateColorStops } from '../typedef';
import { isString } from '../utils/common';
import { cssCalc } from '../utils/css-calc-var';
import { isLengthPercentageCalculation } from '../utils/length-percentage';
import { parseCalcComponents, splitValue } from '../utils/util';

/* constants */
import {
  ANGLE,
  CS_HUE,
  CS_RECT,
  GRADIENT,
  LENGTH,
  NUM,
  NUM_POSITIVE,
  PCT,
  VAL_SPEC
} from '../utils/constant';
const { Function: FUNC } = TokenType;
const DIM_ANGLE = `${NUM}(?:${ANGLE})`;
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
  `(?:${BLOCK})\\s+(?:${DIM_LEN_PCT})\\s+(?:${AXIS_Y})\\s+(?:${DIM_LEN_PCT})`,
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
const IS_GRADIENT = new RegExp(`^${GRADIENT}$`, 'i');
const IS_LENGTH = new RegExp(`^(?:${LENGTH})$`, 'i');
const IS_TO_BOTTOM = /^to\s+bottom$/i;
const LINE_CONIC = [
  new RegExp(
    `^${FROM_ANGLE}(?:\\s+${AT_POSITION})?(?:\\s+${IN_COLOR_SPACE})?$`,
    'i'
  ),
  new RegExp(`^${AT_POSITION}(?:\\s+${IN_COLOR_SPACE})?$`, 'i'),
  new RegExp(
    `^${IN_COLOR_SPACE}(?:\\s+${FROM_ANGLE})?(?:\\s+${AT_POSITION})?$`,
    'i'
  )
];
const LINE_LINEAR = [
  new RegExp(
    `^(?:${DIM_ANGLE}|${TO_SIDE_CORNER})(?:\\s+${IN_COLOR_SPACE})?$`,
    'i'
  ),
  new RegExp(
    `^${IN_COLOR_SPACE}(?:\\s+(?:${DIM_ANGLE}|${TO_SIDE_CORNER}))?$`,
    'i'
  )
];
const LINE_RADIAL = [
  new RegExp(
    `^(?:${RAD_SHAPE})(?:\\s+(?:${RAD_SIZE}))?(?:\\s+${AT_POSITION})?(?:\\s+${IN_COLOR_SPACE})?$`,
    'i'
  ),
  new RegExp(
    `^(?:${RAD_SIZE})(?:\\s+(?:${RAD_SHAPE}))?(?:\\s+${AT_POSITION})?(?:\\s+${IN_COLOR_SPACE})?$`,
    'i'
  ),
  new RegExp(`^${AT_POSITION}(?:\\s+${IN_COLOR_SPACE})?$`, 'i'),
  new RegExp(
    `^${IN_COLOR_SPACE}(?:\\s+${RAD_SHAPE})(?:\\s+(?:${RAD_SIZE}))?(?:\\s+${AT_POSITION})?$`,
    'i'
  ),
  new RegExp(
    `^${IN_COLOR_SPACE}(?:\\s+${RAD_SIZE})(?:\\s+(?:${RAD_SHAPE}))?(?:\\s+${AT_POSITION})?$`,
    'i'
  ),
  new RegExp(`^${IN_COLOR_SPACE}(?:\\s+${AT_POSITION})?$`, 'i')
];

/**
 * get gradient type
 * @param value - gradient value
 * @returns gradient type
 */
export const getGradientType = (value: string): string => {
  if (isString(value)) {
    const trimmed = value.trim();
    if (trimmed) {
      const tokens = tokenize({ css: trimmed });
      const [firstToken] = tokens;
      if (firstToken && firstToken[0] === FUNC) {
        const fnName = firstToken[1].slice(0, -1).toLowerCase();
        if (IS_GRADIENT.test(fnName)) {
          return fnName;
        }
      }
    }
  }
  return '';
};

/**
 * validate linear-gradient line
 * @param value - line value
 * @returns result
 */
export const validateLinearGradientLine = (
  value: string
): ValidateGradientLine => {
  if (!isString(value)) {
    return { line: '', valid: false };
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return { line: '', valid: true };
  }
  const parts = parseCalcComponents(trimmed);
  if (parts.length === 0) {
    return { line: value, valid: false };
  }
  const cleaned = parts.join(' ');
  const valid = LINE_LINEAR.some(reg => reg.test(cleaned));
  if (!valid) {
    return { line: value, valid: false };
  }
  const normalized = cleaned.replace(/\s+/g, ' ').trim();
  if (IS_TO_BOTTOM.test(normalized)) {
    return { line: '', valid: true };
  }
  const line = normalized
    .replace(/^to\sbottom\s/i, '')
    .replace(/\sto\sbottom$/i, '')
    .trim();
  return { line, valid: true };
};

/**
 * validate radial-gradient line
 * @param value - line value
 * @returns result
 */
export const validateRadialGradientLine = (
  value: string
): ValidateGradientLine => {
  if (!isString(value)) {
    return { line: '', valid: false };
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return { line: '', valid: true };
  }
  const parts = parseCalcComponents(trimmed);
  if (parts.length === 0) {
    return { line: value, valid: false };
  }
  const cleaned = parts.join(' ');
  const valid = LINE_RADIAL.some(reg => reg.test(cleaned));
  if (!valid) {
    return { line: value, valid: false };
  }
  let line = cleaned;
  for (const defaultValue of DEFAULT_RADIAL) {
    line = line.replace(defaultValue, '');
  }
  line = line.replace(/\s{2,}/g, ' ').trim();
  return { line, valid: true };
};

/**
 * validate conic-gradient line
 * @param value - line value
 * @returns result
 */
export const validateConicGradientLine = (
  value: string
): ValidateGradientLine => {
  if (!isString(value)) {
    return { line: '', valid: false };
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return { line: '', valid: true };
  }
  const parts = parseCalcComponents(trimmed);
  if (parts.length === 0) {
    return { line: value, valid: false };
  }
  const cleaned = parts.join(' ');
  const valid = LINE_CONIC.some(reg => reg.test(cleaned));
  if (!valid) {
    return { line: value, valid: false };
  }
  let line = cleaned;
  for (const defaultValue of DEFAULT_CONIC) {
    line = line.replace(defaultValue, '');
  }
  line = line.replace(/\s{2,}/g, ' ').trim();
  return { line, valid: true };
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
    const trimmedValue = value.trim();
    const trimmedType = type.trim();
    if (IS_LINEAR.test(trimmedType)) {
      return validateLinearGradientLine(trimmedValue);
    }
    if (IS_RADIAL.test(trimmedType)) {
      return validateRadialGradientLine(trimmedValue);
    }
    if (IS_CONIC.test(trimmedType)) {
      return validateConicGradientLine(trimmedValue);
    }
  }
  return { line: value, valid: false };
};

/**
 * Split a color stop into its original component values.
 * @param value - color stop or transition hint
 * @returns color and position components, retaining comments inside functions
 */
export const splitColorStop = (value: string): string[] => {
  const parts = parseCalcComponents(value);
  return parts;
};

/**
 * Validate a position in a gradient color stop or transition hint.
 * @param value - original position component
 * @param isConic - whether the gradient uses angle-percentage positions
 * @returns whether the position is valid in this gradient context
 */
export const isValidPosition = (value: string, isConic: boolean): boolean => {
  if (!isString(value)) {
    return false;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  const tokens = tokenize({ css: trimmed });
  const meaningfulTokens = tokens.filter(
    token =>
      token[0] !== TokenType.Whitespace &&
      token[0] !== TokenType.Comment &&
      token[0] !== TokenType.EOF
  );
  if (meaningfulTokens.length === 1) {
    const token = meaningfulTokens[0]!;
    const [type, val, , , detail] = token;
    if (type === TokenType.Number) {
      return !isConic && Number(val) === 0;
    }
    if (type === TokenType.Percentage) {
      return true;
    }
    if (type === TokenType.Dimension) {
      const unit = (detail as { unit: string }).unit.toLowerCase();
      if (isConic) {
        return ANGLE.split('|').some(u => new RegExp(`^${u}$`, 'i').test(unit));
      }
      return IS_LENGTH.test(unit);
    }
    return false;
  }
  if (!isConic) {
    return isLengthPercentageCalculation(trimmed);
  }
  return false;
};

/**
 * validate color stop list
 * @param list - color stop list
 * @param type - gradient type
 * @param [opt] - options
 * @returns validated result
 */
export const validateColorStopList = (
  list: string[],
  type: string,
  opt: Options = {}
): ValidateColorStops => {
  if (!Array.isArray(list) || list.length <= 1) {
    return { colorStops: list, valid: false };
  }
  const isConic = IS_CONIC.test(type);
  const valueList: string[] = [];
  // State tracker: 'color' or 'hint'
  let prevType = '';
  for (const [i, item] of list.entries()) {
    if (!isString(item)) {
      return { colorStops: list, valid: false };
    }
    const parts = splitColorStop(item);
    const [firstPart, ...posParts] = parts;
    if (!firstPart || parts.length > 3) {
      return { colorStops: list, valid: false };
    }
    if (parts.length === 1 && isValidPosition(firstPart, isConic)) {
      // Color hint
      if (i === 0 || prevType === 'hint') {
        return { colorStops: list, valid: false };
      }
      prevType = 'hint';
      // Resolve calc() expressions and clean up comments
      const resolvedHint = isLengthPercentageCalculation(firstPart)
        ? cssCalc(firstPart, opt)
        : firstPart;
      valueList.push(resolvedHint);
      continue;
    }
    // Color stop (1 color + 0 to 2 stop positions)
    const resolvedPosParts: string[] = [];
    for (const position of posParts) {
      if (!isValidPosition(position, isConic)) {
        return { colorStops: list, valid: false };
      }
      // Resolve calc() expressions and clean up comments
      const resolvedPosition = isLengthPercentageCalculation(position)
        ? cssCalc(position, opt)
        : position;
      resolvedPosParts.push(resolvedPosition);
    }
    const color = splitValue(firstPart).join(' ');
    if (!isValidColor(color, COLOR_OPT)) {
      return { colorStops: list, valid: false };
    }
    const resolvedColor = resolveColor(color, opt);
    if (!resolvedColor || !isValidColor(resolvedColor, COLOR_OPT)) {
      return { colorStops: list, valid: false };
    }
    prevType = 'color';
    const resolvedItem =
      resolvedPosParts.length > 0
        ? `${resolvedColor} ${resolvedPosParts.join(' ')}`
        : resolvedColor;
    valueList.push(resolvedItem);
  }
  // The last item must be a color, not a hint
  if (prevType !== 'color') {
    return { colorStops: list, valid: false };
  }
  return { colorStops: valueList, valid: true };
};
