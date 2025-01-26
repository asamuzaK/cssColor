/**
 * cache
 */

export { LRUCache } from 'lru-cache';

/**
 * CacheItem
 */
export class CacheItem {
  /* private */
  #isNull: boolean;
  #item: unknown;

  /**
   * constructor
   */
  constructor(item: unknown, isNull: boolean = false) {
    this.#item = item;
    this.#isNull = !!isNull;
  }

  get item() {
    return this.#item;
  }

  get isNull() {
    return this.#isNull;
  }
}

/**
 * NullObject
 */
export class NullObject extends CacheItem {
  /**
   * constructor
   */
  constructor() {
    super(Symbol('null'), true);
  }
}
