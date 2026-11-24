/**
 * serialize.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/utils/cache';
import { NONE, VAL_COMP, VAL_MIX, VAL_SPEC } from '../src/utils/constant';
import { parseColorGeneric } from '../src/utils/util';
import * as serialize from '../src/utils/serialize';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('serialize alpha', () => {
  const func = serialize.serializeAlpha;

  it('should return NaN', () => {
    assert.deepEqual(func(), Number.NaN);
    assert.deepEqual(func(null), Number.NaN);
    assert.deepEqual(func([]), Number.NaN);
    assert.deepEqual(func({}), Number.NaN);
    assert.deepEqual(func('foo'), Number.NaN);
    assert.deepEqual(func(Number.NaN), Number.NaN);
  });

  it('should clamp alpha value between 0 and 1', () => {
    assert.strictEqual(func(-0.5), 0);
    assert.strictEqual(func(1.5), 1);
    assert.strictEqual(func(0), 0);
    assert.strictEqual(func(1), 1);
  });

  it('should round alpha value to HEX precision', () => {
    assert.strictEqual(func(0.5), 0.5);
    assert.strictEqual(func(0.1234567), 0.123457);
  });
});

describe('serialize HSL', () => {
  const func = serialize.serializeHsl;

  it('should serialize HSL color data to rgb channels', () => {
    const parsedRed = parseColorGeneric('hsl(0 100% 50%)');
    assert.deepEqual(func(parsedRed), ['rgb', 255, 0, 0, 1]);
    const parsedGreen = parseColorGeneric('hsl(120 100% 50% / 0.5)');
    assert.deepEqual(func(parsedGreen), ['rgb', 0, 255, 0, 0.5]);
    const parsedBlue = parseColorGeneric('hsl(240 100% 50%)');
    assert.deepEqual(func(parsedBlue), ['rgb', 0, 0, 255, 1]);
  });

  it('should clamp out-of-range saturation and lightness values', () => {
    const parsed = parseColorGeneric('hsl(0 150% 120%)');
    assert.deepEqual(func(parsed), ['rgb', 255, 255, 255, 1]);
  });

  it('should preserve none keywords when HasNoneKeywords flag is set', () => {
    const parsed = parseColorGeneric('hsl(none 100% 50% / none)');
    assert.deepEqual(func(parsed), ['hsl', NONE, 100, 50, NONE]);
  });

  it('should preserve channels and none keywords when format is VAL_MIX', () => {
    const parsed = parseColorGeneric('hsl(120 100% 50%)');
    assert.deepEqual(func(parsed, { format: VAL_MIX }), [
      'hsl',
      120,
      100,
      50,
      1
    ]);

    const parsedNone = parseColorGeneric('hsl(120 none 50%)');
    assert.deepEqual(func(parsedNone, { format: VAL_MIX }), [
      'hsl',
      120,
      NONE,
      50,
      1
    ]);
  });

  it('should handle c3 none preservation and rounding in serializeHsl when preserveNone is true', () => {
    const parsedNoneC3 = parseColorGeneric('hsl(120 100% none)');
    assert.deepEqual(func(parsedNoneC3), ['hsl', 120, 100, NONE, 1]);
    const parsedNoneC3Mix = parseColorGeneric('hsl(120 100% none)');
    assert.deepEqual(func(parsedNoneC3Mix, { format: VAL_MIX }), [
      'hsl',
      120,
      100,
      NONE,
      1
    ]);
    const parsedRoundedC3 = parseColorGeneric('hsl(none 100% 33.33333%)');
    assert.deepEqual(func(parsedRoundedC3), ['hsl', NONE, 100, 33.3333, 1]);
    const parsedRoundedC3Mix = parseColorGeneric('hsl(120 100% 33.33333%)');
    assert.deepEqual(func(parsedRoundedC3Mix, { format: VAL_MIX }), [
      'hsl',
      120,
      100,
      33.3333,
      1
    ]);
  });
});

describe('serialize HWB', () => {
  const func = serialize.serializeHwb;

  it('should serialize HWB color data to rgb channels', () => {
    const parsedRed = parseColorGeneric('hwb(0 0% 0%)');
    assert.deepEqual(func(parsedRed), ['rgb', 255, 0, 0, 1]);
    const parsedGreen = parseColorGeneric('hwb(120 0% 0% / 0.5)');
    assert.deepEqual(func(parsedGreen), ['rgb', 0, 255, 0, 0.5]);
    const parsedTinted = parseColorGeneric('hwb(240 20% 20%)');
    assert.deepEqual(func(parsedTinted), ['rgb', 51, 51, 204, 1]);
  });

  it('should handle achromatic colors when whiteness + blackness >= 100%', () => {
    const parsedGray = parseColorGeneric('hwb(120 60% 60%)');
    assert.deepEqual(func(parsedGray), ['rgb', 128, 128, 128, 1]);
    const parsedWhite = parseColorGeneric('hwb(0 100% 0%)');
    assert.deepEqual(func(parsedWhite), ['rgb', 255, 255, 255, 1]);
    const parsedBlack = parseColorGeneric('hwb(0 0% 100%)');
    assert.deepEqual(func(parsedBlack), ['rgb', 0, 0, 0, 1]);
  });

  it('should preserve none keywords when HasNoneKeywords flag is set', () => {
    const parsed = parseColorGeneric('hwb(none 20% 30% / none)');
    assert.deepEqual(func(parsed), ['hwb', NONE, 20, 30, NONE]);
  });

  it('should preserve channels and none keywords when format is VAL_MIX', () => {
    const parsed = parseColorGeneric('hwb(120 20% 30%)');
    assert.deepEqual(func(parsed, { format: VAL_MIX }), [
      'hwb',
      120,
      20,
      30,
      1
    ]);
    const parsedNone = parseColorGeneric('hwb(120 none 30%)');
    assert.deepEqual(func(parsedNone, { format: VAL_MIX }), [
      'hwb',
      120,
      NONE,
      30,
      1
    ]);
  });

  it('should handle none preservation and rounding in serializeHwb when preserveNone is true', () => {
    const parsedNoneC3 = parseColorGeneric('hwb(120 20% none)');
    assert.deepEqual(func(parsedNoneC3), ['hwb', 120, 20, NONE, 1]);
    const parsedNoneC3Mix = parseColorGeneric('hwb(120 20% none)');
    assert.deepEqual(func(parsedNoneC3Mix, { format: VAL_MIX }), [
      'hwb',
      120,
      20,
      NONE,
      1
    ]);
    const parsedRoundedC3 = parseColorGeneric('hwb(none 20% 33.33333%)');
    assert.deepEqual(func(parsedRoundedC3), ['hwb', NONE, 20, 33.3333, 1]);
    const parsedRoundedC3Mix = parseColorGeneric('hwb(120 20% 33.33333%)');
    assert.deepEqual(func(parsedRoundedC3Mix, { format: VAL_MIX }), [
      'hwb',
      120,
      20,
      33.3333,
      1
    ]);
  });
});

describe('serialize color value', () => {
  const func = serialize.serializeColorValue;

  it('should throw TypeError if value is not a string', () => {
    assert.throws(() => func(123), TypeError);
    assert.throws(() => func(null), TypeError);
  });

  it('should return null for invalid color values', () => {
    assert.isNull(func(''));
    assert.isNull(func('   '));
    assert.isNull(func('invalid_color'));
    assert.isNull(func('notacolorname'));
  });

  it('should handle currentcolor keyword', () => {
    assert.strictEqual(
      func('currentcolor', { format: VAL_SPEC }),
      'currentcolor'
    );
    assert.strictEqual(
      func('currentColor', { format: VAL_SPEC }),
      'currentcolor'
    );
    assert.deepEqual(func('currentcolor'), ['srgb', NONE, NONE, NONE, NONE]);
    assert.deepEqual(func('currentcolor', { currentColor: '' }), [
      'srgb',
      NONE,
      NONE,
      NONE,
      NONE
    ]);
    assert.deepEqual(func('currentcolor', { currentColor: '   ' }), [
      'srgb',
      NONE,
      NONE,
      NONE,
      NONE
    ]);
    assert.deepEqual(func('currentcolor', { currentColor: 'blue' }), [
      'rgb',
      0,
      0,
      255,
      1
    ]);
    assert.deepEqual(func('currentColor', { currentColor: '#00ff00' }), [
      'rgb',
      0,
      255,
      0,
      1
    ]);
  });

  it('should handle named colors and transparent', () => {
    assert.strictEqual(func('red', { format: VAL_SPEC }), 'red');
    assert.strictEqual(func('RED', { format: VAL_SPEC }), 'red');
    assert.strictEqual(
      func('transparent', { format: VAL_SPEC }),
      'transparent'
    );
    assert.deepEqual(func('red'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(func('BLUE'), ['rgb', 0, 0, 255, 1]);
    assert.deepEqual(func('transparent'), ['rgb', 0, 0, 0, 0]);
    assert.deepEqual(func('transparent', { format: VAL_COMP }), [
      'rgb',
      0,
      0,
      0,
      0
    ]);
  });

  it('should serialize hex colors correctly', () => {
    assert.deepEqual(func('#f00'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(
      func('#f00', {
        colorSpace: 'srgb'
      }),
      ['srgb', 1, 0, 0, 1]
    );
    assert.deepEqual(func('#00ff00'), ['rgb', 0, 255, 0, 1]);
    assert.deepEqual(
      func('#00ff00', {
        colorSpace: 'srgb'
      }),
      ['srgb', 0, 1, 0, 1]
    );
    assert.deepEqual(func('#0000ff80'), ['rgb', 0, 0, 255, 0.5]);
    assert.deepEqual(
      func('#0000ff80', {
        colorSpace: 'srgb'
      }),
      ['srgb', 0, 0, 1, 0.5]
    );
    assert.deepEqual(func('#0000'), ['rgb', 0, 0, 0, 0]);
    assert.deepEqual(
      func('#0000', {
        colorSpace: 'srgb'
      }),
      ['srgb', 0, 0, 0, 0]
    );
  });

  it('should serialize rgb and rgba functions', () => {
    assert.deepEqual(func('rgb(255, 0, 0)'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(func('rgba(0, 255, 0, 0.5)'), ['rgb', 0, 255, 0, 0.5]);
    assert.deepEqual(func('rgb(255 0 0 / 50%)'), ['rgb', 255, 0, 0, 0.5]);
  });

  it('should serialize rgb to srgb with none preservation when preserveNone is true', () => {
    assert.deepEqual(func('rgb(none 0 255)'), ['srgb', NONE, 0, 1, 1]);
    assert.deepEqual(func('rgb(255 0 0)', { format: VAL_MIX }), [
      'srgb',
      1,
      0,
      0,
      1
    ]);
    assert.deepEqual(func('rgb(255 none 0 / none)', { format: VAL_MIX }), [
      'srgb',
      1,
      NONE,
      0,
      NONE
    ]);
  });

  it('should handle none preservation and rounding in rgb when preserveNone is true', () => {
    assert.deepEqual(func('rgb(255 0 none)'), ['srgb', 1, 0, NONE, 1]);
    assert.deepEqual(func('rgb(255 0 none)', { format: VAL_MIX }), [
      'srgb',
      1,
      0,
      NONE,
      1
    ]);
    assert.deepEqual(func('rgb(none 0 128)'), ['srgb', NONE, 0, 0.501961, 1]);
    assert.deepEqual(func('rgb(255 0 128)', { format: VAL_MIX }), [
      'srgb',
      1,
      0,
      0.501961,
      1
    ]);
  });

  it('should delegate hsl and hwb functions to serializeHsl and serializeHwb', () => {
    assert.deepEqual(func('hsl(0 100% 50%)'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(func('hsl(0 100% 50%)', { format: VAL_MIX }), [
      'hsl',
      0,
      100,
      50,
      1
    ]);
    assert.deepEqual(func('hwb(120 0% 0%)'), ['rgb', 0, 255, 0, 1]);
    assert.deepEqual(func('hwb(120 0% 0%)', { format: VAL_MIX }), [
      'hwb',
      120,
      0,
      0,
      1
    ]);
  });

  it('should serialize srgb, display-p3, and a98-rgb color spaces', () => {
    assert.deepEqual(func('color(srgb 1 0.5 0)'), ['srgb', 1, 0.5, 0, 1]);
    assert.deepEqual(func('color(display-p3 1 0 0 / 0.5)'), [
      'display-p3',
      1,
      0,
      0,
      0.5
    ]);
    assert.deepEqual(func('color(a98-rgb 0.25 0.5 0.75)'), [
      'a98-rgb',
      0.25,
      0.5,
      0.75,
      1
    ]);
    assert.deepEqual(func('color(srgb none 0.5 0 / none)'), [
      'srgb',
      NONE,
      0.5,
      0,
      NONE
    ]);
  });

  it('should handle none preservation and rounding in srgb, display-p3, and a98-rgb color spaces', () => {
    assert.deepEqual(func('color(srgb 0.1 none 0.3)'), [
      'srgb',
      0.1,
      NONE,
      0.3,
      1
    ]);
    assert.deepEqual(func('color(a98-rgb 0.1 none 0.3)'), [
      'a98-rgb',
      0.1,
      NONE,
      0.3,
      1
    ]);
    assert.deepEqual(func('color(srgb 0.1 0.1234567 0.3)'), [
      'srgb',
      0.1,
      0.123457,
      0.3,
      1
    ]);
    assert.deepEqual(
      func('color(display-p3 0.1 0.1234567 0.3)', { format: VAL_MIX }),
      ['display-p3', 0.1, 0.123457, 0.3, 1]
    );
    assert.deepEqual(func('color(a98-rgb 0.1 0.1234567 0.3)'), [
      'a98-rgb',
      0.1,
      0.123457,
      0.3,
      1
    ]);
  });

  it('should handle none preservation and rounding in srgb, display-p3, and a98-rgb color spaces', () => {
    assert.deepEqual(func('color(srgb 0.1 0.2 none)'), [
      'srgb',
      0.1,
      0.2,
      NONE,
      1
    ]);
    assert.deepEqual(func('color(a98-rgb 0.1 0.2 none)'), [
      'a98-rgb',
      0.1,
      0.2,
      NONE,
      1
    ]);
    assert.deepEqual(func('color(srgb 0.1 0.2 0.1234567)'), [
      'srgb',
      0.1,
      0.2,
      0.123457,
      1
    ]);
    assert.deepEqual(
      func('color(display-p3 0.1 0.2 0.1234567)', { format: VAL_MIX }),
      ['display-p3', 0.1, 0.2, 0.123457, 1]
    );
    assert.deepEqual(func('color(a98-rgb 0.1 0.2 0.1234567)'), [
      'a98-rgb',
      0.1,
      0.2,
      0.123457,
      1
    ]);
  });

  it('should serialize srgb-linear, display-p3-linear, prophoto-rgb, and rec2020 color spaces', () => {
    assert.deepEqual(func('color(srgb-linear 0.1234567 0 1)'), [
      'srgb-linear',
      0.123457,
      0,
      1,
      1
    ]);
    assert.deepEqual(func('color(display-p3-linear 0.5 0.5 0.5)'), [
      'display-p3-linear',
      0.5,
      0.5,
      0.5,
      1
    ]);
    assert.deepEqual(func('color(prophoto-rgb 0.2 0.4 0.6)'), [
      'prophoto-rgb',
      0.2,
      0.4,
      0.6,
      1
    ]);
    assert.deepEqual(func('color(rec2020 0.1 0.2 0.3 / none)'), [
      'rec2020',
      0.1,
      0.2,
      0.3,
      NONE
    ]);
  });

  it('should handle none preservation and rounding in linear and wide-gamut RGB color spaces', () => {
    assert.deepEqual(func('color(srgb-linear none 0.2 0.3)'), [
      'srgb-linear',
      NONE,
      0.2,
      0.3,
      1
    ]);
    assert.deepEqual(func('color(rec2020 none 0.2 0.3)'), [
      'rec2020',
      NONE,
      0.2,
      0.3,
      1
    ]);
    assert.deepEqual(func('color(srgb-linear 0.1234567 0.2 0.3)'), [
      'srgb-linear',
      0.123457,
      0.2,
      0.3,
      1
    ]);
    assert.deepEqual(
      func('color(prophoto-rgb 0.1234567 0.2 0.3)', { format: VAL_MIX }),
      ['prophoto-rgb', 0.123457, 0.2, 0.3, 1]
    );
    assert.deepEqual(func('color(display-p3-linear 0.1234567 0.2 0.3)'), [
      'display-p3-linear',
      0.123457,
      0.2,
      0.3,
      1
    ]);
  });

  it('should handle none preservation and rounding in linear and wide-gamut RGB color spaces', () => {
    assert.deepEqual(func('color(srgb-linear 0.1 none 0.3)'), [
      'srgb-linear',
      0.1,
      NONE,
      0.3,
      1
    ]);
    assert.deepEqual(func('color(rec2020 0.1 none 0.3)'), [
      'rec2020',
      0.1,
      NONE,
      0.3,
      1
    ]);
    assert.deepEqual(func('color(srgb-linear 0.1 0.1234567 0.3)'), [
      'srgb-linear',
      0.1,
      0.123457,
      0.3,
      1
    ]);
    assert.deepEqual(
      func('color(prophoto-rgb 0.1 0.1234567 0.3)', { format: VAL_MIX }),
      ['prophoto-rgb', 0.1, 0.123457, 0.3, 1]
    );
    assert.deepEqual(func('color(display-p3-linear 0.1 0.1234567 0.3)'), [
      'display-p3-linear',
      0.1,
      0.123457,
      0.3,
      1
    ]);
  });

  it('should handle c3 none preservation and rounding in linear and wide-gamut RGB color spaces', () => {
    assert.deepEqual(func('color(srgb-linear 0.1 0.2 none)'), [
      'srgb-linear',
      0.1,
      0.2,
      NONE,
      1
    ]);
    assert.deepEqual(func('color(rec2020 0.1 0.2 none)'), [
      'rec2020',
      0.1,
      0.2,
      NONE,
      1
    ]);
    assert.deepEqual(func('color(srgb-linear 0.1 0.2 0.1234567)'), [
      'srgb-linear',
      0.1,
      0.2,
      0.123457,
      1
    ]);
    assert.deepEqual(
      func('color(prophoto-rgb 0.1 0.2 0.1234567)', { format: VAL_MIX }),
      ['prophoto-rgb', 0.1, 0.2, 0.123457, 1]
    );
    assert.deepEqual(func('color(display-p3-linear 0.1 0.2 0.1234567)'), [
      'display-p3-linear',
      0.1,
      0.2,
      0.123457,
      1
    ]);
  });

  it('should serialize lab, lch, oklab, oklch, and xyz color spaces (default branch)', () => {
    assert.deepEqual(func('lab(50 20 30)'), ['lab', 50, 20, 30, 1]);
    assert.deepEqual(func('lch(50 20 30 / 0.5)'), ['lch', 50, 20, 30, 0.5]);
    assert.deepEqual(func('oklab(0.5 0.1 -0.1)'), ['oklab', 0.5, 0.1, -0.1, 1]);
    assert.deepEqual(func('oklch(0.6 0.15 180)'), ['oklch', 0.6, 0.15, 180, 1]);
    assert.deepEqual(func('color(xyz-d65 0.2 0.3 0.4)'), [
      'xyz-d65',
      0.2,
      0.3,
      0.4,
      1
    ]);
    assert.deepEqual(func('oklch(none 0.15 180 / none)'), [
      'oklch',
      NONE,
      0.15,
      180,
      NONE
    ]);
  });

  it('should handle none preservation and rounding in default color spaces', () => {
    assert.deepEqual(func('oklch(0.6 none 180)'), ['oklch', 0.6, NONE, 180, 1]);
    assert.deepEqual(func('lab(50 none 30)'), ['lab', 50, NONE, 30, 1]);
    assert.deepEqual(func('oklch(none 0.1234567 180)'), [
      'oklch',
      NONE,
      0.123457,
      180,
      1
    ]);
    assert.deepEqual(func('lab(50 12.34567 30)', { format: VAL_MIX }), [
      'lab',
      50,
      12.3457,
      30,
      1
    ]);
    assert.deepEqual(func('lab(50 12.34567 30)'), ['lab', 50, 12.3457, 30, 1]);
  });

  it('should handle none preservation and rounding in default color spaces', () => {
    assert.deepEqual(func('oklch(0.6 0.15 none)'), [
      'oklch',
      0.6,
      0.15,
      NONE,
      1
    ]);
    assert.deepEqual(func('lab(50 20 none)'), ['lab', 50, 20, NONE, 1]);
    assert.deepEqual(func('oklch(none 0.15 180.1234567)'), [
      'oklch',
      NONE,
      0.15,
      180.123,
      1
    ]);
    assert.deepEqual(func('lab(50 20 12.34567)', { format: VAL_MIX }), [
      'lab',
      50,
      20,
      12.3457,
      1
    ]);
    assert.deepEqual(func('lab(50 20 12.34567)'), ['lab', 50, 20, 12.3457, 1]);
  });
});
