export function validateColorComponents(arr: any[], opt?: {
    alpha?: boolean;
    minLength?: number;
    maxLength?: number;
    minRange?: number;
    maxRange?: number;
    validateRange?: boolean;
}): any[];
export function transformMatrix(mtx: Array<Array<number>>, vct: Array<number>, skip?: boolean): Array<number>;
export function reInsertMissingColorComponents(value: string, color?: any[]): Array<number | string>;
export function normalizeColorComponents(colorA: any[], colorB: any[], skip?: boolean): Array<Array<number>>;
export function numberToHexString(value: number): string;
export function angleToDeg(angle: string): number;
export function parseAlpha(a?: string | null): number;
export function parseHexAlpha(value: string): number;
export function convertRgbToLinearRgb(rgb: Array<number>, skip?: boolean): Array<number>;
export function convertRgbToXyz(rgb: Array<number>, skip?: boolean): Array<number>;
export function convertRgbToXyzD50(rgb: Array<number>): Array<number>;
export function convertRgbToHex(rgb: Array<number>): string;
export function convertLinearRgbToRgb(rgb: Array<number>, round?: boolean): Array<number>;
export function convertLinearRgbToHex(rgb: Array<number>, skip?: boolean): string;
export function convertXyzToHex(xyz: Array<number>): string;
export function convertXyzD50ToHex(xyz: Array<number>): string;
export function convertXyzToRgb(xyz: Array<number>, skip?: boolean): Array<number>;
export function convertXyzToXyzD50(xyz: Array<number>): Array<number>;
export function convertXyzToHsl(xyz: Array<number>, skip?: boolean): Array<number>;
export function convertXyzToHwb(xyz: Array<number>, skip?: boolean): Array<number>;
export function convertXyzToOklab(xyz: Array<number>, skip?: boolean): Array<number>;
export function convertXyzToOklch(xyz: Array<number>, skip?: boolean): Array<number>;
export function convertXyzD50ToRgb(xyz: Array<number>, skip?: boolean): Array<number>;
export function convertXyzD50ToLab(xyz: Array<number>, skip?: boolean): Array<number>;
export function convertXyzD50ToLch(xyz: Array<number>, skip?: boolean): Array<number>;
export function convertHexToRgb(value: string): Array<number>;
export function convertHexToLinearRgb(value: string): Array<number>;
export function convertHexToXyz(value: string): Array<number>;
export function parseRgb(value: string): Array<string | number>;
export function parseHsl(value: string, opt?: {
    format?: string;
}): Array<string | number>;
export function parseHwb(value: string, opt?: {
    format?: string;
}): Array<string | number>;
export function parseLab(value: string, opt?: {
    format?: string;
}): Array<string | number>;
export function parseLch(value: string, opt?: {
    format?: string;
}): Array<number>;
export function parseOklab(value: string, opt?: {
    format?: string;
}): Array<number>;
export function parseOklch(value: string, opt?: {
    format?: string;
}): Array<number>;
export function parseColorFunc(value: string, opt?: {
    d50?: boolean;
    format?: string;
}): Array<string | number>;
export function parseColorValue(value: string, opt?: {
    d50?: boolean;
    format?: string;
}): Array<number>;
export function resolveColorValue(value: string, opt?: {
    format?: string;
}): Array<string | number>;
export function resolveColorFunc(value: string, opt?: {
    format?: string;
}): Array<number>;
export function convertColorToLinearRgb(value: string, opt?: object): Array<number>;
export function convertColorToRgb(value: string, opt?: object): Array<number>;
export function convertColorToXyz(value: string, opt?: {
    d50?: boolean;
}): Array<number>;
export function convertColorToHsl(value: string, opt?: object): Array<number>;
export function convertColorToHwb(value: string, opt?: object): Array<number>;
export function convertColorToLab(value: string, opt?: object): Array<number>;
export function convertColorToLch(value: string, opt?: object): Array<number>;
export function convertColorToOklab(value: string, opt?: object): Array<number>;
export function convertColorToOklch(value: string, opt?: object): Array<number>;
export function resolveColorMix(value: string, opt?: {
    format?: string;
}): Array<number>;
