/* api */
import { assert, describe, it } from 'vitest';

/* test */
import * as api from '../src/index.js';

/**
 * The approx helper
 * @param actual - actual result
 * @param expected - expected result
 * @param tolerance - tolerance
 */
function assertApprox(actual: string, expected: string, tolerance = 0.05) {
  if (actual === expected) {
    return;
  }

  const getTokens = (str: string) => str.split(/[\s(),/]+/).filter(Boolean);
  const actualTokens = getTokens(actual);
  const expectedTokens = getTokens(expected);

  assert.equal(
    actualTokens.length,
    expectedTokens.length,
    `Token length mismatch: "${actual}" vs "${expected}"`
  );

  for (let i = 0; i < actualTokens.length; i++) {
    const act = actualTokens[i];
    const exp = expectedTokens[i];

    if (act === exp) {
      continue;
    }

    const actNum = Number(act);
    const expNum = Number(exp);

    if (!Number.isNaN(actNum) && !Number.isNaN(expNum)) {
      const diff = Math.abs(actNum - expNum);
      const tol =
        expNum === 0
          ? tolerance
          : Math.max(tolerance, Math.abs(expNum) * tolerance);
      assert.isTrue(
        diff <= tol || diff < 1e-3,
        `Expected "${exp}" (from "${expected}") to be close to "${act}" (from "${actual}"), diff: ${diff}`
      );
    } else {
      assert.equal(act, exp, `Mismatch at token ${i}: "${act}" vs "${exp}"`);
    }
  }
}

