/**
 * Generate all Pear Studio brand assets from the Neon pear design.
 *
 * Usage: npx electron scripts/generate-icons.cjs
 *
 * Every size is rasterized at its true pixel size in an offscreen canvas;
 * nothing is downscaled from a single bitmap.
 */
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const { app, BrowserWindow } = require('electron')

const ROOT = path.resolve(__dirname, '..')
const BUILD_DIR = path.join(ROOT, 'build')
const ICONS_DIR = path.join(BUILD_DIR, 'icons')
const TMP_DIR = path.join(ROOT, 'tmp')
const RENDERER_ASSETS = path.join(ROOT, 'src', 'renderer', 'src', 'assets', 'images')

const ICON_SIZES = [16, 24, 32, 48, 64, 128, 256, 512, 1024]
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256]
const TRAY_SIZE = 32

/**
 * Runs inside the offscreen page. Must be self-contained: it is serialized
 * with Function.prototype.toString and injected into the data: URL.
 */
function pageMain() {
  'use strict'

  // Apple's icon grid: the artwork occupies 824 of 1024 units, centred.
  const MAC_ARTBOARD = 824 / 1024

  /* ---------- shared shapes (0–1000 space) ---------- */
  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + rr, y)
    ctx.lineTo(x + w - rr, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr)
    ctx.lineTo(x + w, y + h - rr)
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
    ctx.lineTo(x + rr, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr)
    ctx.lineTo(x, y + rr)
    ctx.quadraticCurveTo(x, y, x + rr, y)
    ctx.closePath()
  }

  function pearPath(ctx) {
    ctx.beginPath()
    ctx.moveTo(500, 158)
    ctx.bezierCurveTo(542, 158, 570, 186, 582, 230)
    ctx.bezierCurveTo(594, 270, 596, 320, 600, 372)
    ctx.bezierCurveTo(628, 468, 754, 514, 754, 652)
    ctx.bezierCurveTo(754, 792, 640, 884, 500, 884)
    ctx.bezierCurveTo(360, 884, 246, 792, 246, 652)
    ctx.bezierCurveTo(246, 514, 372, 468, 400, 372)
    ctx.bezierCurveTo(404, 320, 406, 270, 418, 230)
    ctx.bezierCurveTo(430, 186, 458, 158, 500, 158)
    ctx.closePath()
  }

  function leafPath(ctx) {
    ctx.beginPath()
    ctx.moveTo(546, 112)
    ctx.bezierCurveTo(600, 30, 700, 22, 748, 52)
    ctx.bezierCurveTo(718, 140, 614, 162, 546, 112)
    ctx.closePath()
  }

  function stemPath(ctx, w) {
    ctx.lineWidth = w
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(500, 232)
    ctx.quadraticCurveTo(512, 168, 546, 112)
  }

  function shape(ctx, transform, fn) {
    ctx.save()
    ctx.translate(500 + (transform.dx || 0), 500 + (transform.dy || 0))
    ctx.rotate(transform.rot || 0)
    const s = transform.scale || 1
    ctx.scale(s * (transform.sx || 1), s * (transform.sy || 1))
    ctx.translate(-500, -500)
    fn()
    ctx.restore()
  }

  /* ---------- Neon ---------- */
  function drawNeon(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    const bg = ctx.createRadialGradient(500, 420, 40, 500, 560, 780)
    bg.addColorStop(0, '#5B1A8E')
    bg.addColorStop(0.55, '#2E0A4A')
    bg.addColorStop(1, '#14041F')
    ctx.fillStyle = bg
    ctx.fill()

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    shape(ctx, { scale: 0.9 }, () => {
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'

      pearPath(ctx)
      ctx.shadowColor = 'rgba(255,63,208,.95)'
      ctx.shadowBlur = 90 * k
      ctx.strokeStyle = '#FF6BE0'
      ctx.lineWidth = 30
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.strokeStyle = '#FFC6F5'
      ctx.lineWidth = 9
      ctx.stroke()

      leafPath(ctx)
      ctx.shadowColor = 'rgba(120,90,255,.95)'
      ctx.shadowBlur = 80 * k
      ctx.strokeStyle = '#9C7BFF'
      ctx.lineWidth = 24
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.strokeStyle = '#DCD0FF'
      ctx.lineWidth = 7
      ctx.stroke()

      stemPath(ctx, 16)
      ctx.shadowColor = 'rgba(255,63,208,.8)'
      ctx.shadowBlur = 50 * k
      ctx.strokeStyle = '#FF9BF0'
      ctx.stroke()
    })

    if (clipToTile) ctx.restore()
  }

  // Black template silhouette: body + leaf only, no tile, transparent outside.
  function drawTray(ctx, size) {
    const minX = 246
    const maxX = 754
    const minY = 22
    const maxY = 884
    const margin = 1.5
    const s = Math.min((size - margin * 2) / (maxX - minX), (size - margin * 2) / (maxY - minY))
    const tx = (size - (maxX - minX) * s) / 2 - minX * s
    const ty = (size - (maxY - minY) * s) / 2 - minY * s

    ctx.setTransform(s, 0, 0, s, tx, ty)
    ctx.fillStyle = '#000000'
    pearPath(ctx)
    ctx.fill()
    leafPath(ctx)
    ctx.fill()
  }

  window.__renderPng = function (options) {
    const size = options.size
    const canvas = document.getElementById('render')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, size, size)

    if (options.mode === 'tray') {
      drawTray(ctx, size)
    } else {
      const mac = options.mode === 'mac'
      const k = mac ? (size * MAC_ARTBOARD) / 1000 : size / 1000
      const offset = mac ? (size - 1000 * k) / 2 : 0
      ctx.setTransform(k, 0, 0, k, offset, offset)
      drawNeon(ctx, k, mac)
    }

    return canvas.toDataURL('image/png')
  }
}

