/**
 * convert.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'mocha';

/* test */
import * as convert from '../src/js/convert.js';

describe('pre process', () => {
  const func = convert.preProcess;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value as is', () => {
    const res = func();
    assert.deepEqual(typeof res, 'undefined', 'result');
  });

  it('should get value as is', () => {
    const res = func('foo');
    assert.strictEqual(res, 'foo', 'result');
  });

  it('should get value', () => {
    const res = func('calc(1 / 2)');
    assert.strictEqual(res, '0.5', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklab, red, green)');
    assert.strictEqual(res, 'oklab(0.573854 0.0422802 0.116761)', 'result');
  });
});

describe('convert number to hex string', () => {
  const func = convert.numberToHex;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func(0);
    assert.strictEqual(res, '00', 'result');

    const res2 = func(0);
    assert.strictEqual(res2, '00', 'result');
  });

  it('should get value', () => {
    const res = func(2.55);
    assert.strictEqual(res, '03', 'result');

    const res2 = func(2.55);
    assert.strictEqual(res2, '03', 'result');
  });

  it('should get value', () => {
    const res = func(9);
    assert.strictEqual(res, '09', 'result');

    const res2 = func(9);
    assert.strictEqual(res2, '09', 'result');
  });

  it('should get value', () => {
    const res = func(10);
    assert.strictEqual(res, '0a', 'result');

    const res2 = func(10);
    assert.strictEqual(res2, '0a', 'result');
  });

  it('should get value', () => {
    const res = func(15);
    assert.strictEqual(res, '0f', 'result');

    const res2 = func(15);
    assert.strictEqual(res2, '0f', 'result');
  });

  it('should get value', () => {
    const res = func(16);
    assert.strictEqual(res, '10', 'result');

    const res2 = func(16);
    assert.strictEqual(res2, '10', 'result');
  });

  it('should get value', () => {
    const res = func(255);
    assert.strictEqual(res, 'ff', 'result');

    const res2 = func(255);
    assert.strictEqual(res2, 'ff', 'result');
  });
});

describe('convert color to hex', () => {
  const func = convert.colorToHex;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    assert.strictEqual(res, '#008000', 'result');

    const res2 = func('color(srgb 0 0.5 0)');
    assert.strictEqual(res2, '#008000', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0 / 0.5)', {
      alpha: true
    });
    assert.strictEqual(res, '#00800080', 'result');

    const res2 = func('color(srgb 0 0.5 0 / 0.5)', {
      alpha: true
    });
    assert.strictEqual(res2, '#00800080', 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)', {
      alpha: true
    });
    assert.strictEqual(res, '#008000', 'result');

    const res2 = func('color(srgb 0 0.5 0)', {
      alpha: true
    });
    assert.strictEqual(res2, '#008000', 'result');
  });
});

describe('convert color to hsl', () => {
  const func = convert.colorToHsl;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 100, 25, 1], 'result');

    const res2 = func('color(srgb 0 0.5 0)');
    res2[2] = Math.round(res2[2]);
    assert.deepEqual(res2, [120, 100, 25, 1], 'result');
  });
});

describe('convert color to hwb', () => {
  const func = convert.colorToHwb;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 0, 50, 1], 'result');

    const res2 = func('color(srgb 0 0.5 0)');
    res2[2] = Math.round(res2[2]);
    assert.deepEqual(res2, [120, 0, 50, 1], 'result');
  });
});

describe('convert color to lab', () => {
  const func = convert.colorToLab;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.1022, -47.41821, 48.44932, 1], 'result');

    const res2 = func('color(srgb 0 0.5 0)');
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    assert.deepEqual(res2, [46.1022, -47.41821, 48.44932, 1], 'result');
  });
});

describe('convert color to lch', () => {
  const func = convert.colorToLch;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.1022, 67.7925, 134.38377, 1], 'result');

    const res2 = func('color(srgb 0 0.5 0)');
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    assert.deepEqual(res2, [46.1022, 67.7925, 134.38377, 1], 'result');
  });
});

describe('convert color to oklab', () => {
  const func = convert.colorToOklab;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51829, -0.13991, 0.10737, 1], 'result');

    const res2 = func('color(srgb 0 0.5 0)');
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    assert.deepEqual(res2, [0.51829, -0.13991, 0.10737, 1], 'result');
  });
});

describe('convert color to oklch', () => {
  const func = convert.colorToOklch;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51829, 0.17636, 142.49542, 1], 'result');

    const res2 = func('color(srgb 0 0.5 0)');
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    assert.deepEqual(res2, [0.51829, 0.17636, 142.49542, 1], 'result');
  });
});

describe('convert color to rgb', () => {
  const func = convert.colorToRgb;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    assert.deepEqual(res, [0, 127.5, 0, 1], 'result');

    const res2 = func('color(srgb 0 0.5 0)');
    assert.deepEqual(res2, [0, 127.5, 0, 1], 'result');
  });
});

describe('convert color to xyz', () => {
  const func = convert.colorToXyz;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    assert.deepEqual(res, [0.0765378, 0.153076, 0.0255126, 1], 'result');

    const res2 = func('color(srgb 0 0.5 0)');
    assert.deepEqual(res2, [0.0765378, 0.153076, 0.0255126, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)', {
      d50: true
    });
    assert.deepEqual(res, [0.0824383, 0.153443, 0.0207794, 1], 'result');

    const res2 = func('color(srgb 0 0.5 0)', {
      d50: true
    });
    assert.deepEqual(res2, [0.0824383, 0.153443, 0.0207794, 1], 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklab, red, green)');
    assert.deepEqual(res, [0.208269, 0.182606, 0.0243384, 1], 'result');

    const res2 = func('color-mix(in oklab, red, green)');
    assert.deepEqual(res2, [0.208269, 0.182606, 0.0243384, 1], 'result');
  });
});

describe('convert color to xyz-d50', () => {
  const func = convert.colorToXyzD50;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    assert.deepEqual(res, [0.0824383, 0.153443, 0.0207794, 1], 'result');

    const res2 = func('color(srgb 0 0.5 0)');
    assert.deepEqual(res2, [0.0824383, 0.153443, 0.0207794, 1], 'result');
  });
});

describe('convert', () => {
  it('should get functions', () => {
    const keys = Object.keys(convert.convert);
    for (const key of keys) {
      assert.strictEqual(typeof convert.convert[key], 'function');
    }
  });
});
