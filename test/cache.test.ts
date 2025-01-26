/**
 * cache.test
 */

/* api */
import { assert, describe, it } from 'vitest';

/* test */
import * as cache from '../src/js/cache';

describe('CacheItem', () => {
  const { CacheItem } = cache;

  it('should create instance', () => {
    const item = new CacheItem();
    assert.strictEqual(item instanceof CacheItem, true, 'instance');
    assert.strictEqual(item.isNull, false, 'isNull');
    assert.strictEqual(item.item, undefined, 'item');
  });

  it('should create instance', () => {
    const item = new CacheItem('foo');
    assert.strictEqual(item instanceof CacheItem, true, 'instance');
    assert.strictEqual(item.isNull, false, 'isNull');
    assert.strictEqual(item.item, 'foo', 'item');
  });

  it('should create instance', () => {
    const item = new CacheItem(['foo', 1, 'bar']);
    assert.strictEqual(item instanceof CacheItem, true, 'instance');
    assert.strictEqual(item.isNull, false, 'isNull');
    assert.deepEqual(item.item, ['foo', 1, 'bar'], 'item');
  });
});

describe('NullObject', () => {
  const { CacheItem, NullObject } = cache;

  it('should create instance', () => {
    const item = new NullObject();
    assert.strictEqual(item instanceof NullObject, true, 'instance');
    assert.strictEqual(item instanceof CacheItem, true, 'instance');
    assert.strictEqual(item.isNull, true, 'isNull');
  });
});
