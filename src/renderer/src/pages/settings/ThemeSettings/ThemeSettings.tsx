import CodeEditor from '@renderer/components/CodeEditor'
import { HStack } from '@renderer/components/Layout'
import { isLinux, isMac, THEME_COLOR_PRESETS } from '@renderer/config/constant'
import { useTheme } from '@renderer/context/ThemeProvider'
import { useSettings } from '@renderer/hooks/useSettings'
import { useTimer } from '@renderer/hooks/useTimer'
import useUserTheme from '@renderer/hooks/useUserTheme'
import { resolveColorPrimary } from '@renderer/services/ThemeService'
import { useAppDispatch } from '@renderer/store'
import { setCustomCss, setThemeColorOverride } from '@renderer/store/settings'
import { ThemeMode } from '@renderer/types'
import { ColorPicker, Segmented, Switch } from 'antd'
import { Monitor, Moon, Sun } from 'lucide-react'
import type { FC } from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SettingContainer, SettingDivider, SettingGroup, SettingRow, SettingRowTitle, SettingTitle } from '..'
import ThemeLibrary from './ThemeLibrary'

const ColorCircleWrapper = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ColorCircle = styled.div<{ color: string; isActive?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  cursor: pointer;
  transform: translate(-50%, -50%);
  border: 2px solid ${(props) => (props.isActive ? 'var(--color-border)' : 'transparent')};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`

const TitleExtra = styled.div`
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  opacity: 0.7;
`

const ThemeSettings: FC = () => {
  const {
    userTheme,
    themeId,
    themeColorOverride,
    windowStyle,
    setWindowStyle,
    useSystemTitleBar,
    setUseSystemTitleBar,
    customCss
  } = useSettings()
  const { theme, settedTheme, setTheme } = useTheme()
  const { setUserTheme } = useUserTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { setTimeoutTimer } = useTimer()

  const colorMode = theme === 'dark' ? 'dark' : 'light'
  const resolvedColorPrimary = resolveColorPrimary(themeId, colorMode, userTheme.colorPrimary, themeColorOverride)

  const handleWindowStyleChange = useCallback(
    (checked: boolean) => {
      setWindowStyle(checked ? 'transparent' : 'opaque')
    },
    [setWindowStyle]
  )

  const handleUseSystemTitleBarChange = (checked: boolean) => {
    window.modal.confirm({
      title: t('settings.use_system_title_bar.confirm.title'),
      content: t('settings.use_system_title_bar.confirm.content'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      centered: true,
      onOk() {
        setUseSystemTitleBar(checked)
        setTimeoutTimer(
          'handleUseSystemTitleBarChange',
          () => {
            void window.api.relaunchApp()
          },
          500
        )
      }
    })
  }

  const handleColorPrimaryChange = useCallback(
    (colorHex: string) => {
      setUserTheme(
        {
          ...userTheme,
          colorPrimary: colorHex
        },
        { colorPrimaryOverride: true }
      )
      dispatch(setThemeColorOverride(true))
    },
    [dispatch, setUserTheme, userTheme]
  )

  const themeOptions = useMemo(
    () => [
      {
        value: ThemeMode.light,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sun size={16} />
            <span>{t('settings.theme.light')}</span>
          </div>
        )
      },
      {
        value: ThemeMode.dark,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Moon size={16} />
            <span>{t('settings.theme.dark')}</span>
          </div>
        )
      },
      {
        value: ThemeMode.system,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Monitor size={16} />
            <span>{t('settings.theme.system')}</span>
          </div>
        )
      }
    ],
    [t]
  )

  return (
    <SettingContainer theme={theme}>
      <SettingGroup theme={theme}>
        <SettingTitle>{t('settings.display.title')}</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.theme.title')}</SettingRowTitle>
          <Segmented value={settedTheme} shape="round" onChange={setTheme} options={themeOptions} />
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.theme.color_primary')}</SettingRowTitle>
          <HStack gap="12px" alignItems="center">
            <HStack gap="12px">
              {THEME_COLOR_PRESETS.map((color) => (
                <ColorCircleWrapper key={color}>
                  <ColorCircle
                    color={color}
                    isActive={resolvedColorPrimary.toLowerCase() === color.toLowerCase()}
                    onClick={() => handleColorPrimaryChange(color)}
                  />
                </ColorCircleWrapper>
              ))}
            </HStack>
            <ColorPicker
              style={{ fontFamily: 'inherit' }}
              className="color-picker"
              value={resolvedColorPrimary}
              onChange={(color) => handleColorPrimaryChange(color.toHexString())}
              showText
              size="small"
              presets={[
                {
                  label: 'Presets',
                  colors: THEME_COLOR_PRESETS
                }
              ]}
            />
          </HStack>
        </SettingRow>
        {isMac && (
          <>
            <SettingDivider />
            <SettingRow>
              <SettingRowTitle>{t('settings.theme.window.style.transparent')}</SettingRowTitle>
              <Switch checked={windowStyle === 'transparent'} onChange={handleWindowStyleChange} />
            </SettingRow>
          </>
        )}
        {isLinux && (
          <>
            <SettingDivider />
            <SettingRow>
              <SettingRowTitle>{t('settings.use_system_title_bar.title')}</SettingRowTitle>
              <Switch checked={useSystemTitleBar} onChange={handleUseSystemTitleBarChange} />
            </SettingRow>
          </>
        )}
      </SettingGroup>
      <SettingGroup theme={theme}>
        <ThemeLibrary />
      </SettingGroup>
      <SettingGroup theme={theme}>
        <SettingTitle>
          {t('settings.display.custom.css.label')}
          <TitleExtra onClick={() => window.api.openWebsite('https://cherrycss.com/')}>
            {t('settings.display.custom.css.cherrycss')}
          </TitleExtra>
        </SettingTitle>
        <SettingDivider />
        <CodeEditor
          value={customCss}
          language="css"
          placeholder={t('settings.display.custom.css.placeholder')}
          onChange={(value) => dispatch(setCustomCss(value))}
          height="60vh"
          expanded={false}
          wrapped
          options={{
            autocompletion: true,
            lineNumbers: true,
            foldGutter: true,
            keymap: true
          }}
          style={{
            outline: '0.5px solid var(--color-border)',
            borderRadius: '5px'
          }}
        />
      </SettingGroup>
    </SettingContainer>
  )
}

export default ThemeSettings
