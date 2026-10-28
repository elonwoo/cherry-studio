import { ResetIcon } from '@renderer/components/Icons'
import TextBadge from '@renderer/components/TextBadge'
import { DEFAULT_SIDEBAR_ICONS } from '@renderer/config/sidebar'
import { useTheme } from '@renderer/context/ThemeProvider'
import { useNavbarPosition, useSettings } from '@renderer/hooks/useSettings'
import useUserTheme from '@renderer/hooks/useUserTheme'
import { useAppDispatch } from '@renderer/store'
import type { AssistantIconType } from '@renderer/store/settings'
import {
  setAssistantIconType,
  setClickAssistantToShowTopic,
  setPinTopicsToTop,
  setShowTopicTime,
  setSidebarIcons
} from '@renderer/store/settings'
import { Button, Segmented, Select, Switch, Tooltip } from 'antd'
import { Minus, Plus } from 'lucide-react'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SettingContainer, SettingDivider, SettingGroup, SettingRow, SettingRowTitle, SettingTitle } from '..'
import SidebarIconsManager from './SidebarIconsManager'

const DisplaySettings: FC = () => {
  const {
    topicPosition,
    setTopicPosition,
    clickAssistantToShowTopic,
    showTopicTime,
    pinTopicsToTop,
    sidebarIcons,
    assistantIconType,
    userTheme
  } = useSettings()
  const { navbarPosition, setNavbarPosition } = useNavbarPosition()
  const { theme } = useTheme()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [currentZoom, setCurrentZoom] = useState(1.0)
  const { setUserTheme } = useUserTheme()

  const [visibleIcons, setVisibleIcons] = useState(sidebarIcons?.visible || DEFAULT_SIDEBAR_ICONS)
  const [disabledIcons, setDisabledIcons] = useState(sidebarIcons?.disabled || [])
  const [fontList, setFontList] = useState<string[]>([])

  const handleReset = useCallback(() => {
    setVisibleIcons([...DEFAULT_SIDEBAR_ICONS])
    setDisabledIcons([])
    dispatch(setSidebarIcons({ visible: DEFAULT_SIDEBAR_ICONS, disabled: [] }))
  }, [dispatch])

  useEffect(() => {
    // 初始化获取所有系统字体
    void window.api.getSystemFonts().then((fonts: string[]) => {
      setFontList(fonts)
    })

    // 初始化获取当前缩放值
    void window.api.handleZoomFactor(0).then((factor) => {
      setCurrentZoom(factor)
    })

    const handleResize = () => {
      void window.api.handleZoomFactor(0).then((factor) => {
        setCurrentZoom(factor)
      })
    }
    // 添加resize事件监听
    window.addEventListener('resize', handleResize)

    // 清理事件监听，防止内存泄漏
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleZoomFactor = async (delta: number, reset: boolean = false) => {
    const zoomFactor = await window.api.handleZoomFactor(delta, reset)
    setCurrentZoom(zoomFactor)
  }

  const handleUserFontChange = useCallback(
    (value: string) => {
      setUserTheme({
        ...userTheme,
        userFontFamily: value
      })
    },
    [setUserTheme, userTheme]
  )

  const handleUserCodeFontChange = useCallback(
    (value: string) => {
      setUserTheme({
        ...userTheme,
        userCodeFontFamily: value
      })
    },
    [setUserTheme, userTheme]
  )

  const assistantIconTypeOptions = useMemo(
    () => [
      { value: 'model', label: t('settings.assistant.icon.type.model') },
      { value: 'emoji', label: t('settings.assistant.icon.type.emoji') },
      { value: 'none', label: t('settings.assistant.icon.type.none') }
    ],
    [t]
  )

  const renderFontOption = useCallback(
    (font: string) => (
      <Tooltip title={font} placement="left" mouseEnterDelay={0.5}>
        <div
          className="truncate"
          style={{
            fontFamily: font
          }}>
          {font}
        </div>
      </Tooltip>
    ),
    []
  )

  return (
    <SettingContainer theme={theme}>
      <SettingGroup theme={theme}>
        <SettingTitle style={{ justifyContent: 'flex-start', gap: 5 }}>
          {t('settings.display.navbar.title')} <TextBadge text="New" />
        </SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.display.navbar.position.label')}</SettingRowTitle>
          <Segmented
            value={navbarPosition}
            shape="round"
            onChange={setNavbarPosition}
            options={[
              { label: t('settings.display.navbar.position.left'), value: 'left' },
              { label: t('settings.display.navbar.position.top'), value: 'top' }
            ]}
          />
        </SettingRow>
      </SettingGroup>
      <SettingGroup theme={theme}>
        <SettingTitle>{t('settings.display.zoom.title')}</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.zoom.title')}</SettingRowTitle>
          <ZoomButtonGroup>
            <Button onClick={() => handleZoomFactor(-0.1)} icon={<Minus size="14" />} color="default" variant="text" />
            <ZoomValue>{Math.round(currentZoom * 100)}%</ZoomValue>
            <Button onClick={() => handleZoomFactor(0.1)} icon={<Plus size="14" />} color="default" variant="text" />
            <Button
              onClick={() => handleZoomFactor(0, true)}
              style={{ marginLeft: 8 }}
              icon={<ResetIcon size="14" />}
              color="default"
              variant="text"
            />
          </ZoomButtonGroup>
        </SettingRow>
      </SettingGroup>
      <SettingGroup theme={theme}>
        <SettingTitle style={{ justifyContent: 'flex-start', gap: 5 }}>
          {t('settings.display.font.title')} <TextBadge text="New" />
        </SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.display.font.global')}</SettingRowTitle>
          <SelectRow>
            <Select
              style={{ width: 280 }}
              placeholder={t('settings.display.font.select')}
              options={[
                {
                  label: (
                    <span style={{ fontFamily: 'Ubuntu, -apple-system, system-ui, Arial, sans-serif' }}>
                      {t('settings.display.font.default')}
                    </span>
                  ),
                  value: ''
                },
                ...fontList.map((font) => ({ label: renderFontOption(font), value: font }))
              ]}
              value={userTheme.userFontFamily || ''}
              onChange={(font) => handleUserFontChange(font)}
              showSearch
              getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
            />
            <Button
              onClick={() => handleUserFontChange('')}
              style={{ marginLeft: 8 }}
              icon={<ResetIcon size="14" />}
              color="default"
              variant="text"
            />
          </SelectRow>
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.display.font.code')}</SettingRowTitle>
          <SelectRow>
            <Select
              style={{ width: 280 }}
              placeholder={t('settings.display.font.select')}
              options={[
                {
                  label: (
                    <span style={{ fontFamily: 'Ubuntu, -apple-system, system-ui, Arial, sans-serif' }}>
                      {t('settings.display.font.default')}
                    </span>
                  ),
                  value: ''
                },
                ...fontList.map((font) => ({ label: renderFontOption(font), value: font }))
              ]}
              value={userTheme.userCodeFontFamily || ''}
              onChange={(font) => handleUserCodeFontChange(font)}
              showSearch
              getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
            />
            <Button
              onClick={() => handleUserCodeFontChange('')}
              style={{ marginLeft: 8 }}
              icon={<ResetIcon size="14" />}
              color="default"
              variant="text"
            />
          </SelectRow>
        </SettingRow>
      </SettingGroup>
      <SettingGroup theme={theme}>
        <SettingTitle>{t('settings.display.topic.title')}</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.topic.position.label')}</SettingRowTitle>
          <Segmented
            value={topicPosition || 'right'}
            shape="round"
            onChange={setTopicPosition}
            options={[
              { value: 'left', label: t('settings.topic.position.left') },
              { value: 'right', label: t('settings.topic.position.right') }
            ]}
          />
        </SettingRow>
        <SettingDivider />
        {topicPosition === 'left' && (
          <>
            <SettingRow>
              <SettingRowTitle>{t('settings.advanced.auto_switch_to_topics')}</SettingRowTitle>
              <Switch
                checked={clickAssistantToShowTopic}
                onChange={(checked) => dispatch(setClickAssistantToShowTopic(checked))}
              />
            </SettingRow>
            <SettingDivider />
          </>
        )}
        <SettingRow>
          <SettingRowTitle>{t('settings.topic.show.time')}</SettingRowTitle>
          <Switch checked={showTopicTime} onChange={(checked) => dispatch(setShowTopicTime(checked))} />
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.topic.pin_to_top')}</SettingRowTitle>
          <Switch checked={pinTopicsToTop} onChange={(checked) => dispatch(setPinTopicsToTop(checked))} />
        </SettingRow>
      </SettingGroup>
      <SettingGroup theme={theme}>
        <SettingTitle>{t('settings.display.assistant.title')}</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.assistant.icon.type.label')}</SettingRowTitle>
          <Segmented
            value={assistantIconType}
            shape="round"
            onChange={(value) => dispatch(setAssistantIconType(value as AssistantIconType))}
            options={assistantIconTypeOptions}
          />
        </SettingRow>
      </SettingGroup>
      {navbarPosition === 'left' && (
        <SettingGroup theme={theme}>
          <SettingTitle
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{t('settings.display.sidebar.title')}</span>
            <ResetButtonWrapper>
              <Button onClick={handleReset}>{t('common.reset')}</Button>
            </ResetButtonWrapper>
          </SettingTitle>
          <SettingDivider />
          <SidebarIconsManager
            visibleIcons={visibleIcons}
            disabledIcons={disabledIcons}
            setVisibleIcons={setVisibleIcons}
            setDisabledIcons={setDisabledIcons}
          />
        </SettingGroup>
      )}
    </SettingContainer>
  )
}

const ResetButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const ZoomButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 210px;
`
const ZoomValue = styled.span`
  width: 40px;
  text-align: center;
  margin: 0 5px;
`

const SelectRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 380px;
`

export default DisplaySettings
