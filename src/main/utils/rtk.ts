import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { loggerService } from '@logger'
import { HOME_CHERRY_DIR } from '@shared/config/constant'

import { isWin } from '../constant'
import { getResourcePath, toAsarUnpackedPath } from '.'

const logger = loggerService.withContext('Utils:Rtk')

const RTK_BINARY = isWin ? 'rtk.exe' : 'rtk'
const RTK_VERSION_FILE = '.rtk-version'

// rtk is not available for these platforms
const UNSUPPORTED_PLATFORMS = new Set(['win32-arm64'])

function getPlatformKey(): string {
  return `${process.platform}-${process.arch}`
}

function isPlatformSupported(): boolean {
  return !UNSUPPORTED_PLATFORMS.has(getPlatformKey())
}

function getBundledBinariesDir(): string {
  const dir = path.join(getResourcePath(), 'binaries', getPlatformKey())
  return toAsarUnpackedPath(dir)
}

function getUserBinDir(): string {
  return path.join(os.homedir(), HOME_CHERRY_DIR, 'bin')
}

/**
 * Extract bundled rtk binary to ~/.cherrystudio/bin/ if not already present or outdated.
 * Called once at app startup.
 */
export async function extractRtkBinaries(): Promise<void> {
  if (!isPlatformSupported()) {
    logger.debug('rtk not supported on this platform', { platform: getPlatformKey() })
    return
  }

  const bundledDir = getBundledBinariesDir()
  if (!fs.existsSync(bundledDir)) {
    logger.debug('No bundled rtk binaries found for this platform', { dir: bundledDir })
    return
  }

  const userBinDir = getUserBinDir()
  fs.mkdirSync(userBinDir, { recursive: true })

  const src = path.join(bundledDir, RTK_BINARY)
  const dest = path.join(userBinDir, RTK_BINARY)

  if (!fs.existsSync(src)) {
    return
  }

  // Use a version file to detect upgrades instead of comparing file sizes
  const bundledVersionFile = path.join(bundledDir, RTK_VERSION_FILE)
  const installedVersionFile = path.join(userBinDir, RTK_VERSION_FILE)
  const bundledVersion = fs.existsSync(bundledVersionFile) ? fs.readFileSync(bundledVersionFile, 'utf8').trim() : ''
  const installedVersion = fs.existsSync(installedVersionFile)
    ? fs.readFileSync(installedVersionFile, 'utf8').trim()
    : ''

  const shouldCopy = !fs.existsSync(dest) || (bundledVersion && bundledVersion !== installedVersion)

  if (shouldCopy) {
    fs.copyFileSync(src, dest)
    if (!isWin) {
      fs.chmodSync(dest, 0o755)
    }
    if (bundledVersion) {
      fs.writeFileSync(installedVersionFile, bundledVersion, 'utf8')
    }
    logger.info('Extracted rtk binary to user bin dir', { dest, version: bundledVersion || 'unknown' })
  }
}
