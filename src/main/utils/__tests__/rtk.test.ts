import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies before importing the module
vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    copyFileSync: vi.fn(),
    chmodSync: vi.fn(),
    statSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn()
  }
}))

vi.mock('node:os', () => ({
  default: {
    homedir: () => '/home/testuser'
  }
}))

vi.mock('@logger', () => ({
  loggerService: {
    withContext: () => ({
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    })
  }
}))

vi.mock('@shared/config/constant', () => ({
  HOME_CHERRY_DIR: '.cherrystudio'
}))

vi.mock('electron', () => ({
  app: {
    isPackaged: false
  }
}))

vi.mock('../../constant', () => ({
  isWin: false
}))

vi.mock('..', () => ({
  getResourcePath: () => '/app/resources',
  toAsarUnpackedPath: (filePath: string) => filePath
}))

import fs from 'node:fs'

import { extractRtkBinaries } from '../rtk'

const mockFs = vi.mocked(fs)

describe('rtk utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('extractRtkBinaries', () => {
    it('should skip when bundled dir does not exist', async () => {
      mockFs.existsSync.mockReturnValue(false)

      await extractRtkBinaries()

      expect(mockFs.copyFileSync).not.toHaveBeenCalled()
    })

    it('should copy binary when destination does not exist', async () => {
      mockFs.existsSync.mockImplementation((p: fs.PathLike) => {
        const filePath = String(p)
        if (filePath.includes('resources/binaries')) return true
        if (filePath.includes('rtk') && filePath.includes('.cherrystudio')) return false
        if (filePath.includes('.rtk-version') && filePath.includes('resources')) return true
        if (filePath.includes('.rtk-version') && filePath.includes('.cherrystudio')) return false
        return true
      })
      mockFs.readFileSync.mockReturnValue('0.30.1')

      await extractRtkBinaries()

      expect(mockFs.copyFileSync).toHaveBeenCalled()
      expect(mockFs.chmodSync).toHaveBeenCalledWith(expect.any(String), 0o755)
    })

    it('should skip copy when version matches', async () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockReturnValue('0.30.1')

      await extractRtkBinaries()

      expect(mockFs.copyFileSync).not.toHaveBeenCalled()
    })
  })
})
