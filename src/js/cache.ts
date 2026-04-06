/**
 * cache
 */

import { Options } from './typedef';

/* numeric constants */
const MAX_CACHE = 4096;

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

/**
 * Generational Cache implementation
 */
export class GenerationalCache<K, V> {
  private max: number;
  private current: Map<K, V>;
  private old: Map<K, V>;

  constructor(max: number) {
    this.max = Math.ceil(max / 2);
    this.current = new Map<K, V>();
    this.old = new Map<K, V>();
  }

  get(key: K): V | undefined {
    let value = this.current.get(key);
    if (value !== undefined) {
      return value;
    }

    value = this.old.get(key);
    if (value !== undefined) {
      this.set(key, value);
      return value;
    }

    return undefined;
  }

  set(key: K, value: V): void {
    this.current.set(key, value);

    if (this.current.size >= this.max) {
      this.old = this.current;
      this.current = new Map<K, V>();
    }
  }

  has(key: K): boolean {
    return this.current.has(key) || this.old.has(key);
  }

  delete(key: K): void {
    this.current.delete(key);
    this.old.delete(key);
  }

  clear(): void {
    this.current.clear();
    this.old.clear();
  }
}

/*
 * generational cache instance
 */
export const genCache = new GenerationalCache<string, CacheItem>(MAX_CACHE);

/**
 * set cache
 * @param key - cache key
 * @param value - value to cache
 * @returns void
 */
export const setCache = (key: string, value: unknown): void => {
  if (key) {
    if (value === null) {
      genCache.set(key, new NullObject());
    } else if (value instanceof CacheItem) {
      genCache.set(key, value);
    } else {
      genCache.set(key, new CacheItem(value));
    }
  }
};

/**
 * get cache
 * @param key - cache key
 * @returns cached item or false otherwise
 */
export const getCache = (key: string): CacheItem | boolean => {
  if (key && genCache.has(key)) {
    const item = genCache.get(key);
    if (item instanceof CacheItem) {
      return item;
    }
    // delete unexpected cached item
    genCache.delete(key);
    return false;
  }
  return false;
};

/**
 * create cache key
 * @param keyData - key data
 * @param [opt] - options
 * @returns cache key
 */
export const createCacheKey = (
  keyData: Record<string, string>,
  opt: Options = {}
): string => {
  const { customProperty = {}, dimension = {} } = opt;
  if (
    !keyData ||
    Object.keys(keyData).length === 0 ||
    typeof customProperty.callback === 'function' ||
    typeof dimension.callback === 'function'
  ) {
    return '';
  }
  const baseKey = `${keyData.namespace || ''}:${keyData.name || ''}:${keyData.value || ''}`;
  const optStr = [
    opt.format || '',
    opt.colorSpace || '',
    opt.colorScheme || '',
    opt.currentColor || '',
    opt.d50 ? '1' : '0',
    opt.nullable ? '1' : '0',
    opt.preserveComment ? '1' : '0',
    String(opt.delimiter || '')
  ].join('|');
  const customPropStr = Object.keys(customProperty).length
    ? JSON.stringify(customProperty)
    : '';
  const dimStr = Object.keys(dimension).length ? JSON.stringify(dimension) : '';
  return `${baseKey}::${optStr}::${customPropStr}::${dimStr}`;
};
