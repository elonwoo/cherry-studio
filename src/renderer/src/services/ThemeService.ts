import type { ThemeMeta } from '@renderer/assets/themes'
import { loadThemeCss, THEME_LIBRARY } from '@renderer/assets/themes'
import { DRACULA_SHADCN_CSS } from '@renderer/config/themePresets'

export const BUILTIN_THEME_ID = 'default'

const OFFICIAL_THEME_PREFIX = 'official:'

export type ThemeColorMode = 'light' | 'dark'

export function isOfficialThemeId(themeId?: string | null): boolean {
  return typeof themeId === 'string' && themeId.startsWith(OFFICIAL_THEME_PREFIX)
}

export function getThemeKey(id: number): string {
  return `${OFFICIAL_THEME_PREFIX}${id}`
}

export function getOfficialTheme(themeId?: string | null): ThemeMeta | null {
  if (!themeId || !isOfficialThemeId(themeId)) {
    return null
  }

  const rawId = themeId.slice(OFFICIAL_THEME_PREFIX.length)
  if (!/^\d+$/.test(rawId)) {
    return null
  }

  return THEME_LIBRARY.find((theme) => theme.id === Number(rawId)) ?? null
}

export async function getThemeCss(themeId: string): Promise<string> {
  if (!themeId) {
    throw new Error('Theme id is required')
  }

  if (themeId === BUILTIN_THEME_ID) {
    return DRACULA_SHADCN_CSS
  }

  const theme = getOfficialTheme(themeId)
  if (!theme) {
    throw new Error(`Unknown theme: ${themeId}`)
  }

  return loadThemeCss(theme.id)
}

export function getThemePrimary(themeId: string | null | undefined, mode: ThemeColorMode): string | null {
  const theme = getOfficialTheme(themeId)
  if (!theme) {
    return null
  }

  return mode === 'dark' ? theme.primaryDark : theme.primaryLight
}

export function resolveColorPrimary(
  themeId: string | null | undefined,
  mode: ThemeColorMode,
  userColor: string,
  override: boolean
): string {
  if (!override) {
    const themePrimary = getThemePrimary(themeId, mode)
    if (themePrimary) {
      return themePrimary
    }
  }

  return userColor
}
