/**
 * index.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { describe, it } from 'mocha';

/* test */
import * as api from '../src/index.js';

describe('resolve CSS color', () => {
  const func = api.resolve;

  it('should get value', () => {
    const res = func('green');
    assert.strictEqual(res, 'rgb(0, 128, 0)', 'result');
  });

  // FIXME:
  it.skip('should get value', () => {
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
});

describe('convert', () => {
  const { convert } = api;

  it('should get value', () => {
    const xyz = convert.colorToXyz('lab(46.2775% -47.5621 48.5837)');
    const hex = convert.xyzToHex(xyz);
    assert.strictEqual(hex, '#008000', 'result');
  });
});
