import { describe, expect, it } from 'vitest'

const { getTargetPackageFilters } = require('../before-pack.js') as {
  getTargetPackageFilters: (target: { platform: string; arch: string }, packageNames?: string[]) => string[]
}

const nativePackages = [
  'native-darwin-arm64',
  'native-darwin-x64',
  'native-linux-arm64',
  'native-linux-arm64-musl',
  'native-linux-x64',
  'native-linux-x64-musl',
  'native-win32-arm64',
  'native-win32-x64'
]

const packageFilter = (packageName: string) => `!node_modules/${packageName}/**`
const ripgrepFilter = (target: string) => `!node_modules/@cherrystudio/ripgrep/vendor/ripgrep/${target}/**`
const rtkFilter = (target: string) => `!resources/binaries/${target}/**`

describe('getTargetPackageFilters', () => {
  it('keeps only native ARM64 resources for Windows ARM64', () => {
    const filters = getTargetPackageFilters({ platform: 'win32', arch: 'arm64' }, nativePackages)

    expect(filters).not.toContain(packageFilter('native-win32-arm64'))
    expect(filters).toContain(packageFilter('native-win32-x64'))
    expect(filters).not.toContain(ripgrepFilter('arm64-win32'))
    expect(filters).toContain(ripgrepFilter('x64-win32'))
    expect(filters).toContain(rtkFilter('win32-x64'))
  })

  it('keeps only native x64 resources for Windows x64', () => {
    const filters = getTargetPackageFilters({ platform: 'win32', arch: 'x64' }, nativePackages)

    expect(filters).not.toContain(packageFilter('native-win32-x64'))
    expect(filters).toContain(packageFilter('native-win32-arm64'))
    expect(filters).not.toContain(ripgrepFilter('x64-win32'))
    expect(filters).toContain(ripgrepFilter('arm64-win32'))
    expect(filters).not.toContain(rtkFilter('win32-x64'))
  })

  it('keeps only the target macOS architecture', () => {
    const filters = getTargetPackageFilters({ platform: 'darwin', arch: 'arm64' }, nativePackages)

    expect(filters).not.toContain(packageFilter('native-darwin-arm64'))
    expect(filters).toContain(packageFilter('native-darwin-x64'))
    expect(filters).not.toContain(ripgrepFilter('arm64-darwin'))
    expect(filters).toContain(ripgrepFilter('x64-darwin'))
    expect(filters).not.toContain(rtkFilter('darwin-arm64'))
  })

  it('keeps both libc variants for the target Linux architecture', () => {
    const filters = getTargetPackageFilters({ platform: 'linux', arch: 'x64' }, nativePackages)

    expect(filters).not.toContain(packageFilter('native-linux-x64'))
    expect(filters).not.toContain(packageFilter('native-linux-x64-musl'))
    expect(filters).toContain(packageFilter('native-linux-arm64'))
    expect(filters).toContain(packageFilter('native-linux-arm64-musl'))
    expect(filters).not.toContain(ripgrepFilter('x64-linux'))
    expect(filters).toContain(ripgrepFilter('arm64-linux'))
    expect(filters).not.toContain(rtkFilter('linux-x64'))
  })
})
