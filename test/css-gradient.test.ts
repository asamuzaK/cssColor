/**
 * css-gradient.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/js/cache';
import * as grad from '../src/js/css-gradient';

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
    assert.strictEqual(res, false, 'result');
  });

  it('should get false', () => {
    const res = func('foo');
    assert.strictEqual(res, false, 'result');
  });

  it('should get false', () => {
    const res = func('foo', 'bar');
    assert.strictEqual(res, false, 'result');
  });

  it('should get false', () => {
    const res = func('foo', 'linear-gradient');
    assert.strictEqual(res, false, 'result');
  });

  it('should get true', () => {
    const res = func('from 45deg', 'conic-gradient');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('from 90deg at 0 0', 'conic-gradient');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('in hsl longer hue', 'conic-gradient');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('circle at center', 'radial-gradient');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('in hsl longer hue', 'radial-gradient');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('circle at center in hsl longer hue', 'radial-gradient');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('circle at center in hsl', 'radial-gradient');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('ellipse closest-side', 'radial-gradient');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('45deg', 'linear-gradient');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('to left top', 'linear-gradient');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('in oklab', 'linear-gradient');
    assert.strictEqual(res, true, 'result');
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
        gradientLine: 'ellipse closest-side',
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
