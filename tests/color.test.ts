/**
 * color.test.js
 */

import { describe, it, expect } from 'vitest'

/* test */
import * as color from '../src/js/color.js'

describe('validate color components', () => {
  const func = color.validateColorComponents as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([])).toThrow('Unexpected array length 0.')
  })

  it('should throw', () => {
    expect(() => func([1, 1, 1, 1], { maxLength: 3 })).toThrow(
      'Unexpected array length 4.',
    )
  })

  it('should throw', () => {
    expect(() => func([NaN, 1, 1])).toThrow(TypeError)
    expect(() => func([NaN, 1, 1])).toThrow('NaN is not a number.')
  })

  it('should throw', () => {
    expect(() => func([-1, 1, 1])).toThrow(RangeError)
    expect(() => func([-1, 1, 1])).toThrow('-1 is not between 0 and 1.')
  })

  it('should throw', () => {
    expect(() => func([1.1, 1, 1])).toThrow(RangeError)
    expect(() => func([1.1, 1, 1])).toThrow('1.1 is not between 0 and 1.')
  })

  it('should throw', () => {
    expect(() => func([1, 1, 1, NaN])).toThrow(TypeError)
    expect(() => func([1, 1, 1, NaN])).toThrow('NaN is not a number.')
  })

  it('should throw', () => {
    expect(() => func([1, 1, 1, -1])).toThrow(RangeError)
    expect(() => func([1, 1, 1, -1])).toThrow('-1 is not between 0 and 1.')
  })

  it('should throw', () => {
    expect(() => func([1, 1, 1, 1.1])).toThrow(RangeError)
    expect(() => func([1, 1, 1, 1.1])).toThrow('1.1 is not between 0 and 1.')
  })

  it('should throw', () => {
    expect(() => func([0, 128, 256, 1], { maxRange: 255 })).toThrow(RangeError)
    expect(() => func([0, 128, 256, 1], { maxRange: 255 })).toThrow(
      '256 is not between 0 and 255.',
    )
  })

  it('should throw', () => {
    expect(() => func([0, -128, 192, 1], { maxRange: 255 })).toThrow(RangeError)
    expect(() => func([0, -128, 192, 1], { maxRange: 255 })).toThrow(
      '-128 is not between 0 and 255.',
    )
  })

  it('should throw', () => {
    expect(() => func([0, 128, 192, 1.1], { maxRange: 255 })).toThrow(
      RangeError,
    )
    expect(() => func([0, 128, 192, 1.1], { maxRange: 255 })).toThrow(
      '1.1 is not between 0 and 1.',
    )
  })

  it('should throw', () => {
    expect(() => func([0, 128, 192, 1], { minLength: 'foo' })).toThrow(
      TypeError,
    )
    expect(() => func([0, 128, 192, 1], { minLength: 'foo' })).toThrow(
      'foo is not a number.',
    )
  })

  it('should throw', () => {
    expect(() => func([0, 128, 192, 1], { maxLength: 'foo' })).toThrow(
      TypeError,
    )
    expect(() => func([0, 128, 192, 1], { maxLength: 'foo' })).toThrow(
      'foo is not a number.',
    )
  })

  it('should throw', () => {
    expect(() => func([0, 128, 192, 1], { minRange: 'foo' })).toThrow(TypeError)
    expect(() => func([0, 128, 192, 1], { minRange: 'foo' })).toThrow(
      'foo is not a number.',
    )
  })

  it('should throw', () => {
    expect(() => func([0, 128, 192, 1], { maxRange: 'foo' })).toThrow(TypeError)
    expect(() => func([0, 128, 192, 1], { maxRange: 'foo' })).toThrow(
      'foo is not a number.',
    )
  })

  it('should get value', () => {
    const res = func([1, 0.3, 0.7, 0.5])
    expect(res).toEqual([1, 0.3, 0.7, 0.5])
  })

  it('should get value', () => {
    const res = func([1, 0.3, 0.7])
    expect(res).toEqual([1, 0.3, 0.7])
  })

  it('should get value', () => {
    const res = func([1, -1, 1.1, 0.5], {
      validateRange: false,
    })
    expect(res).toEqual([1, -1, 1.1, 0.5])
  })

  it('should get value', () => {
    const res = func([1, -1, 1.1], {
      maxLength: 3,
      validateRange: false,
    })
    expect(res).toEqual([1, -1, 1.1])
  })

  it('should get value', () => {
    const res = func([1, 0.3, 0.7])
    expect(res).toEqual([1, 0.3, 0.7])
  })

  it('should get value', () => {
    const res = func([1, 0.3, 0.7], {
      alpha: true,
    })
    expect(res).toEqual([1, 0.3, 0.7, 1])
  })
})

describe('transform matrix', () => {
  const func = color.transformMatrix as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([])).toThrow('Unexpected array length 0.')
  })

  it('should throw', () => {
    expect(() => func(['foo', [], []])).toThrow(TypeError)
    expect(() => func(['foo', [], []])).toThrow('foo is not a number.')
  })

  it('should throw', () => {
    expect(() => func([[], [], []])).toThrow('Unexpected array length 0.')
  })

  it('should throw', () => {
    expect(() => func([[1, 0, NaN], [], []])).toThrow(TypeError)
    expect(() => func([[1, 0, NaN], [], []])).toThrow('NaN is not a number.')
  })

  it('should throw', () => {
    expect(() =>
      func([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]),
    ).toThrow(TypeError)
    expect(() =>
      func([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]),
    ).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() =>
      func(
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
        [],
      ),
    ).toThrow('Unexpected array length 0.')
  })

  it('should throw', () => {
    expect(() =>
      func(
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
        [1, 0, NaN],
      ),
    ).toThrow(TypeError)
    expect(() =>
      func(
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
        [1, 0, NaN],
      ),
    ).toThrow('NaN is not a number.')
  })

  it('should get value', () => {
    const res = func(
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      [1, 0, 0.5],
    )
    expect(res).toEqual([1, 0, 0.5])
  })

  it('should get value', () => {
    const res = func(
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      [1, 0, 0.5],
      true,
    )
    expect(res).toEqual([1, 0, 0.5])
  })

  it('should get value', () => {
    const res = func(
      [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
      ],
      [1, 0, 0.5],
    )
    expect(res).toEqual([0.5, 0, 1])
  })

  it('should get value', () => {
    const res = func(
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      [1, 0.5, 0],
    )
    expect(res).toEqual([1, 0.5, 0])
  })

  it('should get value', () => {
    const res = func(
      [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
      ],
      [0, 0.5, 1],
    )
    expect(res).toEqual([1, 0.5, 0])
  })
})

describe('normalize color components', () => {
  const func = color.normalizeColorComponents as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([])).toThrow('Unexpected array length 0.')
  })

  it('should throw', () => {
    expect(() => func([1, 1, 1, 1])).toThrow(TypeError)
    expect(() => func([1, 1, 1, 1])).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([1, 1, 1, 1], [])).toThrow('Unexpected array length 0.')
  })

  it('should get values', () => {
    const res = func([1, 2, 3, 0.4], [5, 6, 7, 0.8])
    expect(res).toEqual([
      [1, 2, 3, 0.4],
      [5, 6, 7, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func(['none', 2, 3, 0.4], ['none', 6, 7, 0.8])
    expect(res).toEqual([
      [0, 2, 3, 0.4],
      [0, 6, 7, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func(['none', 2, 3, 0.4], [5, 6, 7, 0.8])
    expect(res).toEqual([
      [5, 2, 3, 0.4],
      [5, 6, 7, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func(['none', 2, 3, 0.4], [5, 6, 7, 0.8], true)
    expect(res).toEqual([
      [5, 2, 3, 0.4],
      [5, 6, 7, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func([1, 2, 3, 0.4], ['none', 6, 7, 0.8])
    expect(res).toEqual([
      [1, 2, 3, 0.4],
      [1, 6, 7, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func([1, 'none', 3, 0.4], [5, 'none', 7, 0.8])
    expect(res).toEqual([
      [1, 0, 3, 0.4],
      [5, 0, 7, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func([1, 'none', 3, 0.4], [5, 6, 7, 0.8])
    expect(res).toEqual([
      [1, 6, 3, 0.4],
      [5, 6, 7, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func([1, 2, 3, 0.4], [5, 'none', 7, 0.8])
    expect(res).toEqual([
      [1, 2, 3, 0.4],
      [5, 2, 7, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func([1, 2, 'none', 0.4], [5, 6, 'none', 0.8])
    expect(res).toEqual([
      [1, 2, 0, 0.4],
      [5, 6, 0, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func([1, 2, 'none', 0.4], [5, 6, 7, 0.8])
    expect(res).toEqual([
      [1, 2, 7, 0.4],
      [5, 6, 7, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func([1, 2, 3, 0.4], [5, 6, 'none', 0.8])
    expect(res).toEqual([
      [1, 2, 3, 0.4],
      [5, 6, 3, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func([1, 2, 3, 'none'], [5, 6, 7, 'none'])
    expect(res).toEqual([
      [1, 2, 3, 0],
      [5, 6, 7, 0],
    ])
  })

  it('should get values', () => {
    const res = func([1, 2, 3, 'none'], [5, 6, 7, 0.8])
    expect(res).toEqual([
      [1, 2, 3, 0.8],
      [5, 6, 7, 0.8],
    ])
  })

  it('should get values', () => {
    const res = func([1, 2, 3, 0.4], [5, 6, 7, 'none'])
    expect(res).toEqual([
      [1, 2, 3, 0.4],
      [5, 6, 7, 0.4],
    ])
  })
})

describe('number to hex string', () => {
  const func = color.numberToHexString as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a number.')
  })

  it('should throw', () => {
    expect(() => func(Number.NaN)).toThrow(TypeError)
    expect(() => func(Number.NaN)).toThrow('NaN is not a number.')
  })

  it('should throw', () => {
    expect(() => func(-1)).toThrow(RangeError)
    expect(() => func(-1)).toThrow('-1 is not between 0 and 255.')
  })

  it('should throw', () => {
    expect(() => func(256)).toThrow(RangeError)
    expect(() => func(256)).toThrow('256 is not between 0 and 255.')
  })

  it('should throw', () => {
    expect(() => func(-0.6)).toThrow(RangeError)
    expect(() => func(-0.6)).toThrow('-1 is not between 0 and 255.')
  })

  it('should throw', () => {
    expect(() => func(255.5)).toThrow(RangeError)
    expect(() => func(255.5)).toThrow('256 is not between 0 and 255.')
  })

  it('should get value', () => {
    const res = func(-0.4)
    expect(res).toBe('00')
  })

  it('should get value', () => {
    const res = func(255.4)
    expect(res).toBe('ff')
  })

  it('should get value', () => {
    const res = func(0)
    expect(res).toBe('00')
  })

  it('should get value', () => {
    const res = func(9)
    expect(res).toBe('09')
  })

  it('should get value', () => {
    const res = func(10)
    expect(res).toBe('0a')
  })

  it('should get value', () => {
    const res = func(15)
    expect(res).toBe('0f')
  })

  it('should get value', () => {
    const res = func(16)
    expect(res).toBe('10')
  })

  it('should get value', () => {
    const res = func(17)
    expect(res).toBe('11')
  })

  it('should get value', () => {
    const res = func(0.15 * 255)
    expect(res).toBe('26')
  })

  it('should get value', () => {
    const res = func(255)
    expect(res).toBe('ff')
  })
})

describe('angle to deg', () => {
  const func = color.angleToDeg as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string.')
  })

  it('should throw', () => {
    expect(() => func('0foo')).toThrow(SyntaxError)
    expect(() => func('0foo')).toThrow('Invalid property value: 0foo')
  })

  it('should throw', () => {
    expect(() => func('.')).toThrow(SyntaxError)
    expect(() => func('.')).toThrow('Invalid property value: .')
  })

  it('should get value', () => {
    const res = func('.0')
    expect(res).toBe(0)
  })

  it('should get value', () => {
    const res = func('0.')
    expect(res).toBe(0)
  })

  it('should get value', () => {
    const res = func('90')
    expect(res).toBe(90)
  })

  it('should get value', () => {
    const res = func('90deg')
    expect(res).toBe(90)
  })

  it('should get value', () => {
    const res = func('100grad')
    expect(res).toBe(90)
  })

  it('should get value', () => {
    const res = func('.25turn')
    expect(res).toBe(90)
  })

  it('should get value', () => {
    const res = func('1.57rad')
    expect(Math.round(res)).toBe(90)
  })

  it('should get value', () => {
    const res = func('0deg')
    expect(res).toBe(0)
  })

  it('should get value', () => {
    const res = func('360deg')
    expect(res).toBe(0)
  })

  it('should get value', () => {
    const res = func('540deg')
    expect(res).toBe(180)
  })

  it('should get value', () => {
    const res = func('720deg')
    expect(res).toBe(0)
  })

  it('should get value', () => {
    const res = func('-90deg')
    expect(res).toBe(270)
  })

  it('should get value', () => {
    const res = func('-180deg')
    expect(res).toBe(180)
  })

  it('should get value', () => {
    const res = func('-270deg')
    expect(res).toBe(90)
  })

  it('should get value', () => {
    const res = func('-360deg')
    expect(res).toBe(0)
  })

  it('should get value', () => {
    const res = func('-540deg')
    expect(res).toBe(180)
  })

  it('should get value', () => {
    const res = func('-720deg')
    expect(res).toBe(0)
  })
})

describe('parse alpha', () => {
  const func = color.parseAlpha as Function

  it('should throw', () => {
    expect(() => func('foo')).toThrow(TypeError)
    expect(() => func('foo')).toThrow('NaN is not a number.')
  })

  it('should get value', () => {
    const res = func()
    expect(res).toBe(1)
  })

  it('should get value', () => {
    const res = func()
    expect(res).toBe(1)
  })

  it('should get value', () => {
    const res = func('')
    expect(res).toBe(1)
  })

  it('should get value', () => {
    const res = func('none')
    expect(res).toBe(0)
  })

  it('should get value', () => {
    const res = func('.5')
    expect(res).toBe(0.5)
  })

  it('should get value', () => {
    const res = func('50%')
    expect(res).toBe(0.5)
  })

  it('should get value', () => {
    const res = func('0.5')
    expect(res).toBe(0.5)
  })

  it('should get value', () => {
    const res = func('-0.5')
    expect(res).toBe(0)
  })

  it('should get value', () => {
    const res = func('1.1')
    expect(res).toBe(1)
  })

  it('should get value', () => {
    const res = func('0.33333333')
    expect(res).toBe(0.333)
  })

  it('should get value', () => {
    const res = func('0.66666666')
    expect(res).toBe(0.667)
  })

  it('should get value', () => {
    const res = func('0.6065')
    expect(res).toBe(0.607)
  })

  it('should get value', () => {
    const res = func('0.0005')
    expect(res).toBe(0)
  })
})

describe('parse hex alpha', () => {
  const func = color.parseHexAlpha as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string.')
  })

  it('should throw', () => {
    expect(() => func('')).toThrow(SyntaxError)
    expect(() => func('')).toThrow('Invalid property value: (empty string)')
  })

  it('should get value', () => {
    const res = func('-0')
    expect(res).toBe(0)
  })

  it('should get value', () => {
    const res = func('0')
    expect(res).toBe(0)
  })

  it('should get value', () => {
    const res = func('100')
    expect(res).toBe(1)
  })

  it('should get value', () => {
    const res = func('ff')
    expect(res).toBe(1)
  })

  it('should get value', () => {
    const res = func('3')
    expect(res).toBe(0.01)
  })

  it('should get value', () => {
    const res = func('2')
    expect(res).toBe(0.008)
  })

  it('should get value', () => {
    const res = func('4')
    expect(res).toBe(0.016)
  })

  it('should get value', () => {
    const res = func('80')
    expect(res).toBe(0.5)
  })

  it('should get value', () => {
    const res = func('88')
    expect(res).toBe(0.533)
  })
})

describe('convert rgb to linear rgb', () => {
  const func = color.convertRgbToLinearRgb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([255, 255, 255, 1])).toThrow('Unexpected array length 4.')
  })

  it('should get value', () => {
    const res = func([255, 0, 0])
    expect(res).toEqual([1, 0, 0])
  })

  it('should get value', () => {
    const res = func([255, 0, 0], true)
    expect(res).toEqual([1, 0, 0])
  })

  it('should get value', () => {
    const res = func([0, 127.5, 0])
    res[1] = parseFloat(res[1].toFixed(2))
    expect(res).toEqual([0, 0.21, 0])
  })

  it('should get value', () => {
    const res = func([0, 127.5, 0], true)
    res[1] = parseFloat(res[1].toFixed(2))
    expect(res).toEqual([0, 0.21, 0])
  })

  it('should get value', () => {
    const res = func([0, 0, 0])
    expect(res).toEqual([0, 0, 0])
  })

  it('should get value', () => {
    const res = func([255, 255, 255])
    expect(res).toEqual([1, 1, 1])
  })

  it('should get value', () => {
    const res = func([10, 11, 12])
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.00304, 0.00335, 0.00368])
  })
})

describe('convert rgb to xyz', () => {
  const func = color.convertRgbToXyz as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([])).toThrow('Unexpected array length 0.')
  })

  it('should throw', () => {
    expect(() => func([NaN, 255, 255])).toThrow(TypeError)
    expect(() => func([NaN, 255, 255])).toThrow('NaN is not a number.')
  })

  it('should throw', () => {
    expect(() => func([-1, 255, 255])).toThrow(RangeError)
    expect(() => func([-1, 255, 255])).toThrow('-1 is not between 0 and 255.')
  })

  it('should throw', () => {
    expect(() => func([256, 255, 255])).toThrow(RangeError)
    expect(() => func([256, 255, 255])).toThrow('256 is not between 0 and 255.')
  })

  it('should throw', () => {
    expect(() => func([255, 255, 255, NaN])).toThrow(TypeError)
    expect(() => func([255, 255, 255, NaN])).toThrow('NaN is not a number.')
  })

  it('should throw', () => {
    expect(() => func([255, 255, 255, -1])).toThrow(RangeError)
    expect(() => func([255, 255, 255, -1])).toThrow(
      '-1 is not between 0 and 1.',
    )
  })

  it('should throw', () => {
    expect(() => func([255, 255, 255, 1.1])).toThrow(RangeError)
    expect(() => func([255, 255, 255, 1.1])).toThrow(
      '1.1 is not between 0 and 1.',
    )
  })

  it('should get value', () => {
    const res = func([255, 0, 0, 0.5])
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.41239, 0.21264, 0.01933, 0.5])
  })

  it('should get value', () => {
    const res = func([255, 0, 0, 0.5], true)
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.41239, 0.21264, 0.01933, 0.5])
  })

  it('should get value', () => {
    const res = func([0, 128, 0])
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.07719, 0.15438, 0.02573, 1])
  })

  it('should get value', () => {
    const res = func([0, 0, 0, 1])
    expect(res).toEqual([0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func([255, 255, 255, 1])
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.95046, 1, 1.08906, 1])
  })
})

describe('convert rgb to xyz-d50', () => {
  const func = color.convertRgbToXyzD50 as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([])).toThrow('Unexpected array length 0.')
  })

  it('should throw', () => {
    expect(() => func([NaN, 255, 255])).toThrow(TypeError)
    expect(() => func([NaN, 255, 255])).toThrow('NaN is not a number.')
  })

  it('should throw', () => {
    expect(() => func([-1, 255, 255])).toThrow(RangeError)
    expect(() => func([-1, 255, 255])).toThrow('-1 is not between 0 and 255.')
  })

  it('should throw', () => {
    expect(() => func([256, 255, 255])).toThrow(RangeError)
    expect(() => func([256, 255, 255])).toThrow('256 is not between 0 and 255.')
  })

  it('should throw', () => {
    expect(() => func([255, 255, 255, NaN])).toThrow(TypeError)
    expect(() => func([255, 255, 255, NaN])).toThrow('NaN is not a number.')
  })

  it('should throw', () => {
    expect(() => func([255, 255, 255, -1])).toThrow(RangeError)
    expect(() => func([255, 255, 255, -1])).toThrow(
      '-1 is not between 0 and 1.',
    )
  })

  it('should throw', () => {
    expect(() => func([255, 255, 255, 1.1])).toThrow(RangeError)
    expect(() => func([255, 255, 255, 1.1])).toThrow(
      '1.1 is not between 0 and 1.',
    )
  })

  it('should get value', () => {
    const res = func([255, 0, 0, 0.5])
    res[0] = parseFloat(res[0].toFixed(4))
    res[1] = parseFloat(res[1].toFixed(4))
    res[2] = parseFloat(res[2].toFixed(4))
    expect(res).toEqual([0.4361, 0.2225, 0.0139, 0.5])
  })

  it('should get value', () => {
    const res = func([0, 128, 0])
    res[0] = parseFloat(res[0].toFixed(4))
    res[1] = parseFloat(res[1].toFixed(4))
    res[2] = parseFloat(res[2].toFixed(4))
    expect(res).toEqual([0.0831, 0.1547, 0.021, 1])
  })

  it('should get value', () => {
    const res = func([0, 0, 0, 1])
    expect(res).toEqual([0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func([255, 255, 255, 1])
    res[0] = parseFloat(res[0].toFixed(4))
    res[1] = parseFloat(res[1].toFixed(4))
    res[2] = parseFloat(res[2].toFixed(4))
    expect(res).toEqual([0.9643, 1, 0.8251, 1])
  })
})

describe('convert rgb to hex color', () => {
  const func = color.convertRgbToHex as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([128, 192, 256])).toThrow(RangeError)
    expect(() => func([128, 192, 256])).toThrow('256 is not between 0 and 255.')
  })

  it('should get value', () => {
    const res = func([255, 0, 128])
    expect(res).toBe('#ff0080')
  })

  it('should get value', () => {
    const res = func([255, 0, 128, 1])
    expect(res).toBe('#ff0080')
  })

  it('should get value', () => {
    const res = func([0, 0, 0, 1])
    expect(res).toBe('#000000')
  })

  it('should get value', () => {
    const res = func([255, 255, 255, 1])
    expect(res).toBe('#ffffff')
  })

  it('should get value', () => {
    const res = func([1, 35, 69, 0.40392])
    expect(res).toBe('#01234567')
  })

  it('should get value', () => {
    const res = func([137, 171, 205, 0.93725])
    expect(res).toBe('#89abcdef')
  })
})

describe('convert linear rgb to rgb', () => {
  const func = color.convertLinearRgbToRgb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([1, 1, 1, 1])).toThrow('Unexpected array length 4.')
  })

  it('should get value', () => {
    const res = func([1, 0, 0], true)
    expect(res).toEqual([255, 0, 0])
  })

  it('should get value', () => {
    const res = func([0, 0.21404, 0], true)
    expect(res).toEqual([0, 127, 0])
  })

  it('should get value', () => {
    const res = func([0, 0, 0])
    expect(res).toEqual([0, 0, 0])
  })

  it('should get value', () => {
    const res = func([1, 1, 1], true)
    expect(res).toEqual([255, 255, 255])
  })

  it('should get value', () => {
    const res = func([0.00288, 0.00289, 0.00319], true)
    expect(res).toEqual([9, 10, 11])
  })
})

describe('convert linear rgb to hex color', () => {
  const func = color.convertLinearRgbToHex as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([1, 1, 1])).toThrow('Unexpected array length 3.')
  })

  it('should get value', () => {
    const res = func([1, 0, 0, 1])
    expect(res).toBe('#ff0000')
  })

  it('should get value', () => {
    const res = func([1, 0, 0, 1], true)
    expect(res).toBe('#ff0000')
  })

  it('should get value', () => {
    const res = func([0, 0.21586, 0, 1])
    expect(res).toBe('#008000')
  })

  it('should get value', () => {
    const res = func([0, 0, 0, 1])
    expect(res).toBe('#000000')
  })

  it('should get value', () => {
    const res = func([1, 1, 1, 1])
    expect(res).toBe('#ffffff')
  })

  it('should get value', () => {
    const res = func([0.00304, 0.00304, 0.00304, 1])
    expect(res).toBe('#0a0a0a')
  })

  it('should get value', () => {
    const res = func([0.00335, 0.00335, 0.00335, 1])
    expect(res).toBe('#0b0b0b')
  })

  it('should get value', () => {
    const res = func([0.0003, 0.01681, 0.05951, 0.40392])
    expect(res).toBe('#01234567')
  })

  it('should get value', () => {
    const res = func([0.25016, 0.40724, 0.6105, 0.93725])
    expect(res).toBe('#89abcdef')
  })
})

describe('convert xyz D50 to hex color', () => {
  const func = color.convertXyzD50ToHex as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([1, 1, 1])).toThrow('Unexpected array length 3.')
  })

  it('should get value', () => {
    const res = func([0.43601, 0.22247, 0.01393, 1])
    expect(res).toBe('#ff0000')
  })

  it('should get value', () => {
    const res = func([0.08312, 0.15475, 0.02096, 1])
    expect(res).toBe('#008000')
  })

  it('should get value', () => {
    const res = func([0, 0, 0, 1])
    expect(res).toBe('#000000')
  })

  it('should get value', () => {
    const res = func([0.96419, 1, 0.82538, 1])
    expect(res).toBe('#ffffff')
  })

  it('should get value', () => {
    const res = func([0.00293, 0.00304, 0.00251, 1])
    expect(res).toBe('#0a0a0a')
  })

  it('should get value', () => {
    const res = func([0.00323, 0.00335, 0.00276, 1])
    expect(res).toBe('#0b0b0b')
  })

  it('should get value', () => {
    const res = func([0.01512, 0.01572, 0.04415, 0.40392])
    expect(res).toBe('#01234567')
  })

  it('should get value', () => {
    const res = func([0.35326, 0.38462, 0.47913, 0.93725])
    expect(res).toBe('#89abcdef')
  })

  it('should get value', () => {
    const res = func([0.2005, 0.14089, 0.4472, 1])
    expect(res).toBe('#7654cd')
  })
})

