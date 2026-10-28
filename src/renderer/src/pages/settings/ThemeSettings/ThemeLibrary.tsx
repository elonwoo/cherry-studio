import type { ThemeMeta } from '@renderer/assets/themes'
import { THEME_LIBRARY } from '@renderer/assets/themes'
import { useTheme } from '@renderer/context/ThemeProvider'
import { useSettings } from '@renderer/hooks/useSettings'
import { BUILTIN_THEME_ID, getOfficialTheme, getThemeKey } from '@renderer/services/ThemeService'
import { useAppDispatch } from '@renderer/store'
import { setThemeColorOverride, setThemeId } from '@renderer/store/settings'
import { Button, Input } from 'antd'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SettingDivider, SettingTitle } from '..'
import ThemeCard from './ThemeCard'

type FacetKey = 'all' | 'minimal' | 'glass' | 'motion' | 'eye' | 'dark' | 'style'

const FACETS: { key: FacetKey; match: string[] }[] = [
  { key: 'all', match: [] },
  { key: 'minimal', match: ['简约', '极简', 'Minimal', 'Clean', 'Simple', '现代UI', '低饱和', '优雅'] },
  { key: 'glass', match: ['玻璃', '透明', '模糊', '磨砂', '玻璃态', 'Mica'] },
  { key: 'motion', match: ['动效', '动画', '动态', '流动', '光流', '跑马灯', 'RGB', '呼吸', '荧光'] },
  { key: 'eye', match: ['护眼', '学术', '阅读', '温暖', '暖色', '柔和', '舒适', '纸感'] },
  { key: 'dark', match: ['暗色', '暗黑', 'dark', 'Dark', '仅暗色', '森系暗', 'Neon', '霓虹'] },
  {
    key: 'style',
    match: [
      'Claude',
      'ChatGPT',
      'MacOS',
      'MAC',
      'Windows11',
      '国风',
      '古风',
      '吉卜力',
      '赛博朋克',
      '科幻',
      '宇宙',
      'Miku',
      'VSCode',
      '代码',
      '编程',
      '黑客',
      '极客',
      '德古拉',
      'Catppuccin',
      'Solarized',
      'Nord',
      'MaterialYou',
      'synthwave',
      'Swiss'
    ]
  }
]

const FACET_LABEL_KEYS: Record<FacetKey, string> = {
  all: 'settings.themeSettings.filters.all',
  minimal: 'settings.themeSettings.filters.minimal',
  glass: 'settings.themeSettings.filters.glass',
  motion: 'settings.themeSettings.filters.motion',
  eye: 'settings.themeSettings.filters.eye',
  dark: 'settings.themeSettings.filters.dark',
  style: 'settings.themeSettings.filters.style'
}

const PAGE_SIZE = 12

function matchesFacet(theme: ThemeMeta, match: string[]): boolean {
  return theme.tags.some((tag) => match.some((keyword) => tag.toLowerCase().includes(keyword.toLowerCase())))
}

const ThemeLibrary = () => {
  const { t } = useTranslation()
  const { themeId } = useSettings()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState('')
  const [facetKey, setFacetKey] = useState<FacetKey>('all')
  const [showAll, setShowAll] = useState(false)

  const activeTheme = getOfficialTheme(themeId)
  const currentName = activeTheme?.name ?? t('settings.themeSettings.default')
  const mode = theme === 'dark' ? 'dark' : 'light'

  const facetCounts = useMemo(() => {
    const counts = {} as Record<FacetKey, number>
    FACETS.forEach((facet) => {
      counts[facet.key] =
        facet.key === 'all'
          ? THEME_LIBRARY.length
          : THEME_LIBRARY.filter((item) => matchesFacet(item, facet.match)).length
    })
    return counts
  }, [])

  const filteredThemes = useMemo(() => {
    const query = search.trim().toLowerCase()
    const facet = FACETS.find((item) => item.key === facetKey)

    return THEME_LIBRARY.filter((item) => {
      const facetMatched = facetKey === 'all' || (facet ? matchesFacet(item, facet.match) : false)
      const queryMatched = !query || [item.name, item.author, ...item.tags].join(' ').toLowerCase().includes(query)

      return facetMatched && queryMatched
    })
  }, [facetKey, search])

  const visibleThemes = showAll ? filteredThemes : filteredThemes.slice(0, PAGE_SIZE)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setShowAll(false)
  }

  const handleFacetChange = (key: FacetKey) => {
    setFacetKey(key)
    setShowAll(false)
  }

  const handleApply = (item: ThemeMeta) => {
    dispatch(setThemeId(getThemeKey(item.id)))
    dispatch(setThemeColorOverride(false))
  }

  const handleReset = () => {
    dispatch(setThemeId(BUILTIN_THEME_ID))
    dispatch(setThemeColorOverride(false))
  }

  return (
    <>
      <SettingTitle>
        <span>{t('settings.themeSettings.library')}</span>
        <HeaderRight>
          <CurrentText>{t('settings.themeSettings.current', { name: currentName })}</CurrentText>
          <Button type="text" size="small" onClick={handleReset}>
            {t('settings.themeSettings.reset')}
          </Button>
        </HeaderRight>
      </SettingTitle>
      <SettingDivider />
      <Toolbar>
        <SearchInput
          allowClear
          prefix={<Search size={14} />}
          placeholder={t('settings.themeSettings.search')}
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
        />
      </Toolbar>
      <Chips>
        {FACETS.map((facet) => (
          <Chip
            key={facet.key}
            type="button"
            $active={facet.key === facetKey}
            onClick={() => handleFacetChange(facet.key)}>
            {t(FACET_LABEL_KEYS[facet.key])}
            <ChipCount>{facetCounts[facet.key]}</ChipCount>
          </Chip>
        ))}
      </Chips>
      {filteredThemes.length === 0 ? (
        <EmptyState>{t('settings.themeSettings.empty')}</EmptyState>
      ) : (
        <Grid>
          {visibleThemes.map((item) => (
            <ThemeCard
              key={item.id}
              theme={item}
              mode={mode}
              active={item.id === activeTheme?.id}
              onApply={handleApply}
            />
          ))}
        </Grid>
      )}
      {filteredThemes.length > PAGE_SIZE && (
        <MoreRow>
          <Button type="text" onClick={() => setShowAll((value) => !value)}>
            {showAll
              ? t('settings.themeSettings.collapse')
              : t('settings.themeSettings.showAll', { count: filteredThemes.length })}
          </Button>
        </MoreRow>
      )}
    </>
  )
}

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
`

const CurrentText = styled.span`
  color: var(--color-text-3);
  font-size: 12px;
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
`

const SearchInput = styled(Input)`
  width: 260px;
`

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
`

const Chip = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 6px;
  border: 0.5px solid ${(props) => (props.$active ? 'var(--color-primary)' : 'var(--color-border)')};
  background: ${(props) => (props.$active ? 'var(--color-primary-mute)' : 'transparent')};
  color: ${(props) => (props.$active ? 'var(--color-primary)' : 'var(--color-text-2)')};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: var(--color-text-1);
    border-color: var(--color-text-3);
  }
`

const ChipCount = styled.span`
  margin-left: 3px;
  opacity: 0.55;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1120px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const EmptyState = styled.div`
  padding: 36px 0;
  color: var(--color-text-3);
  font-size: 12.5px;
  text-align: center;
`

const MoreRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 14px;
`

export default ThemeLibrary
