/**
 * common.test
 */

/* api */
import { assert, describe, it } from 'vitest';

/* test */
import * as common from '../src/js/common';

describe('get type', () => {
  const func = common.getType;

  it('should get Array', () => {
    const res = func([]);
    assert.deepEqual(res, 'Array');
  });

  it('should get Object', () => {
    const res = func({});
    assert.deepEqual(res, 'Object');
  });

  it('should get String', () => {
    const res = func('');
    assert.deepEqual(res, 'String');
  });

  it('should get Number', () => {
    const res = func(1);
    assert.deepEqual(res, 'Number');
  });

  it('should get Boolean', () => {
    const res = func(true);
    assert.deepEqual(res, 'Boolean');
  });

  it('should get Undefined', () => {
    const res = func();
    assert.deepEqual(res, 'Undefined');
  });

  it('should get Null', () => {
    const res = func(null);
    assert.deepEqual(res, 'Null');
  });
});

describe('is string', () => {
  const func = common.isString;

  it('should get false', () => {
    const items = [[], ['foo'], {}, { foo: 'bar' }, undefined, null, 1, true];
    for (const item of items) {
      assert.strictEqual(func(item), false);
    }
  });

  it('should get true', () => {
    const items = ['', 'foo'];
    for (const item of items) {
      assert.strictEqual(func(item), true);
    }
  });
});

describe('is string or number', () => {
  const func = common.isStringOrNumber;

  it('should get false', () => {
    const items = [[], ['foo'], {}, { foo: 'bar' }, undefined, null, true];
    for (const item of items) {
      assert.strictEqual(func(item), false);
    }
  });

  it('should get true', () => {
    const items = ['', 'foo', 0, 1, NaN, Infinity, -Infinity];
    for (const item of items) {
      assert.strictEqual(func(item), true);
    }
  });
});
