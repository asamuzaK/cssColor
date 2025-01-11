/**
 * convert.test.js
 */

import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import * as convert from '../src/js/convert.js';

describe('pre process', () => {
  const func = convert.preProcess as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get null', () => {
    const res = func();
    expect(res).toBe(null);
  });

  it('should get null', () => {
    const res = func(' ');
    expect(res).toBe(null);
  });

  it('should get value as is', () => {
    const res = func('foo');
    expect(res).toBe('foo');
  });

  it('should get null', () => {
    const res = func('var(--foo)');
    expect(res).toBe(null);
  });

  it('should get value', () => {
    const res = func('var(--foo)', {
      customProperty: {
        '--foo': 'red'
      }
    });
    expect(res).toBe('red');
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--foo)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res).toBe('blue');
  });

  it('should get value', () => {
    const res = func('calc(1 / 2)');
    expect(res).toBe('0.5');
  });

  it('should get value', () => {
    const res = func('rgb(from rebeccapurple r g b)');
    expect(res).toBe('color(srgb 0.4 0.2 0.6)');

    const res2 = func('rgb(from rebeccapurple r g b)');
    expect(res2).toBe('color(srgb 0.4 0.2 0.6)');
  });

  it('should get value', () => {
    const res = func('color-mix(in oklab, red, green)');
    expect(res).toBe('oklab(0.573854 0.0422802 0.116761)');

    const res2 = func('color-mix(in oklab, red, green)');
    expect(res2).toBe('oklab(0.573854 0.0422802 0.116761)');

    const res3 = func('color-mix(in oklab, red, green)');
    expect(res3).toBe('oklab(0.573854 0.0422802 0.116761)');
  });
});

describe('convert number to hex string', () => {
  const func = convert.numberToHex as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string.');
  });

  it('should get value', () => {
    const res = func(0);
    expect(res).toBe('00');

    const res2 = func(0);
    expect(res2).toBe('00');
  });

  it('should get value', () => {
    const res = func(2.55);
    expect(res).toBe('03');

    const res2 = func(2.55);
    expect(res2).toBe('03');
  });

  it('should get value', () => {
    const res = func(9);
    expect(res).toBe('09');

    const res2 = func(9);
    expect(res2).toBe('09');
  });

  it('should get value', () => {
    const res = func(10);
    expect(res).toBe('0a');

    const res2 = func(10);
    expect(res2).toBe('0a');
  });

  it('should get value', () => {
    const res = func(15);
    expect(res).toBe('0f');

    const res2 = func(15);
    expect(res2).toBe('0f');
  });

  it('should get value', () => {
    const res = func(16);
    expect(res).toBe('10');

    const res2 = func(16);
    expect(res2).toBe('10');
  });

  it('should get value', () => {
    const res = func(255);
    expect(res).toBe('ff');

    const res2 = func(255);
    expect(res2).toBe('ff');
  });
});

describe('convert color to hex', () => {
  const func = convert.colorToHex as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string.');
  });

  it('should get null', () => {
    const res = func(' ');
    expect(res).toBe(null);
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    expect(res).toBe('#008000');

    const res2 = func('color(srgb 0 0.5 0)');
    expect(res2).toBe('#008000');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0 / 0.5)', {
      alpha: true
    });
    expect(res).toBe('#00800080');

    const res2 = func('color(srgb 0 0.5 0 / 0.5)', {
      alpha: true
    });
    expect(res2).toBe('#00800080');
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)', {
      alpha: true
    });
    expect(res).toBe('#008000');

    const res2 = func('color(srgb 0 0.5 0)', {
      alpha: true
    });
    expect(res2).toBe('#008000');
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res).toBe('#008000');

    const res2 = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res2).toBe('#008000');
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = '#ffff00';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--baz)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res).toBe('#ffff00');

    const res2 = func('var(--baz)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res2).toBe('#ffff00');
  });
});

describe('convert color to hsl', () => {
  const func = convert.colorToHsl as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string.');
  });

  it('should get value', () => {
    const res = func(' ');
    expect(res).toEqual([0, 0, 0, 0]);
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[2] = Math.round(res[2]);
    expect(res).toEqual([120, 100, 25, 1]);

    const res2 = func('color(srgb 0 0.5 0)');
    res2[2] = Math.round(res2[2]);
    expect(res2).toEqual([120, 100, 25, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res).toEqual([120, 100, 25, 1]);

    const res2 = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res2).toEqual([120, 100, 25, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'hsl(60 100 50)';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--baz)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res).toEqual([60, 100, 50, 1]);

    const res2 = func('var(--baz)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res2).toEqual([60, 100, 50, 1]);
  });
});

