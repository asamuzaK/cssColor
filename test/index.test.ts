/**
 * index.test
 */

/* api */
import { assert, describe, it } from 'vitest';

/* test */
import * as api from '../src/index.js';

describe('resolve CSS color', () => {
  const func = api.resolve;

  it('should get value', () => {
    const res = func('green');
    assert.strictEqual(res, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'color-mix(in oklab, rgb(255 0 0), color(srgb 0 0.5 0 / 0.5))'
    );
    assert.strictEqual(res, 'oklab(0.5914 0.103273 0.119688 / 0.75)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)'
    });
    assert.strictEqual(res, 'color(srgb 0.5 0 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha'
    });
    assert.strictEqual(res, '#00800080', 'result');
  });

  it('should get value', () => {
    const res = func('hsl(calc(var(--base-hue) * 3) 100% 50% / .5)', {
      customProperty: { '--base-hue': '210deg' }
    });
    assert.strictEqual(res, 'rgba(128, 0, 255, 0.5)', 'result');
  });

  it('should resolve 3-level nested color-mix', () => {
    const res = func(
      'color-mix(in srgb, color-mix(in srgb, color-mix(in srgb, rgb(255 0 0), rgb(0 0 255)), rgb(0 255 0)), rgb(255 255 0))'
    );
    assert.strictEqual(res, 'color(srgb 0.625 0.75 0.125)', 'result');
  });

  it('should resolve 4-level nested color-mix with hex format option', () => {
    const res = func(
      'color-mix(in srgb, color-mix(in srgb, color-mix(in srgb, color-mix(in srgb, #000, #fff), #000), #fff), #000)',
      { format: 'hex' }
    );
    assert.strictEqual(res, '#505050', 'result');
  });
});

describe('resolve CSS gradient', () => {
  const func = api.resolveGradient;

  it('should get value', () => {
    const res = func('linear-gradient(red, blue)');
    assert.strictEqual(
      res,
      'linear-gradient(rgb(255, 0, 0), rgb(0, 0, 255))',
      'result'
    );
  });
});

describe('convert', () => {
  const { convert } = api;

  it('should get value', () => {
    const hex = convert.colorToHex('lab(46.2775% -47.5621 48.5837)');
    assert.strictEqual(hex, '#008000', 'result');
  });
});

describe('utils', () => {
  const { utils } = api;

  it('should be true', () => {
    assert.strictEqual(typeof utils.cssCalc, 'function', 'result');
  });

  it('should be true', () => {
    assert.strictEqual(typeof utils.isColor, 'function', 'result');
  });
});
