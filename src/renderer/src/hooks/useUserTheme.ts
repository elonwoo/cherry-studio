import { resolveColorPrimary } from '@renderer/services/ThemeService'
import { useAppDispatch, useAppSelector } from '@renderer/store'
import type { UserTheme } from '@renderer/store/settings'
import { setUserTheme } from '@renderer/store/settings'
import { ThemeMode } from '@renderer/types'
import Color from 'color'

type InitOptions = {
  // 用户手动改主色时绕过「跟随主题」逻辑
  colorPrimaryOverride?: boolean
}

export default function useUserTheme() {
  const userTheme = useAppSelector((state) => state.settings.userTheme)
  const themeId = useAppSelector((state) => state.settings.themeId)
  const themeColorOverride = useAppSelector((state) => state.settings.themeColorOverride)
  const settedTheme = useAppSelector((state) => state.settings.theme)

  const mode =
    settedTheme === ThemeMode.dark
      ? 'dark'
      : settedTheme === ThemeMode.light
        ? 'light'
        : (window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false)
          ? 'dark'
          : 'light'
  const resolvedColorPrimary = resolveColorPrimary(themeId, mode, userTheme.colorPrimary, themeColorOverride)

  const dispatch = useAppDispatch()

  const initUserTheme = (theme: UserTheme = userTheme, options: InitOptions = {}) => {
    const colorPrimaryValue = options.colorPrimaryOverride
      ? theme.colorPrimary
      : resolveColorPrimary(themeId, mode, theme.colorPrimary, themeColorOverride)
    const colorPrimary = Color(colorPrimaryValue)

    document.body.style.setProperty('--color-primary', colorPrimary.toString())
    document.body.style.setProperty('--primary', colorPrimary.toString())
    document.body.style.setProperty('--color-primary-soft', colorPrimary.alpha(0.6).toString())
    document.body.style.setProperty('--color-primary-mute', colorPrimary.alpha(0.3).toString())

    // Set font family CSS variables
    document.documentElement.style.setProperty('--user-font-family', `'${theme.userFontFamily}'`)
    document.documentElement.style.setProperty('--user-code-font-family', `'${theme.userCodeFontFamily}'`)
  }

  return {
    colorPrimary: Color(resolvedColorPrimary),

    initUserTheme,

    setUserTheme(userTheme: UserTheme, options: InitOptions = {}) {
      dispatch(setUserTheme(userTheme))

      initUserTheme(userTheme, options)
    }
  }
}
