/**
 * gradient-position
 */

import { tokenize, TokenType } from '@csstools/css-tokenizer';
import { LENGTH } from '../utils/constant';

const REG_LENGTH = new RegExp(`^(?:${LENGTH})$`, 'i');
const REG_CALC = /^(?:calc|min|max|clamp)\(/i;
const REG_CONSTANT = /^(?:e|pi|NaN|infinity|-infinity)$/i;

/**
 * Validate a calculation in a length-percentage context. A type is represented
 * by its length exponent, with percentages receiving the length percent hint.
 * Numbers have exponent 0; a valid stop position must have exponent 1.
 * @param value - stop position
 * @returns whether the calculation has type length-percentage
 */
export const isLengthPercentageCalculation = (value: string): boolean => {
  if (!REG_CALC.test(value)) {
    return false;
  }
  let invalid = false;
  const tokens = tokenize(
    { css: value },
    {
      onParseError: () => {
        invalid = true;
      }
    }
  );
  let index = 0;
  const skipWhitespace = (): void => {
    while (
      tokens[index]![0] === TokenType.Whitespace ||
      tokens[index]![0] === TokenType.Comment
    ) {
      index++;
    }
  };
  const hasWhitespace = (start: number, step: number): boolean => {
    for (let i = start; i >= 0 && i < tokens.length; i += step) {
      if (tokens[i]![0] === TokenType.Whitespace) {
        return true;
      }
      if (tokens[i]![0] !== TokenType.Comment) {
        break;
      }
    }
    return false;
  };
  function parseValue(): number | null {
    skipWhitespace();
    if (tokens[index]![0] === TokenType.EOF) {
      return null;
    }
    const token = tokens[index++]!;
    switch (token[0]) {
      case TokenType.Number:
        return 0;
      case TokenType.Percentage:
        return 1;
      case TokenType.Dimension:
        return REG_LENGTH.test(token[4].unit) ? 1 : null;
      case TokenType.Ident:
        return REG_CONSTANT.test(token[4].value) ? 0 : null;
      case TokenType.OpenParen:
      case TokenType.Function: {
        const name =
          token[0] === TokenType.Function
            ? token[4].value.toLowerCase()
            : 'calc';
        if (!['calc', 'min', 'max', 'clamp'].includes(name)) {
          return null;
        }
        const types = [parseSum()];
        while (tokens[index]![0] === TokenType.Comma) {
          index++;
          types.push(parseSum());
        }
        if (
          tokens[index]![0] !== TokenType.CloseParen ||
          types.includes(null) ||
          (name === 'calc' && types.length !== 1) ||
          (name === 'clamp' && types.length !== 3) ||
          !types.every(type => type === types[0])
        ) {
          return null;
        }
        index++;
        return types[0]!;
      }
      default:
        return null;
    }
  }
  function parseProduct(): number | null {
    let type = parseValue();
    if (type === null) {
      return null;
    }
    skipWhitespace();
    while (
      tokens[index]![0] === TokenType.Delim &&
      (tokens[index]![1] === '*' || tokens[index]![1] === '/')
    ) {
      const operator = tokens[index++]![1];
      const right = parseValue();
      if (right === null) {
        return null;
      }
      type += operator === '*' ? right : -right;
      skipWhitespace();
    }
    return type;
  }
  function parseSum(): number | null {
    const type = parseProduct();
    if (type === null) {
      return null;
    }
    while (
      tokens[index]![0] === TokenType.Delim &&
      (tokens[index]![1] === '+' || tokens[index]![1] === '-')
    ) {
      if (!hasWhitespace(index - 1, -1) || !hasWhitespace(index + 1, 1)) {
        return null;
      }
      index++;
      if (parseProduct() !== type) {
        return null;
      }
    }
    return type;
  }
  const type = parseValue();
  skipWhitespace();
  return !invalid && type === 1 && tokens[index]![0] === TokenType.EOF;
};
