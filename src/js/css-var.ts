/**
 * css-var
 */

import { CSSToken, TokenType, tokenize } from '@csstools/css-tokenizer';
import { CacheItem, LRUCache, NullObject } from './cache';
import { isString } from './common';
import { cssCalc } from './css-calc';
import { isColor, valueToJsonString } from './util';
import { Options } from './typedef';

/* constants */
import { FN_VAR, SYN_FN_CALC, SYN_FN_VAR, VAL_SPEC } from './constant';
const {
  CloseParen: PAREN_CLOSE,
  Comment: COMMENT,
  EOF,
  Ident: IDENT,
  Whitespace: W_SPACE
} = TokenType;

/* regexp */
const REG_FN_CALC = new RegExp(SYN_FN_CALC);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * resolve custom property
 * @param tokens - CSS tokens
 * @param [opt] - options
 * @returns result - [tokens, resolvedValue]
 */
export function resolveCustomProperty(
  tokens: CSSToken[],
  opt: Options = {}
): [CSSToken[], string] {
  if (!Array.isArray(tokens)) {
    throw new TypeError(`${tokens} is not an array.`);
  }
  const { customProperty = {} } = opt;
  const items: string[] = [];
  while (tokens.length) {
    const token = tokens.shift();
    if (!Array.isArray(token)) {
      throw new TypeError(`${token} is not an array.`);
    }
    const [type = '', value = ''] = token as [TokenType, string];
    // end of var()
    if (type === PAREN_CLOSE) {
      break;
    }
    // nested var()
    if (value === FN_VAR) {
      const [restTokens, item] = resolveCustomProperty(tokens, opt);
      tokens = restTokens;
      if (item) {
        items.push(item);
      }
    } else if (type === IDENT) {
      if (value.startsWith('--')) {
        let item;
        if (Object.hasOwnProperty.call(customProperty, value)) {
          item = customProperty[value] as string;
        } else if (typeof customProperty.callback === 'function') {
          item = customProperty.callback(value);
        }
        if (item) {
          items.push(item);
        }
      } else if (value) {
        items.push(value);
      }
    }
  }
  let resolveAsColor = false;
  if (items.length > 1) {
    const lastValue = items[items.length - 1];
    resolveAsColor = isColor(lastValue);
  }
  let resolvedValue = '';
  for (let item of items) {
    item = item.trim();
    if (REG_FN_VAR.test(item)) {
      // recurse cssVar()
      const resolvedItem = cssVar(item, opt);
      if (isString(resolvedItem)) {
        if (resolveAsColor) {
          if (isColor(resolvedItem)) {
            resolvedValue = resolvedItem;
          }
        } else {
          resolvedValue = resolvedItem;
        }
      }
    } else if (REG_FN_CALC.test(item)) {
      item = cssCalc(item, opt);
      if (resolveAsColor) {
        if (isColor(item)) {
          resolvedValue = item;
        }
      } else {
        resolvedValue = item;
      }
    } else if (
      item &&
      !/^(?:inherit|initial|revert(?:-layer)?|unset)$/.test(item)
    ) {
      if (resolveAsColor) {
        if (isColor(item)) {
          resolvedValue = item;
        }
      } else {
        resolvedValue = item;
      }
    }
    if (resolvedValue) {
      break;
    }
  }
  return [tokens, resolvedValue];
}

/**
 * parse tokens
 * @param tokens - CSS tokens
 * @param [opt] - options
 * @returns parsed tokens
 */
export function parseTokens(
  tokens: CSSToken[],
  opt: Options = {}
): string[] | NullObject {
  const res: string[] = [];
  while (tokens.length) {
    const token = tokens.shift();
    const [type = '', value = ''] = token as [TokenType, string];
    if (value === FN_VAR) {
      const [restTokens, resolvedValue] = resolveCustomProperty(tokens, opt);
      if (!resolvedValue) {
        return new NullObject();
      }
      tokens = restTokens;
      res.push(resolvedValue);
    } else {
      switch (type) {
        case PAREN_CLOSE: {
          if (res.length) {
            const lastValue = res[res.length - 1];
            if (lastValue === ' ') {
              res.splice(-1, 1, value);
            } else {
              res.push(value);
            }
          } else {
            res.push(value);
          }
          break;
        }
        case W_SPACE: {
          if (res.length) {
            const lastValue = res[res.length - 1];
            if (
              isString(lastValue) &&
              !lastValue.endsWith('(') &&
              lastValue !== ' '
            ) {
              res.push(value);
            }
          }
          break;
        }
        default: {
          if (type !== COMMENT && type !== EOF) {
            res.push(value);
          }
        }
      }
    }
  }
  return res;
}

/**
 * resolve CSS var()
 * @param value - color value including var()
 * @param [opt] - options
 * @returns resolved value
 */
export function cssVar(value: string, opt: Options = {}): string | NullObject {
  const { dimension = {}, customProperty = {}, format = '' } = opt;
  if (isString(value)) {
    if (!REG_FN_VAR.test(value) || format === VAL_SPEC) {
      return value;
    }
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  let cacheKey = '';
  if (
    typeof customProperty.callback !== 'function' &&
    typeof dimension.callback !== 'function'
  ) {
    cacheKey = `{cssVar:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      const cachedResult = cachedResults.get(cacheKey) as CacheItem;
      if (cachedResult.isNull) {
        return cachedResult as NullObject;
      }
      return cachedResult.item as string;
    }
  }
  const tokens = tokenize({ css: value });
  const values = parseTokens(tokens, opt);
  if (Array.isArray(values)) {
    let color = values.join('');
    if (REG_FN_CALC.test(color)) {
      color = cssCalc(color, opt);
    }
    if (cacheKey) {
      cachedResults.set(cacheKey, new CacheItem(color));
    }
    return color;
  } else {
    const nullObj = new NullObject();
    if (cacheKey) {
      cachedResults.set(cacheKey, nullObj);
    }
    return nullObj;
  }
}
