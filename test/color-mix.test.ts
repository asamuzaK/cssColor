/**
 * color-mix.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it, vi } from 'vitest';

/* test */
import { lruCache } from '../src/utils/cache';
import { resolveColor } from '../src/resolvers/resolve-color';
import { cacheInvalidColorValue, roundToPrecision } from '../src/utils/util';
import * as colorMix from '../src/resolvers/color-mix';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('parseColorSpace', () => {
  const func = colorMix.parseColorSpace;

  it('should parse standard color space', () => {
    const res = func('in srgb');
    assert.deepEqual(res, { colorSpace: 'srgb', hueArc: '' }, 'result');
  });

  it('should parse color space with hue arc', () => {
    const res = func('in oklch longer hue');
    assert.deepEqual(res, { colorSpace: 'oklch', hueArc: 'longer' }, 'result');
  });

  it('should return null for missing "in"', () => {
    const res = func('srgb');
    assert.strictEqual(res, null, 'result');
  });

  it('should return null for invalid prefix', () => {
    const res = func('on srgb');
    assert.strictEqual(res, null, 'result');
  });
});

describe('parseColorAndPct', () => {
  const func = colorMix.parseColorAndPct;

  it('should parse single token as color only', () => {
    const res = func('red');
    assert.deepEqual(res, { color: 'red', pct: '' });
  });

  describe('when percentage token is at the end', () => {
    it('should parse color and percentage ending with %', () => {
      const res = func('red 30%');
      assert.deepEqual(res, { color: 'red', pct: '30%' });
    });

    it('should parse multi-token color with percentage ending with %', () => {
      const res = func('color(srgb 1 0 0) 30%');
      assert.deepEqual(res, { color: 'color(srgb 1 0 0)', pct: '30%' });
    });

    it('should parse percentage starting with calc()', () => {
      const res = func('blue calc(20% + 10%)');
      assert.deepEqual(res, { color: 'blue', pct: 'calc(20% + 10%)' });
    });

    it('should parse percentage equal to "none"', () => {
      const res = func('green none');
      assert.deepEqual(res, { color: 'green', pct: 'none' });
    });
  });

  describe('when percentage token is at the beginning', () => {
    it('should parse percentage at the start and color at the end', () => {
      const res = func('30% red');
      assert.deepEqual(res, { color: 'red', pct: '30%' });
    });

    it('should parse calc() at the start and multi-token color at the end', () => {
      const res = func('calc(50% - 10%) color(srgb 0 1 0)');
      assert.deepEqual(res, {
        color: 'color(srgb 0 1 0)',
        pct: 'calc(50% - 10%)'
      });
    });
  });

  describe('when no percentage token is present in multi-token input', () => {
    it('should join all tokens as color when neither end nor start is percentage', () => {
      const res = func('var(--my-color) var(--other-color)');
      assert.deepEqual(res, {
        color: 'var(--my-color) var(--other-color)',
        pct: ''
      });
    });
  });
});

describe('resolveIfNested', () => {
  const func = colorMix.resolveIfNested;
  const opt = { format: 'specifiedValue' };

  it('should call resolver and return resolved value for color-mix()', () => {
    const input = 'color-mix(in srgb, red, blue)';
    const resolver = (v: string) => (v === input ? 'rgb(255, 0, 0)' : null);
    const res = func(input, opt, resolver);
    assert.strictEqual(
      res,
      'rgb(255, 0, 0)',
      'should return resolved color string'
    );
  });

  it('should call resolver and return resolved value for var()', () => {
    const input = 'var(--main-color)';
    const resolver = (v: string) => (v === input ? 'blue' : null);
    const res = func(input, opt, resolver);
    assert.strictEqual(res, 'blue', 'should return resolved var value');
  });

  it('should call resolver and return resolved value for light-dark()', () => {
    const input = 'light-dark(white, black)';
    const resolver = (v: string) => (v === input ? 'white' : null);
    const res = func(input, opt, resolver);
    assert.strictEqual(res, 'white', 'should return resolved light-dark value');
  });

  it('should fallback to original string if resolver returns null/falsy value', () => {
    const input = 'var(--undefined-var)';
    const resolver = () => null;
    const res = func(input, opt, resolver);
    assert.strictEqual(
      res,
      input,
      'should return original string when resolution fails'
    );
  });

  it('should return original string without calling resolver for standard color strings', () => {
    const input = 'red';
    let resolverCalled = false;
    const resolver = () => {
      resolverCalled = true;
      return 'blue';
    };
    const res = func(input, opt, resolver);
    assert.strictEqual(res, 'red', 'should return original color string');
    assert.isFalse(
      resolverCalled,
      'resolver should not be called for simple colors'
    );
  });

  it('should override format option to computedValue when format is not specifiedValue', () => {
    const input = 'var(--bg-color)';
    const opt = { format: 'hex' };
    let passedOpt: Options | undefined;
    const resolver = (v: string, o?: Options) => {
      passedOpt = o;
      return 'green';
    };
    func(input, opt, resolver);
    assert.isDefined(passedOpt);
    assert.strictEqual(
      passedOpt?.format,
      'computedValue',
      'format option should be updated to computedValue'
    );
  });
});

