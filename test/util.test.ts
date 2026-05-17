/**
 * util.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { genCache } from '../src/js/cache';
import * as util from '../src/js/util';

beforeEach(() => {
  genCache.clear();
});

afterEach(() => {
  genCache.clear();
});

describe('split value', () => {
  const func = util.splitValue;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string.');
  });

  it('should get value', () => {
    const res = func(' foo ');
    assert.deepEqual(res, ['foo'], 'result');

    const res2 = func(' foo ');
    assert.deepEqual(res2, ['foo'], 'result');
  });

  it('should get value', () => {
    const res = func('foo bar');
    assert.deepEqual(res, ['foo', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo bar', {
      delimiter: ','
    });
    assert.deepEqual(res, ['foo bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo, bar', {
      delimiter: ','
    });
    assert.deepEqual(res, ['foo', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo bar', {
      delimiter: '/'
    });
    assert.deepEqual(res, ['foo bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo / bar', {
      delimiter: '/'
    });
    assert.deepEqual(res, ['foo', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('calc(1 / 3) / bar', {
      delimiter: '/'
    });
    assert.deepEqual(res, ['calc(1 / 3)', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo  bar');
    assert.deepEqual(res, ['foo', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo  bar', {
      delimiter: ','
    });
    assert.deepEqual(res, ['foo bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo  bar', {
      delimiter: '/'
    });
    assert.deepEqual(res, ['foo bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo /* comment */ bar');
    assert.deepEqual(res, ['foo', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo /* comment */ , bar', {
      delimiter: ','
    });
    assert.deepEqual(res, ['foo', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo /* comment */ / bar', {
      delimiter: '/'
    });
    assert.deepEqual(res, ['foo', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo /* comment */ bar', {
      preserveComment: true
    });
    assert.deepEqual(res, ['foo', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo /* comment */ , bar', {
      delimiter: ',',
      preserveComment: true
    });
    assert.deepEqual(res, ['foo /* comment */', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo /* comment */ / bar', {
      delimiter: '/',
      preserveComment: true
    });
    assert.deepEqual(res, ['foo /* comment */', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo /* comment */ bar, baz', {
      delimiter: ',',
      preserveComment: true
    });
    assert.deepEqual(res, ['foo /* comment */ bar', 'baz'], 'result');
  });

  it('should get value', () => {
    const res = func('foo /* comment */ bar / baz', {
      delimiter: '/',
      preserveComment: true
    });
    assert.deepEqual(res, ['foo /* comment */ bar', 'baz'], 'result');
  });

  it('should get value', () => {
    const res = func(',', {
      delimiter: ','
    });
    assert.deepEqual(res, ['', ''], 'result');
  });

  it('should get value', () => {
    const res = func('/', {
      delimiter: '/'
    });
    assert.deepEqual(res, ['', ''], 'result');
  });

  it('should get value', () => {
    const res = func(
      'linear-gradient(red, blue), radial-gradient(yellow, green)',
      {
        delimiter: ','
      }
    );
    assert.deepEqual(
      res,
      ['linear-gradient(red, blue)', 'radial-gradient(yellow, green)'],
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'rgb(from rebeccapurple, calc((r * 0.5) + 10) g b) 1px 0 10px'
    );
    assert.deepEqual(
      res,
      ['rgb(from rebeccapurple, calc((r * 0.5) + 10) g b)', '1px', '0', '10px'],
      'result'
    );
  });
});

describe('extract dashed-ident tokens', () => {
  const func = util.extractDashedIdent;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string.');
  });

  it('should get empty array', () => {
    const res = func('foo');
    assert.deepEqual(res, [], 'result');

    const res2 = func('foo');
    assert.deepEqual(res2, [], 'result');
  });

  it('should get array', () => {
    const res = func('var(--foo) var(--bar) var(--baz)');
    assert.deepEqual(res, ['--foo', '--bar', '--baz'], 'result');

    const res2 = func('var(--foo) var(--bar) var(--baz)');
    assert.deepEqual(res2, ['--foo', '--bar', '--baz'], 'result');
  });

  it('should get array', () => {
    const res = func('var(--foo, var(--bar, qux)) var(--baz, quux)');
    assert.deepEqual(res, ['--foo', '--bar', '--baz'], 'result');

    const res2 = func('var(--foo, var(--bar, qux)) var(--baz, quux)');
    assert.deepEqual(res2, ['--foo', '--bar', '--baz'], 'result');
  });
});

