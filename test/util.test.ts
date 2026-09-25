/**
 * util.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/utils/cache';
import { MAX_LENGTH, VAL_MIX, VAL_SPEC } from '../src/utils/constant';
import * as util from '../src/utils/util';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('get max length', () => {
  const func = util.getMaxLength;

  it('should return default max length when value is not a string', () => {
    assert.strictEqual(func(), MAX_LENGTH);
  });

  it('should return default max length when maxLength exceeds', () => {
    const opt = { maxLength: 1025 };
    assert.strictEqual(func(opt), MAX_LENGTH);
  });

  it('should return default max length when maxLength equals default', () => {
    const opt = { maxLength: 1024 };
    assert.strictEqual(func(opt), MAX_LENGTH);
  });

  it('should respect maxLength option when within limit', () => {
    const opt = { maxLength: 1023 };
    assert.strictEqual(func(opt), 1023);
  });
});

describe('split value', () => {
  const func = util.splitValue;

  it('should throw TypeError if value is not a string', () => {
    assert.throws(() => func(123 as any), TypeError);
  });

  it('should return empty array if value exceeds max length', () => {
    const value = 'a'.repeat(11);
    const res = func(value, { maxLength: 10 });
    assert.deepEqual(res, []);
  });

  it('should split value by whitespace by default', () => {
    const res = func('10px 20px 30px');
    assert.deepEqual(res, ['10px', '20px', '30px']);
  });

  it('should split value by comma delimiter', () => {
    const res = func('red, green, blue', { delimiter: ',' });
    assert.deepEqual(res, ['red', 'green', 'blue']);
  });

  it('should split value by slash delimiter', () => {
    const res = func('10px / 20px', { delimiter: '/' });
    assert.deepEqual(res, ['10px', '20px']);
  });

  it('should not split inside nested parenthesis or function calls', () => {
    const res = func('rgb(255, 0, 0) calc(100% - 10px)');
    assert.deepEqual(res, ['rgb(255, 0, 0)', 'calc(100% - 10px)']);
  });

  it('should strip comments by default', () => {
    const res = func('/* comment */ 10px 20px');
    assert.deepEqual(res, ['10px', '20px']);
  });

  it('should preserve comments when preserveComment is true', () => {
    const resComma = func('10px /* c */, 20px', {
      delimiter: ',',
      preserveComment: true
    });
    assert.deepEqual(resComma, ['10px /* c */', '20px']);

    const resSlash = func('10px /* c */ / 20px', {
      delimiter: '/',
      preserveComment: true
    });
    assert.deepEqual(resSlash, ['10px /* c */', '20px']);
  });

  it('should ignore preserveComment if delimiter is invalid', () => {
    const resSpace = func('10px /* c */ 20px', {
      delimiter: ' ',
      preserveComment: true
    });
    assert.deepEqual(resSpace, ['10px', '20px']);
  });

  it('should not preserve comments if preserveComment is false', () => {
    const resComma = func('10px /* c */, 20px', {
      delimiter: ',',
      preserveComment: false
    });
    assert.deepEqual(resComma, ['10px', '20px']);
  });

  it('should skip whitespace when currentStr already ends with space', () => {
    const res = func('a /* c */  b, d', { delimiter: ',' });
    assert.deepEqual(res, ['a b', 'd']);
  });

  it('should return cached result on second call with same params', () => {
    const res1 = func('10px 20px');
    const res2 = func('10px 20px');
    assert.strictEqual(res1, res2, 'should return cached instance');
  });
});

describe('extract dashed ident', () => {
  const func = util.extractDashedIdent;

  it('should throw TypeError if value is not a string', () => {
    assert.throws(() => func(123 as any), TypeError);
  });

  it('should return empty array if value is trimmed to empty string', () => {
    const res = func(' ');
    assert.deepEqual(res, []);
  });

  it('should extract dashed idents from string', () => {
    const res = func('var(--foo) var(--bar)');
    assert.deepEqual(res, ['--foo', '--bar']);
  });

  it('should remove duplicate dashed idents', () => {
    const res = func('--foo --bar --foo --baz');
    assert.deepEqual(res, ['--foo', '--bar', '--baz']);
  });

  it('should return empty array if no dashed idents found', () => {
    const res = func('foo bar baz');
    assert.deepEqual(res, []);
  });

  it('should return cached result on second call', () => {
    const res1 = func('var(--test)');
    const res2 = func('var(--test)');
    assert.strictEqual(res1, res2, 'should return cached instance');
  });
});

describe('round to precision', () => {
  const func = util.roundToPrecision;

  it('should throw TypeError if value is not a finite number', () => {
    assert.throws(() => func(NaN), TypeError);
  });

  it('should throw TypeError if bit is not a finite number', () => {
    assert.throws(() => func(1.234, NaN), TypeError);
  });

  it('should throw RangeError if bit is out of range', () => {
    assert.throws(() => func(1.234, -1), RangeError);
    assert.throws(() => func(1.234, 17), RangeError);
  });

  it('should round to nearest integer when bit is 0', () => {
    assert.strictEqual(func(1.4), 1);
    assert.strictEqual(func(1.5), 2);
  });

  it('should format precision based on bit value', () => {
    assert.strictEqual(func(12.34567, 8), 12.35);
    assert.strictEqual(func(12.34567, 10), 12.346);
    assert.strictEqual(func(12.34567, 16), 12.3457);
  });
});