describe('normalizePercentages', () => {
  const func = colorMix.normalizePercentages;

  describe('when both pctA and pctB are provided', () => {
    it('should normalize percentages correctly and adjust multiplier m when factor < 1', () => {
      const res = func('20%', '30%');
      assert.isNotNull(res);
      assert.deepEqual(res, { pA: 0.4, pB: 0.6, m: 0.5 });
    });

    it('should set multiplier m to 1 when factor >= 1', () => {
      const res = func('50%', '50%');
      assert.isNotNull(res);
      assert.deepEqual(res, { pA: 0.5, pB: 0.5, m: 1 });
    });

    it('should return null when percentages are out of range or both are 0%', () => {
      assert.isNull(func('-10%', '50%'), 'should return null when p1 < 0');
      assert.isNull(func('150%', '20%'), 'should return null when p1 > 1');
      assert.isNull(
        func('0%', '0%'),
        'should return null when p1 === 0 && p2 === 0'
      );
    });
  });

  describe('when only pctA is provided', () => {
    it('should calculate pB as 1 - pA and set m to 1', () => {
      const res = func('30%', '');
      assert.isNotNull(res);
      assert.deepEqual(res, { pA: 0.3, pB: 0.7, m: 1 });
    });

    it('should return null when pctA is out of 0 to 100 range', () => {
      assert.isNull(func('-10%', ''), 'should return null when pctA < 0');
      assert.isNull(func('120%', ''), 'should return null when pctA > 100');
    });
  });

  describe('when only pctB is provided', () => {
    it('should calculate pA as 1 - pB and set m to 1', () => {
      const res = func('', '40%');
      assert.isNotNull(res);
      assert.deepEqual(res, { pA: 0.6, pB: 0.4, m: 1 });
    });

    it('should return null when pctB is out of 0 to 100 range', () => {
      assert.isNull(func('', '-10%'), 'should return null when pctB < 0');
      assert.isNull(func('', '120%'), 'should return null when pctB > 100');
    });
  });

  describe('when neither pctA nor pctB is provided', () => {
    it('should return default 50% / 50% with m = 1', () => {
      const res = func('', '');
      assert.isNotNull(res);
      assert.deepEqual(res, { pA: 0.5, pB: 0.5, m: 1 });
    });
  });
});

describe('processColor', () => {
  const func = colorMix.processColor;
  const opt = { format: 'specifiedValue' };

  it('should return empty string when colorStr is not a string', () => {
    assert.strictEqual(func(null as any, opt), '');
    assert.strictEqual(func(undefined as any, opt), '');
    assert.strictEqual(func(123 as any, opt), '');
    assert.strictEqual(func({} as any, opt), '');
  });

  describe('nested functions bypass (color-mix / light-dark)', () => {
    it('should return colorStr as-is when starting with color-mix or light-dark', () => {
      const mixStr = 'color-mix(in srgb, red, blue)';
      const lightDarkStr = 'light-dark(white, black)';
      assert.strictEqual(func(mixStr, opt), mixStr);
      assert.strictEqual(func(lightDarkStr, opt), lightDarkStr);
    });
  });

  describe('color() function formatting', () => {
    it('should format color() function without slash alpha when alpha === 1', () => {
      const res = func('color(display-p3 1 0 0)', opt);
      assert.strictEqual(res, 'color(display-p3 1 0 0)');
    });

    it('should format color() function with slash alpha when alpha !== 1', () => {
      const res = func('color(display-p3 1 0 0 / 0.5)', opt);
      assert.strictEqual(res, 'color(display-p3 1 0 0 / 0.5)');
    });
  });

  describe('array result from parseColorValue', () => {
    it('should format rgb color with alpha === 1 as rgb(r, g, b)', () => {
      const res = func('rgb(255, 0, 0)', opt);
      assert.strictEqual(res, 'rgb(255, 0, 0)');
    });

    it('should format non-rgb color with alpha === 1 as cs(v1 v2 v3)', () => {
      const res = func('lab(50% 20 30)', opt);
      assert.strictEqual(res, 'lab(50 20 30)');
    });

    it('should format rgb color with alpha !== 1 as rgba(r, g, b, a)', () => {
      const res = func('rgba(255, 0, 0, 0.5)', opt);
      assert.strictEqual(res, 'rgba(255, 0, 0, 0.5)');
    });

    it('should format non-rgb color with alpha !== 1 as cs(v1 v2 v3 / a)', () => {
      const res = func('oklch(0.6 0.15 120 / 0.5)', opt);
      assert.strictEqual(res, 'oklch(0.6 0.15 120 / 0.5)');
    });
  });

  describe('string result or invalid value fallback', () => {
    it('should return string value directly when parseColorValue returns valid string', () => {
      const res = func('transparent', opt);
      assert.strictEqual(res, 'transparent');
    });

    it('should return empty string when parseColorValue returns empty or non-string invalid value', () => {
      const res = func('invalid-color-name', opt);
      assert.strictEqual(res, '');
    });
  });
});

