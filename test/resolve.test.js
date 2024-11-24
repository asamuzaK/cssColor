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
    assert.deepEqual(res, 'rgba(0, 0, 0, 0)', 'result');
    const res2 = func('foo');
    assert.deepEqual(res2, 'rgba(0, 0, 0, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(calc(64 * 2) calc(100% / 2) calc(128 + 127.5) / calc(2 / 3))');
    assert.deepEqual(res, 'rgba(128, 128, 255, 0.667)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in lab, blue, red)'
    });
    assert.deepEqual(res, 'lab(41.9294 74.5461 -21.0694)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in lab, blue, red)'
    });
    assert.deepEqual(res2, 'lab(41.9294 74.5461 -21.0694)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in lab, rgb(0 0 255 / .5), color(srgb 1 0 0 / .5))'
    });
    assert.deepEqual(res, 'lab(41.9294 74.5461 -21.0694 / 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in lab, rgb(0 0 255 / .5), color(srgb 1 0 0 / .5))'
    });
    assert.deepEqual(res2, 'lab(41.9294 74.5461 -21.0694 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)'
    });
    assert.deepEqual(res, 'color(srgb 0.5 0 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)'
    });
    assert.deepEqual(res2, 'color(srgb 0.5 0 0.5)', 'result');
  });

  it('should get empty string', () => {
    const res = func('foo', {
      format: 'rgb'
    });
    assert.deepEqual(res, 'rgba(0, 0, 0, 0)', 'result');
    const res2 = func('foo', {
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgba(0, 0, 0, 0)', 'result');
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
    assert.deepEqual(res, '#00000000', 'result');
    const res2 = func('foo', {
      format: 'hexAlpha'
    });
    assert.deepEqual(res2, '#00000000', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'purple',
      format: 'spec'
    });
    assert.deepEqual(res, 'rgb(128, 0, 128)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'purple'
    });
    assert.deepEqual(res2, 'rgb(128, 0, 128)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'spec'
    });
    assert.deepEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'spec'
    });
    assert.deepEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58)',
      format: 'spec'
    });
    assert.deepEqual(res, 'lab(46.28 -47.57 48.58)', 'result');
    const res2 = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58)',
      format: 'spec'
    });
    assert.deepEqual(res2, 'lab(46.28 -47.57 48.58)', 'result');
  });

  it('should get value', () => {
    const res = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58 / .5)',
      format: 'spec'
    });
    assert.deepEqual(res, 'lab(46.28 -47.57 48.58 / 0.5)', 'result');
    const res2 = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58 / .5)',
      format: 'spec'
    });
    assert.deepEqual(res2, 'lab(46.28 -47.57 48.58 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'rgb'
    });
    assert.deepEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, rgba(0 255 0 / .5), rgba(255 0 0 / .5))'
    });
    assert.deepEqual(res, 'color(srgb 0.5 0.5 0 / 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in srgb, rgba(0 255 0 / .5), rgba(255 0 0 / .5))'
    });
    assert.deepEqual(res2, 'color(srgb 0.5 0.5 0 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)',
      format: 'rgb'
    });
    assert.deepEqual(res, 'rgb(128, 0, 128)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)',
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgb(128, 0, 128)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0 / 0.5)'
    });
    assert.deepEqual(res, 'color(srgb 0 0.5 1 / 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0 / 0.5)'
    });
    assert.deepEqual(res2, 'color(srgb 0 0.5 1 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0 / 1)'
    });
    assert.deepEqual(res, 'color(srgb 0 0.5 1)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0)'
    });
    assert.deepEqual(res2, 'color(srgb 0 0.5 1)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color(srgb 0 0.5 0 / 0.5)',
      format: 'rgb'
    });
    assert.deepEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'color(srgb 0 0.5 0 / 0.5)',
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'green'
    });
    assert.deepEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func('currentColor', {
      currentColor: 'green'
    });
    assert.deepEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor');
    assert.deepEqual(res, 'rgba(0, 0, 0, 0)', 'result');
    const res2 = func('currentColor');
    assert.deepEqual(res2, 'rgba(0, 0, 0, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('transparent');
    assert.deepEqual(res, 'rgba(0, 0, 0, 0)', 'result');
    const res2 = func('transparent');
    assert.deepEqual(res2, 'rgba(0, 0, 0, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'rgb'
    });
    assert.deepEqual(res, 'rgba(0, 0, 0, 0)', 'result');
    const res2 = func('transparent', {
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgba(0, 0, 0, 0)', 'result');
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
    assert.deepEqual(res, '#00000000', 'result');
    const res2 = func('transparent', {
      format: 'hexAlpha'
    });
    assert.deepEqual(res2, '#00000000', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)');
    assert.deepEqual(res, 'color(srgb 0.5 0 0.5)', 'result');
    const res2 = func('color-mix(in srgb, blue, red)');
    assert.deepEqual(res2, 'color(srgb 0.5 0 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)', {
      format: 'rgb'
    });
    assert.deepEqual(res, 'rgb(128, 0, 128)', 'result');
    const res2 = func('color-mix(in srgb, blue, red)', {
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgb(128, 0, 128)', 'result');
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
    assert.deepEqual(res, 'rgb(128, 0, 128)', 'result');
    const res2 = func('color-mix(in srgb, blue, currentColor)', {
      currentColor: 'red',
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgb(128, 0, 128)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, transparent, currentcolor)', {
      currentColor: 'red'
    });
    assert.deepEqual(res, 'color(srgb 1 0 0 / 0.5)', 'result');
    const res2 = func('color-mix(in srgb, transparent, currentColor)', {
      currentColor: 'red'
    });
    assert.deepEqual(res2, 'color(srgb 1 0 0 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, transparent, currentcolor)', {
      currentColor: 'red',
      format: 'rgb'
    });
    assert.deepEqual(res, 'rgba(255, 0, 0, 0.5)', 'result');
    const res2 = func('color-mix(in srgb, transparent, currentColor)', {
      currentColor: 'red',
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgba(255, 0, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, transparent, red)', {
      format: 'rgb'
    });
    assert.deepEqual(res, 'rgba(255, 0, 0, 0.5)', 'result');
    const res2 = func('color-mix(in srgb, transparent, red)', {
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgba(255, 0, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, transparent, red)');
    assert.deepEqual(res, 'color(srgb 1 0 0 / 0.5)', 'result');
    const res2 = func('color-mix(in srgb, transparent, red)');
    assert.deepEqual(res2, 'color(srgb 1 0 0 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.0 .5 1.0 / 1)');
    assert.deepEqual(res, 'color(srgb 0 0.5 1)', 'result');
    const res2 = func('color(srgb 0.0 .5 1.0 / 1)');
    assert.deepEqual(res2, 'color(srgb 0 0.5 1)', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.0 .5 1.0 / none)');
    assert.deepEqual(res, 'color(srgb 0 0.5 1 / none)', 'result');
    const res2 = func('color(srgb 0.0 .5 1.0 / none)');
    assert.deepEqual(res2, 'color(srgb 0 0.5 1 / none)', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0 / .5)', {
      format: 'rgb'
    });
    assert.deepEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('color(srgb 0 0.5 0 / .5)', {
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0)');
    assert.deepEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func('rgb(0 127.5 0)');
    assert.deepEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0)', {
      format: 'rgb'
    });
    assert.deepEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func('rgb(0 127.5 0)', {
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0 / .5)');
    assert.deepEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('rgb(0 127.5 0 / .5)');
    assert.deepEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0 / .5)', {
      format: 'rgb'
    });
    assert.deepEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('rgb(0 127.5 0 / .5)', {
      format: 'rgb'
    });
    assert.deepEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)', {
      format: 'spec'
    });
    assert.deepEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func('hwb(120 0% 50%)', {
      format: 'spec'
    });
    assert.deepEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50% / .5)', {
      format: 'spec'
    });
    assert.deepEqual(res, 'rgba(0, 128, 0, 0.5)', 'result');
    const res2 = func('hwb(120 0% 50% / .5)', {
      format: 'spec'
    });
    assert.deepEqual(res2, 'rgba(0, 128, 0, 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)', {
      format: 'spec'
    });
    assert.deepEqual(res, 'lab(46.28 -47.57 48.58)', 'result');
    const res2 = func('lab(46.28% -47.57 48.58)', {
      format: 'spec'
    });
    assert.deepEqual(res2, 'lab(46.28 -47.57 48.58)', 'result');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58 / .5)', {
      format: 'spec'
    });
    assert.deepEqual(res, 'lab(46.28 -47.57 48.58 / 0.5)', 'result');
    const res2 = func('lab(46.28% -47.57 48.58 / .5)', {
      format: 'spec'
    });
    assert.deepEqual(res2, 'lab(46.28 -47.57 48.58 / 0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('green');
    assert.deepEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func('green');
    assert.deepEqual(res2, 'rgb(0, 128, 0)', 'result');
  });

  it('should get value', () => {
    const res = func(' GREEN ');
    assert.deepEqual(res, 'rgb(0, 128, 0)', 'result');
    const res2 = func(' GREEN ');
    assert.deepEqual(res2, 'rgb(0, 128, 0)', 'result');
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

  it('should get value', () => {
    const res = func('foo', {
      format: 'array'
    });
    assert.deepEqual(res, [0, 0, 0, 0], 'result');
    const res2 = func('foo', {
      format: 'array'
    });
    assert.deepEqual(res2, [0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)', {
      format: 'array'
    });
    assert.deepEqual(res, [128, 0, 128, 1], 'result');
    const res2 = func('color-mix(in srgb, blue, red)', {
      format: 'array'
    });
    assert.deepEqual(res2, [128, 0, 128, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)', {
      format: 'array',
      key: 'foo'
    });
    assert.deepEqual(res, ['foo', [128, 0, 128, 1]], 'result');
    const res2 = func('color-mix(in srgb, blue, red)', {
      format: 'array',
      key: 'foo'
    });
    assert.deepEqual(res2, ['foo', [128, 0, 128, 1]], 'result');
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
    assert.deepEqual(res, '#008000', 'result');
    const res2 = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hex'
    });
    assert.deepEqual(res2, '#008000', 'result');
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
    assert.deepEqual(res, '#00000000', 'result');
    const res2 = func('transparent', {
      format: 'hexAlpha'
    });
    assert.deepEqual(res2, '#00000000', 'result');
  });

  it('should get null', () => {
    const res = func('foo', {
      format: 'hexAlpha'
    });
    assert.deepEqual(res, '#00000000', 'result');
    const res2 = func('foo', {
      format: 'hexAlpha'
    });
    assert.deepEqual(res2, '#00000000', 'result');
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha'
    });
    assert.deepEqual(res, '#00800080', 'result');
    const res2 = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha'
    });
    assert.deepEqual(res2, '#00800080', 'result');
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
      format: 'spec'
    });
    assert.deepEqual(res2, ['lab', 41.9294, 74.5461, -21.0694, 1], 'result');
  });

  it('should get value', () => {
    const res = func('currentcolor', {
      currentColor: 'color-mix(in lab, rgb(255 0 0 / .5), rgb(0 0 255 / .5))'
    });
    const res2 = parseColorValue(res, {
      format: 'spec'
    });
    // lab(41.9294 74.5462 -21.0694 / 0.5)
    assert.deepEqual(res2, ['lab', 41.9294, 74.5461, -21.0694, 0.5], 'result');
  });
});
