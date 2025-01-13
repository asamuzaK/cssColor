/**
 * css-calc.test.js
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as csscalc from '../src/js/css-calc.js';

describe('calculator', () => {
  const { Calculator } = csscalc;

  it('should create instance', () => {
    const cal = new Calculator();
    expect(cal instanceof Calculator).toBe(true);
    expect(cal.hasNum).toBe(false);
    expect(cal.numSum).toEqual([]);
    expect(cal.numMul).toEqual([]);
    expect(cal.hasPct).toBe(false);
    expect(cal.pctSum).toEqual([]);
    expect(cal.pctMul).toEqual([]);
    expect(cal.hasDim).toBe(false);
    expect(cal.dimSum).toEqual([]);
    expect(cal.dimSub).toEqual([]);
    expect(cal.dimMul).toEqual([]);
    expect(cal.dimDiv).toEqual([]);
    expect(cal.hasEtc).toBe(false);
    expect(cal.etcSum).toEqual([]);
    expect(cal.etcSub).toEqual([]);
    expect(cal.etcMul).toEqual([]);
    expect(cal.etcDiv).toEqual([]);
    expect(typeof cal.clear).toBe('function');
    expect(typeof cal.sort).toBe('function');
    expect(typeof cal.multiply).toBe('function');
    expect(typeof cal.sum).toBe('function');
  });

  it('should get/set values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    expect(cal.hasNum).toBe(true);
    cal.numSum.push(10, -10);
    expect(cal.numSum).toEqual([10, -10]);
    cal.numMul.push(10, -10, 0.1);
    expect(cal.numMul).toEqual([10, -10, 0.1]);
    cal.hasPct = true;
    expect(cal.hasPct).toBe(true);
    cal.pctSum.push(10, -10);
    expect(cal.pctSum).toEqual([10, -10]);
    cal.pctMul.push(10, -10, 0.1);
    expect(cal.pctMul).toEqual([10, -10, 0.1]);
    cal.hasDim = true;
    expect(cal.hasDim).toBe(true);
    cal.dimSum.push('10px', '-10px');
    expect(cal.dimSum).toEqual(['10px', '-10px']);
    cal.dimSub.push('10px', '-1em');
    expect(cal.dimSub).toEqual(['10px', '-1em']);
    cal.dimMul.push('10px', '-10px');
    expect(cal.dimMul).toEqual(['10px', '-10px']);
    cal.dimDiv.push('10px', '-1em');
    expect(cal.dimDiv).toEqual(['10px', '-1em']);
    cal.hasEtc = true;
    expect(cal.hasEtc).toBe(true);
    cal.etcSum.push('r', 'g', 'b', 'alpha');
    expect(cal.etcSum).toEqual(['r', 'g', 'b', 'alpha']);
    cal.etcSub.push('r', 'g', 'b', 'alpha');
    expect(cal.etcSub).toEqual(['r', 'g', 'b', 'alpha']);
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    expect(cal.etcMul).toEqual(['r', 'g', 'b', 'alpha']);
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    expect(cal.etcDiv).toEqual(['r', 'g', 'b', 'alpha']);
  });

  it('should clear values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numSum.push(10, -10);
    cal.numMul.push(10, -10, 0.1);
    cal.hasPct = true;
    cal.pctSum.push(10, -10);
    cal.pctMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimSum.push('10px', '-10px');
    cal.dimSub.push('10px', '-10px');
    cal.dimMul.push('10px', '-10px');
    cal.dimDiv.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcSum.push('r', 'g', 'b', 'alpha');
    cal.etcSub.push('r', 'g', 'b', 'alpha');
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    cal.clear();
    expect(cal.hasNum).toBe(false);
    expect(cal.numSum).toEqual([]);
    expect(cal.numMul).toEqual([]);
    expect(cal.hasPct).toBe(false);
    expect(cal.pctSum).toEqual([]);
    expect(cal.pctMul).toEqual([]);
    expect(cal.hasDim).toBe(false);
    expect(cal.dimSum).toEqual([]);
    expect(cal.dimSub).toEqual([]);
    expect(cal.dimMul).toEqual([]);
    expect(cal.dimDiv).toEqual([]);
    expect(cal.hasEtc).toBe(false);
    expect(cal.etcSum).toEqual([]);
    expect(cal.etcSub).toEqual([]);
    expect(cal.etcMul).toEqual([]);
    expect(cal.etcDiv).toEqual([]);
  });

  it('should sort values', () => {
    const cal = new Calculator();
    const res = cal.sort([1, -1, 3, 5, 2, 2, 4] as never);
    expect(res).toEqual([-1, 1, 2, 2, 3, 4, 5]);
  });

  it('should sort values', () => {
    const cal = new Calculator();
    const res = cal.sort([
      '-1px',
      '3px',
      '5em',
      '2em',
      '2em',
      '4px',
      '1vw',
    ] as never);
    expect(res).toEqual(['2em', '2em', '5em', '-1px', '3px', '4px', '1vw']);
  });

  it('should get null', () => {
    const cal = new Calculator();
    const res = cal.multiply();
    expect(res).toBe(null);
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 0.1);
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.dimDiv.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    expect(res).toBe(
      '100% * (-10px * 10px / (-10px * 10px)) * alpha * b * g * r / (alpha * b * g * r)',
    );
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, 0, 0.1);
    const res = cal.multiply();
    expect(res).toBe('0');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, Infinity, 0.1);
    const res = cal.multiply();
    expect(res).toBe('Infinity');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, NaN, 0.1);
    const res = cal.multiply();
    expect(res).toBe('NaN');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    expect(res).toBe('-10% * (-10px * 10px) * alpha * b * g * r');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    cal.hasEtc = true;
    cal.etcMul.push('r');
    const res = cal.multiply();
    expect(res).toBe('-10% * 10px * r');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimDiv.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    expect(res).toBe('-10% / (-10px * 10px) / (alpha * b * g * r)');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimDiv.push('10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r');
    const res = cal.multiply();
    expect(res).toBe('-10% / 10px / r');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, 0, 0.1);
    const res = cal.multiply();
    expect(res).toBe('0%');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, Infinity, 0.1);
    const res = cal.multiply();
    expect(res).toBe('Infinity');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, NaN, 0.1);
    const res = cal.multiply();
    expect(res).toBe('NaN');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.dimDiv.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    expect(res).toBe(
      '(-10 * -10px * 10px / (-10px * 10px)) * alpha * b * g * r / (alpha * b * g * r)',
    );
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.dimDiv.push('10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    expect(res).toBe(
      '-10% * (-10px * 10px / 10px) * alpha * b * g * r / (alpha * b * g * r)',
    );
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.dimDiv.push('10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    expect(res).toBe(
      '(-10 * -10px * 10px / 10px) * alpha * b * g * r / (alpha * b * g * r)',
    );
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    expect(res).toBe('(-10 * -10px * 10px) * alpha * b * g * r');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    cal.hasEtc = true;
    cal.etcMul.push('r');
    const res = cal.multiply();
    expect(res).toBe('-100px * r');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimDiv.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    expect(res).toBe('(-10 / (-10px * 10px)) / (alpha * b * g * r)');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimMul.push('10px');
    const res = cal.multiply();
    expect(res).toBe('10px');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, 0, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    const res = cal.multiply();
    expect(res).toBe('0% * 10px');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, NaN, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    const res = cal.multiply();
    expect(res).toBe('NaN * 10px');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, Infinity, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    const res = cal.multiply();
    expect(res).toBe('Infinity * 10px');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -Infinity, 0.1);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    const res = cal.multiply();
    expect(res).toBe('-Infinity * 10px');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 0.1);
    cal.hasDim = true;
    cal.dimDiv.push('10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r');
    const res = cal.multiply();
    expect(res).toBe('(-10 / 10px) / r');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimMul.push('10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r');
    const res = cal.multiply();
    expect(res).toBe('10px / r');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimDiv.push('10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r');
    const res = cal.multiply();
    expect(res).toBe('1 / 10px / r');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 0.1);
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    expect(res).toBe('-10 * alpha * b * g * r / (alpha * b * g * r)');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 0.1);
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r');
    const res = cal.multiply();
    expect(res).toBe('-10 * alpha * b * g * r / r');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r');
    const res = cal.multiply();
    expect(res).toBe('alpha * b * g * r / r');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcDiv.push('r', 'g');
    const res = cal.multiply();
    expect(res).toBe('1 / (g * r)');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcDiv.push('r');
    const res = cal.multiply();
    expect(res).toBe('1 / r');
  });

  it('should get null', () => {
    const cal = new Calculator();
    const res = cal.sum();
    expect(res).toBe(null);
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numSum.push(20, -10);
    cal.hasPct = true;
    cal.pctSum.push(20, -10);
    cal.hasDim = true;
    cal.dimSum.push('30px', '-10px');
    cal.dimSub.push('20px', '-10px');
    cal.hasEtc = true;
    cal.etcSum.push('r', 'g', 'b');
    cal.etcSub.push('r', 'alpha');
    const res = cal.sum();
    expect(res).toBe('10 + 10% + 10px + (b + g + r) - (alpha + r)');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numSum.push(20, Infinity);
    const res = cal.sum();
    expect(res).toBe('Infinity');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numSum.push(20, NaN);
    const res = cal.sum();
    expect(res).toBe('NaN');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctSum.push(20, Infinity);
    const res = cal.sum();
    expect(res).toBe('Infinity');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctSum.push(20, NaN);
    const res = cal.sum();
    expect(res).toBe('NaN');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimSum.push('30px', '-10px');
    cal.dimSub.push('10px');
    const res = cal.sum();
    expect(res).toBe('10px');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimSum.push('30px', '-10px');
    const res = cal.sum();
    expect(res).toBe('20px');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimSub.push('30px', '-10px');
    const res = cal.sum();
    expect(res).toBe('-20px');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSum.push('r', 'g', 'b');
    cal.etcSub.push('r');
    const res = cal.sum();
    expect(res).toBe('b + g + r - r');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSum.push('r', 'g', 'b');
    const res = cal.sum();
    expect(res).toBe('b + g + r');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSub.push('r', 'g', 'b');
    const res = cal.sum();
    expect(res).toBe('-1 * (b + g + r)');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSub.push('r');
    const res = cal.sum();
    expect(res).toBe('-1 * r');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numSum.push(1);
    cal.hasEtc = true;
    cal.etcSum.push('r');
    const res = cal.sum();
    expect(res).toBe('1 + r');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSum.push('r');
    const res = cal.sum();
    expect(res).toBe('r');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSub.push('1 * r');
    const res = cal.sum();
    expect(res).toBe('-1 * (1 * r)');
  });
});

describe('sort calc values', () => {
  const func = csscalc.sortCalcValues as Function;

  it('should get null', () => {
    expect(func()).toBe(null);
  });

  it('should get null', () => {
    expect(func(['calc(', ')'])).toBe(null);
  });

  it('should get value', () => {
    expect(func(['calc(', 1, ')'])).toBe('calc(1)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '*', 0.5, ')'])).toBe('calc(0.5 * r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '+', 0.5, ')'], true)).toBe('calc(0.5 + r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '*', 0.5, ')'])).toBe('calc(0.5 * r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '/', 2, ')'])).toBe('calc(0.5 * r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '/', '200%', ')'])).toBe('calc(50% * r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '/', '50vw', ')'])).toBe('calc(1 / 50vw * r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '/', 'g', ')'])).toBe('calc(r / g)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '*', '1em', ')'])).toBe('calc(1em * r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '-', 1, ')'], true)).toBe('calc(-1 + r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '-', '50%', ')'], true)).toBe('calc(-50% + r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '-', '1em', ')'], true)).toBe('calc(-1em + r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '-', 'b', ')'], true)).toBe('calc(r - b)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '+', 1, ')'], true)).toBe('calc(1 + r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '+', '50%', ')'], true)).toBe('calc(50% + r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '+', '1em', ')'], true)).toBe('calc(1em + r)');
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '/', 2, '+', 'r', '*', '50%', ')'], true)).toBe(
      'calc((0.5 * r) + (50% * r))',
    );
  });

  it('should get value', () => {
    expect(func(['calc(', 'r', '*', '1', ')'], true)).toBe('calc(1 * r)');
  });
});

describe('serialize calc', () => {
  const func = csscalc.serializeCalc as Function;

  beforeEach(() => {
    csscalc.cachedResults.clear();
  });
  afterEach(() => {
    csscalc.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string');
  });

  it('should get value', () => {
    const res = func('red');
    expect(res).toBe('red');
  });

  it('should get value', () => {
    const res = func('calc(1)');
    expect(res).toBe('calc(1)');
  });

  it('should get value', () => {
    const res = func('calc(r * 0.5 - g * 0.5)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc((0.5 * r) - (0.5 * g))');

    const res2 = func('calc(r * 0.5 + r * 0.5)', {
      format: 'specifiedValue',
    });
    expect(res2).toBe('calc((0.5 * r) + (0.5 * r))');
  });

  it('should get value', () => {
    const res = func('calc(r * 0.5 + r * 0.5)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc((0.5 * r) + (0.5 * r))');

    const res2 = func('calc(r * 0.5 + r * 0.5)', {
      format: 'specifiedValue',
    });
    expect(res2).toBe('calc((0.5 * r) + (0.5 * r))');
  });

  it('should get value', () => {
    const res = func('calc((r * 0.5) + (r * 0.5))', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc((0.5 * r) + (0.5 * r))');

    const res2 = func('calc((r * 0.5) + (r * 0.5))', {
      format: 'specifiedValue',
    });
    expect(res2).toBe('calc((0.5 * r) + (0.5 * r))');
  });

  it('should get value', () => {
    const res = func('calc(r * sign(2px))', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(1 * r)');

    const res2 = func('calc(r * sign(2px))', {
      format: 'specifiedValue',
    });
    expect(res2).toBe('calc(1 * r)');
  });
});

describe('resolve dimension', () => {
  const func = csscalc.resolveDimension as Function;

  beforeEach(() => {
    csscalc.cachedResults.clear();
  });
  afterEach(() => {
    csscalc.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not an array.');
  });

  it('should get null', () => {
    const res = func([]);
    expect(res).toBe(null);
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100em',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: undefined,
      },
    ];
    const res = func(token);
    expect(res).toBe(null);
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100em',
      40,
      44,
      {
        value: undefined,
        signCharacter: undefined,
        type: 'integer',
        unit: 'em',
      },
    ];
    const res = func(token);
    expect(res).toBe(null);
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100em',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'em',
      },
    ];
    const res = func(token);
    expect(res).toBe(null);
  });

  it('should get value', () => {
    const token = [
      'dimension-token',
      '100px',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'px',
      },
    ];
    const res = func(token);
    expect(res).toBe('100px');
  });

  it('should get value', () => {
    const token = [
      'dimension-token',
      '100px',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'em',
      },
    ];
    const res = func(token, {
      dimension: {
        em: 16,
      },
    });
    expect(res).toBe('1600px');
  });

  it('should get value', () => {
    const token = [
      'dimension-token',
      '100px',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'em',
      },
    ];
    const unitMap = {
      em: 12,
      rem: 16,
      vw: 10.26,
    };
    const resolver = (arg: keyof typeof unitMap) => unitMap[arg];
    const res = func(token, {
      dimension: {
        callback: resolver,
      },
    });
    expect(res).toBe('1200px');
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100ch',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'ch',
      },
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26,
      },
    });
    expect(res).toBe(null);
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100ex',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'ex',
      },
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26,
      },
    });
    expect(res).toBe(null);
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100lh',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'lh',
      },
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26,
      },
    });
    expect(res).toBe(null);
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '10rch',
      40,
      44,
      {
        value: 10,
        signCharacter: undefined,
        type: 'integer',
        unit: 'rch',
      },
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26,
      },
    });
    expect(res).toBe(null);
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '10rex',
      40,
      44,
      {
        value: 10,
        signCharacter: undefined,
        type: 'integer',
        unit: 'rex',
      },
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26,
      },
    });
    expect(res).toBe(null);
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100rlh',
      40,
      45,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'rlh',
      },
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26,
      },
    });
    expect(res).toBe(null);
  });

  it('should get null', () => {
    const token = [
      'dimension-token',
      '100em',
      40,
      44,
      {
        value: 100,
        signCharacter: undefined,
        type: 'integer',
        unit: 'em',
      },
    ];
    const res = func(token, {
      format: 'specifiedValue',
    });
    expect(res).toBe(null);
  });
});

describe('parse tokens', () => {
  const func = csscalc.parseTokens as Function;

  beforeEach(() => {
    csscalc.cachedResults.clear();
  });
  afterEach(() => {
    csscalc.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not an array.');
  });

  it('should throw', () => {
    expect(() => func(['foo'])).toThrow(TypeError);
    expect(() => func(['foo'])).toThrow('foo is not an array.');
  });

  it('should get value', () => {
    const tokens = [
      ['function-token', 'color-mix(', 0, 9, { value: 'color-mix' }],
      ['ident-token', 'in', 10, 11, { value: 'in' }],
      ['whitespace-token', ' ', 12, 12, undefined],
      ['ident-token', 'srgb', 13, 16, { value: 'srgb' }],
      ['comma-token', ',', 17, 17, undefined],
      ['whitespace-token', ' ', 18, 18, undefined],
      ['ident-token', 'red', 19, 21, { value: 'red' }],
      ['whitespace-token', ' ', 22, 22, undefined],
      ['function-token', 'calc(', 23, 27, { value: 'calc' }],
      ['whitespace-token', ' ', 28, 28, undefined],
      ['comment', '/* comment */', 29, 41, undefined],
      ['whitespace-token', ' ', 42, 42, undefined],
      [
        'percentage-token',
        '50%',
        43,
        45,
        { value: 50, signCharacter: undefined },
      ],
      ['whitespace-token', ' ', 46, 46, undefined],
      ['delim-token', '+', 47, 47, { value: '+' }],
      ['whitespace-token', ' ', 48, 48, undefined],
      ['(-token', '(', 49, 49, undefined],
      ['function-token', 'sign(', 50, 54, { value: 'sign' }],
      [
        'dimension-token',
        '100em',
        55,
        59,
        {
          value: 100,
          signCharacter: undefined,
          type: 'integer',
          unit: 'em',
        },
      ],
      ['whitespace-token', ' ', 60, 60, undefined],
      ['delim-token', '-', 61, 61, { value: '-' }],
      ['whitespace-token', ' ', 62, 62, undefined],
      [
        'dimension-token',
        '1px',
        63,
        65,
        { value: 1, signCharacter: undefined, type: 'integer', unit: 'px' },
      ],
      [')-token', ')', 66, 66, undefined],
      ['whitespace-token', ' ', 67, 67, undefined],
      ['delim-token', '*', 68, 68, { value: '*' }],
      ['whitespace-token', ' ', 69, 69, undefined],
      [
        'percentage-token',
        '10%',
        70,
        72,
        { value: 10, signCharacter: undefined },
      ],
      [')-token', ')', 73, 73, undefined],
      [')-token', ')', 74, 74, undefined],
      ['comma-token', ',', 75, 75, undefined],
      ['whitespace-token', ' ', 76, 76, undefined],
      ['ident-token', 'blue', 77, 80, { value: 'blue' }],
      [')-token', ')', 81, 81, undefined],
      ['EOF-token', '', -1, -1, undefined],
    ];
    const res = func(tokens);
    expect(res).toEqual([
      'color-mix(',
      'in',
      ' ',
      'srgb',
      ',',
      ' ',
      'red',
      ' ',
      'calc(',
      '50%',
      ' ',
      '+',
      ' ',
      '(',
      'sign(',
      '100em',
      ' ',
      '-',
      ' ',
      '1px',
      ')',
      ' ',
      '*',
      ' ',
      '10%',
      ')',
      ')',
      ',',
      ' ',
      'blue',
      ')',
    ]);
  });

  it('should get value', () => {
    const tokens = [
      ['whitespace-token', ' ', 12, 12, undefined],
      [')-token', ')', 66, 66, undefined],
      ['whitespace-token', ' ', 67, 67, undefined],
      [')-token', ')', 73, 73, undefined],
    ];
    const res = func(tokens);
    expect(res).toEqual([')', ')']);
  });
});

