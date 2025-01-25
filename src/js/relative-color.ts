/**
 * relative-color
 */

import { SyntaxFlag, color as colorParser } from '@csstools/css-color-parser';
import { parseComponentValue } from '@csstools/css-parser-algorithms';
import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import type { CSSToken } from '@csstools/css-tokenizer';
import { LRUCache } from 'lru-cache';
import { isString, isStringOrNumber } from './common';
import { colorToRgb } from './convert';
import { resolveDimension, serializeCalc } from './css-calc';
import { resolve } from './resolve';
import { NullObject, roundToPrecision, valueToJsonString } from './util';
import type { ColorChannels, Options } from './typedef';

/* constants */
import { NAMED_COLORS } from './color';
import {
  CS_LAB,
  CS_LCH,
  FN_REL,
  FN_REL_CAPT,
  FN_VAR,
  NONE,
  SYN_COLOR_TYPE,
  SYN_FN_MATH_START,
  SYN_FN_VAR,
  SYN_MIX,
  VAL_SPEC
} from './constant';
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
const { HasNoneKeywords: KEY_NONE } = SyntaxFlag;
const OCT = 8;
const DEC = 10;
const HEX = 16;
const MAX_PCT = 100;
const MAX_RGB = 255;

/* type definitions */
/**
 * @type ColorChannel - color channel
 */
type ColorChannel = (number | string)[];

/**
 * @type StringColorChannel - color channel
 */
type StringColorChannel = string[] | NullObject;

/* regexp */
const REG_COLOR_CAPT = new RegExp(
  `^${FN_REL}(${SYN_COLOR_TYPE}|${SYN_MIX})\\s+`
);
const REG_CS_HSL = /(?:hsla?|hwb)$/;
const REG_CS_CIE = new RegExp(`^(?:${CS_LAB}|${CS_LCH})$`);
const REG_FN_MATH_START = new RegExp(SYN_FN_MATH_START);
const REG_FN_REL = new RegExp(FN_REL);
const REG_FN_REL_CAPT = new RegExp(`^${FN_REL_CAPT}`);
const REG_FN_REL_START = new RegExp(`^${FN_REL}`);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * resolve relative color channels
 * @param tokens - CSS tokens
 * @param [opt] - options
 * @returns resolved color channels
 */