describe('convert color to hwb', () => {
  const func = convert.colorToHwb as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string.');
  });

  it('should get value', () => {
    const res = func(' ');
    expect(res).toEqual([0, 0, 0, 0]);
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[2] = Math.round(res[2]);
    expect(res).toEqual([120, 0, 50, 1]);

    const res2 = func('color(srgb 0 0.5 0)');
    res2[2] = Math.round(res2[2]);
    expect(res2).toEqual([120, 0, 50, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res[2] = Math.round(res[2]);
    expect(res).toEqual([120, 0, 50, 1]);

    const res2 = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res2[2] = Math.round(res2[2]);
    expect(res2).toEqual([120, 0, 50, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'hwb(60 0 0)';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--baz)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res[2] = Math.round(res[2]);
    expect(res).toEqual([60, 0, 0, 1]);

    const res2 = func('var(--baz)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res2[2] = Math.round(res2[2]);
    expect(res2).toEqual([60, 0, 0, 1]);
  });
});

describe('convert color to lab', () => {
  const func = convert.colorToLab as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string.');
  });

  it('should get value', () => {
    const res = func(' ');
    expect(res).toEqual([0, 0, 0, 0]);
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    expect(res).toEqual([46.1022, -47.41821, 48.44932, 1]);

    const res2 = func('color(srgb 0 0.5 0)');
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    expect(res2).toEqual([46.1022, -47.41821, 48.44932, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    expect(res).toEqual([46.27776, -47.55263, 48.5864, 1]);

    const res2 = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    expect(res2).toEqual([46.27776, -47.55263, 48.5864, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'color(srgb 0 0.5 0)';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    expect(res).toEqual([46.1022, -47.41821, 48.44932, 1]);

    const res2 = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    expect(res2).toEqual([46.1022, -47.41821, 48.44932, 1]);
  });
});

describe('convert color to lch', () => {
  const func = convert.colorToLch as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string.');
  });

  it('should get value', () => {
    const res = func(' ');
    expect(res).toEqual([0, 0, 0, 0]);
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    expect(res).toEqual([46.1022, 67.7925, 134.38377, 1]);

    const res2 = func('color(srgb 0 0.5 0)');
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    expect(res2).toEqual([46.1022, 67.7925, 134.38377, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    expect(res).toEqual([46.27776, 67.98449, 134.38393, 1]);

    const res2 = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    expect(res2).toEqual([46.27776, 67.98449, 134.38393, 1]);
  });
});

describe('convert color to oklab', () => {
  const func = convert.colorToOklab as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string.');
  });

  it('should get value', () => {
    const res = func(' ');
    expect(res).toEqual([0, 0, 0, 0]);
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    expect(res).toEqual([0.51829, -0.13991, 0.10737, 1]);

    const res2 = func('color(srgb 0 0.5 0)');
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    expect(res2).toEqual([0.51829, -0.13991, 0.10737, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    expect(res).toEqual([0.51975, -0.1403, 0.10768, 1]);

    const res2 = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    expect(res2).toEqual([0.51975, -0.1403, 0.10768, 1]);
  });
});

describe('convert color to oklch', () => {
  const func = convert.colorToOklch as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string.');
  });

  it('should get value', () => {
    const res = func(' ');
    expect(res).toEqual([0, 0, 0, 0]);
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    expect(res).toEqual([0.51829, 0.17636, 142.49542, 1]);

    const res2 = func('color(srgb 0 0.5 0)');
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    expect(res2).toEqual([0.51829, 0.17636, 142.49542, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res[0] = parseFloat(res[0].toFixed(5));
    res[1] = parseFloat(res[1].toFixed(5));
    res[2] = parseFloat(res[2].toFixed(5));
    expect(res).toEqual([0.51975, 0.17686, 142.49541, 1]);

    const res2 = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    res2[0] = parseFloat(res2[0].toFixed(5));
    res2[1] = parseFloat(res2[1].toFixed(5));
    res2[2] = parseFloat(res2[2].toFixed(5));
    expect(res2).toEqual([0.51975, 0.17686, 142.49541, 1]);
  });
});

describe('convert color to rgb', () => {
  const func = convert.colorToRgb as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string.');
  });

  it('should get value', () => {
    const res = func(' ');
    expect(res).toEqual([0, 0, 0, 0]);
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    expect(res).toEqual([0, 127.5, 0, 1]);

    const res2 = func('color(srgb 0 0.5 0)');
    expect(res2).toEqual([0, 127.5, 0, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res).toEqual([0, 128, 0, 1]);

    const res2 = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res2).toEqual([0, 128, 0, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'rgb(127.5 127.5 0)';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--baz)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res).toEqual([128, 128, 0, 1]);

    const res2 = func('var(--baz)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res2).toEqual([128, 128, 0, 1]);
  });
});

describe('convert color to xyz', () => {
  const func = convert.colorToXyz as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string.');
  });

  it('should get value', () => {
    const res = func(' ');
    expect(res).toEqual([0, 0, 0, 0]);
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    expect(res).toEqual([0.0765378, 0.153076, 0.0255126, 1]);

    const res2 = func('color(srgb 0 0.5 0)');
    expect(res2).toEqual([0.0765378, 0.153076, 0.0255126, 1]);
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)', {
      d50: true
    });
    expect(res).toEqual([0.0824383, 0.153443, 0.0207794, 1]);

    const res2 = func('color(srgb 0 0.5 0)', {
      d50: true
    });
    expect(res2).toEqual([0.0824383, 0.153443, 0.0207794, 1]);
  });

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res).toEqual([0.0771883, 0.154377, 0.0257294, 1]);

    const res2 = func('var(--bar)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    expect(res2).toEqual([0.0771883, 0.154377, 0.0257294, 1]);
  });

  it('should get value', () => {
    const res = func('color-mix(in oklab, red, green)');
    expect(res).toEqual([0.208269, 0.182606, 0.0243384, 1]);

    const res2 = func('color-mix(in oklab, red, green)');
    expect(res2).toEqual([0.208269, 0.182606, 0.0243384, 1]);
  });
});

describe('convert color to xyz-d50', () => {
  const func = convert.colorToXyzD50 as Function;

  beforeEach(() => {
    convert.cachedResults.clear();
  });
  afterEach(() => {
    convert.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func(' ');
    expect(res).toEqual([0, 0, 0, 0]);
  });

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)');
    expect(res).toEqual([0.0824383, 0.153443, 0.0207794, 1]);

    const res2 = func('color(srgb 0 0.5 0)');
    expect(res2).toEqual([0.0824383, 0.153443, 0.0207794, 1]);
  });
});

describe('convert', () => {
  it('should get functions', () => {
    const keys = Object.keys(convert.convert);
    for (const key of keys) {
      expect(typeof convert.convert[key]).toBe('function');
    }
  });
});