describe('resolve CSS calc()', () => {
  const func = csscalc.cssCalc as Function;

  beforeEach(() => {
    csscalc.cachedResults.clear();
  });
  afterEach(() => {
    csscalc.cachedResults.clear();
  });

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError);
    expect(() => func()).toThrow('undefined is not a string');
  });

  it('should throw', () => {
    expect(() => func('var(--foo)')).toThrow(SyntaxError);
    expect(() => func('var(--foo)')).toThrow('Unexpected token var( found.');
  });

  it('should get value', () => {
    const res = func('var(--foo)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('var(--foo)');
  });

  it('should get value', () => {
    const res = func('');
    expect(res).toBe('');
  });

  it('should get value', () => {
    const res = func('foo');
    expect(res).toBe('foo');
  });

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, red calc( /* comment */ 50% + (sign(100em - 1px) * 10%)), blue)',
      {
        dimension: {
          em: 16,
        },
      },
    );
    expect(res).toBe('color-mix(in srgb, red 60%, blue)');

    const res2 = func(
      'color-mix(in srgb, red calc( /* comment */ 50% + (sign(100em - 1px) * 10%)), blue)',
      {
        dimension: {
          em: 16,
        },
      },
    );
    expect(res2).toBe('color-mix(in srgb, red 60%, blue)');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50% + (sign(100em - 1px) * 10%))', {
      dimension: {
        em: 16,
      },
    });
    expect(res).toBe('60%');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50% + (sign(100em - 1px) * 10%))', {
      dimension: {
        em: 16,
      },
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(60%)');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50em * calc(2 / 3))', {
      dimension: {
        em: 16,
      },
    });
    expect(res).toBe('533.333px');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50em * calc(2 / 3))', {
      dimension: {
        em: 16,
      },
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(33.3333em)');
  });

  it('should get value', () => {
    const res = func('calc(100% - 100px)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(100% - 100px)');
  });

  it('should get value', () => {
    const res = func('abs(sign(-0.5) * 2px / 3)');
    expect(res).toBe('0.666667px');
  });

  it('should get value', () => {
    const res = func('acos(1)');
    expect(res).toBe('0deg');
  });

  it('should get value', () => {
    const res = func('acos(1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(0deg)');
  });

  it('should get value', () => {
    const res = func('acos(-1)');
    expect(res).toBe('180deg');
  });

  it('should get value', () => {
    const res = func('acos(-1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(180deg)');
  });

  it('should get value', () => {
    const res = func('acos(-1.5)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(NaN * 1deg)');
  });

  it('should get value', () => {
    const res = func('asin(1)');
    expect(res).toBe('90deg');
  });

  it('should get value', () => {
    const res = func('asin(1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(90deg)');
  });

  it('should get value', () => {
    const res = func('asin(-1)');
    expect(res).toBe('-90deg');
  });

  it('should get value', () => {
    const res = func('asin(-1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(-90deg)');
  });

  it('should get value', () => {
    const res = func('asin(-1.5)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(NaN * 1deg)');
  });

  it('should get value', () => {
    const res = func('atan(1)');
    expect(res).toBe('45deg');
  });

  it('should get value', () => {
    const res = func('atan(1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(45deg)');
  });

  it('should get value', () => {
    const res = func('atan(-1)');
    expect(res).toBe('-45deg');
  });

  it('should get value', () => {
    const res = func('atan(-1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(-45deg)');
  });

  it('should get value', () => {
    const res = func('atan(infinity)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(90deg)');
  });

  it('should get value', () => {
    const res = func('atan2(37.320508075, 10)');
    expect(res).toBe('75deg');
  });

  it('should get value', () => {
    const res = func('atan2(37.320508075, 10)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(75deg)');
  });

  it('should get value', () => {
    const res = func('atan2(1s, 1000ms)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(45deg)');
  });

  it('should get value', () => {
    const res = func('atan2(infinity, infinity)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(45deg)');
  });

  it('should get value', () => {
    const res = func('atan2(-infinity, -infinity)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(-135deg)');
  });

  it('should get value', () => {
    const res = func('calc(asin(sin(pi/2)))');
    expect(res).toBe('90deg');
  });

  it('should get value', () => {
    const res = func('calc(asin(sin(30deg + 1.0471967rad ) ))');
    expect(res).toBe('90deg');
  });

  it('should get value', () => {
    const res = func('cos(0)');
    expect(res).toBe('1');
  });

  it('should get value', () => {
    const res = func('cos(0)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(1)');
  });

  it('should get value', () => {
    const res = func('sin(0)');
    expect(res).toBe('0');
  });

  it('should get value', () => {
    const res = func('sin(0)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(0)');
  });

  it('should get value', () => {
    const res = func('tan(0)');
    expect(res).toBe('0');
  });

  it('should get value', () => {
    const res = func('tan(0)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(0)');
  });

  it('should get value', () => {
    const res = func('sin(30deg)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(0.5)');
  });

  it('should get value', () => {
    const res = func('cos(60deg)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(0.5)');
  });

  it('should get value', () => {
    const res = func('tan(45deg)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(1)');
  });

  it('should get value', () => {
    const res = func('clamp(1px, 2px, 3px)');
    expect(res).toBe('2px');
  });

  it('should get value', () => {
    const res = func('clamp(1px, 2px, 3px)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(2px)');
  });

  it('should get value', () => {
    const res = func('clamp(30px, 100px, 20px)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(30px)');
  });

  it('should get value', () => {
    const res = func('clamp(1px, 1em, 1vh)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('clamp(1px, 1em, 1vh)');
  });

  it('should get value', () => {
    const res = func('exp(0)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(1)');
  });

  it('should get value', () => {
    const res = func('log(1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(0)');
  });

  it('should get value', () => {
    const res = func('pow(1, 1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(1)');
  });

  it('should get value', () => {
    const res = func('hypot(1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(1)');
  });

  it('should get value', () => {
    const res = func('sqrt(1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(1)');
  });

  it('should get value', () => {
    const res = func('round(1.1, 1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(1)');
  });

  it('should get value', () => {
    const res = func('mod(1, 1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(0)');
  });

  it('should get value', () => {
    const res = func('rem(1, 1)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(0)');
  });

  it('should get value', () => {
    const res = func('min(1px, 2px)');
    expect(res).toBe('1px');
  });

  it('should get value', () => {
    const res = func('min(1px, 2px)', {
      format: 'specifiedValue',
    });
    expect(res).toBe('calc(1px)');
  });
});
