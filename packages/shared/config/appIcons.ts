export const APP_ICON_OPTIONS = [
  { id: 'original', label: 'The Original Pear' },
  { id: 'candy', label: 'Candy Pear' },
  { id: 'hologram', label: 'Hologram' },
  { id: 'neon', label: 'Neon' },
  { id: 'fluted', label: 'Fluted Glass' },
  { id: 'schoolbook', label: 'Schoolbook' },
  { id: 'squishy', label: 'Squishy Pear' },
  { id: 'golden', label: 'Golden Pear' },
  { id: 'pixel', label: 'Pixel Pear' },
  { id: 'glow', label: 'Glow Pear' },
  { id: 'ink', label: 'Black Pear' },
  { id: 'blob', label: 'Sip Pear' },
  { id: 'doodle', label: 'Doodle Pear' },
  { id: 'brush', label: 'Brush Pear' },
  { id: 'marker', label: 'Marker Pear' },
  { id: 'diecut', label: 'Die-cut' },
  { id: 'line', label: 'Line Pear' },
  { id: 'p-original', label: 'The Original P' },
  { id: 'p-candy', label: 'Candy P' },
  { id: 'p-holo', label: 'Hologram P' },
  { id: 'p-neon', label: 'Neon P' },
  { id: 'p-fluted', label: 'Fluted Glass P' },
  { id: 'p-book', label: 'Schoolbook P' }
] as const

export type AppIconId = (typeof APP_ICON_OPTIONS)[number]['id']

export const DEFAULT_APP_ICON_ID: AppIconId = 'neon'

export function normalizeAppIconId(value: unknown): AppIconId {
  return APP_ICON_OPTIONS.some((option) => option.id === value) ? (value as AppIconId) : DEFAULT_APP_ICON_ID
}
