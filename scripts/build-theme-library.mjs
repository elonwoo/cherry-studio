#!/usr/bin/env node
/**
 * Builds the bundled theme library from the Cherry Studio theme CMS.
 *
 * Source: https://data1.cherry-ai.com/items/cherry_css (V1-compatible themes only)
 * Output: src/renderer/src/assets/themes/
 *   - css/<id>.css          raw theme CSS
 *   - shots/<id>-*.webp     compressed preview screenshots
 *   - library.json          metadata index
 *   - index.ts              typed accessors used by the renderer
 *
 * Run with: node scripts/build-theme-library.mjs
 * The script is idempotent: css/, shots/, library.json and index.ts are rebuilt.
 */

import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'src/renderer/src/assets/themes')
const CSS_DIR = path.join(OUTPUT_DIR, 'css')
const SHOTS_DIR = path.join(OUTPUT_DIR, 'shots')
const LIBRARY_FILE = path.join(OUTPUT_DIR, 'library.json')
const INDEX_FILE = path.join(OUTPUT_DIR, 'index.ts')

const SOURCE_URL = 'https://data1.cherry-ai.com/items/cherry_css?sort=-id&limit=1000'
const ASSET_BASE_URL = 'https://data1.cherry-ai.com/assets'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

const EXPECTED_THEME_COUNT = 63
const SHOT_WIDTH = 640
const SHOT_HEIGHT = 400
const SHOT_QUALITY = 80
const DOWNLOAD_CONCURRENCY = 6
const DOWNLOAD_RETRIES = 2
const REQUEST_TIMEOUT_MS = 30_000

const DEFAULT_PRIMARY = '#BD93F9'
const V1_FEATURE = /\.ant-|\[theme-mode/
const V2_FEATURE = /data-ui=|data-slot=|\.composer|--chat-user|--border-subtle/
const DARK_SELECTOR = /\[theme-mode\s*=\s*['"]dark['"]|(?:^|[^A-Za-z0-9_-])\.dark(?![A-Za-z0-9_-])/

// ---------------------------------------------------------------------------
// Theme selection
// ---------------------------------------------------------------------------

function isV1Compatible(code) {
  return !(V2_FEATURE.test(code) && !V1_FEATURE.test(code))
}

function selectThemes(items) {
  const eligible = items.filter((item) => isV1Compatible(item.code ?? ''))
  const byName = new Map()

  for (const item of eligible) {
    const current = byName.get(item.name)
    if (!current || item.id > current.id) {
      byName.set(item.name, item)
    }
  }

  return [...byName.values()].sort((a, b) => b.id - a.id)
}

// ---------------------------------------------------------------------------
// Metadata parsing
// ---------------------------------------------------------------------------

function parseTags(rawTitle) {
  let tags = rawTitle

  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags)
    } catch {
      tags = tags.split(/[,，;；]/)
    }
  }

  if (!Array.isArray(tags)) {
    tags = tags == null ? [] : [tags]
  }

  const result = []
  for (const tag of tags) {
    const value = String(tag ?? '').trim()
    if (!value || value === '无') continue
    if (!result.includes(value)) result.push(value)
  }
  return result
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizeHex(rawValue) {
  const value = String(rawValue)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*!important\s*$/i, '')
    .trim()
  const match = /^#([0-9a-f]{3,8})$/i.exec(value)
  if (!match) return null

  let hex = match[1]
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .slice(0, 3)
      .split('')
      .map((char) => char + char)
      .join('')
  } else if (hex.length === 6 || hex.length === 8) {
    hex = hex.slice(0, 6)
  } else {
    return null
  }
  return `#${hex.toUpperCase()}`
}

