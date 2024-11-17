/**
 * api.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'mocha';

/* test */
import * as api from '../src/js/api.js';

describe('resolve CSS color', () => {
  const func = api.resolve;

  beforeEach(() => {
    api.cachedResults.clear();
  });
  afterEach(() => {
    api.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get empty string', () => {
    const res = func('foo');
    assert.strictEqual(res, '', 'result');
    const res2 = func('foo');
    assert.strictEqual(res2, '', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)'
    });
    assert.strictEqual(res, 'rgb(128, 0, 128)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)'
    });
    assert.strictEqual(res2, 'rgb(128, 0, 128)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color(srgb 0 0.5 0 / 0.5)'
    });
    assert.strictEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color(srgb 0 0.5 0 / 0.5)'
    });
    assert.strictEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'green'
    });
    assert.strictEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'green'
    });
    assert.strictEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor');
    assert.strictEqual(res, 'rgba(0, 0, 0, 0)', 'result');
    const res2 = func('currentColor');
    assert.strictEqual(res2, 'rgba(0, 0, 0, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('transparent');
    assert.strictEqual(res, 'rgba(0, 0, 0, 0)', 'result');
    const res2 = func('transparent');
    assert.strictEqual(res2, 'rgba(0, 0, 0, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)');
    assert.strictEqual(res, 'rgb(128, 0, 128)', 'result');
    const res2 = func('color-mix(in srgb, blue, red)');
    assert.strictEqual(res2, 'rgb(128, 0, 128)', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    assert.strictEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func('color(srgb 0 0.5 0)');
    assert.strictEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('green');
    assert.strictEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func('green');
    assert.strictEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func(' GREEN ');
    assert.strictEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func(' GREEN ');
    assert.strictEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)', {
      key: 'foo'
    });
    assert.deepEqual(res, ['foo', 'rgb(128, 0, 128)'], 'result');
    const res2 = func('color-mix(in srgb, blue, red)', {
      key: 'foo'
    });
    assert.deepEqual(res2, ['foo', 'rgb(128, 0, 128)'], 'result');
  });

  it('should get value', () => {
    const res = func('foo', {
      format: 'array'
    });
    assert.deepEqual(res, [
      undefined,
      undefined,
      undefined,
      undefined
    ], 'result');
    const res2 = func('foo', {
      format: 'array'
    });
    assert.deepEqual(res2, [
      undefined,
      undefined,
      undefined,
      undefined
    ], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)', {
      format: 'array'
    });
    assert.deepEqual(res, [127.5, 0, 127.5, 1], 'result');
    const res2 = func('color-mix(in srgb, blue, red)', {
      format: 'array'
    });
    assert.deepEqual(res2, [127.5, 0, 127.5, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)', {
      format: 'array',
      key: 'foo'
    });
    assert.deepEqual(res, ['foo', [127.5, 0, 127.5, 1]], 'result');
    const res2 = func('color-mix(in srgb, blue, red)', {
      format: 'array',
      key: 'foo'
    });
    assert.deepEqual(res2, ['foo', [127.5, 0, 127.5, 1]], 'result');
  });

  it('should get null', () => {
    const res = func('transparent', {
      format: 'hex'
    });
    assert.deepEqual(res, null, 'result');
    const res2 = func('transparent', {
      format: 'hex'
    });
    assert.deepEqual(res2, null, 'result');
  });

  it('should get null', () => {
    const res = func('foo', {
      format: 'hex'
    });
    assert.deepEqual(res, null, 'result');
    const res2 = func('foo', {
      format: 'hex'
    });
    assert.deepEqual(res2, null, 'result');
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hex'
    });
    assert.strictEqual(res, '#008000', 'result');
    const res2 = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hex'
    });
    assert.strictEqual(res2, '#008000', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'hex'
    });
    assert.strictEqual(res, '#000000', 'result');
    const res2 = func('currentColor', {
      format: 'hex'
    });
    assert.strictEqual(res2, '#000000', 'result');
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0%)', {
      format: 'hex',
      key: 'foo'
    });
    assert.deepEqual(res, ['foo', '#008000'], 'result');
    const res2 = func('rgba(0% 50% 0%)', {
      format: 'hex',
      key: 'foo'
    });
    assert.deepEqual(res2, ['foo', '#008000'], 'result');
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'hexAlpha'
    });
    assert.strictEqual(res, '#00000000', 'result');
    const res2 = func('transparent', {
      format: 'hexAlpha'
    });
    assert.strictEqual(res2, '#00000000', 'result');
  });

  it('should get null', () => {
    const res = func('foo', {
      format: 'hexAlpha'
    });
    assert.deepEqual(res, null, 'result');
    const res2 = func('foo', {
      format: 'hexAlpha'
    });
    assert.deepEqual(res2, null, 'result');
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha'
    });
    assert.strictEqual(res, '#00800080', 'result');
    const res2 = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha'
    });
    assert.strictEqual(res2, '#00800080', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'hexAlpha'
    });
    assert.strictEqual(res, '#00000000', 'result');
    const res2 = func('currentColor', {
      format: 'hexAlpha'
    });
    assert.strictEqual(res2, '#00000000', 'result');
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha',
      key: 'foo'
    });
    assert.deepEqual(res, ['foo', '#00800080'], 'result');
    const res2 = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha',
      key: 'foo'
    });
    assert.deepEqual(res2, ['foo', '#00800080'], 'result');
  });
});

describe('parse CSS color', () => {
  const func = api.parse;

  beforeEach(() => {
    api.cachedResults.clear();
  });
  afterEach(() => {
    api.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should throw', () => {
    assert.throws(() => func('color-mix(in srgb, red, blue)'), Error,
      'color-mix() is not supported.');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0.077, 0.15, 0.026, 1], 'result');

    const res2 = func('color(srgb 0 0.5 0)');
    res2[0] = parseFloat(res2[0].toFixed(3));
    res2[1] = parseFloat(res2[1].toFixed(2));
    res2[2] = parseFloat(res2[2].toFixed(3));
    assert.deepEqual(res, [0.077, 0.15, 0.026, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0.077, 0.15, 0.026, 1], 'result');

    const res2 = func('green');
    res2[0] = parseFloat(res2[0].toFixed(3));
    res2[1] = parseFloat(res2[1].toFixed(2));
    res2[2] = parseFloat(res2[2].toFixed(3));
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

    const res2 = func('lab(46.28% -47.57 48.58)', {
      d50: true
    });
    res2[0] = parseFloat(res2[0].toFixed(2));
    res2[1] = parseFloat(res2[1].toFixed(2));
    res2[2] = parseFloat(res2[2].toFixed(2));
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
