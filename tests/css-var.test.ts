/**
 * css-var.test.js
 */

import { describe, it, beforeEach, afterEach, expect } from 'vitest'
import * as custom from '../src/js/css-var.js'

describe('resolve CSS variable', () => {
  const func = custom.resolveCustomProperty as Function

  beforeEach(() => {
    custom.cachedResults.clear()
  })
  afterEach(() => {
    custom.cachedResults.clear()
  })

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not an array.')
  })

  it('should throw', () => {
    expect(() => func(['foo'])).toThrow(TypeError)
    expect(() => func(['foo'])).toThrow('foo is not an array.')
  })

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      [')-token', ')'],
    ])
    expect(res).toEqual([[], undefined])
  })

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
    ])
    expect(res).toEqual([[], 'red'])
  })

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')'],
    ])
    expect(res).toEqual([[[')-token', ')']], 'red'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'blue',
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], 'blue'])
  })

  it('should get value', () => {
    const getPropertyValue = (v) => {
      let res
      switch (v) {
        case '--foo':
          res = 'blue'
          break
        case '--bar':
          res = 'green'
          break
        default:
      }
      return res
    }
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          callback: getPropertyValue,
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], 'blue'])
  })

  it('should get value', () => {
    const getPropertyValue = (v) => {
      let res
      switch (v) {
        case '--bar':
          res = 'green'
          break
        case '--baz':
          res = 'yellow'
          break
        default:
      }
      return res
    }
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          callback: getPropertyValue,
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], 'red'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['ident-token', '--FOO'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'blue',
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], 'red'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': '20px',
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], 'red'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--bar': 'blue',
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], 'red'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'currentColor',
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], 'currentColor'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'var(--bar)',
          '--bar': 'blue',
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], 'blue'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'var(--bar)',
          '--bar': 'initial',
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], 'red'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', '10px'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'var(--bar)',
          '--bar': '20px',
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], '20px'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'rgb(255 0 calc(255 / 2))',
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], 'rgb(255 0 127.5)'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'color-mix(in oklab, rgb(255 0 0), green)',
        },
      },
    )
    expect(res).toEqual([
      [[')-token', ')']],
      'color-mix(in oklab, rgb(255 0 0), green)',
    ])
  })

  it('should get value', () => {
    const res = func(
      [
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'transparent',
        },
      },
    )
    expect(res).toEqual([[[')-token', ')']], 'transparent'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['function-token', 'var('],
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'blue',
        },
      },
    )
    expect(res).toEqual([[], 'blue'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['function-token', 'var('],
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'calc(1 / 2)',
        },
      },
    )
    expect(res).toEqual([[], 'red'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['function-token', 'var('],
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', '1'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'calc(1 / 2)',
        },
      },
    )
    expect(res).toEqual([[], '0.5'])
  })

  it('should get value', () => {
    const res = func(
      [
        ['function-token', 'var('],
        ['ident-token', '--foo'],
        ['comma-token', ','],
        ['whitespace-token', ' '],
        ['ident-token', 'red'],
        [')-token', ')'],
        [')-token', ')'],
      ],
      {
        customProperty: {
          '--foo': 'initial',
        },
      },
    )
    expect(res).toEqual([[], 'red'])
  })
})

describe('parse tokens', () => {
  const func = custom.parseTokens as Function

  beforeEach(() => {
    custom.cachedResults.clear()
  })
  afterEach(() => {
    custom.cachedResults.clear()
  })

  it('should get null', () => {
    const res = func([
      ['function-token', 'var('],
      ['ident-token', '--foo'],
      [')-token', ')'],
    ])
    expect(res).toBe(null)
  })

  it('should get value', () => {
    const res = func([
      ['function-token', 'var('],
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
    ])
    expect(res).toEqual(['red'])
  })

  it('should get value', () => {
    const res = func([
      ['function-token', 'calc('],
      ['whitespace-token', ' '],
      ['function-token', 'var('],
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      ['whitespace-token', ' '],
      [')-token', ')'],
    ])
    expect(res).toEqual(['calc(', 'red', ')'])
  })

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      [')-token', ')'],
      ['whitespace-token', ' '],
      [')-token', ')'],
    ])
    expect(res).toEqual(['--foo', ')', ')'])
  })

  it('should get value', () => {
    const res = func([[')-token', ')']])
    expect(res).toEqual([')'])
  })
})

describe('resolve CSS var()', () => {
  const func = custom.cssVar as Function

  beforeEach(() => {
    custom.cachedResults.clear()
  })
  afterEach(() => {
    custom.cachedResults.clear()
  })

  it('should throw', () => {
    expect(() => func()).toThrow(TypeError)
    expect(() => func()).toThrow('undefined is not a string.')
  })

  it('should get value', () => {
    const res = func('')
    expect(res).toBe('')
  })

  it('should get value', () => {
    const res = func('foo')
    expect(res).toBe('foo')
  })

  it('should get value', () => {
    const res = func('var(--foo)', {
      format: 'specifiedValue',
    })
    expect(res).toBe('var(--foo)')
  })

  it('should get null', () => {
    const res = func('var(--foo)')
    expect(res).toBe(null)

    const res2 = func('var(--foo)')
    expect(res2).toBe(null)
  })

  it('should get value', () => {
    const res = func('var(--foo)', {
      customProperty: {
        '--foo': 'red',
      },
    })
    expect(res).toBe('red')

    const res2 = func('var(--foo)', {
      customProperty: {
        '--foo': 'red',
      },
    })
    expect(res2).toBe('red')
  })

  it('should get value', () => {
    const getPropertyValue = (v: string) => {
      let res
      switch (v) {
        case '--foo':
          res = 'blue'
          break
        case '--bar':
          res = 'green'
          break
        case '--baz':
          res = 'yellow'
          break
        default:
      }
      return res
    }
    const res = func('var(--foo)', {
      customProperty: {
        callback: getPropertyValue,
      },
    })
    expect(res).toBe('blue')

    const res2 = func('var(--foo)', {
      customProperty: {
        callback: getPropertyValue,
      },
    })
    expect(res2).toBe('blue')
  })

  it('should get value', () => {
    const colorMap = {
      '--foo': 'blue',
      '--bar': 'green',
      '--baz': 'yellow',
    } as Record<string, string>
    const getPropertyValue = (v: keyof typeof colorMap) => {
      const res = colorMap[v]
      return res
    }
    const res = func('var(--qux, red)', {
      customProperty: {
        callback: getPropertyValue,
      },
    })
    expect(res).toBe('red')

    colorMap['--qux'] = 'cyan'
    const res2 = func('var(--qux, red)', {
      customProperty: {
        callback: getPropertyValue,
      },
    })
    expect(res2).toBe('cyan')

    colorMap['--qux'] = 'teal'
    const res3 = func('var(--qux, red)', {
      customProperty: {
        callback: getPropertyValue,
      },
    })
    expect(res3).toBe('teal')
  })

  it('should get value', () => {
    const res = func('rgb( 0 calc( var( --max-rgb ) * var( --half ) ) 0 )', {
      customProperty: {
        '--half': '.5',
        '--max-rgb': '255',
      },
    })
    expect(res).toBe('rgb(0 127.5 0)')

    const res2 = func('rgb( 0 calc( var( --max-rgb ) * var( --half ) ) 0 )', {
      customProperty: {
        '--half': '.5',
        '--max-rgb': '255',
      },
    })
    expect(res2).toBe('rgb(0 127.5 0)')
  })
})
