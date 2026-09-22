/**
 * transform.test
 */

/* api */
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

/* test */
import { lruCache } from '../src/js/cache';
import * as transform from '../src/js/transform';

beforeEach(() => {
  lruCache.clear();
});

afterEach(() => {
  lruCache.clear();
});

describe('transform rgb to linear rgb', () => {
  const func = transform.transformRgbToLinearRgb;

  it('should return correct linear rgb values for standard 0-255 rgb array', () => {
    const res = func([0, 128, 255]);
    assert.isTrue(Array.isArray(res));
    assert.strictEqual(res[0], 0);
    assert.closeTo(res[1], 0.21586, 1e-4);
    assert.strictEqual(res[2], 1);
  });

  it('should handle sRGB gamma threshold values correctly', () => {
    const lowVal = 10;
    const highVal = 20;
    const res = func([lowVal, highVal, 0]);
    assert.closeTo(res[0], lowVal / 255 / 12.92, 1e-5);
    const normalizedHigh = highVal / 255;
    assert.closeTo(
      res[1],
      Math.pow((normalizedHigh + 0.055) / 1.055, 2.4),
      1e-5
    );
  });

  it('should throw an error if array length is not 3', () => {
    assert.throws(() => {
      func([255, 255, 255, 1]);
    }, /Unexpected array length/);
  });

  it('should throw a TypeError for non-array inputs', () => {
    assert.throws(() => {
      func({ r: 255, g: 255, b: 255 });
    }, TypeError);
  });
});

describe('transform rgb to xyz', () => {
  const func = transform.transformRgbToXyz;

  it('should transform black (0, 0, 0) to xyz (0, 0, 0)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should transform white (255, 255, 255) to D65 white point xyz', () => {
    const res = func([255, 255, 255]);
    assert.closeTo(res[0], 0.95047, 1e-4);
    assert.closeTo(res[1], 1.0, 1e-4);
    assert.closeTo(res[2], 1.089057, 1e-4);
  });

  it('should transform pure red (255, 0, 0) correctly', () => {
    const res = func([255, 0, 0]);
    assert.closeTo(res[0], 0.412456, 1e-4);
    assert.closeTo(res[1], 0.212673, 1e-4);
    assert.closeTo(res[2], 0.019334, 1e-4);
  });

  it('should work when skip validation is true', () => {
    const res = func([255, 255, 255], true);
    assert.closeTo(res[0], 0.95047, 1e-4);
    assert.closeTo(res[1], 1.0, 1e-4);
    assert.closeTo(res[2], 1.089057, 1e-4);
  });

  it('should throw an error for invalid input when skip is false', () => {
    assert.throws(() => {
      func([256, 0, 0]);
    });
    assert.throws(() => {
      func([255, 0, 0, 1]);
    });
  });
});

describe('transform rgb to xyz-d50', () => {
  const func = transform.transformRgbToXyzD50;

  it('should transform black (0, 0, 0) to xyz-d50 (0, 0, 0)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should transform white (255, 255, 255) to D50 white point xyz', () => {
    const res = func([255, 255, 255]);
    assert.closeTo(res[0], 0.96422, 1e-4);
    assert.closeTo(res[1], 1.0, 1e-4);
    assert.closeTo(res[2], 0.8251, 1e-4);
  });

  it('should transform pure red (255, 0, 0) to D50 xyz correctly', () => {
    const res = func([255, 0, 0]);
    assert.closeTo(res[0], 0.43607, 1e-4);
    assert.closeTo(res[1], 0.2225, 1e-4);
    assert.closeTo(res[2], 0.01393, 1e-4);
  });

  it('should throw an error for invalid input', () => {
    assert.throws(() => {
      func([256, 0, 0]);
    });
    assert.throws(() => {
      func([255, 0, 0, 1]);
    });
  });
});

