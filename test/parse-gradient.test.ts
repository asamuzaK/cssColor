/**
 * parse-gradient.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/utils/cache';
import * as grad from '../src/gradients/parse-gradient';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('parse CSS gradient', () => {
  const func = grad.parseGradient;

  it('should get null', () => {
    const res = func();
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const res = func('foo(red, blue)');
    assert.strictEqual(res, null, 'result');

    const res2 = func('foo(red, blue)');
    assert.strictEqual(res2, null, 'result');
  });

  it('should get null', () => {
    const res = func('linear-gradient()');
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const res = func('linear-gradient(foo, red, blue)');
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const res = func('linear-gradient(red)');
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const res = func('linear-gradient(to left, red)');
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('linear-gradient(blue, green)');
    assert.deepEqual(
      res,
      {
        value: 'linear-gradient(blue, green)',
        type: 'linear-gradient',
        colorStopList: ['rgb(0, 0, 255)', 'rgb(0, 128, 0)']
      },
      'result'
    );

    const res2 = func('linear-gradient(blue, green)');
    assert.deepEqual(
      res2,
      {
        value: 'linear-gradient(blue, green)',
        type: 'linear-gradient',
        colorStopList: ['rgb(0, 0, 255)', 'rgb(0, 128, 0)']
      },
      'result'
    );
  });

  it('should get value', () => {
    const res = func('linear-gradient(blue, pink)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        value: 'linear-gradient(blue, pink)',
        type: 'linear-gradient',
        colorStopList: ['blue', 'pink']
      },
      'result'
    );

    const res2 = func('linear-gradient(blue, pink)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res2,
      {
        value: 'linear-gradient(blue, pink)',
        type: 'linear-gradient',
        colorStopList: ['blue', 'pink']
      },
      'result'
    );
  });

  it('should get value', () => {
    const res = func('linear-gradient(#0000ff, #ffc0cb)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        value: 'linear-gradient(#0000ff, #ffc0cb)',
        type: 'linear-gradient',
        colorStopList: ['rgb(0, 0, 255)', 'rgb(255, 192, 203)']
      },
      'result'
    );
  });

  it('should get value', () => {
    const res = func('linear-gradient(to right, blue, pink)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        value: 'linear-gradient(to right, blue, pink)',
        type: 'linear-gradient',
        gradientLine: 'to right',
        colorStopList: ['blue', 'pink']
      },
      'result'
    );
  });

  it('should get value', () => {
    const res = func('linear-gradient(red, yellow, blue, orange)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        value: 'linear-gradient(red, yellow, blue, orange)',
        type: 'linear-gradient',
        colorStopList: ['red', 'yellow', 'blue', 'orange']
      },
      'result'
    );
  });

  it('should get value', () => {
    const res = func('linear-gradient(to left, lime 28px, red 77%, cyan)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        value: 'linear-gradient(to left, lime 28px, red 77%, cyan)',
        type: 'linear-gradient',
        gradientLine: 'to left',
        colorStopList: ['lime 28px', 'red 77%', 'cyan']
      },
      'result'
    );
  });

  it('should get value', () => {
    const res = func('radial-gradient(red 10px, yellow 30%, #1e90ff 50%)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        value: 'radial-gradient(red 10px, yellow 30%, #1e90ff 50%)',
        type: 'radial-gradient',
        colorStopList: ['red 10px', 'yellow 30%', 'rgb(30, 144, 255) 50%']
      },
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'radial-gradient(at 0% 30%, red 10px, yellow 30%, #1e90ff 50%)',
      {
        format: 'specifiedValue'
      }
    );
    assert.deepEqual(
      res,
      {
        value: 'radial-gradient(at 0% 30%, red 10px, yellow 30%, #1e90ff 50%)',
        type: 'radial-gradient',
        gradientLine: 'at 0% 30%',
        colorStopList: ['red 10px', 'yellow 30%', 'rgb(30, 144, 255) 50%']
      },
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'radial-gradient(ellipse closest-side, red, yellow 10%, #1e90ff 50%, beige)',
      {
        format: 'specifiedValue'
      }
    );
    assert.deepEqual(
      res,
      {
        value:
          'radial-gradient(ellipse closest-side, red, yellow 10%, #1e90ff 50%, beige)',
        type: 'radial-gradient',
        gradientLine: 'closest-side',
        colorStopList: ['red', 'yellow 10%', 'rgb(30, 144, 255) 50%', 'beige']
      },
      'result'
    );
  });

  it('should get value', () => {
    const res = func('radial-gradient(circle -10px at center, red, blue)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('conic-gradient(red, blue)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        value: 'conic-gradient(red, blue)',
        type: 'conic-gradient',
        colorStopList: ['red', 'blue']
      },
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'conic-gradient(at 0% 30%, red 10%, yellow 30%, #1e90ff 50%)',
      {
        format: 'specifiedValue'
      }
    );
    assert.deepEqual(
      res,
      {
        value: 'conic-gradient(at 0% 30%, red 10%, yellow 30%, #1e90ff 50%)',
        type: 'conic-gradient',
        gradientLine: 'at 0% 30%',
        colorStopList: ['red 10%', 'yellow 30%', 'rgb(30, 144, 255) 50%']
      },
      'result'
    );
  });
});
