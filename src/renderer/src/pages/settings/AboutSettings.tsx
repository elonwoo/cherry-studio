import { GithubOutlined } from '@ant-design/icons'
import IndicatorLight from '@renderer/components/IndicatorLight'
import { HStack } from '@renderer/components/Layout'
import UpdateDialogPopup from '@renderer/components/Popups/UpdateDialogPopup'
import { APP_NAME, AppLogo } from '@renderer/config/env'
import { useTheme } from '@renderer/context/ThemeProvider'
import { useRuntime } from '@renderer/hooks/useRuntime'
import { useSettings } from '@renderer/hooks/useSettings'
import i18n from '@renderer/i18n'
import { useAppDispatch } from '@renderer/store'
import { setUpdateState } from '@renderer/store/runtime'
import { runAsyncFunction } from '@renderer/utils'
import { APP_ICON_OPTIONS, type AppIconId, DEFAULT_APP_ICON_ID, normalizeAppIconId } from '@shared/config/appIcons'
import { Avatar, Button, Progress, Row, Switch, Tag } from 'antd'
import { debounce } from 'lodash'
import { Bug, ChevronLeft, ChevronRight, Github, Rss } from 'lucide-react'
import { BadgeQuestionMark } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { SettingContainer, SettingDivider, SettingGroup, SettingRow, SettingTitle } from '.'

