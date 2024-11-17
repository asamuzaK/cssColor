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
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)'
    });
    assert.strictEqual(res, 'rgb(128, 0, 128)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)');
    assert.strictEqual(res, 'rgb(128, 0, 128)', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    assert.strictEqual(res, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0% / 0.5)');
    assert.strictEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('green');
    assert.strictEqual(res, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)', {
      key: 'foo'
    });
    assert.deepEqual(res, ['foo', 'rgb(128, 0, 128)'], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)', {
      format: 'array'
    });
    assert.deepEqual(res, [127.5, 0, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha'
    });
    assert.strictEqual(res, '#00800080', 'result');
  });
});

describe('parse CSS color', () => {
  const func = api.parse;

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0.077, 0.15, 0.026, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0.077, 0.15, 0.026, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)', {
      d50: true
    });
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(2));
    assert.deepEqual(res, [0.08, 0.15, 0.02, 1], 'result');
  });
});

describe('convert', () => {
  const { convert, parse } = api;

  it('should get value', () => {
    const xyz = parse('lab(46.2775% -47.5621 48.5837)');
    const hex = convert.xyzToHex(xyz);
    assert.strictEqual(hex, '#008000', 'result');
  });
});
