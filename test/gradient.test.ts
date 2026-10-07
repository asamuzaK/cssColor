/**
 * gradient.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/utils/cache';
import * as grad from '../src/gradients/gradient';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('resolve CSS gradient', () => {
  const func = grad.resolveGradient;

  it('should get none', () => {
    const res = func();
    assert.strictEqual(res, 'none', 'result');
  });

  it('should get empty string', () => {
    const res = func('', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, '', 'result');
  });

  it('should get none', () => {
    const value = 'a'.repeat(11);
    const res = func(value, {
      maxLength: 10
    });
    assert.strictEqual(res, 'none', 'result');
  });

  it('should get none', () => {
    const value = 'a'.repeat(11);
    const res = func(value, {
      format: 'specifiedValue',
      maxLength: 10
    });
    assert.strictEqual(res, '', 'result');
  });

  it('should get none', () => {
    const res = func('foo(red, blue)');
    assert.strictEqual(res, 'none', 'result');
  });

  it('should get none', () => {
    const res = func('linear-gradient(red)');
    assert.strictEqual(res, 'none', 'result');
  });

  it('should get value', () => {
    const res = func('linear-gradient(red, blue)');
    assert.strictEqual(
      res,
      'linear-gradient(rgb(255, 0, 0), rgb(0, 0, 255))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('linear-gradient(to right, red, blue)');
    assert.strictEqual(
      res,
      'linear-gradient(to right, rgb(255, 0, 0), rgb(0, 0, 255))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('linear-gradient(red, blue)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'linear-gradient(red, blue)', 'result');
  });

  it('should get value', () => {
    const res = func(
      'radial-gradient(ellipse closest-side, #1e90ff 50%, #008000)',
      {
        format: 'specifiedValue'
      }
    );
    assert.strictEqual(
      res,
      'radial-gradient(closest-side, rgb(30, 144, 255) 50%, rgb(0, 128, 0))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('radial-gradient(transparent, var(--custom-color))', {
      customProperty: {
        '--custom-color': 'rgb(0, 128, 0)'
      }
    });
    assert.strictEqual(
      res,
      'radial-gradient(rgba(0, 0, 0, 0), rgb(0, 128, 0))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func('radial-gradient(transparent, var(--custom-color))', {
      format: 'specifiedValue'
    });
    assert.strictEqual(
      res,
      'radial-gradient(transparent, var(--custom-color))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'radial-gradient(transparent, /* comment */ var(--custom-color))',
      {
        format: 'specifiedValue'
      }
    );
    assert.strictEqual(
      res,
      'radial-gradient(transparent, var(--custom-color))',
      'result'
    );
  });

  it('should get value', () => {
    const res = func(
      'radial-gradient(transparent, /* comment */ var(--custom-color))',
      {
        customProperty: {
          '--custom-color': 'rgb(0, 128, 0)'
        },
        format: 'computedValue'
      }
    );
    assert.strictEqual(
      res,
      'radial-gradient(rgba(0, 0, 0, 0), rgb(0, 128, 0))',
      'result'
    );
  });

  it('should return "none" when color stops are not enough', () => {
    const res = func('linear-gradient(red)');
    assert.strictEqual(res, 'none', 'result');
  });

  it('should return empty string when color stops are not enough', () => {
    const res = func('linear-gradient(red)', { format: 'specifiedValue' });
    assert.strictEqual(res, '', 'result');
  });
});

describe('gradient color output', () => {
  it.each(['linear-gradient', 'radial-gradient', 'conic-gradient'])(
    'should reject unresolved colors in %s',
    type => {
      for (const color of ['transparent', '#ff000000', 'currentcolor']) {
        for (const stops of [
          `${color}, blue`,
          `${color} 0, blue`,
          `red, ${color}`
        ]) {
          assert.strictEqual(
            grad.resolveGradient(`${type}(${stops})`, { format: 'hex' }),
            'none'
          );
        }
      }
      assert.strictEqual(
        grad.resolveGradient(`${type}(currentcolor, blue)`, {
          format: 'hexAlpha'
        }),
        'none'
      );
      assert.strictEqual(
        grad.resolveGradient(`${type}(currentcolor, blue)`, {
          format: 'mixValue'
        }),
        'none'
      );
    }
  );

  it.each(['hex', 'hexAlpha'])(
    'should resolve supplied currentColor in %s',
    format => {
      assert.strictEqual(
        grad.resolveGradient('linear-gradient(currentcolor, blue)', {
          format,
          currentColor: 'red'
        }),
        'linear-gradient(#ff0000, #0000ff)'
      );
    }
  );

  it('should retain transparent first colors in supported formats', () => {
    const value = 'linear-gradient(transparent, blue)';
    assert.strictEqual(
      grad.resolveGradient(value, { format: 'specifiedValue' }),
      value
    );
    assert.strictEqual(
      grad.resolveGradient(value),
      'linear-gradient(rgba(0, 0, 0, 0), rgb(0, 0, 255))'
    );
    assert.strictEqual(
      grad.resolveGradient(value, { format: 'hexAlpha' }),
      'linear-gradient(#00000000, #0000ff)'
    );
  });
});

