# CSS color

[![build](https://github.com/asamuzaK/cssColor/actions/workflows/node.js.yml/badge.svg)](https://github.com/asamuzaK/cssColor/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/asamuzaK/cssColor/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/asamuzaK/cssColor/actions/workflows/github-code-scanning/codeql)
[![npm (scoped)](https://img.shields.io/npm/v/@asamuzakjp/css-color)](https://www.npmjs.com/package/@asamuzakjp/css-color)

Resolve, parse, convert CSS color.


## Install

```console
npm i @asamuzakjp/css-color
```


## Usage

```javascript
import { convert, parse, resolve } from '@asamuzakjp/css-color';

const rgb = resolve('color-mix(in srgb, red, blue)');
// 'rgb(128, 0, 128)'

const xyz = parse('lab(46.2775% -47.5621 48.5837)');
const hex = convert.xyzToHex(xyz);
// '#008000'
```

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### resolve

Resolve CSS color.

#### Parameters

* `color` **[string][93]** color value
  * [&lt;system-color&gt;](https://developer.mozilla.org/en-US/docs/Web/CSS/system-color)s are not supported
* `opt` **[object][94]?** options
  * `opt.currentColor` **[string][93]?** color to use for `currentcolor` keyword
  * `opt.format` **[string][93]?** output format, one of `rgb`(default), `array`, `hex` or `hexAlpha`
    * `hexAlpha` gets hex color with alpha channel, i.e. `#rrggbbaa`
  * `opt.key` **any?** key e.g. CSS property `background-color`

Returns **([string][93]? | [Array][96])** `rgba?()`, `[r, g, b, a]`, `#rrggbb(aa)?`, `null`, or if `key` is specified, `[key, rgba?()|[r, g, b, a]|#rrggbb(aa)?|null]`
* In `rgb`:
  * `r`, `g`, `b` values are rounded.
  * Returns empty string for unknown / unsupported color name.
* In `array`:
  * Values are floats.
  * Returns array filled with undefined for unknown / unsupported color name, i.e. `[undefined, undefined, undefined, undefined]`.
* In `hex`:
  * `transparent` returns `null`.
  * Also returns `null` for unknown / unsupported color name.
  * `currentcolor` resolves as `#000000` if `opt.currentColor` is not specified.
* In `hexAlpha`:
  * `transparent` resolves as `#00000000`.
  * `currentcolor` resolves as `#00000000` if `opt.currentColor` is not specified.
  * Returns `null` for unknown / unsupported color name.


### parse

Parse CSS color.

#### Parameters

* `color` **[string][93]** color value
  * `color-mix()` and [&lt;system-color&gt;](https://developer.mozilla.org/en-US/docs/Web/CSS/system-color)s are not supported. It throws.
* `opt` **[object][94]?** options
  * `opt.d50` **[boolean][95]?** get xyz values in d50 white point

Returns **[Array][96]<[number][97]>** `[x, y, z, a]` x|y|z|a: 0..1


### convert

Contains conversion functions as properties.


### convert.rgbToHex

Convert rgb to hex color notation.

#### Parameters

* `rgb` **[Array][96]<[number][97]>** `[r, g, b, a]` r|g|b: 0..255 a: 0..1

Returns **[string][93]** `#rrggbbaa`


### convert.xyzToHex

Convert xyz to hex color notation.

#### Parameters

* `xyz` **[Array][96]<[number][97]>** `[x, y, z, a]` x|y|z|a: 0..1

Returns **[string][93]** `#rrggbbaa`


### convert.xyzToHsl

Convert xyz to hsl color array.

#### Parameters

* `xyz` **[Array][96]<[number][97]>** `[x, y, z, a]` x|y|z|a: 0..1

Returns **[Array][96]<[number][97]>** `[h, s, l, a]` h: 0..360 s|l: 0..100 a: 0..1


### convert.xyzToHwb

Convert xyz to hwb color array.

#### Parameters

* `xyz` **[Array][96]<[number][97]>** `[x, y, z, a]` x|y|z|a: 0..1

Returns **[Array][96]<[number][97]>** `[h, w, b, a]` h: 0..360 w|b: 0..100 a: 0..1


### convert.xyzToOklab

Convert xyz to oklab color array.

#### Parameters

* `xyz` **[Array][96]<[number][97]>** `[x, y, z, a]` x|y|z|a: 0..1

Returns **[Array][96]<[number][97]>** `[l, a, b, A]` l|A: 0..1 a|b: -0.4..0.4


### convert.xyzToOklch

Convert xyz to oklch color array.

#### Parameters

* `xyz` **[Array][96]<[number][97]>** `[x, y, z, a]` x|y|z|a: 0..1

Returns **[Array][96]<[number][97]>** `[l, c, h, a]` l|a: 0..1 c: 0..0.4 h: 0..360


### convert.xyzToRgb

Convert xyz to rgb color array.

#### Parameters

* `xyz` **[Array][96]<[number][97]>** `[x, y, z, a]` x|y|z|a: 0..1

Returns **[Array][96]<[number][97]>** `[r, g, b, a]` r|g|b: 0..255 a: 0..1


### convert.xyzToXyzD50

Convert xyz to xyz-d50 color array.

#### Parameters

* `xyz` **[Array][96]<[number][97]>** `[x, y, z, a]` x|y|z|a: 0..1

Returns **[Array][96]<[number][97]>** xyz - `[x, y, z, a]` x|y|z|a: 0..1


### convert.xyzD50ToLab

Convert xyz-d50 to lab color array.

#### Parameters

* `xyz` **[Array][96]<[number][97]>** `[x, y, z, a]` x|y|z|a: 0..1

Returns **[Array][96]<[number][97]>** `[l, a, b, A]` l: 0..100 a|b: -125..125 A: 0..1


### convert.xyzD50ToLch

Convert xyz-d50 to lch color array.

#### Parameters

* `xyz` **[Array][96]<[number][97]>** `[x, y, z, a]` x|y|z|a: 0..1

Returns **[Array][96]<[number][97]>** `[l, c, h, a]` l: 0..100 c: 0..150 h: 0..360 a: 0..1

---
Copyright (c) 2024 [asamuzaK (Kazz)](https://github.com/asamuzaK/)

[93]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[94]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[95]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[96]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[97]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