const AboutSettings: FC = () => {
  const [version, setVersion] = useState('')
  const [isPortable, setIsPortable] = useState(false)
  const [appPath, setAppPath] = useState('')
  const [appIcon, setAppIconState] = useState<AppIconId>(DEFAULT_APP_ICON_ID)
  const { t } = useTranslation()
  const { autoCheckUpdate, setAutoCheckUpdate } = useSettings()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { update } = useRuntime()

  const onCheckUpdate = debounce(
    async () => {
      if (update.checking || update.downloading) {
        return
      }

      if (update.downloaded) {
        // Open update dialog directly in renderer
        void UpdateDialogPopup.show({ releaseInfo: update.info || null })
        return
      }

      dispatch(setUpdateState({ checking: true, manualCheck: true }))

      try {
        await window.api.checkForUpdate()
      } catch (error) {
        dispatch(setUpdateState({ manualCheck: false }))
        window.toast.error(t('settings.about.updateError'))
      }

      dispatch(setUpdateState({ checking: false }))
    },
    2000,
    { leading: true, trailing: false }
  )

  const onOpenWebsite = (url: string) => {
    void window.api.openWebsite(url)
  }

  const debug = async () => {
    await window.api.devTools.toggle()
  }

  const selectAppIcon = (id: AppIconId) => {
    setAppIconState(id)
    void window.api.setAppIcon(id)
  }

  const cycleAppIcon = (offset: number) => {
    const index = APP_ICON_OPTIONS.findIndex((option) => option.id === appIcon)
    const currentIndex = index >= 0 ? index : 0
    const nextIndex = (currentIndex + offset + APP_ICON_OPTIONS.length) % APP_ICON_OPTIONS.length
    selectAppIcon(APP_ICON_OPTIONS[nextIndex].id)
  }

  const currentAppIcon = APP_ICON_OPTIONS.find((option) => option.id === appIcon) ?? APP_ICON_OPTIONS[0]
  const currentAppIconSrc = appPath ? `file://${appPath}/resources/app-icons/${appIcon}.png` : AppLogo

  useEffect(() => {
    void runAsyncFunction(async () => {
      const appInfo = await window.api.getAppInfo()
      setVersion(appInfo.version)
      setIsPortable(appInfo.isPortable)
      setAppPath(appInfo.appPath)
      setAppIconState(normalizeAppIconId(await window.api.getAppIcon()))
    })
    setAutoCheckUpdate(autoCheckUpdate)
  }, [autoCheckUpdate, setAutoCheckUpdate])

  const onOpenDocs = () => {
    const isChinese = i18n.language.startsWith('zh')
    void window.api.openWebsite(isChinese ? 'https://docs.cherry-ai.com/' : 'https://docs.cherry-ai.com/docs/en-us')
  }

  return (
    <SettingContainer theme={theme}>
      <SettingGroup theme={theme}>
        <SettingTitle>
          {t('settings.about.title')}
          <HStack alignItems="center">
            <Link to="https://github.com/elonwoo/pear-studio">
              <GithubOutlined style={{ marginRight: 4, color: 'var(--color-text)', fontSize: 20 }} />
            </Link>
          </HStack>
        </SettingTitle>
        <SettingDivider />
        <AboutHeader>
          <Row align="middle">
            <AvatarWrapper onClick={() => onOpenWebsite('https://github.com/elonwoo/pear-studio')}>
              {update.downloadProgress > 0 && (
                <ProgressCircle
                  type="circle"
                  size={84}
                  percent={update.downloadProgress}
                  showInfo={false}
                  strokeLinecap="butt"
                  strokeColor="#67ad5b"
                />
              )}
              <Avatar src={currentAppIconSrc} size={80} style={{ minHeight: 80 }} />
            </AvatarWrapper>
            <VersionWrapper>
              <Title>{APP_NAME}</Title>
              <Description>{t('settings.about.description')}</Description>
              <Tag
                onClick={() => onOpenWebsite('https://github.com/elonwoo/pear-studio/releases')}
                color="cyan"
                style={{ marginTop: 8, cursor: 'pointer' }}>
                v{version}
              </Tag>
            </VersionWrapper>
          </Row>
          {!isPortable && (
            <CheckUpdateButton
              onClick={onCheckUpdate}
              loading={update.checking}
              disabled={update.downloading || update.checking}>
              {update.downloading
                ? t('settings.about.downloading')
                : update.available
                  ? t('settings.about.checkUpdate.available')
                  : t('settings.about.checkUpdate.label')}
            </CheckUpdateButton>
          )}
        </AboutHeader>
        {!isPortable && (
          <>
            <SettingDivider />
            <SettingRow>
              <SettingRowTitle>{t('settings.general.auto_check_update.title')}</SettingRowTitle>
              <Switch value={autoCheckUpdate} onChange={(v) => setAutoCheckUpdate(v)} />
            </SettingRow>
          </>
        )}
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.about.app_icon.title')}</SettingRowTitle>
          <HStack alignItems="center" gap={4}>
            <Button
              type="text"
              icon={<ChevronLeft size={18} />}
              aria-label={t('settings.about.app_icon.previous')}
              onClick={() => cycleAppIcon(-1)}
            />
            <AppIconPreview src={currentAppIconSrc} alt={currentAppIcon.label} />
            <Button
              type="text"
              icon={<ChevronRight size={18} />}
              aria-label={t('settings.about.app_icon.next')}
              onClick={() => cycleAppIcon(1)}
            />
          </HStack>
        </SettingRow>
      </SettingGroup>
      {update.info && update.available && (
        <SettingGroup theme={theme}>
          <SettingRow>
            <SettingRowTitle>
              {t('settings.about.updateAvailable', { version: update.info.version })}
              <IndicatorLight color="green" />
            </SettingRowTitle>
          </SettingRow>
          <UpdateNotesWrapper className="markdown">
            <Markdown>
              {typeof update.info.releaseNotes === 'string'
                ? update.info.releaseNotes.replace(/\n/g, '\n\n')
                : update.info.releaseNotes?.map((note) => note.note).join('\n')}
            </Markdown>
          </UpdateNotesWrapper>
        </SettingGroup>
      )}
      <SettingGroup theme={theme}>
        <SettingRow>
          <SettingRowTitle>
            <BadgeQuestionMark size={18} />
            {t('docs.title')}
          </SettingRowTitle>
          <Button onClick={onOpenDocs}>{t('docs.title')}</Button>
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>
            <Rss size={18} />
            {t('settings.about.releases.title')}
          </SettingRowTitle>
          <Button onClick={() => onOpenWebsite('https://github.com/elonwoo/pear-studio/releases')}>
            {t('settings.about.releases.button')}
          </Button>
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>
            <Github size={18} />
            {t('settings.about.feedback.title')}
          </SettingRowTitle>
          <Button onClick={() => onOpenWebsite('https://github.com/elonwoo/pear-studio/issues/new/choose')}>
            {t('settings.about.feedback.button')}
          </Button>
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>
            <Bug size={18} />
            {t('settings.about.debug.title')}
          </SettingRowTitle>
          <Button onClick={debug}>{t('settings.about.debug.open')}</Button>
        </SettingRow>
      </SettingGroup>
    </SettingContainer>
  )
}

const AboutHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 5px 0;
`

const VersionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 80px;
  justify-content: center;
  align-items: flex-start;
`

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: var(--color-text-1);
  margin-bottom: 5px;
`

const Description = styled.div`
  font-size: 14px;
  color: var(--color-text-2);
  text-align: center;
`

const CheckUpdateButton = styled(Button)``

const AppIconPreview = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: contain;
`

const AvatarWrapper = styled.div`
  position: relative;
  cursor: pointer;
  margin-right: 15px;
`

const ProgressCircle = styled(Progress)`
  position: absolute;
  top: -2px;
  left: -2px;
`

export const SettingRowTitle = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: var(--color-text-1);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  .anticon {
    font-size: 16px;
    color: var(--color-text-1);
  }
`

const UpdateNotesWrapper = styled.div`
  padding: 12px 0;
  margin: 8px 0;
  background-color: var(--color-bg-2);
  border-radius: 6px;
  color: var(--color-text-2);
  font-size: 14px;

  p {
    margin: 0;
  }
`

export default AboutSettings
