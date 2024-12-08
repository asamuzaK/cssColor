/**
 * util.js
 */

/**
 * stringify options
 * @param {object} opt - options
 * @returns {string} - stringified options
 */
export const stringifyOptions = (opt = {}) => {
  const clone = structuredClone(opt);
  if (opt?.cssCalc?.globals instanceof Map) {
    clone.cssCalc.globals = [...opt.cssCalc.globals];
  }
  return JSON.stringify(clone);
};
