/**
 * hex.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/js/cache';
import * as hex from '../src/js/hex';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('convert rgb to hex color', () => {
  const func = hex.convertRgbToHex;

  it('should convert pure white to #ffffff', () => {
    assert.strictEqual(func([255, 255, 255, 1]), '#ffffff');
  });

  it('should convert pure black to #000000', () => {
    assert.strictEqual(func([0, 0, 0, 1]), '#000000');
  });

  it('should convert primary colors to 6-digit hex format', () => {
    assert.strictEqual(func([255, 0, 0, 1]), '#ff0000');
    assert.strictEqual(func([0, 255, 0, 1]), '#00ff00');
    assert.strictEqual(func([0, 0, 255, 1]), '#0000ff');
  });

  it('should pad single-digit hex values with zero', () => {
    assert.strictEqual(func([10, 11, 12, 1]), '#0a0b0c');
  });

  it('should convert fully transparent color to 8-digit hex with 00 alpha', () => {
    assert.strictEqual(func([0, 0, 0, 0]), '#00000000');
    assert.strictEqual(func([255, 255, 255, 0]), '#ffffff00');
  });

  it('should convert semi-transparent color to 8-digit hex', () => {
    assert.strictEqual(func([255, 0, 0, 0.5]), '#ff000080');
    assert.strictEqual(func([0, 255, 0, 0.2]), '#00ff0033');
  });

  it('should throw error when passing invalid RGB components', () => {
    assert.throws(() => func([255, 255]));
    assert.throws(() => func([300, 0, 0, 1]));
    assert.throws(() => func([0, 0, 0, 2]));
  });
});

describe('convert linear rgb to hex color', () => {
  const func = hex.convertLinearRgbToHex;

  it('should convert pure white linear RGB to #ffffff', () => {
    assert.strictEqual(func([1, 1, 1, 1]), '#ffffff');
  });

  it('should convert pure black linear RGB to #000000', () => {
    assert.strictEqual(func([0, 0, 0, 1]), '#000000');
  });

  it('should convert primary linear RGB colors to 6-digit hex format', () => {
    assert.strictEqual(func([1, 0, 0, 1]), '#ff0000');
    assert.strictEqual(func([0, 1, 0, 1]), '#00ff00');
    assert.strictEqual(func([0, 0, 1, 1]), '#0000ff');
  });

  it('should convert semi-transparent linear RGB to 8-digit hex format', () => {
    assert.strictEqual(func([1, 1, 1, 0]), '#ffffff00');
    assert.strictEqual(func([1, 0, 0, 0.5]), '#ff000080');
  });

  it('should bypass validation when skip option is true', () => {
    assert.strictEqual(func([1, 0, 0, 1], true), '#ff0000');
  });

  it('should throw error when passing invalid linear RGB components with skip=false', () => {
    assert.throws(() => func([1, 0]));
  });
});

describe('convert xyz to hex color', () => {
  const func = hex.convertXyzToHex;

  it('should convert D65 white XYZ to #ffffff', () => {
    assert.strictEqual(func([0.95047, 1, 1.08883, 1]), '#ffffff');
  });

  it('should convert black XYZ to #000000', () => {
    assert.strictEqual(func([0, 0, 0, 1]), '#000000');
  });

  it('should convert primary color XYZ (D65) to 6-digit hex format', () => {
    assert.strictEqual(func([0.4124564, 0.2126729, 0.0193339, 1]), '#ff0000');
    assert.strictEqual(func([0.3575761, 0.7151522, 0.119192, 1]), '#00ff00');
    assert.strictEqual(func([0.1804375, 0.072175, 0.9503041, 1]), '#0000ff');
  });

  it('should convert semi-transparent XYZ color to 8-digit hex format', () => {
    assert.strictEqual(func([0.95047, 1, 1.08883, 0]), '#ffffff00');
    assert.strictEqual(
      func([0.4124564, 0.2126729, 0.0193339, 0.5]),
      '#ff000080'
    );
  });

  it('should clamp out-of-gamut RGB channels derived from XYZ values', () => {
    assert.strictEqual(func([2, 2, 2, 1]), '#ffffff');
    assert.strictEqual(func([-1, -1, -1, 1]), '#000000');
  });

  it('should throw error when passing invalid XYZ components', () => {
    assert.throws(() => func([0.5, 0.5]));
  });
});

describe('convert xyz D50 to hex color', () => {
  const func = hex.convertXyzD50ToHex;

  it('should convert D50 white XYZ to #ffffff', () => {
    assert.strictEqual(func([0.96422, 1, 0.82521, 1]), '#ffffff');
  });

  it('should convert black XYZ to #000000', () => {
    assert.strictEqual(func([0, 0, 0, 1]), '#000000');
  });

  it('should convert semi-transparent D50 XYZ color to 8-digit hex format', () => {
    assert.strictEqual(func([0.96422, 1, 0.82521, 0]), '#ffffff00');
  });

  it('should clamp out-of-gamut RGB channels derived from D50 XYZ values', () => {
    assert.strictEqual(func([2, 2, 2, 1]), '#ffffff');
    assert.strictEqual(func([-1, -1, -1, 1]), '#000000');
  });

  it('should throw error when passing invalid XYZ components', () => {
    assert.throws(() => func([0.5, 0.5]));
  });
});

describe('convert hex color to rgb', () => {
  const func = hex.convertHexToRgb;

  it('should parse 3-digit hex strings', () => {
    assert.deepEqual(func('#fff'), [255, 255, 255, 1]);
    assert.deepEqual(func('#f00'), [255, 0, 0, 1]);
    assert.deepEqual(func('#000'), [0, 0, 0, 1]);
  });

  it('should parse 4-digit hex strings (with alpha)', () => {
    assert.deepEqual(func('#ffff'), [255, 255, 255, 1]);
    assert.deepEqual(func('#f000'), [255, 0, 0, 0]);
  });

  it('should parse 6-digit hex strings', () => {
    assert.deepEqual(func('#ffffff'), [255, 255, 255, 1]);
    assert.deepEqual(func('#ff0000'), [255, 0, 0, 1]);
    assert.deepEqual(func('#00ff00'), [0, 255, 0, 1]);
    assert.deepEqual(func('#0000ff'), [0, 0, 255, 1]);
  });

  it('should parse 8-digit hex strings (with alpha)', () => {
    assert.deepEqual(func('#ffffff00'), [255, 255, 255, 0]);
    assert.deepEqual(func('#ff0000ff'), [255, 0, 0, 1]);
  });

  it('should handle uppercase letters and surrounding whitespace', () => {
    assert.deepEqual(func(' #FF0000 '), [255, 0, 0, 1]);
    assert.deepEqual(func('#00FF00FF'), [0, 255, 0, 1]);
  });

  it('should throw TypeError when passing non-string argument', () => {
    assert.throws(() => func(123), TypeError);
    assert.throws(() => func(null), TypeError);
  });

  it('should throw SyntaxError when passing invalid hex string', () => {
    assert.throws(() => func('#gg0000'), SyntaxError);
    assert.throws(() => func('#12345'), SyntaxError);
    assert.throws(() => func('red'), SyntaxError);
  });
});

describe('convert hex color to linear rgb', () => {
  const func = hex.convertHexToLinearRgb;

  it('should convert 6-digit hex to linear RGB', () => {
    assert.deepEqual(func('#ffffff'), [1, 1, 1, 1]);
    assert.deepEqual(func('#000000'), [0, 0, 0, 1]);
    assert.deepEqual(func('#ff0000'), [1, 0, 0, 1]);
  });

  it('should convert 3-digit hex to linear RGB', () => {
    assert.deepEqual(func('#fff'), [1, 1, 1, 1]);
    assert.deepEqual(func('#000'), [0, 0, 0, 1]);
  });

  it('should convert 8-digit hex (with alpha) to linear RGB', () => {
    assert.deepEqual(func('#ffffff00'), [1, 1, 1, 0]);
    assert.deepEqual(func('#ff000080'), [1, 0, 0, 0.5]);
  });

  it('should throw TypeError when passing non-string argument', () => {
    assert.throws(() => func(123), TypeError);
  });

  it('should throw SyntaxError when passing invalid hex string', () => {
    assert.throws(() => func('#invalid'), SyntaxError);
  });
});

describe('convert hex color to xyz', () => {
  const func = hex.convertHexToXyz;

  it('should convert white hex to XYZ', () => {
    assert.deepEqual(
      func('#ffffff'),
      [0.9504559270516717, 0.9999999999999999, 1.0890577507598784, 1]
    );
  });

  it('should convert black hex to XYZ', () => {
    assert.deepEqual(func('#000000'), [0, 0, 0, 1]);
  });

  it('should convert primary color hex to XYZ', () => {
    assert.deepEqual(
      func('#ff0000'),
      [0.4123907992659595, 0.21263900587151036, 0.01933081871559185, 1]
    );
  });

  it('should preserve alpha channel in 8-digit hex', () => {
    assert.deepEqual(
      func('#ffffff00'),
      [0.9504559270516717, 0.9999999999999999, 1.0890577507598784, 0]
    );
  });

  it('should throw TypeError when passing non-string argument', () => {
    assert.throws(() => func(123), TypeError);
  });

  it('should throw SyntaxError when passing invalid hex string', () => {
    assert.throws(() => func('#invalid'), SyntaxError);
  });
});
