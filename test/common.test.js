/**
 * common.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

/* test */
import * as common from '../src/js/common.js';

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
      assert.equal(func(item), false);
    }
  });

  it('should get true', () => {
    const items = ['', 'foo'];
    for (const item of items) {
      assert.equal(func(item), true);
    }
  });
});
