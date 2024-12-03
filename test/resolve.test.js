/**
 * api.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'mocha';

/* test */
import * as api from '../src/js/resolve.js';
import { parseColorValue } from '../src/js/color.js';

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

  it('should get value', () => {
    const res = func('foo');
    assert.strictEqual(res, 'rgba(0, 0, 0, 0)', 'result');
    const res2 = func('foo');
    assert.strictEqual(res2, 'rgba(0, 0, 0, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(calc(64 * 2) calc(100% / 2) calc(128 + 127.5) / calc(2 / 3))');
    assert.strictEqual(res, 'rgba(128, 128, 255, 0.667)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in lab, blue, red)'
    });
    assert.strictEqual(res, 'lab(41.9294 74.5461 -21.0694)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in lab, blue, red)'
    });
    assert.strictEqual(res2, 'lab(41.9294 74.5461 -21.0694)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'currentcolor', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in lab, rgb(0 0 255 / .5), color(srgb 1 0 0 / .5))'
    });
    assert.strictEqual(res, 'lab(41.9294 74.5461 -21.0694 / 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in lab, rgb(0 0 255 / .5), color(srgb 1 0 0 / .5))'
    });
    assert.strictEqual(res2, 'lab(41.9294 74.5461 -21.0694 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)'
    });
    assert.strictEqual(res, 'color(srgb 0.5 0 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)'
    });
    assert.strictEqual(res2, 'color(srgb 0.5 0 0.5)', 'result');
  });

  it('should get empty string', () => {
    const res = func('foo', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, '', 'result');
  });

  it('should get empty string', () => {
    const res = func('foo', {
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgba(0, 0, 0, 0)', 'result');
    const res2 = func('foo', {
      format: 'rgb'
    });
    assert.strictEqual(res2, 'rgba(0, 0, 0, 0)', 'result');
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
    const res = func('foo', {
      format: 'hexAlpha'
    });
    assert.strictEqual(res, '#00000000', 'result');
    const res2 = func('foo', {
      format: 'hexAlpha'
    });
    assert.strictEqual(res2, '#00000000', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'purple',
      format: 'computedValue'
    });
    assert.strictEqual(res, 'rgb(128, 0, 128)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'purple'
    });
    assert.strictEqual(res2, 'rgb(128, 0, 128)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'computedValue'
    });
    assert.strictEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'computedValue'
    });
    assert.strictEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58)',
      format: 'computedValue'
    });
    assert.strictEqual(res, 'lab(46.28 -47.57 48.58)', 'result');
    const res2 = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58)',
      format: 'computedValue'
    });
    assert.strictEqual(res2, 'lab(46.28 -47.57 48.58)', 'result');
  });

  it('should get value', () => {
    const res = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58 / .5)',
      format: 'computedValue'
    });
    assert.strictEqual(res, 'lab(46.28 -47.57 48.58 / 0.5)', 'result');
    const res2 = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58 / .5)',
      format: 'computedValue'
    });
    assert.strictEqual(res2, 'lab(46.28 -47.57 48.58 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'rgb'
    });
    assert.strictEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, rgba(0 255 0 / .5), rgba(255 0 0 / .5))'
    });
    assert.strictEqual(res, 'color(srgb 0.5 0.5 0 / 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in srgb, rgba(0 255 0 / .5), rgba(255 0 0 / .5))'
    });
    assert.strictEqual(res2, 'color(srgb 0.5 0.5 0 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)',
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgb(128, 0, 128)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)',
      format: 'rgb'
    });
    assert.strictEqual(res2, 'rgb(128, 0, 128)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0 / 0.5)'
    });
    assert.strictEqual(res, 'color(srgb 0 0.5 1 / 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0 / 0.5)'
    });
    assert.strictEqual(res2, 'color(srgb 0 0.5 1 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0 / 1)'
    });
    assert.strictEqual(res, 'color(srgb 0 0.5 1)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0)'
    });
    assert.strictEqual(res2, 'color(srgb 0 0.5 1)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color(srgb 0 0.5 0 / 0.5)',
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color(srgb 0 0.5 0 / 0.5)',
      format: 'rgb'
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
    const res = func('transparent', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'transparent', 'result');
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgba(0, 0, 0, 0)', 'result');
    const res2 = func('transparent', {
      format: 'rgb'
    });
    assert.strictEqual(res2, 'rgba(0, 0, 0, 0)', 'result');
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

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)');
    assert.strictEqual(res, 'color(srgb 0.5 0 0.5)', 'result');
    const res2 = func('color-mix(in srgb, blue, red)');
    assert.strictEqual(res2, 'color(srgb 0.5 0 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, rgb(255, 0, 0))', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'color-mix(in srgb, blue, rgb(255, 0, 0))',
      'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, #0000ff, rgb(255 0 0))', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res,
      'color-mix(in srgb, rgb(0, 0, 255), rgb(255, 0, 0))', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)', {
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgb(128, 0, 128)', 'result');
    const res2 = func('color-mix(in srgb, blue, red)', {
      format: 'rgb'
    });
    assert.strictEqual(res2, 'rgb(128, 0, 128)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgba(0 0 255 / .5), currentcolor)', {
      currentColor: 'rgba(255 0 0 / .5)',
      key: 'foo'
    });
    assert.deepEqual(res, ['foo', 'color(srgb 0.5 0 0.5 / 0.5)'], 'result');
    const res2 = func('color-mix(in srgb, rgba(0 0 255 / .5), currentcolor)', {
      currentColor: 'rgba(255 0 0 / .5)',
      key: 'foo'
    });
    assert.deepEqual(res2, ['foo', 'color(srgb 0.5 0 0.5 / 0.5)'], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, currentcolor)', {
      currentColor: 'red',
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgb(128, 0, 128)', 'result');
    const res2 = func('color-mix(in srgb, blue, currentColor)', {
      currentColor: 'red',
      format: 'rgb'
    });
    assert.strictEqual(res2, 'rgb(128, 0, 128)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, transparent, currentcolor)', {
      currentColor: 'red'
    });
    assert.strictEqual(res, 'color(srgb 1 0 0 / 0.5)', 'result');
    const res2 = func('color-mix(in srgb, transparent, currentColor)', {
      currentColor: 'red'
    });
    assert.strictEqual(res2, 'color(srgb 1 0 0 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, transparent, currentcolor)', {
      currentColor: 'red',
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgba(255, 0, 0, 0.5)', 'result');
    const res2 = func('color-mix(in srgb, transparent, currentColor)', {
      currentColor: 'red',
      format: 'rgb'
    });
    assert.strictEqual(res2, 'rgba(255, 0, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, transparent, red)', {
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgba(255, 0, 0, 0.5)', 'result');
    const res2 = func('color-mix(in srgb, transparent, red)', {
      format: 'rgb'
    });
    assert.strictEqual(res2, 'rgba(255, 0, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, transparent, red)');
    assert.strictEqual(res, 'color(srgb 1 0 0 / 0.5)', 'result');
    const res2 = func('color-mix(in srgb, transparent, red)');
    assert.strictEqual(res2, 'color(srgb 1 0 0 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.0 .5 1.0 / 1)');
    assert.strictEqual(res, 'color(srgb 0 0.5 1)', 'result');
    const res2 = func('color(srgb 0.0 .5 1.0 / 1)');
    assert.strictEqual(res2, 'color(srgb 0 0.5 1)', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.0 .5 1.0 / 1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'color(srgb 0 0.5 1)', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.0 .5 1.0 / .5)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'color(srgb 0 0.5 1 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.0 .5 1.0 / none)');
    assert.strictEqual(res, 'color(srgb 0 0.5 1 / none)', 'result');
    const res2 = func('color(srgb 0.0 .5 1.0 / none)');
    assert.strictEqual(res2, 'color(srgb 0 0.5 1 / none)', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0 / .5)', {
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('color(srgb 0 0.5 0 / .5)', {
      format: 'rgb'
    });
    assert.strictEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0)');
    assert.strictEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func('rgb(0 127.5 0)');
    assert.strictEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0)', {
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func('rgb(0 127.5 0)', {
      format: 'rgb'
    });
    assert.strictEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0 / .5)');
    assert.strictEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('rgb(0 127.5 0 / .5)');
    assert.strictEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0 / .5)', {
      format: 'rgb'
    });
    assert.strictEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('rgb(0 127.5 0 / .5)', {
      format: 'rgb'
    });
    assert.strictEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)', {
      format: 'computedValue'
    });
    assert.strictEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func('hwb(120 0% 50%)', {
      format: 'computedValue'
    });
    assert.strictEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50% / .5)', {
      format: 'computedValue'
    });
    assert.strictEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('hwb(120 0% 50% / .5)', {
      format: 'computedValue'
    });
    assert.strictEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)', {
      format: 'computedValue'
    });
    assert.strictEqual(res, 'lab(46.28 -47.57 48.58)', 'result');
    const res2 = func('lab(46.28% -47.57 48.58)', {
      format: 'computedValue'
    });
    assert.strictEqual(res2, 'lab(46.28 -47.57 48.58)', 'result');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58 / .5)', {
      format: 'computedValue'
    });
    assert.strictEqual(res, 'lab(46.28 -47.57 48.58 / 0.5)', 'result');
    const res2 = func('lab(46.28% -47.57 48.58 / .5)', {
      format: 'computedValue'
    });
    assert.strictEqual(res2, 'lab(46.28 -47.57 48.58 / 0.5)', 'result');
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
    assert.deepEqual(res, ['foo', 'color(srgb 0.5 0 0.5)'], 'result');
    const res2 = func('color-mix(in srgb, blue, red)', {
      key: 'foo'
    });
    assert.deepEqual(res2, ['foo', 'color(srgb 0.5 0 0.5)'], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)', {
      format: 'rgb',
      key: 'foo'
    });
    assert.deepEqual(res, ['foo', 'rgb(128, 0, 128)'], 'result');
    const res2 = func('color-mix(in srgb, blue, red)', {
      format: 'rgb',
      key: 'foo'
    });
    assert.deepEqual(res2, ['foo', 'rgb(128, 0, 128)'], 'result');
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
    assert.deepEqual(res, null, 'result');
    const res2 = func('currentColor', {
      format: 'hex'
    });
    assert.deepEqual(res2, null, 'result');
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
    assert.strictEqual(res, '#00000000', 'result');
    const res2 = func('foo', {
      format: 'hexAlpha'
    });
    assert.strictEqual(res2, '#00000000', 'result');
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
    assert.deepEqual(res, null, 'result');
    const res2 = func('currentColor', {
      format: 'hexAlpha'
    });
    assert.deepEqual(res2, null, 'result');
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

  it('should get value', () => {
    const res = func('currentcolor', {
      currentColor: 'color-mix(in lab, rgb(255 0 0), rgb(0 0 255))'
    });
    const res2 = parseColorValue(res, {
      format: 'computedValue'
    });
    assert.deepEqual(res2, ['lab', 41.9294, 74.5461, -21.0694, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, color-mix(in srgb, currentColor, blue), color-mix(in srgb, transparent, #008000))', {
      currentColor: 'rgb(255 0 0)'
    });
    assert.strictEqual(res, 'color(srgb 0.334641 0.16732 0.334641 / 0.75)',
      'result');
    const res2 = func('color-mix(in srgb, color-mix(in srgb, currentColor, blue), color-mix(in srgb, transparent, #008000))', {
      currentColor: 'rgb(255 0 0)'
    });
    assert.strictEqual(res2, 'color(srgb 0.334641 0.16732 0.334641 / 0.75)',
      'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, color-mix(in srgb, currentColor, blue), color-mix(in srgb, transparent, #008000))', {
      currentColor: 'rgb(255 0 0)',
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'color-mix(in srgb, color-mix(in srgb, currentcolor, blue), color-mix(in srgb, transparent, rgb(0, 128, 0)))',
      'result');
    const res2 = func('color-mix(in srgb, color-mix(in srgb, currentColor, blue), color-mix(in srgb, transparent, #008000))', {
      currentColor: 'rgb(255 0 0)',
      format: 'specifiedValue'
    });
    assert.strictEqual(res2, 'color-mix(in srgb, color-mix(in srgb, currentcolor, blue), color-mix(in srgb, transparent, rgb(0, 128, 0)))',
      'result');
  });
});
