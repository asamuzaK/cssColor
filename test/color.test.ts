/**
 * color.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/js/cache';
import * as color from '../src/js/color';

beforeEach(() => {
  lruCache.clear();
});
afterEach(() => {
  lruCache.clear();
});

describe('resolve color value', () => {
  const func = color.resolveColorValue;

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

  it('should return cached result on consecutive calls', () => {
    const res1 = func('red');
    const res2 = func('red');
    assert.deepEqual(res1, res2);
  });

  it('should handle invalid color values', () => {
    assert.strictEqual(func('invalid-color', { format: 'specifiedValue' }), '');
    assert.deepEqual(func('invalid-color', { format: 'computedValue' }), [
      'rgb',
      0,
      0,
      0,
      0
    ]);
    assert.strictEqual(
      func('invalid-color', { format: 'computedValue', nullable: true }),
      null
    );
    assert.strictEqual(func('invalid-color', { nullable: true }), null);
  });

  it('should resolve currentcolor', () => {
    assert.strictEqual(
      func('currentcolor', { format: 'specifiedValue' }),
      'currentcolor'
    );
    assert.strictEqual(
      func('CurrentColor', { format: 'specifiedValue' }),
      'currentcolor'
    );
    assert.deepEqual(func('currentcolor'), ['rgb', 0, 0, 0, 0]);
    assert.deepEqual(func('currentcolor', { format: 'computedValue' }), [
      'rgb',
      0,
      0,
      0,
      0
    ]);
  });

  it('should resolve named colors', () => {
    assert.strictEqual(func('red', { format: 'specifiedValue' }), 'red');
    assert.deepEqual(func('red'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(func('BLUE'), ['rgb', 0, 0, 255, 1]);
  });

  it('should resolve unknown named colors and transparent', () => {
    assert.strictEqual(
      func('transparent', { format: 'specifiedValue' }),
      'transparent'
    );
    assert.deepEqual(func('transparent'), ['rgb', 0, 0, 0, 0]);
    assert.deepEqual(func('transparent', { format: 'mixValue' }), [
      'rgb',
      0,
      0,
      0,
      0
    ]);

    assert.strictEqual(func('unknowncolor', { format: 'specifiedValue' }), '');
    assert.strictEqual(func('unknowncolor', { format: 'mixValue' }), null);
    assert.deepEqual(func('unknowncolor'), ['rgb', 0, 0, 0, 0]);
    assert.strictEqual(
      func('unknowncolor', { format: 'computedValue', nullable: true }),
      null
    );
  });

  it('should resolve hex colors', () => {
    assert.deepEqual(func('#ff0000'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(func('#00ff0080'), ['rgb', 0, 255, 0, 0.5]);
  });

  it('should resolve hsl() and hwb() colors', () => {
    assert.deepEqual(func('hsl(0 100% 50%)'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(func('hsla(120, 100%, 50%, 0.5)'), [
      'rgb',
      0,
      255,
      0,
      0.5
    ]);
    assert.deepEqual(func('hwb(0 0% 0%)'), ['rgb', 255, 0, 0, 1]);
  });

  it('should resolve lab() and lch() colors', () => {
    assert.deepEqual(
      func('lab(50% 20 -30 / 0.8)', { format: 'specifiedValue' }),
      ['lab', 50, 20, -30, 0.8]
    );
    assert.deepEqual(
      func('lab(50% 20 -30 / 0.8)', { format: 'computedValue' }),
      ['lab', 50, 20, -30, 0.8]
    );
    assert.deepEqual(func('lab(50% 20 -30)', { format: 'specifiedValue' }), [
      'lab',
      50,
      20,
      -30,
      1
    ]);
    assert.deepEqual(
      func('lch(50% 20 180 / 0.5)', { format: 'specifiedValue' }),
      ['lch', 50, 20, 180, 0.5]
    );
    assert.deepEqual(func('lch(50% 20 180)', { format: 'specifiedValue' }), [
      'lch',
      50,
      20,
      180,
      1
    ]);
  });

  it('should resolve oklab() and oklch() colors', () => {
    assert.deepEqual(
      func('oklab(0.6 0.1 -0.1 / 1)', { format: 'specifiedValue' }),
      ['oklab', 0.6, 0.1, -0.1, 1]
    );
    assert.deepEqual(
      func('oklab(0.6 0.1 -0.1 / 1)', { format: 'computedValue' }),
      ['oklab', 0.6, 0.1, -0.1, 1]
    );
    assert.deepEqual(
      func('oklab(0.6 0.1 -0.1)', { format: 'specifiedValue' }),
      ['oklab', 0.6, 0.1, -0.1, 1]
    );
    assert.deepEqual(func('oklch(0.6 0.1 180)', { format: 'specifiedValue' }), [
      'oklch',
      0.6,
      0.1,
      180,
      1
    ]);
    assert.deepEqual(func('oklch(0.6 0.1 180)', { format: 'specifiedValue' }), [
      'oklch',
      0.6,
      0.1,
      180,
      1
    ]);
  });

  it('should resolve rgb() colors', () => {
    assert.deepEqual(func('rgb(255 0 0)'), ['rgb', 255, 0, 0, 1]);
    assert.deepEqual(func('rgba(0, 0, 255, 0.5)'), ['rgb', 0, 0, 255, 0.5]);
  });

  it('should resolve color in srgb colorSpace when format is mixValue', () => {
    assert.deepEqual(func('red', { format: 'mixValue', colorSpace: 'srgb' }), [
      'srgb',
      1,
      0,
      0,
      1
    ]);
    assert.deepEqual(
      func('#00ff0080', { format: 'mixValue', colorSpace: 'srgb' }),
      ['srgb', 0, 1, 0, 0.5]
    );
  });
});

describe('resolve color function', () => {
  const func = color.resolveColorFunc;

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

  it('should return cached result on consecutive calls', () => {
    const res1 = func('color(srgb 1 0 0)');
    const res2 = func('color(srgb 1 0 0)');
    assert.deepEqual(res1, res2);
  });

  it('should handle invalid color() function strings', () => {
    assert.strictEqual(func('invalid-color', { format: 'specifiedValue' }), '');
    assert.deepEqual(func('invalid-color', { format: 'computedValue' }), [
      'rgb',
      0,
      0,
      0,
      0
    ]);
    assert.strictEqual(
      func('invalid-color', { format: 'computedValue', nullable: true }),
      null
    );
    assert.strictEqual(func('invalid-color', { nullable: true }), null);
  });

  it('should resolve color() when format is specifiedValue or computedValue', () => {
    assert.deepEqual(func('color(srgb 1 0 0)', { format: 'specifiedValue' }), [
      'srgb',
      1,
      0,
      0,
      1
    ]);
    assert.deepEqual(func('color(srgb 1 0 0)', { format: 'computedValue' }), [
      'srgb',
      1,
      0,
      0,
      1
    ]);
    assert.deepEqual(
      func('color(display-p3 1 0 0 / 0.5)', { format: 'specifiedValue' }),
      ['display-p3', 1, 0, 0, 0.5]
    );
  });

  it('should resolve color() when format is mixValue and colorSpace matches', () => {
    assert.deepEqual(
      func('color(srgb 1 0 0)', { format: 'mixValue', colorSpace: 'srgb' }),
      ['srgb', 1, 0, 0, 1]
    );
  });

  it('should convert color() to rgb channels when format is not specifiedValue / computedValue', () => {
    assert.deepEqual(func('color(srgb 1 0 0)'), ['rgb', 255, 0, 0, 1]);
  });
});

describe('convert color to linear rgb', () => {
  const func = color.convertColorToLinearRgb;

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

  it('should convert standard color keywords, hex, and functions to linear RGB', () => {
    const resRed = func('red');
    assert.deepEqual(resRed, [1, 0, 0, 1]);

    const resHex = func('#ff0000');
    assert.deepEqual(resHex, [1, 0, 0, 1]);

    const resRgb = func('rgb(255 0 0)');
    assert.deepEqual(resRgb, [1, 0, 0, 1]);
  });

  it('should handle color() function with srgb-linear colorSpace', () => {
    const res = func('color(srgb-linear 1 0 0 / 0.5)');
    assert.deepEqual(res, [1, 0, 0, 0.5]);
  });

  it('should handle color() function with other colorSpaces', () => {
    const res = func('color(srgb 1 0 0)');
    assert.deepEqual(res, [1, 0, 0, 1]);
  });

  it('should handle format: mixValue', () => {
    assert.strictEqual(func('invalid-color', { format: 'mixValue' }), null);

    const resMatchedCs = func('color(srgb 0.5 0.2 0.1)', {
      format: 'mixValue',
      colorSpace: 'srgb'
    });
    assert.deepEqual(resMatchedCs, [0.5, 0.2, 0.1, 1]);

    const resDiffCs = func('red', {
      format: 'mixValue',
      colorSpace: 'display-p3'
    });
    assert.isNotNull(resDiffCs);
    const [r, g, b, alpha] = resDiffCs!;
    assert.strictEqual(r, 1);
    assert.strictEqual(g, 0);
    assert.strictEqual(b, 0);
    assert.strictEqual(alpha, 1);
  });

  it('should clamp rgb channel values between 0 and 1', () => {
    const res = func('lab(120 50 50)');
    assert.isNotNull(res);
    const [r, g, b, alpha] = res!;
    assert.strictEqual(r, 1);
    assert.isAtLeast(g, 0);
    assert.isAtLeast(b, 0);
    assert.strictEqual(alpha, 1);
  });
});

describe('convert color to rgb', () => {
  const func = color.convertColorToRgb;

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

  it('should convert named colors, hex, hsl, hwb, and rgb to 0-255 RGB channels', () => {
    assert.deepEqual(func('red'), [255, 0, 0, 1]);
    assert.deepEqual(func('#00ff0080'), [0, 255, 0, 0.5]);
    assert.deepEqual(func('hsl(240 100% 50% / 0.5)'), [0, 0, 255, 0.5]);
    assert.deepEqual(func('hwb(0 0% 0%)'), [255, 0, 0, 1]);
    assert.deepEqual(func('rgb(0 255 0 / 0.8)'), [0, 255, 0, 0.8]);
  });

  it('should convert color() function values', () => {
    assert.deepEqual(func('color(srgb 1 0 0 / 0.5)'), [255, 0, 0, 0.5]);

    const resP3 = func('color(display-p3 1 0 0)');
    assert.isNotNull(resP3);
    const [r, g, b, alpha] = resP3!;
    assert.closeTo(r, 255, 0.001);
    assert.closeTo(g, 0, 0.001);
    assert.closeTo(b, 0, 0.001);
    assert.strictEqual(alpha, 1);
  });

  it('should convert lab, lch, oklab, and oklch colors', () => {
    const resLab = func('lab(50 20 -30)');
    assert.isNotNull(resLab);
    const [labR, labG, labB, labA] = resLab!;
    assert.closeTo(labR, 132.894, 0.001);
    assert.closeTo(labG, 108.032, 0.001);
    assert.closeTo(labB, 170.47, 0.001);
    assert.strictEqual(labA, 1);

    const resOklch = func('oklch(0.6 0.1 180 / 0.5)');
    assert.isNotNull(resOklch);
    const [okR, okG, okB, okA] = resOklch!;
    assert.closeTo(okR, 34.818, 0.001);
    assert.closeTo(okG, 147.447, 0.001);
    assert.closeTo(okB, 130.41, 0.001);
    assert.strictEqual(okA, 0.5);
  });

  it('should handle format: mixValue', () => {
    assert.strictEqual(func('invalid-color', { format: 'mixValue' }), null);

    const resColorFunc = func('color(srgb 1 0 0)', {
      format: 'mixValue',
      colorSpace: 'srgb'
    });
    assert.deepEqual(resColorFunc, [1, 0, 0, 1]);

    const resColorValue = func('red', {
      format: 'mixValue',
      colorSpace: 'srgb'
    });
    assert.deepEqual(resColorValue, [1, 0, 0, 1]);
  });
});

describe('convert color to xyz', () => {
  const func = color.convertColorToXyz;

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

  it('should convert standard color values to XYZ channels', () => {
    const resRed = func('red');
    assert.isNotNull(resRed);
    const [x65, y65, z65, a65] = resRed!;
    assert.closeTo(x65, 0.4124, 0.001);
    assert.closeTo(y65, 0.2127, 0.001);
    assert.closeTo(z65, 0.0193, 0.001);
    assert.strictEqual(a65, 1);

    const resD50 = func('red', { d50: true });
    assert.isNotNull(resD50);
    const [x50, y50, z50, a50] = resD50!;
    assert.closeTo(x50, 0.4361, 0.001);
    assert.closeTo(y50, 0.2225, 0.001);
    assert.closeTo(z50, 0.0139, 0.001);
    assert.strictEqual(a50, 1);
  });

  it('should convert color() functions based on d50 option and colorSpace', () => {
    assert.deepEqual(
      func('color(xyz-d50 0.2 0.3 0.4 / 0.5)', { d50: true }),
      [0.2, 0.3, 0.4, 0.5]
    );

    const resD50ToD65 = func('color(xyz-d50 0.2 0.3 0.4 / 0.5)');
    assert.isNotNull(resD50ToD65);
    const [x, y, z, a] = resD50ToD65!;
    assert.closeTo(x, 0.2095, 0.001);
    assert.closeTo(y, 0.3057, 0.001);
    assert.closeTo(z, 0.5285, 0.001);
    assert.strictEqual(a, 0.5);

    assert.deepEqual(
      func('color(xyz-d65 0.1 0.2 0.3 / 0.8)'),
      [0.1, 0.2, 0.3, 0.8]
    );
    assert.deepEqual(func('color(xyz 0.1 0.2 0.3)'), [0.1, 0.2, 0.3, 1]);

    const resSrgb = func('color(srgb 1 0 0)', { d50: true });
    assert.isNotNull(resSrgb);
    const [sx50, sy50, sz50, sa50] = resSrgb!;
    assert.closeTo(sx50, 0.4361, 0.001);
    assert.closeTo(sy50, 0.2225, 0.001);
    assert.closeTo(sz50, 0.0139, 0.001);
    assert.strictEqual(sa50, 1);
  });

  it('should handle format: mixValue', () => {
    assert.strictEqual(func('invalid-color', { format: 'mixValue' }), null);

    const resMixColorFunc = func('color(srgb 1 0 0)', { format: 'mixValue' });
    assert.isNotNull(resMixColorFunc);
    const [fx, fy, fz, fa] = resMixColorFunc!;
    assert.closeTo(fx, 0.4124, 0.001);
    assert.closeTo(fy, 0.2127, 0.001);
    assert.closeTo(fz, 0.0193, 0.001);
    assert.strictEqual(fa, 1);

    const resMixColorValue = func('red', { format: 'mixValue' });
    assert.isNotNull(resMixColorValue);
    const [vx, vy, vz, va] = resMixColorValue!;
    assert.closeTo(vx, 0.4124, 0.001);
    assert.closeTo(vy, 0.2127, 0.001);
    assert.closeTo(vz, 0.0193, 0.001);
    assert.strictEqual(va, 1);
  });
});

describe('convert color to hsl', () => {
  const func = color.convertColorToHsl;

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

  it('should convert hsl() strings directly', () => {
    assert.deepEqual(func('hsl(0 100% 50%)'), [0, 100, 50, 1]);
    assert.deepEqual(func('hsla(120, 100%, 50%, 0.5)'), [120, 100, 50, 0.5]);
    assert.deepEqual(
      func('hsl(120.4 99.6% 49.8% / 0.8)', { format: 'hsl' }),
      [120, 100, 50, 0.8]
    );
  });

  it('should convert non-hsl color values and color() functions to HSL', () => {
    assert.deepEqual(func('red', { format: 'hsl' }), [0, 100, 50, 1]);
    assert.deepEqual(func('#00ff00', { format: 'hsl' }), [120, 100, 50, 1]);

    const resColorFunc = func('color(srgb 1 0 0)', { format: 'hsl' });
    assert.deepEqual(resColorFunc, [0, 100, 50, 1]);
  });

  it('should handle format: mixValue and powerless hue (s = 0)', () => {
    assert.strictEqual(func('invalid-color', { format: 'mixValue' }), null);

    const resAchromatic = func('white', { format: 'mixValue' });
    assert.deepEqual(resAchromatic, ['none', 0, 100, 1]);

    const resColorFuncMix = func('color(srgb 1 1 1)', { format: 'mixValue' });
    assert.deepEqual(resColorFuncMix, ['none', 0, 100, 1]);
  });
});

describe('convert color to hwb', () => {
  const func = color.convertColorToHwb;

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

  it('should convert hwb() strings directly', () => {
    assert.deepEqual(func('hwb(0 0% 0%)'), [0, 0, 0, 1]);
    assert.deepEqual(func('hwb(120 10% 20% / 0.5)'), [120, 10, 20, 0.5]);
    assert.deepEqual(
      func('hwb(120.4 9.6% 19.8% / 0.8)', { format: 'hwb' }),
      [120, 10, 20, 0.8]
    );
  });

  it('should convert non-hwb color values and color() functions to HWB', () => {
    assert.deepEqual(func('red', { format: 'hwb' }), [0, 0, 0, 1]);
    assert.deepEqual(func('#00ff00', { format: 'hwb' }), [120, 0, 0, 1]);

    const resColorFunc = func('color(srgb 1 0 0)', { format: 'hwb' });
    assert.deepEqual(resColorFunc, [0, 0, 0, 1]);
  });

  it('should handle format: mixValue and powerless hue (w + b >= 100)', () => {
    assert.strictEqual(func('invalid-color', { format: 'mixValue' }), null);

    const resAchromatic = func('white', { format: 'mixValue' });
    assert.deepEqual(resAchromatic, ['none', 100, 0, 1]);

    const resColorFuncMix = func('color(srgb 1 1 1)', { format: 'mixValue' });
    assert.deepEqual(resColorFuncMix, ['none', 100, 0, 1]);
  });
});

describe('convert color to lab', () => {
  const func = color.convertColorToLab;

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

  it('should convert lab() strings directly', () => {
    const res = func('lab(50 20 -30 / 0.8)');
    assert.isNotNull(res);
    const [l, a, b, alpha] = res!;
    assert.strictEqual(l, 50);
    assert.strictEqual(a, 20);
    assert.strictEqual(b, -30);
    assert.strictEqual(alpha, 0.8);
  });

  it('should convert non-lab color values and color() functions to Lab', () => {
    const resRed = func('red');
    assert.isNotNull(resRed);
    const [rl, ra, rb, ralpha] = resRed!;
    assert.closeTo(rl, 54.291, 0.001);
    assert.closeTo(ra, 80.805, 0.001);
    assert.closeTo(rb, 69.891, 0.001);
    assert.strictEqual(ralpha, 1);

    const resHex = func('#00ff0080');
    assert.isNotNull(resHex);
    const [gl, ga, gb, galpha] = resHex!;
    assert.closeTo(gl, 87.819, 0.001);
    assert.closeTo(ga, -79.271, 0.001);
    assert.closeTo(gb, 80.995, 0.001);
    assert.strictEqual(galpha, 0.5);

    const resColorFunc = func('color(srgb 1 0 0)');
    assert.isNotNull(resColorFunc);
    const [cl, ca, cb, calpha] = resColorFunc!;
    assert.closeTo(cl, 54.291, 0.001);
    assert.closeTo(ca, 80.805, 0.001);
    assert.closeTo(cb, 69.891, 0.001);
    assert.strictEqual(calpha, 1);
  });

  it('should handle format: mixValue', () => {
    assert.strictEqual(func('invalid-color', { format: 'mixValue' }), null);

    const resMixColorFunc = func('color(srgb 1 0 0)', { format: 'mixValue' });
    assert.isNotNull(resMixColorFunc);
    const [fl, fa, fb, falpha] = resMixColorFunc!;
    assert.closeTo(fl, 54.291, 0.001);
    assert.closeTo(fa, 80.805, 0.001);
    assert.closeTo(fb, 69.891, 0.001);
    assert.strictEqual(falpha, 1);

    const resMixColorValue = func('red', { format: 'mixValue' });
    assert.isNotNull(resMixColorValue);
    const [vl, va, vb, valpha] = resMixColorValue!;
    assert.closeTo(vl, 54.291, 0.001);
    assert.closeTo(va, 80.805, 0.001);
    assert.closeTo(vb, 69.891, 0.001);
    assert.strictEqual(valpha, 1);
  });
});

describe('convert color to lch', () => {
  const func = color.convertColorToLch;

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

  it('should convert lch() strings directly', () => {
    const res = func('lch(50% 20 180 / 0.8)');
    assert.isNotNull(res);
    const [l, c, h, alpha] = res!;
    assert.strictEqual(l, 50);
    assert.strictEqual(c, 20);
    assert.strictEqual(h, 180);
    assert.strictEqual(alpha, 0.8);
  });

  it('should convert non-lch color values and color() functions to LCH', () => {
    const resRed = func('red');
    assert.isNotNull(resRed);
    const [rl, rc, rh, ralpha] = resRed!;
    assert.closeTo(rl, 54.291, 0.001);
    assert.closeTo(rc, 106.837, 0.001);
    assert.closeTo(rh as number, 40.858, 0.001);
    assert.strictEqual(ralpha, 1);

    const resHex = func('#00ff0080');
    assert.isNotNull(resHex);
    const [gl, gc, gh, galpha] = resHex!;
    assert.closeTo(gl, 87.819, 0.001);
    assert.closeTo(gc, 113.331, 0.001);
    assert.closeTo(gh as number, 134.384, 0.001);
    assert.strictEqual(galpha, 0.5);

    const resColorFunc = func('color(srgb 1 0 0)');
    assert.isNotNull(resColorFunc);
    const [cl, cc, ch, calpha] = resColorFunc!;
    assert.closeTo(cl, 54.291, 0.001);
    assert.closeTo(cc, 106.837, 0.001);
    assert.closeTo(ch as number, 40.858, 0.001);
    assert.strictEqual(calpha, 1);
  });

  it('should handle format: mixValue and powerless hue (c = 0)', () => {
    assert.strictEqual(func('invalid-color', { format: 'mixValue' }), null);

    const resAchromatic = func('white', { format: 'mixValue' });
    assert.deepEqual(resAchromatic, [100, 0, 'none', 1]);

    const resColorFuncMix = func('color(srgb 1 1 1)', { format: 'mixValue' });
    assert.deepEqual(resColorFuncMix, [100, 0, 'none', 1]);

    const resRedMix = func('red', { format: 'mixValue' });
    assert.isNotNull(resRedMix);
    const [rl, rc, rh, ralpha] = resRedMix!;
    assert.closeTo(rl, 54.29, 0.001);
    assert.closeTo(rc, 106.837, 0.001);
    assert.closeTo(rh as number, 40.858, 0.001);
    assert.strictEqual(ralpha, 1);
  });
});

describe('convert color to oklab', () => {
  const func = color.convertColorToOklab;

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

  it('should convert oklab() strings directly', () => {
    const res = func('oklab(0.6 0.1 -0.1 / 0.8)');
    assert.isNotNull(res);
    const [l, a, b, alpha] = res!;
    assert.strictEqual(l, 0.6);
    assert.strictEqual(a, 0.1);
    assert.strictEqual(b, -0.1);
    assert.strictEqual(alpha, 0.8);
  });

  it('should convert non-oklab color values and color() functions to Oklab', () => {
    const resRed = func('red');
    assert.isNotNull(resRed);
    const [rl, ra, rb, ralpha] = resRed!;
    assert.closeTo(rl, 0.628, 0.001);
    assert.closeTo(ra, 0.2249, 0.001);
    assert.closeTo(rb, 0.1258, 0.001);
    assert.strictEqual(ralpha, 1);

    const resHex = func('#00ff0080');
    assert.isNotNull(resHex);
    const [gl, ga, gb, galpha] = resHex!;
    assert.closeTo(gl, 0.8664, 0.001);
    assert.closeTo(ga, -0.2339, 0.001);
    assert.closeTo(gb, 0.1795, 0.001);
    assert.strictEqual(galpha, 0.5);

    const resColorFunc = func('color(srgb 1 0 0)');
    assert.isNotNull(resColorFunc);
    const [cl, ca, cb, calpha] = resColorFunc!;
    assert.closeTo(cl, 0.628, 0.001);
    assert.closeTo(ca, 0.2249, 0.001);
    assert.closeTo(cb, 0.1258, 0.001);
    assert.strictEqual(calpha, 1);
  });

  it('should handle format: mixValue', () => {
    assert.strictEqual(func('invalid-color', { format: 'mixValue' }), null);

    const resMixColorFunc = func('color(srgb 1 0 0)', { format: 'mixValue' });
    assert.isNotNull(resMixColorFunc);
    const [fl, fa, fb, falpha] = resMixColorFunc!;
    assert.closeTo(fl, 0.628, 0.001);
    assert.closeTo(fa, 0.2249, 0.001);
    assert.closeTo(fb, 0.1258, 0.001);
    assert.strictEqual(falpha, 1);

    const resMixColorValue = func('red', { format: 'mixValue' });
    assert.isNotNull(resMixColorValue);
    const [vl, va, vb, valpha] = resMixColorValue!;
    assert.closeTo(vl, 0.628, 0.001);
    assert.closeTo(va, 0.2249, 0.001);
    assert.closeTo(vb, 0.1258, 0.001);
    assert.strictEqual(valpha, 1);
  });
});

describe('convert color to oklch', () => {
  const func = color.convertColorToOklch;

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

  it('should convert oklch() strings directly', () => {
    const res = func('oklch(0.6 0.1 180 / 0.8)');
    assert.isNotNull(res);
    const [l, c, h, alpha] = res!;
    assert.strictEqual(l, 0.6);
    assert.strictEqual(c, 0.1);
    assert.strictEqual(h, 180);
    assert.strictEqual(alpha, 0.8);
  });

  it('should convert non-oklch color values and color() functions to Oklch', () => {
    const resRed = func('red');
    assert.isNotNull(resRed);
    const [rl, rc, rh, ralpha] = resRed!;
    assert.closeTo(rl, 0.628, 0.001);
    assert.closeTo(rc, 0.2577, 0.001);
    assert.closeTo(rh as number, 29.234, 0.001);
    assert.strictEqual(ralpha, 1);

    const resHex = func('#00ff0080');
    assert.isNotNull(resHex);
    const [gl, gc, gh, galpha] = resHex!;
    assert.closeTo(gl, 0.8664, 0.001);
    assert.closeTo(gc, 0.2948, 0.001);
    assert.closeTo(gh as number, 142.495, 0.001);
    assert.strictEqual(galpha, 0.5);

    const resColorFunc = func('color(srgb 1 0 0)');
    assert.isNotNull(resColorFunc);
    const [cl, cc, ch, calpha] = resColorFunc!;
    assert.closeTo(cl, 0.628, 0.001);
    assert.closeTo(cc, 0.2577, 0.001);
    assert.closeTo(ch as number, 29.234, 0.001);
    assert.strictEqual(calpha, 1);
  });

  it('should handle format: mixValue and powerless hue (c = 0)', () => {
    assert.strictEqual(func('invalid-color', { format: 'mixValue' }), null);

    const resAchromatic = func('white', { format: 'mixValue' });
    assert.deepEqual(resAchromatic, [1, 0, 'none', 1]);

    const resColorFuncMix = func('color(srgb 1 1 1)', { format: 'mixValue' });
    assert.deepEqual(resColorFuncMix, [1, 0, 'none', 1]);

    const resRedMix = func('red', { format: 'mixValue' });
    assert.isNotNull(resRedMix);
    const [rl, rc, rh, ralpha] = resRedMix!;
    assert.closeTo(rl, 0.628, 0.001);
    assert.closeTo(rc, 0.2577, 0.001);
    assert.closeTo(rh as number, 29.234, 0.001);
    assert.strictEqual(ralpha, 1);
  });
});