export function resolveColorChannels(
  tokens: CSSToken[],
  opt: Options = {}
): ColorChannel | StringColorChannel {
  if (!Array.isArray(tokens)) {
    throw new TypeError(`${tokens} is not an array.`);
  }
  const { colorSpace = '', format = '' } = opt;
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
  const colorChannel = colorChannels.get(colorSpace);
  const mathFunc = new Set();
  const channels: [ColorChannel, ColorChannel, ColorChannel, ColorChannel] = [
    [],
    [],
    [],
    []
  ];
  let i = 0;
  let nest = 0;
  let func = false;
  while (tokens.length) {
    const token = tokens.shift();
    if (!Array.isArray(token)) {
      throw new TypeError(`${token} is not an array.`);
    }
    const [type = '', value = '', , , detail = {}] = token;
    const { value: detailValue } = detail as {
      value: number;
    };
    const channel = channels[i] as ColorChannel;
    switch (type) {
      case DIM: {
        const resolvedValue = resolveDimension(token, opt);
        if (resolvedValue instanceof NullObject) {
          channel.push(value);
        } else {
          channel.push(resolvedValue);
        }
        break;
      }
      case FUNC: {
        channel.push(value);
        func = true;
        nest++;
        if (REG_FN_MATH_START.test(value)) {
          mathFunc.add(nest);
        }
        break;
      }
      case IDENT: {
        // invalid channel key
        if (!colorChannel || !colorChannel.includes(value)) {
          return new NullObject();
        }
        channel.push(value);
        if (!func) {
          i++;
        }
        break;
      }
      case NUM: {
        channel.push(detailValue);
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
        channel.push(detailValue / MAX_PCT);
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
  const channelValues: ColorChannel = [];
  for (const channel of channels) {
    if (channel.length === 1) {
      const [resolvedValue] = channel;
      if (
        isStringOrNumber(resolvedValue) &&
        typeof resolvedValue !== 'undefined'
      ) {
        channelValues.push(resolvedValue);
      }
    } else if (channel.length) {
      const resolvedValue = serializeCalc(channel.join(''), {
        format
      });
      channelValues.push(resolvedValue);
    }
  }
  return channelValues;
}

/**
 * extract origin color
 * @param value - color value
 * @param [opt] - options
 * @returns origin color value
 */
export function extractOriginColor(
  value: string,
  opt: Options = {}
): string | NullObject {
  const {
    currentColor = '',
    customProperty = {},
    dimension = {},
    format = ''
  } = opt;
  if (isString(value)) {
    value = value.toLowerCase().trim();
    if (!value) {
      return new NullObject();
    }
    if (!REG_FN_REL_START.test(value)) {
      return value;
    }
  } else {
    return new NullObject();
  }
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{preProcess:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as string | NullObject;
    }
  }
  if (/currentcolor/.test(value)) {
    if (currentColor) {
      value = value.replace(/currentcolor/g, currentColor);
    } else {
      const nullObj = new NullObject();
      if (cacheKey) {
        cachedResults.set(cacheKey, nullObj);
      }
      return nullObj;
    }
  }
  let colorSpace = '';
  if (REG_FN_REL_CAPT.test(value)) {
    [, colorSpace = ''] = value.match(REG_FN_REL_CAPT) as RegExpExecArray;
  }
  opt.colorSpace = colorSpace;
  if (REG_COLOR_CAPT.test(value)) {
    const [, originColor = ''] = value.match(REG_COLOR_CAPT) as RegExpExecArray;
    const [, restValue = ''] = value.split(originColor);
    if (/^[a-z]+$/.test(originColor)) {
      if (
        !/^transparent$/.test(originColor) &&
        !Object.prototype.hasOwnProperty.call(NAMED_COLORS, originColor)
      ) {
        const nullObj = new NullObject();
        if (cacheKey) {
          cachedResults.set(cacheKey, nullObj);
        }
        return nullObj;
      }
    } else if (format === VAL_SPEC) {
      const resolvedOriginColor = resolve(originColor, opt);
      if (isString(resolvedOriginColor)) {
        value = value.replace(originColor, resolvedOriginColor);
      }
    }
    if (format === VAL_SPEC) {
      const tokens = tokenize({ css: restValue });
      const channelValues = resolveColorChannels(
        tokens,
        opt
      ) as StringColorChannel;
      if (channelValues instanceof NullObject) {
        if (cacheKey) {
          cachedResults.set(cacheKey, channelValues);
        }
        return channelValues;
      }
      let channelValue;
      if (channelValues.length === 3) {
        channelValue = ` ${channelValues.join(' ')})`;
      } else {
        const [v1 = '', v2 = '', v3 = '', v4 = ''] = channelValues;
        channelValue = ` ${v1} ${v2} ${v3} / ${v4})`;
      }
      if (restValue !== channelValue) {
        value = value.replace(restValue, channelValue);
      }
    }
    // nested relative color
  } else {
    const [, restValue = ''] = value.split(REG_FN_REL_START);
    const tokens = tokenize({ css: restValue });
    const originColor: string[] = [];
    let nest = 0;
    while (tokens.length) {
      const [type = '', tokenValue = ''] = tokens.shift() as [
        TokenType,
        string
      ];
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
          } else if (isString(lastValue)) {
            originColor.push(tokenValue);
          }
          nest--;
          break;
        }
        case W_SPACE: {
          const lastValue = originColor[originColor.length - 1];
          if (
            isString(lastValue) &&
            !lastValue.endsWith('(') &&
            lastValue !== ' '
          ) {
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
    const resolvedOriginColor = resolveRelativeColor(
      originColor.join('').trim(),
      opt
    );
    if (resolvedOriginColor instanceof NullObject) {
      if (cacheKey) {
        cachedResults.set(cacheKey, resolvedOriginColor);
      }
      return resolvedOriginColor;
    }
    const channelValues = resolveColorChannels(
      tokens,
      opt
    ) as StringColorChannel;
    if (channelValues instanceof NullObject) {
      if (cacheKey) {
        cachedResults.set(cacheKey, channelValues);
      }
      return channelValues;
    }
    let channelValue: string;
    if (channelValues.length === 3) {
      channelValue = ` ${channelValues.join(' ')})`;
    } else {
      const [v1 = '', v2 = '', v3 = '', v4 = ''] = channelValues;
      channelValue = ` ${v1} ${v2} ${v3} / ${v4})`;
    }
    value = value.replace(restValue, `${resolvedOriginColor}${channelValue}`);
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, value);
  }
  return value;
}

/**
 * resolve relative color
 * @param value - relative color value
 * @param [opt] - options
 * @returns resolved value
 */
export function resolveRelativeColor(
  value: string,
  opt: Options = {}
): string | NullObject {
  const { customProperty = {}, dimension = {}, format = '' } = opt;
  if (isString(value)) {
    if (REG_FN_VAR.test(value)) {
      if (format === VAL_SPEC) {
        return value;
        // var() must be resolved before resolveRelativeColor()
      } else {
        throw new SyntaxError(`Unexpected token ${FN_VAR} found.`);
      }
    } else if (!REG_FN_REL.test(value)) {
      return value;
    }
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{relativeColor:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as string | NullObject;
    }
  }
  const originColor = extractOriginColor(value, opt);
  if (originColor instanceof NullObject) {
    if (cacheKey) {
      cachedResults.set(cacheKey, originColor);
    }
    return originColor;
  }
  value = originColor;
  if (format === VAL_SPEC) {
    if (value.startsWith('rgba(')) {
      value = value.replace(/^rgba\(/, 'rgb(');
    } else if (value.startsWith('hsla(')) {
      value = value.replace(/^hsla\(/, 'hsl(');
    }
    return value;
  }
  const tokens = tokenize({ css: value });
  const components = parseComponentValue(tokens) as ComponentValue;
  const parsedComponents = colorParser(components);
  if (!parsedComponents) {
    const nullObj = new NullObject();
    if (cacheKey) {
      cachedResults.set(cacheKey, nullObj);
    }
    return nullObj;
  }
  const {
    alpha: alphaComponent,
    channels: channelsComponent,
    colorNotation,
    syntaxFlags
  } = parsedComponents;
  let alpha: number | string;
  if (Number.isNaN(Number(alphaComponent))) {
    if (syntaxFlags instanceof Set && syntaxFlags.has(KEY_NONE)) {
      alpha = NONE;
    } else {
      alpha = 0;
    }
  } else {
    alpha = roundToPrecision(Number(alphaComponent), OCT);
  }
  let v1: number | string;
  let v2: number | string;
  let v3: number | string;
  [v1, v2, v3] = channelsComponent;
  let resolvedValue;
  if (REG_CS_CIE.test(colorNotation)) {
    const hasNone = syntaxFlags instanceof Set && syntaxFlags.has(KEY_NONE);
    if (Number.isNaN(v1)) {
      if (hasNone) {
        v1 = NONE;
      } else {
        v1 = 0;
      }
    } else {
      v1 = roundToPrecision(v1, HEX);
    }
    if (Number.isNaN(v2)) {
      if (hasNone) {
        v2 = NONE;
      } else {
        v2 = 0;
      }
    } else {
      v2 = roundToPrecision(v2, HEX);
    }
    if (Number.isNaN(v3)) {
      if (hasNone) {
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
    let [r, g, b] = colorToRgb(
      `${colorNotation}(${v1} ${v2} ${v3} / ${alpha})`
    ) as ColorChannels;
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
    const hasNone = syntaxFlags instanceof Set && syntaxFlags.has(KEY_NONE);
    if (Number.isNaN(v1)) {
      if (hasNone) {
        v1 = NONE;
      } else {
        v1 = 0;
      }
    } else {
      v1 = roundToPrecision(v1, DEC);
    }
    if (Number.isNaN(v2)) {
      if (hasNone) {
        v2 = NONE;
      } else {
        v2 = 0;
      }
    } else {
      v2 = roundToPrecision(v2, DEC);
    }
    if (Number.isNaN(v3)) {
      if (hasNone) {
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
