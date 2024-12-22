/**
 * util.js
 */

import { isString } from './common.js';

/* constants */
import { NAMED_COLORS } from './color.js';
import { SYN_COLOR_TYPE, SYN_MIX } from './constant.js';
const DEG = 360;
const DEG_HALF = 180;

/* regexp */
const REG_COLOR = new RegExp(`^(?:${SYN_COLOR_TYPE})$`);
const REG_MIX = new RegExp(`${SYN_MIX}`);

/**
 * is color
 * @param {string} value - value
 * @returns {boolean} - result
 */
export const isColor = value => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
    if (value) {
      if (/^[a-z]+$/.test(value)) {
        if (/^(?:currentcolor|transparent)$/.test(value) ||
            Object.prototype.hasOwnProperty.call(NAMED_COLORS, value)) {
          return true;
        }
      } else if (REG_COLOR.test(value) || REG_MIX.test(value)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * value to JSON string
 * @param {*} value - value
 * @param {boolean} func - stringify function
 * @returns {string} - stringified value in JSON notation
 */
export const valueToJsonString = (value, func = false) => {
  if (typeof value === 'undefined') {
    return '';
  }
  const res = JSON.stringify(value, (key, val) => {
    let replacedValue;
    if (typeof val === 'undefined') {
      replacedValue = null;
    } else if (typeof val === 'function') {
      if (func) {
        replacedValue = val.toString();
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
 * interpolate hue
 * @param {number} hueA - hue
 * @param {number} hueB - hue
 * @param {string} arc - arc
 * @returns {Array} - [hueA, hueB]
 */
export const interpolateHue = (hueA, hueB, arc = 'shorter') => {
  if (!Number.isFinite(hueA)) {
    throw new TypeError(`${hueA} is not a number.`)
  }
  if (!Number.isFinite(hueB)) {
    throw new TypeError(`${hueB} is not a number.`)
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
