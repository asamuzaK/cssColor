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
    assert.throws(() => func('0foo'), Error, 'Invalid property value: 0foo');
  });

  it('should throw', () => {
    assert.throws(() => func('.'), Error, 'Invalid property value: .');
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
    const res = func([0, 127, 0]);
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
    const xyz = color.parseColorValue('rgb(48.477% 34.29% 38.412%)');
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.5, 0.05, 0, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(29.264% 70.096% 63.017%)');
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = Math.abs(parseFloat(res[2].toFixed(3)));
    assert.deepEqual(res, [0.7, -0.1, 0, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(73.942% 60.484% 19.65%)');
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = Math.abs(parseFloat(res[1].toFixed(5)));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.7, 0, 0.125, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(27.888% 38.072% 89.414%)');
    const res = func(xyz);
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
    const xyz = color.parseColorValue('#008000');
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.52, 0.18, 142.4953, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#000000');
    const res = func(xyz);
    assert.deepEqual(res, [0, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#ffffff');
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(4));
    assert.deepEqual(res, [1, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#808080');
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(5));
    assert.deepEqual(res, [0.6, 0, 'none', 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(70.492% 2.351% 37.073%)');
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(Math.round(res[2]));
    assert.deepEqual(res, [0.5, 0.2, 0, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(23.056% 31.73% 82.628%)');
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(Math.round(res[2]));
    assert.deepEqual(res, [0.5, 0.2, 270, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(32.022% 85.805% 61.147%)');
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(Math.round(res[2]));
    assert.deepEqual(res, [0.8, 0.15, 160, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(67.293% 27.791% 52.28%)');
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(Math.round(res[2]));
    assert.deepEqual(res, [0.55, 0.15, 345, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#7654cd');
    const res = func(xyz);
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
    const xyz = color.parseColorValue('#008000', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(1));
    assert.deepEqual(res, [46.278, -47.6, 48.6, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#000000', true);
    const res = func(xyz);
    assert.deepEqual(res, [0, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#ffffff', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(5));
    assert.deepEqual(res, [100, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(75.6208% 30.4487% 47.5634%)', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = Math.abs(parseFloat(res[2].toFixed(2)));
    assert.deepEqual(res, [50, 50, 0, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(10.751% 75.558% 66.398%)', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, [70, -45, 0, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(76.6254% 66.3607% 5.5775%)', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, [70, 0, 70, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(12.8128% 53.105% 92.7645%)', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = Math.abs(parseFloat(res[1].toFixed(2)));
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, [55, 0, -60, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(12.8128% 53.105% 92.7645% / 0.4)', {
      alpha: true
    });
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = Math.abs(parseFloat(res[1].toFixed(2)));
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, [55, 0, -60, 0.4], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#7654cd', {
      alpha: true
    });
    const res = func(xyz);
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
    const xyz = color.parseColorValue('#008000', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27771, 67.98426, 134.38386, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#000000', true);
    const res = func(xyz);
    assert.deepEqual(res, [0, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#ffffff', true);
    const res = func(xyz);
    assert.deepEqual(res, [100, 'none', 'none', 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#808080', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    assert.deepEqual(res, [53.585, 0, 'none', 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#010101', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    assert.deepEqual(res, [0.274, 0, 'none', 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#fefefe', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    assert.deepEqual(res, [99.6549, 0, 'none', 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(75.6208% 30.4487% 47.5634%)', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(0));
    res[1] = parseFloat(res[1].toFixed(0));
    res[2] = parseFloat(res[2].toFixed(0));
    assert.deepEqual(res, [50, 50, 360, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(10.7906% 75.5567% 66.3982%)', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(0));
    res[1] = parseFloat(res[1].toFixed(0));
    res[2] = parseFloat(res[2].toFixed(0));
    assert.deepEqual(res, [70, 45, 180, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(76.6254% 66.3607% 5.5775%)', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(0));
    res[1] = parseFloat(res[1].toFixed(0));
    res[2] = parseFloat(res[2].toFixed(0));
    assert.deepEqual(res, [70, 70, 90, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('rgb(12.8128% 53.105% 92.7645%)', true);
    const res = func(xyz);
    res[0] = parseFloat(res[0].toFixed(0));
    res[1] = parseFloat(res[1].toFixed(0));
    res[2] = parseFloat(res[2].toFixed(0));
    assert.deepEqual(res, [55, 60, 270, 1], 'result');
  });

  it('should get value', () => {
    const xyz = color.parseColorValue('#7654cd', true);
    const res = func(xyz);
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
    assert.throws(() => func('white'), Error,
      'Invalid property value: white');
  });

  it('should throw', () => {
    assert.throws(() => func('#1'), Error, 'Invalid property value: #1');
  });

  it('should throw', () => {
    assert.throws(() => func('#12'), Error, 'Invalid property value: #12');
  });

  it('should throw', () => {
    assert.throws(() => func('#12345'), Error,
      'Invalid property value: #12345');
  });

  it('should throw', () => {
    assert.throws(() => func('#1234567'), Error,
      'Invalid property value: #1234567');
  });

  it('should throw', () => {
    assert.throws(() => func('#123456789'), Error,
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
    res[3] = parseFloat(res[3].toFixed(1));
    assert.deepEqual(res, [255, 0, 0, 0.1], 'result');
  });

  it('should get value', () => {
    const res = func('#FF00001A');
    res[3] = parseFloat(res[3].toFixed(1));
    assert.deepEqual(res, [255, 0, 0, 0.1], 'result');
  });

  it('should get value', () => {
    const res = func('#f001');
    res[3] = parseFloat(res[3].toFixed(1));
    assert.deepEqual(res, [255, 0, 0, 0.1], 'result');
  });

  it('should get value', () => {
    const res = func('#F001');
    res[3] = parseFloat(res[3].toFixed(1));
    assert.deepEqual(res, [255, 0, 0, 0.1], 'result');
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
    assert.throws(() => func('foo'), Error, 'Invalid property value: foo');
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
    assert.deepEqual(res, [0.0003, 0.01681, 0.05951, 0.40392], 'result');
  });

  it('should get value', () => {
    const res = func('#89abcdef');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.25016, 0.40724, 0.6105, 0.93725], 'result');
  });
});

describe('hex to xyz', () => {
  const func = color.convertHexToXyz;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('foo'), Error, 'Invalid property value: foo');
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
    assert.deepEqual(res, [0.01688, 0.01638, 0.05858, 0.40392], 'result');
  });

  it('should get value', () => {
    const res = func('#89abcdef');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.35897, 0.38851, 0.63367, 0.93725], 'result');
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
});

describe('parse rgb()', () => {
  const func = color.parseRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('rgb(1, 2, 3 / 1)'), Error,
      'Invalid property value: rgb(1, 2, 3 / 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('rgb(none, 2, 3)'), Error,
      'Invalid property value: rgb(none, 2, 3)');
  });

  it('should throw', () => {
    assert.throws(() => func('rgb(1, none, 3)'), Error,
      'Invalid property value: rgb(1, none, 3)');
  });

  it('should throw', () => {
    assert.throws(() => func('rgb(1, 2, none)'), Error,
      'Invalid property value: rgb(1, 2, none)');
  });

  it('should throw', () => {
    assert.throws(() => func('rgba(1, 2, 3, none)'), Error,
      'Invalid property value: rgba(1, 2, 3, none)');
  });

  it('should get value', () => {
    const res = func('rgb(10% 20% 30% / 40%)');
    assert.deepEqual(res, [25.5, 51, 76.5, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(10% 20% 30% / -40%)');
    assert.deepEqual(res, [25.5, 51, 76.5, 0], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(10% 20% 30% / 140%)');
    assert.deepEqual(res, [25.5, 51, 76.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(.1% .2% .3%)');
    assert.deepEqual(res, [0.255, 0.51, 0.765, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(.1% .2% .3% / .4)');
    assert.deepEqual(res, [0.255, 0.51, 0.765, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(none none none)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(none none none / none)');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(128 none none)');
    assert.deepEqual(res, [128, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(128 none none / none)');
    assert.deepEqual(res, [128, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(none none none / .5)');
    assert.deepEqual(res, [0, 0, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(20% none none)');
    assert.deepEqual(res, [51, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(20% none none / none)');
    assert.deepEqual(res, [51, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(none none none / 50%)');
    assert.deepEqual(res, [0, 0, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(none none none)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(none none none / none)');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(128 none none)');
    assert.deepEqual(res, [128, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(128 none none / none)');
    assert.deepEqual(res, [128, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(none none none / .5)');
    assert.deepEqual(res, [0, 0, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(20% none none)');
    assert.deepEqual(res, [51, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(20% none none / none)');
    assert.deepEqual(res, [51, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(none none none / 50%)');
    assert.deepEqual(res, [0, 0, 0, 0.5], 'result');
  });
});

describe('parse hsl()', () => {
  const func = color.parseHsl;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('hsl(1, 2%, 3% / 1)'), Error,
      'Invalid property value: hsl(1, 2%, 3% / 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('hsl(none, 2%, 3%)'), Error,
      'Invalid property value: hsl(none, 2%, 3%)');
  });

  it('should throw', () => {
    assert.throws(() => func('hsl(1, none, 3%)'), Error,
      'Invalid property value: hsl(1, none, 3%)');
  });

  it('should throw', () => {
    assert.throws(() => func('hsl(1, 2%, none)'), Error,
      'Invalid property value: hsl(1, 2%, none)');
  });

  it('should throw', () => {
    assert.throws(() => func('hsla(1, 2%, 3%, none)'), Error,
      'Invalid property value: hsla(1, 2%, 3%, none)');
  });

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / 40%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [255, 0, 0, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / -40%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [255, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / 140%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(0 .1% 50%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [128, 128, 128, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(0 .1% .1%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [1, 1, 1, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(60deg 100% 50% / .4)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [255, 255, 0, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 50%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [0, 255, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(180 100% 50%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [0, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(240 100% 50%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(300 100% 50%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [255, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(none none none / none)');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(none none none)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsla(none none none)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsla(none none none / none)');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 none none)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 0% 0%)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 80% 0%)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 none 50%)');
    assert.deepEqual(res, [127.5, 127.5, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 0% 50%)');
    assert.deepEqual(res, [127.5, 127.5, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 50% / none)');
    assert.deepEqual(res, [0, 255, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 50% / 0)');
    assert.deepEqual(res, [0, 255, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(none 100% 50% / 0)');
    assert.deepEqual(res, [255, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / 0)');
    assert.deepEqual(res, [255, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 50% / 0)');
    assert.deepEqual(res, [0, 255, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(none 100% 50%)');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(0 100% 50%)');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });
});

describe('parse hwb()', () => {
  const func = color.parseHwb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('hsw(1, 20%, 30% / 1)'), Error,
      'Invalid property value: hsw(1, 20%, 30% / 1)');
  });

  it('should get value', () => {
    const res = func('hwb(240 0% 0%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(0 0% 100%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(0 100% 100%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [128, 128, 128, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 70% 60%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [138, 138, 138, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 20% 30%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [51, 179, 51, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 .2% 30%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [1, 179, 1, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 20% .3%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [51, 255, 51, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / .5)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [64, 128, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / 70%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [64, 128, 0, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / -70%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [64, 128, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / 170%)');
    const l = 3;
    let i = 0;
    while (i < l) {
      res[i] = Math.ceil(res[i]);
      i++;
    }
    assert.deepEqual(res, [64, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(none none none)');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(none none none / none)');
    assert.deepEqual(res, [255, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 none none)');
    assert.deepEqual(res, [0, 255, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 80% none)');
    assert.deepEqual(res, [204, 255, 204, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 80% 0%)');
    assert.deepEqual(res, [204, 255, 204, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 none 50%)');
    assert.deepEqual(res, [0, 127.5, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)');
    assert.deepEqual(res, [0, 127.5, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / none)');
    res[1] = Math.round(res[1].toFixed(1));
    assert.deepEqual(res, [76.5, 128, 76.5, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / 0)');
    res[1] = Math.round(res[1].toFixed(1));
    assert.deepEqual(res, [76.5, 128, 76.5, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / none)');
    res[1] = Math.round(res[1].toFixed(1));
    assert.deepEqual(res, [76.5, 128, 76.5, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / 0)');
    res[1] = Math.round(res[1].toFixed(1));
    assert.deepEqual(res, [76.5, 128, 76.5, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(none 100% 50% / none)');
    res[1] = Math.round(res[1].toFixed(1));
    assert.deepEqual(res, [170, 170, 170, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(0 100% 50% / 0)');
    res[1] = Math.round(res[1].toFixed(1));
    assert.deepEqual(res, [170, 170, 170, 0], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(180 0% 25% / 1)');
    assert.deepEqual(res, [0, 191.25, 191.25, 1], 'result');
  });
});

describe('parse lab()', () => {
  const func = color.parseLab;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('lab(100%, 20%, 30% / 1)'), Error,
      'Invalid property value: lab(100%, 20%, 30% / 1)');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)');
    const val = color.convertRgbToXyzD50([0, 128, 0]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(0 0 0)');
    const val = color.convertRgbToXyzD50([0, 0, 0]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(100 0 0)');
    const val = color.convertRgbToXyzD50([255, 255, 255]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(100% 0 0)');
    const val = color.convertRgbToXyzD50([255, 255, 255]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(110% 0 0)');
    const val = color.convertRgbToXyzD50([255, 255, 255]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(50 50 0)');
    const val = color.parseColorValue('rgb(75.6208% 30.4487% 47.5634%)', true);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(70 -45 0)');
    const val = color.parseColorValue('rgb(10.751% 75.558% 66.398%)', true);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(70 0 70)');
    const val = color.parseColorValue('rgb(76.6254% 66.3607% 5.5775%)', true);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(55 0 -60)');
    const val = color.parseColorValue('rgb(12.8128% 53.105% 92.7645%)', true);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59)');
    const val = color.convertRgbToXyzD50([118, 84, 205]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 1)');
    const val = color.convertRgbToXyzD50([118, 84, 205]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / .5)');
    const val = color.convertRgbToXyzD50([118, 84, 205, 0.5]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    res[3] = parseFloat(res[3].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    val[3] = parseFloat(val[3].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 50%)');
    const val = color.convertRgbToXyzD50([118, 84, 205, 0.5]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    res[3] = parseFloat(res[3].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    val[3] = parseFloat(val[3].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / -50%)');
    const val = color.convertRgbToXyzD50([118, 84, 205, 0]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    res[3] = parseFloat(res[3].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    val[3] = parseFloat(val[3].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 150%)');
    const val = color.convertRgbToXyzD50([118, 84, 205, 1]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    res[3] = parseFloat(res[3].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    val[3] = parseFloat(val[3].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(.5% 50% 50%)');
    const val = color.convertRgbToXyzD50([76, 0, 0]);
    res[0] = parseFloat(Math.round(res[0]));
    res[1] = parseFloat(Math.round(res[1]));
    res[2] = parseFloat(Math.round(res[2]));
    val[0] = parseFloat(Math.round(val[0]));
    val[1] = parseFloat(Math.round(val[1]));
    val[2] = parseFloat(Math.round(val[2]));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(-10% 50% 50%)');
    const val = color.convertRgbToXyzD50([75, 0, 0]);
    res[0] = parseFloat(Math.round(res[0]));
    res[1] = parseFloat(Math.round(res[1]));
    res[2] = parseFloat(Math.round(res[2]));
    val[0] = parseFloat(Math.round(val[0]));
    val[1] = parseFloat(Math.round(val[1]));
    val[2] = parseFloat(Math.round(val[2]));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(50% 50% .5%)');
    const val = color.convertRgbToXyzD50([209, 58, 121]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(50% .5% 50%)');
    const val = color.convertRgbToXyzD50([138, 117, 0]);
    res[0] = parseFloat(Math.round(res[0]));
    res[1] = parseFloat(Math.round(res[1]));
    res[2] = parseFloat(Math.round(res[2]));
    val[0] = parseFloat(Math.round(val[0]));
    val[1] = parseFloat(Math.round(val[1]));
    val[2] = parseFloat(Math.round(val[2]));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lab(none none none)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(none none none / none)');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });
});

describe('parse lch()', () => {
  const func = color.parseLch;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('lch(100%, 20%, 30% / 1)'), Error,
      'Invalid property value: lch(100%, 20%, 30% / 1)');
  });

  it('should get value', () => {
    const res = func('lch(46.278% 68.0 134.4)');
    const val = color.convertRgbToXyzD50([0, 128, 0]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(0% 0 0)');
    const val = color.convertRgbToXyzD50([0, 0, 0]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(100% 0 0)');
    const val = color.convertRgbToXyzD50([255, 255, 255]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(50% 50 0)');
    const val =
        color.parseColorValue('rgb(75.6208% 30.4487% 47.5634%)', true);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(1));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(70% 45 180)');
    const val =
        color.parseColorValue('rgb(10.7906% 75.5567% 66.3982%)', true);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(70% 70 90)');
    const val =
        color.parseColorValue('rgb(76.6254% 66.3607% 5.5775%)', true);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(55% 60 270)');
    const val =
        color.parseColorValue('rgb(12.8128% 53.105% 92.7645%)', true);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43)');
    const val = color.convertRgbToXyzD50([118, 84, 205]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)');
    const val = color.convertRgbToXyzD50([118, 84, 205, 1]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / .5)');
    const val = color.convertRgbToXyzD50([118, 84, 205, 0.5]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 50%)');
    const val = color.convertRgbToXyzD50([118, 84, 205, 0.5]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / -50%)');
    const val = color.convertRgbToXyzD50([118, 84, 205, 0]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 150%)');
    const val = color.convertRgbToXyzD50([118, 84, 205, 1]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(.5% 20 30)');
    const val = color.convertRgbToXyzD50([35, 0, 0]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(Math.round(res[1]));
    res[2] = parseFloat(Math.round(res[2]));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(Math.round(val[1]));
    val[2] = parseFloat(Math.round(val[2]));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(-10% 20 30)');
    const val = color.convertRgbToXyzD50([34, 0, 0]);
    res[0] = parseFloat(res[0].toFixed(0));
    res[1] = parseFloat(res[1].toFixed(0));
    res[2] = parseFloat(Math.round(res[2]));
    val[0] = parseFloat(val[0].toFixed(0));
    val[1] = parseFloat(val[1].toFixed(0));
    val[2] = parseFloat(Math.round(val[2]));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(10% .5 30)');
    const val = color.convertRgbToXyzD50([28, 27, 27]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(10% 20% 30)');
    const val = color.convertRgbToXyzD50([60, 6, 2]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(10% 20 -30)');
    const val = color.convertRgbToXyzD50([45, 17, 41]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('lch(none none none)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(none none none / none)');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });
});

describe('parse oklab()', () => {
  const func = color.parseOklab;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('oklab(100%, 20%, 30% / 1)'), Error,
      'Invalid property value: oklab(100%, 20%, 30% / 1)');
  });

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)');
    const val = color.convertRgbToXyz([0, 128, 0]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    val[0] = parseFloat(val[0].toFixed(4));
    val[1] = parseFloat(val[1].toFixed(4));
    val[2] = parseFloat(val[2].toFixed(4));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0 0 0)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(1 0 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.95046, 1, 1.08906, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(50% 0.05 0)');
    const val = color.convertRgbToXyz([124, 87, 98, 1]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.7 -0.1 0)');
    const val = color.convertRgbToXyz([75, 179, 161, 1]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(70% 0 0.125)');
    const val = color.convertRgbToXyz([189, 154, 50, 1]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.55 0 -0.2)');
    const val = color.convertRgbToXyz([71, 97, 228, 1]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567)');
    const val = color.convertRgbToXyz([118, 84, 205]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    val[0] = parseFloat(val[0].toFixed(4));
    val[1] = parseFloat(val[1].toFixed(4));
    val[2] = parseFloat(val[2].toFixed(4));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 1)');
    const val = color.convertRgbToXyz([118, 84, 205]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    val[0] = parseFloat(val[0].toFixed(4));
    val[1] = parseFloat(val[1].toFixed(4));
    val[2] = parseFloat(val[2].toFixed(4));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / .5)');
    const val = color.convertRgbToXyz([118, 84, 205, 0.5]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    res[3] = parseFloat(res[3].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(4));
    val[1] = parseFloat(val[1].toFixed(4));
    val[2] = parseFloat(val[2].toFixed(4));
    val[3] = parseFloat(val[3].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 50%)');
    const val = color.convertRgbToXyz([118, 84, 205, 0.5]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    res[3] = parseFloat(res[3].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(4));
    val[1] = parseFloat(val[1].toFixed(4));
    val[2] = parseFloat(val[2].toFixed(4));
    val[3] = parseFloat(val[3].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / -50%)');
    const val = color.convertRgbToXyz([118, 84, 205, 0]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    res[3] = parseFloat(res[3].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(4));
    val[1] = parseFloat(val[1].toFixed(4));
    val[2] = parseFloat(val[2].toFixed(4));
    val[3] = parseFloat(val[3].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 150%)');
    const val = color.convertRgbToXyz([118, 84, 205, 1]);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    res[3] = parseFloat(res[3].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(4));
    val[1] = parseFloat(val[1].toFixed(4));
    val[2] = parseFloat(val[2].toFixed(4));
    val[3] = parseFloat(val[3].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(.5% 20% 30%)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [-0.00079, 0.00027, -0.00618, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(-10% 20% 30%)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [-0.00096, 0.00029, -0.00678, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(10% 20% .5%)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.00261, 0.0007, 0.00067, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(10% .5% 30%)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.00201, 0.0008, -0.00075, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(none none none)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(none none none / none)');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });
});

describe('parse oklch()', () => {
  const func = color.parseOklch;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('oklch(100%, 20%, 30% / 1)'), Error,
      'Invalid property value: oklch(100%, 20%, 30% / 1)');
  });

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)');
    const val = color.convertRgbToXyz([0, 128, 0]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    val[0] = parseFloat(val[0].toFixed(5));
    val[1] = parseFloat(val[1].toFixed(5));
    val[2] = parseFloat(val[2].toFixed(5));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(0% 0 0)');
    const val = color.convertRgbToXyz([0, 0, 0]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(100% 0 0)');
    const val = color.convertRgbToXyz([255, 255, 255]);
    res[0] = parseFloat(res[0].toFixed(0));
    res[1] = parseFloat(res[1].toFixed(0));
    res[2] = parseFloat(res[2].toFixed(0));
    val[0] = parseFloat(val[0].toFixed(0));
    val[1] = parseFloat(val[1].toFixed(0));
    val[2] = parseFloat(val[2].toFixed(0));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(50% 0.2 0)');
    const val = color.parseColorValue('rgb(70.492% 2.351% 37.073%)');
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(50% 0.2 270)');
    const val = color.parseColorValue('rgb(23.056% 31.73% 82.628%)');
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(3));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(80% 0.15 160)');
    const val = color.parseColorValue('rgb(32.022% 85.805% 61.147%)');
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(2));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(55% 0.15 345)');
    const val = color.parseColorValue('rgb(67.293% 27.791% 52.28%)');
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37)');
    const val = color.convertRgbToXyz([118, 84, 205]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(2));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(1));
    val[2] = parseFloat(val[2].toFixed(2));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / 1)');
    const val = color.convertRgbToXyz([118, 84, 205]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(2));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(1));
    val[2] = parseFloat(val[2].toFixed(2));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / .5)');
    const val = color.convertRgbToXyz([118, 84, 205, 0.5]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(2));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(1));
    val[2] = parseFloat(val[2].toFixed(2));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / 50%)');
    const val = color.convertRgbToXyz([118, 84, 205, 0.5]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(2));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(1));
    val[2] = parseFloat(val[2].toFixed(2));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / -50%)');
    const val = color.convertRgbToXyz([118, 84, 205, 0]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(2));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(1));
    val[2] = parseFloat(val[2].toFixed(2));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / 150%)');
    const val = color.convertRgbToXyz([118, 84, 205, 1]);
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(2));
    res[3] = parseFloat(res[3].toFixed(1));
    val[0] = parseFloat(val[0].toFixed(1));
    val[1] = parseFloat(val[1].toFixed(1));
    val[2] = parseFloat(val[2].toFixed(2));
    val[3] = parseFloat(val[3].toFixed(1));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(.5 20% 30)');
    const val = color.convertRgbToXyz([139, 81, 72]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    val[0] = parseFloat(val[0].toFixed(3));
    val[1] = parseFloat(val[1].toFixed(2));
    val[2] = parseFloat(val[2].toFixed(3));
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(-10% 20% 30)');
    res[0] = parseFloat(Math.round(res[0].toFixed(1)));
    res[1] = parseFloat(Math.round(res[1].toFixed(1)));
    res[2] = parseFloat(Math.round(res[2].toFixed(1)));
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(10% 20% .5)');
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0.003, 0.001, 0.001, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(10% .5 30)');
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0.037, -0, -0.031, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(10% -0.5 30)');
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0.001, 0.001, 0.001, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(none none none)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(none none none / none)');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });
});

describe('parse color func', () => {
  const func = color.parseColorFunc;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('color(in foo, 1 1 1)'), Error,
      'Invalid property value: color(in foo, 1 1 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb)'), Error,
      'Invalid property value: color(srgb)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1)'), Error,
      'Invalid property value: color(srgb 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 1)'), Error,
      'Invalid property value: color(srgb 1 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb foo bar baz)'), Error,
      'Invalid property value: color(srgb foo bar baz)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 bar baz)'), Error,
      'Invalid property value: color(srgb 1 bar baz)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 1 baz)'), Error,
      'Invalid property value: color(srgb 1 1 baz)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 1 1 qux)'), Error,
      'Invalid property value: color(srgb 1 1 1 qux)');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    const value = color.parseColorValue('rgb(0% 50% 0%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)', true);
    const value = color.parseColorValue('rgb(0% 50% 0%)', true);
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.11391, 0.22781, 0.03797, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0)', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.12269, 0.22836, 0.03092, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 50% 50% 50% / 50%)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.20344, 0.21404, 0.2331, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb .5 .5 .5 / .5)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.20344, 0.21404, 0.2331, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.11391, 0.22781, 0.03797, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 50%)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.11391, 0.22781, 0.03797, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 150%)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.11391, 0.22781, 0.03797, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / -1)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.11391, 0.22781, 0.03797, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.08314, 0.15475, 0.02096, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.26374 0.59085 0.16434)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.11391, 0.22781, 0.03797, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.26374 0.59085 0.16434)', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.12269, 0.22836, 0.03092, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.299218 0.533327 0.120785)');
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.1139, 0.22781, 0.03797, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.299218 0.533327 0.120785)', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.12269, 0.22836, 0.03092, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0 1 0)', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.1657, 0.67532, 0.02998, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.33582 0.59441 0.13934)');
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.1139, 0.22781, 0.03797, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.33582 0.59441 0.13934)', true);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.1227, 0.22836, 0.03092, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.2861 0.49131 0.16133)');
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.1139, 0.22781, 0.038, 1], 'result');
  });

  it('should get value', () => {
    const res =
        func('color(prophoto-rgb 0.2861 0.49131 0.16133)', true);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.1227, 0.22836, 0.0309, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 1 0)');
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.1127, 0.71512, -0.0129, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 1 0)', true);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.1352, 0.71184, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.08314, 0.15475, 0.02096, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.07719 0.15438 0.02573)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.07719 0.15438 0.02573)', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.08314, 0.15475, 0.02096, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.08314 0.15475 0.02096)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.08314 0.15475 0.02096)', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.08314, 0.15475, 0.02096, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 1 1 / 1)');
    const val = func('color(srgb none 1 1 / 1)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 1 0 1 / 1)');
    const val = func('color(srgb 1 none 1 / 1)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 1 1 none / 1)');
    const val = func('color(srgb 1 1 none / 1)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 1 1 1 / 0)', {
      alpha: true
    });
    const val = func('color(srgb 1 1 1 / none)', {
      alpha: true
    });
    assert.deepEqual(res, val, 'result');
  });
});

describe('parse color value', () => {
  const func = color.parseColorValue;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('foo'), Error, 'Invalid property value: foo');
  });

  it('should throw', () => {
    assert.throws(() => func('#12345'), Error,
      'Invalid property value: #12345');
  });

  it('should throw', () => {
    assert.throws(() => func('foo(1 1 1)'), Error,
      'Invalid property value: foo(1 1 1)');
  });

  it('should get value', () => {
    const res = func('currentColor');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('transparent');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.08314, 0.15475, 0.02096, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#008000');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#008000', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.08314, 0.15475, 0.02096, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#080');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.08804, 0.17608, 0.02935, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#00800080', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.08314, 0.15475, 0.02096, 0.50196], 'result');
  });

  it('should get value', () => {
    const res = func('#0808');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    res[3] = parseFloat(res[3].toFixed(5));
    assert.deepEqual(res, [0.08804, 0.17608, 0.02935, 0.53333], 'result');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)');
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.0772, 0.1544, 0.0257, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)', true);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.0831, 0.1548, 0.021, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)');
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.0772, 0.1544, 0.0257, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)', true);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.0831, 0.155, 0.021, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)');
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(4));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.0772, 0.1544, 0.0257, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)', true);
    res[0] = parseFloat(res[0].toFixed(4));
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.0831, 0.155, 0.021, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.08314, 0.15475, 0.021, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 128 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 128 0)', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.08314, 0.15475, 0.021, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 25%)');
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0.077, 0.15, 0.026, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 25%)', true);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0.08, 0.15, 0.021, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 49.8039%)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 49.8039%)', true);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.08314, 0.15475, 0.02096, 1], 'result');
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
    assert.deepEqual(res, [0, 0.31855, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)', {
      alpha: true
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0, 0.31855, 0, 0.5], 'result');
  });
});

describe('convert colorValue to rgb', () => {
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

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0 / 0.5)', {
      alpha: true
    });
    assert.deepEqual(res, [0, 128, 0, 0.5], 'result');
  });
});

describe('resolve color value', () => {
  const func = color.resolveColorValue;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get empty array', () => {
    const res = func('foo');
    assert.deepEqual(res, [], 'result');
  });

  it('should get value', () => {
    const res = func('currentColor');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('transparent');
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('black');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('red');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('WHITE');
    assert.deepEqual(res, [255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#123456');
    assert.deepEqual(res, [18, 52, 86, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#abcdef');
    assert.deepEqual(res, [171, 205, 239, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#12345678');
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [18, 52, 86, 0.47], 'result');
  });

  it('should get value', () => {
    const res = func('#abcdef12');
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [171, 205, 239, 0.07], 'result');
  });

  it('should get value', () => {
    const res = func('#1234');
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [17, 34, 51, 0.27], 'result');
  });

  it('should get value', () => {
    const res = func('#abcd');
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [170, 187, 204, 0.87], 'result');
  });

  it('should get value', () => {
    const res = func('#123');
    assert.deepEqual(res, [17, 34, 51, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#abc');
    assert.deepEqual(res, [170, 187, 204, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(10 20 30 / 0.5)');
    assert.deepEqual(res, [10, 20, 30, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 0 0 / 1%)');
    assert.deepEqual(res, [0, 0, 0, 0.01], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(1,2,3,0.5)');
    assert.deepEqual(res, [1, 2, 3, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(1,2,3,1)');
    assert.deepEqual(res, [1, 2, 3, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(46.27% 32.94% 80.39%)');
    assert.deepEqual(res, [118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(50% 33% 34%)');
    assert.deepEqual(res, [128, 84, 87, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(5% 10% 20%)');
    assert.deepEqual(res, [13, 26, 51, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(240 100% 50% / 0.5)');
    assert.deepEqual(res, [0, 0, 255, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(-120deg 100% 50% / 0.5)');
    assert.deepEqual(res, [0, 0, 255, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 0% / 1%)');
    assert.deepEqual(res, [0, 0, 0, 0.01], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(240 100% 50%)');
    assert.deepEqual(res, [0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsla(180,50%,50%,0.5)');
    assert.deepEqual(res, [64, 191, 191, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(240 100% 50%)');
    assert.deepEqual(res, [170, 170, 170, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(110 20% 30% / 40%)');
    assert.deepEqual(res, [72, 179, 51, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 1)');
    assert.deepEqual(res, [118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 0.5)');
    assert.deepEqual(res, [118, 84, 205, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)');
    assert.deepEqual(res, [118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 1)');
    assert.deepEqual(res, [118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 0.5)');
    assert.deepEqual(res, [118, 84, 205, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 1)');
    assert.deepEqual(res, [118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 0.5)');
    assert.deepEqual(res, [118, 84, 205, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(128,128,142,0.4)');
    assert.deepEqual(res, [128, 128, 142, 0.4], 'result');
  });
});

describe('resolve color()', () => {
  const func = color.resolveColorFunc;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('color(in foo, 1 1 1)'), Error,
      'Invalid property value: color(in foo, 1 1 1)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb foo bar baz)'), Error,
      'Invalid property value: color(srgb foo bar baz)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 bar baz)'), Error,
      'Invalid property value: color(srgb 1 bar baz)');
  });

  it('should throw', () => {
    assert.throws(() => func('color(srgb 1 1 baz)'), Error,
      'Invalid property value: color(srgb 1 1 baz)');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0)');
    assert.deepEqual(res, [0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0% 60% 0%)');
    assert.deepEqual(res, [0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)', {
      alpha: true
    });
    assert.deepEqual(res, [0, 153, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 50%)', {
      alpha: true
    });
    assert.deepEqual(res, [0, 153, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / -50%)', {
      alpha: true
    });
    assert.deepEqual(res, [0, 153, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 150%)', {
      alpha: true
    });
    assert.deepEqual(res, [0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.3 0.5 0.7 / none)', {
      alpha: true
    });
    assert.deepEqual(res, [77, 127, 179, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb none 0.5 0.7)');
    assert.deepEqual(res, [0, 128, 179, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.3 none 0.7)');
    assert.deepEqual(res, [77, 0, 179, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.3 0.5 none)');
    assert.deepEqual(res, [77, 127, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb none 50% 70%)');
    assert.deepEqual(res, [0, 128, 179, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 30% none 70%)');
    assert.deepEqual(res, [77, 0, 179, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 30% 50% none)');
    assert.deepEqual(res, [77, 127, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0 0)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
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
    assert.deepEqual(res, [0, 188, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0.3 none 0.7)');
    assert.deepEqual(res, [149, 0, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0.3 0.5 none)');
    assert.deepEqual(res, [149, 188, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear none 50% 70%)');
    assert.deepEqual(res, [0, 188, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 30% none 70%)');
    assert.deepEqual(res, [149, 0, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 30% 50% none)');
    assert.deepEqual(res, [149, 188, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.26374 0.59085 0.16434 / 1)');
    assert.deepEqual(res, [0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 26.374% 59.085% 16.434%)');
    assert.deepEqual(res, [0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.21604 0.49418 0.13151)');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0 0 0)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 1 1 1)');
    assert.deepEqual(res, [255, 255, 255, 1], 'result');
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
    assert.deepEqual(res, [0, 130, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.3 none 0.7)');
    assert.deepEqual(res, [84, 0, 186, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.3 0.5 none)');
    assert.deepEqual(res, [57, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 none 50% 70%)');
    assert.deepEqual(res, [0, 130, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 30% none 70%)');
    assert.deepEqual(res, [84, 0, 186, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 30% 50% none)');
    assert.deepEqual(res, [57, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.299218 0.533327 0.120785 / 1)');
    assert.deepEqual(res, [0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 29.9218% 53.3327% 12.0785%)');
    assert.deepEqual(res, [0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.235202 0.431704 0.085432)');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0 0 0)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 1 1 1)');
    assert.deepEqual(res, [255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0 1 0)');
    const val = color.resolveColorValue('lab(85.7729% -160.7259 109.2319)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 none 0.5 0.7)');
    assert.deepEqual(res, [0, 147, 192, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.3 none 0.7)');
    assert.deepEqual(res, [104, 0, 196, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.3 0.5 none)');
    assert.deepEqual(res, [41, 145, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 none 50% 70%)');
    assert.deepEqual(res, [0, 147, 192, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 30% none 70%)');
    assert.deepEqual(res, [104, 0, 196, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 30% 50% none)');
    assert.deepEqual(res, [41, 145, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.33582 0.59441 0.13934 / 1)');
    assert.deepEqual(res, [0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 33.582% 59.441% 13.934%)');
    assert.deepEqual(res, [0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.281363 0.498012 0.116746)');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0 0 0)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 1 1 1)');
    assert.deepEqual(res, [255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0 1 0)');
    const val = color.resolveColorValue('lab(83.2141% -129.1072 87.1718)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb none 0.5 0.7)');
    assert.deepEqual(res, [0, 129, 182, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.3 none 0.7)');
    assert.deepEqual(res, [89, +0, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.3 0.5 none)');
    assert.deepEqual(res, [29, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb none 50% 70%)');
    assert.deepEqual(res, [0, 129, 182, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 30% none 70%)');
    assert.deepEqual(res, [89, +0, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 30% 50% none)');
    assert.deepEqual(res, [29, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.2861 0.49131 0.16133 / 1)');
    assert.deepEqual(res, [0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 28.610% 49.131% 16.133%)');
    assert.deepEqual(res, [0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.230479 0.395789 0.129968)');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 0 0)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 1 1 1)');
    assert.deepEqual(res, [255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 1 0)');
    const val = color.resolveColorValue('lab(87.5745% -186.6921 150.9905)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb none 0.5 0.7)');
    assert.deepEqual(res, [0, 160, 198, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.3 none 0.7)');
    assert.deepEqual(res, [76, 0, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.3 0.5 none)');
    assert.deepEqual(res, [43, 155, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb none 50% 70%)');
    assert.deepEqual(res, [0, 160, 198, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 30% none 70%)');
    assert.deepEqual(res, [76, 0, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 30% 50% none)');
    assert.deepEqual(res, [43, 155, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.07719 0.15438 0.02573)');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 7.719% 15.438% 2.573%)');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0 0 0)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
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
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 8.312% 15.4746% 2.0961%)');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0 0 0)');
    assert.deepEqual(res, [0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 1 1 1)');
    const val = color.resolveColorValue('lab(100% 6.1097 -13.2268)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz none 0.5 0.7)');
    assert.deepEqual(res, [0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.3 none 0.7)');
    assert.deepEqual(res, [207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.3 0.5 none)');
    assert.deepEqual(res, [125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz none 50% 70%)');
    assert.deepEqual(res, [0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 30% none 70%)');
    assert.deepEqual(res, [207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 30% 50% none)');
    assert.deepEqual(res, [125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 none 0.5 0.7)');
    assert.deepEqual(res, [0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.3 none 0.7)');
    assert.deepEqual(res, [207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.3 0.5 none)');
    assert.deepEqual(res, [125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 none 50% 70%)');
    assert.deepEqual(res, [0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 30% none 70%)');
    assert.deepEqual(res, [207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 30% 50% none)');
    assert.deepEqual(res, [125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 none 0.5 0.7)');
    assert.deepEqual(res, [0, 253, 240, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.3 none 0.7)');
    assert.deepEqual(res, [203, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.3 0.5 none)');
    assert.deepEqual(res, [102, 213, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 none 50% 70%)');
    assert.deepEqual(res, [0, 253, 240, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 30% none 70%)');
    assert.deepEqual(res, [203, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 30% 50% none)');
    assert.deepEqual(res, [102, 213, 0, 1], 'result');
  });
});

describe('resolve color-mix()', () => {
  const func = color.resolveColorMix;

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, blue)'), Error,
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
      Error, 'Invalid property value: color-mix(in srgb, blue 0%, red 0%)');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, currentcolor, red)', {
      alpha: true
    });
    assert.deepEqual(res, [255, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, currentcolor)', {
      alpha: true
    });
    assert.deepEqual(res, [0, 0, 255, 1], 'result');
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
    const value = color.resolveColorValue('rgba(255, 0, 0, 0.6)', {
      alpha: true
    });
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
    const value = color.resolveColorValue('rgb(0, 0, 255)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in srgb, rgba(0, 0, 255, 0.5) 100%, red)');
    const value = color.resolveColorValue('rgb(0, 0, 255, 0.5)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in srgb, red, rgba(0, 0, 255, 0.5) 100%)');
    const value = color.resolveColorValue('rgb(0, 0, 255, 0.5)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgb(100% 0% 0% / 0.7) 25%, rgb(0% 100% 0% / 0.2))');
    const value = color.resolveColorValue('rgb(53.846% 46.154% 0% / 0.325)', {
      alpha: true
    });
    res[0] = Math.round(res[0]);
    res[1] = Math.round(res[1]);
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgb(100% 0% 0% / 0.7) 20%, rgb(0% 100% 0% / 0.2) 60%)');
    const value = color.resolveColorValue('rgb(53.846% 46.154% 0% / 0.26)', {
      alpha: true
    });
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
    const res = func('color-mix(in srgb-linear, rgba(255, 0, 0, 0.2), red)', {
      alpha: true
    });
    res[2] = parseFloat(res[2].toFixed(1));
    assert.deepEqual(res, [91.8, 0, 0, 0.6], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue 80%, red 80%)');
    assert.deepEqual(res, [127.5, 0, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue 10%, red)');
    assert.deepEqual(res, [229.5, 0, 25.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue 100%, red)');
    assert.deepEqual(res, [0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, rgba(0, 0, 255, 0.5) 100%, red)', {
      alpha: true
    });
    assert.deepEqual(res, [0, 0, 63.75, 0.5], 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in srgb-linear, red, rgba(0, 0, 255, 0.5) 100%)', {
        alpha: true
      });
    assert.deepEqual(res, [0, 0, 63.75, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, rgb(100% 0% 0% / 0.7) 25%, rgb(0% 100% 0% / 0.2))', {
      alpha: true
    });
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(1));
    assert.deepEqual(res, [14.5, 12.4, 0, 0.325], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, rgb(100% 0% 0% / 0.7) 20%, rgb(0% 100% 0% / 0.2) 60%)', {
      alpha: true
    });
    res[0] = parseFloat(res[0].toFixed(1));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(1));
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [14.5, 12.4, 0, 0.26], 'result');
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
      alpha: true
    });
    const value = color.resolveColorValue('rgb(99, 45, 0, 0.5)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
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
      alpha: true
    });
    const value = color.resolveColorValue('rgb(99, 45, 0, 0.5)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
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
      func('color-mix(in hsl, hsl(120 10% 20%) 12.5%, hsl(30 30% 40%) 37.5%)', {
        alpha: true
      });
    const value = color.resolveColorValue('hsl(52.5 25% 35% / 0.5)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20%) 0%, hsl(30 30% 40%))');
    const value = color.resolveColorValue('hsl(30 30% 40%)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hsl, hsl(120 10% 20% / .4), hsl(30 30% 40% / .8))', {
        alpha: true
      });
    const value = color.resolveColorValue('rgba(95, 105, 65, 0.6)', {
      alpha: true
    });
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
      func('color-mix(in hsl, hsl(120 10% 20%) 25%, hsl(30 30% 40% / .8))', {
        alpha: true
      });
    const value = color.resolveColorValue('rgba(108, 103, 66, 0.85)', {
      alpha: true
    });
    res[3] = parseFloat(res[3].toFixed(3));
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20% / .4), hsl(30 30% 40% / .8) 25%)', {
      alpha: true
    });
    const value = color.resolveColorValue('rgba(68, 84, 59, 0.5)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20% / .4) 25%, hsl(30 30% 40% / .8) 75%)', {
      alpha: true
    });
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [121, 114, 69, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20% / .4) 30%, hsl(30 30% 40% / .8) 90%)', {
      alpha: true
    });
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [121, 114, 69, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20% / .4) 12.5%, hsl(30 30% 40% / .8) 37.5%)', {
      alpha: true
    });
    res[3] = parseFloat(res[3].toFixed(3));
    assert.deepEqual(res, [121, 114, 69, 0.35], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20% / .4) 0%, hsl(30 30% 40% / .8))', {
      alpha: true
    });
    const value = color.resolveColorValue('rgba(133, 102, 71, 0.8)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, blue, green)');
    assert.deepEqual(res, [0, 192, 192, 1], 'result');
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
    const res = func('color-mix(in hwb, hwb(120 10% 20%) 12.5%, hwb(30 30% 40%) 37.5%)', {
      alpha: true
    });
    assert.deepEqual(res, [166, 153, 64, 0.5], 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in hwb, hwb(120 10% 20%) 0%, hwb(30 30% 40%))');
    assert.deepEqual(res, [153, 115, 77, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20% / .4), hwb(30 30% 40% / .8))', {
      alpha: true
    });
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [142, 170, 60, 0.6], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20%) 25%, hwb(30 30% 40% / .8))', {
      alpha: true
    });
    res[3] = parseFloat(res[3].toFixed(3));
    assert.deepEqual(res, [168, 155, 62, 0.85], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20% / .4), hwb(30 30% 40% / .8) 25%)', {
      alpha: true
    });
    assert.deepEqual(res, [97, 184, 46, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20% / .4) 25%, hwb(30 30% 40% / .8) 75%)', {
      alpha: true
    });
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [160, 149, 70, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20% / .4) 30%, hwb(30 30% 40% / .8) 90%)', {
      alpha: true
    });
    res[3] = parseFloat(res[3].toFixed(2));
    assert.deepEqual(res, [160, 149, 70, 0.7], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20% / .4) 12.5%, hwb(30 30% 40% / .8) 37.5%)', {
      alpha: true
    });
    res[3] = parseFloat(res[3].toFixed(3));
    assert.deepEqual(res, [160, 149, 70, 0.35], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20% / .4) 0%, hwb(30 30% 40% / .8))', {
      alpha: true
    });
    assert.deepEqual(res, [153, 115, 77, 0.8], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in lab, red, green)');
    const value = color.resolveColorValue('lab(50.284 16.626 59.2386)');
    assert.deepEqual(res, value, 'result');
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
        color.resolveColorValue('oklch(0.58 0.2187445576 84.3177 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res =
        func('color-mix(in oklch, color(srgb 1 0 0), color(srgb 0 0.5 0))');
    const value =
        color.resolveColorValue('oklch(0.5791 0.21874 84.3177 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklch, red, green 90%)');
    const value =
        color.resolveColorValue('oklch(0.533387 0.18065 127.843 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklch, red 90%, green)');
    const value = color.resolveColorValue('oklch(0.6264 0.2568 40.792 / 1)');
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
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`, {
      alpha: true
    });
    assert.deepEqual(res, [134.5, 127.5, 121.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`, {
      alpha: true
    });
    assert.deepEqual(res, [134.5, 127.5, 121.5, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in srgb, ${colorA}, ${colorB})`, {
      alpha: true
    });
    assert.deepEqual(res, [134.5, 127.5, 121.5, 0], 'result');
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
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`, {
      alpha: true
    });
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [76.545, 54.81, 63.655, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`, {
      alpha: true
    });
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [76.545, 54.81, 63.655, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in srgb-linear, ${colorA}, ${colorB})`, {
      alpha: true
    });
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [76.545, 54.81, 63.655, 0], 'result');
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
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`, {
      alpha: true
    });
    assert.deepEqual(res, [149, 128, 137, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`, {
      alpha: true
    });
    assert.deepEqual(res, [149, 128, 137, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in xyz, ${colorA}, ${colorB})`, {
      alpha: true
    });
    assert.deepEqual(res, [149, 128, 137, 0], 'result');
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
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`, {
      alpha: true
    });
    assert.deepEqual(res, [149, 128, 137, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / 1)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`, {
      alpha: true
    });
    assert.deepEqual(res, [149, 128, 137, 1], 'result');
  });

  it('should get value', () => {
    const colorA = 'rgb(192 128 64 / none)';
    const colorB = 'color(srgb 0.3 0.5 0.7 / none)';
    const res = func(`color-mix(in xyz-d50, ${colorA}, ${colorB})`, {
      alpha: true
    });
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
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('hsl(51.38 86.6% 40.98%)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'currentColor';
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('hsl(120 9.8% 20% / 1)', {
      alpha: true
    });
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
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('hsl(85.69 48.2% 30.5%)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('hsl(85.69 48.2% 30.5%)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)'; // hsl(51.38 86.6% 40.98% / 0)
    const res = func(`color-mix(in hsl, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('hsl(85.69 48.2% 30.5% / 0)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
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
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('hwb(85.665 11.8% 50.7% / 1)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)'; // hsl(51.38 86.6% 40.98% / 0)
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('hwb(85.665 11.8% 50.7% / 1)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)'; // hsl(51.38 86.6% 40.98%)
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('hwb(85.665 11.8% 50.7% / 0)', {
      alpha: true
    });
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
    const res = func(`color-mix(in hwb, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('hwb(75 20% 20% / 1)', {
      alpha: true
    });
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
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('lab(46.166 -3.0737 37.406 / 1)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('lab(46.166 -3.0737 37.406 / 1)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in lab, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('lab(46.166 -3.0737 37.406 / 0)', {
      alpha: true
    });
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
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('lch(46.12 38.88 116 / 1)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('lch(46.12 38.88 116 / 1)', {
      alpha: true
    });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in lch, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value = color.resolveColorValue('lch(46.12 38.88 116 / 0)', {
      alpha: true
    });
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
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value =
        color.resolveColorValue('oklab(0.532 -0.0191 0.080463 / 1)', {
          alpha: true
        });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value =
        color.resolveColorValue('oklab(0.532 -0.0191 0.080463 / 1)', {
          alpha: true
        });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in oklab, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value =
        color.resolveColorValue('oklab(0.532 -0.0191 0.080463 / 0)', {
          alpha: true
        });
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
    const value =
        color.resolveColorValue('oklch(0.5353 0.093 105.5239 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'currentColor';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklch(0.74212 0.15659 92.136789 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'currentColor';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklch(0.3285 0.02946 118.911 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklch(0.742124 0.15659 92.13679 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklch(0.3285 0.02946 118.911 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% none / 1)';
    const colorB = 'lch(none 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklch(0 0 0 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 none 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklch(0.53176 0.15659 84.720389 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% none 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklch(0.5353 0.02946 98.10749 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 none 20% / 1)';
    const colorB = 'lch(70% none 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value = color.resolveColorValue('oklch(0.531748 0 0 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklch(0.5275 0.09076 92.13679 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklch(0.54915 0.1256 118.911 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(none 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 none / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`);
    const value =
        color.resolveColorValue('oklch(0.54135 0.12337 0 / 1)');
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / 1)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value =
        color.resolveColorValue('oklch(0.5353 0.093029 105.5239 / 1)', {
          alpha: true
        });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / 1)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value =
        color.resolveColorValue('oklch(0.5353 0.093029 105.5239 / 1)', {
          alpha: true
        });
    assert.deepEqual(res, value, 'result');
  });

  it('should get value', () => {
    const colorA = 'hsl(120 9.8% 20% / none)';
    const colorB = 'lch(70% 70 90 / none)';
    const res = func(`color-mix(in oklch, ${colorA}, ${colorB})`, {
      alpha: true
    });
    const value =
        color.resolveColorValue('oklch(0.5353 0.093029 105.5239 / 0)', {
          alpha: true
        });
    assert.deepEqual(res, value, 'result');
  });
});