function collectVarColors(css, varName, seen, out) {
  seen.add(varName)
  const re = new RegExp(`--${escapeRegExp(varName.replace(/^--/, ''))}\\s*:\\s*([^;}]+)`, 'g')
  let match

  while ((match = re.exec(css))) {
    const hex = normalizeHex(match[1])
    if (hex) {
      out.push({ pos: match.index, hex })
      continue
    }

    const reference = /var\(\s*(--[A-Za-z0-9_-]+)/.exec(match[1])
    if (reference && !seen.has(reference[1])) {
      collectVarColors(css, reference[1], seen, out)
    }
  }
}

function resolvePrimary(css) {
  const darkMatch = DARK_SELECTOR.exec(css)
  const darkBoundary = darkMatch ? darkMatch.index : css.length
  const candidates = []

  const re = /--color-primary\s*:\s*([^;}]+)/g
  let match
  while ((match = re.exec(css))) {
    const hex = normalizeHex(match[1])
    if (hex) {
      candidates.push({ pos: match.index, hex })
      continue
    }

    // Themes routinely alias the real palette, e.g. `--color-primary: var(--sw-accent)`.
    // Resolve the alias so the final value is still a hex literal.
    const reference = /var\(\s*(--[A-Za-z0-9_-]+)/.exec(match[1])
    if (reference) {
      collectVarColors(css, reference[1], new Set(), candidates)
    }
  }

  candidates.sort((a, b) => a.pos - b.pos)
  const light = candidates.find((candidate) => candidate.pos < darkBoundary)?.hex
  const dark = candidates.find((candidate) => candidate.pos >= darkBoundary)?.hex
  const primaryLight = light ?? dark ?? DEFAULT_PRIMARY
  const primaryDark = dark ?? light ?? DEFAULT_PRIMARY

  return { primaryLight, primaryDark }
}

function detectFlags(css) {
  return {
    light: /\[theme-mode\s*=\s*['"]light['"]|(?:^|[^A-Za-z0-9_-])\.light(?![A-Za-z0-9_-])|(?:^|\n)\s*:root\s*\{/.test(
      css
    ),
    dark: /\[theme-mode\s*=\s*['"]dark['"]|(?:^|[^A-Za-z0-9_-])\.dark(?![A-Za-z0-9_-])/.test(css),
    bgImage: /background(?:-image)?\s*:[^;{}]*url\(/i.test(css),
    animation: /@keyframes|animation\s*:|transition\s*:/i.test(css),
    needsNetwork: /url\(\s*['"]?https?:/i.test(css) || /@import/i.test(css)
  }
}

// ---------------------------------------------------------------------------
// Network helpers
// ---------------------------------------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchBuffer(url, retries = DOWNLOAD_RETRIES) {
  let lastError

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      await sleep(500 * attempt)
    }

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`)
      }
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      lastError = error
    }
  }

  throw lastError
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length)
  let nextIndex = 0

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++
      results[index] = await worker(items[index], index)
    }
  })

  await Promise.all(runners)
  return results
}

// ---------------------------------------------------------------------------
// Output rendering
// ---------------------------------------------------------------------------

function quote(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r/g, '\\r').replace(/\n/g, '\\n')}'`
}

function renderIndex(entries) {
  const lines = ['// This file is generated by scripts/build-theme-library.mjs. Do not edit it manually.', '']

  for (const entry of entries) {
    if (entry.shots.light) {
      lines.push(`import shot${entry.id}Light from './shots/${entry.shots.light}'`)
    }
    if (entry.shots.dark) {
      lines.push(`import shot${entry.id}Dark from './shots/${entry.shots.dark}'`)
    }
  }
  if (lines.length > 2) lines.push('')

  lines.push(
    'export interface ThemeFlags { light: boolean; dark: boolean; bgImage: boolean; animation: boolean; needsNetwork: boolean }',
    'export interface ThemeMeta {',
    '  id: number',
    '  name: string',
    '  author: string',
    '  tags: string[]',
    '  date: string',
    '  primaryLight: string',
    '  primaryDark: string',
    '  flags: ThemeFlags',
    '  lightShot?: string',
    '  darkShot?: string',
    '}',
    '',
    'export const THEME_LIBRARY: ThemeMeta[] = ['
  )

  for (const entry of entries) {
    const { flags } = entry
    lines.push(
      '  {',
      `    id: ${entry.id},`,
      `    name: ${quote(entry.name)},`,
      `    author: ${quote(entry.author)},`,
      `    tags: [${entry.tags.map(quote).join(', ')}],`,
      `    date: ${quote(entry.date)},`,
      `    primaryLight: ${quote(entry.primaryLight)},`,
      `    primaryDark: ${quote(entry.primaryDark)},`,
      `    flags: { light: ${flags.light}, dark: ${flags.dark}, bgImage: ${flags.bgImage}, animation: ${flags.animation}, needsNetwork: ${flags.needsNetwork} },`
    )
    if (entry.shots.light) lines.push(`    lightShot: shot${entry.id}Light,`)
    if (entry.shots.dark) lines.push(`    darkShot: shot${entry.id}Dark,`)
    lines.push('  },')
  }

  lines.push(']', '', 'const THEME_CSS_LOADERS: Record<number, () => Promise<{ default: string }>> = {')
  for (const entry of entries) {
    lines.push(`  ${entry.id}: () => import('./css/${entry.id}.css?raw'),`)
  }
  lines.push(
    '}',
    '',
    'export function loadThemeCss(id: number): Promise<string> {',
    '  const loader = THEME_CSS_LOADERS[id]',
    '  if (!loader) {',
    '    return Promise.reject(new Error(`Theme CSS not found: ${id}`))',
    '  }',
    '',
    '  return loader().then((cssModule) => cssModule.default)',
    '}',
    ''
  )

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Fetching themes from ${SOURCE_URL}`)
  const sourceBuffer = await fetchBuffer(SOURCE_URL, 1)
  const payload = JSON.parse(sourceBuffer.toString('utf8'))
  if (!Array.isArray(payload?.data)) {
    throw new Error('Unexpected CMS response: missing data array')
  }

  const themes = selectThemes(payload.data)
  console.log(`Source items: ${payload.data.length}, selected themes: ${themes.length}`)
  if (themes.length !== EXPECTED_THEME_COUNT) {
    console.warn(
      `WARNING: expected ${EXPECTED_THEME_COUNT} V1-compatible themes, got ${themes.length}. ` +
        'Selection rules were left unchanged.'
    )
  }

  await rm(CSS_DIR, { recursive: true, force: true })
  await rm(SHOTS_DIR, { recursive: true, force: true })
  await mkdir(CSS_DIR, { recursive: true })
  await mkdir(SHOTS_DIR, { recursive: true })

  for (const theme of themes) {
    await writeFile(path.join(CSS_DIR, `${theme.id}.css`), theme.code ?? '', 'utf8')
  }
  console.log(`Wrote ${themes.length} CSS files`)

  const shotTasks = []
  for (const theme of themes) {
    if (theme.light_pic) shotTasks.push({ theme, kind: 'light', uuid: theme.light_pic })
    if (theme.dark_pic) shotTasks.push({ theme, kind: 'dark', uuid: theme.dark_pic })
  }

  let completed = 0
  const shotResults = await mapWithConcurrency(shotTasks, DOWNLOAD_CONCURRENCY, async (task) => {
    const filename = `${task.theme.id}-${task.kind}.webp`
    try {
      const buffer = await fetchBuffer(`${ASSET_BASE_URL}/${task.uuid}`)
      await sharp(buffer)
        .resize(SHOT_WIDTH, SHOT_HEIGHT, { fit: 'cover' })
        .webp({ quality: SHOT_QUALITY })
        .toFile(path.join(SHOTS_DIR, filename))
      return { themeId: task.theme.id, kind: task.kind, filename, ok: true }
    } catch (error) {
      console.warn(`  Failed ${filename}: ${error.message}`)
      return { themeId: task.theme.id, kind: task.kind, filename, ok: false, error }
    } finally {
      completed++
      process.stdout.write(`\rScreenshots: ${completed}/${shotTasks.length}`)
    }
  })
  process.stdout.write('\n')

  const shotsById = new Map()
  for (const result of shotResults) {
    if (!result.ok) continue
    if (!shotsById.has(result.themeId)) shotsById.set(result.themeId, {})
    shotsById.get(result.themeId)[result.kind] = result.filename
  }

  const entries = themes.map((theme) => {
    const { primaryLight, primaryDark } = resolvePrimary(theme.code ?? '')
    return {
      id: theme.id,
      name: theme.name,
      author: theme.author ?? '',
      tags: parseTags(theme.title),
      date: String(theme.date_created ?? '').slice(0, 10),
      primaryLight,
      primaryDark,
      flags: detectFlags(theme.code ?? ''),
      shots: shotsById.get(theme.id) ?? {}
    }
  })

  await writeFile(LIBRARY_FILE, `${JSON.stringify(entries, null, 2)}\n`, 'utf8')
  await writeFile(INDEX_FILE, renderIndex(entries), 'utf8')

  const failures = shotResults.filter((result) => !result.ok)
  console.log(
    `Screenshots: ${shotResults.length - failures.length}/${shotResults.length} written, ${failures.length} failed`
  )
  for (const failure of failures) {
    console.log(`  - ${failure.filename}: ${failure.error?.message ?? 'unknown error'}`)
  }
  console.log(`Wrote ${path.relative(PROJECT_ROOT, LIBRARY_FILE)}`)
  console.log(`Wrote ${path.relative(PROJECT_ROOT, INDEX_FILE)}`)
  console.log(`Themes: ${entries.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