describe('is color', () => {
  const func = util.isColor;

  it('should get false', () => {
    const res = func();
    assert.strictEqual(res, false, 'result');
  });

  it('should get false', () => {
    const res = func('');
    assert.strictEqual(res, false, 'result');
  });

  it('should get false', () => {
    const res = func('foo');
    assert.strictEqual(res, false, 'result');
  });

  it('should get true', () => {
    const res = func('red');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('currentcolor');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('transparent');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('color(srgb 0 127.5 0)');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('color-mix(in oklab, red, blue)');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('rgb(from rebeccapurple r g b)');
    assert.strictEqual(res, true, 'result');
  });

  it('should get false', () => {
    const res = func('rgb(from rebeccapurple l a b)');
    assert.strictEqual(res, false, 'result');
  });

  it('should get true', () => {
    const res = func('var(--foo)');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func(
      'color-mix(in oklab, green, color-mix(in srgb, red, transparent))',
      {
        format: 'computedColor'
      }
    );
    assert.strictEqual(res, true, 'result');
  });

  it('should get false', () => {
    const res = func(
      // Invalid color space
      'color-mix(in oklab, green, color-mix(in rgb, red, transparent))',
      {
        format: 'computedColor'
      }
    );
    assert.strictEqual(res, false, 'result');
  });

  it('should get true', () => {
    const res = func(
      // Missing close paren should be okay
      'color-mix(in oklab, green, color-mix(in srgb, red, transparent)',
      {
        format: 'computedColor'
      }
    );
    assert.strictEqual(res, true, 'result');
  });

  it('should get false', () => {
    const res = func('url(var(--foo))');
    assert.strictEqual(res, false, 'result');
  });

  it('should get false', () => {
    const res = func('radial-gradient(transparent, var(--custom-color))');
    assert.strictEqual(res, false, 'result');
  });
});

describe('round to specified precision', () => {
  const func = util.roundToPrecision;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a finite number.');
  });

  it('should throw', () => {
    assert.throws(
      () => func(Infinity),
      TypeError,
      'Infinity is not a finite number.'
    );
  });

  it('should throw', () => {
    assert.throws(
      () => func(1.23456789, 'foo'),
      TypeError,
      'foo is not a finite number.'
    );
  });

  it('should throw', () => {
    assert.throws(
      () => func(1.23456789, -1),
      RangeError,
      '-1 is not between 0 and 16.'
    );
  });

  it('should throw', () => {
    assert.throws(
      () => func(1.23456789, 32),
      RangeError,
      '32 is not between 0 and 16.'
    );
  });

  it('should get value', () => {
    const res = func(1.23456789);
    assert.deepEqual(res, 1, 'result');
  });

  it('should get value', () => {
    const res = func(1.23456789, 16);
    assert.deepEqual(res, 1.23457, 'result');
  });

  it('should get value', () => {
    const res = func(1.234506789, 16);
    assert.deepEqual(res, 1.23451, 'result');
  });

  it('should get value', () => {
    const res = func(1.23450456, 16);
    assert.deepEqual(res, 1.2345, 'result');
  });

  it('should get value', () => {
    const res = func(1.230456789, 16);
    assert.deepEqual(res, 1.23046, 'result');
  });

  it('should get value', () => {
    const res = func(1.23456789, 8);
    assert.deepEqual(res, 1.235, 'result');
  });

  it('should get value', () => {
    const res = func(1.230456789, 8);
    assert.deepEqual(res, 1.23, 'result');
  });

  it('should get value', () => {
    const res = func(1.203456789, 8);
    assert.deepEqual(res, 1.203, 'result');
  });

  it('should get value', () => {
    const res = func(1.023456789, 8);
    assert.deepEqual(res, 1.023, 'result');
  });

  it('should get value', () => {
    const res = func(1.23456789, 10);
    assert.deepEqual(res, 1.2346, 'result');
  });

  it('should get value', () => {
    const res = func(1.230456789, 10);
    assert.deepEqual(res, 1.2305, 'result');
  });

  it('should get value', () => {
    const res = func(1.203456789, 10);
    assert.deepEqual(res, 1.2035, 'result');
  });
});

