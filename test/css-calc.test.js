/**
 * css-calc.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'mocha';

/* test */
import * as csscalc from '../src/js/css-calc.js';

describe('resolve dimension', () => {
  const func = csscalc.resolveDimension;

  beforeEach(() => {
    csscalc.cachedResults.clear();
  });
  afterEach(() => {
    csscalc.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not an array.');
  });

  it('should get null', () => {
    const res = func([]);
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100em',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: undefined
      }
    ];
    const res = func(token);
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100em',
      40,
      44,
      {
        value: undefined,
        signCharacter: undefined,
        type: 'integer',
        unit: 'em'
      }
    ];
    const res = func(token);
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100em',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'em'
      }
    ];
    const res = func(token);
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const token = [
      'dimension-token',
      '100px',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'px'
      }
    ];
    const res = func(token);
    assert.strictEqual(res, '100px', 'result');
  });

  it('should get value', () => {
    const token = [
      'dimension-token',
      '100px',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'em'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 16
      }
    });
    assert.strictEqual(res, '1600px', 'result');
  });

  it('should get value', () => {
    const token = [
      'dimension-token',
      '100px',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'em'
      }
    ];
    const unitMap = {
      em: 12,
      rem: 16,
      vw: 10.26
    };
    const resolver = arg => unitMap[arg];
    const res = func(token, {
      dimension: {
        callback: resolver
      }
    });
    assert.strictEqual(res, '1200px', 'result');
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100ch',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'ch'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100ex',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'ex'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100lh',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'lh'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '10rch',
      40,
      44,
      {
        value: 10,
        signCharacter: undefined,
        type: 'integer',
        unit: 'rch'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '10rex',
      40,
      44,
      {
        value: 10,
        signCharacter: undefined,
        type: 'integer',
        unit: 'rex'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100rlh',
      40,
      45,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'rlh'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100em',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'em'
      }
    ];
    const res = func(token, {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, null, 'result');
  });
});

describe('parse tokens', () => {
  const func = csscalc.parseTokens;

  beforeEach(() => {
    csscalc.cachedResults.clear();
  });
  afterEach(() => {
    csscalc.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not an array.');
  });

  it('should throw', () => {
    assert.throws(() => func(['foo']), TypeError, 'foo is not an array.');
  });

  it('should get value', () => {
    const tokens = [
      ['function-token', 'color-mix(', 0, 9, { value: 'color-mix' }],
      ['ident-token', 'in', 10, 11, { value: 'in' }],
      ['whitespace-token', ' ', 12, 12, undefined],
      ['ident-token', 'srgb', 13, 16, { value: 'srgb' }],
      ['comma-token', ',', 17, 17, undefined],
      ['whitespace-token', ' ', 18, 18, undefined],
      ['ident-token', 'red', 19, 21, { value: 'red' }],
      ['whitespace-token', ' ', 22, 22, undefined],
      ['function-token', 'calc(', 23, 27, { value: 'calc' }],
      ['whitespace-token', ' ', 28, 28, undefined],
      ['comment', '/* comment */', 29, 41, undefined],
      ['whitespace-token', ' ', 42, 42, undefined],
      [
        'percentage-token',
        '50%',
        43,
        45,
        { value: 50, signCharacter: undefined }
      ],
      ['whitespace-token', ' ', 46, 46, undefined],
      ['delim-token', '+', 47, 47, { value: '+' }],
      ['whitespace-token', ' ', 48, 48, undefined],
      ['(-token', '(', 49, 49, undefined],
      ['function-token', 'sign(', 50, 54, { value: 'sign' }],
      [
        'dimension-token',
        '100em',
        55,
        59,
        {
          value: 100,
          signCharacter: undefined,
          type: 'integer',
          unit: 'em'
        }
      ],
      ['whitespace-token', ' ', 60, 60, undefined],
      ['delim-token', '-', 61, 61, { value: '-' }],
      ['whitespace-token', ' ', 62, 62, undefined],
      [
        'dimension-token',
        '1px',
        63,
        65,
        { value: 1, signCharacter: undefined, type: 'integer', unit: 'px' }
      ],
      [')-token', ')', 66, 66, undefined],
      ['whitespace-token', ' ', 67, 67, undefined],
      ['delim-token', '*', 68, 68, { value: '*' }],
      ['whitespace-token', ' ', 69, 69, undefined],
      [
        'percentage-token',
        '10%',
        70,
        72,
        { value: 10, signCharacter: undefined }
      ],
      [')-token', ')', 73, 73, undefined],
      [')-token', ')', 74, 74, undefined],
      ['comma-token', ',', 75, 75, undefined],
      ['whitespace-token', ' ', 76, 76, undefined],
      ['ident-token', 'blue', 77, 80, { value: 'blue' }],
      [')-token', ')', 81, 81, undefined],
      ['EOF-token', '', -1, -1, undefined]
    ];
    const res = func(tokens);
    assert.deepEqual(res, [
      'color-mix(', 'in', ' ', 'srgb', ',', ' ', 'red', ' ', 'calc(', '50%',
      ' ', '+', ' ', '(', 'sign(', '100em', ' ', '-', ' ', '1px', ')', ' ',
      '*', ' ', '10%', ')', ')', ',', ' ', 'blue', ')'
    ], 'result');
  });

  it('should get value', () => {
    const tokens = [
      ['whitespace-token', ' ', 12, 12, undefined],
      [')-token', ')', 66, 66, undefined],
      ['whitespace-token', ' ', 67, 67, undefined],
      [')-token', ')', 73, 73, undefined],
    ];
    const res = func(tokens);
    assert.deepEqual(res, [
      ')',
      ')'
    ], 'result');
  });
});

