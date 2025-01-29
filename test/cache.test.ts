/**
 * cache.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { LRUCache } from 'lru-cache';
import * as cache from '../src/js/cache';

describe('lru cache', () => {
  it('should be instance', () => {
    const { lruCache } = cache;
    assert.strictEqual(lruCache instanceof LRUCache, true, 'instance');
    assert.strictEqual(typeof lruCache.clear, 'function', 'clear');
    assert.strictEqual(typeof lruCache.delete, 'function', 'delete');
    assert.strictEqual(typeof lruCache.get, 'function', 'get');
    assert.strictEqual(typeof lruCache.has, 'function', 'has');
    assert.strictEqual(typeof lruCache.set, 'function', 'set');
  });
});

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
  const { CacheItem, NullObject, lruCache, setCache } = cache;
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
    assert.strictEqual(res instanceof NullObject, false, 'instance');
    assert.strictEqual(res.item, undefined, 'result');
  });

  it('should get cache', () => {
    setCache('bar', 'bar');
    const res = func('bar');
    assert.strictEqual(res instanceof CacheItem, true, 'instance');
    assert.strictEqual(res instanceof NullObject, false, 'instance');
    assert.strictEqual(res.item, 'bar', 'result');
  });

  it('should get null object', () => {
    setCache('baz', null);
    const res = func('baz');
    assert.strictEqual(res instanceof CacheItem, true, 'instance');
    assert.strictEqual(res instanceof NullObject, true, 'instance');
  });

  it('should get false', () => {
    const res = func('qux');
    assert.strictEqual(res, false, 'result');
  });

  it('should get false and delete key', () => {
    lruCache.set('quux', 'quux');
    const res = func('quux');
    assert.strictEqual(lruCache.has('quux'), false, 'key');
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

  it('should get value', () => {
    const res = func({
      foo: 'foo',
      bar: 'bar'
    });
    assert.strictEqual(res, '{"foo":"foo","bar":"bar","opt":"{}"}', 'result');
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
