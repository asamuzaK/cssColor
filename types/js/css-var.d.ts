export function resolveCssVariable(tokens: Array<any[]>, opt?: {
    customProperty?: object;
}): Array<string | any[] | undefined>;
export function parseTokens(tokens: Array<any[]>, opt?: object): Array<any[]> | null;
export function cssVar(value: string, opt?: object): string | null;
export const cachedResults: LRUCache<{}, {}, unknown>;
export function isColor(value: string): boolean;
import { LRUCache } from 'lru-cache';