/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/**
 * common.test.js
 */

import { describe, expect, it } from 'vitest'
import * as common from '../src/js/common.js'

describe('get type', () => {
  const func = common.getType as Function

  it('should get Array', () => {
    const res = func([])
    expect(res).toBe('Array')
  })

  it('should get Object', () => {
    const res = func({})
    expect(res).toBe('Object')
  })

  it('should get String', () => {
    const res = func('')
    expect(res).toBe('String')
  })

  it('should get Number', () => {
    const res = func(1)
    expect(res).toBe('Number')
  })

  it('should get Boolean', () => {
    const res = func(true)
    expect(res).toBe('Boolean')
  })

  it('should get Undefined', () => {
    const res = func()
    expect(res).toBe('Undefined')
  })

  it('should get Null', () => {
    const res = func(null)
    expect(res).toBe('Null')
  })
})

describe('is string', () => {
  const func = common.isString

  it('should get false', () => {
    const items = [[], ['foo'], {}, { foo: 'bar' }, undefined, null, 1, true]
    for (const item of items) {
      expect(func(item)).toBe(false)
    }
  })

  it('should get true', () => {
    const items = ['', 'foo']
    for (const item of items) {
      expect(func(item)).toBe(true)
    }
  })
})
