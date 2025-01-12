declare function numberToHex(value: number): string;
declare function colorToHex(value: string, opt?: {
    alpha?: boolean;
    customProperty?: object;
    dimension?: object;
}): string | null;
declare function colorToHsl(value: string, opt?: {
    customProperty?: object;
    dimension?: object;
}): Array<number>;
declare function colorToHwb(value: string, opt?: {
    customProperty?: object;
    dimension?: object;
}): Array<number>;
declare function colorToLab(value: string, opt?: {
    customProperty?: object;
    dimension?: object;
}): Array<number>;
declare function colorToLch(value: string, opt?: {
    customProperty?: object;
    dimension?: object;
}): Array<number>;
declare function colorToOklab(value: string, opt?: {
    customProperty?: object;
    dimension?: object;
}): Array<number>;
declare function colorToOklch(value: string, opt?: {
    customProperty?: object;
    dimension?: object;
}): Array<number>;
declare function colorToRgb(value: string, opt?: {
    customProperty?: object;
    dimension?: object;
}): Array<number>;
declare function colorToXyz(value: string, opt?: {
    customProperty?: object;
    d50?: object;
    dimension?: object;
}): Array<number>;
declare function colorToXyzD50(value: string, opt?: {
    customProperty?: object;
    dimension?: object;
}): Array<number>;
declare namespace convert {
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

declare function cssCalc(value: string, opt?: {
    dimension?: object;
    format?: string;
}): string | null;

declare function resolve(color: string, opt?: {
    currentColor?: string;
    customProperty?: object;
    dimension?: object;
    format?: string;
    key?: any;
}): (string | any[]) | null;

declare function isColor(value: string): boolean;

export { convert, cssCalc, isColor, resolve };