const PAGE_HTML = `<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body style="margin:0;background:transparent">
    <canvas id="render" width="1024" height="1024"></canvas>
    <script>(${pageMain.toString()})()</script>
  </body>
</html>`

function decodePng(dataUrl) {
  return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64')
}

async function renderPng(win, options) {
  const dataUrl = await win.webContents.executeJavaScript(`window.__renderPng(${JSON.stringify(options)})`, true)
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/png;base64,')) {
    throw new Error(`Unexpected render result for ${JSON.stringify(options)}`)
  }
  return decodePng(dataUrl)
}

function writeFile(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, data)
  return { filePath, bytes: data.length }
}

/**
 * Minimal ICO container writer: ICONDIR + 16-byte entries + PNG blobs.
 * PNG-embedded ICO is supported by Windows Vista and later.
 */
function buildIco(pngBySize) {
  const sizes = Object.keys(pngBySize)
    .map(Number)
    .sort((a, b) => a - b)
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(sizes.length, 4)

  const entries = Buffer.alloc(16 * sizes.length)
  const blobs = []
  let offset = 6 + 16 * sizes.length

  sizes.forEach((size, i) => {
    const png = pngBySize[size]
    const at = i * 16
    entries.writeUInt8(size >= 256 ? 0 : size, at) // width (0 means 256)
    entries.writeUInt8(size >= 256 ? 0 : size, at + 1) // height
    entries.writeUInt8(0, at + 2) // palette count
    entries.writeUInt8(0, at + 3) // reserved
    entries.writeUInt16LE(1, at + 4) // colour planes
    entries.writeUInt16LE(32, at + 6) // bits per pixel
    entries.writeUInt32LE(png.length, at + 8)
    entries.writeUInt32LE(offset, at + 12)
    offset += png.length
    blobs.push(png)
  })

  return Buffer.concat([header, entries, ...blobs])
}

