export function resolve(color: string, opt?: {
    currentColor?: string;
    format?: string;
    key?: any;
}): (string | any[]) | null;
export function parse(value: string, opt?: {
    d50?: boolean;
}): Array<number>;
export namespace convert {
    export { convertRgbToHex as rgbToHex };
    export { convertXyzD50ToLab as xyzD50ToLab };
    export { convertXyzD50ToLch as xyzD50ToLch };
    export { convertXyzToHex as xyzToHex };
    export { convertXyzToHsl as xyzToHsl };
    export { convertXyzToHwb as xyzToHwb };
    export { convertXyzToOklab as xyzToOklab };
    export { convertXyzToOklch as xyzToOklch };
    export { convertXyzToRgb as xyzToRgb };
    export { convertXyzToXyzD50 as xyzToXyzD50 };
}
import { convertRgbToHex } from './js/color.js';
import { convertXyzD50ToLab } from './js/color.js';
import { convertXyzD50ToLch } from './js/color.js';
import { convertXyzToHex } from './js/color.js';
import { convertXyzToHsl } from './js/color.js';
import { convertXyzToHwb } from './js/color.js';
import { convertXyzToOklab } from './js/color.js';
import { convertXyzToOklch } from './js/color.js';
import { convertXyzToRgb } from './js/color.js';
import { convertXyzToXyzD50 } from './js/color.js';
