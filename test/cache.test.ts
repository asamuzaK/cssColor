/**
 * cache.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';
import { LRUCache } from 'lru-cache';

/* test */
import * as cache from '../src/js/cache';

describe('lru cache instance', () => {
  const { lruCache } = cache;

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

describe('CacheItem', () => {
  const { CacheItem } = cache;

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

describe('set cache', () => {
  const { CacheItem, lruCache } = cache;
  const func = cache.setCache;

  beforeEach(() => {
    lruCache.clear();
  });
  afterEach(() => {
    lruCache.clear();
  });

  it('should not set cache', () => {
    func('');
    assert.strictEqual(lruCache.has(''), false, 'has');
  });

  it('should set cache', () => {
    func('foo');
    assert.strictEqual(lruCache.has('foo'), true, 'has');
    assert.strictEqual(lruCache.get('foo') instanceof CacheItem, true, 'cache');
  });

  it('should set cache', () => {
    func('bar', 'bar');
    assert.strictEqual(lruCache.has('bar'), true, 'has');
    assert.strictEqual(lruCache.get('bar') instanceof CacheItem, true, 'cache');
  });

  it('should set cache', () => {
    func('baz', null);
    assert.strictEqual(lruCache.has('baz'), true, 'has');
    assert.strictEqual(lruCache.get('baz') instanceof CacheItem, true, 'cache');
  });

  it('should set cache', () => {
    func('qux', new CacheItem('qux'));
    assert.strictEqual(lruCache.has('qux'), true, 'has');
    assert.strictEqual(lruCache.get('qux') instanceof CacheItem, true, 'cache');
  });
});

describe('get cache', () => {
  const { CacheItem, lruCache, setCache } = cache; // 変更: genCache から lruCache に変更
  const func = cache.getCache;

  beforeEach(() => {
    lruCache.clear();
  });
  afterEach(() => {
    lruCache.clear();
  });

  it('should get cache', () => {
    setCache('foo');
    const res = func('foo');
    assert.strictEqual(res instanceof CacheItem, true, 'instance');
    assert.strictEqual((res as CacheItem).item, undefined, 'result');
  });

  it('should get cache', () => {
    setCache('bar', 'bar');
    const res = func('bar');
    assert.strictEqual(res instanceof CacheItem, true, 'instance');
    assert.strictEqual((res as CacheItem).item, 'bar', 'result');
  });

  it('should get null', () => {
    setCache('baz', null);
    const res = func('baz');
    assert.strictEqual(res instanceof CacheItem, true, 'instance');
    assert.strictEqual((res as CacheItem).item, null, 'result');
  });

  it('should get false', () => {
    const res = func('qux');
    assert.strictEqual(res, false, 'result');
  });
});

describe('create cache key', () => {
  const func = cache.createCacheKey;

  it('should get empty string', () => {
    const res = func();
    assert.strictEqual(res, '', 'result');
  });

  it('should get empty string', () => {
    const res = func({});
    assert.strictEqual(res, '', 'result');
  });

  it('should get empty string when missing required key data', () => {
    const res = func({
      foo: 'foo',
      bar: 'bar'
    });
    assert.strictEqual(res, '', 'result');
  });

  it('should get base key string with default options', () => {
    const res = func({
      value: 'val'
    });
    assert.strictEqual(res, '::val::||||0|0|0|::::', 'result');
  });

  it('should get empty string blocks for empty options', () => {
    const res = func(
      {
        namespace: 'foo',
        name: 'bar',
        value: 'baz'
      },
      {
        customProperty: {},
        dimension: {}
      }
    );
    assert.strictEqual(res, 'foo:bar:baz::||||0|0|0|::::', 'result');
  });

  it('should get value', () => {
    const res = func(
      {
        namespace: 'foo',
        name: 'bar',
        value: 'baz'
      },
      {
        format: 'computedValue',
        colorSpace: 'srgb',
        colorScheme: 'normal',
        currentColor: 'black',
        d50: false,
        nullable: false,
        preserveComment: true,
        delimiter: ' ',
        customProperty: {
          '--foo': 'foo',
          '--bar': 'bar'
        },
        dimension: {
          em: 12,
          rem: 16
        }
      }
    );
    assert.strictEqual(
      res,
      'foo:bar:baz::computedValue|srgb|normal|black|0|0|1| ::--bar:"bar";--foo:"foo";::em:12;rem:16;',
      'result'
    );
  });

  it('should get empty string', () => {
    const res = func(
      {
        foo: 'foo',
        bar: 'bar'
      },
      {
        dimension: {
          callback: () => {}
        }
      }
    );
    assert.strictEqual(res, '', 'result');
  });

  it('should get empty string', () => {
    const res = func(
      {
        foo: 'foo',
        bar: 'bar'
      },
      {
        customProperty: {
          callback: () => {}
        }
      }
    );
    assert.strictEqual(res, '', 'result');
  });
});
