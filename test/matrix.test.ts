/**
 * matrix.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/js/cache';
import * as matrix from '../src/js/matrix';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('validate color components', () => {
  const func = matrix.validateColorComponents;

  it('should throw TypeError when minLength is not a finite number', () => {
    const components = [0.5, 0.8, 0.2];
    assert.throws(
      () => func(components, { minLength: NaN }),
      TypeError,
      'NaN is not a number.'
    );
    assert.throws(
      () => func(components, { minLength: Infinity }),
      TypeError,
      'Infinity is not a number.'
    );
    assert.throws(
      () => func(components, { minLength: 'invalid' as any }),
      TypeError,
      'invalid is not a number.'
    );
  });

  it('should throw TypeError when maxLength is not a finite number', () => {
    const components = [0.5, 0.8, 0.2];
    assert.throws(
      () => func(components, { maxLength: NaN }),
      TypeError,
      'NaN is not a number.'
    );
    assert.throws(
      () => func(components, { maxLength: Infinity }),
      TypeError,
      'Infinity is not a number.'
    );
    assert.throws(
      () => func(components, { maxLength: 'invalid' as any }),
      TypeError,
      'invalid is not a number.'
    );
  });

  it('should throw TypeError when minRange is not a finite number', () => {
    const components = [0.5, 0.8, 0.2];
    assert.throws(
      () => func(components, { minRange: NaN }),
      TypeError,
      'NaN is not a number.'
    );
    assert.throws(
      () => func(components, { minRange: Infinity }),
      TypeError,
      'Infinity is not a number.'
    );
    assert.throws(
      () => func(components, { minRange: 'invalid' as any }),
      TypeError,
      'invalid is not a number.'
    );
  });

  it('should throw TypeError when maxRange is not a finite number', () => {
    const components = [0.5, 0.8, 0.2];
    assert.throws(
      () => func(components, { maxRange: NaN }),
      TypeError,
      'NaN is not a number.'
    );
    assert.throws(
      () => func(components, { maxRange: Infinity }),
      TypeError,
      'Infinity is not a number.'
    );
    assert.throws(
      () => func(components, { maxRange: 'invalid' as any }),
      TypeError,
      'invalid is not a number.'
    );
  });

  it('should return validated array when given valid components', () => {
    const input = [0.5, 0.8, 0.2];
    const res = func(input);
    assert.deepStrictEqual(res, [0.5, 0.8, 0.2]);
  });

  it('should process options when maxLength and validateRange are specified', () => {
    const input: [number, number, number] = [100, -200, 300];
    const res = func(input, { maxLength: 3, validateRange: false });
    assert.deepStrictEqual(res, [100, -200, 300]);
  });

  it('should throw TypeError when input is not an array', () => {
    assert.throws(() => func('invalid' as any), TypeError);
  });

  it('should throw Error when array length exceeds maxLength', () => {
    assert.throws(() => func([1, 2, 3, 4], { maxLength: 3 }), Error);
  });

  it('should throw Error when components contain NaN or non-numeric values', () => {
    assert.throws(() => func([1, NaN, 3]), Error);
  });

  it('should throw Error when values are out of range and validateRange is true', () => {
    assert.throws(() => func([256, 0, 0], { validateRange: true }), Error);
  });

  it('should throw RangeError when alpha at index 3 is out of range', () => {
    assert.throws(
      () => func([0.5, 0.8, 0.2, -0.1], { maxLength: 4 }),
      RangeError,
      '-0.1 is not between 0 and 1.'
    );
    assert.throws(
      () => func([0.5, 0.8, 0.2, 1.5], { maxLength: 4 }),
      RangeError,
      '1.5 is not between 0 and 1.'
    );
  });

  it('should append alpha value 1 when alpha is true and array length is 3', () => {
    const components = [0.5, 0.8, 0.2];
    const res = func(components, { alpha: true });
    assert.deepStrictEqual(res, [0.5, 0.8, 0.2, 1]);
  });

  it('should not append alpha value when alpha option is false', () => {
    const components = [0.5, 0.8, 0.2];
    const res = func(components, { alpha: false });
    assert.deepStrictEqual(res, [0.5, 0.8, 0.2]);
  });
});

describe('transform matrix', () => {
  const func = matrix.transformMatrix;

  it('should transform vector correctly with identity matrix', () => {
    const identityMatrix: matrix.ColorMatrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
    const vct: [number, number, number] = [10, 20, 30];
    const res = func(identityMatrix, vct);
    assert.deepStrictEqual(res, [10, 20, 30]);
  });

  it('should calculate matrix-vector product correctly', () => {
    const mtx: matrix.ColorMatrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const vct: [number, number, number] = [1, 2, 3];
    // p1 = 1*1 + 2*2 + 3*3 = 14
    // p2 = 4*1 + 5*2 + 6*3 = 32
    // p3 = 7*1 + 8*2 + 9*3 = 50
    const res = func(mtx, vct);
    assert.deepStrictEqual(res, [14, 32, 50]);
  });

  it('should skip validation and calculate when skip parameter is true', () => {
    const mtx: matrix.ColorMatrix = [
      [2, 0, 0],
      [0, 2, 0],
      [0, 0, 2]
    ];
    const vct: [number, number, number] = [5, 10, 15];
    const res = func(mtx, vct, true);
    assert.deepStrictEqual(res, [10, 20, 30]);
  });

  it('should throw TypeError when matrix is not an array', () => {
    assert.throws(
      () => func('invalid matrix' as any, [1, 2, 3]),
      TypeError,
      'invalid matrix is not an array.'
    );
  });

  it('should throw Error when matrix length is not 3', () => {
    const invalidMtx = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    assert.throws(
      () => func(invalidMtx as any, [1, 2, 3]),
      Error,
      'Unexpected array length 2.'
    );
  });
});