describe('transform linear rgb to rgb', () => {
  const func = transform.transformLinearRgbToRgb;

  it('should transform linear rgb (0, 0, 0) to rgb (0, 0, 0)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should transform linear rgb (1, 1, 1) to rgb (255, 255, 255)', () => {
    const res = func([1, 1, 1]);
    assert.closeTo(res[0], 255, 1e-4);
    assert.closeTo(res[1], 255, 1e-4);
    assert.closeTo(res[2], 255, 1e-4);
  });

  it('should handle values below and above the gamma threshold correctly', () => {
    const lowVal = 0.001;
    const highVal = 0.2;
    const res = func([lowVal, highVal, 0]);
    // lowVal * 12.92 * 255 ≈ 3.2946
    assert.closeTo(res[0], lowVal * 12.92 * 255, 1e-4);
    // (0.2 ^ (1/2.4) * 1.055 - 0.055) * 255 ≈ 123.67
    const expectedHigh = (Math.pow(highVal, 1 / 2.4) * 1.055 - 0.055) * 255;
    assert.closeTo(res[1], expectedHigh, 1e-4);
    assert.strictEqual(res[2], 0);
  });

  it('should round result when round parameter is true', () => {
    const res = func([0.2, 0.5, 0.8], true);
    assert.strictEqual(Number.isInteger(res[0]), true);
    assert.strictEqual(Number.isInteger(res[1]), true);
    assert.strictEqual(Number.isInteger(res[2]), true);
    assert.deepEqual(res, [124, 188, 231]);
  });

  it('should throw an error for invalid array length or values out of range', () => {
    assert.throws(() => {
      func([1.5, 0, 0]);
    });

    assert.throws(() => {
      func([0.5, 0.5, 0.5, 1]);
    });
  });
});

describe('transform xyz to rgb', () => {
  const func = transform.transformXyzToRgb;

  it('should transform xyz (0, 0, 0) to rgb (0, 0, 0)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should transform D65 white point xyz to rgb (255, 255, 255)', () => {
    const res = func([0.95047, 1.0, 1.089057]);
    assert.deepEqual(res, [255, 255, 255]);
  });

  it('should transform pure red xyz to rgb (255, 0, 0)', () => {
    const res = func([0.412456, 0.212673, 0.019334]);
    assert.deepEqual(res, [255, 0, 0]);
  });

  it('should clamp out-of-gamut values to 0-255 range', () => {
    const res = func([-1, 2, -0.5]);
    assert.isTrue(res.every(val => val >= 0 && val <= 255));
  });

  it('should work when skip validation is true', () => {
    const res = func([0.95047, 1.0, 1.089057], true);
    assert.deepEqual(res, [255, 255, 255]);
  });

  it('should throw an error for invalid input when skip is false', () => {
    assert.throws(() => {
      func([0.5, 0.5]);
    });
    assert.throws(() => {
      func([0.5, 0.5, 0.5, 1]);
    });
  });
});

describe('transform xyz to xyz-d50', () => {
  const func = transform.transformXyzToXyzD50;

  it('should transform xyz (0, 0, 0) to xyz-d50 (0, 0, 0)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should transform D65 white point xyz to D50 white point xyz', () => {
    const res = func([0.95047, 1.0, 1.089057]);
    assert.closeTo(res[0], 0.96422, 1e-4);
    assert.closeTo(res[1], 1.0, 1e-4);
    assert.closeTo(res[2], 0.8251, 1e-4);
  });

  it('should accept out-of-range or negative values without throwing', () => {
    const res = func([-0.5, 1.5, 0.2]);
    assert.isTrue(Array.isArray(res));
    assert.strictEqual(res.length, 3);
  });

  it('should throw an error for invalid array length', () => {
    assert.throws(() => {
      func([0.5, 0.5]);
    });
    assert.throws(() => {
      func([0.5, 0.5, 0.5, 1]);
    });
  });
});

describe('transform xyz to hsl', () => {
  const func = transform.transformXyzToHsl;

  it('should transform xyz (0, 0, 0) to hsl (0, 0, 0)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should transform D65 white point xyz to hsl (0, 0, 100)', () => {
    const res = func([0.95047, 1.0, 1.089057]);
    assert.deepEqual(res, [0, 0, 100]);
  });

  it('should transform pure red xyz to hsl (0, 100, 50)', () => {
    const res = func([0.412456, 0.212673, 0.019334]);
    assert.closeTo(res[0], 0, 1e-4);
    assert.closeTo(res[1], 100, 1e-4);
    assert.closeTo(res[2], 50, 1e-4);
  });

  it('should work when skip validation is true', () => {
    const res = func([0, 0, 0], true);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should throw an error for invalid input when skip is false', () => {
    assert.throws(() => {
      func([0.5, 0.5]);
    });
    assert.throws(() => {
      func([0.5, 0.5, 0.5, 1]);
    });
  });

  it('should set h = 0 when saturation is 0', () => {
    assert.deepEqual(func([0, 0, 0]), [0, 0, 0]);
    const whiteRes = func([0.95047, 1.0, 1.089057]);
    assert.strictEqual(whiteRes[0], 0);
    assert.strictEqual(whiteRes[1], 0);
    const grayXyz = [0.95047 * 0.214, 1.0 * 0.214, 1.089057 * 0.214];
    const grayRes = func(grayXyz);
    assert.strictEqual(grayRes[0], 0);
    assert.strictEqual(grayRes[1], 0);
  });

  it('should calculate hue correctly when Red is max', () => {
    const redXyz = [0.412456, 0.212673, 0.019334];
    const res = func(redXyz);
    assert.closeTo(res[0], 0, 1e-1);
    assert.closeTo(res[1], 100, 1e-1);
    assert.closeTo(res[2], 50, 1e-1);
  });

  it('should calculate hue correctly when Green is max', () => {
    const greenXyz = [0.35758, 0.715152, 0.119192];
    const res = func(greenXyz);
    assert.closeTo(res[0], 120, 1e-1);
    assert.closeTo(res[1], 100, 1e-1);
    assert.closeTo(res[2], 50, 1e-1);
  });

  it('should calculate hue correctly when Blue is max', () => {
    const blueXyz = [0.180437, 0.072175, 0.950304];
    const res = func(blueXyz);
    assert.closeTo(res[0], 240, 1e-1);
    assert.closeTo(res[1], 100, 1e-1);
    assert.closeTo(res[2], 50, 1e-1);
  });

  it('should handle negative hue calculation', () => {
    const roseXyz = [0.49289, 0.2488, 0.26851];
    const res = func(roseXyz);
    assert.isTrue(res[0] > 300 && res[0] < 360);
  });
});

