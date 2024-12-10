/**
 * util.js
 */

/**
 * stringify options
 * @param {object} opt - options
 * @param {boolean} func - stringify function
 * @returns {string} - stringified options
 */
export const stringifyOptions = (opt = {}, func = false) => {
  const res = JSON.stringify(opt, (key, value) => {
    let replacedValue;
    if (typeof value === 'function') {
      if (func) {
        replacedValue = value.toString();
      } else {
        replacedValue = value.name;
      }
    } else if (value instanceof Map || value instanceof Set) {
      replacedValue = [...value];
    } else if (typeof value === 'bigint') {
      replacedValue = value.toString();
    } else {
      replacedValue = value;
    }
    return replacedValue;
  });
  return res;
};
