/**
 * constant.test.js
 */

import { describe, expect, it } from 'vitest';
import * as constant from '../src/js/constant.js';

describe('constants', () => {
  const items = Object.entries(constant);
  for (const [key, value] of items) {
    it('should get string, number or array', () => {
      expect(/^[A-Z][A-Z_\d]+$/.test(key)).toBe(true);
      expect(typeof value).toBe('string');
    });
  }
});
