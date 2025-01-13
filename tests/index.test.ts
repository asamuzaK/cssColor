/**
 * index.test.js
 */

import { describe, expect, it } from 'vitest';
import * as api from '../src/index.js';

describe('resolve CSS color', () => {
  const func = api.resolve;

  it('should get value', () => {
    const res = func('green');
    expect(res).toBe('rgb(0, 128, 0)');
  });

  it('should get value', () => {
    const res = func(
      'color-mix(in oklab, rgb(255 0 0), color(srgb 0 0.5 0 / 0.5))',
    );
    expect(res).toBe('oklab(0.5914 0.103273 0.119688 / 0.75)');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      currentColor: 'color-mix(in srgb, blue, red)',
    });
    expect(res).toBe('color(srgb 0.5 0 0.5)');
  });

  it('should get value', () => {
    const res = func('rgba(0% 50% 0% / 0.5)', {
      format: 'hexAlpha',
    });
    expect(res).toBe('#00800080');
  });
});

describe('convert', () => {
  const { convert } = api;

  it('should get value', () => {
    const hex = convert.colorToHex('lab(46.2775% -47.5621 48.5837)');
    expect(hex).toBe('#008000');
  });
});

describe('isColor', () => {
  const { isColor } = api;

  it('should get value', () => {
    const res = isColor('foo');
    expect(res).toBe(false);
  });

  it('should get value', () => {
    const res = isColor('green');
    expect(res).toBe(true);
  });

  it('should get value', () => {
    const res = isColor('lab(46.2775% -47.5621 48.5837)');
    expect(res).toBe(true);
  });
});
