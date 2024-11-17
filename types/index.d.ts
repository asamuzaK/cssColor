export { convert } from "./js/convert.js";
export const cachedResults: LRUCache<{}, {}, unknown>;
export function resolve(color: string, opt?: {
    currentColor?: string;
    format?: string;
    key?: any;
}): (string | any[]) | null;
export function parse(value: string, opt?: {
    d50?: boolean;
}): Array<number>;
import { LRUCache } from 'lru-cache';
