import { describe, expect, it } from 'vitest'

import { APP_ICON_OPTIONS, DEFAULT_APP_ICON_ID, normalizeAppIconId } from '../config/appIcons'

describe('normalizeAppIconId', () => {
  it('returns a known icon id unchanged', () => {
    expect(normalizeAppIconId('golden')).toBe('golden')
    expect(normalizeAppIconId('pixel')).toBe('pixel')
  })

  it('returns the default icon id for an unknown value', () => {
    expect(normalizeAppIconId('unknown')).toBe(DEFAULT_APP_ICON_ID)
    expect(normalizeAppIconId('')).toBe(DEFAULT_APP_ICON_ID)
  })

  it('returns the default icon id for non-string values', () => {
    expect(normalizeAppIconId(undefined)).toBe(DEFAULT_APP_ICON_ID)
    expect(normalizeAppIconId(null)).toBe(DEFAULT_APP_ICON_ID)
    expect(normalizeAppIconId(42)).toBe(DEFAULT_APP_ICON_ID)
    expect(normalizeAppIconId({ id: 'neon' })).toBe(DEFAULT_APP_ICON_ID)
    expect(normalizeAppIconId(['neon'])).toBe(DEFAULT_APP_ICON_ID)
  })

  it('keeps every advertised option valid', () => {
    for (const option of APP_ICON_OPTIONS) {
      expect(normalizeAppIconId(option.id)).toBe(option.id)
    }
  })
})
