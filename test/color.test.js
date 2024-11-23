/**
 * color.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { describe, it } from 'mocha';

/* test */
import * as color from '../src/js/color.js';

describe('validate color components', () => {
  const func = color.validateColorComponents;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([]), Error,
      'Expected array length of 3 or 4 but got 0.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1, 1], { maxLength: 3 }), Error,
      'Expected array length of 3 but got 4.');
  });

  it('should throw', () => {
    assert.throws(() => func(['foo', 1, 1]), TypeError,
      'Expected Number but got String.');
  });

  it('should throw', () => {
    assert.throws(() => func([NaN, 1, 1]), TypeError, 'NaN is not a number.');
  });

  it('should throw', () => {
    assert.throws(() => func([-1, 1, 1]), RangeError,
      '-1 is not between 0 and 1.');
  });

  it('should throw', () => {
    assert.throws(() => func([1.1, 1, 1]), RangeError,
      '1.1 is not between 0 and 1.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1, 'foo']), TypeError,
      'Expected Number but got String.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1, NaN]), TypeError,
      'NaN is not a number.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1, -1]), RangeError,
      '-1 is not between 0 and 1.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1, 1.1]), RangeError,
      '1.1 is not between 0 and 1.');
  });

  it('should throw', () => {
    assert.throws(() => func([0, 128, 256, 1], { maxRange: 255 }), RangeError,
      '256 is not between 0 and 255.');
  });

  it('should throw', () => {
    assert.throws(() => func([0, -128, 192, 1], { maxRange: 255 }), RangeError,
      '-128 is not between 0 and 255.');
  });

  it('should throw', () => {
    assert.throws(() => func([0, 128, 192, 1.1], { maxRange: 255 }),
      RangeError, '1.1 is not between 0 and 1.');
  });

  it('should throw', () => {
    assert.throws(() => func([0, 128, 192, 1], { minLength: null }),
      TypeError, 'Expected Number but got Null.');
  });

  it('should throw', () => {
    assert.throws(() => func([0, 128, 192, 1], { minLength: NaN }), TypeError,
      'NaN is not a number.');
  });

  it('should throw', () => {
    assert.throws(() => func([0, 128, 192, 1], { maxLength: null }), TypeError,
      'Expected Number but got Null.');
  });

  it('should throw', () => {
    assert.throws(() => func([0, 128, 192, 1], { maxLength: NaN }), TypeError,
      'NaN is not a number.');
  });

  it('should throw', () => {
    assert.throws(() => func([0, 128, 192, 1], { minRange: null }), TypeError,
      'Expected Number but got Null.');
  });

  it('should throw', () => {
    assert.throws(() => func([0, 128, 192, 1], { minRange: NaN }), TypeError,
      'NaN is not a number.');
  });

  it('should throw', () => {
    assert.throws(() => func([0, 128, 192, 1], { maxRange: null }), TypeError,
      'Expected Number but got Null.');
  });

  it('should throw', () => {
    assert.throws(() => func([0, 128, 192, 1], { maxRange: NaN }), TypeError,
      'NaN is not a number.');
  });

  it('should get value', () => {
    const res = func([1, 0.3, 0.7, 0.5]);
    assert.deepEqual(res, [1, 0.3, 0.7, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func([1, 0.3, 0.7]);
    assert.deepEqual(res, [1, 0.3, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func([1, -1, 1.1, 0.5], {
      validateRange: false
    });
    assert.deepEqual(res, [1, -1, 1.1, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func([1, -1, 1.1], {
      maxLength: 3,
      validateRange: false
    });
    assert.deepEqual(res, [1, -1, 1.1], 'result');
  });

  it('should get value', () => {
    const res = func([1, 0.3, 0.7]);
    assert.deepEqual(res, [1, 0.3, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func([1, 0.3, 0.7], {
      alpha: true
    });
    assert.deepEqual(res, [1, 0.3, 0.7, 1], 'result');
  });
});

describe('transform matrix', () => {
  const func = color.transformMatrix;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([]), Error,
      'Expected array length of 3 but got 0.');
  });

  it('should throw', () => {
    assert.throws(() => func(['foo', [], []]), TypeError,
      'Expected Array but got String.');
  });

  it('should throw', () => {
    assert.throws(() => func([[], [], []]), Error,
      'Expected array length of 3 but got 0.');
  });

  it('should throw', () => {
    assert.throws(() => func([[1, 0, 'foo'], [], []]), TypeError,
      'Expected Number but got String.');
  });

  it('should throw', () => {
    assert.throws(() => func([[1, 0, NaN], [], []]), TypeError,
      'NaN is not a number.');
  });

  it('should throw', () => {
    assert.throws(() => func([[1, 0, 0], [0, 1, 0], [0, 0, 1]]), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([[1, 0, 0], [0, 1, 0], [0, 0, 1]], []), Error,
      'Expected array length of 3 but got 0.');
  });

  it('should throw', () => {
    assert.throws(() => func([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ], [1, 0, 'foo']), TypeError, 'Expected Number but got String.');
  });

  it('should throw', () => {
    assert.throws(() => func([[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1, 0, NaN]),
      TypeError, 'NaN is not a number.');
  });

  it('should get value', () => {
    const res = func([[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1, 0, 0.5]);
    assert.deepEqual(res, [1, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func([[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1, 0, 0.5], true);
    assert.deepEqual(res, [1, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func([[0, 0, 1], [0, 1, 0], [1, 0, 0]], [1, 0, 0.5]);
    assert.deepEqual(res, [0.5, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func([[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1, 0.5, 0]);
    assert.deepEqual(res, [1, 0.5, 0], 'result');
  });

  it('should get value', () => {
    const res = func([[0, 0, 1], [0, 1, 0], [1, 0, 0]], [0, 0.5, 1]);
    assert.deepEqual(res, [1, 0.5, 0], 'result');
  });
});

describe('re-insert missing color components', () => {
  const func = color.reInsertMissingColorComponents;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('foo');
    assert.deepEqual(res, [undefined, undefined, undefined, undefined],
      'result');
  });

  it('should get value', () => {
    const res = func('none');
    assert.deepEqual(res, [undefined, undefined, undefined, undefined],
      'result');
  });

  it('should get value', () => {
    const res = func('rgb(4 3 2 / 1)', [1, 2, 3, 0.4]);
    assert.deepEqual(res, [1, 2, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(none 2 3 / 0.4)', [0, 2, 3, 0.4]);
    assert.deepEqual(res, ['none', 2, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(1 none 3 / 0.4)', [1, 0, 3, 0.4]);
    assert.deepEqual(res, [1, 'none', 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(1 2 none / 0.4)', [1, 2, 0, 0.4]);
    assert.deepEqual(res, [1, 2, 'none', 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(1 2 3 / none)', [1, 2, 3, 0]);
    assert.deepEqual(res, [1, 2, 3, 'none'], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb none 0.2 0.3 / 0.4)', [0, 2, 3, 0.4]);
    assert.deepEqual(res, ['none', 2, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.1 none 0.3 / 0.4)', [1, 0, 3, 0.4]);
    assert.deepEqual(res, [1, 'none', 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.1 0.2 none / 0.4)', [1, 2, 0, 0.4]);
    assert.deepEqual(res, [1, 2, 'none', 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.1 0.2 0.3 / none)', [1, 2, 3, 0.4]);
    assert.deepEqual(res, [1, 2, 3, 'none'], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(none 20% 10% / 0.4)', [1, 2, 0, 0.4]);
    assert.deepEqual(res, [1, 2, 'none', 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(3 none 10% / 0.4)', [1, 0, 3, 0.4]);
    assert.deepEqual(res, [1, 'none', 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(3 20% none / 0.4)', [0, 2, 3, 0.4]);
    assert.deepEqual(res, ['none', 2, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(3 20% 10% / none)', [1, 2, 3, 0]);
    assert.deepEqual(res, [1, 2, 3, 'none'], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(none 20% 10% / 0.4)', [1, 2, 0, 0.4]);
    assert.deepEqual(res, [1, 2, 'none', 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(90 none 10% / 0.4)', [1, 0, 3, 0.4]);
    assert.deepEqual(res, [1, 0, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(90 20% none / 0.4)', [0, 2, 3, 0.4]);
    assert.deepEqual(res, [0, 2, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(90 20% 10% / none)', [1, 2, 3, 0]);
    assert.deepEqual(res, [1, 2, 3, 'none'], 'result');
  });

  it('should get value', () => {
    const res = func('lab(none 2 3 / 0.4)', [0, 2, 3, 0.4]);
    assert.deepEqual(res, ['none', 2, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('lab(1 none 3 / 0.4)', [1, 0, 3, 0.4]);
    assert.deepEqual(res, [1, 0, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('lab(1 2 none / 0.4)', [1, 2, 0, 0.4]);
    assert.deepEqual(res, [1, 2, 0, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('lab(1 2 3 / none)', [1, 2, 3, 0]);
    assert.deepEqual(res, [1, 2, 3, 'none'], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(none 2 3 / 0.4)', [0, 2, 3, 0.4]);
    assert.deepEqual(res, ['none', 2, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(1 none 3 / 0.4)', [1, 0, 3, 0.4]);
    assert.deepEqual(res, [1, 0, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(1 2 none / 0.4)', [1, 2, 0, 0.4]);
    assert.deepEqual(res, [1, 2, 0, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(1 2 3 / none)', [1, 2, 3, 0]);
    assert.deepEqual(res, [1, 2, 3, 'none'], 'result');
  });

  it('should get value', () => {
    const res = func('lch(none 2 3 / 0.4)', [0, 2, 3, 0.4]);
    assert.deepEqual(res, ['none', 2, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('lch(1 none 3 / 0.4)', [1, 0, 3, 0.4]);
    assert.deepEqual(res, [1, 'none', 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('lch(1 2 none / 0.4)', [1, 2, 0, 0.4]);
    assert.deepEqual(res, [1, 2, 'none', 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('lch(1 2 3 / none)', [1, 2, 3, 0]);
    assert.deepEqual(res, [1, 2, 3, 'none'], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(none 2 3 / 0.4)', [0, 2, 3, 0.4]);
    assert.deepEqual(res, ['none', 2, 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(1 none 3 / 0.4)', [1, 0, 3, 0.4]);
    assert.deepEqual(res, [1, 'none', 3, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(1 2 none / 0.4)', [1, 2, 0, 0.4]);
    assert.deepEqual(res, [1, 2, 'none', 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(1 2 3 / none)', [1, 2, 3, 0]);
    assert.deepEqual(res, [1, 2, 3, 'none'], 'result');
  });
});

describe('normalize color components', () => {
  const func = color.normalizeColorComponents;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([]), Error,
      'Expected array length of 4 but got 0.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1, 1]), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1, 1], []), Error,
      'Expected array length of 4 but got 0.');
  });

  it('should get values', () => {
    const res = func([1, 2, 3, 0.4], [5, 6, 7, 0.8]);
    assert.deepEqual(res, [
      [1, 2, 3, 0.4],
      [5, 6, 7, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func(['none', 2, 3, 0.4], ['none', 6, 7, 0.8]);
    assert.deepEqual(res, [
      [0, 2, 3, 0.4],
      [0, 6, 7, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func(['none', 2, 3, 0.4], [5, 6, 7, 0.8]);
    assert.deepEqual(res, [
      [5, 2, 3, 0.4],
      [5, 6, 7, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func(['none', 2, 3, 0.4], [5, 6, 7, 0.8], true);
    assert.deepEqual(res, [
      [5, 2, 3, 0.4],
      [5, 6, 7, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func([1, 2, 3, 0.4], ['none', 6, 7, 0.8]);
    assert.deepEqual(res, [
      [1, 2, 3, 0.4],
      [1, 6, 7, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func([1, 'none', 3, 0.4], [5, 'none', 7, 0.8]);
    assert.deepEqual(res, [
      [1, 0, 3, 0.4],
      [5, 0, 7, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func([1, 'none', 3, 0.4], [5, 6, 7, 0.8]);
    assert.deepEqual(res, [
      [1, 6, 3, 0.4],
      [5, 6, 7, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func([1, 2, 3, 0.4], [5, 'none', 7, 0.8]);
    assert.deepEqual(res, [
      [1, 2, 3, 0.4],
      [5, 2, 7, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func([1, 2, 'none', 0.4], [5, 6, 'none', 0.8]);
    assert.deepEqual(res, [
      [1, 2, 0, 0.4],
      [5, 6, 0, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func([1, 2, 'none', 0.4], [5, 6, 7, 0.8]);
    assert.deepEqual(res, [
      [1, 2, 7, 0.4],
      [5, 6, 7, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func([1, 2, 3, 0.4], [5, 6, 'none', 0.8]);
    assert.deepEqual(res, [
      [1, 2, 3, 0.4],
      [5, 6, 3, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func([1, 2, 3, 'none'], [5, 6, 7, 'none']);
    assert.deepEqual(res, [
      [1, 2, 3, 0],
      [5, 6, 7, 0]
    ]);
  });

  it('should get values', () => {
    const res = func([1, 2, 3, 'none'], [5, 6, 7, 0.8]);
    assert.deepEqual(res, [
      [1, 2, 3, 0.8],
      [5, 6, 7, 0.8]
    ]);
  });

  it('should get values', () => {
    const res = func([1, 2, 3, 0.4], [5, 6, 7, 'none']);
    assert.deepEqual(res, [
      [1, 2, 3, 0.4],
      [5, 6, 7, 0.4]
    ]);
  });
});

describe('number to hex string', () => {
  const func = color.numberToHexString;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Number but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func(Number.NaN), TypeError, 'NaN is not a number.');
  });

  it('should throw', () => {
    assert.throws(() => func(-1), RangeError, '-1 is not between 0 and 255.');
  });

  it('should throw', () => {
    assert.throws(() => func(256), RangeError, '256 is not between 0 and 255.');
  });

  it('should throw', () => {
    assert.throws(() => func(-0.6), RangeError, '-1 is not between 0 and 255.');
  });

  it('should throw', () => {
    assert.throws(() => func(255.5), RangeError,
      '256 is not between 0 and 255.');
  });

  it('should get value', () => {
    const res = func(-0.4);
    assert.strictEqual(res, '00', 'result');
  });

  it('should get value', () => {
    const res = func(255.4);
    assert.strictEqual(res, 'ff', 'result');
  });

  it('should get value', () => {
    const res = func(0);
    assert.strictEqual(res, '00', 'result');
  });

  it('should get value', () => {
    const res = func(9);
    assert.strictEqual(res, '09', 'result');
  });

  it('should get value', () => {
    const res = func(10);
    assert.strictEqual(res, '0a', 'result');
  });

  it('should get value', () => {
    const res = func(15);
    assert.strictEqual(res, '0f', 'result');
  });

  it('should get value', () => {
    const res = func(16);
    assert.strictEqual(res, '10', 'result');
  });

  it('should get value', () => {
    const res = func(17);
    assert.strictEqual(res, '11', 'result');
  });

  it('should get value', () => {
    const res = func(0.15 * 255);
    assert.strictEqual(res, '26', 'result');
  });

  it('should get value', () => {
    const res = func(255);
    assert.strictEqual(res, 'ff', 'result');
  });
});

describe('angle to deg', () => {
  const func = color.angleToDeg;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('0foo'), SyntaxError,
      'Invalid property value: 0foo');
  });

  it('should throw', () => {
    assert.throws(() => func('.'), SyntaxError,
      'Invalid property value: .');
  });

  it('should get value', () => {
    const res = func('.0');
    assert.strictEqual(res, 0, 'result');
  });

  it('should get value', () => {
    const res = func('0.');
    assert.strictEqual(res, 0, 'result');
  });

  it('should get value', () => {
    const res = func('90');
    assert.strictEqual(res, 90, 'result');
  });

  it('should get value', () => {
    const res = func('90deg');
    assert.strictEqual(res, 90, 'result');
  });

  it('should get value', () => {
    const res = func('100grad');
    assert.strictEqual(res, 90, 'result');
  });

  it('should get value', () => {
    const res = func('.25turn');
    assert.strictEqual(res, 90, 'result');
  });

  it('should get value', () => {
    const res = func('1.57rad');
    assert.strictEqual(Math.round(res), 90, 'result');
  });

  it('should get value', () => {
    const res = func('0deg');
    assert.strictEqual(res, 0, 'result');
  });

  it('should get value', () => {
    const res = func('360deg');
    assert.strictEqual(res, 0, 'result');
  });

  it('should get value', () => {
    const res = func('540deg');
    assert.strictEqual(res, 180, 'result');
  });

  it('should get value', () => {
    const res = func('720deg');
    assert.strictEqual(res, 0, 'result');
  });

  it('should get value', () => {
    const res = func('-90deg');
    assert.strictEqual(res, 270, 'result');
  });

  it('should get value', () => {
    const res = func('-180deg');
    assert.strictEqual(res, 180, 'result');
  });

  it('should get value', () => {
    const res = func('-270deg');
    assert.strictEqual(res, 90, 'result');
  });

  it('should get value', () => {
    const res = func('-360deg');
    assert.strictEqual(res, 0, 'result');
  });

  it('should get value', () => {
    const res = func('-540deg');
    assert.strictEqual(res, 180, 'result');
  });

  it('should get value', () => {
    const res = func('-720deg');
    assert.strictEqual(res, 0, 'result');
  });
});

describe('parse alpha', () => {
  const func = color.parseAlpha;

  it('should throw', () => {
    assert.throws(() => func('foo'), TypeError, 'NaN is not a number.');
  });

  it('should get value', () => {
    const res = func();
    assert.strictEqual(res, 1, 'result');
  });

  it('should get value', () => {
    const res = func();
    assert.strictEqual(res, 1, 'result');
  });

  it('should get value', () => {
    const res = func('');
    assert.strictEqual(res, 1, 'result');
  });

  it('should get value', () => {
    const res = func('none');
    assert.strictEqual(res, 0, 'result');
  });

  it('should get value', () => {
    const res = func('.5');
    assert.strictEqual(res, 0.5, 'result');
  });

  it('should get value', () => {
    const res = func('50%');
    assert.strictEqual(res, 0.5, 'result');
  });

  it('should get value', () => {
    const res = func('0.5');
    assert.strictEqual(res, 0.5, 'result');
  });

  it('should get value', () => {
    const res = func('-0.5');
    assert.strictEqual(res, 0, 'result');
  });

  it('should get value', () => {
    const res = func('1.1');
    assert.strictEqual(res, 1, 'result');
  });

  it('should get value', () => {
    const res = func('0.33333333');
    assert.strictEqual(res, 0.333, 'result');
  });

  it('should get value', () => {
    const res = func('0.66666666');
    assert.strictEqual(res, 0.667, 'result');
  });

  it('should get value', () => {
    const res = func('0.6065');
    assert.strictEqual(res, 0.607, 'result');
  });

  it('should get value', () => {
    const res = func('0.0005');
    assert.strictEqual(res, 0, 'result');
  });
});

describe('parse hex alpha', () => {
  const func = color.parseHexAlpha;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func(''), SyntaxError,
      'Invalid property value: (empty string)');
  });

  it('should get value', () => {
    const res = func('-0');
    assert.strictEqual(res, 0, 'result');
  });

  it('should get value', () => {
    const res = func('0');
    assert.strictEqual(res, 0, 'result');
  });

  it('should get value', () => {
    const res = func('100');
    assert.strictEqual(res, 1, 'result');
  });

  it('should get value', () => {
    const res = func('ff');
    assert.strictEqual(res, 1, 'result');
  });

  it('should get value', () => {
    const res = func('3');
    assert.strictEqual(res, 0.01, 'result');
  });

  it('should get value', () => {
    const res = func('2');
    assert.strictEqual(res, 0.008, 'result');
  });

  it('should get value', () => {
    const res = func('4');
    assert.strictEqual(res, 0.016, 'result');
  });

  it('should get value', () => {
    const res = func('80');
    assert.strictEqual(res, 0.5, 'result');
  });

  it('should get value', () => {
    const res = func('88');
    assert.strictEqual(res, 0.533, 'result');
  });
});

describe('convert rgb to linear rgb', () => {
  const func = color.convertRgbToLinearRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([255, 255, 255, 1]), Error,
      'Expected array length of 3 but got 4.');
  });

  it('should get value', () => {
    const res = func([255, 0, 0]);
    assert.deepEqual(res, [1, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func([255, 0, 0], true);
    assert.deepEqual(res, [1, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func([0, 127.5, 0]);
    res[1] = parseFloat(res[1].toFixed(2));
    assert.deepEqual(res, [0, 0.21, 0], 'result');
  });

  it('should get value', () => {
    const res = func([0, 127.5, 0], true);
    res[1] = parseFloat(res[1].toFixed(2));
    assert.deepEqual(res, [0, 0.21, 0], 'result');
  });

  it('should get value', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func([255, 255, 255]);
    assert.deepEqual(res, [1, 1, 1], 'result');
  });

  it('should get value', () => {
    const res = func([10, 11, 12]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.00304, 0.00335, 0.00368], 'result');
  });
});

describe('convert rgb to xyz', () => {
  const func = color.convertRgbToXyz;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([]), Error,
      'Expected array length of 3 or 4 but got 0.');
  });

  it('should throw', () => {
    assert.throws(() => func(['foo', 255, 255]), TypeError,
      'Expected Number but got String.');
  });

  it('should throw', () => {
    assert.throws(() => func([NaN, 255, 255]), TypeError,
      'NaN is not a number.');
  });

  it('should throw', () => {
    assert.throws(() => func([-1, 255, 255]), RangeError,
      '-1 is not between 0 and 255.');
  });

  it('should throw', () => {
    assert.throws(() => func([256, 255, 255]), RangeError,
      '256 is not between 0 and 255.');
  });

  it('should throw', () => {
    assert.throws(() => func([255, 255, 255, 'foo']), TypeError,
      'Expected Number but got String.');
  });

  it('should throw', () => {
    assert.throws(() => func([255, 255, 255, NaN]), TypeError,
      'NaN is not a number.');
  });

  it('should throw', () => {
    assert.throws(() => func([255, 255, 255, -1]), RangeError,
      '-1 is not between 0 and 1.');
  });

  it('should throw', () => {
    assert.throws(() => func([255, 255, 255, 1.1]), RangeError,
      '1.1 is not between 0 and 1.');
  });

  it('should get value', () => {
    const res = func([255, 0, 0, 0.5]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.41239, 0.21264, 0.01933, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func([255, 0, 0, 0.5], true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.41239, 0.21264, 0.01933, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func([0, 128, 0]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0, 0, 0, 1]);
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func([255, 255, 255, 1]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.95046, 1, 1.08906, 1], 'result');
  });
});

describe('convert rgb to xyz-d50', () => {
  const func = color.convertRgbToXyzD50;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([]), Error,
      'Expected array length of 3 or 4 but got 0.');
  });

  it('should throw', () => {
    assert.throws(() => func(['foo', 255, 255]), TypeError,
      'Expected Number but got String.');
  });

  it('should throw', () => {
    assert.throws(() => func([NaN, 255, 255]), TypeError,
      'NaN is not a number.');
  });

  it('should throw', () => {
    assert.throws(() => func([-1, 255, 255]), RangeError,
      '-1 is not between 0 and 255.');
  });

  it('should throw', () => {
    assert.throws(() => func([256, 255, 255]), RangeError,
      '256 is not between 0 and 255.');
  });

  it('should throw', () => {
    assert.throws(() => func([255, 255, 255, 'foo']), TypeError,
      'Expected Number but got String.');
  });

  it('should throw', () => {
    assert.throws(() => func([255, 255, 255, NaN]), TypeError,
      'NaN is not a number.');
  });

  it('should throw', () => {
    assert.throws(() => func([255, 255, 255, -1]), RangeError,
      '-1 is not between 0 and 1.');
  });

  it('should throw', () => {
    assert.throws(() => func([255, 255, 255, 1.1]), RangeError,
      '1.1 is not between 0 and 1.');
  });

  it('should get value', () => {
    const res = func([255, 0, 0, 0.5]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.4361, 0.2225, 0.0139, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func([0, 128, 0]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.0831, 0.1547, 0.0210, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0, 0, 0, 1]);
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func([255, 255, 255, 1]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.9643, 1, 0.8251, 1], 'result');
  });
});

describe('convert rgb to hex color', () => {
  const func = color.convertRgbToHex;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([128, 192, 256]), RangeError,
      '256 is not between 0 and 255.');
  });

  it('should get value', () => {
    const res = func([255, 0, 128]);
    assert.deepEqual(res, '#ff0080', 'result');
  });

  it('should get value', () => {
    const res = func([255, 0, 128, 1]);
    assert.deepEqual(res, '#ff0080', 'result');
  });

  it('should get value', () => {
    const res = func([0, 0, 0, 1]);
    assert.deepEqual(res, '#000000', 'result');
  });

  it('should get value', () => {
    const res = func([255, 255, 255, 1]);
    assert.deepEqual(res, '#ffffff', 'result');
  });

  it('should get value', () => {
    const res = func([1, 35, 69, 0.40392]);
    assert.deepEqual(res, '#01234567', 'result');
  });

  it('should get value', () => {
    const res = func([137, 171, 205, 0.93725]);
    assert.deepEqual(res, '#89abcdef', 'result');
  });
});

describe('convert linear rgb to rgb', () => {
  const func = color.convertLinearRgbToRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1, 1]), Error,
      'Expected array length of 3 but got 4.');
  });

  it('should get value', () => {
    const res = func([1, 0, 0]);
    assert.deepEqual(res, [255, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func([1, 0, 0], true);
    assert.deepEqual(res, [255, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func([0, 0.21404, 0]);
    assert.deepEqual(res, [0, 127, 0], 'result');
  });

  it('should get value', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func([1, 1, 1]);
    assert.deepEqual(res, [255, 255, 255], 'result');
  });

  it('should get value', () => {
    const res = func([0.00288, 0.00289, 0.00319]);
    assert.deepEqual(res, [9, 10, 11], 'result');
  });
});

describe('convert linear rgb to hex color', () => {
  const func = color.convertLinearRgbToHex;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1]), Error,
      'Expected array length of 4 but got 3.');
  });

  it('should get value', () => {
    const res = func([1, 0, 0, 1]);
    assert.deepEqual(res, '#ff0000', 'result');
  });

  it('should get value', () => {
    const res = func([1, 0, 0, 1], true);
    assert.deepEqual(res, '#ff0000', 'result');
  });

  it('should get value', () => {
    const res = func([0, 0.21586, 0, 1]);
    assert.deepEqual(res, '#008000', 'result');
  });

  it('should get value', () => {
    const res = func([0, 0, 0, 1]);
    assert.deepEqual(res, '#000000', 'result');
  });

  it('should get value', () => {
    const res = func([1, 1, 1, 1]);
    assert.deepEqual(res, '#ffffff', 'result');
  });

  it('should get value', () => {
    const res = func([0.00304, 0.00304, 0.00304, 1]);
    assert.deepEqual(res, '#0a0a0a', 'result');
  });

  it('should get value', () => {
    const res = func([0.00335, 0.00335, 0.00335, 1]);
    assert.deepEqual(res, '#0b0b0b', 'result');
  });

  it('should get value', () => {
    const res = func([0.0003, 0.01681, 0.05951, 0.40392]);
    assert.deepEqual(res, '#01234567', 'result');
  });

  it('should get value', () => {
    const res = func([0.25016, 0.40724, 0.6105, 0.93725]);
    assert.deepEqual(res, '#89abcdef', 'result');
  });
});

describe('convert xyz D50 to hex color', () => {
  const func = color.convertXyzD50ToHex;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1]), Error,
      'Expected array length of 4 but got 3.');
  });

  it('should get value', () => {
    const res = func([0.43601, 0.22247, 0.01393, 1]);
    assert.deepEqual(res, '#ff0000', 'result');
  });

  it('should get value', () => {
    const res = func([0.08312, 0.15475, 0.02096, 1]);
    assert.deepEqual(res, '#008000', 'result');
  });

  it('should get value', () => {
    const res = func([0, 0, 0, 1]);
    assert.deepEqual(res, '#000000', 'result');
  });

  it('should get value', () => {
    const res = func([0.96419, 1, 0.82538, 1]);
    assert.deepEqual(res, '#ffffff', 'result');
  });

  it('should get value', () => {
    const res = func([0.00293, 0.00304, 0.00251, 1]);
    assert.deepEqual(res, '#0a0a0a', 'result');
  });

  it('should get value', () => {
    const res = func([0.00323, 0.00335, 0.00276, 1]);
    assert.deepEqual(res, '#0b0b0b', 'result');
  });

  it('should get value', () => {
    const res = func([0.01512, 0.01572, 0.04415, 0.40392]);
    assert.deepEqual(res, '#01234567', 'result');
  });

  it('should get value', () => {
    const res = func([0.35326, 0.38462, 0.47913, 0.93725]);
    assert.deepEqual(res, '#89abcdef', 'result');
  });

  it('should get value', () => {
    const res = func([0.2005, 0.14089, 0.4472, 1]);
    assert.deepEqual(res, '#7654cd', 'result');
  });
});

describe('convert xyz to hex color', () => {
  const func = color.convertXyzToHex;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1]), Error,
      'Expected array length of 4 but got 3.');
  });

  it('should get value', () => {
    const res = func([0.41239, 0.21264, 0.01933, 1]);
    assert.deepEqual(res, '#ff0000', 'result');
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1]);
    assert.deepEqual(res, '#008000', 'result');
  });

  it('should get value', () => {
    const res = func([0, 0, 0, 1]);
    assert.deepEqual(res, '#000000', 'result');
  });

  it('should get value', () => {
    const res = func([0.95046, 1, 1.08906, 1]);
    assert.deepEqual(res, '#ffffff', 'result');
  });

  it('should get value', () => {
    const res = func([0.00288, 0.00304, 0.00331, 1]);
    assert.deepEqual(res, '#0a0a0a', 'result');
  });

  it('should get value', () => {
    const res = func([0.00318, 0.00335, 0.00364, 1]);
    assert.deepEqual(res, '#0b0b0b', 'result');
  });

  it('should get value', () => {
    const res = func([0.01688, 0.01638, 0.05858, 0.40392]);
    assert.deepEqual(res, '#01234567', 'result');
  });

  it('should get value', () => {
    const res = func([0.35897, 0.38851, 0.63367, 0.93725]);
    assert.deepEqual(res, '#89abcdef', 'result');
  });

  it('should get value', () => {
    const res = func([0.148, 0.119, 0.076, 1]);
    assert.deepEqual(res, '#8b5148', 'result');
  });

  it('should get value', () => {
    const res = func([0.037, 0, -0.031, 1]);
    assert.deepEqual(res, '#670000', 'result');
  });

  it('should get value', () => {
    const res = func([0.21661, 0.14602, 0.59452, 1]);
    assert.deepEqual(res, '#7654cd', 'result');
  });
});

describe('convert xyz to rgb', () => {
  const func = color.convertXyzToRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should get value', () => {
    const res = func([0.41239, 0.21264, 0.01933, 0.5]);
    assert.deepEqual(res, [255, 0, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func([0.41239, 0.21264, 0.01933, 0.5], true);
    assert.deepEqual(res, [255, 0, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1]);
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0, 0, 0, 1]);
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.95046, 1, 1.08906, 1]);
    assert.deepEqual(res, [255, 255, 255, 1], 'result');
  });
});

describe('convert xyz to xyz-d50', () => {
  const func = color.convertXyzToXyzD50;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should get value', () => {
    const res = func([1, 1, 1, 1]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [1.021, 1.003, 0.758, 1]);
  });

  it('should get value', () => {
    const res = func([0, 1, 1, 1]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [-0.027, 0.973, 0.767, 1]);
  });

  it('should get value', () => {
    const res = func([1, 0, 1, 1]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.9977, 0.0126, 0.7426, 1]);
  });

  it('should get value', () => {
    const res = func([1, 1, 0, 1]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [1.0709, 1.0201, 0.0058, 1]);
  });
});

describe('xyz to hsl', () => {
  const func = color.convertXyzToHsl;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 255, 255]);
    const res = func(xyz, true);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, ['none', 'none', 100, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 255, 255]);
    const res = func(xyz);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, ['none', 'none', 100, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 0, 0]);
    const res = func(xyz);
    assert.deepEqual(res, ['none', 'none', 0, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([128, 128, 128]);
    const res = func(xyz);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, ['none', 0, 50, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 0, 0]);
    const res = func(xyz);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [0, 100, 50, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 255, 0]);
    const res = func(xyz);
    res[0] = Math.round(res[0]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 100, 50, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 0, 255]);
    const res = func(xyz);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [240, 100, 50, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 0, 255]);
    const res = func(xyz);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [300, 100, 50, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 255, 0]);
    const res = func(xyz);
    res[0] = Math.round(res[0]);
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [60, 100, 50, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 255, 255]);
    const res = func(xyz);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [180, 100, 50, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 128, 0]);
    const res = func(xyz);
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 100, 25, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([18, 52, 86, 0.4]);
    const res = func(xyz);
    res[0] = Math.round(res[0]);
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [210, 65, 20, 0.4]);
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([84, 92, 61]);
    const res = func(xyz);
    res[0] = Math.round(res[0]);
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [75, 20, 30, 1], 'result');
  });
});

describe('xyz to hwb', () => {
  const func = color.convertXyzToHwb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 255, 255]);
    const res = func(xyz);
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, ['none', 100, 0, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 0, 0]);
    const res = func(xyz);
    assert.deepEqual(res, ['none', 0, 100, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([128, 128, 128]);
    const res = func(xyz);
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, ['none', 50, 50, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 128, 0]);
    const res = func(xyz);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 0, 50, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([64, 128, 0]);
    const res = func(xyz);
    res[0] = Math.round(res[0]);
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [90, 0, 50, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([96, 128, 64]);
    const res = func(xyz);
    res[0] = Math.round(res[0]);
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [90, 25, 50, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([192, 255, 128]);
    const res = func(xyz);
    res[0] = Math.round(res[0]);
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [90, 50, 0, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([160, 192, 128]);
    const res = func(xyz);
    res[0] = Math.round(res[0]);
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [90, 50, 25, 1], 'result');
  });
});

describe('xyz to oklab', () => {
  const func = color.convertXyzToOklab;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 128, 0]);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51975, -0.1403, 0.10768, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 128, 0]);
    const res = func(xyz, true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51975, -0.1403, 0.10768, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 0, 0]);
    const res = func(xyz);
    assert.deepEqual(res, [0, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 255, 255]);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(5));
    assert.deepEqual(res, [1, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(48.477% 34.29% 38.412%)');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.5, 0.05, 0, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] =
      color.parseColorValue('rgb(29.264% 70.096% 63.017%)');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = Math.abs(parseFloat(res[2].toFixed(3)));
    assert.deepEqual(res, [0.7, -0.1, 0, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(73.942% 60.484% 19.65%)');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = Math.abs(parseFloat(res[1].toFixed(5)));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.7, 0, 0.125, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(27.888% 38.072% 89.414%)');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = Math.abs(parseFloat(res[1].toFixed(5)));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.55, 0, -0.2, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([118, 84, 205]);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0.544, 0.068, -0.166, 1], 'result');
  });
});

describe('xyz to oklch', () => {
  const func = color.convertXyzToOklch;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#008000');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.52, 0.18, 142.4954, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#000000');
    const res = func([x, y, z, a]);
    assert.deepEqual(res, [0, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#ffffff');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(4));
    assert.deepEqual(res, [1, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#808080');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(5));
    assert.deepEqual(res, [0.6, 0, 'none', 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(70.492% 2.351% 37.073%)');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(Math.round(res[2]));
    assert.deepEqual(res, [0.5, 0.2, 0, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(23.056% 31.73% 82.628%)');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(Math.round(res[2]));
    assert.deepEqual(res, [0.5, 0.2, 270, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] =
      color.parseColorValue('rgb(32.022% 85.805% 61.147%)');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(Math.round(res[2]));
    assert.deepEqual(res, [0.8, 0.15, 160, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(67.293% 27.791% 52.28%)');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(Math.round(res[2]));
    assert.deepEqual(res, [0.55, 0.15, 345, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#7654cd');
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0.544, 0.179, 292.365, 1], 'result');
  });
});

describe('convert xyz D50 to rgb', () => {
  const func = color.convertXyzD50ToRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func([1, 1, 1]), Error,
      'Expected array length of 4 but got 3.');
  });

  it('should get value', () => {
    const res = func([0.43601, 0.22247, 0.01393, 1]);
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.43601, 0.22247, 0.01393, 1], true);
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.08312, 0.15475, 0.02096, 1]);
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0, 0, 0, 1]);
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.96419, 1, 0.82538, 1]);
    assert.deepEqual(res, [255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.00293, 0.00304, 0.00251, 1]);
    assert.deepEqual(res, [10, 10, 10, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.00323, 0.00335, 0.00276, 1]);
    assert.deepEqual(res, [11, 11, 11, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.01512, 0.01572, 0.04415, 0.40392]);
    res[3] = parseFloat(res[3].toFixed(1));
    assert.deepEqual(res, [1, 35, 69, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func([0.35326, 0.38462, 0.47913, 0.93725]);
    res[3] = parseFloat(res[3].toFixed(1));
    assert.deepEqual(res, [137, 171, 205, 0.9], 'result');
  });

  it('should get value', () => {
    const res = func([0.2005, 0.14089, 0.4472, 1]);
    assert.deepEqual(res, [118, 84, 205, 1], 'result');
  });
});

describe('xyz-d50 to lab', () => {
  const func = color.convertXyzD50ToLab;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#008000', {
      d50: true
    });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(1));
    assert.deepEqual(res, [46.278, -47.6, 48.6, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#008000', {
      d50: true
    });
    const res = func([x, y, z, a], true);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(1));
    assert.deepEqual(res, [46.278, -47.6, 48.6, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#000000', {
      d50: true
    });
    const res = func([x, y, z, a]);
    assert.deepEqual(res, [0, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#ffffff', {
      d50: true
    });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(5));
    assert.deepEqual(res, [100, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] =
      color.parseColorValue('rgb(75.6208% 30.4487% 47.5634%)', {
        d50: true
      });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = Math.abs(parseFloat(res[2].toFixed(2)));
    assert.deepEqual(res, [50, 50, 0, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] =
      color.parseColorValue('rgb(10.751% 75.558% 66.398%)', {
        d50: true
      });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, [70, -45, 0, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] =
      color.parseColorValue('rgb(76.6254% 66.3607% 5.5775%)', {
        d50: true
      });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, [70, 0, 70, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] =
      color.parseColorValue('rgb(12.8128% 53.105% 92.7645%)', {
        d50: true
      });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = Math.abs(parseFloat(res[1].toFixed(2)));
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, [55, 0, -60, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] =
      color.parseColorValue('rgb(12.8128% 53.105% 92.7645% / 0.4)', {
        d50: true
      });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = Math.abs(parseFloat(res[1].toFixed(2)));
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, [55, 0, -60, 0.4], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#7654cd', {
      d50: true
    });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, [44.36, 36.05, -58.99, 1], 'result');
  });
});

describe('xyz-d50 to lch', () => {
  const func = color.convertXyzD50ToLch;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected Array but got Undefined.');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#008000', {
      d50: true
    });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27776, 67.98449, 134.38393, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#000000', {
      d50: true
    });
    const res = func([x, y, z, a]);
    assert.deepEqual(res, [0, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#ffffff', {
      d50: true
    });
    const res = func([x, y, z, a]);
    assert.deepEqual(res, [100, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#808080', {
      d50: true
    });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [53.5851, 0.0004, 152.9736, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] =
      color.parseColorValue('rgb(75.6208% 30.4487% 47.5634%)', {
        d50: true
      });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(0));
    res[1] = parseFloat(res[1].toFixed(0));
    res[2] = parseFloat(res[2].toFixed(0));
    assert.deepEqual(res, [50, 50, 360, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] =
      color.parseColorValue('rgb(10.7906% 75.5567% 66.3982%)', {
        d50: true
      });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(0));
    res[1] = parseFloat(res[1].toFixed(0));
    res[2] = parseFloat(res[2].toFixed(0));
    assert.deepEqual(res, [70, 45, 180, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] =
      color.parseColorValue('rgb(76.6254% 66.3607% 5.5775%)', {
        d50: true
      });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(0));
    res[1] = parseFloat(res[1].toFixed(0));
    res[2] = parseFloat(res[2].toFixed(0));
    assert.deepEqual(res, [70, 70, 90, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] =
      color.parseColorValue('rgb(12.8128% 53.105% 92.7645%)', {
        d50: true
      });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(0));
    res[1] = parseFloat(res[1].toFixed(0));
    res[2] = parseFloat(res[2].toFixed(0));
    assert.deepEqual(res, [55, 60, 270, 1], 'result');
  });

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#7654cd', {
      d50: true
    });
    const res = func([x, y, z, a]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [44.358, 69.129, 301.43, 1], 'result');
  });
});

describe('convert hex to rgb', () => {
  const func = color.convertHexToRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('white'), SyntaxError,
      'Invalid property value: white');
  });

  it('should throw', () => {
    assert.throws(() => func('#1'), SyntaxError,
      'Invalid property value: #1');
  });

  it('should throw', () => {
    assert.throws(() => func('#12'), SyntaxError,
      'Invalid property value: #12');
  });

  it('should throw', () => {
    assert.throws(() => func('#12345'), SyntaxError,
      'Invalid property value: #12345');
  });

  it('should throw', () => {
    assert.throws(() => func('#1234567'), SyntaxError,
      'Invalid property value: #1234567');
  });

  it('should throw', () => {
    assert.throws(() => func('#123456789'), SyntaxError,
      'Invalid property value: #123456789');
  });

  it('should get value', () => {
    const res = func('#ff0000');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#FF0000');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#ff0000ff');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#FF0000FF');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#ff00001a');
    assert.deepEqual(res, [255, 0, 0, 0.1], 'result');
  });

  it('should get value', () => {
    const res = func('#FF00001A');
    assert.deepEqual(res, [255, 0, 0, 0.1], 'result');
  });

  it('should get value', () => {
    const res = func('#f00a');
    assert.deepEqual(res, [255, 0, 0, 0.667], 'result');
  });

  it('should get value', () => {
    const res = func('#F00a');
    assert.deepEqual(res, [255, 0, 0, 0.667], 'result');
  });

  it('should get value', () => {
    const res = func('#f00');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#F00');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });
});

describe('convert hex to linear rgb', () => {
  const func = color.convertHexToLinearRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('foo'), SyntaxError,
      'Invalid property value: foo');
  });

  it('should get value', () => {
    const res = func('#ff0000');
    assert.deepEqual(res, [1, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#008000');
    res[1] = parseFloat(res[1].toFixed(5));
    assert.deepEqual(res, [0, 0.21586, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#000000');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#ffffff');
    assert.deepEqual(res, [1, 1, 1, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#0a0a0a');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.00304, 0.00304, 0.00304, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#0b0b0b');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.00335, 0.00335, 0.00335, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#01234567');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.0003, 0.01681, 0.05951, 0.404], 'result');
  });

  it('should get value', () => {
    const res = func('#89abcdef');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.25016, 0.40724, 0.6105, 0.937], 'result');
  });
});

describe('hex to xyz', () => {
  const func = color.convertHexToXyz;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('foo'), SyntaxError,
      'Invalid property value: foo');
  });

  it('should get value', () => {
    const res = func('#ff0000');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.41239, 0.21264, 0.01933, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#008000');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#009900');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.11391, 0.22781, 0.03797, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#000000');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#ffffff');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.95046, 1, 1.08906, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#0a0a0a');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.00288, 0.00304, 0.00331, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#0b0b0b');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.00318, 0.00335, 0.00364, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#01234567');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.01688, 0.01638, 0.05858, 0.404], 'result');
  });

  it('should get value', () => {
    const res = func('#89abcdef');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.35897, 0.38851, 0.63367, 0.937], 'result');
  });

  it('should get value', () => {
    const res = func('#7654cd');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.2166, 0.146, 0.59437, 1], 'result');
  });
});