describe('buildSpecifiedColorMix', () => {
  const func = colorMix.buildSpecifiedColorMix;
  const opt = { format: 'specifiedValue' };

  it('should return empty string if either color is invalid', () => {
    assert.strictEqual(
      func('srgb', '', 'invalid-color', '50%', 'blue', '50%', opt),
      ''
    );
    assert.strictEqual(
      func('srgb', '', 'red', '50%', 'invalid-color', '50%', opt),
      ''
    );
  });

  describe('percentage handling', () => {
    it('should append percentages to both colors when pctA and pctB are provided', () => {
      const res = func('srgb', '', 'red', '20%', 'blue', '30%', opt);
      assert.strictEqual(res, 'color-mix(in srgb, red 20%, blue 30%)');
    });

    it('should append percentage to valueA when pctA is provided and not 50%', () => {
      const res = func('srgb', '', 'red', '30%', 'blue', '', opt);
      assert.strictEqual(res, 'color-mix(in srgb, red 30%, blue)');
    });

    it('should omit percentage when pctA is 50%', () => {
      const res = func('srgb', '', 'red', '50%', 'blue', '', opt);
      assert.strictEqual(res, 'color-mix(in srgb, red, blue)');
    });

    it('should calculate and append percentage to valueA when pctB is provided and resultant pctA is not 50%', () => {
      const res = func('srgb', '', 'red', '', 'blue', '30%', opt);
      assert.strictEqual(res, 'color-mix(in srgb, red 70%, blue)');
    });

    it('should omit percentage when pctB is 50% (resulting in 50% for pctA)', () => {
      const res = func('srgb', '', 'red', '', 'blue', '50%', opt);
      assert.strictEqual(res, 'color-mix(in srgb, red, blue)');
    });

    it('should not append percentages when neither pctA nor pctB is provided', () => {
      const res = func('srgb', '', 'red', '', 'blue', '', opt);
      assert.strictEqual(res, 'color-mix(in srgb, red, blue)');
    });
  });

  describe('hueArc handling', () => {
    it('should include hueArc in output string when hueArc is specified', () => {
      const res = func('lch', 'shorter', 'red', '', 'blue', '', opt);
      assert.strictEqual(res, 'color-mix(in lch shorter hue, red, blue)');
    });

    it('should not include hueArc in output string when hueArc is empty', () => {
      const res = func('lch', '', 'red', '', 'blue', '', opt);
      assert.strictEqual(res, 'color-mix(in lch, red, blue)');
    });
  });
});

describe('interpolateComponents', () => {
  const func = colorMix.interpolateComponents;

  describe('when combined alpha is zero (alpha === 0)', () => {
    it('should interpolate components directly using pA and pB without division by zero', () => {
      const compA: TriColorChannels = [1, 0, 0];
      const compB: TriColorChannels = [0, 0, 1];
      const pA = 0.5;
      const pB = 0.5;
      const res = func(compA, compB, 0, 0, pA, pB);
      assert.strictEqual(res.alpha, 0, 'alpha should be 0');
      assert.deepEqual(
        res.comps,
        [0.5, 0, 0.5],
        'components should be directly weighted by pA and pB'
      );
    });

    it('should handle asymmetric ratios when alpha is zero', () => {
      const compA: TriColorChannels = [0.8, 0.4, 0.2];
      const compB: TriColorChannels = [0.2, 0.6, 0.8];
      const pA = 0.25;
      const pB = 0.75;
      const res = func(compA, compB, 0, 0, pA, pB);
      assert.strictEqual(res.alpha, 0);
      assert.closeTo(res.comps[0], 0.35, 1e-5);
      assert.closeTo(res.comps[1], 0.55, 1e-5);
      assert.closeTo(res.comps[2], 0.65, 1e-5);
    });
  });

  describe('when combined alpha is greater than zero (alpha > 0)', () => {
    it('should calculate alpha-weighted components correctly', () => {
      const compA: TriColorChannels = [1, 0, 0];
      const compB: TriColorChannels = [0, 0, 1];
      const res = func(compA, compB, 0.5, 1.0, 0.5, 0.5);
      assert.strictEqual(
        res.alpha,
        0.75,
        'alpha should equal factorA + factorB'
      );
      assert.closeTo(res.comps[0], 1 / 3, 1e-5);
      assert.strictEqual(res.comps[1], 0);
      assert.closeTo(res.comps[2], 2 / 3, 1e-5);
    });

    it('should round alpha value to 3 decimal places', () => {
      const compA: TriColorChannels = [0.5, 0.5, 0.5];
      const compB: TriColorChannels = [0.5, 0.5, 0.5];
      const res = func(compA, compB, 0.3333, 0.3333, 0.5, 0.5);
      assert.strictEqual(
        res.alpha,
        0.333,
        'alpha should be rounded to 3 decimal places'
      );
    });
  });
});