function buildIcns(pngBySize) {
  const iconsetDir = path.join(os.tmpdir(), `pear-studio-${process.pid}.iconset`)
  const icnsPath = path.join(BUILD_DIR, 'icon.icns')
  fs.rmSync(iconsetDir, { recursive: true, force: true })
  fs.mkdirSync(iconsetDir, { recursive: true })

  const mapping = [
    ['icon_16x16.png', 16],
    ['icon_16x16@2x.png', 32],
    ['icon_32x32.png', 32],
    ['icon_32x32@2x.png', 64],
    ['icon_128x128.png', 128],
    ['icon_128x128@2x.png', 256],
    ['icon_256x256.png', 256],
    ['icon_256x256@2x.png', 512],
    ['icon_512x512.png', 512],
    ['icon_512x512@2x.png', 1024]
  ]

  try {
    for (const [name, size] of mapping) {
      fs.writeFileSync(path.join(iconsetDir, name), pngBySize[size])
    }
    execFileSync('iconutil', ['-c', 'icns', iconsetDir, '-o', icnsPath])
  } finally {
    fs.rmSync(iconsetDir, { recursive: true, force: true })
  }

  return icnsPath
}

function formatSize(bytes) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`
}

async function main() {
  app.disableHardwareAcceleration()

  await app.whenReady()

  const win = new BrowserWindow({
    width: 64,
    height: 64,
    show: false,
    webPreferences: {
      offscreen: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  const results = []

  try {
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(PAGE_HTML)}`)
    const ready = await win.webContents.executeJavaScript('typeof window.__renderPng === "function"', true)
    if (!ready) throw new Error('Renderer did not initialize')

    // One true-size render per output size.
    const macPngs = new Map()
    for (const size of ICON_SIZES) {
      macPngs.set(size, await renderPng(win, { size, mode: 'mac' }))
    }
    const fullBleed1024 = await renderPng(win, { size: 1024, mode: 'full' })
    const trayPng = await renderPng(win, { size: TRAY_SIZE, mode: 'tray' })

    const icon1024 = macPngs.get(1024)
    const logoBytes = icon1024

    results.push(writeFile(path.join(BUILD_DIR, 'icon.png'), icon1024))
    for (const size of ICON_SIZES) {
      results.push(writeFile(path.join(ICONS_DIR, `${size}x${size}.png`), macPngs.get(size)))
    }
    results.push(writeFile(path.join(BUILD_DIR, 'logo.png'), logoBytes))
    results.push(writeFile(path.join(RENDERER_ASSETS, 'logo.png'), logoBytes))

    results.push(writeFile(path.join(TMP_DIR, 'pear-studio-full-bleed-1024.png'), fullBleed1024))

    for (const name of ['tray_icon.png', 'tray_icon_dark.png', 'tray_icon_light.png']) {
      results.push(writeFile(path.join(BUILD_DIR, name), trayPng))
    }

    const icnsPath = buildIcns(Object.fromEntries(macPngs))
    results.push({ filePath: icnsPath, bytes: fs.statSync(icnsPath).size })

    const icoBytes = buildIco(Object.fromEntries(ICO_SIZES.map((size) => [size, macPngs.get(size)])))
    results.push(writeFile(path.join(BUILD_DIR, 'icon.ico'), icoBytes))

    const rows = results
      .map(({ filePath, bytes }) => {
        const rel = path.relative(ROOT, filePath)
        return `  ${rel.padEnd(58)} ${formatSize(bytes).padStart(9)}`
      })
      .join('\n')

    console.log('\nGenerated brand assets:\n')
    console.log(`  ${'file'.padEnd(58)} ${'size'.padStart(9)}`)
    console.log(`  ${'-'.repeat(58)} ${'-'.repeat(9)}`)
    console.log(rows)
    console.log(
      `\n  ${results.length} files written. Full-bleed preview: ${path.relative(ROOT, path.join(TMP_DIR, 'pear-studio-full-bleed-1024.png'))}`
    )

    app.exit(0)
  } catch (error) {
    console.error('Icon generation failed:', error)
    app.exit(1)
  }
}

void main()