describe('gradient math positions', () => {
  const options = { format: 'specifiedValue' as const };

  it.each([
    'linear-gradient',
    'radial-gradient',
    'repeating-linear-gradient',
    'repeating-radial-gradient'
  ])('should resolve mixed length-percentage stops in %s', type => {
    const value = `${type}(#000 0, #000 24px, #000 calc(100% - 24px), transparent 100%)`;
    assert.strictEqual(
      grad.resolveGradient(value, options),
      `${type}(rgb(0, 0, 0) 0, rgb(0, 0, 0) 24px, rgb(0, 0, 0) calc(100% - 24px), transparent 100%)`
    );
    assert.isTrue(grad.isGradient(value, options));
  });

  it.each([
    'calc(100% - 24px)',
    'min(100% - 1em, 50px)',
    'max(10px, 2vw)',
    'clamp(1em, 50% + 1px, 100px)'
  ])('should accept a typed math position %s', position => {
    const stops = `#000 ${position}, transparent 100%`;
    const resolvedStops = `rgb(0, 0, 0) ${position}, transparent 100%`;
    assert.strictEqual(
      grad.resolveGradient(`linear-gradient(${stops})`, options),
      `linear-gradient(${resolvedStops})`
    );
    assert.strictEqual(
      grad.resolveGradient(`radial-gradient(circle, ${stops})`, options),
      `radial-gradient(circle, ${resolvedStops})`
    );
  });

  it('should accept math hints and two stop positions', () => {
    assert.strictEqual(
      grad.resolveGradient(
        'linear-gradient(#000 calc(1px) calc(2px), calc(50% - 1em), transparent 100%)',
        options
      ),
      'linear-gradient(rgb(0, 0, 0) calc(1px) calc(2px), calc(50% - 1em), transparent 100%)'
    );
  });

  it.each([
    'calc(10px +)',
    'calc(100% + 20deg)',
    'calc(1px / 2px)',
    'calc(0)',
    'calc(1p/**/x)'
  ])('should reject an invalid math position %s', position => {
    for (const type of [
      'linear-gradient',
      'radial-gradient',
      'repeating-linear-gradient',
      'repeating-radial-gradient'
    ]) {
      const value = `${type}(#000 0, transparent ${position})`;
      assert.strictEqual(grad.resolveGradient(value, options), '');
      assert.strictEqual(grad.resolveGradient(value), 'none');
      assert.isFalse(grad.isGradient(value));
    }
  });

  it.each(['calc(1px * 2px / 1px)', 'calc(1px / 2px * 3em)'])(
    'should reject typed arithmetic outside the supported subset: %s',
    position => {
      const value = `linear-gradient(red ${position}, blue)`;
      assert.isFalse(grad.isGradient(value));
      assert.strictEqual(grad.resolveGradient(value, options), '');
    }
  );

  it.each([
    'linear-gradient(to sideways, #000 0, transparent calc(100% - 24px))',
    'linear-gradient(invalid-color 0, transparent calc(100% - 24px))',
    'linear-gradient(#000 calc(100% - 24px))',
    'linear-gradient(calc(50%), #000, transparent)',
    'linear-gradient(#000, calc(50%), calc(60%), transparent)',
    'linear-gradient(#000, transparent, calc(50%))',
    'conic-gradient(#000 0deg, transparent calc(100% - 24px))'
  ])('should retain gradient validation for %s', value => {
    assert.strictEqual(grad.resolveGradient(value, options), '');
  });
});

