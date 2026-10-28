import { describe, expect, it } from 'vitest'

import library from '../themes/library.json'

describe('theme library', () => {
  it('bundles the V1 theme set', () => {
    expect(library.length).toBeGreaterThanOrEqual(60)
  })

  it('has unique ids and names', () => {
    const ids = library.map((theme) => theme.id)
    const names = library.map((theme) => theme.name)

    expect(new Set(ids).size).toBe(library.length)
    expect(new Set(names).size).toBe(library.length)
  })

  it('gives every theme a tags array', () => {
    library.forEach((theme) => {
      expect(Array.isArray(theme.tags)).toBe(true)
    })
  })
})