describe('interpolate hue', () => {
  const func = util.interpolateHue;

  it('should throw TypeError if hueA is not a finite number', () => {
    assert.throws(() => func(NaN, 100), TypeError);
  });

  it('should throw TypeError if hueB is not a finite number', () => {
    assert.throws(() => func(100, NaN), TypeError);
  });

  it('should interpolate hue using shorter arc by default', () => {
    assert.deepEqual(func(10, 200), [370, 200]);
    assert.deepEqual(func(200, 10), [200, 370]);
    assert.deepEqual(func(10, 50), [10, 50]);
  });

  it('should interpolate hue using longer arc', () => {
    assert.deepEqual(func(10, 100, 'longer'), [370, 100]);
    assert.deepEqual(func(100, 10, 'longer'), [100, 370]);
    assert.deepEqual(func(10, 200, 'longer'), [10, 200]);
  });

  it('should interpolate hue using increasing arc', () => {
    assert.deepEqual(func(200, 10, 'increasing'), [200, 370]);
    assert.deepEqual(func(10, 200, 'increasing'), [10, 200]);
  });

  it('should interpolate hue using decreasing arc', () => {
    assert.deepEqual(func(10, 200, 'decreasing'), [370, 200]);
    assert.deepEqual(func(200, 10, 'decreasing'), [200, 10]);
  });
});

describe('resolve length in pixels', () => {
  const func = util.resolveLengthInPixels;

  it('should return NaN if value exceeds max length', () => {
    const value = 'a'.repeat(11);
    const res = func(value, null, { maxLength: 10 });
    assert.strictEqual(Number.isNaN(res), true);
  });

  it('should resolve absolute font size keywords', () => {
    const opt = { dimension: { rem: 16 } } as any;
    assert.strictEqual(func('medium', undefined, opt), 16);
    assert.strictEqual(func('large', undefined, opt), 18);
  });

  it('should resolve relative font size keywords', () => {
    const opt = { dimension: { em: 16 } } as any;
    assert.strictEqual(func('larger', undefined, opt), 19.2);
  });

  it('should return NaN for unknown string keywords', () => {
    assert.isNaN(func('unknown', undefined));
  });

  it('should resolve absolute length units', () => {
    assert.strictEqual(func(10, 'px'), 10);
    assert.strictEqual(func(1, 'in'), 96);
    assert.strictEqual(func(1, 'pt'), 96 / 72);
  });

  it('should resolve relative length units using dimension options', () => {
    const opt = { dimension: { em: 16, rem: 16 } } as any;
    assert.strictEqual(func(2, 'rem', opt), 32);
    assert.strictEqual(func(2, 'em', opt), 32);
    assert.strictEqual(func(2, 'ex', opt), 16);
  });

  it('should resolve viewport length units', () => {
    const opt = { dimension: { vh: 100, vw: 200 } } as any;
    assert.strictEqual(func(10, 'vh', opt), 1000);
    assert.strictEqual(func(10, 'vw', opt), 2000);
    assert.strictEqual(func(10, 'vmin', opt), 1000);
    assert.strictEqual(func(10, 'vmax', opt), 2000);
    assert.strictEqual(func(10, 'vb', opt), 1000);
    assert.strictEqual(func(10, 'vi', opt), 2000);
  });

  it('should use callback in dimension options if provided', () => {
    const opt = {
      dimension: {
        callback: (unit: string) => (unit === 'custom' ? 10 : NaN)
      }
    } as any;
    assert.strictEqual(func(2, 'custom', opt), 20);
  });

  it('should return NaN for unsupported units or invalid values', () => {
    assert.isNaN(func(10, 'unknown_unit'));
    assert.isNaN(func(NaN, 'px'));
  });

  it('should resolve relative length units scaled by rem option', () => {
    const opt = { dimension: { rem: 16 } } as any;
    assert.strictEqual(func(2, 'rch', opt), 16);
    assert.strictEqual(func(2, 'rlh', opt), 38.4);
  });

  it('should call callback function and handle fallback to NaN', () => {
    const optValid = {
      dimension: {
        callback: (u: string) => (u === 'custom' ? 10 : Number.NaN)
      }
    } as any;
    assert.strictEqual(func(2, 'custom', optValid), 20);

    const optNull = {
      dimension: {
        callback: () => null
      }
    } as any;
    assert.isNaN(func(2, 'unknown', optNull));

    const optUndefined = {
      dimension: {
        callback: () => undefined
      }
    } as any;
    assert.isNaN(func(2, 'unknown', optUndefined));
  });
});

