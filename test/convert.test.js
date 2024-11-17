/**
 * convert.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'mocha';

/* test */
import * as convert from '../src/js/convert.js';

describe('convert hex color to rgb', () => {
  const func = convert.hexToRgb;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func('#ff0000');
    assert.deepEqual(res, [255, 0, 0, 1], 'result');

    const res2 = func('#FF0000');
    assert.deepEqual(res2, [255, 0, 0, 1], 'result');
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

  it('should get value', () => {
    const res = func(0);
    assert.strictEqual(res, '00', 'result');

    const res2 = func(0);
    assert.strictEqual(res2, '00', 'result');
  });
});

describe('convert rgb to hex color', () => {
  const func = convert.rgbToHex;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([255, 0, 128]);
    assert.deepEqual(res, '#ff0080', 'result');

    const res2 = func([255, 0, 128]);
    assert.deepEqual(res2, '#ff0080', 'result');
  });
});

describe('convert xyz', () => {
  const func = convert.convertXyz;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func([0, 0.5, 0, 1], 'foo'), Error,
      'Invalid converter name: foo');
  });

  it('should get value', () => {
    const res = func([0.08312, 0.15475, 0.02096, 1], 'xyzD50ToHex');
    assert.deepEqual(res, '#008000', 'result');

    const res2 = func([0.08312, 0.15475, 0.02096, 1], 'xyzD50ToHex');
    assert.deepEqual(res2, '#008000', 'result');
  });

  it('should get value', () => {
    const res = func([0.08312, 0.15475, 0.02096, 1], 'xyzD50ToLab');
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(1));
    assert.deepEqual(res, [46.278, -47.6, 48.6, 1], 'result');

    const res2 = func([0.08312, 0.15475, 0.02096, 1], 'xyzD50ToLab');
    res2[0] = parseFloat(res2[0].toFixed(3));
    res2[1] = parseFloat(res2[1].toFixed(1));
    res2[2] = parseFloat(res2[2].toFixed(1));
    assert.deepEqual(res2, [46.278, -47.6, 48.6, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.08312, 0.15475, 0.02096, 1], 'xyzD50ToLch');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27803, 67.99473, 134.39669, 1], 'result');

    const res2 = func([0.08312, 0.15475, 0.02096, 1], 'xyzD50ToLch');
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    assert.deepEqual(res, [46.27803, 67.99473, 134.39669, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1], 'xyzToHex');
    assert.deepEqual(res, '#008000', 'result');

    const res2 = func([0.07719, 0.15438, 0.02573, 1], 'xyzToHex');
    assert.deepEqual(res2, '#008000', 'result');
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1], 'xyzToHsl');
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 100, 25, 1], 'result');

    const res2 = func([0.07719, 0.15438, 0.02573, 1], 'xyzToHsl');
    res2[1] = Math.round(res2[1]);
    res2[2] = Math.round(res2[2]);
    assert.deepEqual(res2, [120, 100, 25, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1], 'xyzToHwb');
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 0, 50, 1], 'result');

    const res2 = func([0.07719, 0.15438, 0.02573, 1], 'xyzToHwb');
    res2[2] = Math.round(res2[2]);
    assert.deepEqual(res2, [120, 0, 50, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1], 'xyzToOklab');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51976, -0.1403, 0.10768, 1], 'result');

    const res2 = func([0.07719, 0.15438, 0.02573, 1], 'xyzToOklab');
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    assert.deepEqual(res, [0.51976, -0.1403, 0.10768, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1], 'xyzToOklch');
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.52, 0.18, 142.4953, 1], 'result');

    const res2 = func([0.07719, 0.15438, 0.02573, 1], 'xyzToOklch');
    res2[0] = parseFloat(res2[0].toFixed(2));
    res2[1] = parseFloat(res2[1].toFixed(2));
    res2[2] = parseFloat(res2[2].toFixed(4));
    assert.deepEqual(res, [0.52, 0.18, 142.4953, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1], 'xyzToRgb');
    assert.deepEqual(res, [0, 128, 0, 1], 'result');

    const res2 = func([0.07719, 0.15438, 0.02573, 1], 'xyzToRgb');
    assert.deepEqual(res2, [0, 128, 0, 1], 'result');
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1], 'xyzToXyzD50');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.08314, 0.15475, 0.02096, 1], 'result');

    const res2 = func([0.07719, 0.15438, 0.02573, 1], 'xyzToXyzD50');
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    assert.deepEqual(res2, [0.08314, 0.15475, 0.02096, 1], 'result');
  });
});

describe('convert xyz D50 to hex color', () => {
  const func = convert.xyzD50ToHex;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([0.08312, 0.15475, 0.02096, 1]);
    assert.deepEqual(res, '#008000', 'result');
  });
});

describe('convert xyz-d50 to lab', () => {
  const func = convert.xyzD50ToLab;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([0.08312, 0.15475, 0.02096, 1]);
    res[0] = parseFloat(res[0].toFixed(3));
    res[1] = parseFloat(res[1].toFixed(1));
    res[2] = parseFloat(res[2].toFixed(1));
    assert.deepEqual(res, [46.278, -47.6, 48.6, 1], 'result');
  });
});

describe('convert xyz-d50 to lch', () => {
  const func = convert.xyzD50ToLch;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([0.08312, 0.15475, 0.02096, 1]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [46.27803, 67.99473, 134.39669, 1], 'result');
  });
});

describe('convert xyz to hex color', () => {
  const func = convert.xyzToHex;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1]);
    assert.deepEqual(res, '#008000', 'result');
  });
});

describe('convert xyz to hsl', () => {
  const func = convert.xyzToHsl;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1]);
    res[1] = Math.round(res[1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 100, 25, 1], 'result');
  });
});

describe('convert xyz to hwb', () => {
  const func = convert.xyzToHwb;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1]);
    res[2] = Math.round(res[2]);
    assert.deepEqual(res, [120, 0, 50, 1], 'result');
  });
});

describe('convert xyz to oklab', () => {
  const func = convert.xyzToOklab;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.51976, -0.1403, 0.10768, 1], 'result');
  });
});

describe('convert xyz to oklch', () => {
  const func = convert.xyzToOklch;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1]);
    res[0] = parseFloat(res[0].toFixed(2));
    res[1] = parseFloat(res[1].toFixed(2));
    res[2] = parseFloat(res[2].toFixed(4));
    assert.deepEqual(res, [0.52, 0.18, 142.4953, 1], 'result');
  });
});

describe('convert xyz to rgb', () => {
  const func = convert.xyzToRgb;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1]);
    assert.deepEqual(res, [0, 128, 0, 1], 'result');
  });
});

describe('convert xyz to xyz-d50', () => {
  const func = convert.xyzToXyzD50;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1]);
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    assert.deepEqual(res, [0.08314, 0.15475, 0.02096, 1], 'result');
  });
});
