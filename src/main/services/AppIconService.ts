import { execFile } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'

import { loggerService } from '@logger'
import { type AppIconId, DEFAULT_APP_ICON_ID, normalizeAppIconId } from '@shared/config/appIcons'
import { app, BrowserWindow, nativeImage } from 'electron'

import { getResourcePath, toAsarUnpackedPath } from '../utils'
import { configManager } from './ConfigManager'

const logger = loggerService.withContext('AppIconService')
const execFileAsync = promisify(execFile)
const OSASCRIPT_TIMEOUT = 10_000

const SET_DOCK_ICON_SCRIPT = `
use framework "AppKit"
use scripting additions
set appPath to system attribute "PEAR_APP_BUNDLE_PATH"
set iconPath to system attribute "PEAR_APP_ICON_PATH"
set image to current application's NSImage's alloc()'s initWithContentsOfFile:iconPath
if image is missing value then error "Pear Studio app icon image could not be loaded"
set ok to current application's NSWorkspace's sharedWorkspace()'s setIcon:image forFile:appPath options:0
if ok is false then error "Pear Studio app icon could not be persisted"
`

const CLEAR_DOCK_ICON_SCRIPT = `
use framework "AppKit"
use scripting additions
set appPath to system attribute "PEAR_APP_BUNDLE_PATH"
set ok to current application's NSWorkspace's sharedWorkspace()'s setIcon:(missing value) forFile:appPath options:0
if ok is false then error "Pear Studio app icon could not be cleared"
`

let persistQueue: Promise<void> = Promise.resolve()

export function getAppIconPath(id: unknown): string {
  const iconId = normalizeAppIconId(id)
  return toAsarUnpackedPath(path.join(getResourcePath(), 'app-icons', `${iconId}.png`))
}

export function applyAppIcon(id: unknown): void {
  const iconId = normalizeAppIconId(id)
  const iconPath = getAppIconPath(iconId)
  const image = nativeImage.createFromPath(iconPath)

  if (image.isEmpty()) {
    logger.warn(`Failed to load app icon: ${iconPath}`)
    return
  }

  if (process.platform === 'darwin') {
    app.dock?.setIcon(image)
  }

  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.isDestroyed()) {
      window.setIcon(image)
    }
  }

  logger.info(`Applied app icon: ${iconId}`)
}

export function persistMacDockIcon(id: unknown): Promise<void> {
  const iconId = normalizeAppIconId(id)

  const task = persistQueue.then(() => persistMacDockIconInternal(iconId))
  persistQueue = task.catch(() => undefined)

  return task.catch((error) => {
    logger.error(`Failed to persist macOS dock icon: ${iconId}`, error as Error)
  })
}

export function initAppIcon(): void {
  const iconId = configManager.getAppIcon()
  applyAppIcon(iconId)

  if (app.isPackaged && process.platform === 'darwin' && iconId !== DEFAULT_APP_ICON_ID) {
    void persistMacDockIcon(iconId)
  }
}

function getMacAppBundlePath(): string | undefined {
  // app.getPath('exe') → <App>.app/Contents/MacOS/<binary>
  const bundlePath = path.resolve(path.dirname(app.getPath('exe')), '..', '..')
  return bundlePath.endsWith('.app') ? bundlePath : undefined
}

async function persistMacDockIconInternal(id: AppIconId): Promise<void> {
  if (!app.isPackaged || process.platform !== 'darwin') {
    return
  }

  const appPath = getMacAppBundlePath()
  if (!appPath) {
    return
  }

  if (id === DEFAULT_APP_ICON_ID) {
    await clearMacDockIcon(appPath)
    return
  }

  await execFileAsync('/usr/bin/osascript', ['-e', SET_DOCK_ICON_SCRIPT], {
    env: { ...process.env, PEAR_APP_BUNDLE_PATH: appPath, PEAR_APP_ICON_PATH: getAppIconPath(id) },
    timeout: OSASCRIPT_TIMEOUT
  })

  logger.info(`Persisted macOS dock icon: ${id}`)
}

async function clearMacDockIcon(appPath: string): Promise<void> {
  await Promise.all([deleteXattr(appPath, 'com.apple.FinderInfo'), deleteXattr(appPath, 'com.apple.ResourceFork')])

  await execFileAsync('/usr/bin/osascript', ['-e', CLEAR_DOCK_ICON_SCRIPT], {
    env: { ...process.env, PEAR_APP_BUNDLE_PATH: appPath },
    timeout: OSASCRIPT_TIMEOUT
  })

  logger.info('Cleared persisted macOS dock icon')
}

async function deleteXattr(filePath: string, attribute: string): Promise<void> {
  try {
    await execFileAsync('/usr/bin/xattr', ['-d', attribute, filePath], { timeout: OSASCRIPT_TIMEOUT })
  } catch {
    // The attribute is usually absent; nothing to clear.
  }
}
