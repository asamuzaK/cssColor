/**
 * issue.test.js
 */

/* api */
import { assert, describe, it } from 'vitest';

/* test */
import { convert, resolve, resolveGradient, utils } from '../src/index.js';

describe('#161', () => {
  it('should get results', () => {
    const input = 'rgb(00, 51, 102)';
    const resolved = resolve(input);
    const validated = utils.isColor(input);
    const converted = convert.colorToRgb(input);
    assert.strictEqual(resolved, 'rgb(0, 51, 102)', `resolve ${input}`);
    assert.strictEqual(validated, true, `validate ${input}`);
    assert.deepEqual(converted, [0, 51, 102, 1], `convert ${input}`);
  });

  it('should get results', () => {
    const input = 'hsl(000 100% 50%)';
    const resolved = resolve(input);
    const validated = utils.isColor(input);
    const converted = convert.colorToRgb(input);
    assert.strictEqual(resolved, 'rgb(255, 0, 0)', `resolve ${input}`);
    assert.strictEqual(validated, true, `validate ${input}`);
    assert.deepEqual(converted, [255, 0, 0, 1], `convert ${input}`);
  });

  it('should get results', () => {
    const input = 'rgb(255 0 0 / 00.5)';
    const resolved = resolve(input);
    const validated = utils.isColor(input);
    const converted = convert.colorToRgb(input);
    assert.strictEqual(resolved, 'rgba(255, 0, 0, 0.5)', `resolve ${input}`);
    assert.strictEqual(validated, true, `validate ${input}`);
    assert.deepEqual(converted, [255, 0, 0, 0.5], `convert ${input}`);
  });

  it('should get results', () => {
    const input = 'rgb(1e+2 0 0)';
    const resolved = resolve(input);
    const validated = utils.isColor(input);
    const converted = convert.colorToRgb(input);
    assert.strictEqual(resolved, 'rgb(100, 0, 0)', `resolve ${input}`);
    assert.strictEqual(validated, true, `validate ${input}`);
    assert.deepEqual(converted, [100, 0, 0, 1], `convert ${input}`);
  });

  it('should get results', () => {
    const input = 'rgb(1e2 0 0)';
    const resolved = resolve(input);
    const validated = utils.isColor(input);
    const converted = convert.colorToRgb(input);
    assert.strictEqual(resolved, 'rgb(100, 0, 0)', `resolve ${input}`);
    assert.strictEqual(validated, true, `validate ${input}`);
    assert.deepEqual(converted, [100, 0, 0, 1], `convert ${input}`);
  });

  it('should get results', () => {
    const input = 'rgb(/* R */ 0, /* G */ 51, /* B */ 255)';
    const resolved = resolve(input);
    const validated = utils.isColor(input);
    const converted = convert.colorToRgb(input);
    assert.strictEqual(resolved, 'rgb(0, 51, 255)', `resolve ${input}`);
    assert.strictEqual(validated, true, `validate ${input}`);
    assert.deepEqual(converted, [0, 51, 255, 1], `convert ${input}`);
  });

  it('should get results', () => {
    const input =
      'linear-gradient(rgb(/* R */ 0, /* G */ 51, /* B */ 255), #fff)';
    const resolved = resolveGradient(input);
    assert.strictEqual(
      resolved,
      'linear-gradient(rgb(0, 51, 255), rgb(255, 255, 255))',
      `resolve ${input}`
    );
  });

  it('should get results', () => {
    const input = 'color(srgb 00.5 0 0)';
    const resolved = resolve(input);
    const validated = utils.isColor(input);
    const converted = convert.colorToRgb(input);
    assert.strictEqual(resolved, 'color(srgb 0.5 0 0)', `resolve ${input}`);
    assert.strictEqual(validated, true, `validate ${input}`);
    assert.deepEqual(converted, [127.5, 0, 0, 1], `convert ${input}`);
  });

  it('should get results', () => {
    const input = 'color(srgb 1e+0 0 0)';
    const resolved = resolve(input);
    const validated = utils.isColor(input);
    const converted = convert.colorToRgb(input);
    assert.strictEqual(resolved, 'color(srgb 1 0 0)', `resolve ${input}`);
    assert.strictEqual(validated, true, `validate ${input}`);
    assert.deepEqual(converted, [255, 0, 0, 1], `convert ${input}`);
  });
});
