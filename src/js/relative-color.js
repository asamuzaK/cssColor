/**
 * relative-color.js
 */

import { color as colorParser } from '@csstools/css-color-parser';
import { parseComponentValue } from '@csstools/css-parser-algorithms';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { LRUCache } from 'lru-cache';
import { isString } from './common.js';
import { colorToRgb } from './convert.js';
import { cssCalc, resolveDimension } from './css-calc.js';
import { resolve } from './resolve.js';
import { roundToPrecision, valueToJsonString } from './util.js';

/* constants */
import {
  CS_LAB, CS_LCH, FN_REL, FN_VAR, NONE, SYN_COLOR_TYPE, SYN_FN_MATH,
  SYN_FN_VAR, SYN_MIX, VAL_SPEC
} from './constant.js';
import { NAMED_COLORS } from './color.js';
const {
  CloseParen: PAREN_CLOSE, Comment: COMMENT, Dimension: DIM, EOF,
  Function: FUNC, Ident: IDENT, Number: NUM, OpenParen: PAREN_OPEN,
  Percentage: PCT, Whitespace: W_SPACE
} = TokenType;
const NONE_KEY = 'has-none-keywords';
const OCT = 8;
const DEC = 10;
const HEX = 16;
const MAX_PCT = 100;
const MAX_RGB = 255;

/* regexp */
const REG_COLOR_CAPT =
  new RegExp(`^${FN_REL}(${SYN_COLOR_TYPE}|${SYN_MIX})\\s+`);
const REG_CS_HSL = /(?:hsla?|hwb)$/;
const REG_CS_CIE = new RegExp(`^(?:${CS_LAB}|${CS_LCH})$`);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);
const REG_REL = new RegExp(FN_REL);
const REG_START_MATH = new RegExp(SYN_FN_MATH);
const REG_START_REL = new RegExp(`^${FN_REL}`);

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * resolve relative color channels
 * @param {Array.<Array>} tokens - tokens
 * @param {object} [opt] - options
 * @returns {Array.<string>} - resolved channels
 */
export function resolveColorChannels(tokens, opt = {}) {
  if (!Array.isArray(tokens)) {
    throw new TypeError(`${tokens} is not an array.`);
  }
  const mathFunc = new Set();
  const channels = [[], [], [], []];
  let i = 0;
  let nest = 0;
  let func = false;
  while (tokens.length) {
    const token = tokens.shift();
    if (!Array.isArray(token)) {
      throw new TypeError(`${token} is not an array.`);
    }
    const [type, value,,, detail = {}] = token;
    const { value: numValue } = detail;
    switch (type) {
      case DIM: {
        let resolvedValue = resolveDimension(token, opt);
        if (!resolvedValue) {
          resolvedValue = value;
        }
        channels[i].push(resolvedValue);
        break;
      }
      case FUNC: {
        channels[i].push(value);
        func = true;
        nest++;
        if (REG_START_MATH.test(value)) {
          mathFunc.add(nest);
        }
        break;
      }
      case IDENT: {
        channels[i].push(value);
        if (!func) {
          i++;
        }
        break;
      }
      case NUM: {
        channels[i].push(numValue);
        if (!func) {
          i++;
        }
        break;
      }
      case PAREN_OPEN: {
        channels[i].push(value);
        nest++;
        break;
      }
      case PAREN_CLOSE: {
        if (func) {
          const lastValue = channels[i][channels[i].length - 1];
          if (lastValue === ' ') {
            channels[i].splice(-1, 1, value);
          } else {
            channels[i].push(value);
          }
          if (mathFunc.has(nest)) {
            mathFunc.delete(nest);
          }
          nest--;
          if (nest === 0) {
            func = false;
            i++;
          }
        }
        break;
      }
      case PCT: {
        channels[i].push(numValue / MAX_PCT);
        if (!func) {
          i++;
        }
        break;
      }
      case W_SPACE: {
        if (channels[i].length && func) {
          const lastValue = channels[i][channels[i].length - 1];
          if (typeof lastValue === 'number') {
            channels[i].push(value);
          } else if (isString(lastValue) &&
                     !lastValue.endsWith('(') && lastValue !== ' ') {
            channels[i].push(value);
          }
        }
        break;
      }
      default: {
        if (type !== COMMENT && type !== EOF && func) {
          channels[i].push(value);
        }
      }
    }
  }
  const channelValues = [];
  for (const channel of channels) {
    if (channel.length === 1) {
      const [resolvedValue] = channel;
      channelValues.push(resolvedValue);
    } else if (channel.length) {
      const resolvedValue = cssCalc(channel.join(''), opt);
      channelValues.push(resolvedValue);
    }
  }
  return channelValues;
}

