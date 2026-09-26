/**
 * typedef
 */

/* type definitions */
/**
 * @typedef Options - options
 * @property [alpha] - enable alpha channel
 * @property [colorSpace] - color space
 * @property [currentColor] - color for currentcolor
 * @property [customProperty] - custom properties
 * @property [d50] - white point in d50
 * @property [delimiter] - delimiter
 * @property [dimension] - dimension
 * @property [format] - output format
 * @property [maxLength] - max length
 * @property [nullable] - nullable
 * @property [preserveComment] - preserve comment
 */
export interface Options {
  alpha?: boolean;
  colorScheme?: string;
  colorSpace?: string;
  currentColor?: string;
  customProperty?: Record<string, string | ((K: string) => string)>;
  d50?: boolean;
  delimiter?: string | string[];
  dimension?: Record<string, number | ((K: string) => number)>;
  format?: string;
  maxLength?: number;
  nullable?: boolean;
  preserveComment?: boolean;
}

/**
 * @type TriColorChannels - color channels without alpha
 */
export type TriColorChannels = [x: number, y: number, z: number];

/**
 * @type ReadonlyTriColorChannels - readonly color channels without alpha
 */
export type ReadonlyTriColorChannels = readonly [
  x: number,
  y: number,
  z: number
];

/**
 * @type ReadonlyColorMatrix - readonly color matrix
 */
export type ReadonlyColorMatrix = readonly [
  r1: ReadonlyTriColorChannels,
  r2: ReadonlyTriColorChannels,
  r3: ReadonlyTriColorChannels
];

/**
 * @type ColorChannels - color channels
 */
export type ColorChannels = [x: number, y: number, z: number, alpha: number];

/**
 * @type StringColorChannels - color channels
 */
export type StringColorChannels = [
  x: string,
  y: string,
  z: string,
  alpha: string | undefined
];

/**
 * @type NumStrColorChannels - string or numeric color channels
 */
export type NumStrColorChannels = [
  x: number | string,
  y: number | string,
  z: number | string,
  alpha: number | string
];

/**
 * @type StringColorSpacedChannels - specified value
 */
export type StringColorSpacedChannels = [
  cs: string,
  x: string,
  y: string,
  z: string,
  alpha: string | undefined
];

/**
 * @type ComputedColorChannels - computed value
 */
export type ComputedColorChannels = [
  cs: string,
  x: number,
  y: number,
  z: number,
  alpha: number
];

/**
 * @type SpecifiedColorChannels - specified value
 */
export type SpecifiedColorChannels = [
  cs: string,
  x: number | string,
  y: number | string,
  z: number | string,
  alpha: number | string
];

/**
 * @type MatchedRegExp - matched regexp array
 */
export type MatchedRegExp = [
  match: string,
  gr1: string,
  gr2: string,
  gr3: string,
  gr4: string
];

/* css gradients */
/**
 * @typedef Gradient - parsed CSS gradient
 * @property value - input value
 * @property type - gradient type
 * @property [gradientLine] - gradient line
 * @property colorStopList - list of color stops
 */
export interface Gradient {
  value: string;
  type: string;
  gradientLine?: string;
  colorStopList: ColorStopList;
}

/**
 * @typedef ValidateColorStops - validate color stops
 * @property colorStops - list of color stops
 * @property valid - result
 */
export interface ValidateColorStops {
  colorStops: string[];
  valid: boolean;
}

/**
 * @typedef ValidateGradientLine - validate gradient line
 * @property line - gradient line
 * @property valid - result
 */
export interface ValidateGradientLine {
  line: string;
  valid: boolean;
}

/**
 * @type ColorStopList - list of color stops
 */
export type ColorStopList = [string, string, ...string[]];
