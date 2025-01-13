/**
 * relative-color.js
 */

import { color as colorParser } from '@csstools/css-color-parser';
import { parseComponentValue } from '@csstools/css-parser-algorithms';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { LRUCache } from 'lru-cache';
import { isString } from './common';
import { colorToRgb } from './convert';
import { resolveDimension, serializeCalc } from './css-calc';
import { resolve } from './resolve';
import { roundToPrecision, valueToJsonString } from './util';

/* constants */
import {
  CS_LAB,
  CS_LCH,
  FN_REL,
  FN_REL_CAPT,
  FN_VAR,
  NONE,
  SYN_COLOR_TYPE,
  SYN_FN_MATH,
  SYN_FN_VAR,
  SYN_MIX,
  VAL_SPEC
} from './constant';
import { NAMED_COLORS } from './color';

const {
  CloseParen: PAREN_CLOSE,
  Comment: COMMENT,
  Dimension: DIM,
  EOF,
  Function: FUNC,
  Ident: IDENT,
  Number: NUM,
  OpenParen: PAREN_OPEN,
  Percentage: PCT,
  Whitespace: W_SPACE
} = TokenType;
const NONE_KEY = 'has-none-keywords';
const OCT = 8;
const DEC = 10;
const HEX = 16;
const MAX_PCT = 100;
const MAX_RGB = 255;

/* regexp */
const REG_COLOR_CAPT = new RegExp(
  `^${FN_REL}(${SYN_COLOR_TYPE}|${SYN_MIX})\\s+`
);
const REG_CS_HSL = /(?:hsla?|hwb)$/;
const REG_CS_CIE = new RegExp(`^(?:${CS_LAB}|${CS_LCH})$`);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);
const REG_REL = new RegExp(FN_REL);
const REG_REL_CAPT = new RegExp(`^${FN_REL_CAPT}`);
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
 * @param {string} [opt.colorSpace] - color space
 * @returns {?Array.<string>} - resolved channels
 */
