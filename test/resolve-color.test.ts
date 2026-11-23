/**
 * resolve-color.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/utils/cache';
import { NONE, VAL_COMP, VAL_MIX, VAL_SPEC } from '../src/utils/constant';
import * as resolve from '../src/resolvers/resolve-color';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('resolve color value', () => {
  const func = resolve.resolveColorValue;

  it('should throw TypeError if value is not a string', () => {
    assert.throws(() => func(123 as any), TypeError);
  });

  it('should resolve named colors correctly', () => {
    const res = func('red');
    assert.deepEqual(res, ['rgb', 255, 0, 0, 1]);
  });

  it('should resolve named colors correctly', () => {
    const res = func('RED');
    assert.deepEqual(res, ['rgb', 255, 0, 0, 1]);
  });

  it('should return string for named colors when format is VAL_SPEC', () => {
    const res = func('blue', { format: VAL_SPEC });
    assert.strictEqual(res, 'blue');

    const res2 = func('BLUE', { format: VAL_SPEC });
    assert.strictEqual(res2, 'blue');
  });

  it('should handle transparent for different formats', () => {
    const resSpec = func('transparent', { format: VAL_SPEC });
    assert.strictEqual(resSpec, 'transparent');

    const resMix = func('transparent', { format: VAL_MIX });
    assert.deepEqual(resMix, ['srgb', 0, 0, 0, 0]);

    const resComp = func('transparent', { format: VAL_COMP });
    assert.deepEqual(resComp, ['rgb', 0, 0, 0, 0]);
  });

  it('should handle invalid string values based on format and nullable', () => {
    const resSpec = func('invalid_color', { format: VAL_SPEC });
    assert.strictEqual(resSpec, '');

    const resNull = func('invalid_color', { nullable: true });
    assert.isNull(resNull);

    const resDefault = func('invalid_color');
    assert.deepEqual(resDefault, ['srgb', NONE, NONE, NONE, NONE]);
  });

  it('should resolve hex colors correctly', () => {
    const res = func('#00ff00');
    assert.deepEqual(res, ['rgb', 0, 255, 0, 1]);
  });

  it('should resolve hsl colors correctly', () => {
    const res = func('hsl(120 100% 50%)');
    assert.deepEqual(res, ['rgb', 0, 255, 0, 1]);
  });

  it('should resolve hsl colors correctly for VAL_SPEC', () => {
    const res = func('hsl(120 100% 50%)', { format: VAL_SPEC });
    assert.deepEqual(res, ['rgb', 0, 255, 0, 1]);
  });

  it('should resolve hwb colors correctly', () => {
    const res = func('hwb(120 0% 0%)');
    assert.deepEqual(res, ['rgb', 0, 255, 0, 1]);
  });

  it('should resolve hwb colors correctly for VAL_SPEC', () => {
    const res = func('hwb(120 0% 0%)', { format: VAL_SPEC });
    assert.deepEqual(res, ['rgb', 0, 255, 0, 1]);
  });

  it('should resolve lab and lch colors correctly', () => {
    const resLab = func('lab(50 20 30)');
    assert.strictEqual(resLab?.[0], 'rgb');

    const resLabSpec = func('lab(50 20 30)', { format: VAL_SPEC });
    assert.deepEqual(resLabSpec, ['lab', 50, 20, 30, 1]);

    const resLchSpec = func('lch(50 20 30)', { format: VAL_SPEC });
    assert.deepEqual(resLchSpec, ['lch', 50, 20, 30, 1]);
  });

  it('should resolve oklab and oklch colors correctly', () => {
    const resOklab = func('oklab(0.5 0.1 0.1)');
    assert.strictEqual(resOklab?.[0], 'rgb');

    const resOklabSpec = func('oklab(0.5 0.1 0.1)', {
      format: VAL_SPEC
    });
    assert.deepEqual(resOklabSpec, ['oklab', 0.5, 0.1, 0.1, 1]);

    const resOklchSpec = func('oklch(0.5 0.1 30)', {
      format: VAL_SPEC
    });
    assert.deepEqual(resOklchSpec, ['oklch', 0.5, 0.1, 30, 1]);
  });

  it('should resolve srgb colorSpace for VAL_MIX format', () => {
    const res = func('rgb(255 0 0)', {
      colorSpace: 'srgb',
      format: VAL_MIX
    });
    assert.deepEqual(res, ['srgb', 1, 0, 0, 1]);
  });

  it('should return cached result on consecutive calls', () => {
    const res1 = func('red');
    const res2 = func('red');
    assert.deepEqual(res1, res2);
  });

  it('should return null when nullable and value is not transparent', () => {
    const opt = { nullable: true };
    const res1 = func('invalidcolor', opt);
    assert.isNull(res1);

    const res2 = func('invalidcolor', opt);
    assert.isNull(res2);
    assert.deepStrictEqual(func('transparent', opt), ['rgb', 0, 0, 0, 0]);
  });

  it('should handle VAL_MIX format in resolveColorValue', () => {
    const opt = { format: VAL_MIX };
    assert.deepStrictEqual(func('transparent', opt), ['srgb', 0, 0, 0, 0]);

    const res1 = func('invalidcolor', opt);
    assert.isNull(res1);

    const res2 = func('invalidcolor', opt);
    assert.isNull(res2);
  });

  it('should return lower value for currentcolor when format is VAL_SPEC', () => {
    const opt = { format: VAL_SPEC };
    assert.strictEqual(func('currentcolor', opt), 'currentcolor');
    assert.strictEqual(func('currentColor', opt), 'currentcolor');
  });

  it('should return missing color value for missing currentcolor', () => {
    assert.deepEqual(func('currentcolor'), ['srgb', NONE, NONE, NONE, NONE]);
    assert.deepEqual(func('currentColor'), ['srgb', NONE, NONE, NONE, NONE]);
  });
});

describe('resolve color func', () => {
  const func = resolve.resolveColorFunc;

  it('should return null if value is not a string', () => {
    const res = func(123 as any);
    assert.strictEqual(res, null, 'result');
  });

  it('should handle invalid color function inputs', () => {
    const resNull = func('invalid_func()', { nullable: true });
    assert.isNull(resNull);

    const resSpec = func('invalid_func()', { format: VAL_SPEC });
    assert.strictEqual(resSpec, '');

    const resDefault = func('invalid_func()');
    assert.deepEqual(resDefault, ['srgb', NONE, NONE, NONE, NONE]);
  });

  it('should return parsed channels directly for VAL_SPEC format', () => {
    const res = func('color(srgb 1 0 0)', { format: VAL_SPEC });
    assert.deepEqual(res, ['srgb', 1, 0, 0, 1]);
  });

  it('should return parsed channels when format and colorSpace matches', () => {
    const res = func('color(display-p3 1 0 0)', {
      colorSpace: 'display-p3',
      format: VAL_MIX
    });
    assert.deepEqual(res, ['display-p3', 1, 0, 0, 1]);
  });

  it('should transform color space to rgb channels by default', () => {
    const res = func('color(srgb-linear 1 0 0)');
    assert.strictEqual(res?.[0], 'rgb');
    assert.isArray(res);
  });

  it('should return cached result on consecutive calls', () => {
    const res1 = func('color(srgb 0 1 0)');
    const res2 = func('color(srgb 0 1 0)');
    assert.deepEqual(res1, res2);
  });
});

describe('resolve color', () => {
  const func = resolve.resolveColor;

  it('should throw TypeError if value is not a string', () => {
    assert.throws(() => func(123 as any), TypeError);
  });

  it('should resolve standard colors to rgb string', () => {
    assert.strictEqual(func('red'), 'rgb(255, 0, 0)');
    assert.strictEqual(func('#00ff00'), 'rgb(0, 255, 0)');
  });

  it('should handle var() resolution', () => {
    const resSpec = func('var(--my-color)', { format: VAL_SPEC });
    assert.strictEqual(resSpec, 'var(--my-color)');

    const resHex = func('var(--my-color)', { format: 'hex' });
    assert.strictEqual(resHex, null);

    const resHexAlpha = func('var(--my-color)', { format: 'hexAlpha' });
    assert.strictEqual(resHexAlpha, null);

    const resNull = func('var(--my-color)', { nullable: true });
    assert.isNull(resNull);

    const resUnresolved = func('var(--my-color)');
    assert.strictEqual(resUnresolved, 'color(srgb none none none / none)');

    const resResolved = func('var(--my-color)', {
      customProperty: {
        '--my-color': 'green'
      }
    });
    assert.strictEqual(resResolved, 'rgb(0, 128, 0)');
  });

  it('should handle light-dark() resolution', () => {
    const resLight = func('light-dark(red, blue)', {
      colorScheme: 'light'
    });
    assert.strictEqual(resLight, 'rgb(255, 0, 0)');

    const resDark = func('light-dark(red, blue)', {
      colorScheme: 'dark'
    });
    assert.strictEqual(resDark, 'rgb(0, 0, 255)');

    const resSpec = func('light-dark(red, blue)', {
      format: VAL_SPEC
    });
    assert.strictEqual(resSpec, 'light-dark(red, blue)');

    const resComp = func('light-dark(red, blue)', {
      format: VAL_COMP
    });
    assert.strictEqual(resComp, 'rgb(255, 0, 0)');

    const resCompLight = func('light-dark(red, blue)', {
      format: VAL_COMP,
      colorScheme: 'light'
    });
    assert.strictEqual(resCompLight, 'rgb(255, 0, 0)');

    const resCompDark = func('light-dark(red, blue)', {
      format: VAL_COMP,
      colorScheme: 'dark'
    });
    assert.strictEqual(resCompDark, 'rgb(0, 0, 255)');
  });

  it('should handle transparent keyword for formats', () => {
    assert.strictEqual(
      func('transparent', { format: VAL_SPEC }),
      'transparent'
    );
    assert.strictEqual(func('transparent', { format: 'hex' }), null);
    assert.strictEqual(
      func('transparent', { format: 'hexAlpha' }),
      '#00000000'
    );
    assert.strictEqual(func('transparent'), 'rgba(0, 0, 0, 0)');
  });

  it('should handle currentcolor keyword', () => {
    assert.strictEqual(
      func('currentcolor', { format: VAL_SPEC }),
      'currentcolor'
    );

    assert.strictEqual(
      func('CURRENTCOLOR', { format: VAL_SPEC }),
      'currentcolor'
    );

    const resResolved = func('currentcolor', {
      currentColor: 'blue'
    });
    assert.strictEqual(resResolved, 'rgb(0, 0, 255)');
  });

  it('should throw if currentColor contains currentcolor keyword', () => {
    assert.throws(
      () =>
        func('currentcolor', {
          currentColor: 'currentColor'
        }),
      SyntaxError
    );
  });

  it('should resolve to hex/hexAlpha formats', () => {
    assert.strictEqual(func('red', { format: 'hex' }), '#ff0000');
    assert.strictEqual(
      func('rgba(255, 0, 0, 0.5)', { format: 'hexAlpha' }),
      '#ff000080'
    );
  });

  it('should return string for invalid colors', () => {
    assert.strictEqual(func('invalid', { format: VAL_SPEC }), '');
  });

  it('should return null for invalid colors', () => {
    assert.strictEqual(func('invalid', { format: 'hex' }), null);
    assert.strictEqual(func('invalid', { format: 'hexAlpha' }), null);
  });

  it('should return cached result on consecutive calls', () => {
    const res1 = func('blue');
    const res2 = func('blue');
    assert.strictEqual(res1, res2);
  });

  it('should format lab, lch, oklab, and oklch color spaces correctly', () => {
    assert.strictEqual(func('lab(50 20 30)'), 'lab(50 20 30)');
    assert.strictEqual(func('oklch(0.6 0.15 180)'), 'oklch(0.6 0.15 180)');
    assert.strictEqual(func('lab(50 20 30 / 0.5)'), 'lab(50 20 30 / 0.5)');
    assert.strictEqual(
      func('oklch(0.6 0.15 180 / 0.8)'),
      'oklch(0.6 0.15 180 / 0.8)'
    );
  });

  it('should cache and return resolved channels', () => {
    const validValue = 'rgb(255 0 0)';
    const res1 = func(validValue, { format: 'computedValue' });
    assert.strictEqual(res1, 'rgb(255, 0, 0)');

    const res2 = func(validValue, { format: 'computedValue' });
    assert.strictEqual(res2, 'rgb(255, 0, 0)');
    assert.strictEqual(res1, res2);
  });

  it('should cache and return null when resolvedVal is null', () => {
    const opts = { nullable: true };
    const invalidValue = 'invalid-color-name';

    const res1 = func(invalidValue, opts);
    assert.isNull(res1);

    const res2 = func(invalidValue, opts);
    assert.isNull(res2);
  });

  it('should cache and return null when resolveColorFunc returns null', () => {
    const opts = { nullable: true };
    const invalidColorFunc = 'color(invalid-space 1 0 0)';

    const res1 = func(invalidColorFunc, opts);
    assert.isNull(res1);

    const res2 = func(invalidColorFunc, opts);
    assert.isNull(res2);
  });

  it('should resolve color-mix with currentColor and transparent', () => {
    const mixedValue = 'color-mix(in srgb, currentcolor, transparent)';
    const res = func(mixedValue, { currentColor: 'red' });
    assert.strictEqual(res, 'color(srgb 1 0 0 / 0.5)');
  });

  it('should cache and return null when resolveColorMix returns null', () => {
    const opts = { nullable: true };
    const invalidMix = 'color-mix(in invalid-space, red, blue)';

    const res1 = func(invalidMix, opts);
    assert.isNull(res1);

    const res2 = func(invalidMix, opts);
    assert.isNull(res2);
  });

  it('should format specified color values when format is VAL_SPEC', () => {
    const opt = { format: VAL_SPEC };
    assert.strictEqual(func('red', opt), 'red');
    assert.strictEqual(
      func('rgba(255, 0, 0, 0.5)', opt),
      'rgba(255, 0, 0, 0.5)'
    );
    assert.strictEqual(func('lab(50 20 30)', opt), 'lab(50 20 30)');
    assert.strictEqual(func('lab(50 20 30 / 0.5)', opt), 'lab(50 20 30 / 0.5)');
    assert.strictEqual(func('currentcolor', opt), 'currentcolor');
  });

  it('should format color() function values when format is VAL_SPEC', () => {
    const opt = { format: VAL_SPEC };
    assert.strictEqual(func('color(srgb 1 0 0)', opt), 'color(srgb 1 0 0)');
    assert.strictEqual(
      func('color(srgb 1 0 0 / 0.5)', opt),
      'color(srgb 1 0 0 / 0.5)'
    );
  });

  it('should format color-mix values when format is VAL_SPEC', () => {
    const opt = { format: VAL_SPEC };
    const mixedValue = 'color-mix(in srgb, red, blue)';
    const res = func(mixedValue, opt);
    assert.strictEqual(res, 'color-mix(in srgb, red, blue)');
  });

  it('should handle currentcolor when currentColor option is missing', () => {
    const resComp = func('currentcolor');
    assert.strictEqual(resComp, 'color(srgb none none none / none)');

    const resHex = func('currentcolor', { format: 'hex' });
    assert.strictEqual(resHex, null);
  });

  it('should cache and return null when currentColor resolution fails', () => {
    const opt = { currentColor: 'invalid-color', nullable: true };

    const res1 = func('currentcolor', opt);
    assert.isNull(res1);

    const res2 = func('currentcolor', opt);
    assert.isNull(res2);
  });

  it('should resolve currentcolor using various currentColor options', () => {
    assert.strictEqual(
      func('currentcolor', {
        currentColor: 'color-mix(in srgb, red, blue)'
      }),
      'color(srgb 0.5 0 0.5)'
    );
    assert.strictEqual(
      func('currentcolor', {
        currentColor: 'color(srgb 1 0 0)'
      }),
      'color(srgb 1 0 0)'
    );
    assert.strictEqual(
      func('currentcolor', { currentColor: 'blue' }),
      'rgb(0, 0, 255)'
    );
  });

  it('should resolve color values containing calc() expressions', () => {
    assert.strictEqual(func('rgb(calc(100 + 55), 0, 0)'), 'rgb(155, 0, 0)');
    assert.strictEqual(
      func('hsl(calc(120deg + 60deg) 100% 50%)'),
      'rgb(0, 255, 255)'
    );
  });

  it('should handle relative color syntax with various formats', () => {
    const invalidRelSyntax = 'rgb(from red invalid-syntax)';
    const validRel = 'rgb(from red r g b)';
    assert.strictEqual(
      func(invalidRelSyntax),
      'color(srgb none none none / none)'
    );
    assert.isNull(func(invalidRelSyntax, { nullable: true }));
    assert.strictEqual(
      func(validRel, { format: VAL_SPEC }),
      'rgb(from red r g b)'
    );
    assert.strictEqual(func(invalidRelSyntax, { format: VAL_SPEC }), '');
    assert.strictEqual(func(validRel, { format: 'hex' }), '#ff0000');
    assert.isNull(func(invalidRelSyntax, { format: 'hex' }));
  });

  it('should execute fallback code block when resolution returns null', () => {
    const opt = { nullable: false };
    const invalidLightDark = 'light-dark()';
    assert.strictEqual(
      func(invalidLightDark, { ...opt, format: VAL_SPEC }),
      ''
    );
    assert.strictEqual(func(invalidLightDark, { ...opt, format: 'hex' }), null);
    assert.strictEqual(
      func(invalidLightDark, { ...opt, format: 'hexAlpha' }),
      null
    );
    assert.strictEqual(
      func(invalidLightDark, { ...opt, nullable: true }),
      null
    );
    assert.strictEqual(
      func(invalidLightDark, opt),
      'color(srgb none none none / none)'
    );
  });

  it('should execute fallback code block', () => {
    const opt = { nullable: false };
    const invalidLightDark = 'light-dark(foo)';
    assert.strictEqual(
      func(invalidLightDark, { ...opt, format: VAL_SPEC }),
      ''
    );
    assert.strictEqual(func(invalidLightDark, { ...opt, format: 'hex' }), null);
    assert.strictEqual(
      func(invalidLightDark, { ...opt, format: 'hexAlpha' }),
      null
    );
    assert.strictEqual(
      func(invalidLightDark, { ...opt, nullable: true }),
      null
    );
    assert.strictEqual(
      func(invalidLightDark, opt),
      'color(srgb none none none / none)'
    );
  });

  it('should execute fallback code block', () => {
    const opt = { nullable: false };
    const invalidLightDark = 'light-dark(, bar)';
    assert.strictEqual(
      func(invalidLightDark, { ...opt, format: VAL_SPEC }),
      ''
    );
    assert.strictEqual(func(invalidLightDark, { ...opt, format: 'hex' }), null);
    assert.strictEqual(
      func(invalidLightDark, { ...opt, format: 'hexAlpha' }),
      null
    );
    assert.strictEqual(
      func(invalidLightDark, { ...opt, nullable: true }),
      null
    );
    assert.strictEqual(
      func(invalidLightDark, opt),
      'color(srgb none none none / none)'
    );
  });

  it('should pass resolved value to subsequent color resolutions', () => {
    const varValue = 'var(--non-existent, red)';
    assert.strictEqual(func(varValue), 'rgb(255, 0, 0)');
    assert.strictEqual(func(varValue, { format: 'hex' }), '#ff0000');
  });

  it('should handle light-dark() with VAL_SPEC format', () => {
    const opt = { format: VAL_SPEC };
    assert.strictEqual(
      func('light-dark(red, blue)', opt),
      'light-dark(red, blue)'
    );
    assert.strictEqual(
      func('light-dark(invalid, blue)', {
        ...opt,
        nullable: true
      }),
      ''
    );
    assert.strictEqual(
      func('light-dark(red, invalid)', {
        ...opt,
        nullable: true
      }),
      ''
    );
  });

  it('should resolve light-dark() based on resolution and option', () => {
    const invalidLightDark = 'light-dark(invalid-color, invalid-color)';
    const validLightDark = 'light-dark(red, blue)';
    assert.strictEqual(
      func(invalidLightDark),
      'color(srgb none none none / none)'
    );
    assert.isNull(func(invalidLightDark, { nullable: true }));
    assert.strictEqual(func(validLightDark), 'rgb(255, 0, 0)');
    assert.strictEqual(
      func(validLightDark, { colorScheme: 'dark' }),
      'rgb(0, 0, 255)'
    );
  });

  it('should format rgb channels based on alpha value', () => {
    assert.strictEqual(func('rgb(255, 0, 0)'), 'rgb(255, 0, 0)');
    assert.strictEqual(func('rgba(255, 0, 0, 0.5)'), 'rgba(255, 0, 0, 0.5)');
  });

  it('should return missing color when resolved is null', () => {
    const resDefault = func('invalid-color-value');
    assert.strictEqual(resDefault, 'color(srgb none none none / none)');

    const resExplicitFalse = func('invalid-color-value', { nullable: false });
    assert.strictEqual(resExplicitFalse, 'color(srgb none none none / none)');
  });

  it('should return null when resolved is null and nullable is true', () => {
    const resNullable = func('invalid-color-value', { nullable: true });
    assert.isNull(resNullable);
  });

  it('should return resolved color value when resolved is not null', () => {
    const resValidWithoutNullable = func('red');
    assert.strictEqual(resValidWithoutNullable, 'rgb(255, 0, 0)');

    const resValidWithNullable = func('red', { nullable: true });
    assert.strictEqual(resValidWithNullable, 'rgb(255, 0, 0)');
  });

  it('should return empty string when VAL_SPEC and invalid color', () => {
    assert.strictEqual(func('invalid-color-name', { format: VAL_SPEC }), '');
  });

  it('should return missing color when invalid color and not nullable', () => {
    const res = func('invalid-color-name', { nullable: false });
    assert.strictEqual(res, 'color(srgb none none none / none)');
  });

  it('should resolve valid color-mix string (outer true, inner true)', () => {
    const validMix = 'color-mix(in srgb, red, blue)';
    const res = func(validMix);
    assert.strictEqual(res, 'color(srgb 0.5 0 0.5)');
  });

  it('should handle invalid color-mix', () => {
    const invalidMix = 'color-mix(in invalid-space, red, blue)';
    const resNull = func(invalidMix, { nullable: true });
    assert.isNull(resNull);

    const resDefault = func(invalidMix);
    assert.strictEqual(resDefault, 'color(srgb none none none / none)');
  });

  it('should skip color-mix check for standard colors', () => {
    const standardColor = 'rgb(255, 0, 0)';
    const res = func(standardColor);
    assert.strictEqual(res, 'rgb(255, 0, 0)');
  });

  it('should skip inner if block when mixRes is null', () => {
    const invalidMix = 'color-mix(in invalid-space, red, blue)';
    const resNullable = func(invalidMix, { nullable: true });
    assert.isNull(resNullable);

    const resDefault = func(invalidMix);
    assert.strictEqual(resDefault, 'color(srgb none none none / none)');
  });

  it('should skip inner if block when mixRes is empty string', () => {
    const invalidMixSpec = 'color-mix(in srgb, invalid-color, blue)';
    const resSpec = func(invalidMixSpec, { format: VAL_SPEC });
    assert.strictEqual(resSpec, '');
  });

  it('should pass true branch when funcRes is an array', () => {
    const res = func('color(srgb 1 0 0)');
    assert.strictEqual(res, 'color(srgb 1 0 0)');
  });

  it('should pass false branch when funcRes is null (nullable: true)', () => {
    const res = func('color(invalid-space 1 0 0)', {
      nullable: true
    });
    assert.isNull(res);
  });

  it('should pass false branch when funcRes is empty string (VAL_SPEC)', () => {
    const res = func('color(invalid-space 1 0 0)', {
      format: VAL_SPEC
    });
    assert.strictEqual(res, '');
  });

  it('should resolve zero padded value correctly', () => {
    const res = func('rgb(00, 0, 153)');
    assert.strictEqual(res, 'rgb(0, 0, 153)');
  });
});

describe('is valid color', () => {
  const func = resolve.isValidColor;

  it('should return false for non-string inputs', () => {
    assert.isFalse(func(123));
    assert.isFalse(func(null));
    assert.isFalse(func(undefined));
    assert.isFalse(func({}));
  });

  it('should return false for empty or whitespace-only strings', () => {
    assert.isFalse(func(''));
    assert.isFalse(func('   '));
  });

  it('should return true for special named colors', () => {
    assert.isTrue(func('currentcolor'));
    assert.isTrue(func('transparent'));
    assert.isTrue(func('red'));
    assert.isTrue(func('blue'));
  });

  it('should return false for invalid named colors', () => {
    assert.isFalse(func('invalidcolor'));
  });

  it('should return true for valid color syntaxes', () => {
    assert.isTrue(func('#ff0000'));
    assert.isTrue(func('rgb(255, 0, 0)'));
    assert.isTrue(func('hsl(120, 100%, 50%)'));
  });

  it('should validate function-style color syntax', () => {
    assert.isTrue(func('color(srgb 1 0 0)'));
    assert.isTrue(func('color(display-p3 0.5 0.2 0.8)'));
    assert.isFalse(func('color(invalid-space 1 0 0)'));
    assert.isFalse(func('color(srgb 1 0)'));
  });

  it('should return true for color-mix syntax', () => {
    assert.isTrue(func('color-mix(in srgb, red, blue)'));
    assert.isTrue(func('color-mix(in lch, red 20%, yellow 80%)'));
  });

  it('should return true for color-mix syntax without colorspace', () => {
    assert.isTrue(func('color-mix(red, blue)'));
    assert.isTrue(func('color-mix(red 20%, yellow 80%)'));
  });

  it('should return true for color-mix syntax with only a color', () => {
    assert.isTrue(func('color-mix(red)'));
    assert.isTrue(func('color-mix(red 20%)'));
  });

  it('should return false for invalid color-mix syntax', () => {
    assert.isFalse(func('color-mix(in srgb)'));
  });

  it('should return true for color-mix syntax with multiple colors', () => {
    assert.isTrue(func('color-mix(in srgb, red, green, blue)'));
    assert.isTrue(func('color-mix(red 20%, yellow 30%, white 50%)'));
  });
});
