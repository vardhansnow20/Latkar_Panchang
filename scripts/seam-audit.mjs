/**
 * Hunt for hard lines at register boundaries.
 *
 * The page is one continuous sky, so every seam between registers is a
 * mistake — but an overlay that starts at full strength on a
 * register's first pixel produces exactly that, and it is easy to miss
 * by eye on a gradient. This measures instead: park each boundary in
 * the viewport and sample a row of columns across the whole width.
 *
 * The verdict is the *median* column, not the worst one. A seam is by
 * definition a line all the way across, so it moves the median; a
 * single column that happens to cross the celestial rail, a star or a
 * plate edge moves only itself. Judging by the worst column reported
 * the brass rail as a 120/255 "seam" purely because the sample landed
 * on it.
 *
 * The trust register's parchment field was found this way — a 16/255
 * step running the full width, present only from `sm` up, because
 * that is where the field switches on.
 */
import { chromium } from "playwright-core"
import sharp from "sharp"

const URL = process.env.URL ?? "http://localhost:4174/kolhapur-latkar-panchang/"
const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe"

/**
 * How far the boundary may exceed the page's own noise floor.
 *
 * An absolute threshold does not work here: film grain and the
 * dithering of a very long gradient mean neighbouring rows always
 * differ a little, and that floor moves with the artwork. So each
 * boundary is compared against a control row measured 200px inside the
 * same register, where there is no boundary — and only the excess
 * counts. A real seam stands well clear of the floor: the parchment
 * wash measured 16 against a floor of 3.
 */
const EXCESS_LIMIT = 6

const browser = await chromium.launch({ executablePath: CHROME })
const failures = []

for (const [label, width, height] of [
  ["mobile", 390, 844],
  ["tablet", 768, 1024],
  ["laptop", 1440, 900],
  ["wide", 1901, 920],
]) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(URL, { waitUntil: "networkidle" })
  await page.waitForTimeout(700)

  const ids = await page.evaluate(() =>
    [...document.querySelectorAll("section[id]")].map((s) => s.id)
  )

  for (const id of ids) {
    // Park this register's top edge at a third of the way down, clear
    // of the masthead and of the viewport's own edges.
    for (let i = 0; i < 90; i++) {
      const done = await page.evaluate((sid) => {
        const el = document.getElementById(sid)
        const r = el.getBoundingClientRect()
        const want = window.innerHeight * 0.33
        if (Math.abs(r.top - want) < 12) return true
        window.scrollTo({
          top: window.scrollY + Math.max(-600, Math.min(600, r.top - want)),
          behavior: "instant",
        })
        return false
      }, id)
      if (done) break
      await page.waitForTimeout(90)
    }
    await page.waitForTimeout(500)

    const top = await page.evaluate(
      (sid) => Math.round(document.getElementById(sid).getBoundingClientRect().top),
      id
    )
    if (top < 40 || top > height - 40) continue

    const buf = await page.screenshot()
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
    const px = (x, y) => {
      const i = (y * info.width + x) * info.channels
      return [data[i], data[i + 1], data[i + 2]]
    }

    /** Median single-pixel step across the width at row `y`. */
    const medianStepAt = (y) => {
      const steps = []
      for (let f = 0.08; f <= 0.93; f += 0.06) {
        const x = Math.round(width * f)
        if (x < 1 || x >= info.width - 1) continue
        if (y - 2 < 0 || y + 1 >= info.height) continue
        const a = px(x, y - 2)
        const b = px(x, y + 1)
        steps.push(Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]))
      }
      if (!steps.length) return null
      steps.sort((p, q) => p - q)
      return steps[Math.floor(steps.length / 2)]
    }

    const atBoundary = medianStepAt(top)
    // The control: the same measurement well inside the register,
    // where nothing but sky and grain should be changing.
    const floor = medianStepAt(top + 200)
    if (atBoundary === null || floor === null) continue

    const excess = atBoundary - floor
    if (excess > EXCESS_LIMIT) {
      failures.push(
        `${label} #${id}: ${atBoundary}/765 step at the boundary against ` +
          `a floor of ${floor} nearby — ${excess} above the page's own noise`
      )
    }
  }
  await page.close()
}

await browser.close()

if (failures.length) {
  console.error(`\nFAIL - ${failures.length} visible seams at register boundaries:\n`)
  for (const f of failures) console.error("  " + f)
  process.exit(1)
}
console.log("PASS - no visible seams at any register boundary, 4 widths")