describe('parse rgb()', () => {
  const func = color.parseRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('rgb(1, 2, 3 / 1)'), SyntaxError,
      'Invalid property value: rgb(1, 2, 3 / 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('rgb(none, 2, 3)'), SyntaxError,
      'Invalid property value: rgb(none, 2, 3)');
  });

  it('should throw', () => {
    assert.throws(() => func('rgb(1, none, 3)'), SyntaxError,
      'Invalid property value: rgb(1, none, 3)');
  });

  it('should throw', () => {
    assert.throws(() => func('rgb(1, 2, none)'), SyntaxError,
      'Invalid property value: rgb(1, 2, none)');
  });

  it('should throw', () => {
    assert.throws(() => func('rgba(1, 2, 3, none)'), SyntaxError,
      'Invalid property value: rgba(1, 2, 3, none)');
  });

  it('should throw', () => {
    assert.throws(() => func('rgba(1, 20%, 3)'), SyntaxError,
      'Invalid property value: rgba(1, 20%, 3)');
  });

  it('should get value', () => {
    const res = func('rgb(10, 20, 30)');
    assert.deepEqual(res, ['rgb', 10, 20, 30, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(10, 20, 30, 0.4)');
    assert.deepEqual(res, ['rgb', 10, 20, 30, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(10, 20, 30)');
    assert.deepEqual(res, ['rgb', 10, 20, 30, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(10, 20, 30, 0.4)');
    assert.deepEqual(res, ['rgb', 10, 20, 30, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(10 20 30)');
    assert.deepEqual(res, ['rgb', 10, 20, 30, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(10 20 30 / 0.4)');
    assert.deepEqual(res, ['rgb', 10, 20, 30, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(10 20 30)');
    assert.deepEqual(res, ['rgb', 10, 20, 30, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(10 20 30 / 0.4)');
    assert.deepEqual(res, ['rgb', 10, 20, 30, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(10 20 30 / 0.4)');
    assert.deepEqual(res, ['rgb', 10, 20, 30, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(-10, 260, -0, 1.4)');
    assert.deepEqual(res, ['rgb', 0, 255, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(-10, 260, -0, -0.4)');
    assert.deepEqual(res, ['rgb', 0, 255, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(-10 260 -0 / -0.4)');
    assert.deepEqual(res, ['rgb', 0, 255, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(10% 20% 30% / 40%)');
    assert.deepEqual(res, ['rgb', 25.5, 51, 76.5, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(-10% 120% -0% / -40%)');
    assert.deepEqual(res, ['rgb', 0, 255, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(10% 20% 30% / 140%)');
    assert.deepEqual(res, ['rgb', 25.5, 51, 76.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(.1% .2% .3%)');
    assert.deepEqual(res, ['rgb', 0.255, 0.51, 0.765, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(.1% .2% .3% / .4)');
    assert.deepEqual(res, ['rgb', 0.255, 0.51, 0.765, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(91.1% 92.2% 93.3% / .944)');
    assert.deepEqual(res, ['rgb', 232.305, 235.11, 237.915, 0.944], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(none none none / none)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });
});

describe('parse hsl()', () => {
  const func = color.parseHsl;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('hsl(1, 2%, 3% / 1)'), SyntaxError,
      'Invalid property value: hsl(1, 2%, 3% / 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('hsl(none, 2%, 3%)'), SyntaxError,
      'Invalid property value: hsl(none, 2%, 3%)');
  });

  it('should throw', () => {
    assert.throws(() => func('hsl(1, none, 3%)'), SyntaxError,
      'Invalid property value: hsl(1, none, 3%)');
  });

  it('should throw', () => {
    assert.throws(() => func('hsl(1, 2%, none)'), SyntaxError,
      'Invalid property value: hsl(1, 2%, none)');
  });

  it('should throw', () => {
    assert.throws(() => func('hsla(1, 2%, 3%, none)'), SyntaxError,
      'Invalid property value: hsla(1, 2%, 3%, none)');
  });

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / 40%)');
    assert.deepEqual(res, ['rgb', 255, 0, 0, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / -40%)');
    assert.deepEqual(res, ['rgb', 255, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / -40%)');
    assert.deepEqual(res, ['rgb', 255, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / 140%)');
    assert.deepEqual(res, ['rgb', 255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(0 .1% 50%)');
    assert.deepEqual(res, ['rgb', 127.627, 127.373, 127.373, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(0 .1% .1%)');
    assert.deepEqual(res, ['rgb', 0.255255, 0.254745, 0.254745, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(60deg 100% 50% / .4)');
    assert.deepEqual(res, ['rgb', 255, 255, 0, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 50%)');
    assert.deepEqual(res, ['rgb', 0, 255, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(180 100% 50%)');
    assert.deepEqual(res, ['rgb', 0, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(240 100% 50%)');
    assert.deepEqual(res, ['rgb', 0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(300 100% 50%)');
    assert.deepEqual(res, ['rgb', 255, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(none none none / none)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsla(none none none / none)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 none none)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 0% 0%)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 none 50%)');
    assert.deepEqual(res, ['rgb', 127.5, 127.5, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 50% / none)');
    assert.deepEqual(res, ['rgb', 0, 255, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(none 100% 50% / 0)');
    assert.deepEqual(res, ['rgb', 255, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 50% / 0)');
    assert.deepEqual(res, ['rgb', 0, 255, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(none 100% 50%)');
    assert.deepEqual(res, ['rgb', 255, 0, 0, 1], 'result');
  });
});

describe('parse hwb()', () => {
  const func = color.parseHwb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('hsw(1, 20%, 30% / 1)'), SyntaxError,
      'Invalid property value: hsw(1, 20%, 30% / 1)');
  });

  it('should get value', () => {
    const res = func('hwb(240 0% 0%)');
    assert.deepEqual(res, ['rgb', 0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(240 0% 0% / 0.5)');
    assert.deepEqual(res, ['rgb', 0, 0, 255, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(240 0% 0% / 50%)');
    assert.deepEqual(res, ['rgb', 0, 0, 255, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)');
    assert.deepEqual(res, ['rgb', 0, 127.5, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(0 0% 100%)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(0 100% 100%)');
    assert.deepEqual(res, ['rgb', 127.5, 127.5, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 70% 60%)');
    assert.deepEqual(res, ['rgb', 137.308, 137.308, 137.308, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 20% 30%)');
    assert.deepEqual(res, ['rgb', 51, 178.5, 51, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 .2% 30%)');
    assert.deepEqual(res, ['rgb', 0.51, 178.5, 0.51, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 20% .3%)');
    assert.deepEqual(res, ['rgb', 51, 254.235, 51, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / .5)');
    assert.deepEqual(res, ['rgb', 63.75, 127.5, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / 70%)');
    assert.deepEqual(res, ['rgb', 63.75, 127.5, 0, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / -70%)');
    assert.deepEqual(res, ['rgb', 63.75, 127.5, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / 170%)');
    assert.deepEqual(res, ['rgb', 63.75, 127.5, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(none none none / none)');
    assert.deepEqual(res, ['rgb', 255, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 none none)');
    assert.deepEqual(res, ['rgb', 0, 255, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 80% none)');
    assert.deepEqual(res, ['rgb', 204, 255, 204, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 80% 0%)');
    assert.deepEqual(res, ['rgb', 204, 255, 204, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 none 50%)');
    assert.deepEqual(res, ['rgb', 0, 127.5, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)');
    assert.deepEqual(res, ['rgb', 0, 127.5, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / none)');
    assert.deepEqual(res, ['rgb', 76.5, 127.5, 76.5, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / 0)');
    assert.deepEqual(res, ['rgb', 76.5, 127.5, 76.5, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / none)');
    assert.deepEqual(res, ['rgb', 76.5, 127.5, 76.5, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / 0)');
    assert.deepEqual(res, ['rgb', 76.5, 127.5, 76.5, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(none 100% 50% / none)');
    assert.deepEqual(res, ['rgb', 170, 170, 170, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(0 100% 50% / 0)');
    assert.deepEqual(res, ['rgb', 170, 170, 170, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(180 0% 25% / 1)');
    assert.deepEqual(res, ['rgb', 0, 191.25, 191.25, 1], 'result');
  });
});

describe('parse lab()', () => {
  const func = color.parseLab;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('lab(100%, 20%, 30% / 1)'), SyntaxError,
      'Invalid property value: lab(100%, 20%, 30% / 1)');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)');
    assert.deepEqual(res, ['xyz-d50', 0.0831303, 0.154765, 0.020967, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(0 0 0)');
    assert.deepEqual(res, ['xyz-d50', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(100 0 0)');
    assert.deepEqual(res, ['xyz-d50', 0.964296, 1, 0.825105, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(100% 0 0)');
    assert.deepEqual(res, ['xyz-d50', 0.964296, 1, 0.825105, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(110% 0 0)');
    assert.deepEqual(res, ['xyz-d50', 0.964296, 1, 0.825105, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(50 50 0)');
    assert.deepEqual(res, ['xyz-d50', 0.288683, 0.184187, 0.151973, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(70 -45 0)');
    assert.deepEqual(res, ['xyz-d50', 0.266509, 0.407494, 0.336225, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(70 0 70)');
    assert.deepEqual(res, ['xyz-d50', 0.392945, 0.407494, 0.0494655, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(55 0 -60)');
    assert.deepEqual(res, ['xyz-d50', 0.221111, 0.229298, 0.626026, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59)');
    assert.deepEqual(res, ['xyz-d50', 0.200518, 0.140888, 0.447232, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 1)');
    assert.deepEqual(res, ['xyz-d50', 0.200518, 0.140888, 0.447232, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / .5)');
    assert.deepEqual(res, ['xyz-d50', 0.200518, 0.140888, 0.447232, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 50%)');
    assert.deepEqual(res, ['xyz-d50', 0.200518, 0.140888, 0.447232, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / -50%)');
    assert.deepEqual(res, ['xyz-d50', 0.200518, 0.140888, 0.447232, 0],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 150%)');
    assert.deepEqual(res, ['xyz-d50', 0.200518, 0.140888, 0.447232, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(.5% 50% 50%)');
    assert.deepEqual(res, ['xyz-d50', 0.0184044, 0.000553528, -0.0326554, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(-10% 50% 50%)');
    assert.deepEqual(res, ['xyz-d50', 0.0175281, 0, -0.0331121, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(50% 50% .5%)');
    assert.deepEqual(res, ['xyz-d50', 0.322273, 0.184187, 0.149483, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(50% .5% 50%)');
    assert.deepEqual(res, ['xyz-d50', 0.178783, 0.184187, 0.0139186, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(none none none)');
    assert.deepEqual(res, ['xyz-d50', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(none none none / none)');
    assert.deepEqual(res, ['xyz-d50', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('lab(62.2345% -34.9638 47.7721)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['lab', 62.2345, -34.9638, 47.7721, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(110% none -10% / .5)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['lab', 100, 'none', -12.5, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('lab(none none none / none)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['lab', 'none', 'none', 'none', 'none'], 'result');
  });
});

describe('parse lch()', () => {
  const func = color.parseLch;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('lch(100%, 20%, 30% / 1)'), SyntaxError,
      'Invalid property value: lch(100%, 20%, 30% / 1)');
  });

  it('should get value', () => {
    const res = func('lch(46.278% 68.0 134.4)');
    assert.deepEqual(res, ['xyz-d50', 0.0831125, 0.15475, 0.0209589, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(0% 0 0)');
    assert.deepEqual(res, ['xyz-d50', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(100% 0 0)');
    assert.deepEqual(res, ['xyz-d50', 0.964296, 1, 0.825105, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(50% 50 0)');
    assert.deepEqual(res, ['xyz-d50', 0.288683, 0.184187, 0.151973, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(70% 45 180)');
    assert.deepEqual(res, ['xyz-d50', 0.266509, 0.407494, 0.336225, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(70% 70 90)');
    assert.deepEqual(res, ['xyz-d50', 0.392945, 0.407494, 0.0494655, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(55% 60 270)');
    assert.deepEqual(res, ['xyz-d50', 0.221111, 0.229298, 0.626026, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43)');
    assert.deepEqual(res, ['xyz-d50', 0.200515, 0.140888, 0.447126, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)');
    assert.deepEqual(res, ['xyz-d50', 0.200515, 0.140888, 0.447126, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / .5)');
    assert.deepEqual(res, ['xyz-d50', 0.200515, 0.140888, 0.447126, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 50%)');
    assert.deepEqual(res, ['xyz-d50', 0.200515, 0.140888, 0.447126, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / -50%)');
    assert.deepEqual(res, ['xyz-d50', 0.200515, 0.140888, 0.447126, 0],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 150%)');
    assert.deepEqual(res, ['xyz-d50', 0.200515, 0.140888, 0.447126, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(.5% 20 30)');
    assert.deepEqual(res, ['xyz-d50', 0.00482348, 0.000553528, -0.00484122, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(-10% 20 30)');
    assert.deepEqual(res, ['xyz-d50', 0.00428972, 0, -0.00529794, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(10% .5 30)');
    assert.deepEqual(res, ['xyz-d50', 0.0109845, 0.0112602, 0.00913626, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(10% 20% 30)');
    assert.deepEqual(res, ['xyz-d50', 0.0202958, 0.0112602, 0.00118747, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(10% 20 -30)');
    assert.deepEqual(res, ['xyz-d50', 0.0167108, 0.0112602, 0.0169987, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(none none none)');
    assert.deepEqual(res, ['xyz-d50', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(none none none / none)');
    assert.deepEqual(res, ['xyz-d50', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('lch(62.2345% 59.2 126.2)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['lch', 62.2345, 59.2, 126.2, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(-10% none -90deg / .5)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['lch', 0, 'none', 270, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('lch(none none none / none)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['lch', 'none', 'none', 'none', 'none'], 'result');
  });
});

describe('parse oklab()', () => {
  const func = color.parseOklab;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('oklab(100%, 20%, 30% / 1)'), SyntaxError,
      'Invalid property value: oklab(100%, 20%, 30% / 1)');
  });

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)');
    assert.deepEqual(res, ['xyz-d65', 0.0771884, 0.154375, 0.0257249, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(0 0 0)');
    assert.deepEqual(res, ['xyz-d65', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(1 0 0)');
    assert.deepEqual(res, ['xyz-d65', 0.950456, 1, 1.08906, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(50% 0.05 0)');
    assert.deepEqual(res, ['xyz-d65', 0.139023, 0.120254, 0.131325, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.7 -0.1 0)');
    assert.deepEqual(res, ['xyz-d65', 0.253459, 0.361799, 0.392252, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(70% 0 0.125)');
    assert.deepEqual(res, ['xyz-d65', 0.330466, 0.341821, 0.0788701, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.55 0 -0.2)');
    assert.deepEqual(res, ['xyz-d65', 0.208919, 0.155096, 0.75298, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567)');
    assert.deepEqual(res, ['xyz-d65', 0.216593, 0.145996, 0.594355, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 1)');
    assert.deepEqual(res, ['xyz-d65', 0.216593, 0.145996, 0.594355, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / .5)');
    assert.deepEqual(res, ['xyz-d65', 0.216593, 0.145996, 0.594355, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 50%)');
    assert.deepEqual(res, ['xyz-d65', 0.216593, 0.145996, 0.594355, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / -50%)');
    assert.deepEqual(res, ['xyz-d65', 0.216593, 0.145996, 0.594355, 0],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 150%)');
    assert.deepEqual(res, ['xyz-d65', 0.216593, 0.145996, 0.594355, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(.5% 20% 30%)');
    assert.deepEqual(res,
      ['xyz-d65', -0.000790021, 0.000266762, -0.00617548, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(-10% 20% 30%)');
    assert.deepEqual(res,
      ['xyz-d65', -0.000962546, 0.000293252, -0.00677682, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(10% 20% .5%)');
    assert.deepEqual(res,
      ['xyz-d65', 0.00261129, 0.000703706, 0.000668526, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(10% .5% 30%)');
    assert.deepEqual(res,
      ['xyz-d65', 0.00201133, 0.000799226, -0.000751157, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(none none none)');
    assert.deepEqual(res, ['xyz-d65', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(none none none / none)');
    assert.deepEqual(res, ['xyz-d65', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(66.016% -0.1084 0.1114)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['oklab', 0.66016, -0.1084, 0.1114, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(-10% none 30% / .5)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['oklab', 0, 'none', 0.12, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(none none none / none)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['oklab', 'none', 'none', 'none', 'none'], 'result');
  });
});

describe('parse oklch()', () => {
  const func = color.parseOklch;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('oklch(100%, 20%, 30% / 1)'), SyntaxError,
      'Invalid property value: oklch(100%, 20%, 30% / 1)');
  });

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)');
    assert.deepEqual(res, ['xyz-d65', 0.0771872, 0.154375, 0.0257271, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(0% 0 0)');
    assert.deepEqual(res, ['xyz-d65', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(100% 0 0)');
    assert.deepEqual(res, ['xyz-d65', 0.950456, 1, 1.08906, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(50% 0.2 0)');
    assert.deepEqual(res, ['xyz-d65', 0.208742, 0.106235, 0.116683, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(50% 0.2 270)');
    assert.deepEqual(res, ['xyz-d65', 0.164463, 0.114827, 0.62784, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(80% 0.15 160)');
    assert.deepEqual(res, ['xyz-d65', 0.347224, 0.547341, 0.401546, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(55% 0.15 345)');
    assert.deepEqual(res, ['xyz-d65', 0.234241, 0.14918, 0.239505, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37)');
    assert.deepEqual(res, ['xyz-d65', 0.212588, 0.142275, 0.58731, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / 1)');
    assert.deepEqual(res, ['xyz-d65', 0.212588, 0.142275, 0.58731, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / .5)');
    assert.deepEqual(res, ['xyz-d65', 0.212588, 0.142275, 0.58731, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / 50%)');
    assert.deepEqual(res, ['xyz-d65', 0.212588, 0.142275, 0.58731, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / -50%)');
    assert.deepEqual(res, ['xyz-d65', 0.212588, 0.142275, 0.58731, 0],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / 150%)');
    assert.deepEqual(res, ['xyz-d65', 0.212588, 0.142275, 0.58731, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(.5 20% 30)');
    assert.deepEqual(res, ['xyz-d65', 0.147667, 0.118516, 0.0757683, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(-10% 20% 30)');
    assert.deepEqual(res,
      ['xyz-d65', 0.00000371007, 0.0000109137, -0.000310562, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(10% 20% .5)');
    assert.deepEqual(res, ['xyz-d65', 0.0026038, 0.000703632, 0.000735212, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(10% .5 30)');
    assert.deepEqual(res, ['xyz-d65', 0.0372685, -0.0000535234, -0.0310754, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(10% -0.5 30)');
    assert.deepEqual(res, ['xyz-d65', 0.000950456, 0.001, 0.00108906, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(none none none)');
    assert.deepEqual(res, ['xyz-d65', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(none none none / none)');
    assert.deepEqual(res, ['xyz-d65', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(59.686% 0.15619 49.7694)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['oklch', 0.59686, 0.15619, 49.7694, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(-10% none -90deg / .5)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['oklch', 0, 'none', 270, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(none none none / none)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['oklch', 'none', 'none', 'none', 'none'], 'result');
  });
});

describe('parse color func', () => {
  const func = color.parseColorFunc;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('color(in foo, 1 1 1)'), SyntaxError,
      'Invalid property value: color(in foo, 1 1 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb)'), SyntaxError,
      'Invalid property value: color(srgb)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1)'), SyntaxError,
      'Invalid property value: color(srgb 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 1)'), SyntaxError,
      'Invalid property value: color(srgb 1 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb foo bar baz)'), SyntaxError,
      'Invalid property value: color(srgb foo bar baz)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 bar baz)'), SyntaxError,
      'Invalid property value: color(srgb 1 bar baz)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 1 baz)'), SyntaxError,
      'Invalid property value: color(srgb 1 1 baz)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 1 1 qux)'), SyntaxError,
      'Invalid property value: color(srgb 1 1 1 qux)');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    assert.deepEqual(res, ['xyz-d65', 0.0765378, 0.153076, 0.0255126, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.0824383, 0.153443, 0.0207794, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0)');
    assert.deepEqual(res, ['xyz-d65', 0.113907, 0.227815, 0.0379691, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.122689, 0.228362, 0.0309249, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 50% 50% 50% / 50%)');
    assert.deepEqual(res, ['xyz-d65', 0.203437, 0.214041, 0.233103, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb .5 .5 .5 / .5)');
    assert.deepEqual(res, ['xyz-d65', 0.203437, 0.214041, 0.233103, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)');
    assert.deepEqual(res, ['xyz-d65', 0.113907, 0.227815, 0.0379691, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 50%)');
    assert.deepEqual(res, ['xyz-d65', 0.113907, 0.227815, 0.0379691, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 150%)');
    assert.deepEqual(res, ['xyz-d65', 0.113907, 0.227815, 0.0379691, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / -1)');
    assert.deepEqual(res, ['xyz-d65', 0.113907, 0.227815, 0.0379691, 0],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)');
    assert.deepEqual(res, ['xyz-d65', 0.0771882, 0.154376, 0.0257294, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.0831388, 0.154747, 0.020956, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.26374 0.59085 0.16434)');
    assert.deepEqual(res, ['xyz-d65', 0.113905, 0.227813, 0.037968, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.26374 0.59085 0.16434)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.122687, 0.22836, 0.0309241, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.299218 0.533327 0.120785)');
    assert.deepEqual(res, ['xyz-d65', 0.113905, 0.22781, 0.0379681, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.299218 0.533327 0.120785)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.122686, 0.228357, 0.0309241, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0 1 0)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.165697, 0.675318, 0.0299778, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.33582 0.59441 0.13934)');
    assert.deepEqual(res, ['xyz-d65', 0.113904, 0.22781, 0.0379676, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.33582 0.59441 0.13934)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.122685, 0.228357, 0.0309238, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.2861 0.49131 0.16133)');
    assert.deepEqual(res, ['xyz-d65', 0.113881, 0.227815, 0.037977, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.2861 0.49131 0.16133)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.122661, 0.228361, 0.0309312, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 1 0)');
    assert.deepEqual(res, ['xyz-d65', 0.112724, 0.715123, -0.0129336, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 1 0)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.135186, 0.711843, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.0771895 0.154379 0.0257347)');
    assert.deepEqual(res, ['xyz-d65', 0.0771895, 0.154379, 0.0257347, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.0771895 0.154379 0.0257347)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.08314, 0.15475, 0.02096, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.0771895 0.154379 0.0257347)');
    assert.deepEqual(res, ['xyz-d65', 0.0771895, 0.154379, 0.0257347, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.0771895 0.154379 0.0257347)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.08314, 0.15475, 0.02096, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.08314 0.15475 0.02096)');
    assert.deepEqual(res, ['xyz-d65', 0.0771895, 0.154379, 0.0257347, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.08314 0.15475 0.02096)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.08314, 0.15475, 0.02096, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb none 1 1 / 1)');
    assert.deepEqual(res, ['xyz-d65', 0.538065, 0.787361, 1.06973, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 1 none 1 / 1)');
    assert.deepEqual(res, ['xyz-d65', 0.592872, 0.284831, 0.969863, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 1 1 none / 1)');
    assert.deepEqual(res, ['xyz-d65', 0.769975, 0.927808, 0.138526, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 1 1 1 / none)');
    assert.deepEqual(res, ['xyz-d65', 0.950456, 1, 1.08906, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 1)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0, 0.5, 1, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb none 0.5 1)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 'none', 0.5, 1, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 none 1)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0, 'none', 1, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 none)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0, 0.5, 'none', 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 1 / none)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0, 0.5, 1, 'none'], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['xyz-d65', 0.07719, 0.15438, 0.02573, 1], 'result');
  });
});

describe('parse color value', () => {
  const func = color.parseColorValue;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('#12345'), SyntaxError,
      'Invalid property value: #12345');
  });

  it('should throw', () => {
    assert.throws(() => func('foo(1 1 1)'), SyntaxError,
      'Invalid property value: foo(1 1 1)');
  });

  it('should get value', () => {
    const res = func('currentColor');
    assert.deepEqual(res, ['xyz-d65', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'spec'
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('transparent');
    assert.deepEqual(res, ['xyz-d65', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'spec'
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    assert.deepEqual(res, ['xyz-d65', 0.0771883, 0.154377, 0.0257294, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('green', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.083139, 0.154748, 0.020956, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'spec'
    });
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('foo');
    assert.deepEqual(res, ['xyz-d65', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('foo', {
      format: 'spec'
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('#008000');
    assert.deepEqual(res, ['xyz-d65', 0.0771883, 0.154377, 0.0257294, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('#008000', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.083139, 0.154748, 0.020956, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('#008000', {
      format: 'spec'
    });
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#00800080');
    assert.deepEqual(res, ['xyz-d65', 0.0771883, 0.154377, 0.0257294, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('#00800080', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.083139, 0.154748, 0.020956, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('#00800080', {
      format: 'spec'
    });
    assert.deepEqual(res, ['rgb', 0, 128, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('#080');
    assert.deepEqual(res, ['xyz-d65', 0.0880377, 0.176075, 0.0293459, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('#0808');
    assert.deepEqual(res, ['xyz-d65', 0.0880377, 0.176075, 0.0293459, 0.533],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)');
    assert.deepEqual(res, ['xyz-d65', 0.0771803, 0.154395, 0.0257436, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.0831303, 0.154765, 0.020967, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['lab', 46.28, -47.57, 48.58, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)');
    assert.deepEqual(res, ['xyz-d65', 0.077177, 0.154375, 0.0257325, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.083127, 0.154746, 0.0209584, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)');
    assert.deepEqual(res, ['xyz-d65', 0.0771884, 0.154375, 0.0257249, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.0831392, 0.154746, 0.0209526, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)');
    assert.deepEqual(res, ['xyz-d65', 0.0771872, 0.154375, 0.0257271, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.0831379, 0.154746, 0.0209542, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 128 0)');
    assert.deepEqual(res, ['xyz-d65', 0.0771883, 0.154377, 0.0257294, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 128 0)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.083139, 0.154748, 0.020956, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 128 0)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 25%)');
    assert.deepEqual(res, ['xyz-d65', 0.0765378, 0.153076, 0.0255126, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 25%)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.0824383, 0.153443, 0.0207794, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 25%)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 49.8039%)');
    assert.deepEqual(res, ['xyz-d65', 0.0771883, 0.154377, 0.0257294, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 49.8039%)', {
      d50: true
    });
    assert.deepEqual(res, ['xyz-d50', 0.083139, 0.154748, 0.020956, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });
});

describe('convert color value to linear rgb', () => {
  const func = color.convertColorValueToLinearRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('green');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0, 0.21586, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0, 0.31855, 0, 0.5], 'result');
  });
});

describe('convert color value to rgb', () => {
  const func = color.convertColorValueToRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('green');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0 / 0.5)');
    assert.deepEqual(res, [0, 128, 0, 0.5], 'result');
  });
});

describe('resolve color value', () => {
  const func = color.resolveColorValue;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('foo');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('currentColor');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('transparent');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('black');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('WHITE');
    assert.deepEqual(res, ['rgb', 255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#123456');
    assert.deepEqual(res, ['rgb', 18, 52, 86, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#abcdef');
    assert.deepEqual(res, ['rgb', 171, 205, 239, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#12345678');
    assert.deepEqual(res, ['rgb', 18, 52, 86, 0.47], 'result');
  });

  it('should get value', () => {
    const res = func('#abcdef12');
    assert.deepEqual(res, ['rgb', 171, 205, 239, 0.07], 'result');
  });

  it('should get value', () => {
    const res = func('#1234');
    assert.deepEqual(res, ['rgb', 17, 34, 51, 0.267], 'result');
  });

  it('should get value', () => {
    const res = func('#abcd');
    assert.deepEqual(res, ['rgb', 170, 187, 204, 0.867], 'result');
  });

  it('should get value', () => {
    const res = func('#123');
    assert.deepEqual(res, ['rgb', 17, 34, 51, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#abc');
    assert.deepEqual(res, ['rgb', 170, 187, 204, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(10 20 30 / 0.5)');
    assert.deepEqual(res, ['rgb', 10, 20, 30, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 0 0 / 1%)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0.01], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(1,2,3,0.5)');
    assert.deepEqual(res, ['rgb', 1, 2, 3, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(1,2,3,1)');
    assert.deepEqual(res, ['rgb', 1, 2, 3, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(46.27% 32.94% 80.39%)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(50% 33% 34%)');
    assert.deepEqual(res, ['rgb', 128, 84, 87, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(5% 10% 20%)');
    assert.deepEqual(res, ['rgb', 13, 26, 51, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(240 100% 50% / 0.5)');
    assert.deepEqual(res, ['rgb', 0, 0, 255, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(-120deg 100% 50% / 0.5)');
    assert.deepEqual(res, ['rgb', 0, 0, 255, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 0% / 1%)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0.01], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(240 100% 50%)');
    assert.deepEqual(res, ['rgb', 0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsla(180,50%,50%,0.5)');
    assert.deepEqual(res, ['rgb', 64, 191, 191, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(240 100% 50%)');
    assert.deepEqual(res, ['rgb', 170, 170, 170, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(110 20% 30% / 40%)');
    assert.deepEqual(res, ['rgb', 72, 179, 51, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 1)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 0.5)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 0.5)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['lab', 44.36, 36.05, -59, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['lch', 44.36, 69.13, 301.43, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 1)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 0.5)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 0.5)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['oklab', 0.54432, 0.06817, -0.16567, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 1)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 0.5)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 0.5)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['oklch', 0.544, 0.179, 292.365, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(none none none / none)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });
});

describe('resolve color()', () => {
  const func = color.resolveColorFunc;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('color(in foo, 1 1 1)'), SyntaxError,
      'Invalid property value: color(in foo, 1 1 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb foo bar baz)'), SyntaxError,
      'Invalid property value: color(srgb foo bar baz)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 bar baz)'), SyntaxError,
      'Invalid property value: color(srgb 1 bar baz)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 1 baz)'), SyntaxError,
      'Invalid property value: color(srgb 1 1 baz)');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0% 60% 0%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0, 0.6, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 50%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / -50%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 150%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.3 0.5 0.7 / none)');
    assert.deepEqual(res, ['rgb', 76, 127, 179, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 128, 178, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 76, 0, 178, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 77, 127, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 128, 178, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 30% none 70%)');
    assert.deepEqual(res, ['rgb', 76, 0, 178, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 30% 50% none)');
    assert.deepEqual(res, ['rgb', 77, 127, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb none none none / none)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 'none', 'none', 'none', 'none'], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 1 1 1)');
    const val = func('color(srgb 1 1 1)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 1 0)');
    const val = color.resolveColorValue('lab(87.8185% -79.271 80.9946)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 43.5% 1.7% 5.5%)');
    const val = func('color(srgb 0.691 0.139 0.259)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 188, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 149, 0, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 149, 188, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 188, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 30% none 70%)');
    assert.deepEqual(res, ['rgb', 149, 0, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 30% 50% none)');
    assert.deepEqual(res, ['rgb', 149, 188, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.26374 0.59085 0.16434 / 1)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 26.374% 59.085% 16.434%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.21604 0.49418 0.13151)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 1 1 1)');
    assert.deepEqual(res, ['rgb', 255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0 1 0)');
    const val = color.resolveColorValue('lab(86.61399% -106.539 102.871)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 1 1 0.330897)');
    const val = color.resolveColorValue('yellow');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.465377 0.532768 0.317713)');
    const val = color.resolveColorValue('lch(54% 35 118)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 130, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 84, 0, 186, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 57, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 130, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 30% none 70%)');
    assert.deepEqual(res, ['rgb', 84, 0, 186, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 30% 50% none)');
    assert.deepEqual(res, ['rgb', 57, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.299218 0.533327 0.120785 / 1)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 29.9218% 53.3327% 12.0785%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.235202 0.431704 0.085432)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 1 1 1)');
    assert.deepEqual(res, ['rgb', 255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0 1 0)');
    const val = color.resolveColorValue('lab(85.7729% -160.7259 109.2319)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 147, 192, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 104, 0, 196, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 41, 145, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 147, 192, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 30% none 70%)');
    assert.deepEqual(res, ['rgb', 104, 0, 196, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 30% 50% none)');
    assert.deepEqual(res, ['rgb', 41, 145, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.33582 0.59441 0.13934 / 1)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 33.582% 59.441% 13.934%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.281363 0.498012 0.116746)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 1 1 1)');
    assert.deepEqual(res, ['rgb', 255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0 1 0)');
    const val = color.resolveColorValue('lab(83.2141% -129.1072 87.1718)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 129, 182, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 89, +0, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 29, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 129, 182, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 30% none 70%)');
    assert.deepEqual(res, ['rgb', 89, +0, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 30% 50% none)');
    assert.deepEqual(res, ['rgb', 29, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.2861 0.49131 0.16133 / 1)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 28.610% 49.131% 16.133%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.230479 0.395789 0.129968)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 1 1 1)');
    assert.deepEqual(res, ['rgb', 255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 1 0)');
    const val = color.resolveColorValue('lab(87.5745% -186.6921 150.9905)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 160, 198, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 76, 0, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 43, 155, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 160, 198, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 30% none 70%)');
    assert.deepEqual(res, ['rgb', 76, 0, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 30% 50% none)');
    assert.deepEqual(res, ['rgb', 43, 155, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.07719 0.15438 0.02573)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 7.719% 15.438% 2.573%)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 1 1 1)');
    const val = color.resolveColorValue('lab(100.115% 9.06448 5.80177)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0 1 0)');
    const val = color.resolveColorValue('lab(99.6289% -354.58 146.707)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.08312 0.154746 0.020961)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 8.312% 15.4746% 2.0961%)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 1 1 1)');
    const val = color.resolveColorValue('lab(100% 6.1097 -13.2268)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 30% none 70%)');
    assert.deepEqual(res, ['rgb', 207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 30% 50% none)');
    assert.deepEqual(res, ['rgb', 125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 30% none 70%)');
    assert.deepEqual(res, ['rgb', 207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 30% 50% none)');
    assert.deepEqual(res, ['rgb', 125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 253, 240, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 203, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 102, 213, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 253, 240, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 30% none 70%)');
    assert.deepEqual(res, ['rgb', 203, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 30% 50% none)');
    assert.deepEqual(res, ['rgb', 102, 213, 0, 1], 'result');
  });
});

/*
describe('resolve color-mix()', () => {
  const func = color.resolveColorMix;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, blue)'), SyntaxError,
      'Invalid property value: color-mix(in srgb, blue)');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, blue -10%, red)'),
      RangeError, '-10% is not between 0% and 100%.');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, blue 110%, red)'),
      RangeError, '110% is not between 0% and 100%.');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, blue, red -10%)'),
      RangeError, '-10% is not between 0% and 100%.');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, blue, red 110%)'),
      RangeError, '110% is not between 0% and 100%.');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, blue -10%, red 10%)'),
      RangeError, '-10% is not between 0% and 100%.');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, blue 110%, red 10%)'),
      RangeError, '110% is not between 0% and 100%.');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, blue 10%, red -10%)'),
      RangeError, '-10% is not between 0% and 100%.');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, blue 10%, red 110%)'),
      RangeError, '110% is not between 0% and 100%.');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, blue 0%, red 0%)'),
      SyntaxError,
      'Invalid property value: color-mix(in srgb, blue 0%, red 0%)');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, currentcolor, red)');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, currentcolor)');
    assert.deepEqual(res, [0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgba(0 0 255 / .5), currentcolor)');
    assert.deepEqual(res, [0, 0, 255, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)');
    assert.deepEqual(res, [127.5, 0, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, green)');
    assert.deepEqual(res, [0, 64, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, #0000ff, #008000)');
    assert.deepEqual(res, [0, 64, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgb(0 0 255), rgb(0 128 0))');
    assert.deepEqual(res, [0, 64, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in srgb, hsl(240 100% 50%), hsl(120 100% 25%))');
    assert.deepEqual(res, [0, 64, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, hwb(240 0% 0%), hwb(120 0% 50%))');
    assert.deepEqual(res, [0, 64, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgba(255, 0, 0, 0.2), red)');
    const value = color.resolveColorValue('rgba(255, 0, 0, 0.6)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 80%, red 80%)');
    assert.deepEqual(res, [127.5, 0, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 10%, red)');
    assert.deepEqual(res, [229.5, 0, 25.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 100%, red)');
    assert.deepEqual(res, [0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgba(0, 0, 255, 0.5) 100%, red)');
    const value = color.resolveColorValue('rgb(0, 0, 255, 0.5)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, red, rgba(0, 0, 255, 0.5) 100%)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0, 0, 1, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgb(100% 0% 0% / 0.7) 25%, rgb(0% 100% 0% / 0.2))', {
      format: 'spec'
    });
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, ['srgb', 0.53846, 0.46154, 0, 0.325], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgb(100% 0% 0% / 0.7) 20%, rgb(0% 100% 0% / 0.2) 60%)');
    const value = color.resolveColorValue('rgb(53.846% 46.154% 0% / 0.26)');
    res[0] = Math.round(res[0]);
    res[1] = Math.round(res[1]);
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in srgb, blue, lab(46.2775% -47.5621 48.5837))');
    assert.deepEqual(res, [0, 64, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in srgb, lab(46.2775% -47.5621 48.5837), blue)');
    assert.deepEqual(res, [0, 64, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue, red)');
    assert.deepEqual(res, [127.5, 0, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue, green)');
    res[1] = parseFloat(res[1].toFixed(1));
    assert.deepEqual(res, [0, 27.5, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, #0000ff, #008000)');
    res[1] = parseFloat(res[1].toFixed(1));
    assert.deepEqual(res, [0, 27.5, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in srgb-linear, rgb(0 0 255), rgb(0 128 0))');
    res[1] = parseFloat(res[1].toFixed(1));
    assert.deepEqual(res, [0, 27.5, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, rgb(0 0 255), rgb(0 128 0))', {
      format: 'spec'
    });
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, ['srgb-linear', 0, 0.11, 0.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, hsl(240 100% 50%), hsl(120 100% 25%))');
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(2));
    assert.deepEqual(res, [0, 27.29, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, hwb(240 0% 0%), hwb(120 0% 50%))');
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(2));
    assert.deepEqual(res, [0, 27.29, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue 80%, red 80%)');
    assert.deepEqual(res, [127.5, 0, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, green 50%, purple)', {
      format: 'spec'
    });
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, ['srgb-linear', 0.10793, 0.10793, 0.10793, 1],
      'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue 100%, red)');
    assert.deepEqual(res, [0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, rgba(0, 0, 255, 0.5) 100%, red)');
    assert.deepEqual(res, [0, 0, 255, 0.5], 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in srgb-linear, red, rgba(0, 0, 255, 0.5) 100%)', {
        format: 'spec'
      });
    assert.deepEqual(res, ['srgb-linear', 0, 0, 1, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, rgb(100% 0% 50% / 0.7) 25%, rgb(0% 100% 30% / 0.2))', {
      format: 'spec'
    });
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    res[3] = parseFloat(res[3].toFixed(3));
    assert.deepEqual(res, ['srgb-linear', 0.538, 0.462, 0.149, 0.325],
      'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, currentColor, red)');
    res[2] = parseFloat(res[2].toFixed(1));
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue, currentColor)');
    assert.deepEqual(res, [0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz, red, green)');
    const value = color.resolveColorValue('rgb(188, 92, 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz, red, green)', {
      format: 'spec'
    });
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    res[3] = parseFloat(res[3].toFixed(4));
    assert.deepEqual(res, ['xyz-d65', 0.2448, 0.1835, 0.0225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz, red, green 90%)');
    const value = color.resolveColorValue('rgb(89, 122, 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz, red 90%, green)');
    const value = color.resolveColorValue('rgb(243, 40, 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in xyz, color(srgb 1 0 0), color(srgb 0 0.5 0))');
    const value = color.resolveColorValue('rgb(188, 92, 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz, color(srgb 1 0 0 / 0.5), color(srgb 0 0.5 0 / 0.5))', {
      format: 'spec'
    });
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, ['xyz-d65', 0.24446, 0.18286, 0.02242, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz-d65, red, green)');
    const value = color.resolveColorValue('rgb(188, 92, 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz-d65, red, green 90%)');
    const value = color.resolveColorValue('rgb(89, 122, 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz-d65, red 90%, green)');
    const value = color.resolveColorValue('rgb(243, 40, 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz, currentColor, red)');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz, blue, currentColor)');
    assert.deepEqual(res, [0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, red, green)');
    const value = color.resolveColorValue('rgb(188, 92, 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, red, green)', {
      format: 'spec'
    });
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    res[3] = parseFloat(res[3].toFixed(4));
    assert.deepEqual(res, ['xyz-d50', 0.2596, 0.1886, 0.0174, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, red, green 90%)');
    const value = color.resolveColorValue('rgb(89, 122, 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, red 90%, green)');
    const value = color.resolveColorValue('rgb(243, 40, 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, color(srgb 1 0 0), color(srgb 0 0.5 0))');
    const value = color.resolveColorValue('rgb(188, 92, 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, color(srgb 1 0 0 / 0.5), color(srgb 0 0.5 0 / 0.5))', {
      format: 'spec'
    });
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, ['xyz-d50', 0.25925, 0.18797, 0.01735, 0.5],
      'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, currentColor, blue)');
    assert.deepEqual(res, [0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, red, currentColor)');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, blue, green)');
    const value = color.resolveColorValue('hsl(180 100% 37.6%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, blue, green)', {
      format: 'spec'
    });
    res[2] = parseFloat(res[2].toFixed(4));
    res[3] = parseFloat(res[3].toFixed(4));
    assert.deepEqual(res, ['srgb', 0, 0.7529, 0.7529, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in hsl, color(srgb 0 0 1), color(srgb 0 0.5 0))');
    assert.deepEqual(res, [0, 192, 192, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, white, green)');
    const value = color.resolveColorValue('hsl(120 100% 62.549%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20%), hsl(30 30% 40%))');
    const value = color.resolveColorValue('hsl(75 20% 30%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hsl, hsl(120 10% 20%) 25%, hsl(30 30% 40%))');
    const value = color.resolveColorValue('hsl(52.5 25% 35%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hsl, hsl(120 10% 20%), hsl(30 30% 40%) 25%)');
    const value = color.resolveColorValue('hsl(97.5 15% 25%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hsl, hsl(120 10% 20%) 25%, hsl(30 30% 40%) 75%)');
    const value = color.resolveColorValue('hsl(52.5 25% 35%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hsl, hsl(120 10% 20%) 30%, hsl(30 30% 40%) 90%)');
    const value = color.resolveColorValue('hsl(52.5 25% 35%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hsl, hsl(120 10% 20%) 12.5%, hsl(30 30% 40%) 37.5%)');
    const value = color.resolveColorValue('hsl(52.5 25% 35% / 0.5)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20%) 0%, hsl(30 30% 40%))');
    const value = color.resolveColorValue('hsl(30 30% 40%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hsl, hsl(120 10% 20% / .4), hsl(30 30% 40% / .8))');
    const value = color.resolveColorValue('rgba(95, 105, 65, 0.6)');
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hsl, hsl(120 10% 20%) 25%, hsl(30 30% 40% / .8))');
    const value = color.resolveColorValue('rgba(108, 103, 66, 0.85)');
    res[3] = parseFloat(res[3].toFixed(3));
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20% / .4), hsl(30 30% 40% / .8) 25%)');
    const value = color.resolveColorValue('rgba(68, 84, 59, 0.5)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20% / .4) 25%, hsl(30 30% 40% / .8) 75%)');
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [121, 114, 69, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20% / .4) 30%, hsl(30 30% 40% / .8) 90%)');
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [121, 114, 69, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20% / .4) 12.5%, hsl(30 30% 40% / .8) 37.5%)');
    res[3] = parseFloat(res[3].toFixed(3));
    assert.deepEqual(res, [121, 114, 69, 0.35], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20% / .4) 0%, hsl(30 30% 40% / .8))');
    const value = color.resolveColorValue('rgba(133, 102, 71, 0.8)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, blue, green)');
    assert.deepEqual(res, [0, 192, 192, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, blue, green)', {
      format: 'spec'
    });
    res[2] = parseFloat(res[2].toFixed(4));
    res[3] = parseFloat(res[3].toFixed(4));
    assert.deepEqual(res, ['srgb', 0, 0.7529, 0.7529, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in hwb, color(srgb 0 0 1), color(srgb 0 0.5 0))');
    assert.deepEqual(res, [0, 192, 192, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, white, green)');
    assert.deepEqual(res, [127, 192, 128, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(0 100% 0%), hwb(0 0% 100%))');
    assert.deepEqual(res, [127, 128, 128, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20%), hwb(30 30% 40%))');
    assert.deepEqual(res, [146, 179, 51, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in hwb, hwb(120 10% 20%) 25%, hwb(30 30% 40%))');
    assert.deepEqual(res, [166, 153, 64, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in hwb, hwb(120 10% 20%), hwb(30 30% 40%) 25%)');
    assert.deepEqual(res, [95, 191, 38, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in hwb, hwb(120 10% 20%) 25%, hwb(30 30% 40%) 75%)');
    assert.deepEqual(res, [166, 153, 64, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in hwb, hwb(120 10% 20%) 30%, hwb(30 30% 40%) 90%)');
    assert.deepEqual(res, [166, 153, 64, 1], 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hwb, hwb(120 10% 20%) 12.5%, hwb(30 30% 40%) 37.5%)');
    assert.deepEqual(res, [166, 153, 64, 0.5], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in hwb, hwb(120 10% 20%) 0%, hwb(30 30% 40%))');
    assert.deepEqual(res, [153, 115, 77, 1], 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hwb, hwb(120 10% 20% / .4), hwb(30 30% 40% / .8))');
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [142, 170, 60, 0.6], 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hwb, hwb(120 10% 20%) 25%, hwb(30 30% 40% / .8))');
    res[3] = parseFloat(res[3].toFixed(3));
    assert.deepEqual(res, [168, 155, 62, 0.85], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20% / .4), hwb(30 30% 40% / .8) 25%)');
    assert.deepEqual(res, [97, 184, 46, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20% / .4) 25%, hwb(30 30% 40% / .8) 75%)');
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [160, 149, 70, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20% / .4) 30%, hwb(30 30% 40% / .8) 90%)');
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [160, 149, 70, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20% / .4) 12.5%, hwb(30 30% 40% / .8) 37.5%)');
    res[3] = parseFloat(res[3].toFixed(3));
    assert.deepEqual(res, [160, 149, 70, 0.35], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20% / .4) 0%, hwb(30 30% 40% / .8))');
    assert.deepEqual(res, [153, 115, 77, 0.8], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in lab, red, green)');
    const value = color.resolveColorValue('lab(50.284 16.626 59.2386)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in lab, red, green)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['lab', 50.2841, 16.6263, 59.2386, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in lab, color(srgb 1 0 0), color(srgb 0 0.5 0))');
    const value = color.resolveColorValue('lab(50.284 16.626 59.2386)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in lab, red, green 90%)');
    const value =
        color.resolveColorValue('lab(47.07899 -34.716675 50.71676)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in lab, red 90%, green)');
    const value = color.resolveColorValue('lab(53.489 67.969 67.7605)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in lch, red, green)');
    const value = color.resolveColorValue('lch(50.28% 87.41 87.62)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in lch, red, green)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['lch', 50.2841, 87.4107, 87.6208, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in lch, color(srgb 1 0 0), color(srgb 0 0.5 0))');
    const value = color.resolveColorValue('lch(50.28% 87.41 87.62)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in lch, red, green 90%)');
    const value = color.resolveColorValue('lch(47.08% 71.87 125.03)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in lch, red 90%, green)');
    const value = color.resolveColorValue('lch(53.49 102.95 50.21)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklab, red, green)');
    const value =
        color.resolveColorValue('oklab(0.573853594 0.04228 0.116761 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklab, red, green)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['oklab', 0.573854, 0.0422804, 0.116761, 1],
      'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in oklab, color(srgb 1 0 0), color(srgb 0 0.5 0))');
    const value =
        color.resolveColorValue('oklab(0.573853594 0.04228 0.116761 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklab, red, green 90%)');
    const value =
        color.resolveColorValue('oklab(0.53057 -0.104 0.10949 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklab, red 90%, green)');
    const value = color.resolveColorValue('oklab(0.6171 0.1883 0.124 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklch, red, green)');
    const value =
      color.resolveColorValue('oklch(0.573854 0.217271 85.8646 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklch, red, green)', {
      format: 'spec'
    });
    assert.deepEqual(res, ['oklch', 0.573854, 0.217271, 85.8646, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in oklch, color(srgb 1 0 0), color(srgb 0 0.5 0))');
    const value = color.resolveColorValue('oklch(0.573121 0.217022 85.8646)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklch, red, green 90%)');
    const value = color.resolveColorValue('oklch(0.530572 0.184941 131.169)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklch, red 90%, green)');
    const value = color.resolveColorValue(' oklch(0.617135 0.249601 40.56)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in srgb, color(srgb 0 0.5 0), color(srgb 1 0 1))');
    assert.deepEqual(res, [127.5, 64, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)'; // rgb(77, 128, 179)
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [134.5, 127.5, 121.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(none 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [77, 127.5, 121.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb none 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [192, 128, 121.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(none 128 64 / 1)';
    const colorB = 'color(srgb none 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [0, 128, 121.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 none 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [134.5, 127, 121.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 none 0.7 / 1)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [134.5, 128, 121.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 none 64 / 1)';
    const colorB = 'color(srgb 0.3 none 0.7 / 1)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [134.5, 0, 121.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 none / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [134.5, 127.5, 179, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 none / 1)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [134.5, 127.5, 64, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 none / 1)';
    const colorB = 'color(srgb 0.3 0.5 none / 1)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [134.5, 127.5, 0, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [134.5, 127.5, 121.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [134.5, 127.5, 121.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [134.5, 127.5, 121.5, 0], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / .5)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0.375163, 0.36732, 0.138562, 0.75],
      'result');
  });

  // FIXME:
  // firefox: color(srgb 0 0 0 / none)
  // chrome: color(srgb none none none / none)
  it('should get value', () => {
    const colorA = 'hsl(none none none / none)';
    const colorB = 'lch(none none none / none)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    // [0.5271151257058131, 0.21586050011389923, 0.05126945837404324, 1]
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    // [0.07421356838014963, 0.21586050011389923, 0.45078578283822346, 1]
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [76.545, 54.81, 63.655, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(none 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [18.676, 54.81, 63.655, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb none 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [134.414, 54.81, 63.655, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(none 128 64 / 1)';
    const colorB = 'color(srgb none 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0, 54.81, 63.655, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 none 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [76.545, 54.58, 63.655, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 none 0.7 / 1)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [76.545, 55.044, 63.655, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 none 64 / 1)';
    const colorB = 'color(srgb 0.3 none 0.7 / 1)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [76.545, 0, 63.655, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 none / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(1));
    assert.deepEqual(res, [76.545, 54.81, 114.2, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 none / 1)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, [76.545, 54.81, 13.07, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 none / 1)';
    const colorB = 'color(srgb 0.3 0.5 none / 1)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    assert.deepEqual(res, [76.545, 54.81, 0, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [76.545, 54.81, 63.655, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [76.545, 54.81, 63.655, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [76.545, 54.81, 63.655, 0], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / .5)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb-linear', 0.200947, 0.158997, 0.0197107, 0.75],
      'result');
  });

  // FIXME:
  // firefox: color(srgb 0 0 0 / none)
  // chrome: color(srgb none none none / none)
  it('should get value', () => {
    const colorA = 'hsl(none none none / none)';
    const colorB = 'lch(none none none / none)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb-linear', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [149, 128, 137, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(none 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [124, 113, 138, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb none 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [188, 106, 138, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(none 128 64 / 1)';
    const colorB = 'color(srgb none 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [0, 156, 135, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 none 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [133, 120, 135, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 none 0.7 / 1)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [101, 153, 131, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 none 64 / 1)';
    const colorB = 'color(srgb 0.3 none 0.7 / 1)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [175, 0, 141, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 none / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [122, 130, 178, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 none / 1)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [146, 128, 67, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 none / 1)';
    const colorB = 'color(srgb 0.3 0.5 none / 1)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [152, 127, 0, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [149, 128, 137, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [149, 128, 137, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [149, 128, 137, 0], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / .5)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['xyz-d65', 0.143281, 0.157862, 0.0415717, 0.75],
      'result');
  });

  // FIXME:
  // firefox: color(srgb 0 0 0 / none)
  // chrome: color(srgb none none none / none)
  it('should get value', () => {
    const colorA = 'hsl(none none none / none)';
    const colorB = 'lch(none none none / none)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['xyz-d65', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [149, 128, 137, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(none 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [116, 115, 138, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb none 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [193, 101, 138, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(none 128 64 / 1)';
    const colorB = 'color(srgb none 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [0, 156, 135, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 none 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [134, 118, 135, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 none 0.7 / 1)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [94, 155, 130, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 none 64 / 1)';
    const colorB = 'color(srgb 0.3 none 0.7 / 1)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [176, 0, 141, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 none / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [130, 129, 178, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 none / 1)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [147, 128, 67, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 none / 1)';
    const colorB = 'color(srgb 0.3 0.5 none / 1)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [152, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / 1)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [149, 128, 137, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [149, 128, 137, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / .5)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['xyz-d50', 0.151684, 0.159887, 0.032309, 0.75],
      'result');
  });

  // FIXME:
  // firefox: color(srgb 0 0 0 / none)
  // chrome: color(srgb none none none / none)
  it('should get value', () => {
    const colorA = 'hsl(none none none / none)';
    const colorB = 'lch(none none none / none)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['xyz-d50', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [149, 128, 137, 0], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(85.69 48.2% 30.5%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'currentColor';
    const colorB = 'lch(70% 70 90 / 1)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(51.38 86.6% 40.98%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'currentColor';
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(120 9.8% 20% / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [115, 104, 40, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(120 54.9% 45.5%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(0 54.9% 45.5%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 none 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [145, 126, 10, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% none 90 / 1)';
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [100, 122, 100, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 none 20% / 1)';
    const colorB = 'lch(70% none 90 / 1)';
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(0 0% 43.5%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(70% 70 90 / 1)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(51.38 86.6% 40.98%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(60 54.9% 20%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(0 100% 0%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / 1)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(85.69 48.2% 30.5%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(85.69 48.2% 30.5%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)'; // hsl(51.38 86.6% 40.98% / 0)
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hsl(85.69 48.2% 30.5% / 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / .5)';
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0.282353, 0.364706, 0.172549, 0.75],
      'result');
  });

  // FIXME:
  // firefox: color(srgb 0 0 0 / none)
  // chrome: color(srgb none none none / none)
  it('should get value', () => {
    const colorA = 'hsl(none none none / none)';
    const colorB = 'lch(none none none / none)';
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hwb(85.6653 11.8% 50.7% / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hwb(51.33 11.8% 50.7% / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [77, 155, 77, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [155, 77, 77, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / 1)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hwb(85.665 11.8% 50.7% / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)'; // hsl(51.38 86.6% 40.98% / 0)
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hwb(85.665 11.8% 50.7% / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hwb(85.665 11.8% 50.7% / 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hwb(120 10% 20% / 1)';
    const colorB = 'hwb(30 30% 40% / 1)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [146, 179, 51, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'currentColor';
    const colorB = 'hwb(30 30% 40% / 1)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [77, 58, 39, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hwb(120 10% 20% / 1)';
    const colorB = 'currentColor';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [12, 102, 13, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hwb(120 none 20% / 1)';
    const colorB = 'hwb(30 30% 40% / 1)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [144, 179, 39, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hwb(120 10% 20% / 1)';
    const colorB = 'hwb(30 none 40% / 1)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [136, 178, 13, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hwb(120 none 20% / 1)';
    const colorB = 'hwb(30  none 40% / 1)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hwb(75 0% 30% / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hwb(120 10% none / 1)';
    const colorB = 'hwb(30 30% 40% / 1)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hwb(75 20% 20% / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hwb(120 10% 20% / 1)';
    const colorB = 'hwb(30 30% none / 1)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [184, 230, 51, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hwb(120 10% none / 1)';
    const colorB = 'hwb(30 30% none / 1)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('hwb(75 20% 0% / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hwb(120 50% 50% / 1)';
    const colorB = 'hwb(30 30% 40% / 1)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`);
    assert.deepEqual(res, [112, 141, 102, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / .5)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0.290196, 0.4, 0.137255, 0.75],
      'result');
  });

  // FIXME:
  // firefox: color(srgb 0 0 0 / none)
  // chrome: color(srgb none none none / none)
  it('should get value', () => {
    const colorA = 'hsl(none none none / none)';
    const colorB = 'lch(none none none / none)';
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`, {
      format: 'spec'
    });
    assert.deepEqual(res, ['srgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lab(46.166 -3.0737 37.40635 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'currentColor';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lab(70 0 70 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'currentColor';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('lab(22.332 -6.1474695 4.8127 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lab(70 0 70 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('lab(22.332 -6.147469558 4.8127 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lab(0 0 0 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lab(46.166 -3.0737 37.406 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lab(46.166 -3.0737 37.406 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lab(46.166 -3.0737 37.406 / 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'black';
    const colorB = 'white';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lab(50% 0% 0% / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'lab(50% 25.124% 37.64%)';
    const colorB = 'white';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lab(75 31.4 47.1 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(46.12 38.88 116 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'currentColor';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(70 70 90 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'currentColor';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(22.332 7.8 141.94 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(70 70 90 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(22.332 7.807 141.94 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(0 0 0 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 none 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('lch(45.574795 69.945 90.052 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% none 90 / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(46.157 7.8 141.94 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 none 20% / 1)';
    const colorB = 'lch(70% none 90 / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(45.6 0 0 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(45 37.5 90.1 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(46.166 38.9 141.94 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(45.03 37.51 0 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(46.12 38.88 116 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(46.12 38.88 116 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('lch(46.12 38.88 116 / 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklab(0.532 -0.01913 0.080463 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'currentColor';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklab(0.736 -0.0202 0.1483344 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'currentcolor';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklab(0 -0.018 0.012592 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklab(0.736 -0.020 0.1483344 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklab(0.328 -0.018 0.012592 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklab(0 0 0 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 none 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklab(0.5287 -0.01012 0.074 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% none 90 / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklab(0.534687 -0.009 0.006296 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 none 20% / 1)';
    const colorB = 'lch(70% none 90 / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklab(0.5312 0 0 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklab(0.524 -0.003165 0.0764 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklab(0.5464 0.0987 0.00504696 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklab(0.5385 0.114672 0.001 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklab(0.532 -0.0191 0.080463 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklab(0.532 -0.0191 0.080463 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklab(0.532 -0.0191 0.080463 / 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'white';
    const colorB = 'black';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklab(0.498396 0 0)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'lab(50% 25.124% 37.64%)';
    const colorB = 'white';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklab(0.78766 0.07926686 0.10096213 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklch(0.53219 0.0858463 121.413)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'currentColor';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklch(0.736384 0.14971 97.7728)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'currentColor';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklch(0.327995 0.0219827 145.053)');
    assert.deepEqual(res, value, 'result');
  });

  // FIXME:
  it.skip('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    // chrome: oklch(0.368193 0.0748579 97.7736)
    const value = color.resolveColorValue('oklch(0.736384 0.074855 48.8864)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    // chrome: oklch(0.327971 0.276585 80.8408)
    const value = color.resolveColorValue('oklch(0.327995 0.0219827 145.053)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    // chrome: oklch(0 0.265596 16.6642)
    const value = color.resolveColorValue('oklch(none 0 0)');
    assert.deepEqual(res, value, 'result');
  });

  // FIXME:
  it.skip('should get value', () => {
    const colorA = 'hsl(120 none 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    // chrome: oklch(0.528728 0.149716 60.7488)
    const value = color.resolveColorValue('oklch(0.736384 0.074855 48.8864)');
    assert.deepEqual(res, value, 'result');
  });

  // FIXME:
  it.skip('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% none 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    // chrome: oklch(0.534675 0.0219772 128.84)
    const value = color.resolveColorValue('oklch(0.327995 0.0219827 145.053)');
    assert.deepEqual(res, value, 'result');
  });

  // FIXME:
  it.skip('should get value', () => {
    const colorA = 'hsl(120 none 20% / 1)';
    const colorB = 'lch(70% none 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    // chrome: oklch(0.531224 none 68.1929)
    const value = color.resolveColorValue('oklch(none 2.98023e-8 0)');
    assert.deepEqual(res, value, 'result');
  });

  // FIXME:
  it.skip('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    // chrome: oklch(0.736386 0.0821822 57.872)
    const value = color.resolveColorValue('oklch(0.524281 0.0821703 57.8678)');
    assert.deepEqual(res, value, 'result');
  });

  // FIXME:
  it.skip('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    // chrome: oklch(0.546422 0.118695 145.017)
    const value = color.resolveColorValue('oklch(0.534687 0.0109914 145.053)');
    assert.deepEqual(res, value, 'result');
  });

  // FIXME:
  it.skip('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    // chrome: oklch(0.764872 0.115031 17.9704)
    const value = color.resolveColorValue('oklch(0.526779 0.00731534 17.9629)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklch(0.53219 0.0858463 121.413)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklch(0.53219 0.0858463 121.413)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value =
      color.resolveColorValue('oklch(0.53219 0.0858463 121.413 / none)');
    assert.deepEqual(res, value, 'result');
  });
});
*/
