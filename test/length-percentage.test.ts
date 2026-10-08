/**
 * length-percentage.test
 */

/* api */
import { tokenize, TokenType } from '@csstools/css-tokenizer';
import { assert, describe, it } from 'vitest';

/* test */
import { CalculationState } from '../src/typedef';
import * as calculation from '../src/utils/length-percentage';

const createState = (value: string): CalculationState => ({
  tokens: tokenize({ css: value }),
  index: 0
});

describe('skip calculation whitespace', () => {
  const func = calculation.skipCalculationWhitespace;

  it('should skip whitespace and comments before a value', () => {
    const state = createState(' \t/**/ 1px');
    func(state);
    assert.strictEqual(state.tokens[state.index]![1], '1px');
  });

  it('should stop at EOF after trailing whitespace and comments', () => {
    const state = createState(' /**/ ');
    func(state);
    assert.strictEqual(state.tokens[state.index]![0], TokenType.EOF);
    const index = state.index;
    func(state);
    assert.strictEqual(state.index, index);
  });

  it('should not advance past an operand', () => {
    const state = createState('1px');
    func(state);
    assert.strictEqual(state.index, 0);
  });
});

describe('has calculation whitespace', () => {
  const func = calculation.hasCalculationWhitespace;

  it('should find actual whitespace through comments in either direction', () => {
    const { tokens } = createState('1px /**/+/**/ 2px');
    const operator = tokens.findIndex(token => token[1] === '+');
    assert.isTrue(func(tokens, operator - 1, -1));
    assert.isTrue(func(tokens, operator + 1, 1));
  });

  it('should not treat comments as whitespace or scan past an operand', () => {
    const { tokens } = createState(' 1px/**/+/**/2px ');
    const operator = tokens.findIndex(token => token[1] === '+');
    assert.isFalse(func(tokens, operator - 1, -1));
    assert.isFalse(func(tokens, operator + 1, 1));
  });

  it('should stop at token stream boundaries', () => {
    const { tokens } = createState('/**/');
    assert.isFalse(func(tokens, 0, -1));
    assert.isFalse(func(tokens, -1, -1));
    assert.isFalse(func(tokens, tokens.length, 1));
  });
});

describe('parse calculation product', () => {
  const func = calculation.parseCalculationProduct;

  it.each<[string, number]>([
    ['2 * 3', 0],
    ['1px * 2', 1],
    ['2 * 1px', 1],
    ['50% / 2', 1],
    ['1px * 2 / 4', 1],
    ['2 * (1px + 2px)', 1],
    ['1px/**/ * 2', 1]
  ])('should return the product type for %s', (value, type) => {
    const state = createState(value);
    assert.strictEqual(func(state), type);
    assert.strictEqual(state.tokens[state.index]![0], TokenType.EOF);
  });

  it.each([
    '',
    '1px *',
    '1px / bananas',
    '1px * 2px',
    '1px / 2px',
    '1 / 2px',
    '1px * 2px / 1px',
    '1px / 2px * 3em'
  ])(
    'should reject a product outside the supported scalar grammar %s',
    value => {
      const state = createState(value);
      assert.isNull(func(state));
    }
  );

  it('should leave adjacent operands for the caller to reject', () => {
    const state = createState('1px * 2/**/0');
    assert.strictEqual(func(state), 1);
    assert.strictEqual(state.tokens[state.index]![1], '0');
  });

  it('should stop before addition so the sum parser can continue', () => {
    const state = createState('1px * 2 + 3px');
    assert.strictEqual(func(state), 1);
    assert.strictEqual(state.tokens[state.index]![1], '+');
  });
});

describe('parse calculation sum', () => {
  const func = calculation.parseCalculationSum;

  it.each<[string, number]>([
    ['1px + 2% - 3em', 1],
    ['1 + 2 * 3', 0],
    ['1px * 2 + 3 * 4px', 1],
    ['1px + 2px * 3', 1],
    ['1px/**/ +/**/ 2px', 1],
    ['1px - -2px', 1]
  ])('should return the sum type for %s', (value, type) => {
    const state = createState(value);
    assert.strictEqual(func(state), type);
    assert.strictEqual(state.tokens[state.index]![0], TokenType.EOF);
  });

  it.each([
    '',
    '1px + 1',
    '1px +',
    '1px + bananas',
    '1px+ 2px',
    '1px +/**/2px',
    '1px/**/+ 2px'
  ])('should reject invalid addition %s', value => {
    const state = createState(value);
    assert.isNull(func(state));
  });

  it('should stop before an argument separator', () => {
    const state = createState('1px + 2px, 3px');
    assert.strictEqual(func(state), 1);
    assert.strictEqual(state.tokens[state.index]![0], TokenType.Comma);
  });
});

