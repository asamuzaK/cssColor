/**
 * gradient.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/utils/cache';
import * as grad from '../src/gradients/gradient';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('resolve CSS gradient', () => {
  const func = grad.resolveGradient;

  it('should get none', () => {
    const res = func();
    assert.strictEqual(res, 'none', 'result');
  });

  it('should get empty string', () => {
    const res = func('', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, '', 'result');
  });

  it('should get none', () => {
    const res = func('foo(red, blue)');
    assert.strictEqual(res, 'none', 'result');
  });

  it('should get none', () => {
    const res = func('linear-gradient(red)');
    assert.strictEqual(res, 'none', 'result');
  });

  it('should get value', () => {
    const res = func('linear-gradient(red, blue)');
    assert.strictEqual(
      res,
      'linear-gradient(rgb(255, 0, 0), rgb(0, 0, 255))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('linear-gradient(to right, red, blue)');
    assert.strictEqual(
      res,
      'linear-gradient(to right, rgb(255, 0, 0), rgb(0, 0, 255))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('linear-gradient(red, blue)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'linear-gradient(red, blue)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'radial-gradient(ellipse closest-side, #1e90ff 50%, #008000)',
      {
        format: 'specifiedValue'
      }
    );
    assert.strictEqual(
      res,
      'radial-gradient(closest-side, rgb(30, 144, 255) 50%, rgb(0, 128, 0))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('radial-gradient(transparent, var(--custom-color))', {
      customProperty: {
        '--custom-color': 'rgb(0, 128, 0)'
      }
    });
    assert.strictEqual(
      res,
      'radial-gradient(rgba(0, 0, 0, 0), rgb(0, 128, 0))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('radial-gradient(transparent, var(--custom-color))', {
      format: 'specifiedValue'
    });
    assert.strictEqual(
      res,
      'radial-gradient(transparent, var(--custom-color))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'radial-gradient(transparent, /* comment */ var(--custom-color))',
      {
        format: 'specifiedValue'
      }
    );
    assert.strictEqual(
      res,
      'radial-gradient(transparent, var(--custom-color))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'radial-gradient(transparent, /* comment */ var(--custom-color))',
      {
        customProperty: {
          '--custom-color': 'rgb(0, 128, 0)'
        },
        format: 'computedValue'
      }
    );
    assert.strictEqual(
      res,
      'radial-gradient(rgba(0, 0, 0, 0), rgb(0, 128, 0))',
      'result'
    );
  });
});

describe('is CSS gradient', () => {
  const func = grad.isGradient;

  it('should get false', () => {
    const res = func();
    assert.strictEqual(res, false, 'result');
  });

  it('should get false', () => {
    const res = func('foo(red, blue)');
    assert.strictEqual(res, false, 'result');
  });

  it('should get false', () => {
    const res = func('linear-gradient(red)');
    assert.strictEqual(res, false, 'result');
  });

  it('should get true', () => {
    const res = func('linear-gradient(red, blue)');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('radial-gradient(transparent, var(--custom-color))');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('radial-gradient(transparent, var(--custom-color))');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func(
      'radial-gradient(transparent, /* comment */ var(--custom-color))'
    );
    assert.strictEqual(res, true, 'result');
  });
});
