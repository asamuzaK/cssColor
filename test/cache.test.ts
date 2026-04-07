/**
 * cache.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import * as cache from '../src/js/cache';

describe('generational cache', () => {
  it('should be instance', () => {
    const { GenerationalCache, genCache } = cache;
    assert.strictEqual(genCache instanceof GenerationalCache, true, 'instance');
    assert.strictEqual(typeof genCache.clear, 'function', 'clear');
    assert.strictEqual(typeof genCache.delete, 'function', 'delete');
    assert.strictEqual(typeof genCache.get, 'function', 'get');
    assert.strictEqual(typeof genCache.has, 'function', 'has');
    assert.strictEqual(typeof genCache.set, 'function', 'set');
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
