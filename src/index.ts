/*!
 * CSS color - Resolve, parse, convert CSS color.
 * @license MIT
 * @copyright asamuzaK (Kazz)
 * @see {@link https://github.com/asamuzaK/cssColor/blob/main/LICENSE}
 */

import { isGradient } from './gradients/gradient';
import { isColor } from './resolvers/resolve';
import { cssCalc, cssVar } from './utils/css-calc-var';
import {
  extractDashedIdent,
  resolveLengthInPixels,
  splitValue
} from './utils/util';

export { convert } from './converters/convert';
export { resolveGradient } from './gradients/gradient';
export { resolve } from './resolvers/resolve';

/* Export utils */
export const utils = {
  cssCalc,
  cssVar,
  extractDashedIdent,
  isColor,
  isGradient,
  resolveLengthInPixels,
  splitValue
};