describe('convert xyz to hex color', () => {
  const func = color.convertXyzToHex as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([1, 1, 1])).toThrow('Unexpected array length 3.')
  })

  it('should get value', () => {
    const res = func([0.41239, 0.21264, 0.01933, 1])
    expect(res).toBe('#ff0000')
  })

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1])
    expect(res).toBe('#008000')
  })

  it('should get value', () => {
    const res = func([0, 0, 0, 1])
    expect(res).toBe('#000000')
  })

  it('should get value', () => {
    const res = func([0.95046, 1, 1.08906, 1])
    expect(res).toBe('#ffffff')
  })

  it('should get value', () => {
    const res = func([0.00288, 0.00304, 0.00331, 1])
    expect(res).toBe('#0a0a0a')
  })

  it('should get value', () => {
    const res = func([0.00318, 0.00335, 0.00364, 1])
    expect(res).toBe('#0b0b0b')
  })

  it('should get value', () => {
    const res = func([0.01688, 0.01638, 0.05858, 0.40392])
    expect(res).toBe('#01234567')
  })

  it('should get value', () => {
    const res = func([0.35897, 0.38851, 0.63367, 0.93725])
    expect(res).toBe('#89abcdef')
  })

  it('should get value', () => {
    const res = func([0.148, 0.119, 0.076, 1])
    expect(res).toBe('#8b5148')
  })

  it('should get value', () => {
    const res = func([0.037, 0, -0.031, 1])
    expect(res).toBe('#670000')
  })

  it('should get value', () => {
    const res = func([0.21661, 0.14602, 0.59452, 1])
    expect(res).toBe('#7654cd')
  })
})

describe('convert xyz to rgb', () => {
  const func = color.convertXyzToRgb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should get value', () => {
    const res = func([0.41239, 0.21264, 0.01933, 0.5])
    expect(res).toEqual([255, 0, 0, 0.5])
  })

  it('should get value', () => {
    const res = func([0.41239, 0.21264, 0.01933, 0.5], {
      skip: true,
    })
    expect(res).toEqual([255, 0, 0, 0.5])
  })

  it('should get value', () => {
    const res = func([0.07719, 0.15438, 0.02573, 1])
    expect(res).toEqual([0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func([0, 0, 0, 1])
    expect(res).toEqual([0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func([0.95046, 1, 1.08906, 1])
    expect(res).toEqual([255, 255, 255, 1])
  })
})

describe('convert xyz to xyz-d50', () => {
  const func = color.convertXyzToXyzD50 as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should get value', () => {
    const res = func([1, 1, 1, 1])
    res[0] = parseFloat(res[0].toFixed(3))
    res[1] = parseFloat(res[1].toFixed(3))
    res[2] = parseFloat(res[2].toFixed(3))
    expect(res).toEqual([1.021, 1.003, 0.758, 1])
  })

  it('should get value', () => {
    const res = func([0, 1, 1, 1])
    res[0] = parseFloat(res[0].toFixed(3))
    res[1] = parseFloat(res[1].toFixed(3))
    res[2] = parseFloat(res[2].toFixed(3))
    expect(res).toEqual([-0.027, 0.973, 0.767, 1])
  })

  it('should get value', () => {
    const res = func([1, 0, 1, 1])
    res[0] = parseFloat(res[0].toFixed(4))
    res[1] = parseFloat(res[1].toFixed(4))
    res[2] = parseFloat(res[2].toFixed(4))
    expect(res).toEqual([0.9977, 0.0126, 0.7426, 1])
  })

  it('should get value', () => {
    const res = func([1, 1, 0, 1])
    res[0] = parseFloat(res[0].toFixed(4))
    res[1] = parseFloat(res[1].toFixed(4))
    res[2] = parseFloat(res[2].toFixed(4))
    expect(res).toEqual([1.0709, 1.0201, 0.0058, 1])
  })
})

describe('xyz to hsl', () => {
  const func = color.convertXyzToHsl as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 255, 255])
    const res = func(xyz, true)
    res[2] = Math.round(res[2])
    expect(res).toEqual(['none', 'none', 100, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 255, 255])
    const res = func(xyz)
    res[2] = Math.round(res[2])
    expect(res).toEqual(['none', 'none', 100, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 0, 0])
    const res = func(xyz)
    expect(res).toEqual(['none', 'none', 0, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([128, 128, 128])
    const res = func(xyz)
    res[2] = Math.round(res[2])
    expect(res).toEqual(['none', 0, 50, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 0, 0])
    const res = func(xyz)
    res[2] = Math.round(res[2])
    expect(res).toEqual([0, 100, 50, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 255, 0])
    const res = func(xyz)
    res[0] = Math.round(res[0])
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 100, 50, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 0, 255])
    const res = func(xyz)
    res[2] = Math.round(res[2])
    expect(res).toEqual([240, 100, 50, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 0, 255])
    const res = func(xyz)
    res[2] = Math.round(res[2])
    expect(res).toEqual([300, 100, 50, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 255, 0])
    const res = func(xyz)
    res[0] = Math.round(res[0])
    res[1] = Math.round(res[1])
    res[2] = Math.round(res[2])
    expect(res).toEqual([60, 100, 50, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 255, 255])
    const res = func(xyz)
    res[2] = Math.round(res[2])
    expect(res).toEqual([180, 100, 50, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 128, 0])
    const res = func(xyz)
    res[1] = Math.round(res[1])
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 100, 25, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([18, 52, 86, 0.4])
    const res = func(xyz)
    res[0] = Math.round(res[0])
    res[1] = Math.round(res[1])
    res[2] = Math.round(res[2])
    expect(res).toEqual([210, 65, 20, 0.4])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([84, 92, 61])
    const res = func(xyz)
    res[0] = Math.round(res[0])
    res[1] = Math.round(res[1])
    res[2] = Math.round(res[2])
    expect(res).toEqual([75, 20, 30, 1])
  })
})