/**
 * extract origin color
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.currentColor] - current color value
 * @returns {?string} - value
 */
export function extractOriginColor(value, opt = {}) {
  if (isString(value)) {
    value = value.toLowerCase().trim();
    if (!value) {
      return null;
    }
    if (!REG_START_REL.test(value)) {
      return value;
    }
  } else {
    return null;
  }
  const { currentColor, format } = opt;
  const cacheKey = `{preProcess:${value},opt:${valueToJsonString(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  if (/currentcolor/.test(value)) {
    if (currentColor) {
      value = value.replace(/currentcolor/g, currentColor);
    } else {
      if (cacheKey) {
        cachedResults.set(cacheKey, null);
      }
      return null;
    }
  }
  if (REG_COLOR_CAPT.test(value)) {
    const [, originColor] = REG_COLOR_CAPT.exec(value);
    const [, restValue] = value.split(originColor);
    if (/^[a-z]+$/.test(originColor)) {
      if (!/^transparent$/.test(originColor) &&
          !Object.prototype.hasOwnProperty.call(NAMED_COLORS, originColor)) {
        if (cacheKey) {
          cachedResults.set(cacheKey, null);
        }
        return null;
      }
    } else if (format === VAL_SPEC) {
      const resolvedOriginColor = resolve(originColor, opt);
      value = value.replace(originColor, resolvedOriginColor);
    }
    if (format === VAL_SPEC) {
      const tokens = tokenize({ css: restValue });
      const channelValues = resolveColorChannels(tokens, opt);
      let channelValue;
      if (channelValues.length === 3) {
        channelValue = ` ${channelValues.join(' ')})`;
      } else {
        const [v1, v2, v3, v4] = channelValues;
        channelValue = ` ${v1} ${v2} ${v3} / ${v4})`;
      }
      value = value.replace(restValue, channelValue);
    }
  // nested relative color
  } else {
    const [, restValue] = value.split(REG_START_REL);
    if (REG_START_REL.test(restValue)) {
      const tokens = tokenize({ css: restValue });
      let originColor = [];
      let nest = 0;
      while (tokens.length) {
        const token = tokens.shift();
        const [type, tokenValue] = token;
        switch (type) {
          case FUNC:
          case PAREN_OPEN: {
            originColor.push(tokenValue);
            nest++;
            break;
          }
          case PAREN_CLOSE: {
            const lastValue = originColor[originColor.length - 1];
            if (lastValue === ' ') {
              originColor.splice(-1, 1, tokenValue);
            } else {
              originColor.push(tokenValue);
            }
            nest--;
            break;
          }
          case W_SPACE: {
            const lastValue = originColor[originColor.length - 1];
            if (!lastValue.endsWith('(') && lastValue !== ' ') {
              originColor.push(tokenValue);
            }
            break;
          }
          default: {
            if (type !== COMMENT && type !== EOF) {
              originColor.push(tokenValue);
            }
          }
        }
        if (nest === 0) {
          break;
        }
      }
      originColor = resolveRelativeColor(originColor.join('').trim(), opt);
      if (!originColor) {
        if (cacheKey) {
          cachedResults.set(cacheKey, null);
        }
        return null;
      }
      const channelValues = resolveColorChannels(tokens, opt);
      let channelValue;
      if (channelValues.length === 3) {
        channelValue = ` ${channelValues.join(' ')})`;
      } else {
        const [v1, v2, v3, v4] = channelValues;
        channelValue = ` ${v1} ${v2} ${v3} / ${v4})`;
      }
      value = value.replace(restValue, `${originColor}${channelValue}`);
    }
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, value);
  }
  return value;
}

/**
 * resolve relative color
 * @param {string} value - relative color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {?string} - value
 */
export function resolveRelativeColor(value, opt = {}) {
  const { format } = opt;
  if (isString(value)) {
    if (REG_FN_VAR.test(value)) {
      if (format === VAL_SPEC) {
        return value;
      // var() must be resolved before resolveRelativeColor()
      } else {
        throw new SyntaxError(`Unexpected token ${FN_VAR} found.`);
      }
    } else if (!REG_REL.test(value)) {
      return value;
    }
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string`);
  }
  const cacheKey = `{relativeColor:${value},opt:${valueToJsonString(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  value = extractOriginColor(value, opt);
  if (!value) {
    if (cacheKey) {
      cachedResults.set(cacheKey, null);
    }
    return null;
  }
  if (format === VAL_SPEC) {
    if (value.startsWith('rgba(')) {
      value = value.replace(/^rgba\(/, 'rgb(');
    } else if (value.startsWith('hsla(')) {
      value = value.replace(/^hsla\(/, 'hsl(');
    }
    return value;
  }
  const tokens = tokenize({ css: value });
  const components = parseComponentValue(tokens);
  let {
    alpha, channels: [v1, v2, v3], colorNotation, syntaxFlags
  } = colorParser(components);
  if (Number.isNaN(alpha)) {
    if (syntaxFlags.has(NONE_KEY)) {
      alpha = NONE;
    } else {
      alpha = 0;
    }
  } else {
    alpha = roundToPrecision(alpha, OCT);
  }
  let resolvedValue;
  if (REG_CS_CIE.test(colorNotation)) {
    if (Number.isNaN(v1)) {
      if (syntaxFlags.has(NONE_KEY)) {
        v1 = NONE;
      } else {
        v1 = 0;
      }
    } else {
      v1 = roundToPrecision(v1, HEX);
    }
    if (Number.isNaN(v2)) {
      if (syntaxFlags.has(NONE_KEY)) {
        v2 = NONE;
      } else {
        v2 = 0;
      }
    } else {
      v2 = roundToPrecision(v2, HEX);
    }
    if (Number.isNaN(v3)) {
      if (syntaxFlags.has(NONE_KEY)) {
        v3 = NONE;
      } else {
        v3 = 0;
      }
    } else {
      v3 = roundToPrecision(v3, HEX);
    }
    if (alpha === 1) {
      resolvedValue = `${colorNotation}(${v1} ${v2} ${v3})`;
    } else {
      resolvedValue = `${colorNotation}(${v1} ${v2} ${v3} / ${alpha})`;
    }
  } else if (REG_CS_HSL.test(colorNotation)) {
    if (Number.isNaN(v1)) {
      v1 = 0;
    }
    if (Number.isNaN(v2)) {
      v2 = 0;
    }
    if (Number.isNaN(v3)) {
      v3 = 0;
    }
    let [r, g, b] =
      colorToRgb(`${colorNotation}(${v1} ${v2} ${v3} / ${alpha})`);
    r = roundToPrecision(r / MAX_RGB, DEC);
    g = roundToPrecision(g / MAX_RGB, DEC);
    b = roundToPrecision(b / MAX_RGB, DEC);
    if (alpha === 1) {
      resolvedValue = `color(srgb ${r} ${g} ${b})`;
    } else {
      resolvedValue = `color(srgb ${r} ${g} ${b} / ${alpha})`;
    }
  } else {
    const cs = colorNotation === 'rgb' ? 'srgb' : colorNotation;
    if (Number.isNaN(v1)) {
      if (syntaxFlags.has(NONE_KEY)) {
        v1 = NONE;
      } else {
        v1 = 0;
      }
    } else {
      v1 = roundToPrecision(v1, DEC);
    }
    if (Number.isNaN(v2)) {
      if (syntaxFlags.has(NONE_KEY)) {
        v2 = NONE;
      } else {
        v2 = 0;
      }
    } else {
      v2 = roundToPrecision(v2, DEC);
    }
    if (Number.isNaN(v3)) {
      if (syntaxFlags.has(NONE_KEY)) {
        v3 = NONE;
      } else {
        v3 = 0;
      }
    } else {
      v3 = roundToPrecision(v3, DEC);
    }
    if (alpha === 1) {
      resolvedValue = `color(${cs} ${v1} ${v2} ${v3})`;
    } else {
      resolvedValue = `color(${cs} ${v1} ${v2} ${v3} / ${alpha})`;
    }
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, resolvedValue);
  }
  return resolvedValue;
}
