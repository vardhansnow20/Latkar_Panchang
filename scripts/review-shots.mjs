/**
 * Screenshots for review — both languages, phone and desktop, at the
 * points where Marathi's different line lengths are most likely to
 * show: the hero, the timeline, the trust claims, the archive labels,
 * and the centred contact plate.
 *
 * Run:  node scripts/review-shots.mjs [baseUrl]
 * Output: review-shots/<lang>-<width>-<section>.png
 */
import { chromium } from "playwright-core"
import fs from "node:fs"

const BASE = process.argv[2] ?? "http://localhost:4174/kolhapur-latkar-panchang/"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const OUT = "review-shots"

fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: CHROME, headless: true })

/** Anchored to element ids rather than pixel offsets: the two languages
 * produce different page heights, so a fixed scrollY would frame
 * different content in each. */
const SPOTS = ["opening", "descent", "trust", "archive", "reach"]

for (const lang of ["en", "mr"]) {
  for (const width of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
    await ctx.addInitScript((l) => localStorage.setItem("klp.language", l), lang)
    const page = await ctx.newPage()
    await page.goto(BASE, { waitUntil: "networkidle" })

    // Walk the whole page first so every reveal has fired.
    const h = await page.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < h; y += 800) {
      await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y)
      await page.waitForTimeout(30)
    }

    for (const id of SPOTS) {
      await page.evaluate((sel) => {
        const el = document.getElementById(sel)
        // Land where a real anchor jump lands: clear of the fixed
        // masthead. The previous +40 tucked each heading's first line
        // under the header, which made Devanagari matras look clipped
        // in review when the page itself was fine.
        const clearance = Math.min(Math.max(window.innerHeight * 0.06, 72), 104)
        if (el) window.scrollTo({ top: Math.max(el.offsetTop - clearance, 0), behavior: "instant" })
      }, id)
      await page.waitForTimeout(550)
      // Plates attach their src on approach and fade in on load, so a
      // shot taken the moment a section arrives catches empty mounts
      // and misreports a working page as a broken one.
      await page
        .waitForFunction(
          () => {
            const vh = window.innerHeight
            return [...document.querySelectorAll("img")]
              .filter((im) => {
                const r = im.getBoundingClientRect()
                return im.getAttribute("src") && r.bottom > 0 && r.top < vh
              })
              .every((im) => im.complete && im.naturalWidth > 0)
          },
          undefined,
          { timeout: 6000 }
        )
        .catch(() => {})
      await page.waitForTimeout(400)
      await page.screenshot({ path: `${OUT}/${lang}-${width}-${id}.png` })
    }
    await ctx.close()
  }
}

await browser.close()
console.log(`wrote ${2 * 2 * SPOTS.length} screenshots to ${OUT}/`)