describe('transform xyz to hwb', () => {
  const func = transform.transformXyzToHwb;

  it('should transform xyz (0, 0, 0) to hwb (0, 0, 100)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 100]);
  });

  it('should transform D65 white point xyz to hwb (0, 100, 0)', () => {
    const res = func([0.95047, 1.0, 1.089057]);
    assert.deepEqual(res, [0, 100, 0]);
  });

  it('should transform pure red xyz to hwb (0, 0, 0)', () => {
    const res = func([0.412456, 0.212673, 0.019334]);
    assert.closeTo(res[0], 0, 1e-4);
    assert.closeTo(res[1], 0, 1e-4);
    assert.closeTo(res[2], 0, 1e-4);
  });

  it('should work when skip validation is true', () => {
    const res = func([0, 0, 0], true);
    assert.deepEqual(res, [0, 0, 100]);
  });

  it('should throw an error for invalid input when skip is false', () => {
    assert.throws(() => {
      func([0.5, 0.5]);
    });
    assert.throws(() => {
      func([0.5, 0.5, 0.5, 1]);
    });
  });
});

describe('transform xyz to oklab', () => {
  const func = transform.transformXyzToOklab;

  it('should transform xyz (0, 0, 0) to oklab (0, 0, 0)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should transform D65 white point xyz to oklab white (1, 0, 0)', () => {
    const res = func([0.95047, 1.0, 1.089057]);
    assert.closeTo(res[0], 1, 1e-4);
    assert.strictEqual(res[1], 0);
    assert.strictEqual(res[2], 0);
  });

  it('should transform pure red xyz to oklab correctly', () => {
    const res = func([0.412456, 0.212673, 0.019334]);
    assert.closeTo(res[0], 0.6279, 1e-3);
    assert.closeTo(res[1], 0.2249, 1e-3);
    assert.closeTo(res[2], 0.1258, 1e-3);
  });

  it('should work when skip validation is true', () => {
    const res = func([0, 0, 0], true);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should throw an error for invalid input when skip is false', () => {
    assert.throws(() => {
      func([0.5, 0.5]);
    });
    assert.throws(() => {
      func([0.5, 0.5, 0.5, 1]);
    });
  });
});

describe('transform xyz to oklch', () => {
  const func = transform.transformXyzToOklch;

  it('should transform xyz (0, 0, 0) to oklch (0, 0, 0)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should transform D65 white point xyz to oklch white (1, 0, 0)', () => {
    const res = func([0.95047, 1.0, 1.089057]);
    assert.closeTo(res[0], 1, 1e-4);
    assert.strictEqual(res[1], 0);
    assert.strictEqual(res[2], 0);
  });

  it('should transform pure red xyz to oklch correctly', () => {
    const res = func([0.412456, 0.212673, 0.019334]);
    assert.closeTo(res[0], 0.6279, 1e-3);
    assert.closeTo(res[1], 0.2576, 1e-3);
    assert.closeTo(res[2], 29.23, 1e-1);
  });

  it('should work when skip validation is true', () => {
    const res = func([0, 0, 0], true);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should throw an error for invalid input when skip is false', () => {
    assert.throws(() => {
      func([0.5, 0.5]);
    });
    assert.throws(() => {
      func([0.5, 0.5, 0.5, 1]);
    });
  });

  it('should set h = 0 when chroma is effectively zero', () => {
    const zeroRes = func([0, 0, 0]);
    assert.strictEqual(zeroRes[1], 0);
    assert.strictEqual(zeroRes[2], 0);
  });

  it('should set h = 0 when chroma is non-zero but rounds to 0', () => {
    const x = 0.95047 * 0.2;
    const y = 1.0 * 0.2;
    const z = 1.089057 * 0.2;
    const res = func([x, y, z]);
    assert.isTrue(res[0] > 0 && res[0] < 1);
    assert.isTrue(res[1] > 0 && res[1] < 1e-4);
    assert.strictEqual(res[2], 0);
  });

  it('should calculate positive hue when b >= 0', () => {
    const greenXyz = [0.35758, 0.715152, 0.119192];
    const res = func(greenXyz);
    assert.isTrue(res[1] > 0);
    assert.isTrue(res[2] >= 0 && res[2] <= 180);
  });

  it('should normalize negative hue by adding 360', () => {
    const magentaXyz = [0.592894, 0.284848, 0.969638];
    const res = func(magentaXyz);
    assert.isTrue(res[1] > 0);
    assert.isTrue(res[2] > 270 && res[2] < 360);
  });
});