describe('resolve CSS calc()', () => {
  const func = csscalc.cssCalc;

  beforeEach(() => {
    csscalc.cachedResults.clear();
  });
  afterEach(() => {
    csscalc.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string.');
  });

  it('should get value', () => {
    assert.throws(() => func('var(--foo)'), SyntaxError,
      'Unexpected token var( found.');
  });

  it('should get value', () => {
    const res = func('var(--foo)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'var(--foo)', 'result');
  });

  it('should get value', () => {
    const res = func('');
    assert.strictEqual(res, '', 'result');
  });

  it('should get value', () => {
    const res = func('foo');
    assert.strictEqual(res, 'foo', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, red calc( /* comment */ 50% + (sign(100em - 1px) * 10%)), blue)', {
      dimension: {
        em: 16
      }
    });
    assert.strictEqual(res, 'color-mix(in srgb, red 60%, blue)', 'result');

    const res2 = func('color-mix(in srgb, red calc( /* comment */ 50% + (sign(100em - 1px) * 10%)), blue)', {
      dimension: {
        em: 16
      }
    });
    assert.strictEqual(res2, 'color-mix(in srgb, red 60%, blue)', 'result');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50% + (sign(100em - 1px) * 10%))', {
      dimension: {
        em: 16
      }
    });
    assert.strictEqual(res, '60%', 'result');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50% + (sign(100em - 1px) * 10%))', {
      dimension: {
        em: 16
      },
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(60%)', 'result');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50em * calc(2 / 3))', {
      dimension: {
        em: 16
      }
    });
    assert.strictEqual(res, '533.333px', 'result');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50em * calc(2 / 3))', {
      dimension: {
        em: 16
      },
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(33.3333em)', 'result');
  });

  it('should get value', () => {
    const res = func('calc(100% - 100px)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(100% - 100px)', 'result');
  });

  it('should get value', () => {
    const res = func('abs(sign(-0.5) * 2px / 3)');
    assert.strictEqual(res, '0.666667px', 'result');
  });

  it('should get value', () => {
    const res = func('acos(1)');
    assert.strictEqual(res, '0deg', 'result');
  });

  it('should get value', () => {
    const res = func('acos(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0deg)', 'result');
  });

  it('should get value', () => {
    const res = func('acos(-1)');
    assert.strictEqual(res, '180deg', 'result');
  });

  it('should get value', () => {
    const res = func('acos(-1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(180deg)', 'result');
  });

  it('should get value', () => {
    const res = func('acos(-1.5)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(NaN * 1deg)', 'result');
  });

  it('should get value', () => {
    const res = func('asin(1)');
    assert.strictEqual(res, '90deg', 'result');
  });

  it('should get value', () => {
    const res = func('asin(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(90deg)', 'result');
  });

  it('should get value', () => {
    const res = func('asin(-1)');
    assert.strictEqual(res, '-90deg', 'result');
  });

  it('should get value', () => {
    const res = func('asin(-1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(-90deg)', 'result');
  });

  it('should get value', () => {
    const res = func('asin(-1.5)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(NaN * 1deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan(1)');
    assert.strictEqual(res, '45deg', 'result');
  });

  it('should get value', () => {
    const res = func('atan(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(45deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan(-1)');
    assert.strictEqual(res, '-45deg', 'result');
  });

  it('should get value', () => {
    const res = func('atan(-1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(-45deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan(infinity)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(90deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan2(37.320508075, 10)');
    assert.strictEqual(res, '75deg', 'result');
  });

  it('should get value', () => {
    const res = func('atan2(37.320508075, 10)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(75deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan2(1s, 1000ms)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(45deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan2(infinity, infinity)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(45deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan2(-infinity, -infinity)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(-135deg)', 'result');
  });

  it('should get value', () => {
    const res = func('calc(asin(sin(pi/2)))');
    assert.strictEqual(res, '90deg', 'result');
  });

  it('should get value', () => {
    const res = func('calc(asin(sin(30deg + 1.0471967rad ) ))');
    assert.strictEqual(res, '90deg', 'result');
  });

  it('should get value', () => {
    const res = func('cos(0)');
    assert.strictEqual(res, '1', 'result');
  });

  it('should get value', () => {
    const res = func('cos(0)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('sin(0)');
    assert.strictEqual(res, '0', 'result');
  });

  it('should get value', () => {
    const res = func('sin(0)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0)', 'result');
  });

  it('should get value', () => {
    const res = func('tan(0)');
    assert.strictEqual(res, '0', 'result');
  });

  it('should get value', () => {
    const res = func('tan(0)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0)', 'result');
  });

  it('should get value', () => {
    const res = func('sin(30deg)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('cos(60deg)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('tan(45deg)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('clamp(1px, 2px, 3px)');
    assert.strictEqual(res, '2px', 'result');
  });

  it('should get value', () => {
    const res = func('clamp(1px, 2px, 3px)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(2px)', 'result');
  });

  it('should get value', () => {
    const res = func('clamp(30px, 100px, 20px)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(30px)', 'result');
  });

  it('should get value', () => {
    const res = func('clamp(1px, 1em, 1vh)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'clamp(1px, 1em, 1vh)', 'result');
  });

  it('should get value', () => {
    const res = func('exp(0)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('log(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0)', 'result');
  });

  it('should get value', () => {
    const res = func('pow(1, 1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('hypot(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('sqrt(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('round(1.1, 1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('mod(1, 1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0)', 'result');
  });

  it('should get value', () => {
    const res = func('rem(1, 1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0)', 'result');
  });

  it('should get value', () => {
    const res = func('min(1px, 2px)');
    assert.strictEqual(res, '1px', 'result');
  });

  it('should get value', () => {
    const res = func('min(1px, 2px)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1px)', 'result');
  });
});
