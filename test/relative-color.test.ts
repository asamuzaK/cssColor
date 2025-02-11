/**
 * relative-color.test
 */

/* api */
import { tokenize } from '@csstools/css-tokenizer';
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/js/cache';
import * as relColor from '../src/js/relative-color';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('resolve relative color channels', () => {
  const func = relColor.resolveColorChannels;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not an array.');
  });

  it('should throw', () => {
    assert.throws(
      () =>
        func(['foo'], {
          colorSpace: 'lab',
          format: 'specifiedValue'
        }),
      TypeError,
      'foo is not an array.'
    );
  });

  it('should get null object', () => {
    const css = ' r g b / alpha)';
    const tokens = tokenize({ css });
    const res = func(tokens, {
      format: 'specifiedValue'
    });
    assert.strictEqual(res.isNull, true, 'result');
  });

  it('should get null object', () => {
    const css = ' r g b / alpha)';
    const tokens = tokenize({ css });
    const res = func(tokens, {
      colorSpace: 'lab',
      format: 'specifiedValue'
    });
    assert.strictEqual(res.isNull, true, 'result');
  });

  it('should get value', () => {
    const css = ' r calc(g * sign(2px) ) abs(-10))';
    const tokens = tokenize({ css });
    const res = func(tokens, {
      colorSpace: 'rgb',
      format: 'specifiedValue'
    });
    assert.deepEqual(res, ['r', 'calc(1 * g)', 'abs(-10)'], 'result');
  });

  it('should get value', () => {
    const css = ' r calc(g * sign(2em)) 1000%)';
    const tokens = tokenize({ css });
    const res = func(tokens, {
      colorSpace: 'rgb',
      format: 'specifiedValue'
    });
    assert.deepEqual(res, ['r', 'calc(1 * g)', 10], 'result');
  });

  it('should get value', () => {
    const css = ' r calc(g * .5 + g * .5) 10)';
    const tokens = tokenize({ css });
    const res = func(tokens, {
      colorSpace: 'rgb',
      format: 'specifiedValue'
    });
    assert.deepEqual(res, ['r', 'calc((0.5 * g) + (0.5 * g))', 10], 'result');
  });

  it('should get value', () => {
    const css = ' r calc((g * .5) + g * .5) 10)';
    const tokens = tokenize({ css });
    const res = func(tokens, {
      colorSpace: 'rgb',
      format: 'specifiedValue'
    });
    assert.deepEqual(res, ['r', 'calc((0.5 * g) + (0.5 * g))', 10], 'result');
  });

  it('should get value', () => {
    const css = ' r calc(b * 50% - g * .5) 10)';
    const tokens = tokenize({ css });
    const res = func(tokens, {
      colorSpace: 'rgb',
      format: 'specifiedValue'
    });
    assert.deepEqual(res, ['r', 'calc((0.5 * b) - (0.5 * g))', 10], 'result');
  });
});

