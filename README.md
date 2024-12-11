# CSS color

[![build](https://github.com/asamuzaK/cssColor/actions/workflows/node.js.yml/badge.svg)](https://github.com/asamuzaK/cssColor/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/asamuzaK/cssColor/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/asamuzaK/cssColor/actions/workflows/github-code-scanning/codeql)
[![npm (scoped)](https://img.shields.io/npm/v/@asamuzakjp/css-color)](https://www.npmjs.com/package/@asamuzakjp/css-color)

Resolve and convert CSS colors.


## Install

```console
npm i @asamuzakjp/css-color
```


## Usage

```javascript
import { convert, resolve } from '@asamuzakjp/css-color';

const resolvedValue =
  resolve('color-mix(in oklab, rgb(255 0 0), color(srgb 0 0.5 0 / 0.5))');
// 'oklab(0.5914 0.103273 0.119688 / 0.75)'

const convertedValue = covert.colorToHex('lab(46.2775% -47.5621 48.5837)');
// '#008000'
```

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### resolve(color, opt)

resolves CSS color

#### Parameters

*   `color` **[string][133]** color value
    *   system colors are not supported

*   `opt` **[object][135]?** options (optional, default `{}`)
    *   `opt.currentColor` **[string][133]?** color to use for `currentcolor` keyword
    *   `opt.cssCalc` **[object][135]?** options for [@csstools/css-calc](https://www.npmjs.com/package/@csstools/css-calc), e.g. `cssCalc: { globals: new Map([['foo', 'bar'], ['baz', 1]]) }`
    *   `opt.customProperty` **[object][135]?** custom properties
        *   pair of `--` prefixed property name and value, e.g. `customProperty: { '--some-color': '#0000ff' }`
        *   and/or callback function to get the value, e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`
    *   `opt.format` **[string][133]?** output format, one of `computedValue` (default), `specifiedValue`, `rgb`, `hex`, `hexAlpha`
        *   `computedValue` is a [computed value][139] of the color
        *   `specifiedValue` is a [specified value][140] of the color
        *   `hexAlpha` is a hex color notation with alpha channel, i.e. `#rrggbbaa`
    *   `opt.key` **any?** key e.g. CSS property `background-color`

Returns **([string][133]? | [Array][137])** one of `rgba?()`, `#rrggbb(aa)?`, `color-name`, `'(empty-string)'`, `color(color-space r g b / alpha)`, `color(color-space x y z / alpha)`, `lab(l a b / alpha)`, `lch(l c h / alpha)`, `oklab(l a b / alpha)`, `oklch(l c h / alpha)`, `null`, or `[key, rgba?()]` etc. if `key` is specified
*   in `computedValue`, values are numbers, however `rgb()` values are integers
*   in `specifiedValue`, returns `empty string` for unknown and/or invalid color
*   in `rgb`, values are rounded to integers, and returns `rgba(0, 0, 0, 0)` for unknown and/or invalid color
*   in `hex`, returns `null` for `transparent`, and also returns `null` if any of `r`, `g`, `b`, `alpha` is not a number
*   in `hexAlpha`, returns `#00000000` for `transparent`, however returns `null` if any of `r`, `g`, `b`, `alpha` is not a number

### convert

Contains various color conversion functions.

### convert.numberToHex(value)

convert number to hex string

#### Parameters

*   `value` **[number][134]** color value

Returns **[string][133]** hex string: 00..ff

### convert.colorToHex(value, opt)

convert color to hex

#### Parameters

*   `value` **[string][133]** color value
*   `opt` **[object][135]?** options (optional, default `{}`)
    *   `opt.alpha` **[boolean][136]?** return in #rrggbbaa notation
    *   `opt.cssCalc` **[object][135]?** options for [@csstools/css-calc](https://www.npmjs.com/package/@csstools/css-calc), e.g. `cssCalc: { globals: new Map([['foo', 'bar'], ['baz', 1]]) }`
    *   `opt.customProperty` **[object][135]?** custom properties
        *   pair of `--` prefixed property name and value, e.g. `customProperty: { '--some-color': '#0000ff' }`
        *   and/or callback function to get the value, e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`

Returns **[string][133]** #rrggbb(aa)?

### convert.colorToHsl(value, opt)

convert color to hsl

#### Parameters

*   `value` **[string][133]** color value
*   `opt` **[object][135]?** options (optional, default `{}`)
    *   `opt.cssCalc` **[object][135]?** options for [@csstools/css-calc](https://www.npmjs.com/package/@csstools/css-calc), e.g. `cssCalc: { globals: new Map([['foo', 'bar'], ['baz', 1]]) }`
    *   `opt.customProperty` **[object][135]?** custom properties
        *   pair of `--` prefixed property name and value, e.g. `customProperty: { '--some-color': '#0000ff' }`
        *   and/or callback function to get the value, e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`

Returns **[Array][137]<[number][134]>** \[h, s, l, alpha]

### convert.colorToHwb(value, opt)

convert color to hwb

#### Parameters

*   `value` **[string][133]** color value
*   `opt` **[object][135]?** options (optional, default `{}`)
    *   `opt.cssCalc` **[object][135]?** options for [@csstools/css-calc](https://www.npmjs.com/package/@csstools/css-calc), e.g. `cssCalc: { globals: new Map([['foo', 'bar'], ['baz', 1]]) }`
    *   `opt.customProperty` **[object][135]?** custom properties
        *   pair of `--` prefixed property name and value, e.g. `customProperty: { '--some-color': '#0000ff' }`
        *   and/or callback function to get the value, e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`

Returns **[Array][137]<[number][134]>** \[h, w, b, alpha]

### convert.colorToLab(value, opt)

convert color to lab

#### Parameters

*   `value` **[string][133]** color value
*   `opt` **[object][135]?** options (optional, default `{}`)
    *   `opt.cssCalc` **[object][135]?** options for [@csstools/css-calc](https://www.npmjs.com/package/@csstools/css-calc), e.g. `cssCalc: { globals: new Map([['foo', 'bar'], ['baz', 1]]) }`
    *   `opt.customProperty` **[object][135]?** custom properties
        *   pair of `--` prefixed property name and value, e.g. `customProperty: { '--some-color': '#0000ff' }`
        *   and/or callback function to get the value, e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`

Returns **[Array][137]<[number][134]>** \[l, a, b, alpha]

### convert.colorToLch(value, opt)

convert color to lch

#### Parameters

*   `value` **[string][133]** color value
*   `opt` **[object][135]?** options (optional, default `{}`)
    *   `opt.cssCalc` **[object][135]?** options for [@csstools/css-calc](https://www.npmjs.com/package/@csstools/css-calc), e.g. `cssCalc: { globals: new Map([['foo', 'bar'], ['baz', 1]]) }`
    *   `opt.customProperty` **[object][135]?** custom properties
        *   pair of `--` prefixed property name and value, e.g. `customProperty: { '--some-color': '#0000ff' }`
        *   and/or callback function to get the value, e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`

Returns **[Array][137]<[number][134]>** \[l, c, h, alpha]

### convert.colorToOklab(value, opt)

convert color to oklab

#### Parameters

*   `value` **[string][133]** color value
*   `opt` **[object][135]?** options (optional, default `{}`)
    *   `opt.cssCalc` **[object][135]?** options for [@csstools/css-calc](https://www.npmjs.com/package/@csstools/css-calc), e.g. `cssCalc: { globals: new Map([['foo', 'bar'], ['baz', 1]]) }`
    *   `opt.customProperty` **[object][135]?** custom properties
        *   pair of `--` prefixed property name and value, e.g. `customProperty: { '--some-color': '#0000ff' }`
        *   and/or callback function to get the value, e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`

Returns **[Array][137]<[number][134]>** \[l, a, b, alpha]

### convert.colorToOklch(value, opt)

convert color to oklch

#### Parameters

*   `value` **[string][133]** color value
*   `opt` **[object][135]?** options (optional, default `{}`)
    *   `opt.cssCalc` **[object][135]?** options for [@csstools/css-calc](https://www.npmjs.com/package/@csstools/css-calc), e.g. `cssCalc: { globals: new Map([['foo', 'bar'], ['baz', 1]]) }`
    *   `opt.customProperty` **[object][135]?** custom properties
        *   pair of `--` prefixed property name and value, e.g. `customProperty: { '--some-color': '#0000ff' }`
        *   and/or callback function to get the value, e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`

Returns **[Array][137]<[number][134]>** \[l, c, h, alpha]

### convert.colorToRgb(value, opt)

convert color to rgb

#### Parameters

*   `value` **[string][133]** color value
*   `opt` **[object][135]?** options (optional, default `{}`)
    *   `opt.cssCalc` **[object][135]?** options for [@csstools/css-calc](https://www.npmjs.com/package/@csstools/css-calc), e.g. `cssCalc: { globals: new Map([['foo', 'bar'], ['baz', 1]]) }`
    *   `opt.customProperty` **[object][135]?** custom properties
        *   pair of `--` prefixed property name and value, e.g. `customProperty: { '--some-color': '#0000ff' }`
        *   and/or callback function to get the value, e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`

Returns **[Array][137]<[number][134]>** \[r, g, b, alpha]

### convert.colorToXyz(value, opt)

convert color to xyz

#### Parameters

*   `value` **[string][133]** color value
*   `opt` **[object][135]?** options (optional, default `{}`)
    *   `opt.cssCalc` **[object][135]?** options for [@csstools/css-calc](https://www.npmjs.com/package/@csstools/css-calc), e.g. `cssCalc: { globals: new Map([['foo', 'bar'], ['baz', 1]]) }`
    *   `opt.customProperty` **[object][135]?** custom properties
        *   pair of `--` prefixed property name and value, e.g. `customProperty: { '--some-color': '#0000ff' }`
        *   and/or callback function to get the value, e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`
    *   `opt.d50` **[boolean][136]?** xyz in d50 white point

Returns **[Array][137]<[number][134]>** \[x, y, z, alpha]

### convert.colorToXyzD50(value, opt)

convert color to xyz-d50

#### Parameters

*   `value` **[string][133]** color value
*   `opt` **[object][135]?** options (optional, default `{}`)
    *   `opt.cssCalc` **[object][135]?** options for [@csstools/css-calc](https://www.npmjs.com/package/@csstools/css-calc), e.g. `cssCalc: { globals: new Map([['foo', 'bar'], ['baz', 1]]) }`
    *   `opt.customProperty` **[object][135]?** custom properties
        *   pair of `--` prefixed property name and value, e.g. `customProperty: { '--some-color': '#0000ff' }`
        *   and/or callback function to get the value, e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`

Returns **[Array][137]<[number][134]>** \[x, y, z, alpha]


---
Copyright (c) 2024 [asamuzaK (Kazz)](https://github.com/asamuzaK/)

[133]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[134]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[135]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[136]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[137]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[138]: https://w3c.github.io/csswg-drafts/css-color-4/#color-conversion-code

[139]: https://developer.mozilla.org/en-US/docs/Web/CSS/computed_value

[140]: https://developer.mozilla.org/en-US/docs/Web/CSS/specified_value
