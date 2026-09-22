/**
 * parse.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/js/cache';
import * as parse from '../src/js/parse';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('parse rgb()', () => {
  const func = parse.parseRgb;

  it('should throw a TypeError if the input is not a string', () => {
    assert.throws(
      () => func(null as unknown as string),
      TypeError,
      'null is not a string.'
    );
    assert.throws(
      () => func(123 as unknown as string),
      TypeError,
      '123 is not a string.'
    );
    assert.throws(
      () => func(undefined as unknown as string),
      TypeError,
      'undefined is not a string.'
    );
  });

  it('should parse comma-separated rgb/rgba values correctly', () => {
    assert.deepEqual(func('rgb(255, 0, 153)'), ['rgb', 255, 0, 153, 1]);
    assert.deepEqual(func('rgba(255, 0, 153, 1)'), ['rgb', 255, 0, 153, 1]);
    assert.deepEqual(func('rgba(255, 0, 153, 0.5)'), ['rgb', 255, 0, 153, 0.5]);
  });

  it('should parse space and slash-separated rgb/rgba values correctly', () => {
    assert.deepEqual(func('rgb(255 0 153)'), ['rgb', 255, 0, 153, 1]);
    assert.deepEqual(func('rgb(255 0 153 / 1)'), ['rgb', 255, 0, 153, 1]);
    assert.deepEqual(func('rgba(255 0 153 / 0.5)'), ['rgb', 255, 0, 153, 0.5]);
  });

  it('should calculate percentage values correctly', () => {
    assert.deepEqual(func('rgb(100%, 0%, 60%)'), ['rgb', 255, 0, 153, 1]);
    assert.deepEqual(func('rgba(100%, 0%, 60%, 0.5)'), [
      'rgb',
      255,
      0,
      153,
      0.5
    ]);
  });

  it('should clamp RGB values between 0 and 255', () => {
    assert.deepEqual(func('rgb(-10, 300, 153)'), ['rgb', 0, 255, 153, 1]);
    assert.deepEqual(func('rgb(-10%, 150%, 60%)'), ['rgb', 0, 255, 153, 1]);
  });

  it('should ignore case and extra whitespace', () => {
    assert.deepEqual(func('  RGB( 255 , 0 , 153 )  '), ['rgb', 255, 0, 153, 1]);
  });

  it('should treat "none" as 0', () => {
    assert.deepEqual(func('rgb(none none none)'), ['rgb', 0, 0, 0, 1]);
    assert.deepEqual(func('rgb(none none none / 1)'), ['rgb', 0, 0, 0, 1]);
  });

  it('should return null when nullable option is true', () => {
    assert.strictEqual(func('invalid-color', { nullable: true }), null);
  });

  it('should return a string when format option causes to return a string', () => {
    const res = func('invalid-color', { format: 'specifiedValue' });
    assert.isString(res);
    assert.strictEqual(res, '');
  });

  it('should return SpecifiedColorChannels array fallback by default', () => {
    assert.deepEqual(func('invalid-color'), ['rgb', 0, 0, 0, 0]);
  });

  it('should preserve "none" for alpha when format is "mixValue" and alpha is "none"', () => {
    assert.deepEqual(func('rgb(255 0 153 / none)', { format: 'mixValue' }), [
      'rgb',
      255,
      0,
      153,
      'none'
    ]);
  });

  it('should resolve "none" alpha to 1 when format is not "mixValue"', () => {
    assert.deepEqual(func('rgb(255 0 153 / none)'), ['rgb', 255, 0, 153, 0]);
  });

  it('should return parsed numerical alpha when format is "mixValue" but alpha is specified', () => {
    assert.deepEqual(func('rgb(255 0 153 / 0.5)', { format: 'mixValue' }), [
      'rgb',
      255,
      0,
      153,
      0.5
    ]);
  });
});

describe('parse hsl()', () => {
  const func = parse.parseHsl;

  it('should throw a TypeError if the input is not a string', () => {
    assert.throws(
      () => func(null as unknown as string),
      TypeError,
      'null is not a string.'
    );
    assert.throws(
      () => func(123 as unknown as string),
      TypeError,
      '123 is not a string.'
    );
    assert.throws(
      () => func(undefined as unknown as string),
      TypeError,
      'undefined is not a string.'
    );
  });

  it('should parse comma-separated hsl/hsla values correctly', () => {
    assert.deepEqual(func('hsl(0, 100%, 50%)'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(func('hsla(120, 100%, 50%, 1)'), ['rgb', 0, 255, 0, 1]);
    assert.deepEqual(func('hsla(240, 100%, 50%, 0.5)'), [
      'rgb',
      0,
      0,
      255,
      0.5
    ]);
  });

  it('should parse space and slash-separated hsl/hsla values correctly', () => {
    assert.deepEqual(func('hsl(0 100% 50%)'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(func('hsl(120 100% 50% / 1)'), ['rgb', 0, 255, 0, 1]);
    assert.deepEqual(func('hsla(240 100% 50% / 0.5)'), ['rgb', 0, 0, 255, 0.5]);
  });

  it('should handle various angle units for hue', () => {
    assert.deepEqual(func('hsl(180deg 100% 50%)'), ['rgb', 0, 255, 255, 1]);
    assert.deepEqual(func('hsl(0.5turn 100% 50%)'), ['rgb', 0, 255, 255, 1]);
    assert.deepEqual(func('hsl(200grad 100% 50%)'), ['rgb', 0, 255, 255, 1]);
  });

  it('should clamp saturation and lightness between 0 and 100', () => {
    assert.deepEqual(func('hsl(0, 150%, -20%)'), ['rgb', 0, 0, 0, 1]);
    assert.deepEqual(func('hsl(0, -50%, 120%)'), ['rgb', 255, 255, 255, 1]);
  });

  it('should treat "none" keywords correctly', () => {
    assert.deepEqual(func('hsl(none none 50%)'), [
      'rgb',
      127.5,
      127.5,
      127.5,
      1
    ]);
    assert.deepEqual(func('hsl(0 100% 50% / none)'), ['rgb', 255, 0, 0, 0]);
  });

  it('should return HSL channels when format option is "hsl"', () => {
    assert.deepEqual(func('hsl(180deg 100% 50% / 0.5)', { format: 'hsl' }), [
      'hsl',
      180,
      100,
      50,
      0.5
    ]);
    assert.deepEqual(func('hsl(none none none / none)', { format: 'hsl' }), [
      'hsl',
      'none',
      'none',
      'none',
      'none'
    ]);
  });

  it('should return null when nullable option is true', () => {
    assert.strictEqual(func('invalid-color', { nullable: true }), null);
  });

  it('should return an empty string when format option causes to return a string', () => {
    const res = func('invalid-color', { format: 'specifiedValue' });
    assert.isString(res);
    assert.strictEqual(res, '');
  });

  it('should return SpecifiedColorChannels array fallback by default', () => {
    assert.deepEqual(func('invalid-color'), ['rgb', 0, 0, 0, 0]);
  });
});

describe('parse hwb()', () => {
  const func = parse.parseHwb;

  it('should throw a TypeError if the input is not a string', () => {
    assert.throws(
      () => func(null as unknown as string),
      TypeError,
      'null is not a string.'
    );
    assert.throws(
      () => func(123 as unknown as string),
      TypeError,
      '123 is not a string.'
    );
    assert.throws(
      () => func(undefined as unknown as string),
      TypeError,
      'undefined is not a string.'
    );
  });

  it('should parse valid hwb values correctly', () => {
    assert.deepEqual(func('hwb(0 0% 0%)'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(func('hwb(120 20% 20%)'), ['rgb', 51, 204, 51, 1]);
    assert.deepEqual(func('hwb(240 0% 0% / 0.5)'), ['rgb', 0, 0, 255, 0.5]);
  });

  it('should handle various angle units for hue', () => {
    assert.deepEqual(func('hwb(180deg 0% 0%)'), ['rgb', 0, 255, 255, 1]);
    assert.deepEqual(func('hwb(0.5turn 0% 0%)'), ['rgb', 0, 255, 255, 1]);
    assert.deepEqual(func('hwb(200grad 0% 0%)'), ['rgb', 0, 255, 255, 1]);
  });

  it('should clamp whiteness and blackness values between 0 and 100', () => {
    assert.deepEqual(func('hwb(0 -10% -20%)'), ['rgb', 255, 0, 0, 1]);
  });

  it('should normalize grayscale when wh + bk >= 100%', () => {
    assert.deepEqual(func('hwb(0 50% 50%)'), ['rgb', 127.5, 127.5, 127.5, 1]);
    assert.deepEqual(func('hwb(0 60% 60%)'), ['rgb', 127.5, 127.5, 127.5, 1]);
    assert.deepEqual(func('hwb(0 100% 0%)'), ['rgb', 255, 255, 255, 1]);
  });

  it('should treat "none" keywords correctly', () => {
    assert.deepEqual(func('hwb(none none none)'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(func('hwb(0 0% 0% / none)'), ['rgb', 255, 0, 0, 0]);
  });

  it('should return HWB channels when format option is "hwb"', () => {
    assert.deepEqual(func('hwb(180deg 20% 30% / 0.5)', { format: 'hwb' }), [
      'hwb',
      180,
      20,
      30,
      0.5
    ]);
    assert.deepEqual(func('hwb(none none none / none)', { format: 'hwb' }), [
      'hwb',
      'none',
      'none',
      'none',
      'none'
    ]);
  });

  it('should return null when nullable option is true', () => {
    assert.strictEqual(func('invalid-color', { nullable: true }), null);
  });

  it('should return an empty string when format option causes resolveInvalidColorValue to return a string', () => {
    const res = func('invalid-color', { format: 'specifiedValue' });
    assert.isString(res);
    assert.strictEqual(res, '');
  });

  it('should return SpecifiedColorChannels array fallback by default', () => {
    assert.deepEqual(func('invalid-color'), ['rgb', 0, 0, 0, 0]);
  });
});

describe('parse lab()', () => {
  const func = parse.parseLab;

  it('should throw a TypeError if the input is not a string', () => {
    assert.throws(
      () => func(null as unknown as string),
      TypeError,
      'null is not a string.'
    );
    assert.throws(
      () => func(123 as unknown as string),
      TypeError,
      '123 is not a string.'
    );
    assert.throws(
      () => func(undefined as unknown as string),
      TypeError,
      'undefined is not a string.'
    );
  });

  it('should parse valid lab values and convert to xyz-d50', () => {
    assert.deepEqual(func('lab(0 0 0)'), ['xyz-d50', 0, 0, 0, 1]);
    assert.deepEqual(func('lab(0 0 0 / 0.5)'), ['xyz-d50', 0, 0, 0, 0.5]);
  });

  it('should handle percentage values for L, a, and b', () => {
    assert.deepEqual(
      func('lab(50% 10% -20% / 0.5)', { format: 'specifiedValue' }),
      ['lab', 50, 12.5, -25, 0.5]
    );
  });

  it('should clamp L value between 0 and 100', () => {
    assert.deepEqual(func('lab(-10% 0 0)', { format: 'specifiedValue' }), [
      'lab',
      0,
      0,
      0,
      1
    ]);
    assert.deepEqual(func('lab(150% 0 0)', { format: 'specifiedValue' }), [
      'lab',
      100,
      0,
      0,
      1
    ]);
  });

  it('should treat "none" keywords correctly', () => {
    assert.deepEqual(func('lab(none none none)'), ['xyz-d50', 0, 0, 0, 1]);
    assert.deepEqual(func('lab(0 0 0 / none)'), ['xyz-d50', 0, 0, 0, 0]);
  });

  it('should return LAB channels when format is specifiedValue or computedValue', () => {
    assert.deepEqual(
      func('lab(50 20 -30 / 0.8)', { format: 'specifiedValue' }),
      ['lab', 50, 20, -30, 0.8]
    );
    assert.deepEqual(
      func('lab(50 20 -30 / 0.8)', { format: 'computedValue' }),
      ['lab', 50, 20, -30, 0.8]
    );
    assert.deepEqual(
      func('lab(none none none / none)', { format: 'specifiedValue' }),
      ['lab', 'none', 'none', 'none', 'none']
    );
  });

  it('should return null when nullable option is true', () => {
    assert.strictEqual(func('invalid-color', { nullable: true }), null);
  });

  it('should return an empty string when format option causes to return a string', () => {
    const res = func('invalid-color', { format: 'specifiedValue' });
    assert.isString(res);
    assert.strictEqual(res, '');
  });

  it('should return SpecifiedColorChannels array fallback by default', () => {
    assert.deepEqual(func('invalid-color'), ['rgb', 0, 0, 0, 0]);
  });

  it('should evaluate true branches when values exceed thresholds (l > 8, powFa/powFb > LAB_EPSILON)', () => {
    const res = func('lab(50 0 0)');
    assert.isArray(res);
    assert.strictEqual(res[0], 'xyz-d50');
  });

  it('should evaluate false branches when values are below thresholds (l <= 8, powFa/powFb <= LAB_EPSILON)', () => {
    const res = func('lab(5 0 0)');
    assert.isArray(res);
    assert.strictEqual(res[0], 'xyz-d50');
  });

  it('should evaluate false branch for powFa and powFb with negative/large offsets at l = 0', () => {
    const res = func('lab(0 -50 50)');
    assert.isArray(res);
    assert.strictEqual(res[0], 'xyz-d50');
  });
});

describe('parse lch()', () => {
  const func = parse.parseLch;

  it('should throw a TypeError if the input is not a string', () => {
    assert.throws(
      () => func(null as unknown as string),
      TypeError,
      'null is not a string.'
    );
    assert.throws(
      () => func(123 as unknown as string),
      TypeError,
      '123 is not a string.'
    );
    assert.throws(
      () => func(undefined as unknown as string),
      TypeError,
      'undefined is not a string.'
    );
  });

  it('should parse valid lch values and convert to xyz-d50', () => {
    assert.deepEqual(func('lch(0 0 0)'), ['xyz-d50', 0, 0, 0, 1]);
    assert.deepEqual(func('lch(0 0 0 / 0.5)'), ['xyz-d50', 0, 0, 0, 0.5]);
  });

  it('should handle percentage values for chroma', () => {
    assert.deepEqual(
      func('lch(50 100% 180 / 0.5)', { format: 'specifiedValue' }),
      ['lch', 50, 150, 180, 0.5]
    );
  });

  it('should handle various angle units for hue', () => {
    assert.deepEqual(func('lch(50 20 180deg)', { format: 'specifiedValue' }), [
      'lch',
      50,
      20,
      180,
      1
    ]);
    assert.deepEqual(func('lch(50 20 0.5turn)', { format: 'specifiedValue' }), [
      'lch',
      50,
      20,
      180,
      1
    ]);
    assert.deepEqual(func('lch(50 20 200grad)', { format: 'specifiedValue' }), [
      'lch',
      50,
      20,
      180,
      1
    ]);
  });

  it('should clamp negative lightness to 0', () => {
    assert.deepEqual(func('lch(-20 50 180)', { format: 'specifiedValue' }), [
      'lch',
      0,
      50,
      180,
      1
    ]);
  });

  it('should treat "none" keywords correctly', () => {
    assert.deepEqual(func('lch(none none none)'), ['xyz-d50', 0, 0, 0, 1]);
    assert.deepEqual(func('lch(0 0 0 / none)'), ['xyz-d50', 0, 0, 0, 0]);
  });

  it('should return LCH channels when format is specifiedValue or computedValue', () => {
    assert.deepEqual(
      func('lch(50 20 180 / 0.8)', { format: 'specifiedValue' }),
      ['lch', 50, 20, 180, 0.8]
    );
    assert.deepEqual(
      func('lch(50 20 180 / 0.8)', { format: 'computedValue' }),
      ['lch', 50, 20, 180, 0.8]
    );
    assert.deepEqual(
      func('lch(none none none / none)', { format: 'specifiedValue' }),
      ['lch', 'none', 'none', 'none', 'none']
    );
  });

  it('should return null when nullable option is true', () => {
    assert.strictEqual(func('invalid-color', { nullable: true }), null);
  });

  it('should return an empty string when format option causes to return a string', () => {
    const res = func('invalid-color', { format: 'specifiedValue' });
    assert.isString(res);
    assert.strictEqual(res, '');
  });

  it('should return SpecifiedColorChannels array fallback by default', () => {
    assert.deepEqual(func('invalid-color'), ['rgb', 0, 0, 0, 0]);
  });
});

describe('parse oklab()', () => {
  const func = parse.parseOklab;

  it('should throw a TypeError if the input is not a string', () => {
    assert.throws(
      () => func(null as unknown as string),
      TypeError,
      'null is not a string.'
    );
    assert.throws(
      () => func(123 as unknown as string),
      TypeError,
      '123 is not a string.'
    );
    assert.throws(
      () => func(undefined as unknown as string),
      TypeError,
      'undefined is not a string.'
    );
  });

  it('should parse valid oklab values and convert to xyz-d65', () => {
    assert.deepEqual(func('oklab(0 0 0)'), ['xyz-d65', 0, 0, 0, 1]);
    assert.deepEqual(func('oklab(0 0 0 / 0.5)'), ['xyz-d65', 0, 0, 0, 0.5]);
  });

  it('should handle percentage values for L, a, and b', () => {
    assert.deepEqual(
      func('oklab(50% 10% -20% / 0.5)', { format: 'specifiedValue' }),
      ['oklab', 0.5, 0.04, -0.08, 0.5]
    );
  });

  it('should clamp negative L value to 0', () => {
    assert.deepEqual(func('oklab(-0.5 0 0)', { format: 'specifiedValue' }), [
      'oklab',
      0,
      0,
      0,
      1
    ]);
    assert.deepEqual(func('oklab(-50% 0 0)', { format: 'specifiedValue' }), [
      'oklab',
      0,
      0,
      0,
      1
    ]);
  });

  it('should treat "none" keywords correctly', () => {
    assert.deepEqual(func('oklab(none none none)'), ['xyz-d65', 0, 0, 0, 1]);
    assert.deepEqual(func('oklab(0 0 0 / none)'), ['xyz-d65', 0, 0, 0, 0]);
  });

  it('should return OKLAB channels when format is specifiedValue or computedValue', () => {
    assert.deepEqual(
      func('oklab(0.6 0.1 -0.1 / 0.8)', { format: 'specifiedValue' }),
      ['oklab', 0.6, 0.1, -0.1, 0.8]
    );
    assert.deepEqual(
      func('oklab(0.6 0.1 -0.1 / 0.8)', { format: 'computedValue' }),
      ['oklab', 0.6, 0.1, -0.1, 0.8]
    );
    assert.deepEqual(
      func('oklab(none none none / none)', { format: 'specifiedValue' }),
      ['oklab', 'none', 'none', 'none', 'none']
    );
  });

  it('should return null when nullable option is true', () => {
    assert.strictEqual(func('invalid-color', { nullable: true }), null);
  });

  it('should return an empty string when format option causes resolveInvalidColorValue to return a string', () => {
    const res = func('invalid-color', { format: 'specifiedValue' });
    assert.isString(res);
    assert.strictEqual(res, '');
  });

  it('should return SpecifiedColorChannels array fallback by default', () => {
    assert.deepEqual(func('invalid-color'), ['rgb', 0, 0, 0, 0]);
  });
});

describe('parse oklch()', () => {
  const func = parse.parseOklch;

  it('should throw a TypeError if the input is not a string', () => {
    assert.throws(
      () => func(null as unknown as string),
      TypeError,
      'null is not a string.'
    );
    assert.throws(
      () => func(123 as unknown as string),
      TypeError,
      '123 is not a string.'
    );
    assert.throws(
      () => func(undefined as unknown as string),
      TypeError,
      'undefined is not a string.'
    );
  });

  it('should parse valid oklch values and convert to xyz-d65', () => {
    // oklch(0 0 0) converts to D65 black [0, 0, 0, 1]
    assert.deepEqual(func('oklch(0 0 0)'), ['xyz-d65', 0, 0, 0, 1]);
    assert.deepEqual(func('oklch(0 0 0 / 0.5)'), ['xyz-d65', 0, 0, 0, 0.5]);
  });

  it('should handle percentage values for L and C', () => {
    // 50% L = 0.5, 100% C = 0.4 (COEF_PCT = 0.4)
    assert.deepEqual(
      func('oklch(50% 100% 180 / 0.5)', { format: 'specifiedValue' }),
      ['oklch', 0.5, 0.4, 180, 0.5]
    );
  });

  it('should handle various angle units for hue', () => {
    assert.deepEqual(
      func('oklch(0.5 0.2 180deg)', { format: 'specifiedValue' }),
      ['oklch', 0.5, 0.2, 180, 1]
    );
    assert.deepEqual(
      func('oklch(0.5 0.2 0.5turn)', { format: 'specifiedValue' }),
      ['oklch', 0.5, 0.2, 180, 1]
    );
    assert.deepEqual(
      func('oklch(0.5 0.2 200grad)', { format: 'specifiedValue' }),
      ['oklch', 0.5, 0.2, 180, 1]
    );
  });

  it('should clamp negative L and C values to 0', () => {
    assert.deepEqual(
      func('oklch(-0.5 -0.2 180)', { format: 'specifiedValue' }),
      ['oklch', 0, 0, 180, 1]
    );
    assert.deepEqual(
      func('oklch(-50% -20% 180)', { format: 'specifiedValue' }),
      ['oklch', 0, 0, 180, 1]
    );
  });

  it('should treat "none" keywords correctly', () => {
    assert.deepEqual(func('oklch(none none none)'), ['xyz-d65', 0, 0, 0, 1]);
    assert.deepEqual(func('oklch(0 0 0 / none)'), ['xyz-d65', 0, 0, 0, 0]);
  });

  it('should return OKLCH channels when format is specifiedValue or computedValue', () => {
    assert.deepEqual(
      func('oklch(0.6 0.1 180 / 0.8)', { format: 'specifiedValue' }),
      ['oklch', 0.6, 0.1, 180, 0.8]
    );
    assert.deepEqual(
      func('oklch(0.6 0.1 180 / 0.8)', { format: 'computedValue' }),
      ['oklch', 0.6, 0.1, 180, 0.8]
    );
    assert.deepEqual(
      func('oklch(none none none / none)', { format: 'specifiedValue' }),
      ['oklch', 'none', 'none', 'none', 'none']
    );
  });

  it('should return null when nullable option is true', () => {
    assert.strictEqual(func('invalid-color', { nullable: true }), null);
  });

  it('should return an empty string when format option causes resolveInvalidColorValue to return a string', () => {
    const res = func('invalid-color', { format: 'specifiedValue' });
    assert.isString(res);
    assert.strictEqual(res, '');
  });

  it('should return SpecifiedColorChannels array fallback by default', () => {
    assert.deepEqual(func('invalid-color'), ['rgb', 0, 0, 0, 0]);
  });
});

describe('parse parseColorFunc()', () => {
  const func = parse.parseColorFunc;

  it('should throw a TypeError if the input is not a string', () => {
    assert.throws(
      () => func(null as unknown as string),
      TypeError,
      'null is not a string.'
    );
    assert.throws(
      () => func(123 as unknown as string),
      TypeError,
      '123 is not a string.'
    );
    assert.throws(
      () => func(undefined as unknown as string),
      TypeError,
      'undefined is not a string.'
    );
  });

  describe('specifiedValue / computedValue / colorSpace match format', () => {
    it('should return specified color space channels when format is specifiedValue', () => {
      assert.deepEqual(
        func('color(display-p3 1 0.5 0 / 0.8)', { format: 'specifiedValue' }),
        ['display-p3', 1, 0.5, 0, 0.8]
      );
    });

    it('should normalize xyz to xyz-d65', () => {
      assert.deepEqual(
        func('color(xyz 0.1 0.2 0.3)', { format: 'specifiedValue' }),
        ['xyz-d65', 0.1, 0.2, 0.3, 1]
      );
    });

    it('should parse percentage values to 0-1 range', () => {
      assert.deepEqual(
        func('color(srgb 100% 50% 0%)', { format: 'specifiedValue' }),
        ['srgb', 1, 0.5, 0, 1]
      );
    });

    it('should preserve "none" keywords in specifiedValue format', () => {
      assert.deepEqual(
        func('color(srgb none none none / none)', { format: 'specifiedValue' }),
        ['srgb', 'none', 'none', 'none', 'none']
      );
    });

    it('should return specified array when format is color-mix and cs matches colorSpace', () => {
      assert.deepEqual(
        func('color(display-p3 0.5 0.5 0.5 / none)', {
          format: 'mixValue',
          colorSpace: 'display-p3'
        }),
        ['display-p3', 0.5, 0.5, 0.5, 'none']
      );
    });
  });

  it('should convert srgb (default) to xyz-d65 and xyz-d50', () => {
    const resD65 = func('color(srgb 1 0 0)');
    assert.isArray(resD65);
    assert.strictEqual(resD65[0], 'xyz-d65');
    const resD50 = func('color(srgb 1 0 0)', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });

  it('should convert srgb-linear to xyz', () => {
    const res = func('color(srgb-linear 0.5 0.5 0.5)');
    assert.isArray(res);
    assert.strictEqual(res[0], 'xyz-d65');
    const resD50 = func('color(srgb-linear 0.5 0.5 0.5)', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });

  it('should convert display-p3 to xyz', () => {
    const res = func('color(display-p3 1 0 0)');
    assert.isArray(res);
    assert.strictEqual(res[0], 'xyz-d65');
    const resD50 = func('color(display-p3 1 0 0)', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });

  it('should convert rec2020 to xyz testing both linear threshold branches', () => {
    const resLinear = func('color(rec2020 0.05 0.05 0.05)');
    assert.isArray(resLinear);
    const resPower = func('color(rec2020 0.5 0.5 0.5)', { d50: true });
    assert.isArray(resPower);
    assert.strictEqual(resPower[0], 'xyz-d50');
  });

  it('should convert a98-rgb to xyz', () => {
    const res = func('color(a98-rgb 0.8 0.2 0.1)');
    assert.isArray(res);
    assert.strictEqual(res[0], 'xyz-d65');
    const resD50 = func('color(a98-rgb 0.8 0.2 0.1)', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });

  it('should convert prophoto-rgb to xyz testing both threshold branches', () => {
    const resLinear = func('color(prophoto-rgb 0.01 0.01 0.01)');
    assert.isArray(resLinear);
    assert.strictEqual(resLinear[0], 'xyz-d65');
    const resPower = func('color(prophoto-rgb 0.5 0.5 0.5)', { d50: true });
    assert.isArray(resPower);
    assert.strictEqual(resPower[0], 'xyz-d50');
  });

  it('should handle xyz, xyz-d50, and xyz-d65 color spaces correctly', () => {
    const resD50ToD65 = func('color(xyz-d50 0.2 0.2 0.2)');
    assert.isArray(resD50ToD65);
    assert.strictEqual(resD50ToD65[0], 'xyz-d65');

    const resD50ToD50 = func('color(xyz-d50 0.2 0.2 0.2)', { d50: true });
    assert.isArray(resD50ToD50);
    assert.strictEqual(resD50ToD50[0], 'xyz-d50');

    const resD65ToD50 = func('color(xyz-d65 0.2 0.2 0.2)', { d50: true });
    assert.isArray(resD65ToD50);
    assert.strictEqual(resD65ToD50[0], 'xyz-d50');

    const resD65ToD65 = func('color(xyz-d65 0.2 0.2 0.2)');
    assert.isArray(resD65ToD65);
    assert.strictEqual(resD65ToD65[0], 'xyz-d65');
  });

  it('should return null when nullable option is true', () => {
    assert.strictEqual(func('invalid-color', { nullable: true }), null);
  });

  it('should return an empty string when format option causes to return a string', () => {
    const res = func('invalid-color', { format: 'specifiedValue' });
    assert.isString(res);
    assert.strictEqual(res, '');
  });

  it('should return SpecifiedColorChannels array fallback by default', () => {
    assert.deepEqual(func('invalid-color'), ['rgb', 0, 0, 0, 0]);
  });

  it('should return "none" as 5th element when format is "mixValue", v4 is "none"', () => {
    const res = func('color(srgb 1 0 0 / none)', {
      format: 'mixValue',
      colorSpace: 'display-p3'
    });
    assert.isArray(res);
    assert.strictEqual(res[0], 'xyz-d65');
    assert.strictEqual(res[4], 'none');
  });

  it('should return numeric alpha when format is "mixValue" but v4 is NOT "none"', () => {
    const res = func('color(srgb 1 0 0 / 0.5)', {
      format: 'mixValue',
      colorSpace: 'display-p3'
    });
    assert.isArray(res);
    assert.strictEqual(res[0], 'xyz-d65');
    assert.strictEqual(res[4], 0.5);
  });

  it('should return parsed numeric alpha (0) when v4 is "none" but format is NOT "mixValue"', () => {
    const res = func('color(srgb 1 0 0 / none)');
    assert.isArray(res);
    assert.strictEqual(res[0], 'xyz-d65');
    assert.strictEqual(res[4], 0);
  });
});

describe('parse parseColorValue()', () => {
  const func = parse.parseColorValue;

  it('should throw a TypeError if the input is not a string', () => {
    assert.throws(
      () => func(null as unknown as string),
      TypeError,
      'null is not a string.'
    );
    assert.throws(
      () => func(123 as unknown as string),
      TypeError,
      '123 is not a string.'
    );
    assert.throws(
      () => func(undefined as unknown as string),
      TypeError,
      'undefined is not a string.'
    );
  });

  it('should handle currentcolor keyword', () => {
    assert.deepEqual(func('currentcolor', { format: 'computedValue' }), [
      'rgb',
      0,
      0,
      0,
      0
    ]);
    assert.strictEqual(
      func('currentcolor', { format: 'specifiedValue' }),
      'currentcolor'
    );
  });

  it('should parse named colors correctly', () => {
    assert.strictEqual(func('red', { format: 'specifiedValue' }), 'red');
    assert.deepEqual(func('red', { format: 'computedValue' }), [
      'rgb',
      255,
      0,
      0,
      1
    ]);

    const resD65 = func('red');
    assert.isArray(resD65);
    assert.strictEqual(resD65[0], 'xyz-d65');

    const resD50 = func('red', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });

  it('should handle "transparent" and unknown named color strings', () => {
    assert.strictEqual(
      func('transparent', { format: 'specifiedValue' }),
      'transparent'
    );
    assert.deepEqual(func('transparent', { format: 'computedValue' }), [
      'rgb',
      0,
      0,
      0,
      0
    ]);
    assert.deepEqual(func('transparent', { format: 'mixValue' }), [
      'rgb',
      0,
      0,
      0,
      0
    ]);

    assert.strictEqual(func('unknowncolor', { format: 'specifiedValue' }), '');
    assert.deepEqual(func('unknowncolor', { format: 'computedValue' }), [
      'rgb',
      0,
      0,
      0,
      0
    ]);
    assert.strictEqual(
      func('unknowncolor', { format: 'computedValue', nullable: true }),
      null
    );
    assert.strictEqual(func('unknowncolor', { format: 'mixValue' }), null);
  });

  it('should parse hex colors correctly', () => {
    assert.deepEqual(func('#ff0000', { format: 'specifiedValue' }), [
      'rgb',
      255,
      0,
      0,
      1
    ]);

    const resD65 = func('#ff0000');
    assert.isArray(resD65);
    assert.strictEqual(resD65[0], 'xyz-d65');

    const resD50 = func('#ff0000', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });

  it('should parse lab() colors correctly', () => {
    assert.deepEqual(func('lab(50 20 -30)', { format: 'specifiedValue' }), [
      'lab',
      50,
      20,
      -30,
      1
    ]);

    const resD65 = func('lab(50 20 -30)');
    assert.isArray(resD65);
    assert.strictEqual(resD65[0], 'xyz-d65');

    const resD50 = func('lab(50 20 -30)', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });

  it('should parse lch() colors correctly', () => {
    assert.deepEqual(func('lch(50 20 180)', { format: 'specifiedValue' }), [
      'lch',
      50,
      20,
      180,
      1
    ]);

    const resD65 = func('lch(50 20 180)');
    assert.isArray(resD65);
    assert.strictEqual(resD65[0], 'xyz-d65');

    const resD50 = func('lch(50 20 180)', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });

  it('should parse oklab() colors correctly', () => {
    assert.deepEqual(
      func('oklab(0.6 0.1 -0.1)', { format: 'specifiedValue' }),
      ['oklab', 0.6, 0.1, -0.1, 1]
    );

    const resD65 = func('oklab(0.6 0.1 -0.1)');
    assert.isArray(resD65);
    assert.strictEqual(resD65[0], 'xyz-d65');

    const resD50 = func('oklab(0.6 0.1 -0.1)', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });

  it('should parse oklch() colors correctly', () => {
    assert.deepEqual(func('oklch(0.6 0.1 180)', { format: 'specifiedValue' }), [
      'oklch',
      0.6,
      0.1,
      180,
      1
    ]);

    const resD65 = func('oklch(0.6 0.1 180)');
    assert.isArray(resD65);
    assert.strictEqual(resD65[0], 'xyz-d65');

    const resD50 = func('oklch(0.6 0.1 180)', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });

  it('should parse hsl(), hwb(), and rgb() colors correctly', () => {
    assert.deepEqual(func('hsl(0 100% 50%)', { format: 'specifiedValue' }), [
      'rgb',
      255,
      0,
      0,
      1
    ]);
    assert.deepEqual(func('hwb(0 0% 0%)', { format: 'specifiedValue' }), [
      'rgb',
      255,
      0,
      0,
      1
    ]);
    assert.deepEqual(func('rgb(255 0 0)', { format: 'specifiedValue' }), [
      'rgb',
      255,
      0,
      0,
      1
    ]);

    const resD65 = func('hsl(0 100% 50%)');
    assert.isArray(resD65);
    assert.strictEqual(resD65[0], 'xyz-d65');

    const resD50 = func('hsl(0 100% 50%)', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });

  it('should return fallback values for invalid color strings', () => {
    assert.strictEqual(func('invalid-color', { nullable: true }), null);
    assert.strictEqual(func('invalid-color', { format: 'specifiedValue' }), '');
    assert.deepEqual(func('invalid-color'), ['rgb', 0, 0, 0, 0]);
  });

  it('should return the lowercased string for currentcolor', () => {
    assert.strictEqual(
      func('currentcolor', { format: 'specifiedValue' }),
      'currentcolor'
    );
    assert.strictEqual(
      func('CurrentColor', { format: 'specifiedValue' }),
      'currentcolor'
    );
    assert.strictEqual(
      func('CURRENTCOLOR', { format: 'specifiedValue' }),
      'currentcolor'
    );
  });

  it('should handle currentcolor when format is omitted or set to other values', () => {
    const resDefault = func('currentcolor');
    assert.isArray(resDefault);
    assert.strictEqual(resDefault[0], 'xyz-d65');

    const resEmptyObj = func('currentcolor', {});
    assert.deepEqual(resEmptyObj, resDefault);

    const resUndefined = func('currentcolor', { format: undefined });
    assert.deepEqual(resUndefined, resDefault);

    const resD50 = func('currentcolor', { d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');

    const resMix = func('currentcolor', { format: 'mixValue' });
    assert.isArray(resMix);

    const resCustomFormat = func('currentcolor', { format: 'foo' as any });
    assert.deepEqual(resCustomFormat, resDefault);
  });

  it('should return the fallback value when format is unknown', () => {
    const resUnknownFormat = func('unknowncolor', { format: 'foo' as any });
    assert.isArray(resUnknownFormat);
    assert.strictEqual(resUnknownFormat[0], 'xyz-d65');

    const resTransparent = func('transparent', { format: 'bar' as any });
    assert.isArray(resTransparent);
    assert.strictEqual(resTransparent[0], 'xyz-d65');

    const resUndefinedFormat = func('unknowncolor', { format: undefined });
    assert.isArray(resUndefinedFormat);
    assert.strictEqual(resUndefinedFormat[0], 'xyz-d65');

    const resD50 = func('unknowncolor', { format: 'baz' as any, d50: true });
    assert.isArray(resD50);
    assert.strictEqual(resD50[0], 'xyz-d50');
  });
});
