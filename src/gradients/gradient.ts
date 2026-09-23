/**
 * gradient
 */

import { Options } from '../typedef';
import { parseGradient } from './parse-gradient';

/* constants */
import { VAL_SPEC } from '../utils/constant';

/**
 * resolve CSS gradient
 * @param value - CSS value
 * @param [opt] - options
 * @returns result
 */
export const resolveGradient = (value: string, opt: Options = {}): string => {
  const options = {
    ...opt
  };
  const gradient = parseGradient(value, options);
  if (gradient) {
    const { type = '', gradientLine = '', colorStopList = [] } = gradient;
    if (gradientLine) {
      return `${type}(${gradientLine}, ${colorStopList.join(', ')})`;
    }
    return `${type}(${colorStopList.join(', ')})`;
  }
  if (options.format === VAL_SPEC) {
    return '';
  }
  return 'none';
};

/**
 * is CSS gradient
 * @param value - CSS value
 * @param [opt] - options
 * @returns result
 */
export const isGradient = (value: string, opt: Options = {}): boolean => {
  const options = {
    ...opt
  };
  return !!parseGradient(value, options);
};
