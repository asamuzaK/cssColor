/**
 * util.js
 */

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
