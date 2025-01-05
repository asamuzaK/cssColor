export function resolveColorChannels(tokens: Array<any[]>, opt?: object): Array<string>;
export function extractOriginColor(value: string, opt?: {
    currentColor?: string;
}): string | null;
export function resolveRelativeColor(value: string, opt?: {
    format?: string;
}): string | null;
export const cachedResults: LRUCache<{}, {}, unknown>;
import { LRUCache } from 'lru-cache';
