/**
 * constant.test
 */

/* api */
import { assert, describe, it } from 'vitest';

/* test */
import * as constant from '../src/js/constant.js';

describe('constants', () => {
  const items = Object.entries(constant);
  for (const [key, value] of items) {
    it('should get string', () => {
      assert.strictEqual(/^[A-Z][A-Z_\d]+$/.test(key), true, 'key');
      assert.strictEqual(typeof value, 'string', 'value');
    });
  }
});
