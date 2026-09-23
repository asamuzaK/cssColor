/**
 * convert-color.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/utils/cache';
import * as color from '../src/converters/convert-color';

const assertDeepCloseTo = (
  actual: ArrayLike<number> | null,
  expected: number[],
  delta = 1e-4
) => {
  assert.isNotNull(actual);
  if (!actual) return;
  assert.strictEqual(actual.length, expected.length);
  for (let i = 0; i < expected.length; i++) {
    assert.closeTo(actual[i], expected[i], delta, `at index ${i}`);
  }
};

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('convert color value to linear rgb', () => {
  const func = color.convertColorToLinearRgb;

  it('should throw TypeError if input is not a string', () => {
    assert.throws(() => func(123), TypeError);
    assert.throws(() => func(null), TypeError);
  });

  it('should convert color(srgb-linear ...) format correctly', () => {
    const res = func('color(srgb-linear 0.2 0.4 0.6 / 0.8)');
    assertDeepCloseTo(res, [0.2, 0.4, 0.6, 0.8]);
  });

  it('should convert color(srgb ...) format to linear rgb', () => {
    const resBlack = func('color(srgb 0 0 0)');
    assertDeepCloseTo(resBlack, [0, 0, 0, 1]);

    const resWhite = func('color(srgb 1 1 1)');
    assertDeepCloseTo(resWhite, [1, 1, 1, 1]);
  });

  it('should convert standard color formats (hex, rgb, etc.)', () => {
    const resBlack = func('#000000');
    assertDeepCloseTo(resBlack, [0, 0, 0, 1]);

    const resWhite = func('rgb(255 255 255)');
    assertDeepCloseTo(resWhite, [1, 1, 1, 1]);
  });

  it('should clamp converted linear rgb channels between 0 and 1', () => {
    const res = func('rgb(300 -10 100)');
    assert.isNotNull(res);
    if (res) {
      assert.isAtLeast(res[0], 0);
      assert.isAtMost(res[0], 1);
      assert.isAtLeast(res[1], 0);
      assert.isAtMost(res[1], 1);
    }
  });

  it('should handle format: "mixValue" option', () => {
    const resSameCs = func('color(srgb 0.2 0.4 0.6 / 0.8)', {
      format: 'mixValue',
      colorSpace: 'srgb'
    });
    assertDeepCloseTo(resSameCs, [0.2, 0.4, 0.6, 0.8]);

    const resNull = func('invalid-color', {
      format: 'mixValue'
    });
    assert.isNull(resNull);
  });
});

describe('convert color value to rgb', () => {
  const func = color.convertColorToRgb;

  it('should throw TypeError if input is not a string', () => {
    assert.throws(() => func(123), TypeError);
    assert.throws(() => func(null), TypeError);
  });

  it('should convert color(srgb ...) format to rgb (0..255)', () => {
    const resBlack = func('color(srgb 0 0 0)');
    assertDeepCloseTo(resBlack, [0, 0, 0, 1]);

    const resWhite = func('color(srgb 1 1 1)');
    assertDeepCloseTo(resWhite, [255, 255, 255, 1]);

    const resHalf = func('color(srgb 0.5 0.5 0.5 / 0.5)');
    assertDeepCloseTo(resHalf, [127.5, 127.5, 127.5, 0.5]);
  });

  it('should convert color() with other color spaces to rgb', () => {
    const resDisplayP3 = func('color(display-p3 1 1 1)');
    assertDeepCloseTo(resDisplayP3, [255, 255, 255, 1]);
  });

  it('should convert lab/lch/oklab/oklch formats via linear rgb', () => {
    const resLabWhite = func('lab(100% 0 0)');
    assertDeepCloseTo(resLabWhite, [255, 255, 255, 1]);

    const resOklabBlack = func('oklab(0 0 0)');
    assertDeepCloseTo(resOklabBlack, [0, 0, 0, 1]);
  });

  it('should convert standard color formats (hex, rgb, etc.)', () => {
    const resHex = func('#ff0000');
    assertDeepCloseTo(resHex, [255, 0, 0, 1]);

    const resRgb = func('rgb(0 255 0 / 0.8)');
    assertDeepCloseTo(resRgb, [0, 255, 0, 0.8]);
  });

  it('should handle format: "mixValue" option', () => {
    const resMix = func('color(srgb 1 0 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resMix);

    const resNull = func('invalid-color', {
      format: 'mixValue'
    });
    assert.isNull(resNull);
  });
});

describe('convert color value to xyz', () => {
  const func = color.convertColorToXyz;

  it('should throw TypeError if input is not a string', () => {
    assert.throws(() => func(123), TypeError);
    assert.throws(() => func(null), TypeError);
  });

  it('should convert standard color formats to xyz (D65)', () => {
    const resBlack = func('#000000');
    assertDeepCloseTo(resBlack, [0, 0, 0, 1]);

    const resWhite = func('rgb(255 255 255)');
    assertDeepCloseTo(resWhite, [0.95047, 1.0, 1.08883, 1], 1e-3);
  });

  it('should handle d50 option correctly', () => {
    const resWhiteD50 = func('rgb(255 255 255)', { d50: true });
    assertDeepCloseTo(resWhiteD50, [0.96422, 1.0, 0.82521, 1], 1e-3);
  });

  it('should convert color(xyz ...) and color(xyz-d50 ...) formats', () => {
    const resXyz = func('color(xyz 0.5 0.5 0.5 / 0.8)');
    assertDeepCloseTo(resXyz, [0.5, 0.5, 0.5, 0.8]);

    const resXyzD50 = func('color(xyz-d50 0.5 0.5 0.5 / 0.8)', { d50: true });
    assertDeepCloseTo(resXyzD50, [0.5, 0.5, 0.5, 0.8]);
  });

  it('should handle format: "mixValue" option', () => {
    const resMix = func('color(srgb 1 0 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resMix);

    const resNull = func('invalid-color', {
      format: 'mixValue'
    });
    assert.isNull(resNull);
  });

  it('should parse color() when d50 is true and cs is not xyz-d50', () => {
    const resSrgb = func('color(srgb 1 0 0)', { d50: true });
    assert.isNotNull(resSrgb);
    if (resSrgb) {
      assertDeepCloseTo(resSrgb as number[], [0.4361, 0.2225, 0.0139, 1], 1e-3);
    }

    const resP3 = func('color(display-p3 1 0 0)', { d50: true });
    assert.isNotNull(resP3);
    if (resP3) {
      assert.strictEqual(resP3[3], 1);
    }
  });

  it('should parse color() when d50 is falsy and cs is not xyz/xyz-d65', () => {
    const resSrgb = func('color(srgb 0.2 0.4 0.6 / 0.8)');
    assert.isNotNull(resSrgb);
    if (resSrgb) {
      assertDeepCloseTo(
        resSrgb as number[],
        [0.1187, 0.1251, 0.3193, 0.8],
        1e-3
      );
    }

    const resP3 = func('color(display-p3 1 0 0)', { d50: false });
    assert.isNotNull(resP3);
    if (resP3) {
      assertDeepCloseTo(resP3 as number[], [0.4866, 0.2289, 0.0, 1], 1e-3);
    }
  });
});

describe('convert color value to hsl', () => {
  const func = color.convertColorToHsl;

  it('should throw TypeError if input is not a string', () => {
    assert.throws(() => func(123), TypeError);
    assert.throws(() => func(null), TypeError);
  });

  it('should parse hsl() format correctly', () => {
    const res = func('hsl(120 100% 50% / 0.8)');
    assertDeepCloseTo(res as number[], [120, 100, 50, 0.8]);

    const resRounded = func('hsl(120.4 99.6% 50.2%)', { format: 'hsl' });
    assert.deepEqual(resRounded, [120, 100, 50, 1]);
  });

  it('should convert standard color formats to hsl', () => {
    const resRed = func('#ff0000');
    assertDeepCloseTo(resRed as number[], [0, 100, 50, 1]);

    const resWhite = func('rgb(255 255 255)');
    assertDeepCloseTo(resWhite as number[], [0, 0, 100, 1]);
  });

  it('should handle format: "mixValue" option and powerless hue', () => {
    const resAchromaticMix = func('rgb(128 128 128)', {
      format: 'mixValue'
    });
    assert.isNotNull(resAchromaticMix);
    if (resAchromaticMix) {
      assert.strictEqual(resAchromaticMix[0], 'none');
      assert.closeTo(resAchromaticMix[1] as number, 0, 1e-4);
      assert.closeTo(resAchromaticMix[2] as number, 50.196, 1e-3);
      assert.strictEqual(resAchromaticMix[3], 1);
    }

    const resChromaticMix = func('rgb(255 0 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resChromaticMix);
    if (resChromaticMix) {
      assert.closeTo(resChromaticMix[0] as number, 0, 1e-4);
      assert.closeTo(resChromaticMix[1] as number, 100, 1e-4);
    }

    const resNull = func('invalid-color', {
      format: 'mixValue'
    });
    assert.isNull(resNull);
  });

  it('should round h, s, l values when format option is "hsl"', () => {
    const res = func('rgb(123 45 67)', { format: 'hsl' });
    assert.isNotNull(res);
    if (res) {
      assert.strictEqual(res[0], Math.round(res[0] as number));
      assert.strictEqual(res[1], Math.round(res[1] as number));
      assert.strictEqual(res[2], Math.round(res[2] as number));
      assert.strictEqual(res[3], 1);
    }
  });

  it('should parse color() function formats via parseColorFunc branch', () => {
    const resSrgb = func('color(srgb 0.2 0.4 0.6 / 0.8)');
    assertDeepCloseTo(resSrgb as number[], [210, 50, 40, 0.8], 1e-3);

    const resP3 = func('color(display-p3 1 0 0)');
    assertDeepCloseTo(resP3 as number[], [0, 100, 50, 1], 1e-3);
  });

  it('should parse color() function when format is mixValue', () => {
    const res = func('color(srgb 0.2 0.4 0.6 / 0.8)', {
      format: 'mixValue'
    });
    assertDeepCloseTo(res as number[], [210, 50, 40, 0.8], 1e-1);

    const resAchromatic = func('color(srgb 0 0 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resAchromatic);
    if (resAchromatic) {
      assert.strictEqual(resAchromatic[0], 'none');
      assert.closeTo(resAchromatic[1] as number, 0, 1e-4);
      assert.closeTo(resAchromatic[2] as number, 0, 1e-4);
      assert.strictEqual(resAchromatic[3], 1);
    }
  });
});

describe('convert color value to hwb', () => {
  const func = color.convertColorToHwb;

  it('should throw TypeError if input is not a string', () => {
    assert.throws(() => func(123), TypeError);
    assert.throws(() => func(null), TypeError);
  });

  it('should parse hwb() format correctly', () => {
    const res = func('hwb(120 10% 20% / 0.8)');
    assertDeepCloseTo(res as number[], [120, 10, 20, 0.8]);

    const resRounded = func('hwb(120.4 9.6% 20.2%)', { format: 'hwb' });
    assert.deepEqual(resRounded, [120, 10, 20, 1]);
  });

  it('should convert standard color formats to hwb', () => {
    const resRed = func('#ff0000');
    assertDeepCloseTo(resRed as number[], [0, 0, 0, 1]);

    const resWhite = func('rgb(255 255 255)');
    assertDeepCloseTo(resWhite as number[], [0, 100, 0, 1]);

    const resBlack = func('rgb(0 0 0)');
    assertDeepCloseTo(resBlack as number[], [0, 0, 100, 1]);
  });

  it('should handle format: "mixValue" option and powerless hue', () => {
    const resAchromaticMix = func('rgb(128 128 128)', {
      format: 'mixValue'
    });
    assert.isNotNull(resAchromaticMix);
    if (resAchromaticMix) {
      assert.strictEqual(resAchromaticMix[0], 'none');
      assert.closeTo(resAchromaticMix[1] as number, 50.196, 1e-3);
      assert.closeTo(resAchromaticMix[2] as number, 49.803, 1e-3);
      assert.strictEqual(resAchromaticMix[3], 1);
    }

    const resChromaticMix = func('rgb(255 0 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resChromaticMix);
    if (resChromaticMix) {
      assert.closeTo(resChromaticMix[0] as number, 0, 1e-4);
      assert.closeTo(resChromaticMix[1] as number, 0, 1e-4);
      assert.closeTo(resChromaticMix[2] as number, 0, 1e-4);
    }

    const resNull = func('invalid-color', {
      format: 'mixValue'
    });
    assert.isNull(resNull);
  });

  it('should round h, w, b values when format option is "hwb"', () => {
    const res = func('rgb(123 45 67)', { format: 'hwb' });
    assert.isNotNull(res);
    if (res) {
      assert.strictEqual(res[0], Math.round(res[0] as number));
      assert.strictEqual(res[1], Math.round(res[1] as number));
      assert.strictEqual(res[2], Math.round(res[2] as number));
      assert.strictEqual(res[3], 1);
    }
  });

  it('should parse color() function formats via parseColorFunc branch', () => {
    const resSrgb = func('color(srgb 0.2 0.4 0.6 / 0.8)');
    assertDeepCloseTo(resSrgb as number[], [210, 20, 40, 0.8], 1e-3);

    const resP3 = func('color(display-p3 1 0 0)');
    assertDeepCloseTo(resP3 as number[], [0, 0, 0, 1], 1e-3);
  });

  it('should parse color() function when format is mixValue', () => {
    const res = func('color(srgb 0.2 0.4 0.6 / 0.8)', {
      format: 'mixValue'
    });
    assertDeepCloseTo(res as number[], [210, 20, 40, 0.8], 1e-3);

    const resAchromatic = func('color(srgb 0 0 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resAchromatic);
    if (resAchromatic) {
      assert.strictEqual(resAchromatic[0], 'none');
      assert.closeTo(resAchromatic[1] as number, 0, 1e-3);
      assert.closeTo(resAchromatic[2] as number, 100, 1e-3);
      assert.strictEqual(resAchromatic[3], 1);
    }
  });
});

describe('convert color value to lab', () => {
  const func = color.convertColorToLab;

  it('should throw TypeError if input is not a string', () => {
    assert.throws(() => func(123), TypeError);
    assert.throws(() => func(null), TypeError);
  });

  it('should parse lab() format correctly', () => {
    const res = func('lab(50 20 -30 / 0.8)');
    assertDeepCloseTo(res, [50, 20, -30, 0.8]);
  });

  it('should convert standard color formats to lab', () => {
    const resBlack = func('#000000');
    assertDeepCloseTo(resBlack, [0, 0, 0, 1]);

    const resWhite = func('rgb(255 255 255)');
    assertDeepCloseTo(resWhite, [100, 0, 0, 1], 1e-3);
  });

  it('should convert color() format to lab via d50 xyz', () => {
    const res = func('color(srgb 1 0 0)');
    assert.isNotNull(res);
    if (res) {
      assert.closeTo(res[0], 54.291, 1e-3);
      assert.closeTo(res[1], 80.805, 1e-3);
      assert.closeTo(res[2], 69.89, 1e-3);
      assert.strictEqual(res[3], 1);
    }
  });

  it('should handle format: "mixValue" option', () => {
    const resMix = func('color(srgb 0 1 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resMix);

    const resNull = func('invalid-color', {
      format: 'mixValue'
    });
    assert.isNull(resNull);
  });
});

describe('convert color value to lch', () => {
  const func = color.convertColorToLch;

  it('should throw TypeError if input is not a string', () => {
    assert.throws(() => func(123), TypeError);
    assert.throws(() => func(null), TypeError);
  });

  it('should parse lch() format correctly', () => {
    const res = func('lch(50 30 120 / 0.8)');
    assertDeepCloseTo(res as number[], [50, 30, 120, 0.8]);
  });

  it('should convert standard color formats to lch', () => {
    const resBlack = func('#000000');
    assertDeepCloseTo(resBlack as number[], [0, 0, 0, 1]);

    const resWhite = func('rgb(255 255 255)');
    assertDeepCloseTo(resWhite as number[], [100, 0, 0, 1], 1e-3);
  });

  it('should convert color() format to lch via d50 xyz', () => {
    const res = func('color(srgb 1 0 0)');
    assert.isNotNull(res);
    if (res) {
      assert.closeTo(res[0] as number, 54.291, 1e-3);
      assert.closeTo(res[1] as number, 106.837, 1e-3);
      assert.closeTo(res[2] as number, 40.857, 1e-3);
      assert.strictEqual(res[3], 1);
    }
  });

  it('should handle format: "mixValue" option and powerless hue', () => {
    const resAchromaticMix = func('color(xyz-d50 0 0 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resAchromaticMix);
    if (resAchromaticMix) {
      assert.strictEqual(resAchromaticMix[0], 0);
      assert.strictEqual(resAchromaticMix[1], 0);
      assert.strictEqual(resAchromaticMix[2], 'none');
      assert.strictEqual(resAchromaticMix[3], 1);
    }

    const resChromaticMix = func('rgb(255 0 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resChromaticMix);
    if (resChromaticMix) {
      assert.closeTo(resChromaticMix[0], 54.291, 1e-3);
      assert.closeTo(resChromaticMix[1] as number, 106.837, 1e-3);
      assert.closeTo(resChromaticMix[2] as number, 40.857, 1e-3);
      assert.strictEqual(resChromaticMix[3], 1);
    }

    const resNull = func('invalid-color', {
      format: 'mixValue'
    });
    assert.isNull(resNull);
  });
});

describe('convert color value to oklab', () => {
  const func = color.convertColorToOklab;

  it('should throw TypeError if input is not a string', () => {
    assert.throws(() => func(123), TypeError);
    assert.throws(() => func(null), TypeError);
  });

  it('should parse oklab() format correctly', () => {
    const res = func('oklab(0.6 0.1 -0.1 / 0.8)');
    assertDeepCloseTo(res, [0.6, 0.1, -0.1, 0.8]);
  });

  it('should convert standard color formats to oklab', () => {
    const resBlack = func('#000000');
    assertDeepCloseTo(resBlack, [0, 0, 0, 1]);

    const resWhite = func('rgb(255 255 255)');
    assertDeepCloseTo(resWhite, [1, 0, 0, 1], 1e-4);
  });

  it('should convert color() format to oklab via xyz', () => {
    const res = func('color(srgb 1 0 0)');
    assert.isNotNull(res);
    if (res) {
      assert.closeTo(res[0], 0.628, 1e-2);
      assert.closeTo(res[1], 0.225, 1e-2);
      assert.closeTo(res[2], 0.126, 1e-2);
      assert.strictEqual(res[3], 1);
    }
  });

  it('should handle format: "mixValue" option', () => {
    const resMix = func('color(srgb 0 1 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resMix);

    const resNull = func('invalid-color', {
      format: 'mixValue'
    });
    assert.isNull(resNull);
  });
});

describe('convert color value to oklch', () => {
  const func = color.convertColorToOklch;

  it('should throw TypeError if input is not a string', () => {
    assert.throws(() => func(123), TypeError);
    assert.throws(() => func(null), TypeError);
  });

  it('should parse oklch() format correctly', () => {
    const res = func('oklch(0.6 0.15 120 / 0.8)');
    assertDeepCloseTo(res as number[], [0.6, 0.15, 120, 0.8]);
  });

  it('should convert standard color formats to oklch', () => {
    const resBlack = func('#000000');
    assertDeepCloseTo(resBlack as number[], [0, 0, 0, 1]);

    const resWhite = func('rgb(255 255 255)');
    assertDeepCloseTo(resWhite as number[], [1, 0, 0, 1], 1e-4);
  });

  it('should convert color() format to oklch via xyz', () => {
    const res = func('color(srgb 1 0 0)');
    assert.isNotNull(res);
    if (res) {
      assert.closeTo(res[0] as number, 0.628, 1e-2);
      assert.closeTo(res[1] as number, 0.258, 1e-2);
      assert.closeTo(res[2] as number, 29.23, 1e-1);
      assert.strictEqual(res[3], 1);
    }
  });

  it('should handle format: "mixValue" option and powerless hue', () => {
    const resAchromaticMix = func('color(xyz 0 0 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resAchromaticMix);
    if (resAchromaticMix) {
      assert.strictEqual(resAchromaticMix[0], 0);
      assert.strictEqual(resAchromaticMix[1], 0);
      assert.strictEqual(resAchromaticMix[2], 'none');
      assert.strictEqual(resAchromaticMix[3], 1);
    }

    const resChromaticMix = func('rgb(255 0 0)', {
      format: 'mixValue'
    });
    assert.isNotNull(resChromaticMix);
    if (resChromaticMix) {
      assert.closeTo(resChromaticMix[1] as number, 0.258, 1e-2);
      assert.closeTo(resChromaticMix[2] as number, 29.23, 1e-1);
    }

    const resNull = func('invalid-color', {
      format: 'mixValue'
    });
    assert.isNull(resNull);
  });
});