describe('interpolate hue', () => {
  const func = util.interpolateHue;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a finite number.');
  });

  it('should throw', () => {
    assert.throws(
      () => func(90),
      TypeError,
      'undefined is not a finite number.'
    );
  });

  it('should get value', () => {
    const res = func(30, 60);
    assert.deepEqual(res, [30, 60], 'result');
  });

  it('should get value', () => {
    const res = func(60, 30);
    assert.deepEqual(res, [60, 30], 'result');
  });

  it('should get value', () => {
    const res = func(30, 240);
    assert.deepEqual(res, [390, 240], 'result');
  });

  it('should get value', () => {
    const res = func(240, 30);
    assert.deepEqual(res, [240, 390], 'result');
  });

  it('should get value', () => {
    const res = func(30, 60, 'shorter');
    assert.deepEqual(res, [30, 60], 'result');
  });

  it('should get value', () => {
    const res = func(60, 30, 'shorter');
    assert.deepEqual(res, [60, 30], 'result');
  });

  it('should get value', () => {
    const res = func(30, 240, 'shorter');
    assert.deepEqual(res, [390, 240], 'result');
  });

  it('should get value', () => {
    const res = func(240, 30, 'shorter');
    assert.deepEqual(res, [240, 390], 'result');
  });

  it('should get value', () => {
    const res = func(30, 60, 'longer');
    assert.deepEqual(res, [390, 60], 'result');
  });

  it('should get value', () => {
    const res = func(60, 30, 'longer');
    assert.deepEqual(res, [60, 390], 'result');
  });

  it('should get value', () => {
    const res = func(30, 240, 'longer');
    assert.deepEqual(res, [30, 240], 'result');
  });

  it('should get value', () => {
    const res = func(240, 30, 'longer');
    assert.deepEqual(res, [240, 30], 'result');
  });

  it('should get value', () => {
    const res = func(30, 60, 'increasing');
    assert.deepEqual(res, [30, 60], 'result');
  });

  it('should get value', () => {
    const res = func(60, 30, 'increasing');
    assert.deepEqual(res, [60, 390], 'result');
  });

  it('should get value', () => {
    const res = func(30, 240, 'increasing');
    assert.deepEqual(res, [30, 240], 'result');
  });

  it('should get value', () => {
    const res = func(240, 30, 'increasing');
    assert.deepEqual(res, [240, 390], 'result');
  });

  it('should get value', () => {
    const res = func(30, 60, 'decreasing');
    assert.deepEqual(res, [390, 60], 'result');
  });

  it('should get value', () => {
    const res = func(60, 30, 'decreasing');
    assert.deepEqual(res, [60, 30], 'result');
  });

  it('should get value', () => {
    const res = func(30, 240, 'decreasing');
    assert.deepEqual(res, [390, 240], 'result');
  });

  it('should get value', () => {
    const res = func(240, 30, 'decreasing');
    assert.deepEqual(res, [240, 30], 'result');
  });
});

describe('resolve length in pixels', () => {
  const func = util.resolveLengthInPixels;

  it('should get NaN', () => {
    const res = func();
    assert.deepEqual(res, Number.NaN, 'result');
  });

  it('should get NaN', () => {
    const res = func('foo');
    assert.deepEqual(res, Number.NaN, 'result');
  });

  it('should get number', () => {
    const res = func('medium', null, {
      dimension: {
        rem: 16
      }
    });
    assert.deepEqual(res, 16, 'result');
  });

  it('should get number', () => {
    const res = func('smaller', null, {
      dimension: {
        em: 12
      }
    });
    assert.deepEqual(res, 10, 'result');
  });

  it('should get NaN', () => {
    const res = func(3);
    assert.deepEqual(res, Number.NaN, 'result');
  });

  it('should get NaN', () => {
    const res = func(3, 'foo');
    assert.deepEqual(res, Number.NaN, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'in', {
      dimension: {
        in: 96
      }
    });
    assert.deepEqual(res, 288, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'in', {
      dimension: {
        callback: unit => {
          if (unit === 'in') {
            return 96;
          }
        }
      }
    });
    assert.deepEqual(res, 288, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'rem', {
      dimension: {
        rem: 16
      }
    });
    assert.deepEqual(res, 48, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'in', {
      dimension: {
        rem: 16
      }
    });
    assert.deepEqual(res, 288, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'rex', {
      dimension: {
        rem: 16
      }
    });
    assert.deepEqual(res, 24, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'em', {
      dimension: {
        em: 12
      }
    });
    assert.deepEqual(res, 36, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'ex', {
      dimension: {
        em: 12
      }
    });
    assert.deepEqual(res, 18, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'vh', {
      dimension: {
        vh: 576 / 100
      }
    });
    assert.deepEqual(res, 17.28, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'vw', {
      dimension: {
        vw: 1024 / 100
      }
    });
    assert.deepEqual(res, 30.72, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'vb', {
      dimension: {
        vh: 576 / 100,
        vw: 1024 / 100
      }
    });
    assert.deepEqual(res, 17.28, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'vi', {
      dimension: {
        vh: 576 / 100,
        vw: 1024 / 100
      }
    });
    assert.deepEqual(res, 30.72, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'vmax', {
      dimension: {
        vh: 576 / 100,
        vw: 1024 / 100
      }
    });
    assert.deepEqual(res, 30.72, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'vmax', {
      dimension: {
        vw: 576 / 100,
        vh: 1024 / 100
      }
    });
    assert.deepEqual(res, 30.72, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'vmin', {
      dimension: {
        vh: 576 / 100,
        vw: 1024 / 100
      }
    });
    assert.deepEqual(res, 17.28, 'result');
  });

  it('should get number', () => {
    const res = func(3, 'vmin', {
      dimension: {
        vw: 576 / 100,
        vh: 1024 / 100
      }
    });
    assert.deepEqual(res, 17.28, 'result');
  });

  it('should get NaN when callback returns undefined', () => {
    const res = func(3, 'in', {
      dimension: {
        callback: () => {
          // returns nothing (undefined)
        }
      }
    });
    assert.deepEqual(res, Number.NaN, 'result');
  });

  it('should get number from dimension object by property name', () => {
    const res = func(2, 'cm', {
      dimension: {
        cm: 10
      }
    });
    assert.deepEqual(res, 20, 'result');
  });
});
