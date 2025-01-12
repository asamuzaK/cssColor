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
import { convert, isColor, resolve } from '@asamuzakjp/css-color'

const resolvedValue = resolve(
  'color-mix(in oklab, lch(67.5345 42.5 258.2), color(srgb 0 0.5 0))',
)
// 'oklab(0.620754 -0.0931934 -0.00374881)'

const convertedValue = covert.colorToHex('lab(46.2775% -47.5621 48.5837)')
// '#008000'

const result = isColor('green')
// true
```

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### resolve(color, opt)

resolves CSS color

#### Parameters

- `color` **[string][133]** color value

  - system colors are not supported

- `opt` **[object][135]?** options (optional, default `{}`)
  - `opt.currentColor` **[string][133]?**
    - color to use for `currentcolor` keyword
    - if omitted, it will be treated as a missing color,
      i.e. `rgb(none none none / none)`
  - `opt.customProperty` **[object][135]?**
    - custom properties
    - pair of `--` prefixed property name as a key and it's value,
      e.g.
      ```javascript
      const opt = {
        customProperty: {
          '--some-color': '#008000',
          '--some-length': '16px',
        },
      }
      ```
    - and/or `callback` function to get the value of the custom property,
      e.g.
      ```javascript;
      const node = document.getElementById('foo');
      const opt = {
        customProperty: {
          callback: node.style.getPropertyValue
        }
      };
      ```
  - `opt.dimension` **[object][135]?**
    - dimension, e.g. for converting relative length to pixels
    - pair of unit as a key and number in pixels as it's value,
      e.g. suppose `1em === 12px`, `1rem === 16px` and `100vw === 1024px`, then
      ```javascript
      const opt = {
        dimension: {
          em: 12,
          rem: 16,
          vw: 10.24,
        },
      }
      ```
    - and/or `callback` function to get the value as a number in pixels,
      e.g.
      ```javascript
      const opt = {
        dimension: {
          callback: (unit) => {
            switch (unit) {
              case 'em':
                return 12
              case 'rem':
                return 16
              case 'vw':
                return 10.24
              default:
                return
            }
          },
        },
      }
      ```
  - `opt.format` **[string][133]?**
    - output format, one of below
      - `computedValue` (default), [computed value][139] of the color
      - `specifiedValue`, [specified value][140] of the color
      - `hex`, hex color notation, i.e. `#rrggbb`
      - `hexAlpha`, hex color notation with alpha channel, i.e. `#rrggbbaa`
  - `opt.key` **any?**
    - key to return with the value, e.g. CSS property `background-color`

Returns **([string][133]? | [Array][137])** one of `rgba?()`, `#rrggbb(aa)?`, `color-name`, `color(color-space r g b / alpha)`, `color(color-space x y z / alpha)`, `(ok)?lab(l a b / alpha)`, `(ok)?lch(l c h / alpha)`, `'(empty-string)'`, `null`, or `[key, rgba?()]` etc. if `key` is specified

- in `computedValue`, values are numbers, however `rgb()` values are integers
- in `specifiedValue`, returns `empty string` for unknown and/or invalid color
- in `hex`, returns `null` for `transparent`, and also returns `null` if any of `r`, `g`, `b`, `alpha` is not a number
- in `hexAlpha`, returns `#00000000` for `transparent`, however returns `null` if any of `r`, `g`, `b`, `alpha` is not a number

### convert

Contains various color conversion functions.

### convert.numberToHex(value)

convert number to hex string

#### Parameters

- `value` **[number][134]** color value

Returns **[string][133]** hex string: 00..ff

### convert.colorToHex(value, opt)

convert color to hex

#### Parameters

- `value` **[string][133]** color value
- `opt` **[object][135]?** options (optional, default `{}`)
  - `opt.alpha` **[boolean][136]?** return in #rrggbbaa notation
  - `opt.customProperty` **[object][135]?**
    - custom properties, see `resolve()` function above
  - `opt.dimension` **[object][135]?**
    - dimension, see `resolve()` function above

Returns **[string][133]** #rrggbb(aa)?

### convert.colorToHsl(value, opt)

convert color to hsl

#### Parameters

