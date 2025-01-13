/**
 * api.test.js
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as api from '../src/js/resolve.js';
import { parseColorValue } from '../src/js/color.js';

describe('resolve CSS color', () => {
  const func = api.resolve as Function;

  beforeEach(() => {
    api.cachedResults.clear();
  });
  afterEach(() => {
    api.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string.');
  });

  it('should get value', () => {
    const res = func('foo');
    expect(res).toBe('rgba(0, 0, 0, 0)');
    const res2 = func('foo');
    expect(res2).toBe('rgba(0, 0, 0, 0)');
  });

  it('should get value', () => {
    const res = func('var(--foo)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('var(--foo)');
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--foo)', {
      customProperty: {
        callback: getPropertyValue,
      },
    });
    expect(res).toBe('rgb(0, 0, 255)');

    const res2 = func('var(--foo)', {
      customProperty: {
        callback: getPropertyValue,
      },
    });
    expect(res2).toBe('rgb(0, 0, 255)');
  });

  it('should get null', () => {
    const res = func('var(--foo)', {
      format: 'hex',
    });
    expect(res).toBeNull();
  });

  it('should get null', () => {
    const res = func('var(--foo)', {
      format: 'hexAlpha',
    });
    expect(res).toBeNull();
  });

  it('should get value', () => {
    const res = func('var(--foo)');
    expect(res).toBe('rgba(0, 0, 0, 0)');
  });

  it('should get value', () => {
    const res = func('var(--foo)', {
      customProperty: {
        '--foo': 'red',
      },
    });
    expect(res).toBe('rgb(255, 0, 0)');
  });

  it('should get value', () => {
    const res = func(
      'rgb(calc(64 * 2) calc(100% / 2) calc(128 + 127.5) / calc(2 / 3))',
    );
    expect(res).toBe('rgba(128, 128, 255, 0.667)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in lab, blue, red)',
    });
    expect(res).toBe('lab(41.9294 74.5461 -21.0694)');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in lab, blue, red)',
    });
    expect(res2).toBe('lab(41.9294 74.5461 -21.0694)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'specifiedValue',
    });
    expect(res).toBe('currentcolor');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor:
        'color-mix(in lab, rgb(0 0 255 / .5), color(srgb 1 0 0 / .5))',
    });
    expect(res).toBe('lab(41.9294 74.5461 -21.0694 / 0.5)');
    const res2 = func('currentColor', {
      currentColor:
        'color-mix(in lab, rgb(0 0 255 / .5), color(srgb 1 0 0 / .5))',
    });
    expect(res2).toBe('lab(41.9294 74.5461 -21.0694 / 0.5)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)',
    });
    expect(res).toBe('color(srgb 0.5 0 0.5)');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)',
    });
    expect(res2).toBe('color(srgb 0.5 0 0.5)');
  });

  it('should get value', () => {
    const res = func('foo');
    expect(res).toBe('rgba(0, 0, 0, 0)');
    const res2 = func('foo');
    expect(res2).toBe('rgba(0, 0, 0, 0)');
  });

  it('should get empty string', () => {
    const res = func('foo', {
      format: 'specifiedValue',
    });
    expect(res).toBe('');
  });

  it('should get null', () => {
    const res = func('foo', {
      format: 'hex',
    });
    expect(res).toBeNull();
    const res2 = func('foo', {
      format: 'hex',
    });
    expect(res2).toBeNull();
  });

  it('should get value', () => {
    const res = func('foo', {
      format: 'hexAlpha',
    });
    expect(res).toBe('#00000000');
    const res2 = func('foo', {
      format: 'hexAlpha',
    });
    expect(res2).toBe('#00000000');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'purple',
      format: 'computedValue',
    });
    expect(res).toBe('rgb(128, 0, 128)');
    const res2 = func('currentColor', {
      currentColor: 'purple',
    });
    expect(res2).toBe('rgb(128, 0, 128)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'computedValue',
    });
    expect(res).toBe('rgba(0, 128, 0, 0.5)');
    const res2 = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'computedValue',
    });
    expect(res2).toBe('rgba(0, 128, 0, 0.5)');
  });

  it('should get value', () => {
    const res = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58)',
      format: 'computedValue',
    });
    expect(res).toBe('lab(46.28 -47.57 48.58)');
    const res2 = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58)',
      format: 'computedValue',
    });
    expect(res2).toBe('lab(46.28 -47.57 48.58)');
  });

  it('should get value', () => {
    const res = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58 / .5)',
      format: 'computedValue',
    });
    expect(res).toBe('lab(46.28 -47.57 48.58 / 0.5)');
    const res2 = func('currentcolor', {
      currentColor: 'lab(46.28% -47.57 48.58 / .5)',
      format: 'computedValue',
    });
    expect(res2).toBe('lab(46.28 -47.57 48.58 / 0.5)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'computedValue',
    });
    expect(res).toBe('rgba(0, 128, 0, 0.5)');
    const res2 = func('currentColor', {
      currentColor: 'rgb(0 50% 0 / .5)',
      format: 'computedValue',
    });
    expect(res2).toBe('rgba(0, 128, 0, 0.5)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor:
        'color-mix(in srgb, rgba(0 255 0 / .5), rgba(255 0 0 / .5))',
    });
    expect(res).toBe('color(srgb 0.5 0.5 0 / 0.5)');
    const res2 = func('currentColor', {
      currentColor:
        'color-mix(in srgb, rgba(0 255 0 / .5), rgba(255 0 0 / .5))',
    });
    expect(res2).toBe('color(srgb 0.5 0.5 0 / 0.5)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)',
      format: 'computedValue',
    });
    expect(res).toBe('color(srgb 0.5 0 0.5)');
    const res2 = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)',
      format: 'computedValue',
    });
    expect(res2).toBe('color(srgb 0.5 0 0.5)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0 / 0.5)',
    });
    expect(res).toBe('color(srgb 0 0.5 1 / 0.5)');
    const res2 = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0 / 0.5)',
    });
    expect(res2).toBe('color(srgb 0 0.5 1 / 0.5)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0 / 1)',
    });
    expect(res).toBe('color(srgb 0 0.5 1)');
    const res2 = func('currentColor', {
      currentColor: 'color(srgb 0 .5 1.0)',
    });
    expect(res2).toBe('color(srgb 0 0.5 1)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color(srgb 0 0.5 0 / 0.5)',
      format: 'computedValue',
    });
    expect(res).toBe('color(srgb 0 0.5 0 / 0.5)');
    const res2 = func('currentColor', {
      currentColor: 'color(srgb 0 0.5 0 / 0.5)',
      format: 'computedValue',
    });
    expect(res2).toBe('color(srgb 0 0.5 0 / 0.5)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'green',
    });
    expect(res).toBe('rgb(0, 128, 0)');
    const res2 = func('currentColor', {
      currentColor: 'green',
    });
    expect(res2).toBe('rgb(0, 128, 0)');
  });

  it('should get value', () => {
    const res = func('currentColor');
    expect(res).toBe('rgba(0, 0, 0, 0)');
    const res2 = func('currentColor');
    expect(res2).toBe('rgba(0, 0, 0, 0)');
  });

  it('should get value', () => {
    const res = func('transparent');
    expect(res).toBe('rgba(0, 0, 0, 0)');
    const res2 = func('transparent');
    expect(res2).toBe('rgba(0, 0, 0, 0)');
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'specifiedValue',
    });
    expect(res).toBe('transparent');
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'computedValue',
    });
    expect(res).toBe('rgba(0, 0, 0, 0)');
    const res2 = func('transparent', {
      format: 'computedValue',
    });
    expect(res2).toBe('rgba(0, 0, 0, 0)');
  });

  it('should get null', () => {
    const res = func('transparent', {
      format: 'hex',
    });
    expect(res).toBeNull();
    const res2 = func('transparent', {
      format: 'hex',
    });
    expect(res2).toBeNull();
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'hexAlpha',
    });
    expect(res).toBe('#00000000');
    const res2 = func('transparent', {
      format: 'hexAlpha',
    });
    expect(res2).toBe('#00000000');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)');
    expect(res).toBe('color(srgb 0.5 0 0.5)');
    const res2 = func('color-mix(in srgb, blue, red)');
    expect(res2).toBe('color(srgb 0.5 0 0.5)');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, rgb(255, 0, 0))', {
      format: 'specifiedValue',
    });
    expect(res).toBe('color-mix(in srgb, blue, rgb(255, 0, 0))');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, #0000ff, rgb(255 0 0))', {
      format: 'specifiedValue',
    });
    expect(res).toBe('color-mix(in srgb, rgb(0, 0, 255), rgb(255, 0, 0))');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgba(0 0 255 / .5), currentcolor)', {
      currentColor: 'rgba(255 0 0 / .5)',
      key: 'foo',
    });
    expect(res).toEqual(['foo', 'color(srgb 0.5 0 0.5 / 0.5)']);
    const res2 = func('color-mix(in srgb, rgba(0 0 255 / .5), currentcolor)', {
      currentColor: 'rgba(255 0 0 / .5)',
      key: 'foo',
    });
    expect(res2).toEqual(['foo', 'color(srgb 0.5 0 0.5 / 0.5)']);
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, transparent, currentcolor)', {
      currentColor: 'red',
    });
    expect(res).toBe('color(srgb 1 0 0 / 0.5)');
    const res2 = func('color-mix(in srgb, transparent, currentColor)', {
      currentColor: 'red',
    });
    expect(res2).toBe('color(srgb 1 0 0 / 0.5)');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, transparent, red)');
    expect(res).toBe('color(srgb 1 0 0 / 0.5)');
    const res2 = func('color-mix(in srgb, transparent, red)');
    expect(res2).toBe('color(srgb 1 0 0 / 0.5)');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.0 .5 1.0 / 1)');
    expect(res).toBe('color(srgb 0 0.5 1)');
    const res2 = func('color(srgb 0.0 .5 1.0 / 1)');
    expect(res2).toBe('color(srgb 0 0.5 1)');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.0 .5 1.0 / 1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('color(srgb 0 0.5 1)');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.0 .5 1.0 / .5)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('color(srgb 0 0.5 1 / 0.5)');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.0 .5 1.0 / none)');
    expect(res).toBe('color(srgb 0 0.5 1 / none)');
    const res2 = func('color(srgb 0.0 .5 1.0 / none)');
    expect(res2).toBe('color(srgb 0 0.5 1 / none)');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0)');
    expect(res).toBe('rgb(0, 128, 0)');
    const res2 = func('rgb(0 127.5 0)');
    expect(res2).toBe('rgb(0, 128, 0)');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('rgb(0, 128, 0)');
    const res2 = func('rgb(0 127.5 0)', {
      format: 'specifiedValue',
    });
    expect(res2).toBe('rgb(0, 128, 0)');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0 / .5)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('rgba(0, 128, 0, 0.5)');
    const res2 = func('rgb(0 127.5 0 / .5)', {
      format: 'specifiedValue',
    });
    expect(res2).toBe('rgba(0, 128, 0, 0.5)');
  });

  it('should get value', () => {
    const res = func('rgb(0 127.5 0 / .5)');
    expect(res).toBe('rgba(0, 128, 0, 0.5)');
    const res2 = func('rgb(0 127.5 0 / .5)');
    expect(res2).toBe('rgba(0, 128, 0, 0.5)');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)', {
      format: 'computedValue',
    });
    expect(res).toBe('rgb(0, 128, 0)');
    const res2 = func('hwb(120 0% 50%)', {
      format: 'computedValue',
    });
    expect(res2).toBe('rgb(0, 128, 0)');
  });

  it('should get value', () => {
    const res = func('hwb(calc(360deg / 3) 0% 50%)', {
      format: 'computedValue',
    });
    expect(res).toBe('rgb(0, 128, 0)');
    const res2 = func('hwb(calc(360deg / 3) 0% 50%)', {
      format: 'computedValue',
    });
    expect(res2).toBe('rgb(0, 128, 0)');
  });

  it('should get value', () => {
    const res = func('hwb(calc(360deg / 3) 0% 50%)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('rgb(0, 128, 0)');
    const res2 = func('hwb(calc(360deg / 3) 0% 50%)', {
      format: 'specifiedValue',
    });
    expect(res2).toBe('rgb(0, 128, 0)');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50% / .5)', {
      format: 'computedValue',
    });
    expect(res).toBe('rgba(0, 128, 0, 0.5)');
    const res2 = func('hwb(120 0% 50% / .5)', {
      format: 'computedValue',
    });
    expect(res2).toBe('rgba(0, 128, 0, 0.5)');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('rgb(0, 128, 0)');
    const res2 = func('hwb(120 0% 50%)', {
      format: 'specifiedValue',
    });
    expect(res2).toBe('rgb(0, 128, 0)');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)', {
      format: 'computedValue',
    });
    expect(res).toBe('lab(46.28 -47.57 48.58)');
    const res2 = func('lab(46.28% -47.57 48.58)', {
      format: 'computedValue',
    });
    expect(res2).toBe('lab(46.28 -47.57 48.58)');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('lab(46.28 -47.57 48.58)');
    const res2 = func('lab(46.28% -47.57 48.58)', {
      format: 'specifiedValue',
    });
    expect(res2).toBe('lab(46.28 -47.57 48.58)');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58 / .5)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('lab(46.28 -47.57 48.58 / 0.5)');
    const res2 = func('lab(46.28% -47.57 48.58 / .5)', {
      format: 'specifiedValue',
    });
    expect(res2).toBe('lab(46.28 -47.57 48.58 / 0.5)');
  });

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58 / .5)', {
      format: 'computedValue',
    });
    expect(res).toBe('lab(46.28 -47.57 48.58 / 0.5)');
    const res2 = func('lab(46.28% -47.57 48.58 / .5)', {
      format: 'computedValue',
    });
    expect(res2).toBe('lab(46.28 -47.57 48.58 / 0.5)');
  });

  it('should get value', () => {
    const res = func('green');
    expect(res).toBe('rgb(0, 128, 0)');
    const res2 = func('green');
    expect(res2).toBe('rgb(0, 128, 0)');
  });

  it('should get value', () => {
    const res = func(' GREEN ');
    expect(res).toBe('rgb(0, 128, 0)');
    const res2 = func(' GREEN ');
    expect(res2).toBe('rgb(0, 128, 0)');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)', {
      key: 'foo',
    });
    expect(res).toEqual(['foo', 'color(srgb 0.5 0 0.5)']);
    const res2 = func('color-mix(in srgb, blue, red)', {
      key: 'foo',
    });
    expect(res2).toEqual(['foo', 'color(srgb 0.5 0 0.5)']);
  });

  it('should get null', () => {
    const res = func('transparent', {
      format: 'hex',
    });
    expect(res).toBeNull();
    const res2 = func('transparent', {
      format: 'hex',
    });
    expect(res2).toBeNull();
  });

  it('should get null', () => {
    const res = func('foo', {
      format: 'hex',
    });
    expect(res).toBeNull();
    const res2 = func('foo', {
      format: 'hex',
    });
    expect(res2).toBeNull();
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hex',
    });
    expect(res).toBe('#008000');
    const res2 = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hex',
    });
    expect(res2).toBe('#008000');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'hex',
    });
    expect(res).toBeNull();
    const res2 = func('currentColor', {
      format: 'hex',
    });
    expect(res2).toBeNull();
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0%)', {
      format: 'hex',
      key: 'foo',
    });
    expect(res).toEqual(['foo', '#008000']);
    const res2 = func('rgba(0% 50% 0%)', {
      format: 'hex',
      key: 'foo',
    });
    expect(res2).toEqual(['foo', '#008000']);
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'hexAlpha',
    });
    expect(res).toBe('#00000000');
    const res2 = func('transparent', {
      format: 'hexAlpha',
    });
    expect(res2).toBe('#00000000');
  });

  it('should get null', () => {
    const res = func('foo', {
      format: 'hexAlpha',
    });
    expect(res).toBe('#00000000');
    const res2 = func('foo', {
      format: 'hexAlpha',
    });
    expect(res2).toBe('#00000000');
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha',
    });
    expect(res).toBe('#00800080');
    const res2 = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha',
    });
    expect(res2).toBe('#00800080');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'hexAlpha',
    });
    expect(res).toBeNull();
    const res2 = func('currentColor', {
      format: 'hexAlpha',
    });
    expect(res2).toBeNull();
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha',
      key: 'foo',
    });
    expect(res).toEqual(['foo', '#00800080']);
    const res2 = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha',
      key: 'foo',
    });
    expect(res2).toEqual(['foo', '#00800080']);
  });

  it('should get value', () => {
    const res = func('currentcolor', {
      currentColor: 'color-mix(in lab, rgb(255 0 0), rgb(0 0 255))',
    });
    const res2 = parseColorValue(res, {
      format: 'computedValue',
    });
    expect(res2).toEqual(['lab', 41.9294, 74.5461, -21.0694, 1]);
  });

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color-mix(in srgb, currentColor, blue), color-mix(in srgb, transparent, #008000))',
      {
        currentColor: 'rgb(255 0 0)',
      },
    );
    expect(res).toBe('color(srgb 0.333333 0.16732 0.333333 / 0.75)');
    const res2 = func(
      'color-mix(in srgb, color-mix(in srgb, currentColor, blue), color-mix(in srgb, transparent, #008000))',
      {
        currentColor: 'rgb(255 0 0)',
      },
    );
    expect(res2).toBe('color(srgb 0.333333 0.16732 0.333333 / 0.75)');
  });

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color-mix(in srgb, currentColor, blue), color-mix(in srgb, transparent, #008000))',
      {
        currentColor: 'rgb(255 0 0)',
        format: 'specifiedValue',
      },
    );
    expect(res).toBe(
      'color-mix(in srgb, color-mix(in srgb, currentcolor, blue), color-mix(in srgb, transparent, rgb(0, 128, 0)))',
    );
    const res2 = func(
      'color-mix(in srgb, color-mix(in srgb, currentColor, blue), color-mix(in srgb, transparent, #008000))',
      {
        currentColor: 'rgb(255 0 0)',
        format: 'specifiedValue',
      },
    );
    expect(res2).toBe(
      'color-mix(in srgb, color-mix(in srgb, currentcolor, blue), color-mix(in srgb, transparent, rgb(0, 128, 0)))',
    );
  });

  it('should get value', () => {
    const res = func(
      'color-mix(in oklab, lch(67.5345 42.5 258.2), color(srgb 0 0.5 0))',
    );
    expect(res).toBe('oklab(0.620754 -0.0931934 -0.00374881)');
  });

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, red calc(50% + (sign(100em - 1px) * 10%)), blue)',
    );
    expect(res).toBe('rgba(0, 0, 0, 0)');
  });

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, red calc(50% + (sign(100em - 1px) * 10%)), blue)',
      {
        dimension: {
          em: 20,
        },
      },
    );
    expect(res).toBe('color(srgb 0.6 0 0.4)');
  });

  it('should get value', () => {
    const res = func('rgb(from rebeccapurple r g b)');
    expect(res).toBe('color(srgb 0.4 0.2 0.6)');
  });

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, rgb(from rebeccapurple r g b), rebeccapurple)',
    );
    expect(res).toBe('color(srgb 0.4 0.2 0.6)');
  });

  it('should get value', () => {
    const res = func('rgb(from rebeccapurple l a b)');
    expect(res).toBe('rgba(0, 0, 0, 0)');
  });

  it('should get value', () => {
    const res = func('rgb(from rebeccapurple l a b)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('');
  });

  it('should get null', () => {
    const res = func('rgb(from rebeccapurple l a b)', {
      format: 'hex',
    });
    expect(res).toBeNull();
  });

  it('should get null', () => {
    const res = func('rgb(from rebeccapurple l a b)', {
      format: 'hexAlpha',
    });
    expect(res).toBeNull();
  });
});
