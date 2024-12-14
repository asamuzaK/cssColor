/**
 * util.js
 */

import { isString } from './common.js';

/* constants */
import { NAMED_COLORS } from './color.js';
import { SYN_COLOR_TYPE, SYN_MIX } from './constant.js';

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
