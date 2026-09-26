/**
 * cache.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';
import { LRUCache } from 'lru-cache';

/* test */
import * as cache from '../src/utils/cache';

const { CacheItem, lruCache } = cache;

describe('CacheItem', () => {
  it('should create instance', () => {
    const item = new CacheItem();
    assert.strictEqual(item instanceof CacheItem, true, 'instance');
    assert.strictEqual((item as any).isNull, undefined, 'isNull');
    assert.strictEqual(item.item, undefined, 'item');
  });

  it('should create instance', () => {
    const item = new CacheItem('foo');
    assert.strictEqual(item instanceof CacheItem, true, 'instance');
    assert.strictEqual((item as any).isNull, undefined, 'isNull');
    assert.strictEqual(item.item, 'foo', 'item');
  });

  it('should create instance', () => {
    const item = new CacheItem(['foo', 1, 'bar']);
    assert.strictEqual(item instanceof CacheItem, true, 'instance');
    assert.strictEqual((item as any).isNull, undefined, 'isNull');
    assert.deepEqual(item.item, ['foo', 1, 'bar'], 'item');
  });
});

describe('lru cache instance', () => {
  it('should be an instance of LRUCache', () => {
    assert.strictEqual(
      lruCache instanceof LRUCache,
      true,
      'should be LRUCache'
    );
  });

  it('should have the configured max size', () => {
    assert.strictEqual(lruCache.max, 4096, 'max cache size should be 4096');
  });

  it('should clear all values via clear()', () => {
    lruCache.set('foo', new cache.CacheItem('bar'));
    assert.strictEqual(lruCache.has('foo'), true, 'cache is added');
    lruCache.clear();
    assert.strictEqual(lruCache.has('foo'), false, 'cache is cleared');
  });
});

describe('set cache', () => {
  const func = cache.setCache;

  beforeEach(() => {
    lruCache.clear();
  });

  afterEach(() => {
    lruCache.clear();
  });

  it('should not set cache if key is empty', () => {
    func('', 'foo');
    assert.strictEqual(lruCache.has(''), false, 'cache should not be set');
  });

  it('should store CacheItem instance directly if passed as value', () => {
    const item = new CacheItem('foo');
    func('key1', item);
    assert.strictEqual(lruCache.has('key1'), true, 'cache should exist');
    assert.strictEqual(
      lruCache.get('key1'),
      item,
      'cached item should match original instance'
    );
  });

  it('should wrap value in CacheItem if non-CacheItem value is passed', () => {
    func('key2', 'bar');
    assert.strictEqual(lruCache.has('key2'), true, 'cache should exist');
    const cached = lruCache.get('key2');
    assert.strictEqual(
      cached instanceof CacheItem,
      true,
      'cached item should be CacheItem instance'
    );
    assert.strictEqual(
      cached?.item,
      'bar',
      'cached item value should match input'
    );
  });
});

describe('get cache', () => {
  const { setCache } = cache;
  const func = cache.getCache;

  beforeEach(() => {
    lruCache.clear();
  });

  afterEach(() => {
    lruCache.clear();
  });

  it('should return false if key is empty', () => {
    const res = func('');
    assert.strictEqual(res, false, 'should return false');
  });

  it('should return false if item is not cached', () => {
    const res = func('non_existent_key');
    assert.strictEqual(res, false, 'should return false');
  });

  it('should return cached CacheItem if key exists', () => {
    setCache('key1', 'foo');

    const res = func('key1');
    assert.strictEqual(
      res instanceof CacheItem,
      true,
      'should be instance of CacheItem'
    );
    assert.strictEqual(
      (res as CacheItem).item,
      'foo',
      'item value should match'
    );
  });
});

describe('create cache key', () => {
  const func = cache.createCacheKey;

  it('should return empty string if keyData is falsy', () => {
    assert.strictEqual(
      func(null as any),
      '',
      'should return empty string for null'
    );
  });

  it('should return empty string if customProperty callback is fn', () => {
    const res = func(
      { namespace: 'ns', name: 'name', value: 'val' },
      { customProperty: { callback: () => {} } as any }
    );
    assert.strictEqual(res, '', 'should return empty string');
  });

  it('should return empty string if dimension callback is fn', () => {
    const res = func(
      { namespace: 'ns', name: 'name', value: 'val' },
      { dimension: { callback: () => {} } as any }
    );
    assert.strictEqual(res, '', 'should return empty string');
  });

  it('should return empty string if all keyData fields are empty', () => {
    const res = func({ namespace: '', name: '', value: '' });
    assert.strictEqual(res, '', 'should return empty string');
  });

  it('should create default cache key with default option fallbacks', () => {
    const res = func({ namespace: 'ns', name: 'foo', value: 'bar' });
    const expected = 'ns:foo:bar:::';
    assert.strictEqual(res, expected, 'should format key with default values');
  });

  it('should correctly reflect boolean and string options', () => {
    const res = func(
      { namespace: 'ns', name: 'foo', value: 'bar' },
      {
        format: 'hex',
        colorSpace: 'srgb',
        colorScheme: 'dark',
        currentColor: '#fff',
        d50: true,
        nullable: true,
        preserveComment: true,
        delimiter: '-'
      }
    );
    const expected =
      'ns:foo:bar:colorScheme_dark|colorSpace_srgb|currentColor_#fff|d50_true|delimiter_-|format_hex|nullable_true|preserveComment_true::';
    assert.strictEqual(res, expected, 'should format key with custom options');
  });

  it('should serialize customProperty/dimension with sorted keys', () => {
    const res = func(
      { namespace: 'ns', name: 'foo', value: 'bar' },
      {
        customProperty: { z: 1, a: 'test' },
        dimension: { height: 100, width: 200 }
      }
    );
    const expected = 'ns:foo:bar::a:"test";z:1;:height:100;width:200;';
    assert.strictEqual(
      res,
      expected,
      'should sort and serialize custom objects'
    );
  });

  it('should return empty string for customProperty/dimension on empty', () => {
    const res = func(
      { namespace: 'ns', name: 'foo', value: 'bar' },
      {
        customProperty: {},
        dimension: {}
      }
    );
    const expected = 'ns:foo:bar:::';
    assert.strictEqual(
      res,
      expected,
      'should handle empty objects for options'
    );
  });
});