describe('formatMixedColor', () => {
  const func = colorMix.formatMixedColor;

  describe('when format is computedValue', () => {
    const optFormat = 'computedValue';

    it('should format specified color space channels with precision rounding', () => {
      const comps: TriColorChannels = [0.5, 0.2, 0.8];
      const nones: [boolean, boolean, boolean, boolean] = [
        false,
        false,
        false,
        false
      ];
      const alpha = 0.5;
      const m = 1;
      const res = func('lab', comps, nones, alpha, m, optFormat);
      assert.strictEqual(res[0], 'lab');
      assert.strictEqual(res[1], roundToPrecision(0.5, 16));
      assert.strictEqual(res[2], roundToPrecision(0.2, 16));
      assert.strictEqual(res[3], roundToPrecision(0.8, 16));
      assert.strictEqual(res[4], 0.5);
    });

    it('should replace channels with none keyword when corresponding nones flag is true', () => {
      const comps: TriColorChannels = [0.5, 0.2, 0.8];
      const nones: [boolean, boolean, boolean, boolean] = [
        true,
        false,
        true,
        true
      ];
      const alpha = 0.5;
      const m = 1;
      const res = func('oklch', comps, nones, alpha, m, optFormat);
      assert.deepEqual(res, [
        'oklch',
        'none',
        roundToPrecision(0.2, 16),
        'none',
        'none'
      ]);
    });

    it('should apply multiplier m to alpha when alpha is not none', () => {
      const comps: TriColorChannels = [0.5, 0.5, 0.5];
      const nones: [boolean, boolean, boolean, boolean] = [
        false,
        false,
        false,
        false
      ];
      const alpha = 0.8;
      const m = 0.5; // alpha * m = 0.4
      const res = func('srgb', comps, nones, alpha, m, optFormat);
      assert.strictEqual(res[4], 0.4);
    });
  });

  describe('when format is not computedValue', () => {
    const optFormat = '';

    it('should format rgb array using comps when rgbOverride is not provided', () => {
      const comps: TriColorChannels = [254.6, 128.2, 0.1];
      const nones: [boolean, boolean, boolean, boolean] = [
        false,
        false,
        false,
        false
      ];
      const alpha = 0.5;
      const m = 1;
      const res = func('srgb', comps, nones, alpha, m, optFormat);
      assert.deepEqual(res, ['rgb', 255, 128, 0, 0.5]);
    });

    it('should format rgb array using rgbOverride when provided', () => {
      const comps: TriColorChannels = [0.5, 0.2, 0.8];
      const rgbOverride: [number, number, number] = [255, 0, 128];
      const nones: [boolean, boolean, boolean, boolean] = [
        false,
        false,
        false,
        false
      ];
      const alpha = 0.8;
      const m = 1;
      const res = func('lch', comps, nones, alpha, m, optFormat, rgbOverride);
      assert.deepEqual(res, ['rgb', 255, 0, 128, 0.8]);
    });

    it('should round alpha to 3 decimal places in rgb output', () => {
      const comps: TriColorChannels = [100, 100, 100];
      const nones: [boolean, boolean, boolean, boolean] = [
        false,
        false,
        false,
        false
      ];
      const alpha = 0.333333;
      const m = 1;
      const res = func('srgb', comps, nones, alpha, m, optFormat);
      assert.strictEqual(res[4], 0.333);
    });
  });
});