describe('xyz to hwb', () => {
  const func = color.convertXyzToHwb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 255, 255])
    const res = func(xyz)
    res[1] = Math.round(res[1])
    res[2] = Math.round(res[2])
    expect(res).toEqual(['none', 100, 0, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 0, 0])
    const res = func(xyz)
    expect(res).toEqual(['none', 0, 100, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([128, 128, 128])
    const res = func(xyz)
    res[1] = Math.round(res[1])
    res[2] = Math.round(res[2])
    expect(res).toEqual(['none', 50, 50, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 128, 0])
    const res = func(xyz)
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 0, 50, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([64, 128, 0])
    const res = func(xyz)
    res[0] = Math.round(res[0])
    res[1] = Math.round(res[1])
    res[2] = Math.round(res[2])
    expect(res).toEqual([90, 0, 50, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([96, 128, 64])
    const res = func(xyz)
    res[0] = Math.round(res[0])
    res[1] = Math.round(res[1])
    res[2] = Math.round(res[2])
    expect(res).toEqual([90, 25, 50, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([192, 255, 128])
    const res = func(xyz)
    res[0] = Math.round(res[0])
    res[1] = Math.round(res[1])
    res[2] = Math.round(res[2])
    expect(res).toEqual([90, 50, 0, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([160, 192, 128])
    const res = func(xyz)
    res[0] = Math.round(res[0])
    res[1] = Math.round(res[1])
    res[2] = Math.round(res[2])
    expect(res).toEqual([90, 50, 25, 1])
  })
})

describe('xyz to oklab', () => {
  const func = color.convertXyzToOklab as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 128, 0])
    const res = func(xyz)
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.51975, -0.1403, 0.10768, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 128, 0])
    const res = func(xyz, true)
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.51975, -0.1403, 0.10768, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([0, 0, 0])
    const res = func(xyz)
    expect(res).toEqual([0, 'none', 'none', 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([255, 255, 255])
    const res = func(xyz)
    res[0] = parseFloat(res[0].toFixed(5))
    expect(res).toEqual([1, 'none', 'none', 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(48.477% 34.29% 38.412%)')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(3))
    res[1] = parseFloat(res[1].toFixed(3))
    res[2] = Math.abs(parseFloat(res[2].toFixed(3)))
    expect(res).toEqual([0.5, 0.05, 0, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(29.264% 70.096% 63.017%)')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(3))
    res[1] = parseFloat(res[1].toFixed(3))
    res[2] = Math.abs(parseFloat(res[2].toFixed(3)))
    expect(res).toEqual([0.7, -0.1, 0, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(73.942% 60.484% 19.65%)')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(3))
    res[1] = Math.abs(parseFloat(res[1].toFixed(3)))
    res[2] = parseFloat(res[2].toFixed(3))
    expect(res).toEqual([0.7, 0, 0.125, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(27.888% 38.072% 89.414%)')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(3))
    res[1] = Math.abs(parseFloat(res[1].toFixed(3)))
    res[2] = parseFloat(res[2].toFixed(3))
    expect(res).toEqual([0.55, 0, -0.2, 1])
  })

  it('should get value', () => {
    const xyz = color.convertRgbToXyz([118, 84, 205])
    const res = func(xyz)
    res[0] = parseFloat(res[0].toFixed(3))
    res[1] = parseFloat(res[1].toFixed(3))
    res[2] = parseFloat(res[2].toFixed(3))
    expect(res).toEqual([0.544, 0.068, -0.166, 1])
  })
})

describe('xyz to oklch', () => {
  const func = color.convertXyzToOklch as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#008000')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(2))
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    expect(res).toEqual([0.52, 0.18, 142.5, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#000000')
    const res = func([x, y, z, a])
    expect(res).toEqual([0, 'none', 'none', 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#ffffff')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(2))
    expect(res).toEqual([1, 'none', 'none', 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#808080')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(2))
    res[1] = parseFloat(res[1].toFixed(2))
    expect(res).toEqual([0.6, 0, 'none', 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(70.492% 2.351% 37.073%)')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(2))
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    expect(res).toEqual([0.5, 0.2, 0.01, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(23.056% 31.73% 82.628%)')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(2))
    expect(res).toEqual([0.5, 0.2, 270, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(32.022% 85.805% 61.147%)')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(2))
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    expect(res).toEqual([0.8, 0.15, 159.99, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('rgb(67.293% 27.791% 52.28%)')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(2))
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    expect(res).toEqual([0.55, 0.15, 345.01, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#7654cd')
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(2))
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    expect(res).toEqual([0.54, 0.18, 292.37, 1])
  })
})

describe('convert xyz D50 to rgb', () => {
  const func = color.convertXyzD50ToRgb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func([1, 1, 1])).toThrow('Unexpected array length 3.')
  })

  it('should get value', () => {
    const res = func([0.43601, 0.22247, 0.01393, 1])
    expect(res).toEqual([255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func([0.43601, 0.22247, 0.01393, 1], {
      skip: true,
    })
    expect(res).toEqual([255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func([0.08312, 0.15475, 0.02096, 1])
    expect(res).toEqual([0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func([0, 0, 0, 1])
    expect(res).toEqual([0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func([0.96419, 1, 0.82538, 1])
    expect(res).toEqual([255, 255, 255, 1])
  })

  it('should get value', () => {
    const res = func([0.00293, 0.00304, 0.00251, 1])
    expect(res).toEqual([10, 10, 10, 1])
  })

  it('should get value', () => {
    const res = func([0.00323, 0.00335, 0.00276, 1])
    expect(res).toEqual([11, 11, 11, 1])
  })

  it('should get value', () => {
    const res = func([0.01512, 0.01572, 0.04415, 0.40392])
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual([1, 35, 69, 0.4])
  })

  it('should get value', () => {
    const res = func([0.35326, 0.38462, 0.47913, 0.93725])
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual([137, 171, 205, 0.9])
  })

  it('should get value', () => {
    const res = func([0.2005, 0.14089, 0.4472, 1])
    expect(res).toEqual([118, 84, 205, 1])
  })
})

describe('xyz-d50 to lab', () => {
  const func = color.convertXyzD50ToLab as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#008000', {
      d50: true,
    })
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(3))
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    expect(res).toEqual([46.278, -47.6, 48.6, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#008000', {
      d50: true,
    })
    const res = func([x, y, z, a], {
      skip: true,
    })
    res[0] = parseFloat(res[0].toFixed(3))
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    expect(res).toEqual([46.278, -47.6, 48.6, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#000000', {
      d50: true,
    })
    const res = func([x, y, z, a])
    expect(res).toEqual([0, 'none', 'none', 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#ffffff', {
      d50: true,
    })
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(5))
    expect(res).toEqual([100, 'none', 'none', 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue(
      'rgb(75.6208% 30.4487% 47.5634%)',
      {
        d50: true,
      },
    )
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(1))
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = Math.abs(parseFloat(res[2].toFixed(1)))
    expect(res).toEqual([50, 50, 0, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue(
      'rgb(10.751% 75.558% 66.398%)',
      {
        d50: true,
      },
    )
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(1))
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    expect(res).toEqual([70, -45, 0, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue(
      'rgb(76.6254% 66.3607% 5.5775%)',
      {
        d50: true,
      },
    )
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(2))
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(2))
    expect(res).toEqual([70, 0, 70, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue(
      'rgb(12.8128% 53.105% 92.7645%)',
      {
        d50: true,
      },
    )
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(1))
    res[1] = Math.abs(parseFloat(res[1].toFixed(1)))
    res[2] = parseFloat(res[2].toFixed(1))
    expect(res).toEqual([55, 0, -60, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue(
      'rgb(12.8128% 53.105% 92.7645% / 0.4)',
      {
        d50: true,
      },
    )
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(1))
    res[1] = Math.abs(parseFloat(res[1].toFixed(1)))
    res[2] = parseFloat(res[2].toFixed(1))
    expect(res).toEqual([55, 0, -60, 0.4])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#7654cd', {
      d50: true,
    })
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(2))
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    expect(res).toEqual([44.36, 36.05, -58.99, 1])
  })
})

describe('xyz-d50 to lch', () => {
  const func = color.convertXyzD50ToLch as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#008000', {
      d50: true,
    })
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([46.27776, 67.98449, 134.38393, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#008000', {
      d50: true,
    })
    const res = func([x, y, z, a], {
      skip: true,
    })
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([46.27776, 67.98449, 134.38393, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#000000', {
      d50: true,
    })
    const res = func([x, y, z, a])
    expect(res).toEqual([0, 'none', 'none', 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#ffffff', {
      d50: true,
    })
    const res = func([x, y, z, a])
    expect(res).toEqual([100, 'none', 'none', 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#808080', {
      d50: true,
    })
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(4))
    res[1] = parseFloat(res[1].toFixed(4))
    res[2] = parseFloat(res[2].toFixed(4))
    expect(res).toEqual([53.5851, 0.0004, 152.9736, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue(
      'rgb(75.6208% 30.4487% 47.5634%)',
      {
        d50: true,
      },
    )
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(0))
    res[1] = parseFloat(res[1].toFixed(0))
    res[2] = parseFloat(res[2].toFixed(0))
    expect(res).toEqual([50, 50, 360, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue(
      'rgb(10.7906% 75.5567% 66.3982%)',
      {
        d50: true,
      },
    )
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(0))
    res[1] = parseFloat(res[1].toFixed(0))
    res[2] = parseFloat(res[2].toFixed(0))
    expect(res).toEqual([70, 45, 180, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue(
      'rgb(76.6254% 66.3607% 5.5775%)',
      {
        d50: true,
      },
    )
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(0))
    res[1] = parseFloat(res[1].toFixed(0))
    res[2] = parseFloat(res[2].toFixed(0))
    expect(res).toEqual([70, 70, 90, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue(
      'rgb(12.8128% 53.105% 92.7645%)',
      {
        d50: true,
      },
    )
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(0))
    res[1] = parseFloat(res[1].toFixed(0))
    res[2] = parseFloat(res[2].toFixed(0))
    expect(res).toEqual([55, 60, 270, 1])
  })

  it('should get value', () => {
    const [, x, y, z, a] = color.parseColorValue('#7654cd', {
      d50: true,
    })
    const res = func([x, y, z, a])
    res[0] = parseFloat(res[0].toFixed(3))
    res[1] = parseFloat(res[1].toFixed(3))
    res[2] = parseFloat(res[2].toFixed(3))
    expect(res).toEqual([44.358, 69.129, 301.43, 1])
  })
})

describe('convert hex to rgb', () => {
  const func = color.convertHexToRgb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should throw', () => {
    expect(() => func('white')).toThrow(SyntaxError)
    expect(() => func('white')).toThrow('Invalid property value: white')
  })

  it('should throw', () => {
    expect(() => func('#1')).toThrow(SyntaxError)
    expect(() => func('#1')).toThrow('Invalid property value: #1')
  })

  it('should throw', () => {
    expect(() => func('#12')).toThrow(SyntaxError)
    expect(() => func('#12')).toThrow('Invalid property value: #12')
  })

  it('should throw', () => {
    expect(() => func('#12345')).toThrow(SyntaxError)
    expect(() => func('#12345')).toThrow('Invalid property value: #12345')
  })

  it('should throw', () => {
    expect(() => func('#1234567')).toThrow(SyntaxError)
    expect(() => func('#1234567')).toThrow('Invalid property value: #1234567')
  })

  it('should throw', () => {
    expect(() => func('#123456789')).toThrow(SyntaxError)
    expect(() => func('#123456789')).toThrow(
      'Invalid property value: #123456789',
    )
  })

  it('should get value', () => {
    const res = func('#ff0000')
    expect(res).toEqual([255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('#FF0000')
    expect(res).toEqual([255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('#ff0000ff')
    expect(res).toEqual([255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('#FF0000FF')
    expect(res).toEqual([255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('#ff00001a')
    expect(res).toEqual([255, 0, 0, 0.1])
  })

  it('should get value', () => {
    const res = func('#FF00001A')
    expect(res).toEqual([255, 0, 0, 0.1])
  })

  it('should get value', () => {
    const res = func('#f00a')
    expect(res).toEqual([255, 0, 0, 0.667])
  })

  it('should get value', () => {
    const res = func('#F00a')
    expect(res).toEqual([255, 0, 0, 0.667])
  })

  it('should get value', () => {
    const res = func('#f00')
    expect(res).toEqual([255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('#F00')
    expect(res).toEqual([255, 0, 0, 1])
  })
})

describe('convert hex to linear rgb', () => {
  const func = color.convertHexToLinearRgb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should throw', () => {
    expect(() => func('foo')).toThrow(SyntaxError)
    expect(() => func('foo')).toThrow('Invalid property value: foo')
  })

  it('should get value', () => {
    const res = func('#ff0000')
    expect(res).toEqual([1, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('#008000')
    res[1] = parseFloat(res[1].toFixed(5))
    expect(res).toEqual([0, 0.21586, 0, 1])
  })

  it('should get value', () => {
    const res = func('#000000')
    expect(res).toEqual([0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('#ffffff')
    expect(res).toEqual([1, 1, 1, 1])
  })

  it('should get value', () => {
    const res = func('#0a0a0a')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    res[3] = parseFloat(res[3].toFixed(5))
    expect(res).toEqual([0.00304, 0.00304, 0.00304, 1])
  })

  it('should get value', () => {
    const res = func('#0b0b0b')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    res[3] = parseFloat(res[3].toFixed(5))
    expect(res).toEqual([0.00335, 0.00335, 0.00335, 1])
  })

  it('should get value', () => {
    const res = func('#01234567')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    res[3] = parseFloat(res[3].toFixed(5))
    expect(res).toEqual([0.0003, 0.01681, 0.05951, 0.404])
  })

  it('should get value', () => {
    const res = func('#89abcdef')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    res[3] = parseFloat(res[3].toFixed(5))
    expect(res).toEqual([0.25016, 0.40724, 0.6105, 0.937])
  })
})

describe('hex to xyz', () => {
  const func = color.convertHexToXyz as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should throw', () => {
    expect(() => func('foo')).toThrow(SyntaxError)
    expect(() => func('foo')).toThrow('Invalid property value: foo')
  })

  it('should get value', () => {
    const res = func('#ff0000')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.41239, 0.21264, 0.01933, 1])
  })

  it('should get value', () => {
    const res = func('#008000')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.07719, 0.15438, 0.02573, 1])
  })

  it('should get value', () => {
    const res = func('#009900')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.11391, 0.22781, 0.03797, 1])
  })

  it('should get value', () => {
    const res = func('#000000')
    expect(res).toEqual([0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('#ffffff')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.95046, 1, 1.08906, 1])
  })

  it('should get value', () => {
    const res = func('#0a0a0a')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    res[3] = parseFloat(res[3].toFixed(5))
    expect(res).toEqual([0.00288, 0.00304, 0.00331, 1])
  })

  it('should get value', () => {
    const res = func('#0b0b0b')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    res[3] = parseFloat(res[3].toFixed(5))
    expect(res).toEqual([0.00318, 0.00335, 0.00364, 1])
  })

  it('should get value', () => {
    const res = func('#01234567')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    res[3] = parseFloat(res[3].toFixed(5))
    expect(res).toEqual([0.01688, 0.01638, 0.05858, 0.404])
  })

  it('should get value', () => {
    const res = func('#89abcdef')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    res[3] = parseFloat(res[3].toFixed(5))
    expect(res).toEqual([0.35897, 0.38851, 0.63367, 0.937])
  })

  it('should get value', () => {
    const res = func('#7654cd')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    res[3] = parseFloat(res[3].toFixed(5))
    expect(res).toEqual([0.2166, 0.146, 0.59437, 1])
  })
})

describe('parse rgb()', () => {
  const func = color.parseRgb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('rgb(1, 2, 3 / 1)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('rgb(1, 2, 3 / 1)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('rgb(1, 2, 3 / 1)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('rgb(10, 20, 30)')
    expect(res).toEqual(['rgb', 10, 20, 30, 1])
  })

  it('should get value', () => {
    const res = func('rgb(10, 20, 30, 0.4)')
    expect(res).toEqual(['rgb', 10, 20, 30, 0.4])
  })

  it('should get value', () => {
    const res = func('rgba(10, 20, 30)')
    expect(res).toEqual(['rgb', 10, 20, 30, 1])
  })

  it('should get value', () => {
    const res = func('rgba(10, 20, 30, 0.4)')
    expect(res).toEqual(['rgb', 10, 20, 30, 0.4])
  })

  it('should get value', () => {
    const res = func('rgb(10 20 30)')
    expect(res).toEqual(['rgb', 10, 20, 30, 1])
  })

  it('should get value', () => {
    const res = func('rgb(10 20 30 / 0.4)')
    expect(res).toEqual(['rgb', 10, 20, 30, 0.4])
  })

  it('should get value', () => {
    const res = func('rgba(10 20 30)')
    expect(res).toEqual(['rgb', 10, 20, 30, 1])
  })

  it('should get value', () => {
    const res = func('rgba(10 20 30 / 0.4)')
    expect(res).toEqual(['rgb', 10, 20, 30, 0.4])
  })

  it('should get value', () => {
    const res = func('rgba(10 20 30 / 0.4)')
    expect(res).toEqual(['rgb', 10, 20, 30, 0.4])
  })

  it('should get value', () => {
    const res = func('rgba(-10, 260, -0, 1.4)')
    expect(res).toEqual(['rgb', 0, 255, 0, 1])
  })

  it('should get value', () => {
    const res = func('rgba(-10, 260, -0, -0.4)')
    expect(res).toEqual(['rgb', 0, 255, 0, 0])
  })

  it('should get value', () => {
    const res = func('rgba(-10 260 -0 / -0.4)')
    expect(res).toEqual(['rgb', 0, 255, 0, 0])
  })

  it('should get value', () => {
    const res = func('rgb(10% 20% 30% / 40%)')
    expect(res).toEqual(['rgb', 25.5, 51, 76.5, 0.4])
  })

  it('should get value', () => {
    const res = func('rgb(-10% 120% -0% / -40%)')
    expect(res).toEqual(['rgb', 0, 255, 0, 0])
  })

  it('should get value', () => {
    const res = func('rgb(10% 20% 30% / 140%)')
    expect(res).toEqual(['rgb', 25.5, 51, 76.5, 1])
  })

  it('should get value', () => {
    const res = func('rgb(.1% .2% .3%)')
    expect(res).toEqual(['rgb', 0.255, 0.51, 0.765, 1])
  })

  it('should get value', () => {
    const res = func('rgb(.1% .2% .3% / .4)')
    expect(res).toEqual(['rgb', 0.255, 0.51, 0.765, 0.4])
  })

  it('should get value', () => {
    const res = func('rgb(91.1% 92.2% 93.3% / .944)')
    expect(res).toEqual(['rgb', 232.3, 235.1, 237.9, 0.944])
  })

  it('should get value', () => {
    const res = func('rgb(none none none / none)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })
})

describe('parse hsl()', () => {
  const func = color.parseHsl as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('hsl(1, 2%, 3% / 1)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('hsl(1, 2%, 3% / 1)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('hsl(1, 2%, 3% / 1)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get null', () => {
    const res = func('hsl(1, 2%, 3% / 1)', {
      format: 'hsl',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('hsla(120 100% 25%)')
    expect(res).toEqual(['rgb', 0, 127.5, 0, 1])
  })

  it('should get value', () => {
    const res = func('hsla(120 100 25)')
    expect(res).toEqual(['rgb', 0, 127.5, 0, 1])
  })

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / 40%)')
    expect(res).toEqual(['rgb', 255, 0, 0, 0.4])
  })

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / -40%)')
    expect(res).toEqual(['rgb', 255, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / -40%)')
    expect(res).toEqual(['rgb', 255, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('hsl(0 100% 50% / 140%)')
    expect(res).toEqual(['rgb', 255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('hsl(0 .1% 50%)')
    expect(res).toEqual(['rgb', 127.6, 127.4, 127.4, 1])
  })

  it('should get value', () => {
    const res = func('hsl(0 .1% .1%)')
    expect(res).toEqual(['rgb', 0.2553, 0.2547, 0.2547, 1])
  })

  it('should get value', () => {
    const res = func('hsl(60deg 100% 50% / .4)')
    expect(res).toEqual(['rgb', 255, 255, 0, 0.4])
  })

  it('should get value', () => {
    const res = func('hsl(120 100% 50%)')
    expect(res).toEqual(['rgb', 0, 255, 0, 1])
  })

  it('should get value', () => {
    const res = func('hsl(180 100% 50%)')
    expect(res).toEqual(['rgb', 0, 255, 255, 1])
  })

  it('should get value', () => {
    const res = func('hsl(240 100% 50%)')
    expect(res).toEqual(['rgb', 0, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func('hsl(300 100% 50%)')
    expect(res).toEqual(['rgb', 255, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func('hsl(none none none / none)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('hsla(none none none / none)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('hsl(120 none none)')
    expect(res).toEqual(['rgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('hsl(120 0% 0%)')
    expect(res).toEqual(['rgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('hsl(120 none 50%)')
    expect(res).toEqual(['rgb', 127.5, 127.5, 127.5, 1])
  })

  it('should get value', () => {
    const res = func('hsl(120 100% 50% / none)')
    expect(res).toEqual(['rgb', 0, 255, 0, 0])
  })

  it('should get value', () => {
    const res = func('hsl(none 100% 50% / 0)')
    expect(res).toEqual(['rgb', 255, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('hsl(120 100% 50% / 0)')
    expect(res).toEqual(['rgb', 0, 255, 0, 0])
  })

  it('should get value', () => {
    const res = func('hsl(none 100% 50%)')
    expect(res).toEqual(['rgb', 255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('hsl(120 100% 25%)', {
      format: 'hsl',
    })
    expect(res).toEqual(['hsl', 120, 100, 25, 1])
  })

  it('should get value', () => {
    const res = func('hsl(none none none / none)', {
      format: 'hsl',
    })
    expect(res).toEqual(['hsl', 'none', 'none', 'none', 'none'])
  })
})

describe('parse hwb()', () => {
  const func = color.parseHwb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('hsw(1, 20%, 30% / 1)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('hsw(1, 20%, 30% / 1)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('hsw(1, 20%, 30% / 1)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get null', () => {
    const res = func('hsw(1, 20%, 30% / 1)', {
      format: 'hwb',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('hwb(240 0% 0%)')
    expect(res).toEqual(['rgb', 0, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func('hwb(240 0% 0% / 0.5)')
    expect(res).toEqual(['rgb', 0, 0, 255, 0.5])
  })

  it('should get value', () => {
    const res = func('hwb(240 0% 0% / 50%)')
    expect(res).toEqual(['rgb', 0, 0, 255, 0.5])
  })

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)')
    expect(res).toEqual(['rgb', 0, 127.5, 0, 1])
  })

  it('should get value', () => {
    const res = func('hwb(0 0% 100%)')
    expect(res).toEqual(['rgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('hwb(0 100% 100%)')
    expect(res).toEqual(['rgb', 127.5, 127.5, 127.5, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 70% 60%)')
    expect(res).toEqual(['rgb', 137.3, 137.3, 137.3, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 20% 30%)')
    expect(res).toEqual(['rgb', 51, 178.5, 51, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 .2% 30%)')
    expect(res).toEqual(['rgb', 0.51, 178.5, 0.51, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 20% .3%)')
    expect(res).toEqual(['rgb', 51, 254.2, 51, 1])
  })

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / .5)')
    expect(res).toEqual(['rgb', 63.75, 127.5, 0, 0.5])
  })

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / 70%)')
    expect(res).toEqual(['rgb', 63.75, 127.5, 0, 0.7])
  })

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / -70%)')
    expect(res).toEqual(['rgb', 63.75, 127.5, 0, 0])
  })

  it('should get value', () => {
    const res = func('hwb(90deg 0% 50% / 170%)')
    expect(res).toEqual(['rgb', 63.75, 127.5, 0, 1])
  })

  it('should get value', () => {
    const res = func('hwb(none none none / none)')
    expect(res).toEqual(['rgb', 255, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('hwb(120 none none)')
    expect(res).toEqual(['rgb', 0, 255, 0, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 80% none)')
    expect(res).toEqual(['rgb', 204, 255, 204, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 80% 0%)')
    expect(res).toEqual(['rgb', 204, 255, 204, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 none 50%)')
    expect(res).toEqual(['rgb', 0, 127.5, 0, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)')
    expect(res).toEqual(['rgb', 0, 127.5, 0, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / none)')
    expect(res).toEqual(['rgb', 76.5, 127.5, 76.5, 0])
  })

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / 0)')
    expect(res).toEqual(['rgb', 76.5, 127.5, 76.5, 0])
  })

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / none)')
    expect(res).toEqual(['rgb', 76.5, 127.5, 76.5, 0])
  })

  it('should get value', () => {
    const res = func('hwb(120 30% 50% / 0)')
    expect(res).toEqual(['rgb', 76.5, 127.5, 76.5, 0])
  })

  it('should get value', () => {
    const res = func('hwb(none 100% 50% / none)')
    expect(res).toEqual(['rgb', 170, 170, 170, 0])
  })

  it('should get value', () => {
    const res = func('hwb(0 100% 50% / 0)')
    expect(res).toEqual(['rgb', 170, 170, 170, 0])
  })

  it('should get value', () => {
    const res = func('hwb(180 0% 25% / 1)')
    expect(res).toEqual(['rgb', 0, 191.3, 191.3, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)', {
      format: 'hwb',
    })
    expect(res).toEqual(['hwb', 120, 0, 50, 1])
  })

  it('should get value', () => {
    const res = func('hwb(none none none / none)', {
      format: 'hwb',
    })
    expect(res).toEqual(['hwb', 'none', 'none', 'none', 'none'])
  })
})

describe('parse lab()', () => {
  const func = color.parseLab as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('lab(100%, 20%, 30% / 1)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('lab(100%, 20%, 30% / 1)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('lab(100%, 20%, 30% / 1)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)')
    expect(res).toEqual(['xyz-d50', 0.0831303, 0.154765, 0.020967, 1])
  })

  it('should get value', () => {
    const res = func('lab(0 0 0)')
    expect(res).toEqual(['xyz-d50', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('lab(100 0 0)')
    expect(res).toEqual(['xyz-d50', 0.964296, 1, 0.825105, 1])
  })

  it('should get value', () => {
    const res = func('lab(100% 0 0)')
    expect(res).toEqual(['xyz-d50', 0.964296, 1, 0.825105, 1])
  })

  it('should get value', () => {
    const res = func('lab(110% 0 0)')
    expect(res).toEqual(['xyz-d50', 0.964296, 1, 0.825105, 1])
  })

  it('should get value', () => {
    const res = func('lab(50 50 0)')
    expect(res).toEqual(['xyz-d50', 0.288683, 0.184187, 0.151973, 1])
  })

  it('should get value', () => {
    const res = func('lab(70 -45 0)')
    expect(res).toEqual(['xyz-d50', 0.266509, 0.407494, 0.336225, 1])
  })

  it('should get value', () => {
    const res = func('lab(70 0 70)')
    expect(res).toEqual(['xyz-d50', 0.392945, 0.407494, 0.0494655, 1])
  })

  it('should get value', () => {
    const res = func('lab(55 0 -60)')
    expect(res).toEqual(['xyz-d50', 0.221111, 0.229298, 0.626026, 1])
  })

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59)')
    expect(res).toEqual(['xyz-d50', 0.200518, 0.140888, 0.447232, 1])
  })

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 1)')
    expect(res).toEqual(['xyz-d50', 0.200518, 0.140888, 0.447232, 1])
  })

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / .5)')
    expect(res).toEqual(['xyz-d50', 0.200518, 0.140888, 0.447232, 0.5])
  })

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 50%)')
    expect(res).toEqual(['xyz-d50', 0.200518, 0.140888, 0.447232, 0.5])
  })

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / -50%)')
    expect(res).toEqual(['xyz-d50', 0.200518, 0.140888, 0.447232, 0])
  })

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 150%)')
    expect(res).toEqual(['xyz-d50', 0.200518, 0.140888, 0.447232, 1])
  })

  it('should get value', () => {
    const res = func('lab(.5% 50% 50%)')
    expect(res).toEqual(['xyz-d50', 0.0184044, 0.000553528, -0.0326554, 1])
  })

  it('should get value', () => {
    const res = func('lab(-10% 50% 50%)')
    expect(res).toEqual(['xyz-d50', 0.0175281, 0, -0.0331121, 1])
  })

  it('should get value', () => {
    const res = func('lab(50% 50% .5%)')
    expect(res).toEqual(['xyz-d50', 0.322273, 0.184187, 0.149483, 1])
  })

  it('should get value', () => {
    const res = func('lab(50% .5% 50%)')
    expect(res).toEqual(['xyz-d50', 0.178783, 0.184187, 0.0139186, 1])
  })

  it('should get value', () => {
    const res = func('lab(none none none)')
    expect(res).toEqual(['xyz-d50', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('lab(none none none / none)')
    expect(res).toEqual(['xyz-d50', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('lab(62.2345% -34.9638 47.7721)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lab', 62.2345, -34.9638, 47.7721, 1])
  })

  it('should get value', () => {
    const res = func('lab(62.2345% -34.9638 47.7721)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['lab', 62.2345, -34.9638, 47.7721, 1])
  })

  it('should get value', () => {
    const res = func('lab(110% none -10% / .5)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lab', 100, 'none', -12.5, 0.5])
  })

  it('should get value', () => {
    const res = func('lab(none none none / none)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lab', 'none', 'none', 'none', 'none'])
  })

  it('should get value', () => {
    const res = func('lab(none none none / none)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['lab', 'none', 'none', 'none', 'none'])
  })
})

describe('parse lch()', () => {
  const func = color.parseLch as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('lch(100%, 20%, 30% / 1)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('lch(100%, 20%, 30% / 1)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('lch(100%, 20%, 30% / 1)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('lch(46.278% 68.0 134.4)')
    expect(res).toEqual(['xyz-d50', 0.0831125, 0.15475, 0.0209589, 1])
  })

  it('should get value', () => {
    const res = func('lch(0% 0 0)')
    expect(res).toEqual(['xyz-d50', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('lch(100% 0 0)')
    expect(res).toEqual(['xyz-d50', 0.964296, 1, 0.825105, 1])
  })

  it('should get value', () => {
    const res = func('lch(50% 50 0)')
    expect(res).toEqual(['xyz-d50', 0.288683, 0.184187, 0.151973, 1])
  })

  it('should get value', () => {
    const res = func('lch(70% 45 180)')
    expect(res).toEqual(['xyz-d50', 0.266509, 0.407494, 0.336225, 1])
  })

  it('should get value', () => {
    const res = func('lch(70% 70 90)')
    expect(res).toEqual(['xyz-d50', 0.392945, 0.407494, 0.0494655, 1])
  })

  it('should get value', () => {
    const res = func('lch(55% 60 270)')
    expect(res).toEqual(['xyz-d50', 0.221111, 0.229298, 0.626026, 1])
  })

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43)')
    expect(res).toEqual(['xyz-d50', 0.200515, 0.140888, 0.447126, 1])
  })

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)')
    expect(res).toEqual(['xyz-d50', 0.200515, 0.140888, 0.447126, 1])
  })

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / .5)')
    expect(res).toEqual(['xyz-d50', 0.200515, 0.140888, 0.447126, 0.5])
  })

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 50%)')
    expect(res).toEqual(['xyz-d50', 0.200515, 0.140888, 0.447126, 0.5])
  })

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / -50%)')
    expect(res).toEqual(['xyz-d50', 0.200515, 0.140888, 0.447126, 0])
  })

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 150%)')
    expect(res).toEqual(['xyz-d50', 0.200515, 0.140888, 0.447126, 1])
  })

  it('should get value', () => {
    const res = func('lch(.5% 20 30)')
    expect(res).toEqual(['xyz-d50', 0.00482348, 0.000553528, -0.00484122, 1])
  })

  it('should get value', () => {
    const res = func('lch(-10% 20 30)')
    expect(res).toEqual(['xyz-d50', 0.00428972, 0, -0.00529794, 1])
  })

  it('should get value', () => {
    const res = func('lch(10% .5 30)')
    expect(res).toEqual(['xyz-d50', 0.0109845, 0.0112602, 0.00913626, 1])
  })

  it('should get value', () => {
    const res = func('lch(10% 20% 30)')
    expect(res).toEqual(['xyz-d50', 0.0202958, 0.0112602, 0.00118747, 1])
  })

  it('should get value', () => {
    const res = func('lch(10% 20 -30)')
    expect(res).toEqual(['xyz-d50', 0.0167108, 0.0112602, 0.0169987, 1])
  })

  it('should get value', () => {
    const res = func('lch(none none none)')
    expect(res).toEqual(['xyz-d50', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('lch(none none none / none)')
    expect(res).toEqual(['xyz-d50', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('lch(62.2345% 59.2 126.2)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lch', 62.2345, 59.2, 126.2, 1])
  })

  it('should get value', () => {
    const res = func('lch(62.2345% 59.2 126.2)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['lch', 62.2345, 59.2, 126.2, 1])
  })

  it('should get value', () => {
    const res = func('lch(-10% none -90deg / .5)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lch', 0, 'none', 270, 0.5])
  })

  it('should get value', () => {
    const res = func('lch(none none none / none)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lch', 'none', 'none', 'none', 'none'])
  })

  it('should get value', () => {
    const res = func('lch(none none none / none)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['lch', 'none', 'none', 'none', 'none'])
  })
})

describe('parse oklab()', () => {
  const func = color.parseOklab as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('oklab(100%, 20%, 30% / 1)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('oklab(100%, 20%, 30% / 1)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('oklab(100%, 20%, 30% / 1)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)')
    expect(res).toEqual(['xyz-d65', 0.0771884, 0.154375, 0.0257248, 1])
  })

  it('should get value', () => {
    const res = func('oklab(0 0 0)')
    expect(res).toEqual(['xyz-d65', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('oklab(1 0 0)')
    expect(res).toEqual(['xyz-d65', 0.950456, 1, 1.08906, 1])
  })

  it('should get value', () => {
    const res = func('oklab(50% 0.05 0)')
    expect(res).toEqual(['xyz-d65', 0.139023, 0.120254, 0.131325, 1])
  })

  it('should get value', () => {
    const res = func('oklab(0.7 -0.1 0)')
    expect(res).toEqual(['xyz-d65', 0.253459, 0.361799, 0.392252, 1])
  })

  it('should get value', () => {
    const res = func('oklab(70% 0 0.125)')
    expect(res).toEqual(['xyz-d65', 0.330466, 0.341821, 0.0788701, 1])
  })

  it('should get value', () => {
    const res = func('oklab(0.55 0 -0.2)')
    expect(res).toEqual(['xyz-d65', 0.208919, 0.155096, 0.75298, 1])
  })

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567)')
    expect(res).toEqual(['xyz-d65', 0.216593, 0.145996, 0.594355, 1])
  })

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 1)')
    expect(res).toEqual(['xyz-d65', 0.216593, 0.145996, 0.594355, 1])
  })

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / .5)')
    expect(res).toEqual(['xyz-d65', 0.216593, 0.145996, 0.594355, 0.5])
  })

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 50%)')
    expect(res).toEqual(['xyz-d65', 0.216593, 0.145996, 0.594355, 0.5])
  })

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / -50%)')
    expect(res).toEqual(['xyz-d65', 0.216593, 0.145996, 0.594355, 0])
  })

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 150%)')
    expect(res).toEqual(['xyz-d65', 0.216593, 0.145996, 0.594355, 1])
  })

  it('should get value', () => {
    const res = func('oklab(.5% 20% 30%)')
    expect(res).toEqual(['xyz-d65', -0.000790021, 0.000266762, -0.00617548, 1])
  })

  it('should get value', () => {
    const res = func('oklab(-10% 20% 30%)')
    expect(res).toEqual(['xyz-d65', -0.000962546, 0.000293252, -0.00677682, 1])
  })

  it('should get value', () => {
    const res = func('oklab(10% 20% .5%)')
    expect(res).toEqual(['xyz-d65', 0.00261129, 0.000703706, 0.000668526, 1])
  })

  it('should get value', () => {
    const res = func('oklab(10% .5% 30%)')
    expect(res).toEqual(['xyz-d65', 0.00201133, 0.000799226, -0.000751157, 1])
  })

  it('should get value', () => {
    const res = func('oklab(none none none)')
    expect(res).toEqual(['xyz-d65', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('oklab(none none none / none)')
    expect(res).toEqual(['xyz-d65', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('oklab(66.016% -0.1084 0.1114)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklab', 0.66016, -0.1084, 0.1114, 1])
  })

  it('should get value', () => {
    const res = func('oklab(66.016% -0.1084 0.1114)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['oklab', 0.66016, -0.1084, 0.1114, 1])
  })

  it('should get value', () => {
    const res = func('oklab(-10% none 30% / .5)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklab', 0, 'none', 0.12, 0.5])
  })

  it('should get value', () => {
    const res = func('oklab(none none none / none)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklab', 'none', 'none', 'none', 'none'])
  })

  it('should get value', () => {
    const res = func('oklab(none none none / none)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['oklab', 'none', 'none', 'none', 'none'])
  })
})

describe('parse oklch()', () => {
  const func = color.parseOklch as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('oklch(100%, 20%, 30% / 1)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('oklch(100%, 20%, 30% / 1)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('oklch(100%, 20%, 30% / 1)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)')
    expect(res).toEqual(['xyz-d65', 0.0771872, 0.154375, 0.0257271, 1])
  })

  it('should get value', () => {
    const res = func('oklch(0% 0 0)')
    expect(res).toEqual(['xyz-d65', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('oklch(100% 0 0)')
    expect(res).toEqual(['xyz-d65', 0.950456, 1, 1.08906, 1])
  })

  it('should get value', () => {
    const res = func('oklch(50% 0.2 0)')
    expect(res).toEqual(['xyz-d65', 0.208742, 0.106235, 0.116683, 1])
  })

  it('should get value', () => {
    const res = func('oklch(50% 0.2 270)')
    expect(res).toEqual(['xyz-d65', 0.164463, 0.114827, 0.62784, 1])
  })

  it('should get value', () => {
    const res = func('oklch(80% 0.15 160)')
    expect(res).toEqual(['xyz-d65', 0.347224, 0.547341, 0.401545, 1])
  })

  it('should get value', () => {
    const res = func('oklch(55% 0.15 345)')
    expect(res).toEqual(['xyz-d65', 0.234241, 0.14918, 0.239504, 1])
  })

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37)')
    expect(res).toEqual(['xyz-d65', 0.212588, 0.142275, 0.58731, 1])
  })

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / 1)')
    expect(res).toEqual(['xyz-d65', 0.212588, 0.142275, 0.58731, 1])
  })

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / .5)')
    expect(res).toEqual(['xyz-d65', 0.212588, 0.142275, 0.58731, 0.5])
  })

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / 50%)')
    expect(res).toEqual(['xyz-d65', 0.212588, 0.142275, 0.58731, 0.5])
  })

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / -50%)')
    expect(res).toEqual(['xyz-d65', 0.212588, 0.142275, 0.58731, 0])
  })

  it('should get value', () => {
    const res = func('oklch(54% 0.18 292.37 / 150%)')
    expect(res).toEqual(['xyz-d65', 0.212588, 0.142275, 0.58731, 1])
  })

  it('should get value', () => {
    const res = func('oklch(.5 20% 30)')
    expect(res).toEqual(['xyz-d65', 0.147667, 0.118516, 0.0757682, 1])
  })

  it('should get value', () => {
    const res = func('oklch(-10% 20% 30)')
    expect(res).toEqual([
      'xyz-d65',
      0.00000371006,
      0.0000109137,
      -0.000310562,
      1,
    ])
  })

  it('should get value', () => {
    const res = func('oklch(10% 20% .5)')
    expect(res).toEqual(['xyz-d65', 0.0026038, 0.000703632, 0.000735212, 1])
  })

  it('should get value', () => {
    const res = func('oklch(10% .5 30)')
    expect(res).toEqual(['xyz-d65', 0.0372685, -0.0000535228, -0.0310754, 1])
  })

  it('should get value', () => {
    const res = func('oklch(10% -0.5 30)')
    expect(res).toEqual(['xyz-d65', 0.000950456, 0.001, 0.00108906, 1])
  })

  it('should get value', () => {
    const res = func('oklch(none none none)')
    expect(res).toEqual(['xyz-d65', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('oklch(none none none / none)')
    expect(res).toEqual(['xyz-d65', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('oklch(59.686% 0.15619 49.7694)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklch', 0.59686, 0.15619, 49.7694, 1])
  })

  it('should get value', () => {
    const res = func('oklch(59.686% 0.15619 49.7694)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['oklch', 0.59686, 0.15619, 49.7694, 1])
  })

  it('should get value', () => {
    const res = func('oklch(-10% none -90deg / .5)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklch', 0, 'none', 270, 0.5])
  })

  it('should get value', () => {
    const res = func('oklch(none none none / none)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklch', 'none', 'none', 'none', 'none'])
  })

  it('should get value', () => {
    const res = func('oklch(none none none / none)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['oklch', 'none', 'none', 'none', 'none'])
  })
})

describe('parse color func', () => {
  const func = color.parseColorFunc as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('color(in foo, 1 1 1)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('color(srgb foo bar baz)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color(srgb foo bar baz)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)')
    expect(res).toEqual(['xyz-d65', 0.0765378, 0.153076, 0.0255126, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.0824383, 0.153443, 0.0207794, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0)')
    expect(res).toEqual(['xyz-d65', 0.113907, 0.227815, 0.0379691, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.122689, 0.228362, 0.0309249, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 50% 50% 50% / 50%)')
    expect(res).toEqual(['xyz-d65', 0.203437, 0.214041, 0.233103, 0.5])
  })

  it('should get value', () => {
    const res = func('color(srgb .5 .5 .5 / .5)')
    expect(res).toEqual(['xyz-d65', 0.203437, 0.214041, 0.233103, 0.5])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)')
    expect(res).toEqual(['xyz-d65', 0.113907, 0.227815, 0.0379691, 0.5])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 50%)')
    expect(res).toEqual(['xyz-d65', 0.113907, 0.227815, 0.0379691, 0.5])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 150%)')
    expect(res).toEqual(['xyz-d65', 0.113907, 0.227815, 0.0379691, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / -1)')
    expect(res).toEqual(['xyz-d65', 0.113907, 0.227815, 0.0379691, 0])
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)')
    expect(res).toEqual(['xyz-d65', 0.0771882, 0.154376, 0.0257294, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.0831388, 0.154747, 0.020956, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 0.26374 0.59085 0.16434)')
    expect(res).toEqual(['xyz-d65', 0.113905, 0.227813, 0.037968, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 0.26374 0.59085 0.16434)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.122687, 0.22836, 0.0309241, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 0.299218 0.533327 0.120785)')
    expect(res).toEqual(['xyz-d65', 0.113905, 0.22781, 0.0379681, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 0.299218 0.533327 0.120785)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.122686, 0.228357, 0.0309241, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 0 1 0)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.165697, 0.675318, 0.0299778, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 0.33582 0.59441 0.13934)')
    expect(res).toEqual(['xyz-d65', 0.113904, 0.22781, 0.0379676, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 0.33582 0.59441 0.13934)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.122685, 0.228357, 0.0309238, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.2861 0.49131 0.16133)')
    expect(res).toEqual(['xyz-d65', 0.11388, 0.227813, 0.0379771, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.2861 0.49131 0.16133)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.12266, 0.228359, 0.0309312, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 1 0)')
    expect(res).toEqual(['xyz-d65', 0.11272, 0.715115, -0.0129334, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 1 0)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.135181, 0.711835, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.0771895 0.154379 0.0257347)')
    expect(res).toEqual(['xyz-d65', 0.0771895, 0.154379, 0.0257347, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.0771895 0.154379 0.0257347)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.08314, 0.15475, 0.02096, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d65 0.0771895 0.154379 0.0257347)')
    expect(res).toEqual(['xyz-d65', 0.0771895, 0.154379, 0.0257347, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d65 0.0771895 0.154379 0.0257347)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.08314, 0.15475, 0.02096, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 0.08314 0.15475 0.02096)')
    expect(res).toEqual(['xyz-d65', 0.0771895, 0.154379, 0.0257347, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 0.08314 0.15475 0.02096)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.08314, 0.15475, 0.02096, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb none 1 1 / 1)')
    expect(res).toEqual(['xyz-d65', 0.538065, 0.787361, 1.06973, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 1 none 1 / 1)')
    expect(res).toEqual(['xyz-d65', 0.592872, 0.284831, 0.969863, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 1 1 none / 1)')
    expect(res).toEqual(['xyz-d65', 0.769975, 0.927808, 0.138526, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 1 1 1 / none)')
    expect(res).toEqual(['xyz-d65', 0.950456, 1, 1.08906, 0])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 1)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb', 0, 0.5, 1, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 1)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['srgb', 0, 0.5, 1, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb none 0.5 1)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb', 'none', 0.5, 1, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 none 1)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb', 0, 'none', 1, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 none)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb', 0, 0.5, 'none', 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 1 / none)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb', 0, 0.5, 1, 'none'])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['xyz-d65', 0.07719, 0.15438, 0.02573, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['xyz-d65', 0.07719, 0.15438, 0.02573, 1])
  })
})