describe('gradient math comments', () => {
  it.each([
    'calc/**/(1px)',
    'c/**/alc(1px)',
    'min/**/(1px, 2px)',
    'max/**/(1px, 2px)',
    'clamp/**/(1px, 2px, 3px)'
  ])(
    'should reject a function manufactured by comment removal: %s',
    position => {
      for (const type of [
        'linear-gradient',
        'radial-gradient',
        'repeating-linear-gradient',
        'repeating-radial-gradient'
      ]) {
        for (const stops of [
          `red ${position}, blue`,
          `red, blue ${position}`,
          `red ${position} calc(4px), blue`,
          `red, ${position}, blue`
        ]) {
          const value = `${type}(${stops})`;
          assert.isFalse(grad.isGradient(value));
          assert.strictEqual(grad.resolveGradient(value), 'none');
          assert.strictEqual(
            grad.resolveGradient(value, { format: 'specifiedValue' }),
            ''
          );
        }
      }
    }
  );

  it.each([
    'calc(1px/**/ +/**/ 2px)',
    'calc(1px + m\\69n(2px, 3px))',
    'min(calc(1px /* term */ + 2px), 4%)'
  ])('should preserve the meaning of an accepted calculation: %s', position => {
    const value = `linear-gradient(red ${position}, blue)`;
    assert.strictEqual(
      grad.resolveGradient(value, { format: 'specifiedValue' }),
      value
    );
  });

  it.each(['calc(1p/**/x)', 'calc(1/**/px)', 'calc(1px * 2/**/0)'])(
    'should reject split tokens in first stops, double stops and hints: %s',
    position => {
      for (const stops of [
        `red ${position}, blue`,
        `red ${position} calc(4px), blue`,
        `red, ${position}, blue`
      ]) {
        assert.strictEqual(
          grad.resolveGradient(`linear-gradient(${stops})`, {
            format: 'specifiedValue'
          }),
          ''
        );
      }
    }
  );

  it.each([
    'linear-gradient',
    'radial-gradient',
    'repeating-linear-gradient',
    'repeating-radial-gradient'
  ])('should retain valid comments in math stops and hints in %s', type => {
    const position = 'calc(1px/**/ +/**/ 2px)';
    const stops = [
      `red ${position}, blue`,
      `red, blue ${position}`,
      `red ${position} calc(4px), blue`,
      `red, ${position}, blue`
    ];
    for (const list of stops) {
      const value = `${type}(${list})`;
      assert.isTrue(grad.isGradient(value));
      assert.strictEqual(
        grad.resolveGradient(value, { format: 'specifiedValue' }),
        value
      );
    }
  });

  it.each([
    [
      'linear-gradient(rgb(0 /*c*/ 0 0), #fff)',
      'linear-gradient(rgb(0, 0, 0), rgb(255, 255, 255))'
    ],
    [
      'linear-gradient(#000, rgb(0 /*c*/ 0 0) 10%)',
      'linear-gradient(rgb(0, 0, 0), rgb(0, 0, 0) 10%)'
    ],
    [
      'linear-gradient(rgb(0 /*c*/ 0 0) calc(1px/**/ +/**/ 2px), #fff)',
      'linear-gradient(rgb(0, 0, 0) calc(1px/**/ +/**/ 2px), rgb(255, 255, 255))'
    ],
    [
      'conic-gradient(#000, rgb(0 /*c*/ 0 0) 10deg)',
      'conic-gradient(rgb(0, 0, 0), rgb(0, 0, 0) 10deg)'
    ]
  ])('should strip comments in stop colors %s', (value, expected) => {
    assert.isTrue(grad.isGradient(value));
    assert.strictEqual(grad.resolveGradient(value), expected);
  });

  it.each([
    ['linear-gradient(red /* a */, blue)', 'linear-gradient(red, blue)'],
    ['linear-gradient(red, blue /* a */)', 'linear-gradient(red, blue)'],
    [
      'linear-gradient(red 10% /* a */, blue 20% 30% /* b */)',
      'linear-gradient(red 10%, blue 20% 30%)'
    ],
    [
      'linear-gradient(red, 50% /* hint */, blue)',
      'linear-gradient(red, 50%, blue)'
    ],
    [
      'linear-gradient(red calc(1px + 2px) /* a */, blue)',
      'linear-gradient(red calc(1px + 2px), blue)'
    ],
    [
      'linear-gradient(\n  red, /* start */\n  blue /* end */\n)',
      'linear-gradient(red, blue)'
    ]
  ])('should ignore trailing comments in stops %s', (value, expected) => {
    assert.strictEqual(
      grad.resolveGradient(value, { format: 'specifiedValue' }),
      expected
    );
  });

  it('should preserve comment handling outside calculations', () => {
    const value =
      'linear-gradient(/* line */ to right, /* color */ red, blue calc(1px /* term */ + 2px))';
    assert.strictEqual(
      grad.resolveGradient(value, { format: 'specifiedValue' }),
      'linear-gradient(to right, red, blue calc(1px /* term */ + 2px))'
    );
  });
});

describe('is CSS gradient', () => {
  const func = grad.isGradient;

  it('should get false', () => {
    const res = func();
    assert.strictEqual(res, false, 'result');
  });

  it('should get false', () => {
    const res = func('foo(red, blue)');
    assert.strictEqual(res, false, 'result');
  });

  it('should get false', () => {
    const res = func('linear-gradient(red)');
    assert.strictEqual(res, false, 'result');
  });

  it('should get true', () => {
    const res = func('linear-gradient(red, blue)');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('radial-gradient(transparent, var(--custom-color))');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func('radial-gradient(transparent, var(--custom-color))');
    assert.strictEqual(res, true, 'result');
  });

  it('should get true', () => {
    const res = func(
      'radial-gradient(transparent, /* comment */ var(--custom-color))'
    );
    assert.strictEqual(res, true, 'result');
  });
});