describe('extract origin color', () => {
  const func = relColor.extractOriginColor;

  it('should get null object', () => {
    const res = func();
    assert.strictEqual(res.isNull, true, 'result');
  });

  it('should get null object', () => {
    const res = func(' ');
    assert.strictEqual(res.isNull, true, 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(from rebeccapurple l a b)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res.isNull, true, 'result');

    const res2 = func('rgb(from rebeccapurple l a b)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res2.isNull, true, 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(from rebeccapurple l a b)', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res.isNull, true, 'result');

    const res2 = func('rgb(from rebeccapurple l a b)', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2.isNull, true, 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(from rgb(from rebeccapurple r g b) l a b)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res.isNull, true, 'result');

    const res2 = func('rgb(from rgb(from rebeccapurple r g b) l a b)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res2.isNull, true, 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(from rgb(from rebeccapurple r g b) l a b)', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res.isNull, true, 'result');

    const res2 = func('rgb(from rgb(from rebeccapurple r g b) l a b)', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2.isNull, true, 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'foo'
    });
    assert.strictEqual(res.isNull, true, 'result');
  });

  it('should get value', () => {
    const res = func('rebeccapurple');
    assert.strictEqual(res, 'rebeccapurple', 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(from currentColor r g b)');
    assert.strictEqual(res.isNull, true, 'result');

    const res2 = func('rgb(from currentColor r g b)');
    assert.strictEqual(res2.isNull, true, 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(from currentColor r g b)', {
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res.isNull, true, 'result');

    const res2 = func('rgb(from currentColor r g b)', {
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2.isNull, true, 'result');
  });

  it('should get value', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'rebeccapurple'
    });
    assert.strictEqual(res, 'rgb(from rebeccapurple r g b)', 'result');

    const res2 = func('rgb(from currentColor r g b)', {
      currentColor: 'rebeccapurple'
    });
    assert.strictEqual(res2, 'rgb(from rebeccapurple r g b)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'rebeccapurple',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res, 'rgb(from rebeccapurple r g b)', 'result');

    const res2 = func('rgb(from currentColor r g b)', {
      currentColor: 'rebeccapurple',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2, 'rgb(from rebeccapurple r g b)', 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'rgb(from foo r g b)'
    });
    assert.strictEqual(res.isNull, true, 'result');

    const res2 = func('rgb(from currentColor r g b)', {
      currentColor: 'rgb(from foo r g b)'
    });
    assert.strictEqual(res2.isNull, true, 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'rgb(from foo r g b)',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res.isNull, true, 'result');

    const res2 = func('rgb(from currentColor r g b)', {
      currentColor: 'rgb(from foo r g b)',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2.isNull, true, 'result');
  });

  it('should get value', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'rgb(from rebeccapurple r g b)'
    });
    assert.strictEqual(
      res,
      'rgb(from color(srgb 0.4 0.2 0.6) r g b)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'rgb( from rebeccapurple r g b )'
    });
    assert.strictEqual(
      res,
      'rgb(from color(srgb 0.4 0.2 0.6) r g b)',
      'result'
    );
  });
});

