/**
 * gradient
 */

import { isValidColor, resolveColor } from '../resolvers/resolve-color';
import { ColorStopList, Gradient, Options } from '../typedef';
import { createCacheKey, getCache, setCache } from '../utils/cache';
import { isString } from '../utils/common';
import { splitValue } from '../utils/util';
import {
  getGradientType,
  validateColorStopList,
  validateGradientLine
} from './gradient-util';

/* constants */
import { ANGLE, NUM, LENGTH, PCT, VAL_SPEC } from '../utils/constant';
const NAMESPACE = 'gradient';
const DIM_ANGLE = `${NUM}(?:${ANGLE})`;
const DIM_ANGLE_PCT = `${DIM_ANGLE}|${PCT}`;
const DIM_LEN = `${NUM}(?:${LENGTH})|0`;
const DIM_LEN_PCT = `${DIM_LEN}|${PCT}`;
const COLOR_OPT = {
  format: VAL_SPEC,
  nullable: true
};

/* regexp */
const IS_CONIC = /^(?:repeating-)?conic-gradient$/;
const REG_DIM_CONIC = new RegExp(`(?:\\s+(?:${DIM_ANGLE_PCT})){1,2}$`);
const REG_DIM_NON_CONIC = new RegExp(`(?:\\s+(?:${DIM_LEN_PCT})){1,2}$`);
const REG_GRAD = /^(?:repeating-)?(?:conic|linear|radial)-gradient\(/;

/**
 * parse CSS gradient
 * @param value - gradient value
 * @param [opt] - options
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
    if (cachedResult !== false) {
      return cachedResult.item as Gradient | null;
    }
    const type = getGradientType(value);
    const gradValue = value.replace(REG_GRAD, '').replace(/\)$/, '');
    if (type && gradValue) {
      const [lineOrColorStop = '', ...itemList] = splitValue(gradValue, {
        delimiter: ','
      });
      const isConic = IS_CONIC.test(type);
      const regDimension = isConic ? REG_DIM_CONIC : REG_DIM_NON_CONIC;
      let colorStop = '';
      if (regDimension.test(lineOrColorStop)) {
        const itemColor = lineOrColorStop.replace(regDimension, '');
        if (isValidColor(itemColor, COLOR_OPT)) {
          const resolvedColor = resolveColor(itemColor, opt) as string;
          colorStop = lineOrColorStop.replace(itemColor, resolvedColor);
        }
      } else if (isValidColor(lineOrColorStop, COLOR_OPT)) {
        colorStop = resolveColor(lineOrColorStop, opt) as string;
      }
      if (colorStop) {
        itemList.unshift(colorStop);
        const { colorStops, valid } = validateColorStopList(
          itemList,
          type,
          opt
        );
        if (valid) {
          const res: Gradient = {
            value,
            type,
            colorStopList: colorStops as ColorStopList
          };
          setCache(cacheKey, res);
          return res;
        }
      } else if (itemList.length > 1) {
        const { line: gradientLine, valid: validLine } = validateGradientLine(
          lineOrColorStop,
          type
        );
        const { colorStops, valid: validColorStops } = validateColorStopList(
          itemList,
          type,
          opt
        );
        if (validLine && validColorStops) {
          const res: Gradient = {
            value,
            type,
            gradientLine,
            colorStopList: colorStops as ColorStopList
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
