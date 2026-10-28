import { DRACULA_SHADCN_CSS } from '@renderer/config/themePresets'
import { describe, expect, it } from 'vitest'

import {
  BUILTIN_THEME_ID,
  getOfficialTheme,
  getThemeCss,
  getThemeKey,
  getThemePrimary,
  isOfficialThemeId,
  resolveColorPrimary
} from '../ThemeService'

const SWISS_THEME_ID = getThemeKey(111)
const USER_COLOR = '#123456'

describe('ThemeService', () => {
  describe('theme ids', () => {
    it('builds and recognizes official theme ids', () => {
      expect(getThemeKey(111)).toBe('official:111')
      expect(isOfficialThemeId('official:111')).toBe(true)
      expect(isOfficialThemeId(BUILTIN_THEME_ID)).toBe(false)
    })

    it('returns null for builtin, malformed and unknown ids', () => {
      expect(getOfficialTheme(BUILTIN_THEME_ID)).toBeNull()
      expect(getOfficialTheme('official:not-a-number')).toBeNull()
      expect(getOfficialTheme('official:999999')).toBeNull()
    })

    it('looks up an official theme by id', () => {
      expect(getOfficialTheme(SWISS_THEME_ID)?.name).toBe('Swiss')
    })
  })

  describe('getThemePrimary', () => {
    it('returns the primary color for the requested mode', () => {
      expect(getThemePrimary(SWISS_THEME_ID, 'light')).toBe('#80372B')
      expect(getThemePrimary(SWISS_THEME_ID, 'dark')).toBe('#C98B79')
    })

    it('returns null for non-official themes', () => {
      expect(getThemePrimary(BUILTIN_THEME_ID, 'light')).toBeNull()
      expect(getThemePrimary('official:999999', 'dark')).toBeNull()
    })
  })

  describe('resolveColorPrimary', () => {
    it('uses the official theme primary when the user color is not overridden', () => {
      expect(resolveColorPrimary(SWISS_THEME_ID, 'light', USER_COLOR, false)).toBe('#80372B')
      expect(resolveColorPrimary(SWISS_THEME_ID, 'dark', USER_COLOR, false)).toBe('#C98B79')
    })

    it('uses the user color when the theme color is overridden', () => {
      expect(resolveColorPrimary(SWISS_THEME_ID, 'light', USER_COLOR, true)).toBe(USER_COLOR)
    })

    it('always uses the user color for the builtin theme', () => {
      expect(resolveColorPrimary(BUILTIN_THEME_ID, 'light', USER_COLOR, false)).toBe(USER_COLOR)
      expect(resolveColorPrimary(BUILTIN_THEME_ID, 'dark', USER_COLOR, true)).toBe(USER_COLOR)
    })

    it('falls back to the user color for unknown theme ids', () => {
      expect(resolveColorPrimary('official:999999', 'light', USER_COLOR, false)).toBe(USER_COLOR)
    })

    it('falls back to the user color when the persisted theme id is missing', () => {
      expect(resolveColorPrimary(undefined, 'light', USER_COLOR, false)).toBe(USER_COLOR)
      expect(getThemePrimary(undefined, 'dark')).toBeNull()
    })
  })

  describe('getThemeCss', () => {
    it('returns the builtin Dracula CSS for the default theme', async () => {
      await expect(getThemeCss(BUILTIN_THEME_ID)).resolves.toBe(DRACULA_SHADCN_CSS)
    })

    it('rejects unknown theme ids', async () => {
      await expect(getThemeCss('official:999999')).rejects.toThrow('Unknown theme')
    })
  })
})