describe('resolve relative color', () => {
  const func = relColor.resolveRelativeColor;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string.');
  });

  it('should get value', () => {
    assert.throws(
      () => func('var(--foo)'),
      SyntaxError,
      'Unexpected token var( found.'
    );
  });

  it('should get value', () => {
    const res = func('');
    assert.strictEqual(res, '', 'result');
  });

  it('should get value', () => {
    const res = func('foo');
    assert.strictEqual(res, 'foo', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(from var(--foo) r g b)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'rgb(from var(--foo) r g b)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(from rebeccapurple r g b)');
    assert.strictEqual(res, 'color(srgb 0.4 0.2 0.6)', 'result');

    const res2 = func('rgb(from rebeccapurple r g b)');
    assert.strictEqual(res2, 'color(srgb 0.4 0.2 0.6)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(from rebeccapurple r g b)', {
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res, 'color(srgb 0.4 0.2 0.6)', 'result');

    const res2 = func('rgb(from rebeccapurple r g b)', {
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2, 'color(srgb 0.4 0.2 0.6)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'rgb(from rgb(100 110 120 / 0.8) calc(r + 1) calc(g + 1) calc(b + 1) / calc(alpha + 0.01))'
    );
    assert.strictEqual(
      res,
      'color(srgb 0.39608 0.43529 0.47451 / 0.81)',
      'result'
    );

    const res2 = func(
      'rgb(from rgb(100 110 120 / 0.8) calc(r + 1) calc(g + 1) calc(b + 1) / calc(alpha + 0.01))'
    );
    assert.strictEqual(
      res2,
      'color(srgb 0.39608 0.43529 0.47451 / 0.81)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('rgb(from rebeccapurple none none none / none)');
    assert.strictEqual(res, 'color(srgb none none none / none)', 'result');

    const res2 = func('rgb(from rebeccapurple none none none / none)');
    assert.strictEqual(res2, 'color(srgb none none none / none)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(from rgb(none none none / none) r g b / alpha)');
    assert.strictEqual(res, 'color(srgb 0 0 0 / 0)', 'result');

    const res2 = func('rgb(from rgb(none none none / none) r g b / alpha)');
    assert.strictEqual(res2, 'color(srgb 0 0 0 / 0)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'color(srgb 0.4 0.2 0.6)'
    });
    assert.strictEqual(res, 'color(srgb 0.4 0.2 0.6)', 'result');

    const res2 = func('rgb(from currentColor r g b)', {
      currentColor: 'color(srgb 0.4 0.2 0.6)'
    });
    assert.strictEqual(res2, 'color(srgb 0.4 0.2 0.6)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'rgb(from color-mix(in srgb, currentColor, red) r g b / alpha)',
      {
        currentColor: 'rebeccapurple'
      }
    );
    assert.strictEqual(res, 'color(srgb 0.7 0.1 0.3)', 'result');

    const res2 = func(
      'rgb(from color-mix(in srgb, currentColor, red) r g b / alpha)',
      {
        currentColor: 'rebeccapurple'
      }
    );
    assert.strictEqual(res2, 'color(srgb 0.7 0.1 0.3)', 'result');
  });

  it('should get value', () => {
    const res = func('hsl(from rebeccapurple h s l)');
    assert.strictEqual(res, 'color(srgb 0.4 0.2 0.6)', 'result');

    const res2 = func('hsl(from rebeccapurple h s l)');
    assert.strictEqual(res2, 'color(srgb 0.4 0.2 0.6)', 'result');
  });

  it('should get value', () => {
    const res = func('hsl(from rgb(20%, 40%, 60%, 80%) h s l / alpha)');
    assert.strictEqual(res, 'color(srgb 0.2 0.4 0.6 / 0.8)', 'result');
  });

  it('should get value', () => {
    const res = func('hsl(from hsl(none none none / none) h s l / alpha)');
    assert.strictEqual(res, 'color(srgb 0 0 0 / 0)', 'result');
  });

  it('should get value', () => {
    const res = func('hsl(from rebeccapurple none none none / none)');
    assert.strictEqual(res, 'color(srgb 0 0 0 / none)', 'result');
  });

  it('should get value', () => {
    const res = func('lab(from lab(25 20 50) l a b)');
    assert.strictEqual(res, 'lab(25 20 50)', 'result');
  });

  it('should get value', () => {
    const res = func('lab(from lab(25 20 50 / 40%) l a b / alpha)');
    assert.strictEqual(res, 'lab(25 20 50 / 0.4)', 'result');
  });

  it('should get value', () => {
    const res = func('lab(from lab(from lab(25 20 50) l a b) l a b)');
    assert.strictEqual(res, 'lab(25 20 50)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'lab(from lab(50 5 10 / 0.8) calc(l + 1) calc(a + 1) calc(b + 1) / calc(alpha + 0.01))'
    );
    assert.strictEqual(res, 'lab(51 6 11 / 0.81)', 'result');
  });

  it('should get value', () => {
    const res = func('lab(from lab(25 20 50) none none none / none)');
    assert.strictEqual(res, 'lab(none none none / none)', 'result');
  });

  it('should get value', () => {
    const res = func('lab(from lab(none none none / none) l a b / alpha)');
    assert.strictEqual(res, 'lab(0 0 0 / 0)', 'result');
  });

  it('should get value', () => {
    const res = func('lab(from currentColor l a b)', {
      currentColor: 'lab(25 20 50)'
    });
    assert.strictEqual(res, 'lab(25 20 50)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'lab(from color-mix(in lab, currentColor, lab(25 20 50)) l a b / alpha)',
      {
        currentColor: 'lab(25 20 50)'
      }
    );
    assert.strictEqual(res, 'lab(25 20 50)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g b)'
    );
    assert.strictEqual(res, 'color(srgb-linear 0.7 0.5 0.3)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g b)'
    );
    assert.strictEqual(res, 'color(srgb-linear 0.7 0.5 0.3 / 0.4)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'color(from color(srgb-linear 0.7 0.5 0.3 / 0.8) srgb-linear calc(r + 0.01) calc(g + 0.01) calc(b + 0.01) / calc(alpha + 0.01))'
    );
    assert.strictEqual(
      res,
      'color(srgb-linear 0.71 0.51 0.31 / 0.81)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear none none none / none)'
    );
    assert.strictEqual(
      res,
      'color(srgb-linear none none none / none)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'color(from color(srgb-linear none none none / none) srgb-linear r g b / alpha)'
    );
    assert.strictEqual(res, 'color(srgb-linear 0 0 0 / 0)', 'result');
  });

  it('should get value', () => {
    const res = func('color(from currentColor srgb-linear r g b)', {
      currentColor: 'color(srgb-linear 0.7 0.5 0.3)'
    });
    assert.strictEqual(res, 'color(srgb-linear 0.7 0.5 0.3)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'color(from color-mix(in xyz, currentColor, color(srgb-linear 0.7 0.5 0.3)) srgb-linear r g b / alpha)',
      {
        currentColor: 'color(srgb-linear 0.7 0.5 0.3)'
      }
    );
    assert.strictEqual(res, 'color(srgb-linear 0.7 0.5 0.3)', 'result');
  });

  it('should get value', () => {
    const res = func('color(from color(srgb-linear 0.25 0.5 0.75) srgb r g b)');
    assert.strictEqual(res, 'color(srgb 0.5371 0.73536 0.88083)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(from rebeccapurple r g b)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'rgb(from rebeccapurple r g b)', 'result');
  });

  it('should get value', () => {
    const res = func('rgba(from rebeccapurple r g b / alpha)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'rgb(from rebeccapurple r g b / alpha)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'rgba(from rebeccapurple calc(r) calc(g) calc(b) / calc(alpha))',
      {
        format: 'specifiedValue'
      }
    );
    assert.strictEqual(
      res,
      'rgb(from rebeccapurple calc(r) calc(g) calc(b) / calc(alpha))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'rgba(from rgb(from rebeccapurple r g b) calc(r) calc(g) calc(b) / calc(alpha))',
      {
        format: 'specifiedValue'
      }
    );
    assert.strictEqual(
      res,
      'rgb(from rgb(from rebeccapurple r g b) calc(r) calc(g) calc(b) / calc(alpha))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('hsla(from rebeccapurple h s l / alpha)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'hsl(from rebeccapurple h s l / alpha)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(from rgb(20%, 40%, 60%, 80%) r g b / alpha)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(
      res,
      'rgb(from rgba(51, 102, 153, 0.8) r g b / alpha)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('rgb(from rgb(20%, 40%, 60%, 150%) r g b / alpha)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(
      res,
      'rgb(from rgb(51, 102, 153) r g b / alpha)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('rgb(from hsl(120deg 20% 50% / .5) r g b / alpha)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(
      res,
      'rgb(from rgba(102, 153, 102, 0.5) r g b / alpha)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('rgba(from rgb(from rebeccapurple r g b) r g b)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(
      res,
      'rgb(from rgb(from rebeccapurple r g b) r g b)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'rgb(from rgb(from rebeccapurple /* comment */ r g b) r g b)',
      {
        format: 'specifiedValue'
      }
    );
    assert.strictEqual(
      res,
      'rgb(from rgb(from rebeccapurple r g b) r g b)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('rgba(from rebeccapurple r calc(g * 2) 10)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(
      res,
      'rgb(from rebeccapurple r calc(2 * g) 10)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('rgba(from rebeccapurple r calc(g * .5 + g * .5) 10)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(
      res,
      'rgb(from rebeccapurple r calc((0.5 * g) + (0.5 * g)) 10)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('rgba(from rebeccapurple r calc(b * 50% - g * .5) 10)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(
      res,
      'rgb(from rebeccapurple r calc((0.5 * b) - (0.5 * g)) 10)',
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'rgba(from rgba(from rebeccapurple r g b) r calc(g * .5 + g * .5) 10)',
      {
        format: 'specifiedValue'
      }
    );
    assert.strictEqual(
      res,
      'rgb(from rgb(from rebeccapurple r g b) r calc((0.5 * g) + (0.5 * g)) 10)',
      'result'
    );
  });

  it('should get null object', () => {
    const res = func('rgb(from rebeccapurple l a b)');
    assert.strictEqual(res.isNull, true, 'result');

    const res2 = func('rgb(from rebeccapurple l a b)');
    assert.strictEqual(res2.isNull, true, 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(from rebeccapurple l a b)', {
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res.isNull, true, 'result');

    const res2 = func('rgb(from rebeccapurple l a b)', {
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2.isNull, true, 'result');
  });
});
