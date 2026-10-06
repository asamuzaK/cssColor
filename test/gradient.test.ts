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
    'calc(10% + 1em)',
    'calc((100% - 2rem) / 2)',
    'calc(2 * (1px + 2vh))',
    'calc(1px * 2px / 1px)',
    'calc(1px / 2px * 3em)',
    'calc(-2px)',
    'calc(0px)',
    'calc(calc(100% - 1em) + 2px)',
    'min(100% - 1em, 50px)',
    'max(10px, 2vw)',
    'clamp(1em, 50% + 1px, 100px)',
    'min(calc(1px), max(2%, 3em))',
    'calc(1px + -2px)',
    'calc(1px - -2px)',
    'calc(pi * 1px)',
    'calc(infinity * 1px)',
    'calc(NaN * 1px)',
    'CALC(10% + 1EM)'
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

  it.each([
    `calc(${'('.repeat(32)}1px${')'.repeat(32)})`,
    `min(${Array(32).fill('1px').join(', ')})`,
    `calc(${Array(32).fill('1px').join(' + ')})`
  ])(
    'should support at least 32 terms, arguments and nesting levels: %s',
    position => {
      assert.isTrue(
        grad.isGradient(`linear-gradient(#000 ${position}, transparent)`)
      );
    }
  );

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
    'calc(10px + bananas)',
    'calc(100% + 20deg)',
    'calc(10px +)',
    'calc()',
    'calc(',
    'calc(1px +',
    'calc(1px *',
    'calc(1px+ 2px)',
    'calc(1px +2px)',
    'calc(1px * 2px)',
    'calc(1px / 2px)',
    'calc(1px + 0)',
    'calc(0)',
    'calc(10bananas * 0)',
    'calc(0deg)',
    'calc(1s)',
    'calc(1px 2px)',
    'calc(1px, 2px)',
    'calc([1px])',
    'calc(sin(1px) * 1px)',
    'calc(1px) junk',
    'min(1px,)',
    'max()',
    'clamp(1px, 2px)',
    'clamp(1px, 2px, 3px, 4px)',
    'min(1px, 1)',
    'calc(1px * 2px + 2px)',
    'calc(1px / 2px + 2px)',
    'calc(1px + (2px, 3px))',
    'calc(1px + min(2px,))',
    'calc(1px + /*unterminated)',
    'calc("unterminated)',
    'calc(1px/**/+/**/2px)',
    'calc(1px + (2px)'
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
