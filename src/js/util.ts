/**
 * util
 */

import { isString } from './common';
import { resolve } from './resolve';
import { Options } from './typedef';

/* constants */
import { NAMED_COLORS } from './color';
import { SYN_COLOR_TYPE, SYN_MIX, VAL_SPEC } from './constant';

/* numeric constants */
const DEC = 10;
const HEX = 16;
const DEG = 360;
const DEG_HALF = 180;

/* regexp */
const REG_COLOR = new RegExp(`^(?:${SYN_COLOR_TYPE})$`);
const REG_MIX = new RegExp(`${SYN_MIX}`);

/**
 * is color
 * @param value
 * @param [opt]
 * @returns result
 */
export const isColor = (value: unknown, opt: Options = {}): boolean => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
    if (value && isString(value)) {
      if (/^[a-z]+$/.test(value)) {
        if (
          /^(?:currentcolor|transparent)$/.test(value) ||
          Object.prototype.hasOwnProperty.call(NAMED_COLORS, value)
        ) {
          return true;
        }
      } else if (REG_COLOR.test(value) || REG_MIX.test(value)) {
        return true;
      } else {
        opt.format = VAL_SPEC;
        const resolvedValue = resolve(value, opt);
        if (resolvedValue) {
          return true;
        }
      }
    }
  }
  return false;
};

/**
 * value to JSON string
 * @param value
 * @param [func] - stringify function
 * @returns stringified value in JSON notation
 */
export const valueToJsonString = (
  value: unknown,
  func: boolean = false
): string => {
  if (typeof value === 'undefined') {
    return '';
  }
  const res = JSON.stringify(value, (_key, val) => {
    let replacedValue;
    if (typeof val === 'undefined') {
      replacedValue = null;
    } else if (typeof val === 'function') {
      if (func) {
        replacedValue = val.toString().replace(/\s/g, '').substring(0, HEX);
      } else {
        replacedValue = val.name;
      }
    } else if (val instanceof Map || val instanceof Set) {
      replacedValue = [...val];
    } else if (typeof val === 'bigint') {
      replacedValue = val.toString();
    } else {
      replacedValue = val;
    }
    return replacedValue;
  });
  return res;
};

/**
 * round to specified precision
 * @param value
 * @param bit - minimum bits
 * @returns rounded value
 */
export const roundToPrecision = (value: number, bit: number = 0): number => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${value} is not a finite number.`);
  }
  if (!Number.isFinite(bit)) {
    throw new TypeError(`${bit} is not a finite number.`);
  } else if (bit < 0 || bit > HEX) {
    throw new RangeError(`${bit} is not between 0 and ${HEX}.`);
  }
  if (bit === 0) {
    return Math.round(value);
  }
  let val;
  if (bit === HEX) {
    val = value.toPrecision(6);
  } else if (bit < DEC) {
    val = value.toPrecision(4);
  } else {
    val = value.toPrecision(5);
  }
  return parseFloat(val);
};

/**
 * interpolate hue
 * @param hueA - hue value
 * @param hueB - hue value
 * @param arc - shorter | longer | increasing | decreasing
 * @returns result - [hueA, hueB]
 */
export const interpolateHue = (
  hueA: number,
  hueB: number,
  arc: string = 'shorter'
): [number, number] => {
  if (!Number.isFinite(hueA)) {
    throw new TypeError(`${hueA} is not a finite number.`);
  }
  if (!Number.isFinite(hueB)) {
    throw new TypeError(`${hueB} is not a finite number.`);
  }
  switch (arc) {
    case 'decreasing': {
      if (hueB > hueA) {
        hueA += DEG;
      }
      break;
    }
    case 'increasing': {
      if (hueB < hueA) {
        hueB += DEG;
      }
      break;
    }
    case 'longer': {
      if (hueB > hueA && hueB < hueA + DEG_HALF) {
        hueA += DEG;
      } else if (hueB > hueA + DEG_HALF * -1 && hueB <= hueA) {
        hueB += DEG;
      }
      break;
    }
    case 'shorter':
    default: {
      if (hueB > hueA + DEG_HALF) {
        hueA += DEG;
      } else if (hueB < hueA + DEG_HALF * -1) {
        hueB += DEG;
      }
    }
  }
  return [hueA, hueB];
};
