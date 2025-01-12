/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/**
 * relative-color.test.js
 *
 * NOTE: Some tests do not match WPT results due to workaround limitations
 * wpt: https://github.com/web-platform-tests/wpt/blob/master/css/css-color/parsing/color-valid-relative-color.html
 * see: https://drafts.csswg.org/css-values-4/#calc-serialize
 * see also: https://github.com/w3c/csswg-drafts/issues/10328
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { tokenize } from '@csstools/css-tokenizer'
import * as relColor from '../src/js/relative-color.js'

describe('resolve relative color channels', () => {
  const func = relColor.resolveColorChannels as Function

  beforeEach(() => {
    relColor.cachedResults.clear()
  })
  afterEach(() => {
    relColor.cachedResults.clear()
  })

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func(['foo'])).toThrow(TypeError)
    expect(() => func(['foo'])).toThrow('foo is not an array.')
  })

  it('should get null', () => {
    const css = ' r g b / alpha)'
    const tokens = tokenize({ css })
    const res = func(tokens, {
      colorSpace: 'lab',
      format: 'specifiedValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const css = ' r calc(g * sign(2px) ) abs(-10))'
    const tokens = tokenize({ css })
    const res = func(tokens, {
      colorSpace: 'rgb',
      format: 'specifiedValue',
    })
    expect(res).toEqual(['r', 'calc(1 * g)', 'abs(-10)'])
  })

  it('should get value', () => {
    const css = ' r calc(g * sign(2em)) 1000%)'
    const tokens = tokenize({ css })
    const res = func(tokens, {
      colorSpace: 'rgb',
      format: 'specifiedValue',
    })
    expect(res).toEqual(['r', 'calc(1 * g)', 10])
  })

  it('should get value', () => {
    const css = ' r calc(g * .5 + g * .5) 10)'
    const tokens = tokenize({ css })
    const res = func(tokens, {
      colorSpace: 'rgb',
      format: 'specifiedValue',
    })
    expect(res).toEqual(['r', 'calc((0.5 * g) + (0.5 * g))', 10])
  })

  it('should get value', () => {
    const css = ' r calc((g * .5) + g * .5) 10)'
    const tokens = tokenize({ css })
    const res = func(tokens, {
      colorSpace: 'rgb',
      format: 'specifiedValue',
    })
    expect(res).toEqual(['r', 'calc((0.5 * g) + (0.5 * g))', 10])
  })

  it('should get value', () => {
    const css = ' r calc(b * 50% - g * .5) 10)'
    const tokens = tokenize({ css })
    const res = func(tokens, {
      colorSpace: 'rgb',
      format: 'specifiedValue',
    })
    expect(res).toEqual(['r', 'calc((0.5 * b) - (0.5 * g))', 10])
  })
})

describe('extract origin color', () => {
  const func = relColor.extractOriginColor as Function

  beforeEach(() => {
    relColor.cachedResults.clear()
  })
  afterEach(() => {
    relColor.cachedResults.clear()
  })

  it('should get null', () => {
    expect(func()).toBe(null)
  })

  it('should get null', () => {
    expect(func(' ')).toBe(null)
  })

  it('should get null', () => {
    const res = func('rgb(from rebeccapurple l a b)', {
      format: 'specifiedValue',
    })
    expect(res).toBe(null)
  })

  it('should get null', () => {
    const res = func('rgb(from rgb(from rebeccapurple r g b) l a b)', {
      format: 'specifiedValue',
    })
    expect(res).toBe(null)
  })

  it('should get null', () => {
    const res = func('rgb(from currentColor r g b)')
    expect(res).toBe(null)
  })

  it('should get null', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'foo',
    })
    expect(res).toBe(null)
  })

  it('should get null', () => {
    const res = func('rebeccapurple')
    expect(res).toBe('rebeccapurple')
  })

  it('should get value', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'rebeccapurple',
    })
    expect(res).toBe('rgb(from rebeccapurple r g b)')

    const res2 = func('rgb(from currentColor r g b)', {
      currentColor: 'rebeccapurple',
    })
    expect(res2).toBe('rgb(from rebeccapurple r g b)')
  })

  it('should get value', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: '#639',
    })
    expect(res).toBe('rgb(from #639 r g b)')
  })

  it('should get null', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'rgb(from foo r g b)',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'rgb(from rebeccapurple r g b)',
    })
    expect(res).toBe('rgb(from color(srgb 0.4 0.2 0.6) r g b)')
  })

  it('should get value', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'rgb( from rebeccapurple r g b )',
    })
    expect(res).toBe('rgb(from color(srgb 0.4 0.2 0.6) r g b)')
  })
})

describe('resolve relative color', () => {
  const func = relColor.resolveRelativeColor as Function

  beforeEach(() => {
    relColor.cachedResults.clear()
  })
  afterEach(() => {
    relColor.cachedResults.clear()
  })

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should throw', () => {
    expect(() => func('var(--foo)')).toThrow(SyntaxError)
    expect(() => func('var(--foo)')).toThrow('Unexpected token var( found.')
  })

  it('should get value', () => {
    expect(func('')).toBe('')
  })

  it('should get value', () => {
    expect(func('foo')).toBe('foo')
  })

  it('should get value', () => {
    const res = func('rgb(from var(--foo) r g b)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('rgb(from var(--foo) r g b)')
  })

  it('should get value', () => {
    const res = func('rgb(from rebeccapurple r g b)')
    expect(res).toBe('color(srgb 0.4 0.2 0.6)')

    const res2 = func('rgb(from rebeccapurple r g b)')
    expect(res2).toBe('color(srgb 0.4 0.2 0.6)')
  })

  it('should get value', () => {
    const res = func(
      'rgb(from rgb(100 110 120 / 0.8) calc(r + 1) calc(g + 1) calc(b + 1) / calc(alpha + 0.01))',
    )
    expect(res).toBe('color(srgb 0.39608 0.43529 0.47451 / 0.81)')

    const res2 = func(
      'rgb(from rgb(100 110 120 / 0.8) calc(r + 1) calc(g + 1) calc(b + 1) / calc(alpha + 0.01))',
    )
    expect(res2).toBe('color(srgb 0.39608 0.43529 0.47451 / 0.81)')
  })

  it('should get value', () => {
    const res = func('rgb(from rebeccapurple none none none / none)')
    expect(res).toBe('color(srgb none none none / none)')

    const res2 = func('rgb(from rebeccapurple none none none / none)')
    expect(res2).toBe('color(srgb none none none / none)')
  })

  it('should get value', () => {
    const res = func('rgb(from rgb(none none none / none) r g b / alpha)')
    expect(res).toBe('color(srgb 0 0 0 / 0)')

    const res2 = func('rgb(from rgb(none none none / none) r g b / alpha)')
    expect(res2).toBe('color(srgb 0 0 0 / 0)')
  })

  it('should get value', () => {
    const res = func('rgb(from currentColor r g b)', {
      currentColor: 'color(srgb 0.4 0.2 0.6)',
    })
    expect(res).toBe('color(srgb 0.4 0.2 0.6)')

    const res2 = func('rgb(from currentColor r g b)', {
      currentColor: 'color(srgb 0.4 0.2 0.6)',
    })
    expect(res2).toBe('color(srgb 0.4 0.2 0.6)')
  })

  it('should get value', () => {
    const res = func(
      'rgb(from color-mix(in srgb, currentColor, red) r g b / alpha)',
      {
        currentColor: 'rebeccapurple',
      },
    )
    expect(res).toBe('color(srgb 0.7 0.1 0.3)')

    const res2 = func(
      'rgb(from color-mix(in srgb, currentColor, red) r g b / alpha)',
      {
        currentColor: 'rebeccapurple',
      },
    )
    expect(res2).toBe('color(srgb 0.7 0.1 0.3)')
  })

  it('should get value', () => {
    const res = func('hsl(from rebeccapurple h s l)')
    expect(res).toBe('color(srgb 0.4 0.2 0.6)')

    const res2 = func('hsl(from rebeccapurple h s l)')
    expect(res2).toBe('color(srgb 0.4 0.2 0.6)')
  })

  it('should get value', () => {
    const res = func('hsl(from rgb(20%, 40%, 60%, 80%) h s l / alpha)')
    expect(res).toBe('color(srgb 0.2 0.4 0.6 / 0.8)')
  })

  it('should get value', () => {
    const res = func('hsl(from hsl(none none none / none) h s l / alpha)')
    expect(res).toBe('color(srgb 0 0 0 / 0)')
  })

  it('should get value', () => {
    const res = func('hsl(from rebeccapurple none none none / none)')
    expect(res).toBe('color(srgb 0 0 0 / none)')
  })

  it('should get value', () => {
    const res = func('lab(from lab(25 20 50) l a b)')
    expect(res).toBe('lab(25 20 50)')
  })

  it('should get value', () => {
    const res = func('lab(from lab(25 20 50 / 40%) l a b / alpha)')
    expect(res).toBe('lab(25 20 50 / 0.4)')
  })

  it('should get value', () => {
    const res = func('lab(from lab(from lab(25 20 50) l a b) l a b)')
    expect(res).toBe('lab(25 20 50)')
  })

  it('should get value', () => {
    const res = func(
      'lab(from lab(50 5 10 / 0.8) calc(l + 1) calc(a + 1) calc(b + 1) / calc(alpha + 0.01))',
    )
    expect(res).toBe('lab(51 6 11 / 0.81)')
  })

  it('should get value', () => {
    const res = func('lab(from lab(25 20 50) none none none / none)')
    expect(res).toBe('lab(none none none / none)')
  })

  it('should get value', () => {
    const res = func('lab(from lab(none none none / none) l a b / alpha)')
    expect(res).toBe('lab(0 0 0 / 0)')
  })

  it('should get value', () => {
    const res = func('lab(from currentColor l a b)', {
      currentColor: 'lab(25 20 50)',
    })
    expect(res).toBe('lab(25 20 50)')
  })

  it('should get value', () => {
    const res = func(
      'lab(from color-mix(in lab, currentColor, lab(25 20 50)) l a b / alpha)',
      {
        currentColor: 'lab(25 20 50)',
      },
    )
    expect(res).toBe('lab(25 20 50)')
  })

  it('should get value', () => {
    const res = func(
      'color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g b)',
    )
    expect(res).toBe('color(srgb-linear 0.7 0.5 0.3)')
  })

  it('should get value', () => {
    const res = func(
      'color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g b)',
    )
    expect(res).toBe('color(srgb-linear 0.7 0.5 0.3 / 0.4)')
  })

  it('should get value', () => {
    const res = func(
      'color(from color(srgb-linear 0.7 0.5 0.3 / 0.8) srgb-linear calc(r + 0.01) calc(g + 0.01) calc(b + 0.01) / calc(alpha + 0.01))',
    )
    expect(res).toBe('color(srgb-linear 0.71 0.51 0.31 / 0.81)')
  })

  it('should get value', () => {
    const res = func(
      'color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear none none none / none)',
    )
    expect(res).toBe('color(srgb-linear none none none / none)')
  })

  it('should get value', () => {
    const res = func(
      'color(from color(srgb-linear none none none / none) srgb-linear r g b / alpha)',
    )
    expect(res).toBe('color(srgb-linear 0 0 0 / 0)')
  })

  it('should get value', () => {
    const res = func('color(from currentColor srgb-linear r g b)', {
      currentColor: 'color(srgb-linear 0.7 0.5 0.3)',
    })
    expect(res).toBe('color(srgb-linear 0.7 0.5 0.3)')
  })

  it('should get value', () => {
    const res = func(
      'color(from color-mix(in xyz, currentColor, color(srgb-linear 0.7 0.5 0.3)) srgb-linear r g b / alpha)',
      {
        currentColor: 'color(srgb-linear 0.7 0.5 0.3)',
      },
    )
    expect(res).toBe('color(srgb-linear 0.7 0.5 0.3)')
  })

  it('should get value', () => {
    const res = func('color(from color(srgb-linear 0.25 0.5 0.75) srgb r g b)')
    expect(res).toBe('color(srgb 0.5371 0.73536 0.88083)')
  })

  it('should get value', () => {
    const res = func('rgb(from rebeccapurple r g b)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('rgb(from rebeccapurple r g b)')
  })

  it('should get value', () => {
    const res = func('rgba(from rebeccapurple r g b / alpha)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('rgb(from rebeccapurple r g b / alpha)')
  })

  it('should get value', () => {
    const res = func(
      'rgba(from rebeccapurple calc(r) calc(g) calc(b) / calc(alpha))',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'rgb(from rebeccapurple calc(r) calc(g) calc(b) / calc(alpha))',
    )
  })

  it('should get value', () => {
    const res = func(
      'rgba(from rgb(from rebeccapurple r g b) calc(r) calc(g) calc(b) / calc(alpha))',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'rgb(from rgb(from rebeccapurple r g b) calc(r) calc(g) calc(b) / calc(alpha))',
    )
  })

  it('should get value', () => {
    const res = func('hsla(from rebeccapurple h s l / alpha)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('hsl(from rebeccapurple h s l / alpha)')
  })

  it('should get value', () => {
    const res = func('rgb(from rgb(20%, 40%, 60%, 80%) r g b / alpha)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('rgb(from rgba(51, 102, 153, 0.8) r g b / alpha)')
  })

  it('should get value', () => {
    const res = func('rgb(from rgb(20%, 40%, 60%, 150%) r g b / alpha)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('rgb(from rgb(51, 102, 153) r g b / alpha)')
  })

  it('should get value', () => {
    const res = func('rgb(from hsl(120deg 20% 50% / .5) r g b / alpha)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('rgb(from rgba(102, 153, 102, 0.5) r g b / alpha)')
  })

  it('should get value', () => {
    const res = func('rgba(from rgb(from rebeccapurple r g b) r g b)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('rgb(from rgb(from rebeccapurple r g b) r g b)')
  })

  it('should get value', () => {
    const res = func('rgba(from rebeccapurple r calc(g * 2) 10)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('rgb(from rebeccapurple r calc(2 * g) 10)')
  })

  it('should get value', () => {
    const res = func('rgba(from rebeccapurple r calc(g * .5 + g * .5) 10)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('rgb(from rebeccapurple r calc((0.5 * g) + (0.5 * g)) 10)')
  })

  it('should get value', () => {
    const res = func('rgba(from rebeccapurple r calc(b * 50% - g * .5) 10)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('rgb(from rebeccapurple r calc((0.5 * b) - (0.5 * g)) 10)')
  })

  it('should get value', () => {
    const res = func(
      'rgba(from rgba(from rebeccapurple r g b) r calc(g * .5 + g * .5) 10)',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'rgb(from rgb(from rebeccapurple r g b) r calc((0.5 * g) + (0.5 * g)) 10)',
    )
  })

  it('should get null', () => {
    const res = func('rgb(from rebeccapurple l a b)')
    expect(res).toBe(null)
  })
})
