/**
 * cache.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import * as cache from '../src/js/cache';

describe('generational cache', () => {
  it('should be instance', () => {
    assert.strictEqual(
      cache.genCache instanceof cache.GenerationalCache,
      true,
      'instance'
    );
    assert.strictEqual(typeof cache.genCache.clear, 'function', 'clear');
    assert.strictEqual(typeof cache.genCache.delete, 'function', 'delete');
    assert.strictEqual(typeof cache.genCache.get, 'function', 'get');
    assert.strictEqual(typeof cache.genCache.has, 'function', 'has');
    assert.strictEqual(typeof cache.genCache.set, 'function', 'set');
  });

  it('should initialize with 4 for the max generation size', () => {
    const genCache = new cache.GenerationalCache(2);
    assert.strictEqual(genCache.max, 4, 'max generation size should be 4');
  });

  it('should initialize with the given max generation size', () => {
    const genCache = new cache.GenerationalCache(5);
    assert.strictEqual(
      genCache.max,
      5,
      'max generation size should be given value'
    );
  });

  it('should set max generation size and clear cache', () => {
    const genCache = new cache.GenerationalCache(2);
    genCache.set('foo', 'bar');
    assert.strictEqual(genCache.size, 1, 'cache is added');
    genCache.max = 5;
    assert.strictEqual(
      genCache.max,
      5,
      'max generation size should be given value'
    );
    assert.strictEqual(genCache.size, 0, 'cache is cleared');
  });

  it('should set max generation size and clear cache', () => {
    const genCache = new cache.GenerationalCache(5);
    genCache.set('foo', 'bar');
    assert.strictEqual(genCache.size, 1, 'cache is added');
    genCache.max = 2;
    assert.strictEqual(genCache.max, 4, 'max generation size should be 4');
    assert.strictEqual(genCache.size, 0, 'cache is cleared');
  });

  it('should be within max generation size', () => {
    const genCache = new cache.GenerationalCache(9);
    const boundary = Math.ceil(genCache.max / 2);
    for (let i = 1; i < 20; i++) {
      genCache.set(`key${i}`, i);
      if (i < genCache.max) {
        assert.equal(genCache.size, i, `${i}`);
      } else {
        assert.equal(genCache.size, (i % boundary) + boundary, `${i}`);
      }
    }
  });

  it('should set and get values', () => {
    const genCache = new cache.GenerationalCache(10);
    genCache.set('key1', 'value1');
    genCache.set('key2', { foo: 'bar' });

    assert.strictEqual(
      genCache.get('key1'),
      'value1',
      'should get primitive value'
    );
    assert.deepEqual(
      genCache.get('key2'),
      { foo: 'bar' },
      'should get object value'
    );
    assert.strictEqual(
      genCache.get('unknown'),
      undefined,
      'should return undefined for missing keys'
    );
  });

  it('should check existence with has()', () => {
    const genCache = new cache.GenerationalCache(10);
    genCache.set('key1', 'value1');

    assert.strictEqual(genCache.has('key1'), true, 'should have key1');
    assert.strictEqual(genCache.has('key2'), false, 'should not have key2');
  });

  it('should delete values', () => {
    const genCache = new cache.GenerationalCache(10);
    genCache.set('key1', 'value1');
    genCache.delete('key1');

    assert.strictEqual(genCache.has('key1'), false, 'key1 should be deleted');
    assert.strictEqual(
      genCache.get('key1'),
      undefined,
      'deleted key should return undefined'
    );
  });

  it('should clear all values', () => {
    const genCache = new cache.GenerationalCache(10);
    genCache.set('key1', 'value1');
    genCache.set('key2', 'value2');
    genCache.clear();

    assert.strictEqual(genCache.has('key1'), false, 'key1 should be cleared');
    assert.strictEqual(genCache.has('key2'), false, 'key2 should be cleared');
  });

  it('should shift generations and evict old items', () => {
    const genCache = new cache.GenerationalCache(4);
    genCache.set('k1', 'v1');
    genCache.set('k2', 'v2');
    assert.strictEqual(
      genCache.has('k1'),
      true,
      'k1 should exist in old generation'
    );
    assert.strictEqual(
      genCache.has('k2'),
      true,
      'k2 should exist in old generation'
    );

    genCache.set('k3', 'v3');
    genCache.set('k4', 'v4');
    assert.strictEqual(genCache.has('k1'), false, 'k1 should be evicted');
    assert.strictEqual(genCache.has('k2'), false, 'k2 should be evicted');
    assert.strictEqual(
      genCache.has('k3'),
      true,
      'k3 should survive in old generation'
    );
    assert.strictEqual(
      genCache.has('k4'),
      true,
      'k4 should survive in old generation'
    );
  });

  it('should promote accessed old items to current generation', () => {
    const genCache = new cache.GenerationalCache(4);
    genCache.set('k1', 'v1');
    genCache.set('k2', 'v2');
    const val = genCache.get('k1');
    assert.strictEqual(val, 'v1', 'should get promoted value');
    genCache.set('k3', 'v3');
    assert.strictEqual(
      genCache.has('k1'),
      true,
      'k1 should survive because it was promoted'
    );
    assert.strictEqual(genCache.has('k2'), false, 'k2 should be evicted');
    assert.strictEqual(
      genCache.has('k3'),
      true,
      'k3 should survive in old generation'
    );
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
  const { CacheItem, genCache } = cache;
  const func = cache.setCache;

  beforeEach(() => {
    genCache.clear();
  });
  afterEach(() => {
    genCache.clear();
  });

  it('should not set cache', () => {
    func('');
    assert.strictEqual(genCache.has(''), false, 'has');
  });

  it('should set cache', () => {
    func('foo');
    assert.strictEqual(genCache.has('foo'), true, 'has');
    assert.strictEqual(genCache.get('foo') instanceof CacheItem, true, 'cache');
  });

  it('should set cache', () => {
    func('bar', 'bar');
    assert.strictEqual(genCache.has('bar'), true, 'has');
    assert.strictEqual(genCache.get('bar') instanceof CacheItem, true, 'cache');
  });

  it('should set cache', () => {
    func('baz', null);
    assert.strictEqual(genCache.has('baz'), true, 'has');
    assert.strictEqual(genCache.get('baz') instanceof CacheItem, true, 'cache');
  });

  it('should set cache', () => {
    func('qux', new CacheItem('qux'));
    assert.strictEqual(genCache.has('qux'), true, 'has');
    assert.strictEqual(genCache.get('qux') instanceof CacheItem, true, 'cache');
  });
});

describe('get cache', () => {
  const { CacheItem, NullObject, genCache, setCache } = cache;
  const func = cache.getCache;

  beforeEach(() => {
    genCache.clear();
  });
  afterEach(() => {
    genCache.clear();
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
    genCache.set('quux', 'quux');
    const res = func('quux');
    assert.strictEqual(genCache.has('quux'), false, 'key');
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
    assert.strictEqual(res, '::::||||0|0|0|::::', 'result');
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
      'foo:bar:baz::computedValue|srgb|normal|black|0|0|1| ::{"--bar":"bar","--foo":"foo"}::{"em":12,"rem":16}',
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
