/**
 * gradient-util.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/utils/cache';
import * as grad from '../src/gradients/gradient-util';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('get gradient type', () => {
  const func = grad.getGradientType;

  it('should get empty string', () => {
    const res = func();
    assert.strictEqual(res, '', 'result');
  });

  it('should get empty string', () => {
    const res = func('foo');
    assert.strictEqual(res, '', 'result');
  });

  it('should get value', () => {
    const res = func('linear-gradient(green, blue)');
    assert.strictEqual(res, 'linear-gradient', 'result');
  });

  it('should get value', () => {
    const res = func('repeating-linear-gradient(green, blue)');
    assert.strictEqual(res, 'repeating-linear-gradient', 'result');
  });

  it('should get value', () => {
    const res = func('radial-gradient(green, blue)');
    assert.strictEqual(res, 'radial-gradient', 'result');
  });

  it('should get value', () => {
    const res = func('repeating-radial-gradient(green, blue)');
    assert.strictEqual(res, 'repeating-radial-gradient', 'result');
  });

  it('should get value', () => {
    const res = func('conic-gradient(green, blue)');
    assert.strictEqual(res, 'conic-gradient', 'result');
  });

  it('should get value', () => {
    const res = func('repeating-conic-gradient(green, blue)');
    assert.strictEqual(res, 'repeating-conic-gradient', 'result');
  });
});

describe('validate gradient line', () => {
  const func = grad.validateGradientLine;

  it('should get false', () => {
    const res = func();
    assert.deepEqual(
      res,
      {
        line: undefined,
        valid: false
      },
      'result'
    );
  });

  it('should get false', () => {
    const res = func('foo');
    assert.deepEqual(
      res,
      {
        line: 'foo',
        valid: false
      },
      'result'
    );
  });

  it('should get false', () => {
    const res = func('foo', 'bar');
    assert.deepEqual(
      res,
      {
        line: 'foo',
        valid: false
      },
      'result'
    );
  });

  it('should get false', () => {
    const res = func('foo', 'linear-gradient');
    assert.deepEqual(
      res,
      {
        line: 'foo',
        valid: false
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('from 45deg', 'conic-gradient');
    assert.deepEqual(
      res,
      {
        line: 'from 45deg',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('from 90deg at 0 0', 'conic-gradient');
    assert.deepEqual(
      res,
      {
        line: 'from 90deg at 0 0',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('in hsl longer hue', 'conic-gradient');
    assert.deepEqual(
      res,
      {
        line: 'in hsl longer hue',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('circle at center', 'radial-gradient');
    assert.deepEqual(
      res,
      {
        line: 'circle',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('in hsl longer hue', 'radial-gradient');
    assert.deepEqual(
      res,
      {
        line: 'in hsl longer hue',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('circle at center in hsl longer hue', 'radial-gradient');
    assert.deepEqual(
      res,
      {
        line: 'circle in hsl longer hue',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('circle at center in hsl', 'radial-gradient');
    assert.deepEqual(
      res,
      {
        line: 'circle in hsl',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('ellipse closest-side', 'radial-gradient');
    assert.deepEqual(
      res,
      {
        line: 'closest-side',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('45deg', 'linear-gradient');
    assert.deepEqual(
      res,
      {
        line: '45deg',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('to left top', 'linear-gradient');
    assert.deepEqual(
      res,
      {
        line: 'to left top',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('in oklab', 'linear-gradient');
    assert.deepEqual(
      res,
      {
        line: 'in oklab',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('to  bottom', 'linear-gradient');
    assert.deepEqual(
      res,
      {
        line: '',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('ellipse farthest-corner at  center', 'radial-gradient');
    assert.deepEqual(
      res,
      {
        line: '',
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func('at  center', 'conic-gradient');
    assert.deepEqual(
      res,
      {
        line: '',
        valid: true
      },
      'result'
    );
  });
});

describe('validate color stop list', () => {
  const func = grad.validateColorStopList;

  it('should get false', () => {
    const res = func();
    assert.deepEqual(
      res,
      {
        colorStops: undefined,
        valid: false
      },
      'result'
    );
  });

  it('should get false', () => {
    const res = func(['foo']);
    assert.deepEqual(
      res,
      {
        colorStops: ['foo'],
        valid: false
      },
      'result'
    );
  });

  it('should get false', () => {
    const res = func(['foo'], 'bar');
    assert.deepEqual(
      res,
      {
        colorStops: ['foo'],
        valid: false
      },
      'result'
    );
  });

  it('should get false', () => {
    const res = func(['foo'], 'linear-gradient');
    assert.deepEqual(
      res,
      {
        colorStops: ['foo'],
        valid: false
      },
      'result'
    );
  });

  it('should get false', () => {
    const res = func(['red'], 'linear-gradient');
    assert.deepEqual(
      res,
      {
        colorStops: ['red'],
        valid: false
      },
      'result'
    );
  });

  it('should get false', () => {
    const res = func(['red', 'foo'], 'linear-gradient');
    assert.deepEqual(
      res,
      {
        colorStops: ['red', 'foo'],
        valid: false
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func(['blue', 'green', 'yellow 180deg'], 'conic-gradient', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        colorStops: ['blue', 'green', 'yellow 180deg'],
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func(
      ['red 36deg', 'orange 36deg 170deg', 'yellow 170deg'],
      'conic-gradient',
      {
        format: 'specifiedValue'
      }
    );
    assert.deepEqual(
      res,
      {
        colorStops: ['red 36deg', 'orange 36deg 170deg', 'yellow 170deg'],
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func(['lime 28px', 'red 77%', 'cyan'], 'linear-gradient', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        colorStops: ['lime 28px', 'red 77%', 'cyan'],
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func(['cyan 50%', 'palegoldenrod 50%'], 'linear-gradient', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        colorStops: ['cyan 50%', 'palegoldenrod 50%'],
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func(['blue', '10%', 'pink'], 'linear-gradient', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        colorStops: ['blue', '10%', 'pink'],
        valid: true
      },
      'result'
    );
  });

  it('should get false', () => {
    const res = func(['blue', '10%', '20%', 'pink'], 'linear-gradient', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        colorStops: ['blue', '10%', '20%', 'pink'],
        valid: false
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func(['#0000ff', '10%', '#008000'], 'linear-gradient', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        colorStops: ['rgb(0, 0, 255)', '10%', 'rgb(0, 128, 0)'],
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func(['blue', '10%', 'green'], 'linear-gradient', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      {
        colorStops: ['blue', '10%', 'green'],
        valid: true
      },
      'result'
    );
  });

  it('should get true', () => {
    const res = func(['blue', '10%', 'green'], 'linear-gradient', {
      format: 'computedValue'
    });
    assert.deepEqual(
      res,
      {
        colorStops: ['rgb(0, 0, 255)', '10%', 'rgb(0, 128, 0)'],
        valid: true
      },
      'result'
    );
  });

  it('should get false for non-string items', () => {
    const res = func(['red', undefined as any], 'linear-gradient');
    assert.deepEqual(
      res,
      {
        colorStops: ['red', undefined as any],
        valid: false
      },
      'result'
    );
  });

  it('should get false if a color hint is the first item', () => {
    const res = func(['50%', 'blue'], 'linear-gradient');
    assert.deepEqual(
      res,
      {
        colorStops: ['50%', 'blue'],
        valid: false
      },
      'result'
    );
  });

  it('should get false if a color hint is the last item', () => {
    const res = func(['red', '50%'], 'linear-gradient');
    assert.deepEqual(
      res,
      {
        colorStops: ['red', '50%'],
        valid: false
      },
      'result'
    );
  });
});
