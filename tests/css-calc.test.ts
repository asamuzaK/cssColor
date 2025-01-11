/**
 * css-calc.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'mocha';

/* test */
import * as csscalc from '../src/js/css-calc.js';

describe('calculator', () => {
  const { Calculator } = csscalc;

  it('should create instance', () => {
    const cal = new Calculator();
    assert.strictEqual(cal instanceof Calculator, true, 'instance');
    assert.strictEqual(cal.hasNum, false, 'hasNum');
    assert.deepEqual(cal.numSum, [], 'numSum');
    assert.deepEqual(cal.numMul, [], 'numMul');
    assert.strictEqual(cal.hasPct, false, 'hasPct');
    assert.deepEqual(cal.pctSum, [], 'pctSum');
    assert.deepEqual(cal.pctMul, [], 'pctMul');
    assert.strictEqual(cal.hasDim, false, 'hasDim');
    assert.deepEqual(cal.dimSum, [], 'dimSum');
    assert.deepEqual(cal.dimSub, [], 'dimSub');
    assert.deepEqual(cal.dimMul, [], 'dimMul');
    assert.deepEqual(cal.dimDiv, [], 'dimDiv');
    assert.strictEqual(cal.hasEtc, false, 'hasEtc');
    assert.deepEqual(cal.etcSum, [], 'etcSum');
    assert.deepEqual(cal.etcSub, [], 'etcSub');
    assert.deepEqual(cal.etcMul, [], 'etcMul');
    assert.deepEqual(cal.etcDiv, [], 'etcDiv');
    assert.strictEqual(typeof cal.clear, 'function', 'clear');
    assert.strictEqual(typeof cal.sort, 'function', 'sort');
    assert.strictEqual(typeof cal.multiply, 'function', 'multiply');
    assert.strictEqual(typeof cal.sum, 'function', 'sum');
  });

  it('should get/set values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    assert.strictEqual(cal.hasNum, true, 'hasNum');
    cal.numSum.push(10, -10);
    assert.deepEqual(cal.numSum, [10, -10], 'numSum');
    cal.numMul.push(10, -10, 1 / 10);
    assert.deepEqual(cal.numMul, [10, -10, 0.1], 'numMul');
    cal.hasPct = true;
    assert.strictEqual(cal.hasPct, true, 'hasPct');
    cal.pctSum.push(10, -10);
    assert.deepEqual(cal.pctSum, [10, -10], 'pctSum');
    cal.pctMul.push(10, -10, 1 / 10);
    assert.deepEqual(cal.pctMul, [10, -10, 0.1], 'pctMul');
    cal.hasDim = true;
    assert.strictEqual(cal.hasDim, true, 'hasDim');
    cal.dimSum.push('10px', '-10px');
    assert.deepEqual(cal.dimSum, ['10px', '-10px'], 'dimSum');
    cal.dimSub.push('10px', '-1em');
    assert.deepEqual(cal.dimSub, ['10px', '-1em'], 'dimSub');
    cal.dimMul.push('10px', '-10px');
    assert.deepEqual(cal.dimMul, ['10px', '-10px'], 'dimMul');
    cal.dimDiv.push('10px', '-1em');
    assert.deepEqual(cal.dimDiv, ['10px', '-1em'], 'dimDiv');
    cal.hasEtc = true;
    assert.strictEqual(cal.hasEtc, true, 'hasEtc');
    cal.etcSum.push('r', 'g', 'b', 'alpha');
    assert.deepEqual(cal.etcSum, ['r', 'g', 'b', 'alpha'], 'etcSum');
    cal.etcSub.push('r', 'g', 'b', 'alpha');
    assert.deepEqual(cal.etcSub, ['r', 'g', 'b', 'alpha'], 'etcSub');
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    assert.deepEqual(cal.etcMul, ['r', 'g', 'b', 'alpha'], 'etcMul');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    assert.deepEqual(cal.etcDiv, ['r', 'g', 'b', 'alpha'], 'etcDiv');
  });

  it('should clear values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numSum.push(10, -10);
    cal.numMul.push(10, -10, 1 / 10);
    cal.hasPct = true;
    cal.pctSum.push(10, -10);
    cal.pctMul.push(10, -10, 1 / 10);
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
    assert.strictEqual(cal.hasNum, false, 'hasNum');
    assert.deepEqual(cal.numSum, [], 'numSum');
    assert.deepEqual(cal.numMul, [], 'numMul');
    assert.strictEqual(cal.hasPct, false, 'hasPct');
    assert.deepEqual(cal.pctSum, [], 'pctSum');
    assert.deepEqual(cal.pctMul, [], 'pctMul');
    assert.strictEqual(cal.hasDim, false, 'hasDim');
    assert.deepEqual(cal.dimSum, [], 'dimSum');
    assert.deepEqual(cal.dimSub, [], 'dimSub');
    assert.deepEqual(cal.dimMul, [], 'dimMul');
    assert.deepEqual(cal.dimDiv, [], 'dimDiv');
    assert.strictEqual(cal.hasEtc, false, 'hasEtc');
    assert.deepEqual(cal.etcSum, [], 'etcSum');
    assert.deepEqual(cal.etcSub, [], 'etcSub');
    assert.deepEqual(cal.etcMul, [], 'etcMul');
    assert.deepEqual(cal.etcDiv, [], 'etcDiv');
  });

  it('should sort values', () => {
    const cal = new Calculator();
    const res = cal.sort([1, -1, 3, 5, 2, 2, 4]);
    assert.deepEqual(res, [-1, 1, 2, 2, 3, 4, 5], 'result');
  });

  it('should sort values', () => {
    const cal = new Calculator();
    const res = cal.sort(['-1px', '3px', '5em', '2em', '2em', '4px', '1vw']);
    assert.deepEqual(res, ['2em', '2em', '5em', '-1px', '3px', '4px', '1vw'],
      'result');
  });

  it('should get null', () => {
    const cal = new Calculator();
    const res = cal.multiply();
    assert.strictEqual(res, null, 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 1 / 10);
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.dimDiv.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    assert.strictEqual(res,
      '100% * (-10px * 10px / (-10px * 10px)) * alpha * b * g * r / (alpha * b * g * r)',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, 0, 1 / 10);
    const res = cal.multiply();
    assert.strictEqual(res, '0', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, Infinity, 1 / 10);
    const res = cal.multiply();
    assert.strictEqual(res, 'Infinity', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, NaN, 1 / 10);
    const res = cal.multiply();
    assert.strictEqual(res, 'NaN', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    assert.strictEqual(res, '-10% * (-10px * 10px) * alpha * b * g * r',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    cal.hasEtc = true;
    cal.etcMul.push('r');
    const res = cal.multiply();
    assert.strictEqual(res, '-10% * 10px * r', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimDiv.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    assert.strictEqual(res, '-10% / (-10px * 10px) / (alpha * b * g * r)',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimDiv.push('10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r');
    const res = cal.multiply();
    assert.strictEqual(res, '-10% / 10px / r', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, 0, 1 / 10);
    const res = cal.multiply();
    assert.strictEqual(res, '0%', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, Infinity, 1 / 10);
    const res = cal.multiply();
    assert.strictEqual(res, 'Infinity', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, NaN, 1 / 10);
    const res = cal.multiply();
    assert.strictEqual(res, 'NaN', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.dimDiv.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    assert.strictEqual(res,
      '(-10 * -10px * 10px / (-10px * 10px)) * alpha * b * g * r / (alpha * b * g * r)',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.dimDiv.push('10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    assert.strictEqual(res,
      '-10% * (-10px * 10px / 10px) * alpha * b * g * r / (alpha * b * g * r)',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.dimDiv.push('10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    assert.strictEqual(res,
      '(-10 * -10px * 10px / 10px) * alpha * b * g * r / (alpha * b * g * r)',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    assert.strictEqual(res, '(-10 * -10px * 10px) * alpha * b * g * r',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    cal.hasEtc = true;
    cal.etcMul.push('r');
    const res = cal.multiply();
    assert.strictEqual(res, '-100px * r', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimDiv.push('10px', '-10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    assert.strictEqual(res, '(-10 / (-10px * 10px)) / (alpha * b * g * r)',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimMul.push('10px');
    const res = cal.multiply();
    assert.strictEqual(res, '10px', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctMul.push(10, 0, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    const res = cal.multiply();
    assert.strictEqual(res, '0% * 10px', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, NaN, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    const res = cal.multiply();
    assert.strictEqual(res, 'NaN * 10px', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, Infinity, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    const res = cal.multiply();
    assert.strictEqual(res, 'Infinity * 10px', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -Infinity, 1 / 10);
    cal.hasDim = true;
    cal.dimMul.push('10px');
    const res = cal.multiply();
    assert.strictEqual(res, '-Infinity * 10px', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 1 / 10);
    cal.hasDim = true;
    cal.dimDiv.push('10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r');
    const res = cal.multiply();
    assert.strictEqual(res, '(-10 / 10px) / r', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimMul.push('10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r');
    const res = cal.multiply();
    assert.strictEqual(res, '10px / r', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimDiv.push('10px');
    cal.hasEtc = true;
    cal.etcDiv.push('r');
    const res = cal.multiply();
    assert.strictEqual(res, '1 / 10px / r', 'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 1 / 10);
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r', 'g', 'b', 'alpha');
    const res = cal.multiply();
    assert.strictEqual(res, '-10 * alpha * b * g * r / (alpha * b * g * r)',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numMul.push(10, -10, 1 / 10);
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r');
    const res = cal.multiply();
    assert.strictEqual(res, '-10 * alpha * b * g * r / r',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcMul.push('r', 'g', 'b', 'alpha');
    cal.etcDiv.push('r');
    const res = cal.multiply();
    assert.strictEqual(res, 'alpha * b * g * r / r',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcDiv.push('r', 'g');
    const res = cal.multiply();
    assert.strictEqual(res, '1 / (g * r)',
      'result');
  });

  it('should multiply values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcDiv.push('r');
    const res = cal.multiply();
    assert.strictEqual(res, '1 / r',
      'result');
  });

  it('should get null', () => {
    const cal = new Calculator();
    const res = cal.sum();
    assert.strictEqual(res, null, 'result');
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
    assert.strictEqual(res, '10 + 10% + 10px + (b + g + r) - (alpha + r)',
      'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numSum.push(20, Infinity);
    const res = cal.sum();
    assert.strictEqual(res, 'Infinity', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numSum.push(20, NaN);
    const res = cal.sum();
    assert.strictEqual(res, 'NaN', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctSum.push(20, Infinity);
    const res = cal.sum();
    assert.strictEqual(res, 'Infinity', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasPct = true;
    cal.pctSum.push(20, NaN);
    const res = cal.sum();
    assert.strictEqual(res, 'NaN', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimSum.push('30px', '-10px');
    cal.dimSub.push('10px');
    const res = cal.sum();
    assert.strictEqual(res, '10px', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimSum.push('30px', '-10px');
    const res = cal.sum();
    assert.strictEqual(res, '20px', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasDim = true;
    cal.dimSub.push('30px', '-10px');
    const res = cal.sum();
    assert.strictEqual(res, '-20px', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSum.push('r', 'g', 'b');
    cal.etcSub.push('r');
    const res = cal.sum();
    assert.strictEqual(res, 'b + g + r - r', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSum.push('r', 'g', 'b');
    const res = cal.sum();
    assert.strictEqual(res, 'b + g + r', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSub.push('r', 'g', 'b');
    const res = cal.sum();
    assert.strictEqual(res, '-1 * (b + g + r)', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSub.push('r');
    const res = cal.sum();
    assert.strictEqual(res, '-1 * r', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasNum = true;
    cal.numSum.push(1);
    cal.hasEtc = true;
    cal.etcSum.push('r');
    const res = cal.sum();
    assert.strictEqual(res, '1 + r', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSum.push('r');
    const res = cal.sum();
    assert.strictEqual(res, 'r', 'result');
  });

  it('should sum values', () => {
    const cal = new Calculator();
    cal.hasEtc = true;
    cal.etcSub.push('1 * r');
    const res = cal.sum();
    assert.strictEqual(res, '-1 * (1 * r)', 'result');
  });
});

describe('sort calc values', () => {
  const func = csscalc.sortCalcValues;

  it('should get null', () => {
    const res = func();
    assert.strictEqual(res, null, 'result');
  });

  it('should get null', () => {
    const res = func(['calc(', ')']);
    assert.strictEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 1, ')']);
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '*', 0.5, ')']);
    assert.strictEqual(res, 'calc(0.5 * r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '+', 0.5, ')'], true);
    assert.strictEqual(res, 'calc(0.5 + r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '*', 0.5, ')']);
    assert.strictEqual(res, 'calc(0.5 * r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '/', 2, ')']);
    assert.strictEqual(res, 'calc(0.5 * r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '/', '200%', ')']);
    assert.strictEqual(res, 'calc(50% * r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '/', '50vw', ')']);
    assert.strictEqual(res, 'calc(1 / 50vw * r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '/', 'g', ')']);
    assert.strictEqual(res, 'calc(r / g)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '*', '1em', ')']);
    assert.strictEqual(res, 'calc(1em * r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '-', 1, ')'], true);
    assert.strictEqual(res, 'calc(-1 + r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '-', '50%', ')'], true);
    assert.strictEqual(res, 'calc(-50% + r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '-', '1em', ')'], true);
    assert.strictEqual(res, 'calc(-1em + r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '-', 'b', ')'], true);
    assert.strictEqual(res, 'calc(r - b)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '+', 1, ')'], true);
    assert.strictEqual(res, 'calc(1 + r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '+', '50%', ')'], true);
    assert.strictEqual(res, 'calc(50% + r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '+', '1em', ')'], true);
    assert.strictEqual(res, 'calc(1em + r)', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '/', 2, '+', 'r', '*', '50%', ')'], true);
    assert.strictEqual(res, 'calc((0.5 * r) + (50% * r))', 'result');
  });

  it('should get value', () => {
    const res = func(['calc(', 'r', '*', '1', ')'], true);
    assert.strictEqual(res, 'calc(1 * r)', 'result');
  });
});

describe('serialize calc', () => {
  const func = csscalc.serializeCalc;

  beforeEach(() => {
    csscalc.cachedResults.clear();
  });
  afterEach(() => {
    csscalc.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not an array.');
  });

  it('should get value', () => {
    const res = func('red');
    assert.strictEqual(res, 'red', 'result');
  });

  it('should get value', () => {
    const res = func('calc(1)');
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('calc(r * 0.5 - g * 0.5)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc((0.5 * r) - (0.5 * g))', 'result');

    const res2 = func('calc(r * 0.5 + r * 0.5)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res2, 'calc((0.5 * r) + (0.5 * r))', 'result');
  });

  it('should get value', () => {
    const res = func('calc(r * 0.5 + r * 0.5)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc((0.5 * r) + (0.5 * r))', 'result');

    const res2 = func('calc(r * 0.5 + r * 0.5)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res2, 'calc((0.5 * r) + (0.5 * r))', 'result');
  });

  it('should get value', () => {
    const res = func('calc((r * 0.5) + (r * 0.5))', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc((0.5 * r) + (0.5 * r))', 'result');

    const res2 = func('calc((r * 0.5) + (r * 0.5))', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res2, 'calc((0.5 * r) + (0.5 * r))', 'result');
  });

  it('should get value', () => {
    const res = func('calc(r * sign(2px))', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1 * r)', 'result');

    const res2 = func('calc(r * sign(2px))', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res2, 'calc(1 * r)', 'result');
  });
});

describe('resolve dimension', () => {
  const func = csscalc.resolveDimension;

  beforeEach(() => {
    csscalc.cachedResults.clear();
  });
  afterEach(() => {
    csscalc.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not an array.');
  });

  it('should get null', () => {
    const res = func([]);
    assert.strictEqual(res, null, 'result');
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
        unit: undefined
      }
    ];
    const res = func(token);
    assert.strictEqual(res, null, 'result');
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
        unit: 'em'
      }
    ];
    const res = func(token);
    assert.strictEqual(res, null, 'result');
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
        unit: 'em'
      }
    ];
    const res = func(token);
    assert.strictEqual(res, null, 'result');
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
        unit: 'px'
      }
    ];
    const res = func(token);
    assert.strictEqual(res, '100px', 'result');
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
        unit: 'em'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 16
      }
    });
    assert.strictEqual(res, '1600px', 'result');
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
        unit: 'em'
      }
    ];
    const unitMap = {
      em: 12,
      rem: 16,
      vw: 10.26
    };
    const resolver = arg => unitMap[arg];
    const res = func(token, {
      dimension: {
        callback: resolver
      }
    });
    assert.strictEqual(res, '1200px', 'result');
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
        unit: 'ch'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
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
        unit: 'ex'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
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
        unit: 'lh'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
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
        unit: 'rch'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
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
        unit: 'rex'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
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
        unit: 'rlh'
      }
    ];
    const res = func(token, {
      dimension: {
        em: 12,
        rem: 16,
        vw: 10.26
      }
    });
    assert.strictEqual(res, null, 'result');
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
        unit: 'em'
      }
    ];
    const res = func(token, {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, null, 'result');
  });
});

describe('parse tokens', () => {
  const func = csscalc.parseTokens;

  beforeEach(() => {
    csscalc.cachedResults.clear();
  });
  afterEach(() => {
    csscalc.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not an array.');
  });

  it('should throw', () => {
    assert.throws(() => func(['foo']), TypeError, 'foo is not an array.');
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
        { value: 50, signCharacter: undefined }
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
          unit: 'em'
        }
      ],
      ['whitespace-token', ' ', 60, 60, undefined],
      ['delim-token', '-', 61, 61, { value: '-' }],
      ['whitespace-token', ' ', 62, 62, undefined],
      [
        'dimension-token',
        '1px',
        63,
        65,
        { value: 1, signCharacter: undefined, type: 'integer', unit: 'px' }
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
        { value: 10, signCharacter: undefined }
      ],
      [')-token', ')', 73, 73, undefined],
      [')-token', ')', 74, 74, undefined],
      ['comma-token', ',', 75, 75, undefined],
      ['whitespace-token', ' ', 76, 76, undefined],
      ['ident-token', 'blue', 77, 80, { value: 'blue' }],
      [')-token', ')', 81, 81, undefined],
      ['EOF-token', '', -1, -1, undefined]
    ];
    const res = func(tokens);
    assert.deepEqual(res, [
      'color-mix(', 'in', ' ', 'srgb', ',', ' ', 'red', ' ', 'calc(', '50%',
      ' ', '+', ' ', '(', 'sign(', '100em', ' ', '-', ' ', '1px', ')', ' ',
      '*', ' ', '10%', ')', ')', ',', ' ', 'blue', ')'
    ], 'result');
  });

  it('should get value', () => {
    const tokens = [
      ['whitespace-token', ' ', 12, 12, undefined],
      [')-token', ')', 66, 66, undefined],
      ['whitespace-token', ' ', 67, 67, undefined],
      [')-token', ')', 73, 73, undefined],
    ];
    const res = func(tokens);
    assert.deepEqual(res, [
      ')',
      ')'
    ], 'result');
  });
});

describe('resolve CSS calc()', () => {
  const func = csscalc.cssCalc;

  beforeEach(() => {
    csscalc.cachedResults.clear();
  });
  afterEach(() => {
    csscalc.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError, 'undefined is not a string.');
  });

  it('should throw', () => {
    assert.throws(() => func('var(--foo)'), SyntaxError,
      'Unexpected token var( found.');
  });

  it('should get value', () => {
    const res = func('var(--foo)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'var(--foo)', 'result');
  });

  it('should get value', () => {
    const res = func('');
    assert.strictEqual(res, '', 'result');
  });

  it('should get value', () => {
    const res = func('foo');
    assert.strictEqual(res, 'foo', 'result');
  });

  it('should get value', () => {
    const res = func('color-mix(in srgb, red calc( /* comment */ 50% + (sign(100em - 1px) * 10%)), blue)', {
      dimension: {
        em: 16
      }
    });
    assert.strictEqual(res, 'color-mix(in srgb, red 60%, blue)', 'result');

    const res2 = func('color-mix(in srgb, red calc( /* comment */ 50% + (sign(100em - 1px) * 10%)), blue)', {
      dimension: {
        em: 16
      }
    });
    assert.strictEqual(res2, 'color-mix(in srgb, red 60%, blue)', 'result');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50% + (sign(100em - 1px) * 10%))', {
      dimension: {
        em: 16
      }
    });
    assert.strictEqual(res, '60%', 'result');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50% + (sign(100em - 1px) * 10%))', {
      dimension: {
        em: 16
      },
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(60%)', 'result');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50em * calc(2 / 3))', {
      dimension: {
        em: 16
      }
    });
    assert.strictEqual(res, '533.333px', 'result');
  });

  it('should get value', () => {
    const res = func('calc( /* comment */ 50em * calc(2 / 3))', {
      dimension: {
        em: 16
      },
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(33.3333em)', 'result');
  });

  it('should get value', () => {
    const res = func('calc(100% - 100px)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(100% - 100px)', 'result');
  });

  it('should get value', () => {
    const res = func('abs(sign(-0.5) * 2px / 3)');
    assert.strictEqual(res, '0.666667px', 'result');
  });

  it('should get value', () => {
    const res = func('acos(1)');
    assert.strictEqual(res, '0deg', 'result');
  });

  it('should get value', () => {
    const res = func('acos(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0deg)', 'result');
  });

  it('should get value', () => {
    const res = func('acos(-1)');
    assert.strictEqual(res, '180deg', 'result');
  });

  it('should get value', () => {
    const res = func('acos(-1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(180deg)', 'result');
  });

  it('should get value', () => {
    const res = func('acos(-1.5)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(NaN * 1deg)', 'result');
  });

  it('should get value', () => {
    const res = func('asin(1)');
    assert.strictEqual(res, '90deg', 'result');
  });

  it('should get value', () => {
    const res = func('asin(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(90deg)', 'result');
  });

  it('should get value', () => {
    const res = func('asin(-1)');
    assert.strictEqual(res, '-90deg', 'result');
  });

  it('should get value', () => {
    const res = func('asin(-1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(-90deg)', 'result');
  });

  it('should get value', () => {
    const res = func('asin(-1.5)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(NaN * 1deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan(1)');
    assert.strictEqual(res, '45deg', 'result');
  });

  it('should get value', () => {
    const res = func('atan(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(45deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan(-1)');
    assert.strictEqual(res, '-45deg', 'result');
  });

  it('should get value', () => {
    const res = func('atan(-1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(-45deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan(infinity)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(90deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan2(37.320508075, 10)');
    assert.strictEqual(res, '75deg', 'result');
  });

  it('should get value', () => {
    const res = func('atan2(37.320508075, 10)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(75deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan2(1s, 1000ms)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(45deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan2(infinity, infinity)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(45deg)', 'result');
  });

  it('should get value', () => {
    const res = func('atan2(-infinity, -infinity)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(-135deg)', 'result');
  });

  it('should get value', () => {
    const res = func('calc(asin(sin(pi/2)))');
    assert.strictEqual(res, '90deg', 'result');
  });

  it('should get value', () => {
    const res = func('calc(asin(sin(30deg + 1.0471967rad ) ))');
    assert.strictEqual(res, '90deg', 'result');
  });

  it('should get value', () => {
    const res = func('cos(0)');
    assert.strictEqual(res, '1', 'result');
  });

  it('should get value', () => {
    const res = func('cos(0)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('sin(0)');
    assert.strictEqual(res, '0', 'result');
  });

  it('should get value', () => {
    const res = func('sin(0)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0)', 'result');
  });

  it('should get value', () => {
    const res = func('tan(0)');
    assert.strictEqual(res, '0', 'result');
  });

  it('should get value', () => {
    const res = func('tan(0)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0)', 'result');
  });

  it('should get value', () => {
    const res = func('sin(30deg)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('cos(60deg)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0.5)', 'result');
  });

  it('should get value', () => {
    const res = func('tan(45deg)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('clamp(1px, 2px, 3px)');
    assert.strictEqual(res, '2px', 'result');
  });

  it('should get value', () => {
    const res = func('clamp(1px, 2px, 3px)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(2px)', 'result');
  });

  it('should get value', () => {
    const res = func('clamp(30px, 100px, 20px)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(30px)', 'result');
  });

  it('should get value', () => {
    const res = func('clamp(1px, 1em, 1vh)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'clamp(1px, 1em, 1vh)', 'result');
  });

  it('should get value', () => {
    const res = func('exp(0)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('log(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0)', 'result');
  });

  it('should get value', () => {
    const res = func('pow(1, 1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('hypot(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('sqrt(1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('round(1.1, 1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1)', 'result');
  });

  it('should get value', () => {
    const res = func('mod(1, 1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0)', 'result');
  });

  it('should get value', () => {
    const res = func('rem(1, 1)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(0)', 'result');
  });

  it('should get value', () => {
    const res = func('min(1px, 2px)');
    assert.strictEqual(res, '1px', 'result');
  });

  it('should get value', () => {
    const res = func('min(1px, 2px)', {
      format: 'specifiedValue'
    });
    assert.strictEqual(res, 'calc(1px)', 'result');
  });
});