describe('getRawChannels', () => {
  const func = colorMix.getRawChannels;
  const opt = { colorSpace: 'srgb', format: 'mixValue' };

  it('should return none fallback array when color is "currentcolor"', () => {
    let convertFnCalled = false;
    const mockConvertFn = () => {
      convertFnCalled = true;
      return [255, 0, 0, 1];
    };
    const res = func('currentcolor', mockConvertFn, opt);
    assert.deepEqual(
      res,
      ['none', 'none', 'none', 'none'],
      'should return array of none constants'
    );
    assert.isFalse(
      convertFnCalled,
      'convertFn should not be executed for currentcolor'
    );
  });

  it('should call convertFn with color and opt when color is not "currentcolor"', () => {
    let passedColor = '';
    let passedOpt: any = null;
    const mockConvertFn = (c: string, opt: any) => {
      passedColor = c;
      passedOpt = opt;
      return [255, 0, 0, 1];
    };
    const res = func('red', mockConvertFn, opt);
    assert.strictEqual(passedColor, 'red');
    assert.deepEqual(passedOpt, opt);
    assert.deepEqual(res, [255, 0, 0, 1]);
  });

  it('should return null when convertFn returns null for invalid color', () => {
    const mockConvertFn = () => null;
    const res = func('invalid-color', mockConvertFn, opt);
    assert.isNull(res, 'should return null when convertFn fails');
  });
});

