/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/**
 * util.test.js
 */

import { describe, expect, it } from 'vitest'
import * as util from '../src/js/util.js'

describe('is color', () => {
  const func = util.isColor as Function

  it('should get result', () => {
    expect(func()).toBe(false)
  })

  it('should get result', () => {
    expect(func('')).toBe(false)
  })

  it('should get result', () => {
    expect(func('foo')).toBe(false)
  })

  it('should get result', () => {
    expect(func('red')).toBe(true)
  })

  it('should get result', () => {
    expect(func('currentcolor')).toBe(true)
  })

  it('should get result', () => {
    expect(func('transparent')).toBe(true)
  })

  it('should get result', () => {
    expect(func('color(srgb 0 127.5 0)')).toBe(true)
  })

  it('should get result', () => {
    expect(func('color-mix(in oklab, red, blue)')).toBe(true)
  })

  it('should get result', () => {
    expect(func('rgb(from rebeccapurple r g b)')).toBe(true)
  })

  it('should get result', () => {
    expect(func('rgb(from rebeccapurple l a b)')).toBe(false)
  })
})

describe('value to JSON string', () => {
  const func = util.valueToJsonString as Function

  it('should get result', () => {
    expect(func()).toBe('')
  })

  it('should get result', () => {
    expect(func(null)).toBe('null')
  })

  it('should get result', () => {
    expect(func('foo')).toBe('"foo"')
  })

  it('should get result', () => {
    expect(
      func({
        foo: 'bar',
        baz: undefined,
      }),
    ).toBe('{"foo":"bar","baz":null}')
  })

  it('should get result', () => {
    expect(
      func({
        foo: 'bar',
        map: new Map([
          ['key1', 1],
          ['key2', true],
          ['key1', 3],
        ] as never),
        set: new Set([1, 'baz', 3, 2, 3, 'baz']),
      }),
    ).toBe('{"foo":"bar","map":[["key1",3],["key2",true]],"set":[1,"baz",3,2]}')
  })

  it('should get result', () => {
    expect(
      func({
        foo: 'bar',
        func: () => {},
      }),
    ).toBe('{"foo":"bar","func":"func"}')
  })

  it('should get result', () => {
    expect(
      func(
        {
          foo: 'bar',
          func: () => {},
        },
        true,
      ),
    ).toBe(`{"foo":"bar","func":"() => {\\n          }"}`)
  })

  it('should get result', () => {
    const myCallback = () => {}
    expect(
      func({
        foo: 'bar',
        func: myCallback,
      }),
    ).toBe('{"foo":"bar","func":"myCallback"}')
  })

  it('should get result', () => {
    const myCallback = () => {}
    expect(
      func(
        {
          foo: 'bar',
          func: myCallback,
        },
        true,
      ),
    ).toBe(`{"foo":"bar","func":"() => {\\n    }"}`)
  })

  it('should get result', () => {
    expect(
      func({
        foo: 'bar',
        big: 1n,
      }),
    ).toBe('{"foo":"bar","big":"1"}')
  })

  it('should get result', () => {
    const opt = {
      foo: 'bar',
      cssCalc: {
        globals: new Map([
          ['bar', 'baz'],
          ['qux', 1],
        ] as never),
      },
    }
    const res = func(opt)
    expect(opt.cssCalc.globals instanceof Map).toBe(true)
    expect(res).toBe(
      '{"foo":"bar","cssCalc":{"globals":[["bar","baz"],["qux",1]]}}',
    )
  })
})

describe('round to specified precision', () => {
  const func = util.roundToPrecision as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a number.')
  })

  it('should throw', () => {
    expect(() => func(1.23456789, 'foo')).toThrow(TypeError)
    expect(() => func(1.23456789, 'foo')).toThrow('foo is not a number.')
  })

  it('should throw', () => {
    expect(() => func(1.23456789, -1)).toThrow(RangeError)
    expect(() => func(1.23456789, -1)).toThrow('-1 is not between 0 and 16.')
  })

  it('should throw', () => {
    expect(() => func(1.23456789, 32)).toThrow(RangeError)
    expect(() => func(1.23456789, 32)).toThrow('32 is not between 0 and 16.')
  })

  it('should get value', () => {
    expect(func(1.23456789)).toBe(1)
  })

  it('should get value', () => {
    expect(func(1.23456789, 16)).toBe(1.23457)
  })

  it('should get value', () => {
    expect(func(1.234506789, 16)).toBe(1.23451)
  })

  it('should get value', () => {
    expect(func(1.23450456, 16)).toBe(1.2345)
  })

  it('should get value', () => {
    expect(func(1.230456789, 16)).toBe(1.23046)
  })

  it('should get value', () => {
    expect(func(1.23456789, 8)).toBe(1.235)
  })

  it('should get value', () => {
    expect(func(1.230456789, 8)).toBe(1.23)
  })

  it('should get value', () => {
    expect(func(1.203456789, 8)).toBe(1.203)
  })

  it('should get value', () => {
    expect(func(1.023456789, 8)).toBe(1.023)
  })

  it('should get value', () => {
    expect(func(1.23456789, 10)).toBe(1.2346)
  })

  it('should get value', () => {
    expect(func(1.230456789, 10)).toBe(1.2305)
  })

  it('should get value', () => {
    expect(func(1.203456789, 10)).toBe(1.2035)
  })
})

describe('interpolate hue', () => {
  const func = util.interpolateHue as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a number.')
  })

  it('should throw', () => {
    expect(() => func(90)).toThrow(TypeError)
    expect(() => func(90)).toThrow('undefined is not a number.')
  })

  it('should get value', () => {
    expect(func(30, 60)).toEqual([30, 60])
  })

  it('should get value', () => {
    expect(func(60, 30)).toEqual([60, 30])
  })

  it('should get value', () => {
    expect(func(30, 240)).toEqual([390, 240])
  })

  it('should get value', () => {
    expect(func(240, 30)).toEqual([240, 390])
  })

  it('should get value', () => {
    expect(func(30, 60, 'shorter')).toEqual([30, 60])
  })

  it('should get value', () => {
    expect(func(60, 30, 'shorter')).toEqual([60, 30])
  })

  it('should get value', () => {
    expect(func(30, 240, 'shorter')).toEqual([390, 240])
  })

  it('should get value', () => {
    expect(func(240, 30, 'shorter')).toEqual([240, 390])
  })

  it('should get value', () => {
    expect(func(30, 60, 'longer')).toEqual([390, 60])
  })

  it('should get value', () => {
    expect(func(60, 30, 'longer')).toEqual([60, 390])
  })

  it('should get value', () => {
    expect(func(30, 240, 'longer')).toEqual([30, 240])
  })

  it('should get value', () => {
    expect(func(240, 30, 'longer')).toEqual([240, 30])
  })

  it('should get value', () => {
    expect(func(30, 60, 'increasing')).toEqual([30, 60])
  })

  it('should get value', () => {
    expect(func(60, 30, 'increasing')).toEqual([60, 390])
  })

  it('should get value', () => {
    expect(func(30, 240, 'increasing')).toEqual([30, 240])
  })

  it('should get value', () => {
    expect(func(240, 30, 'increasing')).toEqual([240, 390])
  })

  it('should get value', () => {
    expect(func(30, 60, 'decreasing')).toEqual([390, 60])
  })

  it('should get value', () => {
    expect(func(60, 30, 'decreasing')).toEqual([60, 30])
  })

  it('should get value', () => {
    expect(func(30, 240, 'decreasing')).toEqual([390, 240])
  })

  it('should get value', () => {
    expect(func(240, 30, 'decreasing')).toEqual([240, 30])
  })
})