describe('CSS Color Level 5: Computation of colors using color-mix() function syntax', () => {
  const func = api.resolve;

  describe('hsl()', () => {
    it('should resolve hsl color-mix 1', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20%), hsl(30deg 30% 40%))'
        ) as string,
        'color(srgb 0.33 0.36 0.24)'
      );
    });

    it('should resolve hsl color-mix 2', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20%) 25%, hsl(30deg 30% 40%))'
        ) as string,
        'color(srgb 0.4375 0.415625 0.2625)'
      );
    });

    it('should resolve hsl color-mix 3', () => {
      assertApprox(
        func(
          'color-mix(in hsl, 25% hsl(120deg 10% 20%), hsl(30deg 30% 40%))'
        ) as string,
        'color(srgb 0.4375 0.415625 0.2625)'
      );
    });

    it('should resolve hsl color-mix 4', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20%), 25% hsl(30deg 30% 40%))'
        ) as string,
        'color(srgb 0.240625 0.2875 0.2125)'
      );
    });

    it('should resolve hsl color-mix 5', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20%), hsl(30deg 30% 40%) 25%)'
        ) as string,
        'color(srgb 0.240625 0.2875 0.2125)'
      );
    });

    it('should resolve hsl color-mix 6', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20%) 25%, hsl(30deg 30% 40%) 75%)'
        ) as string,
        'color(srgb 0.4375 0.415625 0.2625)'
      );
    });

    it('should resolve hsl color-mix 7', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20%) 30%, hsl(30deg 30% 40%) 90%)'
        ) as string,
        'color(srgb 0.4375 0.415625 0.2625)'
      );
    });

    it('should resolve hsl color-mix 8', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20%) 12.5%, hsl(30deg 30% 40%) 37.5%)'
        ) as string,
        'color(srgb 0.4375 0.415625 0.2625 / 0.5)'
      );
    });

    it('should resolve hsl color-mix 9', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20%) 0%, hsl(30deg 30% 40%))'
        ) as string,
        'color(srgb 0.52 0.4 0.28)'
      );
    });

    it('should resolve hsl alpha color-mix 1', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20% / .4), hsl(30deg 30% 40% / .8))'
        ) as string,
        'color(srgb 0.372222 0.411111 0.255556 / 0.6)'
      );
    });

    it('should resolve hsl alpha color-mix 2', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20%) 25%, hsl(30deg 30% 40% / .8))'
        ) as string,
        'color(srgb 0.42346 0.402889 0.258893 / 0.85)'
      );
    });

    it('should resolve hsl alpha color-mix 3', () => {
      assertApprox(
        func(
          'color-mix(in hsl, 25% hsl(120deg 10% 20% / .4), hsl(30deg 30% 40% / .8))'
        ) as string,
        'color(srgb 0.472245 0.447041 0.270612 / 0.7)'
      );
    });

    it('should resolve hsl alpha color-mix 4', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20% / .4), 25% hsl(30deg 30% 40% / .8))'
        ) as string,
        'color(srgb 0.2674 0.3304 0.2296 / 0.5)'
      );
    });

    it('should resolve hsl alpha color-mix 5', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20% / .4), hsl(30deg 30% 40% / .8) 25%)'
        ) as string,
        'color(srgb 0.2674 0.3304 0.2296 / 0.5)'
      );
    });

    it('should resolve hsl alpha color-mix 6', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20% / .4) 25%, hsl(30deg 30% 40% / .8) 75%)'
        ) as string,
        'color(srgb 0.472245 0.447041 0.270612 / 0.7)'
      );
    });

    it('should resolve hsl alpha color-mix 7', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20% / .4) 30%, hsl(30deg 30% 40% / .8) 90%)'
        ) as string,
        'color(srgb 0.472245 0.447041 0.270612 / 0.7)'
      );
    });

    it('should resolve hsl alpha color-mix 8', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20% / .4) 12.5%, hsl(30deg 30% 40% / .8) 37.5%)'
        ) as string,
        'color(srgb 0.472245 0.447041 0.270612 / 0.35)'
      );
    });

    it('should resolve hsl alpha color-mix 9', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20% / .4) 0%, hsl(30deg 30% 40% / .8))'
        ) as string,
        'color(srgb 0.52 0.4 0.28 / 0.8)'
      );
    });

    it('should resolve hsl transparency 1', () => {
      assertApprox(
        func('color-mix(in hsl, transparent, hsl(30deg 30% 40%))') as string,
        'color(srgb 0.52 0.4 0.28 / 0.5)'
      );
    });

    it('should resolve hsl transparency 2', () => {
      assertApprox(
        func(
          'color-mix(in hsl, transparent 10%, hsl(30deg 30% 40%))'
        ) as string,
        'color(srgb 0.52 0.4 0.28 / 0.9)'
      );
    });

    it('should resolve hsl transparency 3', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20% / 0), hsl(30deg 30% 40%))'
        ) as string,
        'color(srgb 0.46 0.52 0.28 / 0.5)'
      );
    });

    it('should resolve hsl transparency 4', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 10% 20% / 0) 10%, hsl(30deg 30% 40%))'
        ) as string,
        'color(srgb 0.52 0.436 0.28 / 0.9)'
      );
    });

    it('should resolve hsl white and blue', () => {
      assertApprox(
        func('color-mix(in hsl, white, blue)') as string,
        'color(srgb 0.625 0.625 0.875)'
      );
      assertApprox(
        func('color-mix(in hsl, white 10%, blue)') as string,
        'color(srgb 0.145 0.145 0.955)'
      );
    });

    it('should resolve hsl hue variations', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(40deg 50% 50%), hsl(60deg 50% 50%))'
        ) as string,
        'color(srgb 0.75 0.666667 0.25)'
      );
      assertApprox(
        func(
          'color-mix(in hsl, hsl(60deg 50% 50%), hsl(40deg 50% 50%))'
        ) as string,
        'color(srgb 0.75 0.666667 0.25)'
      );
      assertApprox(
        func(
          'color-mix(in hsl, hsl(50deg 50% 50%), hsl(330deg 50% 50%))'
        ) as string,
        'color(srgb 0.75 0.333333 0.25)'
      );
      assertApprox(
        func(
          'color-mix(in hsl, hsl(330deg 50% 50%), hsl(50deg 50% 50%))'
        ) as string,
        'color(srgb 0.75 0.333333 0.25)'
      );
      assertApprox(
        func(
          'color-mix(in hsl, hsl(20deg 50% 50%), hsl(320deg 50% 50%))'
        ) as string,
        'color(srgb 0.75 0.25 0.333333)'
      );
      assertApprox(
        func(
          'color-mix(in hsl, hsl(320deg 50% 50%), hsl(20deg 50% 50%))'
        ) as string,
        'color(srgb 0.75 0.25 0.333333)'
      );
    });

    it('should resolve hsl shorter hue', () => {
      assertApprox(
        func(
          'color-mix(in hsl shorter hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))'
        ) as string,
        'color(srgb 0.75 0.666667 0.25)'
      );
      assertApprox(
        func('color-mix(in hsl shorter hue, red, white)') as string,
        'color(srgb 0.875 0.625 0.625)'
      );
      assertApprox(
        func('color-mix(in hsl shorter hue, red, black)') as string,
        'color(srgb 0.375 0.125 0.125)'
      );
      assertApprox(
        func('color-mix(in hsl shorter hue, red, transparent)') as string,
        'color(srgb 1 0 0 / 0.5)'
      );
    });

    it('should resolve hsl longer hue', () => {
      assertApprox(
        func(
          'color-mix(in hsl longer hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))'
        ) as string,
        'color(srgb 0.25 0.333333 0.75)'
      );
      assertApprox(
        func('color-mix(in hsl longer hue, red, white)') as string,
        'color(srgb 0.625 0.875 0.875)'
      );
      assertApprox(
        func('color-mix(in hsl longer hue, red, black)') as string,
        'color(srgb 0.125 0.375 0.375)'
      );
      assertApprox(
        func('color-mix(in hsl longer hue, red, transparent)') as string,
        'color(srgb 0 1 1 / 0.5)'
      );
    });

    it('should resolve hsl increasing hue', () => {
      assertApprox(
        func(
          'color-mix(in hsl increasing hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))'
        ) as string,
        'color(srgb 0.75 0.666667 0.25)'
      );
      assertApprox(
        func(
          'color-mix(in hsl increasing hue, hsl(60deg 50% 50%), hsl(40deg 50% 50%))'
        ) as string,
        'color(srgb 0.25 0.333333 0.75)'
      );
    });

    it('should resolve hsl decreasing hue', () => {
      assertApprox(
        func(
          'color-mix(in hsl decreasing hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))'
        ) as string,
        'color(srgb 0.25 0.333333 0.75)'
      );
      assertApprox(
        func(
          'color-mix(in hsl decreasing hue, hsl(60deg 50% 50%), hsl(40deg 50% 50%))'
        ) as string,
        'color(srgb 0.75 0.666667 0.25)'
      );
    });

    it.skip('should resolve hsl when all components are none', () => {
      assert.strictEqual(
        func(
          'color-mix(in hsl, hsl(none none none), hsl(none none none))'
        ) as string,
        'hsl(none none none)'
      );
    });

    it.skip('should resolve hsl when alpha components are both none', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 40% 40% / none), hsl(0deg 40% 40% / none))'
        ) as string,
        'hsl(60 40% 40% / none)'
      );
    });

    it('should resolve hsl none components', () => {
      assertApprox(
        func(
          'color-mix(in hsl, hsl(none none none), hsl(30deg 40% 80%))'
        ) as string,
        'color(srgb 0.88 0.8 0.72)'
      );
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 20% 40%), hsl(none none none))'
        ) as string,
        'color(srgb 0.32 0.48 0.32)'
      );
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 20% none), hsl(30deg 40% 60%))'
        ) as string,
        'color(srgb 0.66 0.72 0.48)'
      );
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 20% 40%), hsl(30deg 20% none))'
        ) as string,
        'color(srgb 0.44 0.48 0.32)'
      );
      assertApprox(
        func(
          'color-mix(in hsl, hsl(none 20% 40%), hsl(30deg none 80%))'
        ) as string,
        'color(srgb 0.68 0.6 0.52)'
      );
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 40% 40% / none), hsl(0deg 40% 40%))'
        ) as string,
        'color(srgb 0.56 0.56 0.24)'
      );
      assertApprox(
        func(
          'color-mix(in hsl, hsl(120deg 40% 40% / none), hsl(0deg 40% 40% / 0.5))'
        ) as string,
        'color(srgb 0.56 0.56 0.24 / 0.5)'
      );
    });
  });

  describe('hwb()', () => {
    it('should resolve hwb color-mix basic', () => {
      assertApprox(
        func(
          'color-mix(in hwb, hwb(120deg 10% 20%), hwb(30deg 30% 40%))'
        ) as string,
        'color(srgb 0.575 0.7 0.2)'
      );
      assertApprox(
        func('color-mix(in hwb, white, blue)') as string,
        'color(srgb 0.5 0.5 1)'
      );
      assertApprox(
        func('color-mix(in hwb, white 10%, blue)') as string,
        'color(srgb 0.1 0.1 1)'
      );
    });

    it('should resolve hwb shorter hue', () => {
      assertApprox(
        func('color-mix(in hwb shorter hue, red, white)') as string,
        'color(srgb 1 0.5 0.5)'
      );
      assertApprox(
        func('color-mix(in hwb shorter hue, red, black)') as string,
        'color(srgb 0.5 0 0)'
      );
    });

    it.skip('should resolve hwb when all components are none', () => {
      assert.strictEqual(
        func(
          'color-mix(in hwb, hwb(none none none), hwb(none none none))'
        ) as string,
        'hwb(none none none)'
      );
    });

    it.skip('should resolve hwb when alpha components are both none', () => {
      assertApprox(
        func(
          'color-mix(in hwb, hwb(120deg 40% 40% / none), hwb(0deg 40% 40% / none))'
        ) as string,
        'hwb(60 40% 40% / none)'
      );
    });

    it('should resolve hwb none components', () => {
      assertApprox(
        func(
          'color-mix(in hwb, hwb(none none none), hwb(30deg 30% 40%))'
        ) as string,
        'color(srgb 0.6 0.45 0.3)'
      );
    });
  });

  describe('lch()', () => {
    it('should resolve lch color-mix basic', () => {
      assertApprox(
        func('color-mix(in lch, lch(10 20 30deg), lch(50 60 70deg))') as string,
        'lch(30 40 50)'
      );
      assertApprox(
        func(
          'color-mix(in lch, lch(10 20 30deg) 25%, lch(50 60 70deg))'
        ) as string,
        'lch(40 50 60)'
      );
    });

    it.skip('should resolve lch achromatic powerless hues with black', () => {
      assertApprox(
        func('color-mix(in lch, lab(50 0 0), black)') as string,
        'lch(25 0 none)'
      );
    });

    it('should resolve lch achromatic powerless hues', () => {
      assertApprox(
        func(
          'color-mix(in lch, lch(100 0 320deg), lch(100 0 20deg))'
        ) as string,
        'lch(100 0 350)'
      );
    });
  });

  describe('oklch()', () => {
    it('should resolve oklch color-mix basic', () => {
      assertApprox(
        func(
          'color-mix(in oklch, oklch(0.1 0.2 30deg), oklch(0.5 0.6 70deg))'
        ) as string,
        'oklch(0.3 0.4 50)'
      );
      assertApprox(
        func('color-mix(in oklch, white, blue)') as string,
        'oklch(0.726 0.157 264.052)'
      );
    });

    it('should handle zero sum midpoint', () => {
      assertApprox(
        func('color-mix(in oklch, teal 0%, olive 0%)') as string,
        'oklch(0.561894 0.109643 152.2691 / 0)'
      );
    });
  });

  describe('lab()', () => {
    it('should resolve lab color-mix basic', () => {
      assertApprox(
        func('color-mix(in lab, lab(10 20 30), lab(50 60 70))') as string,
        'lab(30 40 50)'
      );
      assertApprox(
        func('color-mix(in lab, lab(10 20 30) 25%, lab(50 60 70))') as string,
        'lab(40 50 60)'
      );
    });
  });

  describe('oklab()', () => {
    for (const colorSpace of ['', 'in oklab, ']) {
      it(`should resolve oklab color-mix with prefix "${colorSpace}"`, () => {
        assertApprox(
          func(
            `color-mix(${colorSpace}oklab(0.1 0.2 0.3), oklab(0.5 0.6 0.7))`
          ) as string,
          'oklab(0.3 0.4 0.5)'
        );
        assertApprox(
          func(
            `color-mix(${colorSpace}oklab(0.1 0.2 0.3) 25%, oklab(0.5 0.6 0.7))`
          ) as string,
          'oklab(0.4 0.5 0.6)'
        );
      });
    }
  });

  describe('Color Spaces Loop Tests', () => {
    const colorSpaces = [
      'srgb',
      'srgb-linear',
      'display-p3',
      'display-p3-linear',
      'a98-rgb',
      'prophoto-rgb',
      'rec2020',
      'xyz',
      'xyz-d50',
      'xyz-d65'
    ];

    for (const colorSpace of colorSpaces) {
      const resultColorSpace = colorSpace === 'xyz' ? 'xyz-d65' : colorSpace;

      it.skip(`should resolve color-mix in ${colorSpace}`, () => {
        assertApprox(
          func(
            `color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3), color(${colorSpace} .5 .6 .7))`
          ) as string,
          `color(${resultColorSpace} 0.3 0.4 0.5)`
        );
        assertApprox(
          func(
            `color-mix(in ${colorSpace}, color(${colorSpace} 1 1 1), color(${colorSpace} 0 0 1))`
          ) as string,
          `color(${resultColorSpace} 0.5 0.5 1)`
        );
      });
    }
  });

  describe('Percent normalization and edge cases', () => {
    it('should normalize percentages correctly', () => {
      assertApprox(
        func('color-mix(in srgb, red 50%, blue 50%)') as string,
        'color(srgb 0.5 0 0.5)'
      );
      assertApprox(
        func('color-mix(in srgb, red 10%, blue 90%)') as string,
        'color(srgb 0.1 0 0.9)'
      );
      assertApprox(
        func('color-mix(in srgb, red 50%, blue 40%)') as string,
        'color(srgb 0.555556 0 0.444444 / 0.9)'
      );
      assertApprox(
        func('color-mix(in srgb, red 0%, blue 0%)') as string,
        'color(srgb 0.5 0 0.5 / 0)'
      );
      assertApprox(
        func('color-mix(in srgb, red, blue)') as string,
        'color(srgb 0.5 0 0.5)'
      );
    });

    it.skip('should support font-relative length in calc inside percent', () => {
      assertApprox(
        func(
          'color-mix(in srgb, red calc(50% + (sign(100em - 1px) * 10%)), blue)'
        ) as string,
        'color(srgb 0.6 0 0.4)'
      );
    });

    it.skip('should handle carry forward analogous sets with all missing components', () => {
      assertApprox(
        func(
          'color-mix(in oklch, oklab(0.1 none none), oklch(0.3 0.2 90deg))'
        ) as string,
        'oklch(0.2 0.2 90)'
      );
      assertApprox(
        func(
          'color-mix(in oklab, oklch(0.1 none none), oklab(0.3 0.2 0.4))'
        ) as string,
        'oklab(0.2 0.2 0.4)'
      );
    });

    it('should handle color-mix with 1 or more colors', () => {
      assertApprox(
        func('color-mix(in srgb, red)') as string,
        'color(srgb 1 0 0)'
      );
      assertApprox(
        func('color-mix(in srgb, red 50%)') as string,
        'color(srgb 1 0 0 / 0.5)'
      );
      assertApprox(
        func('color-mix(in srgb, red, green, blue)') as string,
        'color(srgb 0.333333 0.16732 0.333333)'
      );
      assertApprox(
        func('color-mix(in srgb, red 0%)') as string,
        'color(srgb 1 0 0 / 0)'
      );
    });
  });
});