describe('parse color value', () => {
  const func = color.parseColorValue as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('currentColor')
    expect(res).toEqual(['xyz-d65', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'specifiedValue',
    })
    expect(res).toBe('currentcolor')
  })

  it('should get value', () => {
    const res = func('transparent')
    expect(res).toEqual(['xyz-d65', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('transparent', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('transparent', {
      format: 'specifiedValue',
    })
    expect(res).toBe('transparent')
  })

  it('should get value', () => {
    const res = func('transparent', {
      format: 'mixValue',
    })
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('green')
    expect(res).toEqual(['xyz-d65', 0.0771883, 0.154377, 0.0257294, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.083139, 0.154748, 0.020956, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      format: 'specifiedValue',
    })
    expect(res).toBe('green')
  })

  it('should get value', () => {
    const res = func('foo')
    expect(res).toEqual(['xyz-d65', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('foo', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('foo', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('foo', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('foo(1 1 1 / 1)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('foo(1 1 1 / 1)', {
      d50: true,
    })
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('foo(1 1 1 / 1)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('foo(1 1 1 / 1)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('foo(1 1 1 / 1)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('#008000')
    expect(res).toEqual(['xyz-d65', 0.0771883, 0.154377, 0.0257294, 1])
  })

  it('should get value', () => {
    const res = func('#008000', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.083139, 0.154748, 0.020956, 1])
  })

  it('should get value', () => {
    const res = func('#008000', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('#00800080')
    expect(res).toEqual(['xyz-d65', 0.0771883, 0.154377, 0.0257294, 0.5])
  })

  it('should get value', () => {
    const res = func('#00800080', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.083139, 0.154748, 0.020956, 0.5])
  })

  it('should get value', () => {
    const res = func('#00800080', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 128, 0, 0.5])
  })

  it('should get value', () => {
    const res = func('#080')
    expect(res).toEqual(['xyz-d65', 0.0880377, 0.176075, 0.0293459, 1])
  })

  it('should get value', () => {
    const res = func('#0808')
    expect(res).toEqual(['xyz-d65', 0.0880377, 0.176075, 0.0293459, 0.533])
  })

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)')
    expect(res).toEqual(['xyz-d65', 0.0771803, 0.154395, 0.0257436, 1])
  })

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.0831303, 0.154765, 0.020967, 1])
  })

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lab', 46.28, -47.57, 48.58, 1])
  })

  it('should get value', () => {
    const res = func('lab(46.28% -47.57 48.58)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['lab', 46.28, -47.57, 48.58, 1])
  })

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)')
    expect(res).toEqual(['xyz-d65', 0.0771771, 0.154375, 0.0257325, 1])
  })

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.083127, 0.154746, 0.0209584, 1])
  })

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lch', 46.2775, 67.9892, 134.391, 1])
  })

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['lch', 46.2775, 67.9892, 134.391, 1])
  })

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)')
    expect(res).toEqual(['xyz-d65', 0.0771884, 0.154375, 0.0257248, 1])
  })

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.0831393, 0.154746, 0.0209525, 1])
  })

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklab', 0.51975, -0.1403, 0.10768, 1])
  })

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['oklab', 0.51975, -0.1403, 0.10768, 1])
  })

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)')
    expect(res).toEqual(['xyz-d65', 0.0771872, 0.154375, 0.0257271, 1])
  })

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.0831379, 0.154746, 0.0209542, 1])
  })

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklch', 0.51975, 0.17686, 142.495, 1])
  })

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['oklch', 0.51975, 0.17686, 142.495, 1])
  })

  it('should get value', () => {
    const res = func('rgb(0 128 0)')
    expect(res).toEqual(['xyz-d65', 0.0771883, 0.154377, 0.0257294, 1])
  })

  it('should get value', () => {
    const res = func('rgb(0 128 0)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.083139, 0.154748, 0.020956, 1])
  })

  it('should get value', () => {
    const res = func('rgb(0 128 0)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('hsl(120 100% 25%)')
    expect(res).toEqual(['xyz-d65', 0.0765378, 0.153076, 0.0255126, 1])
  })

  it('should get value', () => {
    const res = func('hsl(120 100% 25%)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.0824383, 0.153443, 0.0207794, 1])
  })

  it('should get value', () => {
    const res = func('hsl(120 100% 25%)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 0% 49.8039%)')
    expect(res).toEqual(['xyz-d65', 0.0771883, 0.154377, 0.0257294, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 0% 49.8039%)', {
      d50: true,
    })
    expect(res).toEqual(['xyz-d50', 0.083139, 0.154748, 0.020956, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 0% 50%)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })
})

describe('resolve color value', () => {
  const func = color.resolveColorValue as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('#12345')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('#12345', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('#12345', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('rgb(foo 128 255)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('rgb(foo 128 255)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('rgb(foo 128 255)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('foo')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('foo', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('foo', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('currentColor')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('currentColor', {
      format: 'specifiedValue',
    })
    expect(res).toBe('currentcolor')
  })

  it('should get value', () => {
    const res = func('transparent')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('transparent', {
      format: 'specifiedValue',
    })
    expect(res).toBe('transparent')
  })

  it('should get value', () => {
    const res = func('transparent', {
      format: 'mixValue',
    })
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func('black')
    expect(res).toEqual(['rgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('green')
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('WHITE')
    expect(res).toEqual(['rgb', 255, 255, 255, 1])
  })

  it('should get value', () => {
    const res = func('WHITE', {
      format: 'specifiedValue',
    })
    expect(res).toBe('white')
  })

  it('should get value', () => {
    const res = func('#123456')
    expect(res).toEqual(['rgb', 18, 52, 86, 1])
  })

  it('should get value', () => {
    const res = func('#abcdef')
    expect(res).toEqual(['rgb', 171, 205, 239, 1])
  })

  it('should get value', () => {
    const res = func('#12345678')
    expect(res).toEqual(['rgb', 18, 52, 86, 0.47])
  })

  it('should get value', () => {
    const res = func('#abcdef12')
    expect(res).toEqual(['rgb', 171, 205, 239, 0.07])
  })

  it('should get value', () => {
    const res = func('#1234')
    expect(res).toEqual(['rgb', 17, 34, 51, 0.267])
  })

  it('should get value', () => {
    const res = func('#abcd')
    expect(res).toEqual(['rgb', 170, 187, 204, 0.867])
  })

  it('should get value', () => {
    const res = func('#123')
    expect(res).toEqual(['rgb', 17, 34, 51, 1])
  })

  it('should get value', () => {
    const res = func('#abc')
    expect(res).toEqual(['rgb', 170, 187, 204, 1])
  })

  it('should get value', () => {
    const res = func('rgb(10 20 30 / 0.5)')
    expect(res).toEqual(['rgb', 10, 20, 30, 0.5])
  })

  it('should get value', () => {
    const res = func('rgb(0 0 0 / 1%)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0.01])
  })

  it('should get value', () => {
    const res = func('rgba(1,2,3,0.5)')
    expect(res).toEqual(['rgb', 1, 2, 3, 0.5])
  })

  it('should get value', () => {
    const res = func('rgba(1,2,3,1)')
    expect(res).toEqual(['rgb', 1, 2, 3, 1])
  })

  it('should get value', () => {
    const res = func('rgb(46.27% 32.94% 80.39%)')
    expect(res).toEqual(['rgb', 118, 84, 205, 1])
  })

  it('should get value', () => {
    const res = func('rgb(50% 33% 34%)')
    expect(res).toEqual(['rgb', 128, 84, 87, 1])
  })

  it('should get value', () => {
    const res = func('rgb(5% 10% 20%)')
    expect(res).toEqual(['rgb', 13, 26, 51, 1])
  })

  it('should get value', () => {
    const res = func('hsl(240 100% 50% / 0.5)')
    expect(res).toEqual(['rgb', 0, 0, 255, 0.5])
  })

  it('should get value', () => {
    const res = func('hsl(-120deg 100% 50% / 0.5)')
    expect(res).toEqual(['rgb', 0, 0, 255, 0.5])
  })

  it('should get value', () => {
    const res = func('hsl(120 100% 0% / 1%)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0.01])
  })

  it('should get value', () => {
    const res = func('hsl(240 100% 50%)')
    expect(res).toEqual(['rgb', 0, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func('hsla(180,50%,50%,0.5)')
    expect(res).toEqual(['rgb', 64, 191, 191, 0.5])
  })

  it('should get value', () => {
    const res = func('hwb(240 100% 50%)')
    expect(res).toEqual(['rgb', 170, 170, 170, 1])
  })

  it('should get value', () => {
    const res = func('hwb(110 20% 30% / 40%)')
    expect(res).toEqual(['rgb', 72, 179, 51, 0.4])
  })

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 1)')
    expect(res).toEqual(['rgb', 118, 84, 205, 1])
  })

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 0.5)')
    expect(res).toEqual(['rgb', 118, 84, 205, 0.5])
  })

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 0.5)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lab', 44.36, 36.05, -59, 0.5])
  })

  it('should get value', () => {
    const res = func('lab(44.36 36.05 -59 / 0.5)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['lab', 44.36, 36.05, -59, 0.5])
  })

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)')
    expect(res).toEqual(['rgb', 118, 84, 205, 1])
  })

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lch', 44.36, 69.13, 301.43, 1])
  })

  it('should get value', () => {
    const res = func('lch(44.36% 69.13 301.43 / 1)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['lch', 44.36, 69.13, 301.43, 1])
  })

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 1)')
    expect(res).toEqual(['rgb', 118, 84, 205, 1])
  })

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 0.5)')
    expect(res).toEqual(['rgb', 118, 84, 205, 0.5])
  })

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 0.5)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklab', 0.54432, 0.06817, -0.16567, 0.5])
  })

  it('should get value', () => {
    const res = func('oklab(0.54432 0.06817 -0.16567 / 0.5)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['oklab', 0.54432, 0.06817, -0.16567, 0.5])
  })

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 1)')
    expect(res).toEqual(['rgb', 118, 84, 205, 1])
  })

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 0.5)')
    expect(res).toEqual(['rgb', 118, 84, 205, 0.5])
  })

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 0.5)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklch', 0.544, 0.179, 292.365, 0.5])
  })

  it('should get value', () => {
    const res = func('oklch(54.4% 0.179 292.365 / 0.5)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['oklch', 0.544, 0.179, 292.365, 0.5])
  })

  it('should get value', () => {
    const res = func('rgb(none none none / none)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })
})

describe('resolve color()', () => {
  const func = color.resolveColorFunc as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('color(in foo, 1 1 1)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('color(in foo, 1 1 1)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('color(srgb foo bar baz)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color(srgb foo bar baz)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get null', () => {
    const res = func('color(srgb foo bar baz)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0)')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color( srgb 0 0.6 0 )')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0% 60% 0%)')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)')
    expect(res).toEqual(['rgb', 0, 153, 0, 0.5])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 0.5)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb', 0, 0.6, 0, 0.5])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 50%)')
    expect(res).toEqual(['rgb', 0, 153, 0, 0.5])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / -50%)')
    expect(res).toEqual(['rgb', 0, 153, 0, 0])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.6 0 / 150%)')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0.3 0.5 0.7 / none)')
    expect(res).toEqual(['rgb', 76, 127, 179, 0])
  })

  it('should get value', () => {
    const res = func('color(srgb none 0.5 0.7)')
    expect(res).toEqual(['rgb', 0, 128, 178, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0.3 none 0.7)')
    expect(res).toEqual(['rgb', 76, 0, 178, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0.3 0.5 none)')
    expect(res).toEqual(['rgb', 77, 127, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb none 50% 70%)')
    expect(res).toEqual(['rgb', 0, 128, 178, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 30% none 70%)')
    expect(res).toEqual(['rgb', 76, 0, 178, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 30% 50% none)')
    expect(res).toEqual(['rgb', 77, 127, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb none none none / none)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb', 'none', 'none', 'none', 'none'])
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)')
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0 0)')
    expect(res).toEqual(['rgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 1 1 1)')
    const val = func('color(srgb 1 1 1)')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 0 1 0)')
    const val = color.resolveColorValue('lab(87.8185% -79.271 80.9946)')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 43.5% 1.7% 5.5%)')
    const val = func('color(srgb 0.691 0.139 0.259)')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(srgb-linear none 0.5 0.7)')
    expect(res).toEqual(['rgb', 0, 188, 218, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 0.3 none 0.7)')
    expect(res).toEqual(['rgb', 149, 0, 218, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 0.3 0.5 none)')
    expect(res).toEqual(['rgb', 149, 188, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb-linear none 50% 70%)')
    expect(res).toEqual(['rgb', 0, 188, 218, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 30% none 70%)')
    expect(res).toEqual(['rgb', 149, 0, 218, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 30% 50% none)')
    expect(res).toEqual(['rgb', 149, 188, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 0.26374 0.59085 0.16434 / 1)')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 26.374% 59.085% 16.434%)')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 0.21604 0.49418 0.13151)')
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 0 0 0)')
    expect(res).toEqual(['rgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 1 1 1)')
    expect(res).toEqual(['rgb', 255, 255, 255, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 0 1 0)')
    const val = color.resolveColorValue('lab(86.61399% -106.539 102.871)')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(display-p3 1 1 0.330897)')
    const val = color.resolveColorValue('yellow')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(display-p3 0.465377 0.532768 0.317713)')
    const val = color.resolveColorValue('lch(54% 35 118)')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(display-p3 none 0.5 0.7)')
    expect(res).toEqual(['rgb', 0, 130, 183, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 0.3 none 0.7)')
    expect(res).toEqual(['rgb', 84, 0, 186, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 0.3 0.5 none)')
    expect(res).toEqual(['rgb', 57, 129, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 none 50% 70%)')
    expect(res).toEqual(['rgb', 0, 130, 183, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 30% none 70%)')
    expect(res).toEqual(['rgb', 84, 0, 186, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 30% 50% none)')
    expect(res).toEqual(['rgb', 57, 129, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 0.299218 0.533327 0.120785 / 1)')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 29.9218% 53.3327% 12.0785%)')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 0.235202 0.431704 0.085432)')
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 0 0 0)')
    expect(res).toEqual(['rgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 1 1 1)')
    expect(res).toEqual(['rgb', 255, 255, 255, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 0 1 0)')
    const val = color.resolveColorValue('lab(85.7729% -160.7259 109.2319)')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(rec2020 none 0.5 0.7)')
    expect(res).toEqual(['rgb', 0, 147, 192, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 0.3 none 0.7)')
    expect(res).toEqual(['rgb', 104, 0, 196, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 0.3 0.5 none)')
    expect(res).toEqual(['rgb', 41, 145, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 none 50% 70%)')
    expect(res).toEqual(['rgb', 0, 147, 192, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 30% none 70%)')
    expect(res).toEqual(['rgb', 104, 0, 196, 1])
  })

  it('should get value', () => {
    const res = func('color(rec2020 30% 50% none)')
    expect(res).toEqual(['rgb', 41, 145, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 0.33582 0.59441 0.13934 / 1)')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 33.582% 59.441% 13.934%)')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 0.281363 0.498012 0.116746)')
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 0 0 0)')
    expect(res).toEqual(['rgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 1 1 1)')
    expect(res).toEqual(['rgb', 255, 255, 255, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 0 1 0)')
    const val = color.resolveColorValue('lab(83.2141% -129.1072 87.1718)')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(a98-rgb none 0.5 0.7)')
    expect(res).toEqual(['rgb', 0, 129, 182, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 0.3 none 0.7)')
    expect(res).toEqual(['rgb', 89, +0, 183, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 0.3 0.5 none)')
    expect(res).toEqual(['rgb', 29, 129, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb none 50% 70%)')
    expect(res).toEqual(['rgb', 0, 129, 182, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 30% none 70%)')
    expect(res).toEqual(['rgb', 89, +0, 183, 1])
  })

  it('should get value', () => {
    const res = func('color(a98-rgb 30% 50% none)')
    expect(res).toEqual(['rgb', 29, 129, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.2861 0.49131 0.16133 / 1)')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 28.610% 49.131% 16.133%)')
    expect(res).toEqual(['rgb', 0, 153, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.230479 0.395789 0.129968)')
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 0 0)')
    expect(res).toEqual(['rgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 1 1 1)')
    expect(res).toEqual(['rgb', 255, 255, 255, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0 1 0)')
    const val = color.resolveColorValue('lab(87.5745% -186.6921 150.9905)')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb none 0.5 0.7)')
    expect(res).toEqual(['rgb', 0, 160, 198, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.3 none 0.7)')
    expect(res).toEqual(['rgb', 76, 0, 205, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 0.3 0.5 none)')
    expect(res).toEqual(['rgb', 43, 155, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb none 50% 70%)')
    expect(res).toEqual(['rgb', 0, 160, 198, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 30% none 70%)')
    expect(res).toEqual(['rgb', 76, 0, 205, 1])
  })

  it('should get value', () => {
    const res = func('color(prophoto-rgb 30% 50% none)')
    expect(res).toEqual(['rgb', 43, 155, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)')
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d65 0.07719 0.15438 0.02573)')
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 7.719% 15.438% 2.573%)')
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0 0 0)')
    expect(res).toEqual(['rgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 1 1 1)')
    const val = color.resolveColorValue('lab(100.115% 9.06448 5.80177)')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(xyz 0 1 0)')
    const val = color.resolveColorValue('lab(99.6289% -354.58 146.707)')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 0.08312 0.154746 0.020961)')
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 8.312% 15.4746% 2.0961%)')
    expect(res).toEqual(['rgb', 0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 0 0 0)')
    expect(res).toEqual(['rgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 1 1 1)')
    const val = color.resolveColorValue('lab(100% 6.1097 -13.2268)')
    expect(res).toEqual(val)
  })

  it('should get value', () => {
    const res = func('color(xyz none 0.5 0.7)')
    expect(res).toEqual(['rgb', 0, 251, 209, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.3 none 0.7)')
    expect(res).toEqual(['rgb', 207, 0, 225, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.3 0.5 none)')
    expect(res).toEqual(['rgb', 125, 210, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz none 50% 70%)')
    expect(res).toEqual(['rgb', 0, 251, 209, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 30% none 70%)')
    expect(res).toEqual(['rgb', 207, 0, 225, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 30% 50% none)')
    expect(res).toEqual(['rgb', 125, 210, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d65 none 0.5 0.7)')
    expect(res).toEqual(['rgb', 0, 251, 209, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d65 0.3 none 0.7)')
    expect(res).toEqual(['rgb', 207, 0, 225, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d65 0.3 0.5 none)')
    expect(res).toEqual(['rgb', 125, 210, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d65 none 50% 70%)')
    expect(res).toEqual(['rgb', 0, 251, 209, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d65 30% none 70%)')
    expect(res).toEqual(['rgb', 207, 0, 225, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d65 30% 50% none)')
    expect(res).toEqual(['rgb', 125, 210, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 none 0.5 0.7)')
    expect(res).toEqual(['rgb', 0, 253, 240, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 0.3 none 0.7)')
    expect(res).toEqual(['rgb', 203, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 0.3 0.5 none)')
    expect(res).toEqual(['rgb', 102, 213, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 none 50% 70%)')
    expect(res).toEqual(['rgb', 0, 253, 240, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 30% none 70%)')
    expect(res).toEqual(['rgb', 203, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 30% 50% none)')
    expect(res).toEqual(['rgb', 102, 213, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz none none none / none)', {
      format: 'specifiedValue',
    })
    expect(res).toEqual(['xyz-d65', 'none', 'none', 'none', 'none'])
  })
})

describe('convert color value to linear rgb', () => {
  const func = color.convertColorToLinearRgb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get null', () => {
    const res = func('color(srgb-linear foo bar baz)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get null', () => {
    const res = func('rgb(foo bar baz)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)')
    expect(res).toEqual([0, 0.21586, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb-linear 0 0.21586 0)', {
      format: 'mixValue',
    })
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0, 0.21586, 0, 1])
  })

  it('should get value', () => {
    const res = func('green')
    res[1] = parseFloat(res[1].toFixed(5))
    expect(res).toEqual([0, 0.21586, 0, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue',
    })
    res[1] = parseFloat(res[1].toFixed(5))
    expect(res).toEqual([0, 0.21586, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 1 1 1 / 0.5)')
    res[0] = parseFloat(res[0].toFixed(5))
    expect(res).toEqual([1, 1, 1, 0.5])
  })

  it('should get value', () => {
    const res = func('lab(87.8185% -79.271 80.9946)')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    expect(res).toEqual([0, 1, 0, 1])
  })
})

describe('convert color value to rgb', () => {
  const func = color.convertColorToRgb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get null', () => {
    const res = func('foo', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('green')
    expect(res).toEqual([0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue',
    })
    expect(res).toEqual([0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0 / 0.5)')
    expect(res).toEqual([0, 127.5, 0, 0.5])
  })

  it('should get value', () => {
    const res = func('color(srgb 0 0.5 0 / 0.5)', {
      format: 'mixValue',
    })
    expect(res).toEqual([0, 128, 0, 0.5])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)')
    expect(res).toEqual([0, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('lab(46.2775% -47.5621 48.5837)')
    res[1] = parseFloat(res[1].toFixed(3))
    res[2] = parseFloat(res[2].toFixed(3))
    expect(res).toEqual([0, 128.002, 0.01, 1])
  })

  it('should get value', () => {
    const res = func('lab(46.2775% -47.5621 48.5837)', {
      format: 'mixValue',
    })
    expect(res).toEqual([0, 128, 0, 1])
  })
})

describe('convert color value to xyz', () => {
  const func = color.convertColorToXyz as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get null', () => {
    const res = func('foo', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)')
    expect(res).toEqual([0.07719, 0.15438, 0.02573, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue',
    })
    expect(res).toEqual([0.07719, 0.15438, 0.02573, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 0 1 0)')
    expect(res).toEqual([0.265668, 0.691739, 0.0451134, 1])
  })

  it('should get value', () => {
    const res = func('green')
    expect(res).toEqual([0.0771883, 0.154377, 0.0257294, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue',
    })
    expect(res).toEqual([0.0771883, 0.154377, 0.0257294, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz-d50 0.08312 0.154746 0.020961)', {
      d50: true,
    })
    expect(res).toEqual([0.08312, 0.15475, 0.020961, 1])
  })

  it('should get value', () => {
    const res = func('color(display-p3 0 1 0)', {
      d50: true,
    })
    expect(res).toEqual([0.29201, 0.692223, 0.0418783, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      d50: true,
    })
    expect(res).toEqual([0.083139, 0.154748, 0.020956, 1])
  })
})

describe('convert color value to hsl', () => {
  const func = color.convertColorToHsl as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get null', () => {
    const res = func('hsl(foo, bar, baz)', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get null', () => {
    const res = func('foo', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('hsl(120deg 100% 25% / 1)')
    expect(res).toEqual([120, 100, 25, 1])
  })

  it('should get value', () => {
    const res = func('hsl(120deg 100% 25% / 1)', {
      format: 'mixValue',
    })
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 100, 25, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)')
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 100, 25, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue',
    })
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 100, 25, 1])
  })

  it('should get value', () => {
    const res = func('green')
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 100, 25, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue',
    })
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 100, 25, 1])
  })
})

describe('convert color value to hwb', () => {
  const func = color.convertColorToHwb as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get null', () => {
    const res = func('foo', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('hwb(120 0% 49.8039%)')
    expect(res).toEqual([120, 0, 49.8039, 1])
  })

  it('should get value', () => {
    const res = func('hwb(120 0% 49.8039%)', {
      format: 'mixValue',
    })
    expect(res).toEqual([120, 0, 49.8039, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)')
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 0, 50, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue',
    })
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 0, 50, 1])
  })

  it('should get value', () => {
    const res = func('green')
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 0, 50, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue',
    })
    res[2] = Math.round(res[2])
    expect(res).toEqual([120, 0, 50, 1])
  })
})

describe('convert color value to lab', () => {
  const func = color.convertColorToLab as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get null', () => {
    const res = func('foo', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('lab(46.2775% -47.5621 48.5837)')
    expect(res).toEqual([46.2775, -47.5621, 48.5837, 1])
  })

  it('should get value', () => {
    const res = func('lab(46.2775% -47.5621 48.5837)', {
      format: 'mixValue',
    })
    expect(res).toEqual([46.2775, -47.5621, 48.5837, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([46.27817, -47.55277, 48.58663, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue',
    })
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([46.27817, -47.55277, 48.58663, 1])
  })

  it('should get value', () => {
    const res = func('green')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([46.27776, -47.55263, 48.5864, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue',
    })
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([46.27776, -47.55263, 48.5864, 1])
  })
})

describe('convert color value to lch', () => {
  const func = color.convertColorToLch as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get null', () => {
    const res = func('foo', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)')
    expect(res).toEqual([46.2775, 67.9892, 134.391, 1])
  })

  it('should get value', () => {
    const res = func('lch(46.2775% 67.9892 134.3912)', {
      format: 'mixValue',
    })
    expect(res).toEqual([46.2775, 67.9892, 134.391, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([46.27817, 67.98475, 134.38388, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue',
    })
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([46.27817, 67.98475, 134.38388, 1])
  })

  it('should get value', () => {
    const res = func('green')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([46.27776, 67.98449, 134.38393, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue',
    })
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([46.27776, 67.98449, 134.38393, 1])
  })
})

describe('convert color value to oklab', () => {
  const func = color.convertColorToOklab as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get null', () => {
    const res = func('foo', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)')
    expect(res).toEqual([0.51975, -0.1403, 0.10768, 1])
  })

  it('should get value', () => {
    const res = func('oklab(51.975% -0.1403 0.10768)', {
      format: 'mixValue',
    })
    expect(res).toEqual([0.51975, -0.1403, 0.10768, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.51976, -0.1403, 0.10768, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue',
    })
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.51976, -0.1403, 0.10768, 1])
  })

  it('should get value', () => {
    const res = func('green')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.51975, -0.1403, 0.10768, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue',
    })
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.51975, -0.1403, 0.10768, 1])
  })
})

describe('convert color value to oklch', () => {
  const func = color.convertColorToOklch as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get null', () => {
    const res = func('foo', {
      format: 'mixValue',
    })
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)')
    expect(res).toEqual([0.51975, 0.17686, 142.495, 1])
  })

  it('should get value', () => {
    const res = func('oklch(51.975% 0.17686 142.495)', {
      format: 'mixValue',
    })
    expect(res).toEqual([0.51975, 0.17686, 142.495, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.51976, 0.17686, 142.49535, 1])
  })

  it('should get value', () => {
    const res = func('color(xyz 0.07719 0.15438 0.02573)', {
      format: 'mixValue',
    })
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.51976, 0.17686, 142.49535, 1])
  })

  it('should get value', () => {
    const res = func('green')
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.51975, 0.17686, 142.49541, 1])
  })

  it('should get value', () => {
    const res = func('green', {
      format: 'mixValue',
    })
    res[0] = parseFloat(res[0].toFixed(5))
    res[1] = parseFloat(res[1].toFixed(5))
    res[2] = parseFloat(res[2].toFixed(5))
    expect(res).toEqual([0.51975, 0.17686, 142.49541, 1])
  })
})

describe('resolve color-mix()', () => {
  const func = color.resolveColorMix as Function

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string')
  })

  it('should get value', () => {
    const res = func('color-mix(in foo, blue, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in foo, blue, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue -10%, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in srgb, blue -10%, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 110%, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in srgb, blue 110%, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red -10%)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in srgb, blue, red -10%)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red 110%)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in srgb, blue, red 110%)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue -10%, red 10%)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in srgb, blue -10%, red 10%)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 110%, red 10%)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in srgb, blue 110%, red 10%)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 10%, red -10%)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in srgb, blue 10%, red -10%)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 10%, red 110%)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in srgb, blue 10%, red 110%)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 0%, red 0%)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in srgb, blue 0%, red 0%)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, foo, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in srgb, foo, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, color(srgb 0 0 1), red)')
    expect(res).toEqual(['rgb', 128, 0, 128, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb 0 0 1), color(srgb 1 0 0 / .5))',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in srgb, color(srgb 0 0 1), color(srgb 1 0 0 / 0.5))',
    )
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb 0 0 1 / .5), color(srgb 1 0 0))',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in srgb, color(srgb 0 0 1 / 0.5), color(srgb 1 0 0))',
    )
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb 0 0 1 / .5), color(srgb 1 0 0))',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in srgb, color(srgb 0 0 1 / 0.5), color(srgb 1 0 0))',
    )
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, #0000ff 50%, rgb(255 0 0 / .5))', {
      format: 'specifiedValue',
    })
    expect(res).toBe('color-mix(in srgb, rgb(0, 0, 255), rgba(255, 0, 0, 0.5))')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, #0000ff 40%, rgb(255 0 0 / .5))', {
      format: 'specifiedValue',
    })
    expect(res).toBe(
      'color-mix(in srgb, rgb(0, 0, 255) 40%, rgba(255, 0, 0, 0.5))',
    )
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgb(0 0 255 / .5), #ff0000 50%)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('color-mix(in srgb, rgba(0, 0, 255, 0.5), rgb(255, 0, 0))')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgb(0 0 255 / .5), #ff0000 40%)', {
      format: 'specifiedValue',
    })
    expect(res).toBe(
      'color-mix(in srgb, rgba(0, 0, 255, 0.5) 60%, rgb(255, 0, 0))',
    )
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 60%, red 60%)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('color-mix(in srgb, blue 60%, red 60%)')
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lab, lab(62.2345% -34.9638 47.7721), lch(62.2345% 59.2 126.2 / .5))',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in lab, lab(62.2345 -34.9638 47.7721), lch(62.2345 59.2 126.2 / 0.5))',
    )
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lab, lab(62.2345% -34.9638 47.7721 / .5), lch(62.2345% 59.2 126.2))',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in lab, lab(62.2345 -34.9638 47.7721 / 0.5), lch(62.2345 59.2 126.2))',
    )
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, color(srgb 0 0 1), red)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb', 0.5, 0, 0.5, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, currentcolor, red)')
    expect(res).toEqual(['rgb', 255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, currentcolor)')
    expect(res).toEqual(['rgb', 0, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgba(0 0 255 / .5), currentcolor)')
    expect(res).toEqual(['rgb', 0, 0, 255, 0.5])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, red)')
    expect(res).toEqual(['rgb', 128, 0, 128, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, green)')
    expect(res).toEqual(['rgb', 0, 64, 128, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, #0000ff, #008000)')
    expect(res).toEqual(['rgb', 0, 64, 128, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgb(0 0 255), rgb(0 128 0))')
    expect(res).toEqual(['rgb', 0, 64, 128, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, hsl(240 100% 50%), hsl(120 100% 25%))')
    expect(res).toEqual(['rgb', 0, 64, 128, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, hwb(240 0% 0%), hwb(120 0% 50%))')
    expect(res).toEqual(['rgb', 0, 64, 128, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgba(255, 0, 0, 0.2), red)')
    expect(res).toEqual(['rgb', 255, 0, 0, 0.6])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 80%, red 80%)')
    expect(res).toEqual(['rgb', 128, 0, 128, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 10%, red)')
    expect(res).toEqual(['rgb', 230, 0, 26, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue 100%, red)')
    expect(res).toEqual(['rgb', 0, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, rgba(0, 0, 255, 0.5) 100%, red)')
    expect(res).toEqual(['rgb', 0, 0, 255, 0.5])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, red, rgba(0, 0, 255, 0.5) 100%)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb', 0, 0, 1, 0.5])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, rgb(100% 0% 0% / 0.7) 25%, rgb(0% 100% 0% / 0.2))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.538462, 0.461538, 0, 0.325])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, rgb(100% 0% 0% / 0.7) 20%, rgb(0% 100% 0% / 0.2) 60%)',
    )
    expect(res).toEqual(['rgb', 137, 118, 0, 0.26])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, blue, lab(46.2775% -47.5621 48.5837))')
    expect(res).toEqual(['rgb', 0, 64, 128, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, lab(46.2775% -47.5621 48.5837), blue)')
    expect(res).toEqual(['rgb', 0, 64, 128, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb 0 0.5 0 / 0), rgba(0 0 255 / 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0, 0.25, 0.5, 0])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, foo, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in srgb-linear, foo, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue, red)')
    expect(res).toEqual(['rgb', 128, 0, 127, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue, green)')
    expect(res).toEqual(['rgb', 0, 28, 127, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, #0000ff, #008000)')
    res[1] = parseFloat(res[1].toFixed(5))
    expect(res).toEqual(['rgb', 0, 28, 127, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, rgb(0 0 255), rgb(0 128 0))')
    expect(res).toEqual(['rgb', 0, 28, 127, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, rgb(0 0 255), rgb(0 128 0))', {
      format: 'computedValue',
    })
    res[1] = parseFloat(res[1].toFixed(5))
    expect(res).toEqual(['srgb-linear', 0, 0.107931, 0.5, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, hsl(240 100% 50%), hsl(120 100% 25%))',
    )
    expect(res).toEqual(['rgb', 0, 27, 127, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, hwb(240 0% 0%), hwb(120 0% 50%))',
    )
    expect(res).toEqual(['rgb', 0, 27, 127, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue 80%, red 80%)')
    expect(res).toEqual(['rgb', 128, 0, 127, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, green 50%, purple)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb-linear', 0.107931, 0.107931, 0.10793, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue 100%, red)')
    expect(res).toEqual(['rgb', 0, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, rgba(0, 0, 255, 0.5) 100%, red)',
    )
    expect(res).toEqual(['rgb', 0, 0, 255, 0.5])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, red, rgba(0, 0, 255, 0.5) 100%)',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(5))
    expect(res).toEqual(['srgb-linear', 0, 0, 1, 0.5])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, rgb(100% 0% 50% / 0.7) 25%, rgb(0% 100% 30% / 0.2))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb-linear', 0.538462, 0.461538, 0.149056, 0.325])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, currentColor, red)')
    expect(res).toEqual(['rgb', 255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb-linear, blue, currentColor)')
    expect(res).toEqual(['rgb', 0, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, rgb(0 128 0 / 0), color(srgb 0 0 1 / 0))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(3))
    expect(res).toEqual(['srgb-linear', 0, 0.107931, 0.5, 0])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz, foo, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in xyz, foo, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz, red, green)')
    expect(res).toEqual(['rgb', 188, 92, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz, red, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['xyz-d65', 0.24479, 0.183508, 0.0225301, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz, red, green 90%)')
    expect(res).toEqual(['rgb', 89, 122, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz, red 90%, green)')
    expect(res).toEqual(['rgb', 243, 40, 0, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz, color(srgb 1 0 0), color(srgb 0 0.5 0))',
    )
    expect(res).toEqual(['rgb', 188, 92, 0, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz, rgb(255 0 0 / 0.5), color(srgb 0 0.5 0 / 0.5))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['xyz-d65', 0.244464, 0.182858, 0.0224217, 0.5])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz-d65, red, green)')
    expect(res).toEqual(['rgb', 188, 92, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz-d65, red, green 90%)')
    expect(res).toEqual(['rgb', 89, 122, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz-d65, red 90%, green)')
    expect(res).toEqual(['rgb', 243, 40, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz, currentColor, red)')
    expect(res).toEqual(['rgb', 255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz, blue, currentColor)')
    expect(res).toEqual(['rgb', 0, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz, rgb(0 0 255 / 0), rgb(0 128 0 / 0))', {
      format: 'computedValue',
    })
    expect(res).toEqual(['xyz-d65', 0.128835, 0.113285, 0.488131, 0])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, foo, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in xyz-d50, foo, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, red, green)')
    expect(res).toEqual(['rgb', 188, 92, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, red, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['xyz-d50', 0.259603, 0.18862, 0.0174399, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, red, green 90%)')
    expect(res).toEqual(['rgb', 89, 122, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, red 90%, green)')
    expect(res).toEqual(['rgb', 243, 40, 0, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, color(srgb 1 0 0), color(srgb 0 0.5 0))',
    )
    expect(res).toEqual(['rgb', 188, 92, 0, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, rgb(255 0 0 / 0.5), color(srgb 0 0.5 0 / 0.5))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['xyz-d50', 0.259252, 0.187968, 0.0173516, 0.5])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, currentColor, blue)')
    expect(res).toEqual(['rgb', 0, 0, 255, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in xyz-d50, red, currentColor)')
    expect(res).toEqual(['rgb', 255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, rgb(0 128 0 / 0), rgb(255 0 0 / 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['xyz-d50', 0.259603, 0.18862, 0.0174399, 0])
  })

  it('should get value', () => {
    const res = func('color-mix(in hsl, foo, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in hsl, foo, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in hsl, blue, green)')
    expect(res).toEqual(['rgb', 0, 192, 192, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hsl, blue, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb', 0, 0.752941, 0.752941, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, color(srgb 0 0 1), color(srgb 0 0.5 0))',
    )
    expect(res).toEqual(['rgb', 0, 192, 192, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hsl, white, green)')
    expect(res).toEqual(['rgb', 64, 255, 64, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20%), hsl(30 30% 40%))')
    expect(res).toEqual(['rgb', 84, 92, 61, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20%) 25%, hsl(30 30% 40%))')
    expect(res).toEqual(['rgb', 112, 106, 67, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20%), hsl(30 30% 40%) 25%)')
    expect(res).toEqual(['rgb', 61, 73, 54, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120 10% 20%) 25%, hsl(30 30% 40%) 75%)',
    )
    expect(res).toEqual(['rgb', 112, 106, 67, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120 10% 20%) 30%, hsl(30 30% 40%) 90%)',
    )
    expect(res).toEqual(['rgb', 112, 106, 67, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120 10% 20%) 12.5%, hsl(30 30% 40%) 37.5%)',
    )
    expect(res).toEqual(['rgb', 112, 106, 67, 0.5])
  })

  it('should get value', () => {
    const res = func('color-mix(in hsl, hsl(120 10% 20%) 0%, hsl(30 30% 40%))')
    expect(res).toEqual(['rgb', 133, 102, 71, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120 10% 20% / .4), hsl(30 30% 40% / .8))',
    )
    expect(res).toEqual(['rgb', 95, 105, 65, 0.6])
  })

  it('should get value', () => {
    const res = func('color-mix(in hsl, currentcolor, red)')
    expect(res).toEqual(['rgb', 255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hsl, red, currentcolor)')
    expect(res).toEqual(['rgb', 255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, color(srgb 1 0 0 / 0), hsl(120 100% 25% / 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.74902, 0.74902, 0, 0])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120 10% 20%) 25%, hsl(30 30% 40% / .8))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.423529, 0.403922, 0.258824, 0.85])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120 10% 20% / .4), hsl(30 30% 40% / .8) 25%)',
    )
    expect(res).toEqual(['rgb', 68, 84, 59, 0.5])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120 10% 20% / .4) 25%, hsl(30 30% 40% / .8) 75%)',
    )
    expect(res).toEqual(['rgb', 120, 114, 69, 0.7])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120 10% 20% / .4) 30%, hsl(30 30% 40% / .8) 90%)',
    )
    expect(res).toEqual(['rgb', 120, 114, 69, 0.7])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120 10% 20% / .4) 12.5%, hsl(30 30% 40% / .8) 37.5%)',
    )
    expect(res).toEqual(['rgb', 120, 114, 69, 0.35])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120 10% 20% / .4) 0%, hsl(30 30% 40% / .8))',
    )
    expect(res).toEqual(['rgb', 133, 102, 71, 0.8])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl shorter hue, hsl(120 10% 20% / .4) 0%, hsl(30 30% 40% / .8))',
    )
    expect(res).toEqual(['rgb', 133, 102, 71, 0.8])
  })

  it('should get value', () => {
    const res = func('color-mix(in hwb, foo, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in hwb, foo, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in hwb, blue, green)')
    expect(res).toEqual(['rgb', 0, 192, 192, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hwb, blue, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['srgb', 0, 0.752941, 0.752941, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, color(srgb 0 0 1), color(srgb 0 0.5 0))',
    )
    expect(res).toEqual(['rgb', 0, 192, 192, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hwb, white, green)')
    expect(res).toEqual(['rgb', 128, 192, 128, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(0 100% 0%), hwb(0 0% 100%))')
    expect(res).toEqual(['rgb', 128, 128, 128, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20%), hwb(30 30% 40%))')
    expect(res).toEqual(['rgb', 147, 179, 51, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20%) 25%, hwb(30 30% 40%))')
    expect(res).toEqual(['rgb', 166, 153, 64, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20%), hwb(30 30% 40%) 25%)')
    expect(res).toEqual(['rgb', 96, 191, 38, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120 10% 20%) 25%, hwb(30 30% 40%) 75%)',
    )
    expect(res).toEqual(['rgb', 166, 153, 64, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120 10% 20%) 30%, hwb(30 30% 40%) 90%)',
    )
    expect(res).toEqual(['rgb', 166, 153, 64, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120 10% 20%) 12.5%, hwb(30 30% 40%) 37.5%)',
    )
    expect(res).toEqual(['rgb', 166, 153, 64, 0.5])
  })

  it('should get value', () => {
    const res = func('color-mix(in hwb, hwb(120 10% 20%) 0%, hwb(30 30% 40%))')
    expect(res).toEqual(['rgb', 153, 115, 77, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120 10% 20% / .4), hwb(30 30% 40% / .8))',
    )
    expect(res).toEqual(['rgb', 142, 170, 60, 0.6])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120 10% 20%) 25%, hwb(30 30% 40% / .8))',
    )
    expect(res).toEqual(['rgb', 168, 155, 62, 0.85])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120 10% 20% / .4), hwb(30 30% 40% / .8) 25%)',
    )
    expect(res).toEqual(['rgb', 98, 184, 46, 0.5])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120 10% 20% / .4) 25%, hwb(30 30% 40% / .8) 75%)',
    )
    expect(res).toEqual(['rgb', 160, 149, 69, 0.7])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120 10% 20% / .4) 30%, hwb(30 30% 40% / .8) 90%)',
    )
    expect(res).toEqual(['rgb', 160, 149, 69, 0.7])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120 10% 20% / .4) 12.5%, hwb(30 30% 40% / .8) 37.5%)',
    )
    expect(res).toEqual(['rgb', 160, 149, 69, 0.35])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120 10% 20% / .4) 0%, hwb(30 30% 40% / .8))',
    )
    expect(res).toEqual(['rgb', 153, 115, 77, 0.8])
  })

  it('should get value', () => {
    const res = func('color-mix(in hwb, currentcolor, red)')
    expect(res).toEqual(['rgb', 255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in hwb, red, currentcolor)')
    expect(res).toEqual(['rgb', 255, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120 0% 49.8039% / 0), color(srgb 1 0 0 / 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.752941, 0.752941, 0, 0])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb shorter hue, hwb(120 0% 49.8039% / 0), color(srgb 1 0 0 / 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.752941, 0.752941, 0, 0])
  })

  it('should get value', () => {
    const res = func('color-mix(in lab, foo, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in lab, foo, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in lab, red, green)')
    expect(res).toEqual(['rgb', 161, 108, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in lab, red, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lab', 50.2841, 16.6262, 59.2387, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lab, color(srgb 1 0 0 / 0.5), color(srgb 0 0.5 0))',
    )
    expect(res).toEqual(['rgb', 126, 117, 0, 0.75])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lab, color(srgb 1 0 0 / 0.5), color(srgb 0 0.5 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lab', 48.8316, -4.67711, 55.5965, 0.75])
  })

  it('should get value', () => {
    const res = func('color-mix(in lab, red, green 90%)')
    expect(res).toEqual(['rgb', 65, 126, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in lab, red 90%, green)')
    expect(res).toEqual(['rgb', 237, 55, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in lab, currentcolor, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lab', 46.2778, -47.5526, 48.5864, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in lab, green, currentcolor)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lab', 46.2778, -47.5526, 48.5864, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lab, color(srgb 1 0 0 / 0), rgb(0 128 0 / 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lab', 50.2841, 16.6262, 59.2387, 0])
  })

  it('should get value', () => {
    const res = func('color-mix(in lch, foo, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in lch, foo, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in lch, red, green)')
    expect(res).toEqual(['rgb', 145, 116, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in lch, red, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lch', 50.2841, 87.4109, 87.6208, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch, color(srgb 1 0 0 / 0.5), color(srgb 0 0.5 0))',
    )
    expect(res).toEqual(['rgb', 140, 113, 0, 0.75])
  })

  it('should get value', () => {
    const res = func('color-mix(in lch, red, green 90%)')
    expect(res).toEqual(['rgb', 49, 128, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in lch, red 90%, green)')
    expect(res).toEqual(['rgb', 235, 59, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in lch, currentcolor, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lch', 46.2778, 67.9845, 134.384, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in lch, green, currentcolor)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lch', 46.2778, 67.9845, 134.384, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in lch, rgb(255 0 0 / 0), rgb(0 128 0 / 0))', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lch', 50.2841, 87.4109, 87.6208, 0])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch shorter hue, rgb(255 0 0 / 0), rgb(0 128 0 / 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 50.2841, 87.4109, 87.6208, 0])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklab, foo, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in oklab, foo, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in oklab, red, green)')
    expect(res).toEqual(['rgb', 166, 105, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklab, red, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklab', 0.573854, 0.0422802, 0.116761, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklab, color(srgb 1 0 0 / 0.5), rgb(0 0.5 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['oklab', 0.240129, 0.0666374, 0.0483318, 0.75])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklab, red, green 90%)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklab', 0.530572, -0.103786, 0.109493, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklab, red 90%, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklab', 0.617135, 0.188347, 0.124029, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklab, currentcolor, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklab', 0.519752, -0.140303, 0.107676, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklab, red, currentcolor)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklab', 0.627955, 0.224863, 0.125846, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklab, rgb(255 0 0 / 0), rgb(0 128 0 / 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['oklab', 0.573854, 0.0422802, 0.116761, 0])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklch, foo, red)')
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get empty string', () => {
    const res = func('color-mix(in oklch, foo, red)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('color-mix(in oklch, red, green)')
    expect(res).toEqual(['rgb', 176, 102, 0, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklch, red, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklch', 0.573854, 0.217271, 85.8646, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklch, color(srgb 1 0 0 / 0.5), rgb(0 0.5 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['oklch', 0.240129, 0.0963786, 85.8646, 0.75])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklch, red, green 90%)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklch', 0.530572, 0.184941, 131.169, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklch, red 90%, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklch', 0.617135, 0.249601, 40.56, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklch, currentcolor, green)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklch', 0.519752, 0.176859, 142.495, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in oklch, red, currentcolor)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['oklch', 0.627955, 0.257683, 29.2339, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklch, rgb(255 0 0 / 0), rgb(0 128 0 / 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['oklch', 0.573854, 0.217271, 85.8646, 0])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklch shorter hue, rgb(255 0 0 / 0), rgb(0 128 0 / 0))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['oklch', 0.573854, 0.217271, 85.8646, 0])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color-mix(in srgb, red, blue), color-mix(in srgb, transparent, #008000))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.333333, 0.16732, 0.333333, 0.75])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color-mix(in srgb, red, blue), color-mix(in srgb, transparent, #008000))',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in srgb, color-mix(in srgb, red, blue), color-mix(in srgb, transparent, rgb(0, 128, 0)))',
    )
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, purple, color-mix(in srgb, transparent, #008000))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.334641, 0.16732, 0.334641, 0.75])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, purple, color-mix(in srgb, transparent, #008000))',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in srgb, purple, color-mix(in srgb, transparent, rgb(0, 128, 0)))',
    )
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color-mix(in srgb, transparent, #008000), purple)',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.334641, 0.16732, 0.334641, 0.75])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color-mix(in srgb, transparent, #008000), purple)',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in srgb, color-mix(in srgb, transparent, rgb(0, 128, 0)), purple)',
    )
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklab, color-mix(in lab, lab(46.2775% -47.5621 48.5837), blue), purple)',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['oklab', 0.44711, 0.0903907, -0.0947484, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklab, color-mix(in lab, lab(46.2775% -47.5621 48.5837), blue), purple)',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in oklab, color-mix(in lab, lab(46.2775 -47.5621 48.5837), blue), purple)',
    )
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklab, color-mix(in lab, lab(46.2775% -47.5621 48.5837 / .5), blue), purple)',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['oklab', 0.439, 0.109966, -0.128598, 0.875])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklab, color-mix(in lab, lab(46.2775% -47.5621 48.5837 / .5), blue), purple)',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in oklab, color-mix(in lab, lab(46.2775 -47.5621 48.5837 / 0.5), blue), purple)',
    )
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch, color-mix(in lch, lab(46.2775% -47.5621 48.5837 / .5), blue), purple)',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 32.0257, 85.385, 272.492, 0.875])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch shorter hue, color-mix(in lch, lab(46.2775% -47.5621 48.5837 / .5), blue), purple)',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 32.0257, 85.385, 272.492, 0.875])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch, color-mix(in lch, lab(46.2775% -47.5621 48.5837 / .5), blue), purple)',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in lch, color-mix(in lch, lab(46.2775 -47.5621 48.5837 / 0.5), blue), purple)',
    )
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch shorter hue, color-mix(in lch shorter hue, lab(46.2775% -47.5621 48.5837 / .5), blue), purple)',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe(
      'color-mix(in lch shorter hue, color-mix(in lch shorter hue, lab(46.2775 -47.5621 48.5837 / 0.5), blue), purple)',
    )
  })

  it('should get value', () => {
    const res = func('color-mix(in srgb, transparent, foo)', {
      format: 'computedValue',
    })
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color-mix(in srgb, transparent, foo), purple)',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['rgb', 0, 0, 0, 0])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color-mix(in srgb, transparent, foo), purple)',
      {
        format: 'specifiedValue',
      },
    )
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb none none none), color(srgb none none none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 'none', 'none', 'none', 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb none none none), color(srgb .5 .6 .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb', 0.5, 0.6, 0.7, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb .1 .2 .3), color(srgb none none none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb', 0.1, 0.2, 0.3, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb .1 .2 none), color(srgb .5 .6 .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb', 0.3, 0.4, 0.7, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb .1 .2 .3), color(srgb .5 .6 none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb', 0.3, 0.4, 0.3, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb none .2 .3), color(srgb .5 none .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb', 0.5, 0.2, 0.5, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb .1 .2 .3 / none), color(srgb .5 .6 .7 / .5))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb', 0.3, 0.4, 0.5, 0.5])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb .1 .2 .3 / 25%), color(srgb .5 none none / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.3, 0.2, 0.3, 0.25])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, color(srgb .1 .2 .3 / 25%), color(srgb none .5 none / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.1, 0.35, 0.3, 0.25])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb, rgb(0 127.5 0 / none), color(srgb 0 0 1 / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0, 0.25, 0.5, 'none'])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, color(srgb-linear none none none), color(srgb-linear none none none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb-linear', 'none', 'none', 'none', 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, color(srgb-linear none none none), color(srgb-linear .5 .6 .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb-linear', 0.5, 0.6, 0.7, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, color(srgb-linear .1 .2 .3), color(srgb-linear none none none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb-linear', 0.1, 0.2, 0.3, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, color(srgb-linear .1 .2 none), color(srgb-linear .5 .6 .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb-linear', 0.3, 0.4, 0.7, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, color(srgb-linear .1 .2 .3), color(srgb-linear .5 .6 none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb-linear', 0.3, 0.4, 0.3, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, color(srgb-linear none .2 .3), color(srgb-linear .5 none .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb-linear', 0.5, 0.2, 0.5, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, color(srgb-linear .1 .2 .3 / none), color(srgb-linear .5 .6 .7 / .5))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['srgb-linear', 0.3, 0.4, 0.5, 0.5])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, color(srgb-linear .1 .2 .3 / 25%), color(srgb-linear .5 none none / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb-linear', 0.3, 0.2, 0.3, 0.25])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, color(srgb-linear .1 .2 .3 / 25%), color(srgb-linear none .5 none / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb-linear', 0.1, 0.35, 0.3, 0.25])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in srgb-linear, rgb(0 127.5 0 / none), color(srgb 0 0 1 / none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(5))
    expect(res).toEqual(['srgb-linear', 0, 0.107021, 0.5, 'none'])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d65, color(xyz-d65 none none none), color(xyz-d65 none none none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['xyz-d65', 'none', 'none', 'none', 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d65, color(xyz-d65 none none none), color(xyz-d65 .5 .6 .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d65', 0.5, 0.6, 0.7, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d65, color(xyz-d65 .1 .2 .3), color(xyz-d65 none none none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d65', 0.1, 0.2, 0.3, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d65, color(xyz-d65 .1 .2 none), color(xyz-d65 .5 .6 .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d65', 0.3, 0.4, 0.7, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d65, color(xyz-d65 .1 .2 .3), color(xyz-d65 .5 .6 none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d65', 0.3, 0.4, 0.3, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d65, color(xyz-d65 none .2 .3), color(xyz-d65 .5 none .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d65', 0.5, 0.2, 0.5, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d65, color(xyz-d65 .1 .2 .3 / none), color(xyz-d65 .5 .6 .7 / .5))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d65', 0.3, 0.4, 0.5, 0.5])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d65, color(xyz-d65 .1 .2 .3 / 25%), color(xyz-d65 .5 none none / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['xyz-d65', 0.3, 0.2, 0.3, 0.25])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d65, color(xyz-d65 .1 .2 .3 / 25%), color(xyz-d65 none .5 none / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['xyz-d65', 0.1, 0.35, 0.3, 0.25])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d65, rgb(0 127.5 0 / none), color(srgb 0 0 1 / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['xyz-d65', 0.128509, 0.112634, 0.488022, 'none'])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, color(xyz-d50 none none none), color(xyz-d50 none none none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['xyz-d50', 'none', 'none', 'none', 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, color(xyz-d50 none none none), color(xyz-d50 .5 .6 .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d50', 0.5, 0.6, 0.7, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, color(xyz-d50 .1 .2 .3), color(xyz-d50 none none none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d50', 0.1, 0.2, 0.3, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, color(xyz-d50 .1 .2 none), color(xyz-d50 .5 .6 .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d50', 0.3, 0.4, 0.7, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, color(xyz-d50 .1 .2 .3), color(xyz-d50 .5 .6 none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d50', 0.3, 0.4, 0.3, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, color(xyz-d50 none .2 .3), color(xyz-d50 .5 none .7))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d50', 0.5, 0.2, 0.5, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, color(xyz-d50 .1 .2 .3 / none), color(xyz-d50 .5 .6 .7 / .5))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(1))
    res[2] = parseFloat(res[2].toFixed(1))
    res[3] = parseFloat(res[3].toFixed(1))
    expect(res).toEqual(['xyz-d50', 0.3, 0.4, 0.5, 0.5])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, color(xyz-d50 .1 .2 .3 / 25%), color(xyz-d50 .5 none none / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['xyz-d50', 0.3, 0.2, 0.3, 0.25])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, color(xyz-d50 .1 .2 .3 / 25%), color(xyz-d50 none .5 none / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['xyz-d50', 0.1, 0.35, 0.3, 0.25])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in xyz-d50, rgb(0 127.5 0 / none), color(srgb 0 0 1 / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['xyz-d50', 0.112758, 0.107031, 0.367439, 'none'])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(none none none), hsl(none none none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(none none none), hsl(30deg 40% 80%))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    res[3] = parseFloat(res[3].toFixed(2))
    expect(res).toEqual(['srgb', 0.88, 0.8, 0.72, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120deg 20% 40%), hsl(none none none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    res[3] = parseFloat(res[3].toFixed(2))
    expect(res).toEqual(['srgb', 0.32, 0.48, 0.32, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, hsl(120deg 40% 40% / none), hsl(0deg 40% 40% / none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    res[3] = parseFloat(res[3].toFixed(2))
    expect(res).toEqual(['srgb', 0.56, 0.56, 0.24, 'none'])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl, rgb(0 127.5 0 / none), color(srgb 0 0 1 / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0, 0.752941, 0.752941, 'none'])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(none none none), hwb(none none none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    res[3] = parseFloat(res[3].toFixed(2))
    expect(res).toEqual(['srgb', 1, 0, 0, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(none none none), hwb(30deg 30% 40%))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    res[3] = parseFloat(res[3].toFixed(2))
    expect(res).toEqual(['srgb', 0.6, 0.45, 0.3, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120deg 10% 20%), hwb(none none none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(2))
    res[2] = parseFloat(res[2].toFixed(2))
    res[3] = parseFloat(res[3].toFixed(2))
    expect(res).toEqual(['srgb', 0.1, 0.8, 0.1, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, hwb(120deg 10% 20% / none), hwb(30deg 30% 40% / none))',
      {
        format: 'computedValue',
      },
    )
    res[1] = parseFloat(res[1].toFixed(3))
    res[2] = parseFloat(res[2].toFixed(3))
    res[3] = parseFloat(res[3].toFixed(3))
    expect(res).toEqual(['srgb', 0.576, 0.702, 0.2, 'none'])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb, rgb(0 127.5 0 / none), color(srgb 0 0 1 / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0, 0.752941, 0.752941, 'none'])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch, lch(none none none), lch(none none none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 'none', 'none', 'none', 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch, lch(none none none), lch(50 60 70deg))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 50, 60, 70, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch, lch(10 20 30deg), lch(none none none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 10, 20, 30, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch, lch(10 20 30deg / none), lch(50 60 70deg / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 30, 40, 50, 'none'])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch, rgb(0 127.5 0 / none), color(srgb 0 0 1 / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 37.8353, 99.4969, 217.874, 'none'])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lab, lab(none none none), lab(none none none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lab', 'none', 'none', 'none', 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in lab, lab(none none none), lab(50 60 70))', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lab', 50, 60, 70, 1])
  })

  it('should get value', () => {
    const res = func('color-mix(in lab, lab(10 20 30), lab(none none none))', {
      format: 'computedValue',
    })
    expect(res).toEqual(['lab', 10, 20, 30, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lab, lab(10 20 30 / none), lab(50 60 70 / none))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lab', 30, 40, 50, 'none'])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl shorter hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.74902, 0.666667, 0.25098, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl longer hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.25098, 0.333333, 0.74902, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl increasing hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.74902, 0.666667, 0.25098, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hsl decreasing hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.25098, 0.333333, 0.74902, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb shorter hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.6, 0.54902, 0.301961, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb shorter hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.6, 0.54902, 0.301961, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb longer hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.301961, 0.34902, 0.6, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb increasing hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.6, 0.54902, 0.301961, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in hwb decreasing hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['srgb', 0.301961, 0.34902, 0.6, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch shorter hue, lch(100 0 40deg), lch(100 0 60deg))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 100, 0, 50, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch longer hue, lch(100 0 40deg), lch(100 0 60deg))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 100, 0, 230, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch increasing hue, lch(100 0 40deg), lch(100 0 60deg))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 100, 0, 50, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in lch decreasing hue, lch(100 0 40deg), lch(100 0 60deg))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['lch', 100, 0, 230, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklch shorter hue, oklch(1 0 40deg), oklch(1 0 60deg))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['oklch', 1, 0, 50, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklch longer hue, oklch(1 0 40deg), oklch(1 0 60deg))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['oklch', 1, 0, 230, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklch increasing hue, oklch(1 0 40deg), oklch(1 0 60deg))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['oklch', 1, 0, 50, 1])
  })

  it('should get value', () => {
    const res = func(
      'color-mix(in oklch decreasing hue, oklch(1 0 40deg), oklch(1 0 60deg))',
      {
        format: 'computedValue',
      },
    )
    expect(res).toEqual(['oklch', 1, 0, 230, 1])
  })
})
