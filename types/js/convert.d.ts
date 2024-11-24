export const cachedResults: LRUCache<{}, {}, unknown>;
export function preProcess(value: string): string;
export function numberToHex(value: number): string;
export function colorToHex(value: string, opt?: {
    alpha?: boolean;
}): string;
export function colorToHsl(value: string): Array<number>;
export function colorToHwb(value: string): Array<number>;
export function colorToLab(value: string): Array<number>;
export function colorToLch(value: string): Array<number>;
export function colorToOklab(value: string): Array<number>;
export function colorToOklch(value: string): Array<number>;
export function colorToRgb(value: string): Array<number>;
export function colorToXyz(value: string, opt?: {
    d50?: boolean;
}): Array<number>;
export function colorToXyzD50(value: string): Array<number>;
export namespace convert {
    export { colorToHex };
    export { colorToHsl };
    export { colorToHwb };
    export { colorToLab };
    export { colorToLch };
    export { colorToOklab };
    export { colorToOklch };
    export { colorToRgb };
    export { colorToXyz };
    export { colorToXyzD50 };
    export { numberToHex };
}
import { LRUCache } from 'lru-cache';