- `value` **[string][133]** color value
- `opt` **[object][135]?** options (optional, default `{}`)
  - `opt.customProperty` **[object][135]?**
    - custom properties, see `resolve()` function above
  - `opt.dimension` **[object][135]?**
    - dimension, see `resolve()` function above

Returns **[Array][137]<[number][134]>** \[h, s, l, alpha]

### convert.colorToHwb(value, opt)

convert color to hwb

#### Parameters

- `value` **[string][133]** color value
- `opt` **[object][135]?** options (optional, default `{}`)
  - `opt.customProperty` **[object][135]?**
    - custom properties, see `resolve()` function above
  - `opt.dimension` **[object][135]?**
    - dimension, see `resolve()` function above

Returns **[Array][137]<[number][134]>** \[h, w, b, alpha]

### convert.colorToLab(value, opt)

convert color to lab

#### Parameters

- `value` **[string][133]** color value
- `opt` **[object][135]?** options (optional, default `{}`)
  - `opt.customProperty` **[object][135]?**
    - custom properties, see `resolve()` function above
  - `opt.dimension` **[object][135]?**
    - dimension, see `resolve()` function above

Returns **[Array][137]<[number][134]>** \[l, a, b, alpha]

### convert.colorToLch(value, opt)

convert color to lch

#### Parameters

- `value` **[string][133]** color value
- `opt` **[object][135]?** options (optional, default `{}`)
  - `opt.customProperty` **[object][135]?**
    - custom properties, see `resolve()` function above
  - `opt.dimension` **[object][135]?**
    - dimension, see `resolve()` function above

Returns **[Array][137]<[number][134]>** \[l, c, h, alpha]

### convert.colorToOklab(value, opt)

convert color to oklab

#### Parameters

- `value` **[string][133]** color value
- `opt` **[object][135]?** options (optional, default `{}`)
  - `opt.customProperty` **[object][135]?**
    - custom properties, see `resolve()` function above
  - `opt.dimension` **[object][135]?**
    - dimension, see `resolve()` function above

Returns **[Array][137]<[number][134]>** \[l, a, b, alpha]

### convert.colorToOklch(value, opt)

convert color to oklch

#### Parameters

- `value` **[string][133]** color value
- `opt` **[object][135]?** options (optional, default `{}`)
  - `opt.customProperty` **[object][135]?**
    - custom properties, see `resolve()` function above
  - `opt.dimension` **[object][135]?**
    - dimension, see `resolve()` function above

Returns **[Array][137]<[number][134]>** \[l, c, h, alpha]

### convert.colorToRgb(value, opt)

convert color to rgb

#### Parameters

- `value` **[string][133]** color value
- `opt` **[object][135]?** options (optional, default `{}`)
  - `opt.customProperty` **[object][135]?**
    - custom properties, see `resolve()` function above
  - `opt.dimension` **[object][135]?**
    - dimension, see `resolve()` function above

Returns **[Array][137]<[number][134]>** \[r, g, b, alpha]

### convert.colorToXyz(value, opt)

convert color to xyz

#### Parameters

- `value` **[string][133]** color value
- `opt` **[object][135]?** options (optional, default `{}`)
  - `opt.customProperty` **[object][135]?**
    - custom properties, see `resolve()` function above
  - `opt.dimension` **[object][135]?**
    - dimension, see `resolve()` function above
  - `opt.d50` **[boolean][136]?** xyz in d50 white point

Returns **[Array][137]<[number][134]>** \[x, y, z, alpha]

### convert.colorToXyzD50(value, opt)

convert color to xyz-d50

#### Parameters

- `value` **[string][133]** color value
- `opt` **[object][135]?** options (optional, default `{}`)
  - `opt.customProperty` **[object][135]?**
    - custom properties, see `resolve()` function above
  - `opt.dimension` **[object][135]?**
    - dimension, see `resolve()` function above

Returns **[Array][137]<[number][134]>** \[x, y, z, alpha]

### isColor(color)

is valid color type

#### Parameters

- `color` **[string][133]** color value
  - system colors are not supported

Returns **[boolean][136]**

## Acknowledgments

The following resources have been of great help in the development of the CSS color.

- [csstools/postcss-plugins](https://github.com/csstools/postcss-plugins)
- [lru-cache](https://github.com/isaacs/node-lru-cache)

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
[141]: https://www.npmjs.com/package/@csstools/css-calc
