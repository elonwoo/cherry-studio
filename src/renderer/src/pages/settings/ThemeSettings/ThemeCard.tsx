import type { ThemeMeta } from '@renderer/assets/themes'
import type { ThemeColorMode } from '@renderer/services/ThemeService'
import { Button } from 'antd'
import { Check } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface ThemeCardProps {
  theme: ThemeMeta
  mode: ThemeColorMode
  active: boolean
  onApply: (theme: ThemeMeta) => void
}

const ThemeCard: FC<ThemeCardProps> = ({ theme, mode, active, onApply }) => {
  const { t } = useTranslation()
  const shot = mode === 'dark' ? theme.darkShot : theme.lightShot
  const primary = mode === 'dark' ? theme.primaryDark : theme.primaryLight

  const badge = theme.flags.needsNetwork ? t('settings.themeSettings.needsNetwork') : ''

  const handleApply = () => onApply(theme)

  return (
    <Card
      $active={active}
      role="button"
      tabIndex={0}
      onClick={handleApply}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleApply()
        }
      }}>
      <Thumb>
        {shot ? (
          <Shot src={shot} alt={theme.name} loading="lazy" />
        ) : (
          <Placeholder $color={primary}>
            <span className="side" />
            <span className="main">
              <i className="line" />
              <i className="line short" />
              <i className="bubble" />
            </span>
          </Placeholder>
        )}
        {badge && (
          <Badges>
            <Badge>{badge}</Badge>
          </Badges>
        )}
        {active && (
          <CheckBadge>
            <Check size={11} strokeWidth={3.2} />
          </CheckBadge>
        )}
        <ApplyBar className="apply-bar">
          <Button
            type="primary"
            size="small"
            onClick={(event) => {
              event.stopPropagation()
              handleApply()
            }}>
            {t('settings.themeSettings.apply')}
          </Button>
        </ApplyBar>
      </Thumb>
      <Meta>
        <Name>{theme.name}</Name>
        <Author>{theme.author}</Author>
      </Meta>
    </Card>
  )
}

const Card = styled.article<{ $active: boolean }>`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
  border: 0.5px solid ${(props) => (props.$active ? 'var(--color-primary)' : 'var(--color-border)')};
  background: var(--color-background);
  box-shadow: ${(props) => (props.$active ? '0 0 0 1px var(--color-primary)' : 'none')};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: var(--color-text-3);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);

    .apply-bar {
      opacity: 1;
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
  }
`

const Thumb = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-bottom: 0.5px solid var(--color-border);
  background: var(--color-background-soft);
`

const Shot = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Placeholder = styled.div<{ $color: string }>`
  display: flex;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${(props) => `${props.$color}22`}, ${(props) => `${props.$color}99`});

  .side {
    width: 24%;
    border-right: 1px solid rgba(127, 127, 127, 0.25);
    background: rgba(127, 127, 127, 0.12);
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    padding: 0 11%;
  }

  .line {
    width: 62%;
    height: 4px;
    border-radius: 2px;
    background: rgba(127, 127, 127, 0.35);
  }

  .line.short {
    width: 38%;
  }

  .bubble {
    align-self: flex-end;
    width: 46%;
    height: 12px;
    border-radius: 6px;
    background: ${(props) => props.$color};
  }
`

const Badges = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 2;
  display: flex;
  gap: 4px;
`

const Badge = styled.span`
  padding: 3px 5px;
  border-radius: 4px;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  font-size: 10px;
  line-height: 1;
`

const CheckBadge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #fff;
  background: var(--color-primary);
`

const ApplyBar = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  padding: 6px;
  opacity: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.45));
  transition: opacity 0.15s ease;
`

const Meta = styled.div`
  padding: 8px 10px 9px;
`

const Name = styled.div`
  overflow: hidden;
  color: var(--color-text-1);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Author = styled.div`
  margin-top: 1px;
  overflow: hidden;
  color: var(--color-text-3);
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export default ThemeCard