export function resolveColorChannels(
  tokens: Array<Array<any>>,
  opt: {
    colorSpace?: string;
  } = {}
) {
  if (!Array.isArray(tokens)) {
    throw new TypeError(`${tokens} is not an array.`);
  }
  const { colorSpace, format } = opt as Record<string, any>;
  const colorChannels = new Map([
    ['color', ['r', 'g', 'b', 'alpha']],
    ['hsl', ['h', 's', 'l', 'alpha']],
    ['hsla', ['h', 's', 'l', 'alpha']],
    ['hwb', ['h', 'w', 'b', 'alpha']],
    ['lab', ['l', 'a', 'b', 'alpha']],
    ['lch', ['l', 'c', 'h', 'alpha']],
    ['oklab', ['l', 'a', 'b', 'alpha']],
    ['oklch', ['l', 'c', 'h', 'alpha']],
    ['rgb', ['r', 'g', 'b', 'alpha']],
    ['rgba', ['r', 'g', 'b', 'alpha']]
  ]);
  const colorChannel = colorChannels.get(colorSpace)!;
  const mathFunc = new Set();
  const channels = [[], [], [], []] as Array<Array<any>>;
  let i = 0;
  let nest = 0;
  let func = false;
  while (tokens.length) {
    const token = tokens.shift();
    if (!Array.isArray(token)) {
      throw new TypeError(`${token} is not an array.`);
    }
    const [type, value, , , detail = {}] = token;
    const { value: numValue } = detail;
    const channel = channels[i]!;
    switch (type) {
      case DIM: {
        let resolvedValue = resolveDimension(token, opt as never);
        if (!resolvedValue) {
          resolvedValue = value;
        }
        channel.push(resolvedValue);
        break;
      }
      case FUNC: {
        channel.push(value);
        func = true;
        nest++;
        if (REG_START_MATH.test(value)) {
          mathFunc.add(nest);
        }
        break;
      }
      case IDENT: {
        // invalid channel key
        if (!colorChannel.includes(value)) {
          return null;
        }
        channel.push(value);
        if (!func) {
          i++;
        }
        break;
      }
      case NUM: {
        channel.push(numValue);
        if (!func) {
          i++;
        }
        break;
      }
      case PAREN_OPEN: {
        channel.push(value);
        nest++;
        break;
      }
      case PAREN_CLOSE: {
        if (func) {
          const lastValue = channel[channel.length - 1];
          if (lastValue === ' ') {
            channel.splice(-1, 1, value);
          } else {
            channel.push(value);
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
        channel.push(numValue / MAX_PCT);
        if (!func) {
          i++;
        }
        break;
      }
      case W_SPACE: {
        if (channel.length && func) {
          const lastValue = channel[channel.length - 1];
          if (typeof lastValue === 'number') {
            channel.push(value);
          } else if (
            isString(lastValue) &&
            !lastValue.endsWith('(') &&
            lastValue !== ' '
          ) {
            channel.push(value);
          }
        }
        break;
      }
      default: {
        if (type !== COMMENT && type !== EOF && func) {
          channel.push(value);
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
      const resolvedValue = serializeCalc(channel.join('') as never, {
        format
      });
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
export function extractOriginColor(
  value: string,
  opt: {
    currentColor?: string;
  } = {}
) {
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
  const { currentColor, format } = opt as Record<string, any>;
  const cacheKey = `{preProcess:${value},opt:${valueToJsonString(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  if (/currentcolor/.test(value)) {
    if (currentColor) {
      value = value.replace(/currentcolor/g, currentColor);
    } else {
      if (cacheKey) {
        cachedResults.set(cacheKey, null!);
      }
      return null;
    }
  }
  const [, colorSpace] = REG_REL_CAPT.exec(value) as unknown as [
    string,
    string
  ];
  (opt as Record<string, string>).colorSpace = colorSpace;
  if (REG_COLOR_CAPT.test(value)) {
    const [, originColor] = REG_COLOR_CAPT.exec(value) as unknown as [
      string,
      string
    ];
    const [, restValue] = value.split(originColor);
    if (/^[a-z]+$/.test(originColor)) {
      if (
        !/^transparent$/.test(originColor) &&
        !Object.prototype.hasOwnProperty.call(NAMED_COLORS, originColor)
      ) {
        if (cacheKey) {
          cachedResults.set(cacheKey, null!);
        }
        return null;
      }
    } else if (format === VAL_SPEC) {
      const resolvedOriginColor = resolve(originColor, opt) as string;
      value = value.replace(originColor, resolvedOriginColor);
    }
    if (format === VAL_SPEC) {
      const tokens = tokenize({ css: restValue as never });
      const channelValues = resolveColorChannels(tokens, opt as never);
      if (!Array.isArray(channelValues)) {
        if (cacheKey) {
          cachedResults.set(cacheKey, null!);
        }
        return null;
      }
      let channelValue;
      if (channelValues.length === 3) {
        channelValue = ` ${channelValues.join(' ')})`;
      } else {
        const [v1, v2, v3, v4] = channelValues;
        channelValue = ` ${v1} ${v2} ${v3} / ${v4})`;
      }
      value = value.replace(restValue!, channelValue);
    }
    // nested relative color
  } else {
    const [, restValue] = value.split(REG_START_REL) as unknown as [
      string,
      string
    ];
    if (REG_START_REL.test(restValue)) {
      const tokens = tokenize({ css: restValue });
      let originColor = [];
      let nest = 0;
      while (tokens.length) {
        const token = tokens.shift();
        const [type, tokenValue] = token as [TokenType, string];
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
            const lastValue = originColor[originColor.length - 1]!;
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
      originColor = resolveRelativeColor(
        originColor.join('').trim(),
        opt as never
      ) as never;

      if (!originColor) {
        if (cacheKey) {
          cachedResults.set(cacheKey, null!);
        }
        return null;
      }
      const channelValues = resolveColorChannels(tokens, opt as never);
      if (!Array.isArray(channelValues)) {
        if (cacheKey) {
          cachedResults.set(cacheKey, null!);
        }
        return null;
      }
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
export function resolveRelativeColor(
  value: string,
  opt: {
    format?: string;
  } = {}
): string | null {
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
    return cachedResults.get(cacheKey) as never;
  }
  value = extractOriginColor(value, opt as never) as never;
  if (!value) {
    if (cacheKey) {
      cachedResults.set(cacheKey, null!);
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
  const parsedComponents = colorParser(components as never);
  if (!parsedComponents) {
    if (cacheKey) {
      cachedResults.set(cacheKey, null!);
    }
    return null;
  }
  let {
    alpha,
    channels: [v1, v2, v3],

    colorNotation,

    syntaxFlags
  } = parsedComponents;
  if (Number.isNaN(alpha)) {
    if (syntaxFlags.has(NONE_KEY as never)) {
      alpha = NONE as never;
    } else {
      alpha = 0;
    }
  } else {
    alpha = roundToPrecision(alpha as never, OCT);
  }
  let resolvedValue;
  if (REG_CS_CIE.test(colorNotation)) {
    if (Number.isNaN(v1)) {
      if (syntaxFlags.has(NONE_KEY as never)) {
        v1 = NONE as never;
      } else {
        v1 = 0;
      }
    } else {
      v1 = roundToPrecision(v1, HEX);
    }
    if (Number.isNaN(v2)) {
      if (syntaxFlags.has(NONE_KEY as never)) {
        v2 = NONE as never;
      } else {
        v2 = 0;
      }
    } else {
      v2 = roundToPrecision(v2, HEX);
    }
    if (Number.isNaN(v3)) {
      if (syntaxFlags.has(NONE_KEY as never)) {
        v3 = NONE as never;
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
    let [r, g, b] = colorToRgb(
      `${colorNotation}(${v1} ${v2} ${v3} / ${alpha})`
    );
    r = roundToPrecision(r! / MAX_RGB, DEC);
    g = roundToPrecision(g! / MAX_RGB, DEC);
    b = roundToPrecision(b! / MAX_RGB, DEC);
    if (alpha === 1) {
      resolvedValue = `color(srgb ${r} ${g} ${b})`;
    } else {
      resolvedValue = `color(srgb ${r} ${g} ${b} / ${alpha})`;
    }
  } else {
    const cs = colorNotation === 'rgb' ? 'srgb' : colorNotation;
    if (Number.isNaN(v1)) {
      if (syntaxFlags.has(NONE_KEY as never)) {
        v1 = NONE as never;
      } else {
        v1 = 0;
      }
    } else {
      v1 = roundToPrecision(v1, DEC);
    }
    if (Number.isNaN(v2)) {
      if (syntaxFlags.has(NONE_KEY as never)) {
        v2 = NONE as never;
      } else {
        v2 = 0;
      }
    } else {
      v2 = roundToPrecision(v2, DEC);
    }
    if (Number.isNaN(v3)) {
      if (syntaxFlags.has(NONE_KEY as never)) {
        v3 = NONE as never;
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
