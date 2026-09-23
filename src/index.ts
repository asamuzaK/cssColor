/*!
 * CSS color - Resolve, parse, convert CSS color.
 * @license MIT
 * @copyright asamuzaK (Kazz)
 * @see {@link https://github.com/asamuzaK/cssColor/blob/main/LICENSE}
 */

import { cssCalc, cssVar } from './resolvers/css-calc-var';
import { isGradient } from './gradients/gradient';
import { isColor } from './resolvers/resolve';
import {
  extractDashedIdent,
  resolveLengthInPixels,
  splitValue
} from './utils/util';

export { convert } from './converters/convert';
export { resolve } from './resolvers/resolve';
export { resolveGradient } from './gradients/gradient';

/* utils */
export const utils = {
  cssCalc,
  cssVar,
  extractDashedIdent,
  isColor,
  isGradient,
  resolveLengthInPixels,
  splitValue
};
