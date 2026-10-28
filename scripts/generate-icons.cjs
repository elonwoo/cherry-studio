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
const APP_ICONS_DIR = path.join(ROOT, 'resources', 'app-icons')

const ICON_SIZES = [16, 24, 32, 48, 64, 128, 256, 512, 1024]
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256]
const TRAY_SIZE = 32
const APP_ICON_SIZE = 1024
// Same order as the design sheet's STYLES array.
const APP_ICON_STYLES = [
  'original',
  'candy',
  'hologram',
  'neon',
  'fluted',
  'schoolbook',
  'squishy',
  'golden',
  'pixel',
  'glow',
  'ink',
  'blob',
  'doodle',
  'brush',
  'marker',
  'diecut',
  'line',
  'p-original',
  'p-candy',
  'p-holo',
  'p-neon',
  'p-fluted',
  'p-book'
]

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

  function line(ctx, stops, x0, y0, x1, y1) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1)
    stops.forEach(([p, c]) => g.addColorStop(p, c))
    return g
  }

  function star4(ctx, x, y, r, color) {
    ctx.beginPath()
    ctx.moveTo(x, y - r)
    ctx.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y)
    ctx.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r)
    ctx.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y)
    ctx.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
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

  /* ---------- The Original Pear ---------- */
  function drawOriginal(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = '#FCF9F1'
    ctx.fill()

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    shape(ctx, { dx: 46, dy: 34, rot: -0.05, scale: 0.94 }, () => {
      pearPath(ctx)
      ctx.fillStyle = '#FF7A6B'
      ctx.fill()
    })
    shape(ctx, { scale: 0.94 }, () => {
      stemPath(ctx, 26)
      ctx.strokeStyle = '#2C241B'
      ctx.stroke()
      leafPath(ctx)
      ctx.fillStyle = '#3AA76D'
      ctx.fill()
      pearPath(ctx)
      ctx.fillStyle = '#FFC838'
      ctx.fill()
    })

    if (clipToTile) ctx.restore()
  }

  /* ---------- Candy Pear ---------- */
  function drawCandy(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = line(
      ctx,
      [
        [0, '#FFC9DE'],
        [0.5, '#E7B6F2'],
        [1, '#C3B4FF']
      ],
      0,
      0,
      1000,
      1000
    )
    ctx.fill()

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    shape(ctx, {}, () => {
      const f = line(
        ctx,
        [
          [0, '#FFF3A6'],
          [0.42, '#FFC93C'],
          [1, '#FF8A5B']
        ],
        320,
        180,
        700,
        860
      )
      ctx.save()
      ctx.lineJoin = 'round'
      ctx.shadowColor = 'rgba(255,255,255,.9)'
      ctx.shadowBlur = 34 * k
      stemPath(ctx, 26)
      ctx.strokeStyle = 'rgba(255,255,255,.95)'
      ctx.stroke()
      leafPath(ctx)
      ctx.fillStyle = f
      ctx.fill()
      ctx.lineWidth = 24
      ctx.strokeStyle = 'rgba(255,255,255,.95)'
      ctx.stroke()
      pearPath(ctx)
      ctx.fillStyle = f
      ctx.fill()
      ctx.lineWidth = 26
      ctx.stroke()
      ctx.restore()

      ctx.save()
      pearPath(ctx)
      ctx.clip()
      const s = ctx.createRadialGradient(420, 470, 0, 420, 470, 250)
      s.addColorStop(0, 'rgba(255,255,255,.62)')
      s.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = s
      ctx.fillRect(180, 300, 500, 500)
      ctx.restore()
    })

    if (clipToTile) ctx.restore()
  }

  /* ---------- Hologram ---------- */
  function drawHologram(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = line(
      ctx,
      [
        [0, '#7FD3E6'],
        [0.28, '#C3A8F2'],
        [0.55, '#FFD07A'],
        [0.78, '#9FDCB4'],
        [1, '#6FC6DE']
      ],
      100,
      0,
      900,
      1000
    )
    ctx.fill()

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    ctx.save()
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.clip()
    ctx.save()
    ctx.translate(500, 500)
    ctx.rotate(-0.42)
    ctx.fillStyle = 'rgba(255,255,255,.58)'
    ctx.fillRect(-720, -330, 1440, 86)
    ctx.fillStyle = 'rgba(255,255,255,.4)'
    ctx.fillRect(-720, -110, 1440, 40)
    ctx.fillStyle = 'rgba(255,255,255,.3)'
    ctx.fillRect(-720, 250, 1440, 62)
    ctx.fillStyle = 'rgba(90,40,120,.09)'
    ctx.fillRect(-720, 320, 1440, 260)
    ctx.restore()

    const sheen = ctx.createRadialGradient(300, 190, 0, 300, 190, 720)
    sheen.addColorStop(0, 'rgba(255,255,255,.55)')
    sheen.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = sheen
    ctx.fillRect(0, 0, 1000, 1000)

    const vig = ctx.createRadialGradient(500, 500, 320, 500, 500, 780)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(34,24,44,.2)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, 1000, 1000)
    ctx.restore()

    roundRect(ctx, 5, 5, 990, 990, 219)
    ctx.lineWidth = 6
    ctx.strokeStyle = 'rgba(255,255,255,.6)'
    ctx.stroke()

    shape(ctx, { scale: 0.93 }, () => {
      ctx.lineJoin = 'round'
      stemPath(ctx, 18)
      ctx.strokeStyle = 'rgba(18,16,20,.9)'
      ctx.stroke()
      leafPath(ctx)
      ctx.fillStyle = 'rgba(255,255,255,.3)'
      ctx.fill()
      ctx.lineWidth = 16
      ctx.strokeStyle = 'rgba(18,16,20,.92)'
      ctx.stroke()
      pearPath(ctx)
      ctx.fillStyle = 'rgba(255,255,255,.28)'
      ctx.fill()
      ctx.lineWidth = 16
      ctx.stroke()
    })

    if (clipToTile) ctx.restore()
  }

  /* ---------- Fluted Glass ---------- */
  function drawFluted(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = line(
      ctx,
      [
        [0, '#FBF1E2'],
        [1, '#EFDCC4']
      ],
      0,
      0,
      0,
      1000
    )
    ctx.fill()

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    ctx.save()
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.clip()
    for (let x = 0; x < 1000; x += 46) {
      ctx.fillStyle = 'rgba(255,255,255,.34)'
      ctx.fillRect(x, 0, 20, 1000)
    }
    const vig = ctx.createRadialGradient(500, 420, 420, 500, 500, 780)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(150,110,60,.16)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, 1000, 1000)
    ctx.restore()

    // chromatic fringe
    shape(ctx, { dx: -16, scale: 0.93 }, () => {
      pearPath(ctx)
      ctx.fillStyle = 'rgba(255,110,170,.2)'
      ctx.fill()
    })
    shape(ctx, { dx: 16, scale: 0.93 }, () => {
      pearPath(ctx)
      ctx.fillStyle = 'rgba(80,190,255,.18)'
      ctx.fill()
    })

    shape(ctx, { scale: 0.93 }, () => {
      ctx.save()
      pearPath(ctx)
      ctx.clip()
      ctx.fillStyle = line(
        ctx,
        [
          [0, '#FFF3C4'],
          [0.42, '#FFC96A'],
          [1, '#E8983C']
        ],
        250,
        150,
        760,
        880
      )
      ctx.fillRect(180, 80, 640, 840)
      for (let x = 250; x < 770; x += 34) {
        ctx.fillStyle = 'rgba(255,255,255,.62)'
        ctx.fillRect(x, 80, 13, 840)
        ctx.fillStyle = 'rgba(150,85,15,.18)'
        ctx.fillRect(x + 13, 80, 10, 840)
      }
      const s = ctx.createRadialGradient(420, 400, 0, 420, 400, 340)
      s.addColorStop(0, 'rgba(255,255,255,.55)')
      s.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = s
      ctx.fillRect(180, 80, 640, 840)
      ctx.restore()

      pearPath(ctx)
      ctx.lineWidth = 9
      ctx.strokeStyle = 'rgba(255,255,255,.85)'
      ctx.stroke()

      leafPath(ctx)
      ctx.fillStyle = 'rgba(255,214,120,.92)'
      ctx.fill()
      ctx.lineWidth = 8
      ctx.strokeStyle = 'rgba(255,255,255,.8)'
      ctx.stroke()

      stemPath(ctx, 18)
      ctx.strokeStyle = 'rgba(120,70,30,.7)'
      ctx.stroke()
    })

    if (clipToTile) ctx.restore()
  }

  /* ---------- Schoolbook ---------- */
  function drawSchoolbook(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = '#F7EDD6'
    ctx.fill()

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    shape(ctx, { scale: 0.92 }, () => {
      ctx.save()
      pearPath(ctx)
      ctx.clip()
      ctx.fillStyle = '#FFC93C'
      ctx.fillRect(0, 0, 1000, 1000)
      ctx.save()
      ctx.translate(500, 500)
      ctx.rotate(-0.42)
      ctx.fillStyle = '#F2704A'
      ctx.fillRect(-800, 40, 1600, 900)
      ctx.restore()
      ctx.restore()

      leafPath(ctx)
      ctx.fillStyle = '#2B5BD7'
      ctx.fill()

      stemPath(ctx, 26)
      ctx.strokeStyle = '#2E2A22'
      ctx.stroke()
    })

    if (clipToTile) ctx.restore()
  }

  /* ---------- Squishy Pear ---------- */
  function drawSquishy(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = line(
      ctx,
      [
        [0, '#FF9C7A'],
        [0.55, '#FF6B6B'],
        [1, '#F0485E']
      ],
      0,
      0,
      1000,
      1000
    )
    ctx.fill()

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    const glow = ctx.createRadialGradient(430, 340, 0, 430, 340, 660)
    glow.addColorStop(0, 'rgba(255,224,190,.5)')
    glow.addColorStop(1, 'rgba(255,224,190,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 1000, 1000)

    // floor shadow
    ctx.save()
    ctx.translate(500, 880)
    ctx.scale(1, 0.3)
    const sh = ctx.createRadialGradient(0, 0, 10, 0, 0, 300)
    sh.addColorStop(0, 'rgba(110,16,26,.42)')
    sh.addColorStop(1, 'rgba(110,16,26,0)')
    ctx.fillStyle = sh
    ctx.beginPath()
    ctx.arc(0, 0, 300, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    shape(ctx, { scale: 0.86, sy: 0.92, dy: 12 }, () => {
      // leaf
      ctx.save()
      ctx.translate(546, 112)
      ctx.scale(0.84, 0.84)
      ctx.translate(-546, -112)
      leafPath(ctx)
      ctx.fillStyle = line(
        ctx,
        [
          [0, '#86D982'],
          [1, '#35975A']
        ],
        560,
        30,
        740,
        140
      )
      ctx.fill()
      ctx.save()
      leafPath(ctx)
      ctx.clip()
      ctx.beginPath()
      ctx.moveTo(556, 104)
      ctx.lineTo(726, 44)
      ctx.lineTo(706, 66)
      ctx.lineTo(556, 124)
      ctx.closePath()
      ctx.fillStyle = 'rgba(255,255,255,.42)'
      ctx.fill()
      ctx.restore()
      ctx.restore()

      stemPath(ctx, 24)
      ctx.strokeStyle = '#8A5A2B'
      ctx.stroke()

      // body
      pearPath(ctx)
      const body = ctx.createRadialGradient(415, 430, 30, 520, 700, 560)
      body.addColorStop(0, '#FFF8C6')
      body.addColorStop(0.5, '#FFCB4F')
      body.addColorStop(1, '#E8971F')
      ctx.fillStyle = body
      ctx.fill()

      ctx.save()
      pearPath(ctx)
      ctx.clip()
      const s = ctx.createLinearGradient(320, 470, 780, 900)
      s.addColorStop(0, 'rgba(190,105,8,0)')
      s.addColorStop(1, 'rgba(190,105,8,.4)')
      ctx.fillStyle = s
      ctx.fillRect(200, 380, 620, 560)
      const h = ctx.createRadialGradient(398, 466, 0, 398, 466, 190)
      h.addColorStop(0, 'rgba(255,255,255,.6)')
      h.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = h
      ctx.fillRect(210, 300, 380, 380)
      ctx.restore()

      // blush
      ;[
        [372, 648],
        [628, 648]
      ].forEach(([x, y]) => {
        const b = ctx.createRadialGradient(x, y, 0, x, y, 64)
        b.addColorStop(0, 'rgba(255,96,96,.55)')
        b.addColorStop(1, 'rgba(255,96,96,0)')
        ctx.fillStyle = b
        ctx.beginPath()
        ctx.arc(x, y, 64, 0, Math.PI * 2)
        ctx.fill()
      })

      // eyes
      ;[
        [436, 588],
        [564, 588]
      ].forEach(([x, y]) => {
        ctx.beginPath()
        ctx.ellipse(x, y, 26, 33, 0, 0, Math.PI * 2)
        ctx.fillStyle = '#4A2A1C'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x - 8, y - 11, 9, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,.92)'
        ctx.fill()
      })

      // smile
      ctx.beginPath()
      ctx.arc(500, 676, 38, 0.08 * Math.PI, 0.92 * Math.PI)
      ctx.closePath()
      ctx.fillStyle = '#5E1F10'
      ctx.fill()
      ctx.save()
      ctx.beginPath()
      ctx.arc(500, 676, 38, 0.08 * Math.PI, 0.92 * Math.PI)
      ctx.closePath()
      ctx.clip()
      ctx.beginPath()
      ctx.arc(500, 714, 23, 0, Math.PI * 2)
      ctx.fillStyle = '#FF8078'
      ctx.fill()
      ctx.restore()
    })

    star4(ctx, 205, 318, 42, 'rgba(255,255,255,.85)')
    star4(ctx, 812, 336, 30, 'rgba(255,255,255,.7)')
    star4(ctx, 199, 660, 22, 'rgba(255,255,255,.55)')

    if (clipToTile) ctx.restore()
  }

  /* ---------- Golden Pear ---------- */
  function drawGolden(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = line(
      ctx,
      [
        [0, '#FFD54F'],
        [0.55, '#FFC12E'],
        [1, '#F0A018']
      ],
      0,
      0,
      1000,
      1000
    )
    ctx.fill()

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    const glow = ctx.createRadialGradient(360, 300, 0, 360, 300, 700)
    glow.addColorStop(0, 'rgba(255,246,200,.42)')
    glow.addColorStop(1, 'rgba(255,246,200,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 1000, 1000)

    // soft cast shadow under the glyph
    shape(ctx, { dy: 22, scale: 0.94 }, () => {
      pearPath(ctx)
      ctx.fillStyle = 'rgba(150,88,6,.2)'
      ctx.fill()
      leafPath(ctx)
      ctx.fill()
    })

    shape(ctx, { scale: 0.94 }, () => {
      stemPath(ctx, 26)
      ctx.strokeStyle = '#FFFFFF'
      ctx.stroke()

      leafPath(ctx)
      ctx.fillStyle = '#FFFDF6'
      ctx.fill()

      pearPath(ctx)
      ctx.fillStyle = line(
        ctx,
        [
          [0, '#FFFFFF'],
          [1, '#FFF1DA']
        ],
        0,
        150,
        0,
        890
      )
      ctx.fill()

      ctx.save()
      pearPath(ctx)
      ctx.clip()
      const s = ctx.createLinearGradient(300, 500, 780, 900)
      s.addColorStop(0, 'rgba(226,178,96,0)')
      s.addColorStop(1, 'rgba(226,178,96,.22)')
      ctx.fillStyle = s
      ctx.fillRect(200, 400, 620, 520)
      const h = ctx.createRadialGradient(410, 490, 0, 410, 490, 170)
      h.addColorStop(0, 'rgba(255,255,255,.9)')
      h.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = h
      ctx.fillRect(240, 330, 340, 340)
      ctx.restore()
    })

    if (clipToTile) ctx.restore()
  }

  /* ---------- Pixel Pear ---------- */
  function drawPixel(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = '#F7EDD8'
    ctx.fill()

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    const P = {
      K: '#4A3117',
      B: '#FFC93C',
      D: '#DE9E1E',
      L: '#FFDD63',
      G: '#4FA857',
      g: '#3E8A47',
      S: '#7A4B24'
    }
    const rows = [
      '................',
      '.........GG.....',
      '.......SGGGG....',
      '.......SGGg.....',
      '......BBBB......',
      '.....BBBBBB.....',
      '.....BBBBBB.....',
      '....BBBBBBBB....',
      '....BBBBBBBB....',
      '...BBBBBBBBBB...',
      '...BBBBBBBBBB...',
      '..BBBBBBBBBBBB..',
      '..BBBBBBBBBBBB..',
      '...BBBBBBBBBB...',
      '....BBBBBBBB....',
      '................'
    ]
    const g = rows.map((r) => r.split(''))
    const body = (ch) => ch === 'B' || ch === 'D' || ch === 'L'
    const out = g.map((r) => r.slice())
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        if (out[r][c] !== '.') continue
        const near = [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1]
        ].some(([y, x]) => g[y] && body(g[y][x]))
        if (near) out[r][c] = 'K'
      }
    }
    // light the top-left rim, shade the bottom-right rim, leave the rest flat
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        if (!body(out[r][c])) continue
        const up = out[r - 1] && out[r - 1][c]
        const left = out[r][c - 1]
        const down = out[r + 1] && out[r + 1][c]
        const right = out[r][c + 1]
        if (up === 'K' || (left === 'K' && r < 11)) out[r][c] = 'L'
        else if (down === 'K' || right === 'K') out[r][c] = 'D'
      }
    }

    const cell = 1000 / 16
    out.forEach((row, r) => {
      for (let c = 0; c < 16; c++) {
        const ch = row[c]
        if (ch === '.') continue
        const x0 = Math.round(c * cell)
        const y0 = Math.round(r * cell)
        const x1 = Math.round((c + 1) * cell)
        const y1 = Math.round((r + 1) * cell)
        ctx.fillStyle = P[ch]
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0)
      }
    })

    if (clipToTile) ctx.restore()
  }

  function drawGlow(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = line(
      ctx,
      [
        [0, '#FFC61A'],
        [0.55, '#FFAE0E'],
        [1, '#FF8A00']
      ],
      0,
      0,
      1000,
      1000
    )
    ctx.fill()

    const halo = ctx.createRadialGradient(500, 520, 60, 500, 520, 640)
    halo.addColorStop(0, 'rgba(255,244,190,.5)')
    halo.addColorStop(1, 'rgba(255,244,190,0)')
    ctx.fillStyle = halo
    ctx.fillRect(0, 0, 1000, 1000)

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    shape(ctx, { scale: 0.9 }, () => {
      ctx.save()
      ctx.shadowColor = 'rgba(255,248,205,.95)'
      ctx.shadowBlur = 70 * k
      pearPath(ctx)
      ctx.fillStyle = '#FFE9A6'
      ctx.fill()
      leafPath(ctx)
      ctx.fill()
      ctx.restore()

      stemPath(ctx, 24)
      ctx.strokeStyle = '#FFE7A8'
      ctx.stroke()
      leafPath(ctx)
      ctx.fillStyle = '#FFF3C8'
      ctx.fill()

      pearPath(ctx)
      const b = ctx.createRadialGradient(470, 530, 40, 500, 640, 440)
      b.addColorStop(0, '#FFFFFF')
      b.addColorStop(0.45, '#FFF7CF')
      b.addColorStop(1, '#FFD772')
      ctx.fillStyle = b
      ctx.fill()
    })

    if (clipToTile) ctx.restore()
  }

  function drawInk(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = line(
      ctx,
      [
        [0, '#FFDF6B'],
        [0.6, '#FFC93C'],
        [1, '#F2A01B']
      ],
      0,
      0,
      1000,
      1000
    )
    ctx.fill()

    const sheen = ctx.createRadialGradient(360, 260, 0, 360, 260, 640)
    sheen.addColorStop(0, 'rgba(255,255,255,.35)')
    sheen.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = sheen
    ctx.fillRect(0, 0, 1000, 1000)

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    shape(ctx, { rot: -0.42, scale: 0.84 }, () => {
      stemPath(ctx, 32)
      ctx.strokeStyle = '#17130F'
      ctx.stroke()
      leafPath(ctx)
      ctx.fillStyle = '#17130F'
      ctx.fill()
      pearPath(ctx)
      ctx.fillStyle = '#17130F'
      ctx.fill()
    })

    shape(ctx, { rot: -0.42, scale: 0.84 }, () => {
      ctx.save()
      pearPath(ctx)
      ctx.clip()
      const h = ctx.createRadialGradient(400, 430, 0, 400, 430, 280)
      h.addColorStop(0, 'rgba(255,255,255,.22)')
      h.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = h
      ctx.fillRect(200, 250, 600, 600)
      ctx.restore()
    })

    if (clipToTile) ctx.restore()
  }

  function drawBlob(ctx, k, clipToTile) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = '#FAFAF8'
    ctx.fill()

    const cast = ctx.createRadialGradient(520, 700, 60, 520, 700, 420)
    cast.addColorStop(0, 'rgba(120,110,90,.14)')
    cast.addColorStop(1, 'rgba(120,110,90,0)')
    ctx.fillStyle = cast
    ctx.fillRect(120, 300, 800, 620)

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    shape(ctx, { scale: 0.9, dy: 12 }, () => {
      stemPath(ctx, 30)
      ctx.strokeStyle = '#E2680A'
      ctx.stroke()
      leafPath(ctx)
      ctx.fillStyle = line(
        ctx,
        [
          [0, '#FFD23F'],
          [1, '#FF8A00']
        ],
        560,
        20,
        740,
        160
      )
      ctx.fill()
      pearPath(ctx)
      ctx.fillStyle = line(
        ctx,
        [
          [0, '#FFC400'],
          [0.5, '#FF9E00'],
          [1, '#FF6A00']
        ],
        280,
        200,
        760,
        900
      )
      ctx.fill()

      // the Sip cutout
      ctx.beginPath()
      ctx.arc(424, 566, 86, 0, Math.PI * 2)
      ctx.fillStyle = '#FAFAF8'
      ctx.fill()
    })

    if (clipToTile) ctx.restore()
  }

  /* ---------- sticker set (pear-sticker.html) ---------- */
  const STICKER_INK = '#4A2B1E'

  // Chubbier pear than the arc set: short neck, near-round belly.
  function stickerPearPath(ctx) {
    ctx.beginPath()
    ctx.moveTo(500, 236)
    ctx.bezierCurveTo(548, 236, 578, 262, 588, 306)
    ctx.bezierCurveTo(597, 344, 602, 382, 622, 424)
    ctx.bezierCurveTo(664, 486, 784, 528, 784, 656)
    ctx.bezierCurveTo(784, 804, 656, 894, 500, 894)
    ctx.bezierCurveTo(344, 894, 216, 804, 216, 656)
    ctx.bezierCurveTo(216, 528, 336, 486, 378, 424)
    ctx.bezierCurveTo(398, 382, 403, 344, 412, 306)
    ctx.bezierCurveTo(422, 262, 452, 236, 500, 236)
    ctx.closePath()
  }

  // Big angled leaf, base on the stem, tip up-left.
  function stickerLeafPath(ctx) {
    ctx.beginPath()
    ctx.moveTo(520, 170)
    ctx.bezierCurveTo(480, 108, 388, 48, 290, 48)
    ctx.bezierCurveTo(296, 140, 386, 206, 500, 200)
    ctx.bezierCurveTo(508, 190, 514, 180, 520, 170)
    ctx.closePath()
  }

  function stickerStem(ctx, w, color) {
    ctx.lineWidth = w
    ctx.lineCap = 'round'
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(500, 292)
    ctx.quadraticCurveTo(522, 200, 556, 132)
    ctx.stroke()
  }

  function stickerTile(ctx, fill) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = fill
    ctx.fill()
  }

  function stickerFlip(ctx, fn) {
    ctx.save()
    ctx.translate(1000, 0)
    ctx.scale(-1, 1)
    fn()
    ctx.restore()
  }

  function stickerFace(ctx, ink, scale) {
    ctx.save()
    ctx.translate(500, 636)
    ctx.scale(scale, scale)
    ctx.fillStyle = ink
    ;[
      [-62, 0],
      [62, 0]
    ].forEach(([x, y]) => {
      ctx.beginPath()
      ctx.ellipse(x, y, 19, 21, 0, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.lineWidth = 18
    ctx.lineCap = 'round'
    ctx.strokeStyle = ink
    ctx.beginPath()
    ctx.moveTo(-46, 66)
    ctx.quadraticCurveTo(0, 96, 46, 62)
    ctx.stroke()
    ctx.restore()
  }

  function stickerConfetti(ctx, ink) {
    const dot = (x, y, r) => {
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    const ring = (x, y, r) => {
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.lineWidth = 22
      ctx.stroke()
    }
    const cross = (x, y, s) => {
      ctx.lineWidth = 22
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(x - s, y - s)
      ctx.lineTo(x + s, y + s)
      ctx.moveTo(x + s, y - s)
      ctx.lineTo(x - s, y + s)
      ctx.stroke()
    }
    ctx.save()
    ctx.fillStyle = ink
    ctx.strokeStyle = ink
    dot(318, 128, 13)
    dot(716, 96, 11)
    dot(140, 520, 12)
    dot(872, 452, 12)
    ring(246, 330, 34)
    ring(902, 632, 26)
    cross(150, 742, 26)
    cross(842, 210, 24)
    cross(866, 812, 22)
    ctx.restore()
  }

  function drawDoodle(ctx, k, clipToTile) {
    stickerTile(ctx, '#F8F0DE')

    ctx.beginPath()
    ctx.arc(500, 520, 352, 0, Math.PI * 2)
    ctx.fillStyle = '#EFE3C9'
    ctx.fill()

    stickerConfetti(ctx, STICKER_INK)

    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    stickerLeafPath(ctx)
    ctx.fillStyle = '#A9CB80'
    ctx.fill()
    ctx.lineWidth = 30
    ctx.strokeStyle = STICKER_INK
    ctx.stroke()

    stickerStem(ctx, 34, STICKER_INK)

    stickerPearPath(ctx)
    ctx.fillStyle = '#FFC93C'
    ctx.fill()
    ctx.lineWidth = 34
    ctx.strokeStyle = STICKER_INK
    ctx.stroke()

    stickerFace(ctx, STICKER_INK, 1)

    if (clipToTile) ctx.restore()
  }

  function drawBrush(ctx, k, clipToTile) {
    stickerTile(ctx, '#FFFFFF')
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    ctx.save()
    ctx.translate(520, 170)
    ctx.scale(1.12, 1.12)
    ctx.translate(-520, -170)
    stickerLeafPath(ctx)
    ctx.fillStyle = '#3F9E58'
    ctx.fill()
    ctx.lineWidth = 30
    ctx.strokeStyle = '#111111'
    ctx.stroke()
    ctx.save()
    stickerLeafPath(ctx)
    ctx.clip()
    ctx.beginPath()
    ctx.moveTo(486, 176)
    ctx.quadraticCurveTo(392, 116, 300, 74)
    ctx.lineWidth = 18
    ctx.strokeStyle = 'rgba(255,255,255,.45)'
    ctx.stroke()
    ctx.restore()
    ctx.restore()

    stickerStem(ctx, 34, '#111111')

    stickerPearPath(ctx)
    ctx.fillStyle = '#FFC02E'
    ctx.fill()

    ctx.save()
    stickerPearPath(ctx)
    ctx.clip()
    ctx.save()
    ctx.translate(-56, -28)
    stickerPearPath(ctx)
    ctx.fillStyle = '#FFD65F'
    ctx.fill()
    ctx.restore()
    const sp = ctx.createRadialGradient(330, 520, 10, 330, 520, 180)
    sp.addColorStop(0, 'rgba(255,255,255,.7)')
    sp.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = sp
    ctx.fillRect(170, 350, 350, 420)
    ctx.restore()

    stickerPearPath(ctx)
    ctx.lineWidth = 34
    ctx.strokeStyle = '#111111'
    ctx.stroke()

    if (clipToTile) ctx.restore()
  }

  function drawMarker(ctx, k, clipToTile) {
    stickerTile(ctx, '#EFF7E2')
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    stickerFlip(ctx, () => {
      stickerLeafPath(ctx)
      ctx.fillStyle = '#8FDD4A'
      ctx.fill()
      ctx.lineWidth = 30
      ctx.strokeStyle = '#3B1470'
      ctx.stroke()
      ctx.save()
      stickerLeafPath(ctx)
      ctx.clip()
      ctx.beginPath()
      ctx.moveTo(500, 190)
      ctx.quadraticCurveTo(400, 130, 306, 86)
      ctx.lineWidth = 18
      ctx.strokeStyle = 'rgba(255,255,255,.65)'
      ctx.stroke()
      ctx.restore()
    })

    stickerStem(ctx, 32, '#3B1470')

    stickerPearPath(ctx)
    const g = ctx.createLinearGradient(240, 300, 780, 900)
    g.addColorStop(0, '#E4F063')
    g.addColorStop(0.55, '#D5E84C')
    g.addColorStop(1, '#C2DA34')
    ctx.fillStyle = g
    ctx.fill()

    ctx.save()
    stickerPearPath(ctx)
    ctx.clip()
    ctx.beginPath()
    ctx.arc(500, 646, 212, -2.3, -1.05)
    ctx.lineWidth = 30
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'rgba(255,255,255,.9)'
    ctx.stroke()

    const s = ctx.createLinearGradient(560, 720, 800, 900)
    s.addColorStop(0, 'rgba(120,150,10,0)')
    s.addColorStop(1, 'rgba(120,150,10,.35)')
    ctx.fillStyle = s
    ctx.fillRect(520, 660, 320, 280)
    ctx.restore()

    stickerPearPath(ctx)
    ctx.lineWidth = 32
    ctx.strokeStyle = '#3B1470'
    ctx.stroke()

    if (clipToTile) ctx.restore()
  }

  function drawDiecut(ctx, k, clipToTile) {
    stickerTile(ctx, '#FF6B5F')

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    ctx.save()
    ctx.translate(500, 500)
    ctx.rotate(-0.09)
    ctx.scale(0.9, 0.9)
    ctx.translate(-500, -500)
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    ctx.save()
    ctx.shadowColor = 'rgba(90,20,10,.38)'
    ctx.shadowBlur = 46 * k
    ctx.shadowOffsetY = 22 * k
    ctx.strokeStyle = '#FFFFFF'
    ctx.fillStyle = '#FFFFFF'
    ctx.lineWidth = 92
    stickerLeafPath(ctx)
    ctx.fill()
    ctx.stroke()
    stickerStem(ctx, 92, '#FFFFFF')
    stickerPearPath(ctx)
    ctx.fill()
    ctx.stroke()
    ctx.restore()

    stickerLeafPath(ctx)
    ctx.fillStyle = '#3F9E58'
    ctx.fill()
    ctx.lineWidth = 30
    ctx.strokeStyle = '#111111'
    ctx.stroke()

    stickerStem(ctx, 32, '#111111')

    stickerPearPath(ctx)
    ctx.fillStyle = '#FFC02E'
    ctx.fill()
    ctx.lineWidth = 32
    ctx.stroke()
    ctx.restore()

    if (clipToTile) ctx.restore()
  }

  function drawLine(ctx, k, clipToTile) {
    stickerTile(ctx, '#FFC93C')
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    stickerLeafPath(ctx)
    ctx.fillStyle = '#57A96A'
    ctx.fill()
    ctx.lineWidth = 28
    ctx.strokeStyle = '#241C14'
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(500, 186)
    ctx.quadraticCurveTo(400, 122, 318, 82)
    ctx.lineWidth = 14
    ctx.strokeStyle = 'rgba(20,40,20,.35)'
    ctx.stroke()

    stickerStem(ctx, 30, '#241C14')

    stickerPearPath(ctx)
    ctx.lineWidth = 30
    ctx.strokeStyle = '#241C14'
    ctx.stroke()

    if (clipToTile) ctx.restore()
  }

  /* ---------- P studio set (p-studio.html) ---------- */
  const P_BLUE = '#2F49F0'
  const P_CORAL = '#FF5566'

  // The letter is two strokes: a vertical stem and a bowl.
  function pStemPath(ctx) {
    ctx.beginPath()
    ctx.moveTo(319, 236)
    ctx.quadraticCurveTo(303, 508, 317, 780)
  }

  function pBowlPath(ctx) {
    ctx.beginPath()
    ctx.moveTo(335, 268)
    ctx.bezierCurveTo(525, 178, 697, 272, 681, 428)
    ctx.bezierCurveTo(667, 570, 519, 644, 325, 608)
  }

  function pStroke(ctx, color, w) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = w
    ctx.strokeStyle = color
    pStemPath(ctx)
    ctx.stroke()
    pBowlPath(ctx)
    ctx.stroke()
  }

  function pTile(ctx, fill) {
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = fill
    ctx.fill()
  }

  // Offscreen helper for masked fills; drawn in 0–1000 space at canvas resolution.
  function pOffscreen(ctx, draw) {
    const size = ctx.canvas.width || 1000
    const off = document.createElement('canvas')
    off.width = size
    off.height = size
    const m = off.getContext('2d')
    m.setTransform(size / 1000, 0, 0, size / 1000, 0, 0)
    draw(m)
    return off
  }

  function pBlit(ctx, off) {
    // Respect the caller's transform so the artwork lands inside the mac grid.
    ctx.drawImage(off, 0, 0, 1000, 1000)
  }

  function pMasked(ctx, drawMask, drawFill) {
    pBlit(
      ctx,
      pOffscreen(ctx, (m) => {
        drawMask(m)
        m.globalCompositeOperation = 'source-in'
        drawFill(m)
      })
    )
  }

  function drawPOriginal(ctx, k, clipToTile) {
    pTile(ctx, '#FCFBF5')
    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    ctx.lineCap = 'round'
    ctx.lineWidth = 128

    ctx.strokeStyle = P_BLUE
    pStemPath(ctx)
    ctx.stroke()

    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    ctx.strokeStyle = P_CORAL
    pBowlPath(ctx)
    ctx.stroke()
    ctx.restore()

    if (clipToTile) ctx.restore()
  }

  function drawPCandy(ctx, k, clipToTile) {
    pTile(
      ctx,
      line(
        ctx,
        [
          [0, '#FFC9DE'],
          [0.5, '#E7B6F2'],
          [1, '#C3B4FF']
        ],
        0,
        0,
        1000,
        1000
      )
    )
    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    ctx.save()
    ctx.shadowColor = 'rgba(255,255,255,.9)'
    ctx.shadowBlur = 34 * k
    pStroke(ctx, 'rgba(255,255,255,.96)', 178)
    ctx.restore()

    const g = line(
      ctx,
      [
        [0, '#FFF3A6'],
        [0.45, '#FFCB4F'],
        [1, '#FF8A5B']
      ],
      360,
      220,
      800,
      760
    )
    pStroke(ctx, g, 128)

    if (clipToTile) ctx.restore()
  }

  function drawPHolo(ctx, k, clipToTile) {
    pTile(
      ctx,
      line(
        ctx,
        [
          [0, '#7FD3E6'],
          [0.28, '#C3A8F2'],
          [0.55, '#FFD07A'],
          [0.78, '#9FDCB4'],
          [1, '#6FC6DE']
        ],
        100,
        0,
        900,
        1000
      )
    )
    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    ctx.save()
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.clip()
    ctx.save()
    ctx.translate(500, 500)
    ctx.rotate(-0.42)
    ctx.fillStyle = 'rgba(255,255,255,.55)'
    ctx.fillRect(-720, -330, 1440, 86)
    ctx.fillStyle = 'rgba(255,255,255,.34)'
    ctx.fillRect(-720, -110, 1440, 40)
    ctx.fillStyle = 'rgba(255,255,255,.24)'
    ctx.fillRect(-720, 250, 1440, 62)
    ctx.restore()
    const vig = ctx.createRadialGradient(500, 500, 320, 500, 500, 780)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(34,24,44,.2)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, 1000, 1000)
    ctx.restore()

    // A thin dark ring, then a glass interior the holo shows through.
    pBlit(
      ctx,
      pOffscreen(ctx, (m) => {
        pStroke(m, 'rgba(18,16,20,.92)', 152)
        m.globalCompositeOperation = 'destination-out'
        pStroke(m, '#000', 128)
      })
    )
    pBlit(
      ctx,
      pOffscreen(ctx, (m) => {
        pStroke(m, '#FFFFFF', 128)
        m.globalCompositeOperation = 'source-in'
        m.fillStyle = 'rgba(255,255,255,.26)'
        m.fillRect(0, 0, 1000, 1000)
      })
    )

    if (clipToTile) ctx.restore()
  }

  function drawPNeon(ctx, k, clipToTile) {
    const bg = ctx.createRadialGradient(500, 400, 40, 500, 540, 780)
    bg.addColorStop(0, '#5B1A8E')
    bg.addColorStop(0.55, '#2E0A4A')
    bg.addColorStop(1, '#14041F')
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.fillStyle = bg
    ctx.fill()

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    ctx.save()
    ctx.shadowColor = 'rgba(255,63,208,.95)'
    ctx.shadowBlur = 80 * k
    pStroke(ctx, '#FF6BE0', 132)
    ctx.restore()

    // Hollow the tube with the same background gradient.
    pStroke(ctx, bg, 88)

    ctx.save()
    ctx.shadowColor = 'rgba(120,90,255,.8)'
    ctx.shadowBlur = 40 * k
    ctx.beginPath()
    pBowlPath(ctx)
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'rgba(255,214,250,.85)'
    ctx.stroke()
    ctx.restore()

    if (clipToTile) ctx.restore()
  }

  function drawPFluted(ctx, k, clipToTile) {
    pTile(
      ctx,
      line(
        ctx,
        [
          [0, '#FBF1E2'],
          [1, '#EFDCC4']
        ],
        0,
        0,
        0,
        1000
      )
    )

    ctx.save()
    roundRect(ctx, 0, 0, 1000, 1000, 224)
    ctx.clip()
    for (let x = 0; x < 1000; x += 46) {
      ctx.fillStyle = 'rgba(255,255,255,.32)'
      ctx.fillRect(x, 0, 20, 1000)
    }
    ctx.restore()

    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    pMasked(
      ctx,
      (m) => pStroke(m, '#000', 128),
      (m) => {
        m.fillStyle = line(
          m,
          [
            [0, '#FFF4CC'],
            [0.45, '#FFCB6B'],
            [1, '#E8933A']
          ],
          300,
          200,
          780,
          820
        )
        m.fillRect(0, 0, 1000, 1000)
        m.globalCompositeOperation = 'source-atop'
        for (let x = 300; x < 800; x += 32) {
          m.fillStyle = 'rgba(255,255,255,.55)'
          m.fillRect(x, 150, 12, 700)
          m.fillStyle = 'rgba(150,85,15,.16)'
          m.fillRect(x + 12, 150, 9, 700)
        }
      }
    )

    if (clipToTile) ctx.restore()
  }

  function drawPBook(ctx, k, clipToTile) {
    pTile(ctx, '#F7EDD6')
    if (clipToTile) {
      ctx.save()
      roundRect(ctx, 0, 0, 1000, 1000, 224)
      ctx.clip()
    }

    ctx.save()
    ctx.translate(20, 24)
    pStroke(ctx, '#F7C948', 128)
    ctx.restore()

    ctx.lineCap = 'round'
    ctx.lineWidth = 128
    ctx.strokeStyle = '#2B5BD7'
    pStemPath(ctx)
    ctx.stroke()

    ctx.strokeStyle = '#F2704A'
    pBowlPath(ctx)
    ctx.stroke()

    if (clipToTile) ctx.restore()
  }

  /* ---------- style registry ---------- */
  const STYLES = {
    original: drawOriginal,
    candy: drawCandy,
    hologram: drawHologram,
    neon: drawNeon,
    fluted: drawFluted,
    schoolbook: drawSchoolbook,
    squishy: drawSquishy,
    golden: drawGolden,
    pixel: drawPixel,
    glow: drawGlow,
    ink: drawInk,
    blob: drawBlob,
    doodle: drawDoodle,
    brush: drawBrush,
    marker: drawMarker,
    diecut: drawDiecut,
    line: drawLine,
    'p-original': drawPOriginal,
    'p-candy': drawPCandy,
    'p-holo': drawPHolo,
    'p-neon': drawPNeon,
    'p-fluted': drawPFluted,
    'p-book': drawPBook
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
      const style = options.style || 'neon'
      const draw = STYLES[style]
      if (!draw) throw new Error(`Unknown style: ${style}`)
      ctx.setTransform(k, 0, 0, k, offset, offset)
      draw(ctx, k, mac)
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

    // In-app icon switcher assets: one 1024 px PNG per style.
    const appIconResults = []
    for (const style of APP_ICON_STYLES) {
      const png = await renderPng(win, { size: APP_ICON_SIZE, mode: 'mac', style })
      appIconResults.push(writeFile(path.join(APP_ICONS_DIR, `${style}.png`), png))
    }

    const formatRows = (entries) =>
      entries
        .map(({ filePath, bytes }) => {
          const rel = path.relative(ROOT, filePath)
          return `  ${rel.padEnd(58)} ${formatSize(bytes).padStart(9)}`
        })
        .join('\n')

    console.log('\nGenerated brand assets:\n')
    console.log(`  ${'file'.padEnd(58)} ${'size'.padStart(9)}`)
    console.log(`  ${'-'.repeat(58)} ${'-'.repeat(9)}`)
    console.log(formatRows(results))
    console.log(
      `\n  ${results.length} files written. Full-bleed preview: ${path.relative(ROOT, path.join(TMP_DIR, 'pear-studio-full-bleed-1024.png'))}`
    )

    console.log(`\nApp icons (${APP_ICON_SIZE}×${APP_ICON_SIZE}):\n`)
    console.log(`  ${'file'.padEnd(58)} ${'size'.padStart(9)}`)
    console.log(`  ${'-'.repeat(58)} ${'-'.repeat(9)}`)
    console.log(formatRows(appIconResults))
    console.log(`\n  ${appIconResults.length} app icons written.`)

    app.exit(0)
  } catch (error) {
    console.error('Icon generation failed:', error)
    app.exit(1)
  }
}

void main()
