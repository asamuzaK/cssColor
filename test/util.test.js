/**
 * util.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { describe, it } from 'mocha';

/* test */
import * as util from '../src/js/util.js';

describe('is color', () => {
  const func = util.isColor;

  it('should get result', () => {
    const res = func();
    assert.strictEqual(res, false, 'result');
  });

  it('should get result', () => {
    const res = func('foo');
    assert.strictEqual(res, false, 'result');
  });

  it('should get result', () => {
    const res = func('red');
    assert.strictEqual(res, true, 'result');
  });

  it('should get result', () => {
    const res = func('currentcolor');
    assert.strictEqual(res, true, 'result');
  });

  it('should get result', () => {
    const res = func('transparent');
    assert.strictEqual(res, true, 'result');
  });

  it('should get result', () => {
    const res = func('color(srgb 0 127.5 0)');
    assert.strictEqual(res, true, 'result');
  });

  it('should get result', () => {
    const res = func('color-mix(in oklab, red, blue)');
    assert.strictEqual(res, true, 'result');
  });
});

describe('value to JSON string', () => {
  const func = util.valueToJsonString;

  it('should get result', () => {
    const res = func();
    assert.strictEqual(res, '', 'result');
  });

  it('should get result', () => {
    const res = func(null);
    assert.strictEqual(res, 'null', 'result');
  });

  it('should get result', () => {
    const res = func('foo');
    assert.strictEqual(res, '"foo"', 'result');
  });

  it('should get result', () => {
    const res = func({
      foo: 'bar',
      baz: undefined
    });
    assert.strictEqual(res, '{"foo":"bar","baz":null}', 'result');
  });

  it('should get result', () => {
    const res = func({
      foo: 'bar',
      map: new Map([['key1', 1], ['key2', true], ['key1', 3]]),
      set: new Set([1, 'baz', 3, 2, 3, 'baz']),
    });
    assert.strictEqual(res,
      '{"foo":"bar","map":[["key1",3],["key2",true]],"set":[1,"baz",3,2]}',
      'result');
  });

  it('should get result', () => {
    const res = func({
      foo: 'bar',
      func: () => {}
    });
    assert.strictEqual(res, '{"foo":"bar","func":"func"}', 'result');
  });

  it('should get result', () => {
    const res = func({
      foo: 'bar',
      func: () => {}
    }, true);
    assert.strictEqual(res, '{"foo":"bar","func":"() => {}"}', 'result');
  });

  it('should get result', () => {
    const myCallback = () => {};
    const res = func({
      foo: 'bar',
      func: myCallback
    });
    assert.strictEqual(res, '{"foo":"bar","func":"myCallback"}', 'result');
  });

  it('should get result', () => {
    const myCallback = () => {};
    const res = func({
      foo: 'bar',
      func: myCallback
    }, true);
    assert.strictEqual(res, '{"foo":"bar","func":"() => {}"}', 'result');
  });

  it('should get result', () => {
    const res = func({
      foo: 'bar',
      big: 1n
    });
    assert.strictEqual(res, '{"foo":"bar","big":"1"}', 'result');
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
