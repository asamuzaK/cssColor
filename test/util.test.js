/**
 * util.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { describe, it } from 'mocha';

/* test */
import * as util from '../src/js/util.js';

describe('stringify options', () => {
  const func = util.stringifyOptions;

  it('should get result', () => {
    const res = func();
    assert.strictEqual(res, '{}', 'result');
  });

  it('should get result', () => {
    const res = func('foo');
    assert.strictEqual(res, '"foo"', 'result');
  });

  it('should get result', () => {
    const res = func({
      foo: 'bar'
    });
    assert.strictEqual(res, '{"foo":"bar"}', 'result');
  });

  it('should get result', () => {
    const opt = {
      foo: 'bar',
      cssCalc: {
        globals: new Map([
          ['bar', 'baz'],
          ['qux', 1]
        ])
      }
    };
    const res = func(opt);
    assert.strictEqual(opt.cssCalc.globals instanceof Map, true, 'map');
    assert.strictEqual(res,
      '{"foo":"bar","cssCalc":{"globals":[["bar","baz"],["qux",1]]}}',
      'result');
  });
});