describe('mixSrgbSpace', () => {
  const func = colorMix.mixSrgbSpace;

  it('should mix colors in srgb space correctly', () => {
    const res = func('srgb', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.deepEqual(res, ['rgb', 128, 0, 128, 1]);
  });

  it('should mix colors in srgb-linear space correctly', () => {
    const res = func('srgb-linear', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'rgb');
  });

  it('should return null if colorA or colorB conversion fails', () => {
    assert.isNull(func('srgb', 'invalid-color', 'blue', 0.5, 0.5, '', 1));
    assert.isNull(func('srgb', 'red', 'invalid-color', 0.5, 0.5, '', 1));
  });

  it('should preserve none flags when both colors have none for a channel and format is computedValue', () => {
    const res = func(
      'srgb',
      'currentcolor',
      'currentcolor',
      0.5,
      0.5,
      'computedValue',
      1
    );
    assert.isNotNull(res);
    assert.deepEqual(res, ['srgb', 'none', 'none', 'none', 'none']);
  });
});

describe('mixXyzSpace', () => {
  const func = colorMix.mixXyzSpace;

  it('should mix colors in xyz-d65 space correctly', () => {
    const res = func('xyz-d65', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'rgb');
  });

  it('should mix colors in xyz-d50 space correctly', () => {
    const res = func('xyz-d50', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'rgb');
  });

  it('should return null if colorA or colorB conversion fails', () => {
    assert.isNull(func('xyz-d65', 'invalid-color', 'blue', 0.5, 0.5, '', 1));
    assert.isNull(func('xyz-d65', 'red', 'invalid-color', 0.5, 0.5, '', 1));
  });

  it('should preserve none flags and return specified color space format when format is computedValue', () => {
    const res = func(
      'xyz-d50',
      'currentcolor',
      'currentcolor',
      0.5,
      0.5,
      'computedValue',
      1
    );
    assert.isNotNull(res);
    assert.deepEqual(res, ['xyz-d50', 'none', 'none', 'none', 'none']);
  });
});

describe('mixHslHwbSpace', () => {
  const func = colorMix.mixHslHwbSpace;

  it('should mix colors in hsl space correctly', () => {
    const res = func('hsl', '', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'rgb');
  });

  it('should mix colors in hwb space correctly', () => {
    const res = func('hwb', '', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'rgb');
  });

  it('should apply hue interpolation when hueArc is specified', () => {
    const res = func('hsl', 'longer', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'rgb');
  });

  it('should handle zero alpha (alpha === 0) without division by zero', () => {
    const res = func('hsl', '', 'transparent', 'transparent', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[4], 0);
  });

  it('should return null if colorA or colorB conversion fails', () => {
    assert.isNull(func('hsl', '', 'invalid-color', 'blue', 0.5, 0.5, '', 1));
    assert.isNull(func('hsl', '', 'red', 'invalid-color', 0.5, 0.5, '', 1));
  });

  it('should output srgb space format when format is computedValue', () => {
    const res = func('hsl', '', 'red', 'blue', 0.5, 0.5, 'computedValue', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'srgb');
  });

  it('should set alpha nones flag to true when both colorA and colorB have none alpha', () => {
    const colorA = 'hsl(0deg 100% 50% / none)';
    const colorB = 'hsl(240deg 100% 50% / none)';
    const res = func('hsl', '', colorA, colorB, 0.5, 0.5, 'computedValue', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'srgb');
    assert.strictEqual(
      res?.[4],
      'none',
      'alpha channel should be NONE when both input alphas are NONE'
    );
  });

  it('should not set alpha nones flag to true when only one color has none alpha', () => {
    const colorA = 'hsl(0deg 100% 50% / none)';
    const colorB = 'hsl(240deg 100% 50% / 1)';
    const res = func('hsl', '', colorA, colorB, 0.5, 0.5, 'computedValue', 1);
    assert.isNotNull(res);
    assert.notStrictEqual(res?.[4], 'none', 'alpha channel should not be none');
  });
});

describe('mixLchSpace', () => {
  const func = colorMix.mixLchSpace;

  it('should mix colors in lch space correctly', () => {
    const res = func('lch', '', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'rgb');
  });

  it('should mix colors in oklch space correctly', () => {
    const res = func('oklch', '', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'rgb');
  });

  it('should apply hue interpolation when hueArc is specified', () => {
    const res = func('lch', 'shorter', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'rgb');
  });

  it('should handle zero alpha (alpha === 0) without division by zero', () => {
    const res = func(
      'oklch',
      '',
      'transparent',
      'transparent',
      0.5,
      0.5,
      '',
      1
    );
    assert.isNotNull(res);
    assert.strictEqual(res?.[4], 0);
  });

  it('should return null if colorA or colorB conversion fails', () => {
    assert.isNull(func('lch', '', 'invalid-color', 'blue', 0.5, 0.5, '', 1));
    assert.isNull(func('lch', '', 'red', 'invalid-color', 0.5, 0.5, '', 1));
  });

  it('should preserve none flags and skip resolveColorValue when format is computedValue', () => {
    const res = func(
      'oklch',
      '',
      'currentcolor',
      'currentcolor',
      0.5,
      0.5,
      'computedValue',
      1
    );
    assert.isNotNull(res);
    assert.deepEqual(res, ['oklch', 'none', 'none', 'none', 'none']);
  });
});

describe('mixLabSpace', () => {
  const func = colorMix.mixLabSpace;

  it('should mix colors in lab space correctly', () => {
    const res = func('lab', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'rgb');
  });

  it('should mix colors in oklab space correctly', () => {
    const res = func('oklab', 'red', 'blue', 0.5, 0.5, '', 1);
    assert.isNotNull(res);
    assert.strictEqual(res?.[0], 'rgb');
  });

  it('should return null if colorA or colorB conversion fails', () => {
    assert.isNull(func('lab', 'invalid-color', 'blue', 0.5, 0.5, '', 1));
    assert.isNull(func('lab', 'red', 'invalid-color', 0.5, 0.5, '', 1));
  });

  it('should preserve none flags and return specified color space format when format is computedValue', () => {
    const res = func(
      'oklab',
      'currentcolor',
      'currentcolor',
      0.5,
      0.5,
      'computedValue',
      1
    );
    assert.isNotNull(res);
    assert.deepEqual(res, ['oklab', 'none', 'none', 'none', 'none']);
  });
});

describe('computeMixedColor', () => {
  const func = colorMix.computeMixedColor;
  const cacheKey = 'test-cache-key';

  it('should route to mixSrgbSpace for srgb and srgb-linear', () => {
    const resSrgb = func(
      'srgb',
      '',
      'red',
      'blue',
      0.5,
      0.5,
      1,
      '',
      false,
      cacheKey
    );
    const resLinear = func(
      'srgb-linear',
      '',
      'red',
      'blue',
      0.5,
      0.5,
      1,
      '',
      false,
      cacheKey
    );
    assert.isNotNull(resSrgb);
    assert.isNotNull(resLinear);
    assert.strictEqual(resSrgb?.[0], 'rgb');
    assert.strictEqual(resLinear?.[0], 'rgb');
  });

  it('should route to mixXyzSpace for xyz, xyz-d50, and xyz-d65', () => {
    const resXyz = func(
      'xyz',
      '',
      'red',
      'blue',
      0.5,
      0.5,
      1,
      '',
      false,
      cacheKey
    );
    const resXyzD50 = func(
      'xyz-d50',
      '',
      'red',
      'blue',
      0.5,
      0.5,
      1,
      '',
      false,
      cacheKey
    );
    const resXyzD65 = func(
      'xyz-d65',
      '',
      'red',
      'blue',
      0.5,
      0.5,
      1,
      '',
      false,
      cacheKey
    );
    assert.isNotNull(resXyz);
    assert.isNotNull(resXyzD50);
    assert.isNotNull(resXyzD65);
    assert.strictEqual(resXyz?.[0], 'rgb');
  });

  it('should route to mixHslHwbSpace for hsl and hwb', () => {
    const resHsl = func(
      'hsl',
      '',
      'red',
      'blue',
      0.5,
      0.5,
      1,
      '',
      false,
      cacheKey
    );
    const resHwb = func(
      'hwb',
      '',
      'red',
      'blue',
      0.5,
      0.5,
      1,
      '',
      false,
      cacheKey
    );
    assert.isNotNull(resHsl);
    assert.isNotNull(resHwb);
    assert.strictEqual(resHsl?.[0], 'rgb');
    assert.strictEqual(resHwb?.[0], 'rgb');
  });

  it('should route to mixLchSpace for lch and oklch', () => {
    const resLch = func(
      'lch',
      '',
      'red',
      'blue',
      0.5,
      0.5,
      1,
      '',
      false,
      cacheKey
    );
    const resOklch = func(
      'oklch',
      '',
      'red',
      'blue',
      0.5,
      0.5,
      1,
      '',
      false,
      cacheKey
    );
    assert.isNotNull(resLch);
    assert.isNotNull(resOklch);
    assert.strictEqual(resLch?.[0], 'rgb');
  });

  it('should route to mixLabSpace for lab, oklab, and other unmatched spaces', () => {
    const resLab = func(
      'lab',
      '',
      'red',
      'blue',
      0.5,
      0.5,
      1,
      '',
      false,
      cacheKey
    );
    const resOklab = func(
      'oklab',
      '',
      'red',
      'blue',
      0.5,
      0.5,
      1,
      '',
      false,
      cacheKey
    );
    assert.isNotNull(resLab);
    assert.isNotNull(resOklab);
    assert.strictEqual(resLab?.[0], 'rgb');
  });

  it('should return cached invalid color value when result is null', () => {
    const res = func('srgb', '', '', 'blue', 0.5, 0.5, 1, '', false, cacheKey);
    const expected = cacheInvalidColorValue(cacheKey, '', false);
    assert.deepEqual(res, expected as any);
  });
});

describe('resolveColorMix', () => {
  const func = colorMix.resolveColorMix;

  it('should throw TypeError if value is not a string', () => {
    assert.throws(() => func(123 as any), TypeError, '123 is not a string.');
    assert.throws(() => func(null as any), TypeError, 'null is not a string.');
    assert.throws(
      () => func({} as any),
      TypeError,
      '[object Object] is not a string.'
    );
  });

  it('should return default invalid value for malformed color-mix wrapper', () => {
    const res = func('color-mix(in srgb, red, blue'); // missing closing paren
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should return default invalid value if argument count is not 3', () => {
    const res = func('color-mix(in srgb, red)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should return default invalid value for missing color space', () => {
    const res = func('color-mix(red, blue, green)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should return specified format correctly', () => {
    const res = func('color-mix(in srgb, red, blue)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(typeof res, 'string', 'result type');
    assert.isTrue((res as string).startsWith('color-mix('), 'result prefix');
  });

  it('should compute mixed color correctly (srgb, 50% / 50%)', () => {
    const res = func('color-mix(in srgb, red, blue)');
    assert.deepEqual(res, ['rgb', 128, 0, 128, 1], 'result');
  });

  it('should compute mixed color with explicit percentages', () => {
    const res = func('color-mix(in srgb, red 20%, blue)');
    assert.deepEqual(res, ['rgb', 51, 0, 204, 1], 'result');
  });

  it('should compute mixed color with hex values', () => {
    const res = func('color-mix(in srgb, #000000 75%, #ffffff)');
    assert.deepEqual(res, ['rgb', 64, 64, 64, 1], 'result');
  });

  it('should compute mixed color using hue interpolation', () => {
    const res = func('color-mix(in oklch longer hue, red, blue)');
    assert.isArray(res, 'result should be an array');
    assert.strictEqual(res![0], 'rgb', 'result color space should be rgb');
    assert.strictEqual(res!.length, 5, 'result should have 5 elements');
  });

  it('should return empty string for malformed colors in specified format', () => {
    const res = func('color-mix(in srgb, unknown-color, blue)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, '', 'result');
  });

  it('should normalize "xyz" color space to "xyz-d65"', () => {
    const res = func('color-mix(in xyz, red, blue)', {
      format: 'specifiedValue'
    });
    assert.isTrue(
      typeof res === 'string' && res.includes('in xyz-d65'),
      `Expected result to include "in xyz-d65", but got: ${res}`
    );
  });

  it('should return default invalid value for negative percentage', () => {
    const res = func('color-mix(in srgb, red -10%, blue)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should return default invalid value if both percentages are 0%', () => {
    const res = func('color-mix(in srgb, red 0%, blue 0%)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should return default invalid value if a single percentage exceeds 100%', () => {
    const res = func('color-mix(in srgb, red 110%, blue)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should return cached result on subsequent calls (Array)', () => {
    const value = 'color-mix(in srgb, red, blue)';
    const res1 = func(value);
    const res2 = func(value);
    assert.deepEqual(res1, res2, 'results should match exactly');
    assert.deepEqual(res2, ['rgb', 128, 0, 128, 1], 'result');
  });

  it('should return cached result on subsequent calls (String)', () => {
    const value = 'color-mix(in srgb, red, blue)';
    const opt = { format: 'specifiedValue' };
    const res1 = func(value, opt);
    const res2 = func(value, opt);
    assert.strictEqual(res1, res2, 'results should match exactly');
  });

  it('should return cached result on subsequent calls (null)', () => {
    const value = 'color-mix(in srgb, red)';
    const opt = { nullable: true };
    const res1 = func(value, opt);
    const res2 = func(value, opt);
    assert.strictEqual(res1, res2, 'results should match exactly');
    assert.strictEqual(res2, null, 'result should be null');
  });

  it('should resolve nested variables using resolver and custom properties', () => {
    const opt = {
      customProperty: {
        '--my-red': 'red',
        '--my-blue': 'blue'
      }
    };
    const res = func(
      'color-mix(in srgb, var(--my-red), var(--my-blue))',
      opt,
      resolveColor
    );
    assert.deepEqual(res, ['rgb', 128, 0, 128, 1], 'result');
  });

  describe('nested color-mix', () => {
    it('should return specified value for 3-level nested color-mix', () => {
      const input =
        'color-mix(in srgb, color-mix(in srgb, color-mix(in srgb, red, blue), green), yellow)';
      const res = func(input, {
        format: 'specifiedValue'
      });
      assert.strictEqual(
        res,
        'color-mix(in srgb, color-mix(in srgb, color-mix(in srgb, red, blue), green), yellow)',
        'result'
      );
    });

    it('should fallback to transparent rgb for 3-level nested color-mix', () => {
      const input =
        'color-mix(in srgb, color-mix(in srgb, color-mix(in srgb, red, blue), green), yellow)';
      const res = func(input, {
        format: 'computedValue'
      });
      assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
    });

    it('should return specified value for 3-level nested color-mix with percentages', () => {
      const input =
        'color-mix(in srgb, color-mix(in srgb, color-mix(in srgb, red 40%, blue 60%) 50%, green 50%) 30%, yellow 70%)';
      const res = func(input, {
        format: 'specifiedValue'
      });
      assert.strictEqual(
        res,
        'color-mix(in srgb, color-mix(in srgb, color-mix(in srgb, red 40%, blue 60%) 50%, green 50%) 30%, yellow 70%)',
        'result'
      );
    });

    it('should fallback to transparent rgb for 3-level nested color-mix with percentages', () => {
      const input =
        'color-mix(in srgb, color-mix(in srgb, color-mix(in srgb, red 40%, blue 60%) 50%, green 50%) 30%, yellow 70%)';
      const res = func(input, {
        format: 'computedValue'
      });
      assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
    });
  });

  describe('resolveColorMix resolver argument', () => {
    const func = colorMix.resolveColorMix;

    it('should use default resolver (returning null) if omitted', () => {
      const res = func('color-mix(in srgb, var(--unknown), blue)');
      assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
    });

    it('should invoke custom mock resolver with correct arguments (including opt)', () => {
      const mockResolver = vi.fn((v: string) => {
        if (v === 'var(--mock-red)') {
          return 'red';
        }
        if (v === 'var(--mock-blue)') {
          return 'blue';
        }
        return null;
      });
      const opt = { format: 'computedValue', colorScheme: 'dark' };
      const res = func(
        'color-mix(in srgb, var(--mock-red), var(--mock-blue))',
        opt,
        mockResolver
      );
      assert.deepEqual(res, ['srgb', 0.5, 0, 0.5, 1], 'result');
      assert.isTrue(
        mockResolver.mock.calls.length >= 2,
        'resolver should be called'
      );
      const passedOpt = mockResolver.mock.calls[0][1] as Options;
      assert.strictEqual(
        passedOpt.format,
        'computedValue',
        'should pass format'
      );
      assert.strictEqual(
        passedOpt.colorScheme,
        'dark',
        'should pass colorScheme'
      );
    });

    it('should resolve nested variables using actual resolver and custom properties', () => {
      const opt = {
        customProperty: {
          '--my-red': 'red',
          '--my-blue': 'blue'
        }
      };
      const res = func(
        'color-mix(in srgb, var(--my-red), var(--my-blue))',
        opt,
        resolveColor
      );
      assert.deepEqual(res, ['rgb', 128, 0, 128, 1], 'result');
    });
  });
});