describe('transform xyz-d50 to rgb', () => {
  const func = transform.transformXyzD50ToRgb;

  it('should transform xyz-d50 (0, 0, 0) to rgb (0, 0, 0)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should transform D50 white point xyz to rgb (255, 255, 255)', () => {
    const res = func([0.96422, 1.0, 0.8251]);
    assert.deepEqual(res, [255, 255, 255]);
  });

  it('should transform pure red D50 xyz to rgb (255, 0, 0)', () => {
    const res = func([0.43607, 0.2225, 0.01393]);
    assert.deepEqual(res, [255, 0, 0]);
  });

  it('should work when skip validation is true', () => {
    const res = func([0, 0, 0], true);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should throw an error for invalid input when skip is false', () => {
    assert.throws(() => {
      func([0.5, 0.5]);
    });
    assert.throws(() => {
      func([0.5, 0.5, 0.5, 1]);
    });
  });
});

describe('transform xyz-d50 to lab', () => {
  const func = transform.transformXyzD50ToLab;

  it('should transform xyz-d50 (0, 0, 0) to lab (0, 0, 0)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should transform D50 white point xyz to lab white (100, 0, 0)', () => {
    const res = func([0.96422, 1.0, 0.8251]);
    assert.closeTo(res[0], 100, 1e-4);
    assert.strictEqual(res[1], 0);
    assert.strictEqual(res[2], 0);
  });

  it('should transform pure red D50 xyz to lab correctly', () => {
    const res = func([0.43607, 0.2225, 0.01393]);
    assert.closeTo(res[0], 54.291, 1e-3);
    assert.closeTo(res[1], 80.803, 1e-3);
    assert.closeTo(res[2], 69.885, 1e-3);
  });

  it('should work when skip validation is true', () => {
    const res = func([0, 0, 0], true);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should throw an error for invalid input when skip is false', () => {
    assert.throws(() => {
      func([0.5, 0.5]);
    });
    assert.throws(() => {
      func([0.5, 0.5, 0.5, 1]);
    });
  });
});

describe('transform xyz-d50 to lch', () => {
  const func = transform.transformXyzD50ToLch;

  it('should transform xyz-d50 (0, 0, 0) to lch (0, 0, 0)', () => {
    const res = func([0, 0, 0]);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should transform D50 white point xyz to lch white (100, 0, 0)', () => {
    const res = func([0.96422, 1.0, 0.8251]);
    assert.closeTo(res[0], 100, 1e-4);
    assert.strictEqual(res[1], 0);
    assert.strictEqual(res[2], 0);
  });

  it('should transform pure red D50 xyz to lch correctly', () => {
    const res = func([0.43607, 0.2225, 0.01393]);
    assert.closeTo(res[0], 54.291, 1e-3);
    assert.closeTo(res[1], 106.832, 1e-3);
    assert.closeTo(res[2], 40.85, 1e-1);
  });

  it('should work when skip validation is true', () => {
    const res = func([0, 0, 0], true);
    assert.deepEqual(res, [0, 0, 0]);
  });

  it('should throw an error for invalid input when skip is false', () => {
    assert.throws(() => {
      func([0.5, 0.5]);
    });
    assert.throws(() => {
      func([0.5, 0.5, 0.5, 1]);
    });
  });

  it('should normalize negative hue by adding 360 when b < 0 and a > 0', () => {
    const magentaD50Xyz = [0.49289, 0.2488, 0.26851];
    const res = func(magentaD50Xyz);
    assert.isTrue(res[1] > 0);
    assert.isTrue(res[2] > 270 && res[2] < 360);
  });
});