describe('parse calculation value', () => {
  const func = calculation.parseCalculationValue;

  it.each<[string, number]>([
    ['2', 0],
    ['50%', 1],
    ['1px', 1],
    ['1EM', 1],
    ['pi', 0],
    ['-infinity', 0],
    ['NaN', 0],
    ['(1px + 2%)', 1],
    ['min(1px, 2%)', 1],
    ['max(1, 2)', 0],
    ['clamp(1em, 50% + 1px, 100px)', 1],
    ['calc(min(1px, max(2px, 3%)))', 1]
  ])('should return the operand type for %s', (value, type) => {
    const state = createState(value);
    assert.strictEqual(func(state), type);
    assert.strictEqual(state.tokens[state.index]![0], TokenType.EOF);
  });

  it.each([
    '',
    '1deg',
    'bananas',
    '[1px]',
    'sin(1px)',
    'calc()',
    'calc(1px, 2px)',
    'calc(1px',
    '(1px, 2px)',
    'min(1px,)',
    'min(1px, 2)',
    'max()',
    'clamp(1px, 2px)',
    'clamp(1px, 2px, 3px, 4px)'
  ])('should reject an invalid operand %s', value => {
    assert.isNull(func(createState(value)));
  });

  it.each([
    'calc(/* comment */ -infinity)',
    'calc(InFiNiTy)',
    'calc(-INFINITY)',
    'calc(NaN)',
    'calc(nan)',
    'calc(nAn)',
    'calc(NAN)'
  ])('should accept a numeric keyword case-insensitively in %s', value => {
    const state = createState(value);
    assert.strictEqual(func(state), 0);
    assert.strictEqual(state.tokens[state.index]![0], TokenType.EOF);
  });

  it.each([
    'calc(- infinity)',
    'calc(+ infinity)',
    'calc(-NaN)',
    'calc(- NaN)'
  ])('should reject a signed numeric keyword %s', value => {
    assert.isNull(func(createState(value)));
  });

  it('should leave the cursor at EOF when no operand remains', () => {
    const state = createState(' /**/ ');
    assert.isNull(func(state));
    assert.strictEqual(state.tokens[state.index]![0], TokenType.EOF);
  });

  it('should keep separate calculation cursors independent', () => {
    const first = createState('1px 2%');
    const second = createState('calc(3em)');
    assert.strictEqual(func(first), 1);
    const index = first.index;
    assert.strictEqual(func(second), 1);
    assert.strictEqual(first.index, index);
    assert.strictEqual(func(first), 1);
  });
});

describe('is length-percentage calculation', () => {
  const func = calculation.isLengthPercentageCalculation;

  it('should return false for non-string values', () => {
    for (const value of [
      undefined,
      null,
      1,
      true,
      [],
      {},
      { toString: () => 'calc(1px)' }
    ]) {
      assert.isFalse(func(value));
    }
  });

  it.each([
    'calc(100% - 24px)',
    'calc(10% + 1em)',
    'calc((100% - 2rem) / 2)',
    'calc(2 * (1px + 2vh))',
    'calc(1px * 2 / 4)',
    'calc(-2px)',
    'calc(0px)',
    'calc(calc(100% - 1em) + 2px)',
    'min(100% - 1em, 50px)',
    'max(10px, 2vw)',
    'clamp(1em, 50% + 1px, 100px)',
    'min(calc(1px), max(2%, 3em))',
    'calc(1px + -2px)',
    'calc(1px - -2px)',
    'calc(pi * 1px)',
    'calc(infinity * 1px)',
    'calc(NaN * 1px)',
    'CALC(10% + 1EM)',
    'calc(1px/**/ +/**/ 2px)'
  ])('should accept a length-percentage calculation %s', value => {
    assert.isTrue(func(value));
  });

  it.each([
    `calc(${'('.repeat(32)}1px${')'.repeat(32)})`,
    `min(${Array(32).fill('1px').join(', ')})`,
    `calc(${Array(32).fill('1px').join(' + ')})`
  ])(
    'should support at least 32 terms, arguments and nesting levels: %s',
    value => {
      assert.isTrue(func(value));
    }
  );

  it.each([
    '',
    '1px',
    '50%',
    'calc(1px)/*',
    'calc(10px + bananas)',
    'calc(100% + 20deg)',
    'calc(10px +)',
    'calc()',
    'calc(',
    'calc(1px +',
    'calc(1px *',
    'calc(1px+ 2px)',
    'calc(1px +2px)',
    'calc(1px * 2px)',
    'calc(1px / 2px)',
    'calc(1px * 2px / 1px)',
    'calc(1px / 2px * 3em)',
    'calc(2 / 1px)',
    'calc(1px + 0)',
    'calc(0)',
    'calc(10bananas * 0)',
    'calc(0deg)',
    'calc(1s)',
    'calc(1px 2px)',
    'calc(1px, 2px)',
    'calc([1px])',
    'calc(sin(1px) * 1px)',
    'calc(1px) junk',
    'min(1px,)',
    'max()',
    'clamp(1px, 2px)',
    'clamp(1px, 2px, 3px, 4px)',
    'min(1px, 1)',
    'calc(1px * 2px + 2px)',
    'calc(1px / 2px + 2px)',
    'calc(1px + (2px, 3px))',
    'calc(1px + min(2px,))',
    'calc(1px + /*unterminated)',
    'calc("unterminated)',
    'calc(1px/**/+/**/2px)',
    'calc(1p/**/x)',
    'calc(1/**/px)',
    'calc(1px * 2/**/0)',
    'calc(1px * 1/**/.5)',
    'calc(1px * 1/**/e2)',
    'calc(1px + (2px)'
  ])(
    'should reject calculations outside the supported length-percentage grammar %s',
    value => {
      assert.isFalse(func(value));
    }
  );
});
