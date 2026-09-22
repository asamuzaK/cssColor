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

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string');
  });

  it('should get value', () => {
    const res = func('#12345');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');

    const res2 = func('#12345');
    assert.deepEqual(res2, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('#12345', {
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');

    const res2 = func('#12345', {
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res2, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('#12345', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');

    const res2 = func('#12345', {
      format: 'computedValue'
    });
    assert.deepEqual(res2, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('#12345', {
      format: 'computedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');

    const res2 = func('#12345', {
      format: 'computedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res2, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get null object', () => {
    const res = func('#12345', {
      format: 'computedValue',
      nullable: true
    });
    assert.strictEqual(res, null, 'result');

    const res2 = func('#12345', {
      format: 'computedValue',
      nullable: true
    });
    assert.strictEqual(res2, null, 'result');
  });

  it('should get null object', () => {
    const res = func('#12345', {
      format: 'computedValue',
      nullable: true,
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res, null, 'result');

    const res2 = func('#12345', {
      format: 'computedValue',
      nullable: true,
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2, null, 'result');
  });

  it('should get empty string', () => {
    const res = func('#12345', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, '', 'result');

    const res2 = func('#12345', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res2, '', 'result');
  });

  it('should get null object', () => {
    const res = func('#12345', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');

    const res2 = func('#12345', {
      format: 'mixValue'
    });
    assert.strictEqual(res2, null, 'result');
  });

  it('should get null object', () => {
    const res = func('#12345', {
      format: 'mixValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res, null, 'result');

    const res2 = func('#12345', {
      format: 'mixValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2, null, 'result');
  });

  it('should get value', () => {
    const res = func('rgb(foo 128 255)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(foo 128 255)', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(foo 128 255)', {
      format: 'computedValue',
      nullable: true
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get empty string', () => {
    const res = func('rgb(foo 128 255)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, '', 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(foo 128 255)', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('foo');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('foo', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get null object', () => {
    const res = func('foo', {
      format: 'computedValue',
      nullable: true
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get empty string', () => {
    const res = func('foo', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, '', 'result');
  });

  it('should get null object', () => {
    const res = func('foo', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');

    const res2 = func('foo', {
      format: 'mixValue'
    });
    assert.strictEqual(res2, null, 'result');
  });

  it('should get null object', () => {
    const res = func('foo', {
      format: 'mixValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res, null, 'result');

    const res2 = func('foo', {
      format: 'mixValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2, null, 'result');
  });

  it('should get value', () => {
    const res = func('currentColor');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'currentcolor', 'result');

    const res2 = func('currentColor', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res2, 'currentcolor', 'result');
  });

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res, 'currentcolor', 'result');

    const res2 = func('currentColor', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2, 'currentcolor', 'result');
  });

  it('should get value', () => {
    const res = func('transparent');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'transparent', 'result');

    const res2 = func('transparent', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res2, 'transparent', 'result');
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res, 'transparent', 'result');

    const res2 = func('transparent', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2, 'transparent', 'result');
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'mixValue'
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');

    const res2 = func('transparent', {
      format: 'mixValue'
    });
    assert.deepEqual(res2, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('transparent', {
      format: 'mixValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');

    const res2 = func('transparent', {
      format: 'mixValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res2, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('black');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'specifiedValue'
    });
    assert.deepEqual(res, 'green', 'result');

    const res2 = func('green', {
      format: 'specifiedValue'
    });
    assert.deepEqual(res2, 'green', 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res, 'green', 'result');

    const res2 = func('green', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res2, 'green', 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 50% 0)', {
      format: 'mixValue',
      colorSpace: 'srgb'
    });
    assert.deepEqual(res, ['srgb', 0, 0.5, 0, 1], 'result');

    const res2 = func('rgb(0 50% 0)', {
      format: 'mixValue',
      colorSpace: 'srgb'
    });
    assert.deepEqual(res2, ['srgb', 0, 0.5, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 50% 0)', {
      format: 'mixValue',
      colorSpace: 'srgb',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res, ['srgb', 0, 0.5, 0, 1], 'result');

    const res2 = func('rgb(0 50% 0)', {
      format: 'mixValue',
      colorSpace: 'srgb',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res2, ['srgb', 0, 0.5, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('WHITE');
    assert.deepEqual(res, ['rgb', 255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('WHITE', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'white', 'result');
  });

  it('should get value', () => {
    const res = func('#123456');
    assert.deepEqual(res, ['rgb', 18, 52, 86, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#abcdef');
    assert.deepEqual(res, ['rgb', 171, 205, 239, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#12345678');
    assert.deepEqual(res, ['rgb', 18, 52, 86, 0.47], 'result');
  });

  it('should get value', () => {
    const res = func('#abcdef12');
    assert.deepEqual(res, ['rgb', 171, 205, 239, 0.07], 'result');
  });

  it('should get value', () => {
    const res = func('#1234');
    assert.deepEqual(res, ['rgb', 17, 34, 51, 0.267], 'result');
  });

  it('should get value', () => {
    const res = func('#abcd');
    assert.deepEqual(res, ['rgb', 170, 187, 204, 0.867], 'result');
  });

  it('should get value', () => {
    const res = func('#123');
    assert.deepEqual(res, ['rgb', 17, 34, 51, 1], 'result');
  });

  it('should get value', () => {
    const res = func('#abc');
    assert.deepEqual(res, ['rgb', 170, 187, 204, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(10 20 30 / 0.5)');
    assert.deepEqual(res, ['rgb', 10, 20, 30, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(0 0 0 / 1%)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0.01], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(1,2,3,0.5)');
    assert.deepEqual(res, ['rgb', 1, 2, 3, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgba(1,2,3,1)');
    assert.deepEqual(res, ['rgb', 1, 2, 3, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(46.27% 32.94% 80.39%)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(50% 33% 34%)');
    assert.deepEqual(res, ['rgb', 128, 84, 87, 1], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(5% 10% 20%)');
    assert.deepEqual(res, ['rgb', 13, 26, 51, 1], 'result');
  });

  it('should get null object', () => {
    const res = func('hsl(none, none, none)', {
      format: 'computedValue',
      nullable: true
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('hsl(240 100% 50% / 0.5)');
    assert.deepEqual(res, ['rgb', 0, 0, 255, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(-120deg 100% 50% / 0.5)');
    assert.deepEqual(res, ['rgb', 0, 0, 255, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120 100% 0% / 1%)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0.01], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(240 100% 50%)');
    assert.deepEqual(res, ['rgb', 0, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsla(180,50%,50%,0.5)');
    assert.deepEqual(res, ['rgb', 64, 191, 191, 0.5], 'result');
  });

  it('should get null object', () => {
    const res = func('hwb(none, none, none)', {
      format: 'computedValue',
      nullable: true
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('hwb(240 100% 50%)');
    assert.deepEqual(res, ['rgb', 170, 170, 170, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(110 20% 30% / 40%)');
    assert.deepEqual(res, ['rgb', 72, 179, 51, 0.4], 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 1)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 0.5)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 0.5)', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['lab', 44.36, 36.05, -59, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 0.5)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(res, ['lab', 44.36, 36.05, -59, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['lch', 44.36, 69.13, 301.43, 1], 'result');

    const res2 = func('lch(44.36% 69.13 301.43 / 1)', {
      format: 'computedValue'
    });
    assert.deepEqual(res2, ['lch', 44.36, 69.13, 301.43, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)', {
      format: 'computedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res, ['lch', 44.36, 69.13, 301.43, 1], 'result');

    const res2 = func('lch(44.36% 69.13 301.43 / 1)', {
      format: 'computedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res2, ['lch', 44.36, 69.13, 301.43, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(res, ['lch', 44.36, 69.13, 301.43, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 1)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 0.5)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 0.5)', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['oklab', 0.54432, 0.06817, -0.16567, 0.5], 'result');

    const res2 = func('oklab(0.54432 0.06817 -0.16567 / 0.5)', {
      format: 'computedValue'
    });
    assert.deepEqual(
      res2,
      ['oklab', 0.54432, 0.06817, -0.16567, 0.5],
      'result'
    );
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 0.5)', {
      format: 'computedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res, ['oklab', 0.54432, 0.06817, -0.16567, 0.5], 'result');

    const res2 = func('oklab(0.54432 0.06817 -0.16567 / 0.5)', {
      format: 'computedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(
      res2,
      ['oklab', 0.54432, 0.06817, -0.16567, 0.5],
      'result'
    );
  });

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 0.5)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(res, ['oklab', 0.54432, 0.06817, -0.16567, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 1)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 0.5)');
    assert.deepEqual(res, ['rgb', 118, 84, 205, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 0.5)', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['oklch', 0.544, 0.179, 292.365, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 0.5)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(res, ['oklch', 0.544, 0.179, 292.365, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('rgb(none none none / none)', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });
});

describe('resolve color()', () => {
  const func = color.resolveColorFunc;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string');
  });

  it('should get value', () => {
    const res = func('color(in foo, 1 1 1)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');

    const res2 = func('color(in foo, 1 1 1)');
    assert.deepEqual(res2, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(in foo, 1 1 1)', {
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');

    const res2 = func('color(in foo, 1 1 1)', {
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res2, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');

    const res2 = func('color(in foo, 1 1 1)', {
      format: 'computedValue'
    });
    assert.deepEqual(res2, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'computedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');

    const res2 = func('color(in foo, 1 1 1)', {
      format: 'computedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res2, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get null object', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'computedValue',
      nullable: true
    });
    assert.strictEqual(res, null, 'result');

    const res2 = func('color(in foo, 1 1 1)', {
      format: 'computedValue',
      nullable: true
    });
    assert.strictEqual(res2, null, 'result');
  });

  it('should get null object', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'computedValue',
      nullable: true,
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res, null, 'result');

    const res2 = func('color(in foo, 1 1 1)', {
      format: 'computedValue',
      nullable: true,
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2, null, 'result');
  });

  it('should get empty string', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, '', 'result');

    const res2 = func('color(in foo, 1 1 1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res2, '', 'result');
  });

  it('should get empty string', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res, '', 'result');

    const res2 = func('color(in foo, 1 1 1)', {
      format: 'specifiedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2, '', 'result');
  });

  it('should get null object', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');

    const res2 = func('color(in foo, 1 1 1)', {
      format: 'mixValue'
    });
    assert.strictEqual(res2, null, 'result');
  });

  it('should get null object', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'mixValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res, null, 'result');

    const res2 = func('color(in foo, 1 1 1)', {
      format: 'mixValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.strictEqual(res2, null, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb foo bar baz)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb foo bar baz)', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['rgb', 0, 0, 0, 0], 'result');
  });

  it('should get null object', () => {
    const res = func('color(srgb foo bar baz)', {
      format: 'computedValue',
      nullable: true
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get empty string', () => {
    const res = func('color(srgb foo bar baz)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, '', 'result');
  });

  it('should get null object', () => {
    const res = func('color(srgb foo bar baz)', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color( srgb 0 0.6 0 )');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0% 60% 0%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 0.5], 'result');

    const res2 = func('color(srgb 0 0.6 0 / 0.5)');
    assert.deepEqual(res2, ['rgb', 0, 153, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)', {
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res, ['rgb', 0, 153, 0, 0.5], 'result');

    const res2 = func('color(srgb 0 0.6 0 / 0.5)', {
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res2, ['rgb', 0, 153, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['srgb', 0, 0.6, 0, 0.5], 'result');

    const res2 = func('color(srgb 0 0.6 0 / 0.5)', {
      format: 'computedValue'
    });
    assert.deepEqual(res2, ['srgb', 0, 0.6, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)', {
      format: 'computedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res, ['srgb', 0, 0.6, 0, 0.5], 'result');

    const res2 = func('color(srgb 0 0.6 0 / 0.5)', {
      format: 'computedValue',
      dimension: {
        callback: () => {}
      }
    });
    assert.deepEqual(res2, ['srgb', 0, 0.6, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 50%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / -50%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 150%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.3 0.5 0.7 / none)');
    assert.deepEqual(res, ['rgb', 76, 127, 179, 0], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 128, 178, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 76, 0, 178, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 77, 127, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 128, 178, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 30% none 70%)');
    assert.deepEqual(res, ['rgb', 76, 0, 178, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 30% 50% none)');
    assert.deepEqual(res, ['rgb', 77, 127, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb none none none / none)', {
      format: 'computedValue'
    });
    assert.deepEqual(res, ['srgb', 'none', 'none', 'none', 'none'], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 1 1 1)');
    const val = func('color(srgb 1 1 1)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 1 0)');
    const val = color.resolveColorValue('lab(87.8185% -79.271 80.9946)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 43.5% 1.7% 5.5%)');
    const val = func('color(srgb 0.691 0.139 0.259)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 188, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 149, 0, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 149, 188, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 188, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 30% none 70%)');
    assert.deepEqual(res, ['rgb', 149, 0, 218, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 30% 50% none)');
    assert.deepEqual(res, ['rgb', 149, 188, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.26374 0.59085 0.16434 / 1)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 26.374% 59.085% 16.434%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.21604 0.49418 0.13151)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 1 1 1)');
    assert.deepEqual(res, ['rgb', 255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0 1 0)');
    const val = color.resolveColorValue('lab(86.61399% -106.539 102.871)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 1 1 0.330897)');
    const val = color.resolveColorValue('yellow');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.465377 0.532768 0.317713)');
    const val = color.resolveColorValue('lch(54% 35 118)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 130, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 84, 0, 186, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 57, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 130, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 30% none 70%)');
    assert.deepEqual(res, ['rgb', 84, 0, 186, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 30% 50% none)');
    assert.deepEqual(res, ['rgb', 57, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.299218 0.533327 0.120785 / 1)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 29.9218% 53.3327% 12.0785%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.235202 0.431704 0.085432)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 1 1 1)');
    assert.deepEqual(res, ['rgb', 255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0 1 0)');
    const val = color.resolveColorValue('lab(85.7729% -160.7259 109.2319)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 147, 192, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 104, 0, 196, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 41, 145, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 147, 192, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 30% none 70%)');
    assert.deepEqual(res, ['rgb', 104, 0, 196, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(rec2020 30% 50% none)');
    assert.deepEqual(res, ['rgb', 41, 145, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.33582 0.59441 0.13934 / 1)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 33.582% 59.441% 13.934%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.281363 0.498012 0.116746)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 1 1 1)');
    assert.deepEqual(res, ['rgb', 255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0 1 0)');
    const val = color.resolveColorValue('lab(83.2141% -129.1072 87.1718)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 129, 182, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 89, +0, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 29, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 129, 182, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 30% none 70%)');
    assert.deepEqual(res, ['rgb', 89, +0, 183, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(a98-rgb 30% 50% none)');
    assert.deepEqual(res, ['rgb', 29, 129, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.2861 0.49131 0.16133 / 1)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 28.610% 49.131% 16.133%)');
    assert.deepEqual(res, ['rgb', 0, 153, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.230479 0.395789 0.129968)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 1 1 1)');
    assert.deepEqual(res, ['rgb', 255, 255, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 1 0)');
    const val = color.resolveColorValue('lab(87.5745% -186.6921 150.9905)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 160, 198, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 76, 0, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 43, 155, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 160, 198, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 30% none 70%)');
    assert.deepEqual(res, ['rgb', 76, 0, 205, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(prophoto-rgb 30% 50% none)');
    assert.deepEqual(res, ['rgb', 43, 155, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.07719 0.15438 0.02573)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 7.719% 15.438% 2.573%)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 1 1 1)');
    const val = color.resolveColorValue('lab(100.115% 9.06448 5.80177)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0 1 0)');
    const val = color.resolveColorValue('lab(99.6289% -354.58 146.707)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.08312 0.154746 0.020961)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 8.312% 15.4746% 2.0961%)');
    assert.deepEqual(res, ['rgb', 0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0 0 0)');
    assert.deepEqual(res, ['rgb', 0, 0, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 1 1 1)');
    const val = color.resolveColorValue('lab(100% 6.1097 -13.2268)');
    assert.deepEqual(res, val, 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 30% none 70%)');
    assert.deepEqual(res, ['rgb', 207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 30% 50% none)');
    assert.deepEqual(res, ['rgb', 125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 251, 209, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 30% none 70%)');
    assert.deepEqual(res, ['rgb', 207, 0, 225, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d65 30% 50% none)');
    assert.deepEqual(res, ['rgb', 125, 210, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 none 0.5 0.7)');
    assert.deepEqual(res, ['rgb', 0, 253, 240, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.3 none 0.7)');
    assert.deepEqual(res, ['rgb', 203, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.3 0.5 none)');
    assert.deepEqual(res, ['rgb', 102, 213, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 none 50% 70%)');
    assert.deepEqual(res, ['rgb', 0, 253, 240, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 30% none 70%)');
    assert.deepEqual(res, ['rgb', 203, 0, 255, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 30% 50% none)');
    assert.deepEqual(res, ['rgb', 102, 213, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz none none none / none)', {
      format: 'specifiedValue'
    });
    assert.deepEqual(
      res,
      ['xyz-d65', 'none', 'none', 'none', 'none'],
      'result'
    );
  });
});

describe('convert color value to linear rgb', () => {
  const func = color.convertColorToLinearRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string');
  });

  it('should get null object', () => {
    const res = func('color(srgb-linear foo bar baz)', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get null object', () => {
    const res = func('rgb(foo bar baz)', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)');
    assert.deepEqual(res, [0, 0.21586, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)', {
      format: 'mixValue'
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0, 0.21586, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    res[1] = parseFloat(res[1].toFixed(5));
    assert.deepEqual(res, [0, 0.21586, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue'
    });
    res[1] = parseFloat(res[1].toFixed(5));
    assert.deepEqual(res, [0, 0.21586, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 1 1 1 / 0.5)');
    res[0] = parseFloat(res[0].toFixed(5));
    assert.deepEqual(res, [1, 1, 1, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('lab(87.8185% -79.271 80.9946)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    assert.deepEqual(res, [0, 1, 0, 1], 'result');
  });

  it('should return channels directly if parsed colorSpace matches requested colorSpace', () => {
    const res = func('color(srgb-linear 0.2 0.4 0.6 / 0.8)', {
      format: 'mixValue',
      colorSpace: 'srgb-linear'
    });
    assert.isNotNull(res);
    assert.strictEqual(res![0], 0.2);
    assert.strictEqual(res![1], 0.4);
    assert.strictEqual(res![2], 0.6);
    assert.strictEqual(res![3], 0.8);
  });
});

describe('convert color value to rgb', () => {
  const func = color.convertColorToRgb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string');
  });

  it('should get null object', () => {
    const res = func('foo', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('green');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue'
    });
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0 / 0.5)');
    assert.deepEqual(res, [0, 127.5, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0 / 0.5)', {
      format: 'mixValue'
    });
    assert.deepEqual(res, [0, 128, 0, 0.5], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(46.2775% -47.5621 48.5837)');
    res[1] = parseFloat(res[1].toFixed(3));
    res[2] = parseFloat(res[2].toFixed(3));
    assert.deepEqual(res, [0, 128.002, 0.01, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(46.2775% -47.5621 48.5837)', {
      format: 'mixValue'
    });
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });
});

describe('convert color value to xyz', () => {
  const func = color.convertColorToXyz;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string');
  });

  it('should get null object', () => {
    const res = func('foo', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue'
    });
    assert.deepEqual(res, [0.07719, 0.15438, 0.02573, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0 1 0)');
    assert.deepEqual(res, [0.265668, 0.691739, 0.0451134, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    assert.deepEqual(res, [0.0771883, 0.154377, 0.0257294, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue'
    });
    assert.deepEqual(res, [0.0771883, 0.154377, 0.0257294, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz-d50 0.08312 0.154746 0.020961)', {
      d50: true
    });
    assert.deepEqual(res, [0.08312, 0.15475, 0.020961, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(display-p3 0 1 0)', {
      d50: true
    });
    assert.deepEqual(res, [0.29201, 0.692223, 0.0418783, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      d50: true
    });
    assert.deepEqual(res, [0.083139, 0.154748, 0.020956, 1], 'result');
  });
});

describe('convert color value to hsl', () => {
  const func = color.convertColorToHsl;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string');
  });

  it('should get null object', () => {
    const res = func('hsl(foo, bar, baz)', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get null object', () => {
    const res = func('foo', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120deg 100% 25% / 1)');
    assert.deepEqual(res, [120, 100, 25, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hsl(120deg 100% 25% / 1)', {
      format: 'mixValue'
    });
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 100, 25, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 100, 25, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue'
    });
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 100, 25, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 100, 25, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue'
    });
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 100, 25, 1], 'result');
  });

  it('should get value', () => {
    const res = func('white');
    assert.deepEqual(res, [0, 0, 100, 1], 'result');
  });
});

describe('convert color value to hwb', () => {
  const func = color.convertColorToHwb;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string');
  });

  it('should get null object', () => {
    const res = func('foo', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 49.8039%)');
    assert.deepEqual(res, [120, 0, 49.8039, 1], 'result');
  });

  it('should get value', () => {
    const res = func('hwb(120 0% 49.8039%)', {
      format: 'mixValue'
    });
    assert.deepEqual(res, [120, 0, 49.8039, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 0, 50, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue'
    });
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 0, 50, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 0, 50, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue'
    });
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 0, 50, 1], 'result');
  });
});

describe('convert color value to lab', () => {
  const func = color.convertColorToLab;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string');
  });

  it('should get null object', () => {
    const res = func('foo', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('lab(46.2775% -47.5621 48.5837)');
    assert.deepEqual(res, [46.2775, -47.5621, 48.5837, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lab(46.2775% -47.5621 48.5837)', {
      format: 'mixValue'
    });
    assert.deepEqual(res, [46.2775, -47.5621, 48.5837, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27817, -47.55277, 48.58663, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue'
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27817, -47.55277, 48.58663, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27776, -47.55263, 48.5864, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue'
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27776, -47.55263, 48.5864, 1], 'result');
  });
});

describe('convert color value to lch', () => {
  const func = color.convertColorToLch;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string');
  });

  it('should get null object', () => {
    const res = func('foo', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)');
    assert.deepEqual(res, [46.2775, 67.9892, 134.391, 1], 'result');
  });

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)', {
      format: 'mixValue'
    });
    assert.deepEqual(res, [46.2775, 67.9892, 134.391, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27817, 67.98475, 134.38388, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue'
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27817, 67.98475, 134.38388, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27776, 67.98449, 134.38393, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue'
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27776, 67.98449, 134.38393, 1], 'result');
  });
});

describe('convert color value to oklab', () => {
  const func = color.convertColorToOklab;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string');
  });

  it('should get null object', () => {
    const res = func('foo', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)');
    assert.deepEqual(res, [0.51975, -0.1403, 0.10768, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)', {
      format: 'mixValue'
    });
    assert.deepEqual(res, [0.51975, -0.1403, 0.10768, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51976, -0.1403, 0.10768, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue'
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51976, -0.1403, 0.10768, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51975, -0.1403, 0.10768, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue'
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51975, -0.1403, 0.10768, 1], 'result');
  });
});

describe('convert color value to oklch', () => {
  const func = color.convertColorToOklch;

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string');
  });

  it('should get null object', () => {
    const res = func('foo', {
      format: 'mixValue'
    });
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)');
    assert.deepEqual(res, [0.51975, 0.17686, 142.495, 1], 'result');
  });

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)', {
      format: 'mixValue'
    });
    assert.deepEqual(res, [0.51975, 0.17686, 142.495, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51976, 0.17686, 142.49535, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue'
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51976, 0.17686, 142.49535, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51975, 0.17686, 142.49541, 1], 'result');
  });

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue'
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51975, 0.17686, 142.49541, 1], 'result');
  });
});
