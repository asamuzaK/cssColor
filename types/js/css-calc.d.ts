export const cachedResults: LRUCache<{}, {}, unknown>;
export function resolveDimension(token: any[], opt?: {
    dimension?: object;
}): string | null;
export function parseTokens(tokens: Array<any[]>, opt?: object): Array<string>;
export function cssCalc(value: string, opt?: {
    dimension?: object;
    format?: string;
}): string | null;
import { LRUCache } from 'lru-cache';