describe('angle to deg', () => {
  const func = util.angleToDeg;

  it('should throw TypeError if input is not a string', () => {
    assert.throws(() => func(180 as any), TypeError);
  });

  it('should throw SyntaxError if string does not match angle pattern', () => {
    assert.throws(() => func('invalid'), SyntaxError);
    assert.throws(() => func('100px'), SyntaxError);
  });

  it('should convert various units to deg correctly', () => {
    assert.strictEqual(func('180deg'), 180);
    assert.strictEqual(func('180'), 180);
    assert.strictEqual(func('200grad'), 180);
    assert.strictEqual(func(`${Math.PI}rad`), 180);
    assert.strictEqual(func('0.5turn'), 180);
  });

  it('should normalize negative angles and handle -0', () => {
    assert.strictEqual(func('-90deg'), 270);
    assert.strictEqual(func('-0deg'), 0);
  });

  it('should wrap around angles greater than or equal to 360', () => {
    assert.strictEqual(func('360deg'), 0);
    assert.strictEqual(func('450deg'), 90);
  });
});

describe('number to hex string', () => {
  const func = util.numberToHexString;

  it('should throw TypeError if value is not a finite number', () => {
    assert.throws(() => func(NaN), TypeError);
  });

  it('should throw RangeError if value is out of 0-255 range', () => {
    assert.throws(() => func(-1), RangeError);
    assert.throws(() => func(256), RangeError);
  });

  it('should convert number to 2-digit hex string', () => {
    assert.strictEqual(func(0), '00');
    assert.strictEqual(func(15), '0f');
    assert.strictEqual(func(16), '10');
    assert.strictEqual(func(255), 'ff');
  });
});

describe('parse alpha', () => {
  const func = util.parseAlpha;

  it('should return 1 when input is empty string or not a string', () => {
    assert.strictEqual(func(''), 1);
    assert.strictEqual(func(), 1);
    assert.strictEqual(func(123 as any), 1);
  });

  it('should return 0 when input is "none"', () => {
    assert.strictEqual(func('none'), 0);
  });

  it('should parse percentage alpha correctly', () => {
    assert.strictEqual(func('50%'), 0.5);
    assert.strictEqual(func('100%'), 1);
    assert.strictEqual(func('0%'), 0);
  });

  it('should parse number alpha correctly and round to 3 decimals', () => {
    assert.strictEqual(func('0.5'), 0.5);
    assert.strictEqual(func('0.33333'), 0.333);
  });

  it('should clamp alpha values between 0 and 1', () => {
    assert.strictEqual(func('1.5'), 1);
    assert.strictEqual(func('150%'), 1);
    assert.strictEqual(func('-0.5'), 0);
  });

  it('should throw TypeError if parsed alpha is not a finite number', () => {
    assert.throws(() => func('invalid'), TypeError);
  });
});

describe('parse hex alpha', () => {
  const func = util.parseHexAlpha;

  it('should throw TypeError if input is not a string', () => {
    assert.throws(() => func(123 as any), TypeError);
  });

  it('should throw SyntaxError if input is an empty string', () => {
    assert.throws(() => func(''), SyntaxError);
  });

  it('should return 0 for hex values representing 0 or less', () => {
    assert.strictEqual(func('00'), 0);
  });

  it('should return 1 for hex values representing 255 or more', () => {
    assert.strictEqual(func('ff'), 1);
    assert.strictEqual(func('FF'), 1);
  });

  it('should parse mapped exact percentage hex values correctly', () => {
    assert.strictEqual(func('80'), 0.5);
    assert.strictEqual(func('40'), 0.25);
  });

  it('should parse non-mapped hex values rounded to PPTH precision', () => {
    assert.strictEqual(func('41'), 0.255);
  });
});

describe('cache invalid color value', () => {
  const func = util.cacheInvalidColorValue;

  it('should return and cache empty string when format is VAL_SPEC', () => {
    const key = 'invalid_spec_key';
    const res = func(key, VAL_SPEC);
    assert.strictEqual(res, '');
    assert.strictEqual(lruCache.get(key)?.item, '');
  });

  it('should return and cache null when nullable is true', () => {
    const key = 'invalid_nullable_key';
    const res = func(key, 'rgb', true);
    assert.isNull(res);
    assert.isNull(lruCache.get(key)?.item);
  });

  it('should return and cache default fallback channels array', () => {
    const key = 'invalid_default_key';
    const res = func(key, 'rgb', false);
    const expected = ['rgb', 0, 0, 0, 0];
    assert.deepEqual(res, expected);
    assert.deepEqual(lruCache.get(key)?.item, expected);
  });
});

describe('resolve invalid color value', () => {
  const func = util.resolveInvalidColorValue;

  it('should return null for hsl, hwb, or VAL_MIX formats', () => {
    assert.isNull(func('hsl'));
    assert.isNull(func('hwb'));
    assert.isNull(func(VAL_MIX));
  });

  it('should return empty string when format is VAL_SPEC', () => {
    assert.strictEqual(func(VAL_SPEC), '');
  });

  it('should return null for default format when nullable is true', () => {
    assert.isNull(func('rgb', true));
  });

  it('should return fallback channels for non-nullable format', () => {
    assert.deepEqual(func('rgb', false), ['rgb', 0, 0, 0, 0]);
    assert.deepEqual(func('hex'), ['rgb', 0, 0, 0, 0]);
  });
});
