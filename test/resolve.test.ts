/**
 * resolve.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/utils/cache';
import * as resolve from '../src/resolvers/resolve';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('resolve CSS color', () => {
  const func = resolve.resolve;

  it('should resolve valid CSS color value to resolved string', () => {
    assert.strictEqual(func('red'), 'rgb(255, 0, 0)');
    assert.strictEqual(func('#ff0000'), 'rgb(255, 0, 0)');
  });

  it('should return empty string for invalid color when format is "specifiedValue"', () => {
    const res = func('invalid_color', { format: 'specifiedValue' });
    assert.strictEqual(res, '');
  });

  it('should return transparent rgba for invalid color when format is "computedValue"', () => {
    const res = func('invalid_color', { format: 'computedValue' });
    assert.strictEqual(res, 'rgba(0, 0, 0, 0)');
  });

  it('should return null for invalid color when format is not "specifiedValue" / "computedValue"', () => {
    const res = func('invalid_color', { format: 'hex' });
    assert.strictEqual(res, null);
  });
});

describe('is color', () => {
  const func = resolve.isColor;

  it('should return true for valid CSS color values', () => {
    assert.isTrue(func('red'));
    assert.isTrue(func('#00ff00'));
    assert.isTrue(func('rgb(0 0 0)'));
  });

  it('should return false for invalid CSS color values', () => {
    assert.isFalse(func('not_a_color'));
    assert.isFalse(func(''));
  });

  it('should return false for non-string inputs', () => {
    assert.isFalse(func(123));
    assert.isFalse(func(null));
    assert.isFalse(func(undefined));
  });

  it('should set default format to VAL_SPEC if options format is missing', () => {
    assert.isTrue(func('blue', { preserveCustomIdent: true }));
  });
});
