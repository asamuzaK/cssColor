export const cachedResults: LRUCache<{}, {}, unknown>;
export function resolve(color: string, opt?: {
    currentColor?: string;
    format?: string;
    key?: any;
}): (string | any[]) | null;
import { LRUCache } from 'lru-cache';
