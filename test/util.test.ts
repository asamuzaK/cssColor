/**
 * util.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/js/cache';
import * as util from '../src/js/util';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
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
    const res = func('foo bar', ',');
    assert.deepEqual(res, ['foo bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo  bar');
    assert.deepEqual(res, ['foo', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo  bar', ',');
    assert.deepEqual(res, ['foo bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo /* comment */ bar');
    assert.deepEqual(res, ['foo', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func('foo /* comment */ , bar', ',');
    assert.deepEqual(res, ['foo', 'bar'], 'result');
  });

  it('should get value', () => {
    const res = func(',', ',');
    assert.deepEqual(res, ['', ''], 'result');
  });

  it('should get value', () => {
    const res = func(
      'linear-gradient(red, blue), radial-gradient(yellow, green)',
      ','
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
      'color-mix(in oklab, green, color-mix(in rgb, red, transparent)',
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

describe('value to JSON string', () => {
  const func = util.valueToJsonString;

  it('should get result', () => {
    const res = func();
    assert.strictEqual(res, '', 'result');
  });

  it('should get result', () => {
    const res = func(null);
    assert.strictEqual(res, 'null', 'result');
  });

  it('should get result', () => {
    const res = func('foo');
    assert.strictEqual(res, '"foo"', 'result');
  });

  it('should get result', () => {
    const res = func({
      foo: 'bar',
      baz: undefined
    });
    assert.strictEqual(res, '{"foo":"bar","baz":null}', 'result');
  });

  it('should get result', () => {
    const res = func({
      foo: 'bar',
      map: new Map([
        ['key1', 1],
        ['key2', true],
        ['key1', 3]
      ]),
      set: new Set([1, 'baz', 3, 2, 3, 'baz'])
    });
    assert.strictEqual(
      res,
      '{"foo":"bar","map":[["key1",3],["key2",true]],"set":[1,"baz",3,2]}',
      'result'
    );
  });

  it('should get result', () => {
    const res = func({
      foo: 'bar',
      func: () => {}
    });
    assert.strictEqual(res, '{"foo":"bar","func":"func"}', 'result');
  });

  it('should get result', () => {
    const res = func(
      {
        foo: 'bar',
        func: () => {}
      },
      true
    );
    assert.strictEqual(res, '{"foo":"bar","func":"()=>{}"}', 'result');
  });

  it('should get result', () => {
    const res = func(
      {
        foo: 'bar',
        func: () => {
          const l = 100;
          for (let i = 0; i < l; i++) {
            i++;
          }
        }
      },
      true
    );
    assert.strictEqual(
      res,
      '{"foo":"bar","func":"()=>{constl=100;"}',
      'result'
    );
  });

  it('should get result', () => {
    const myCallback = () => {};
    const res = func({
      foo: 'bar',
      func: myCallback
    });
    assert.strictEqual(res, '{"foo":"bar","func":"myCallback"}', 'result');
  });

  it('should get result', () => {
    const myCallback = () => {};
    const res = func(
      {
        foo: 'bar',
        func: myCallback
      },
      true
    );
    assert.strictEqual(res, '{"foo":"bar","func":"()=>{}"}', 'result');
  });

  it('should get result', () => {
    const res = func({
      foo: 'bar',
      big: 1n
    });
    assert.strictEqual(res, '{"foo":"bar","big":"1"}', 'result');
  });

  it('should get result', () => {
    const opt = {
      foo: 'bar',
      cssCalc: {
        globals: new Map([
          ['bar', 'baz'],
          ['qux', 1]
        ])
      }
    };
    const res = func(opt);
    assert.strictEqual(opt.cssCalc.globals instanceof Map, true, 'map');
    assert.strictEqual(
      res,
      '{"foo":"bar","cssCalc":{"globals":[["bar","baz"],["qux",1]]}}',
      'result'
    );
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
