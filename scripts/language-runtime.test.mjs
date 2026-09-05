/**
 * Runtime language switching — does the page break when a visitor
 * toggles EN <-> मराठी *while looking at it*?
 *
 * Every other language test in this suite seeds the language before
 * load, through addInitScript. That exercises rendering, not
 * switching: a fresh document has no scroll position to lose, no
 * sticky scene in flight, and no measured rail stations to
 * invalidate. Switching is a different code path, and it is the one
 * the visitor actually uses.
 *
 * At several scroll depths, in both directions, on three viewports,
 * this asserts:
 *   - scroll position survives, so the reader stays where they were;
 *   - the section under the reader is still the same section;
 *   - nothing overflows the viewport horizontally;
 *   - no text is clipped by its own box (the Devanagari failure: a
 *     taller line box inside a height chosen for Latin);
 *   - interactive elements do not land on top of one another;
 *   - the rail's current station still matches the reader's position;
 *   - the console stays clean.
 *
 * On mobile the switch is reached through the menu, so the test walks
 * the real path: open, switch, close. That path is worth testing on
 * its own — a drawer that locks the body while open is the usual way
 * scroll position gets lost.
 *
 * What "scroll position survives" means here is worth stating,
 * because the obvious test is the wrong one. Marathi sets ~320px
 * longer than English over the whole page, so the document genuinely
 * changes height on a switch, and Chrome's scroll anchoring then
 * adjusts window.scrollY to keep the content under the reader
 * stationary. Asserting a stable scrollY therefore fails on correct
 * behaviour: measured at 80% depth, scrollY moved 173px while the
 * paragraph the reader was looking at moved 2px.
 *
 * So the invariant is the reader's, not the scrollbar's: tag the
 * element at the centre of the viewport before the switch and require
 * that the *same element* still be in the same place after it.
 */
import { chromium } from "playwright-core"

const URL = process.env.URL ?? "http://localhost:4174/kolhapur-latkar-panchang/"
const CHROME =
  process.env.CHROME ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

/**
 * How far the element under the reader may move, as a fraction of the
 * screen.
 *
 * Across most of the page this is nearly exact — the browser's scroll
 * anchoring holds the reader to within a couple of pixels while the
 * document grows by ~320px. It loosens in the two registers that carry
 * parallax, because Chrome will not select a scroll anchor inside a
 * transformed subtree and those wrappers are transformed every frame.
 * Measured worst case there is 183px on a 844px phone: the reader
 * stays in the same register, looking at the same milestone, about a
 * fifth of a screen from where they were, and switching back returns
 * them to the exact pixel.
 *
 * A quarter of a screen therefore passes what the page actually does
 * and still fails the thing worth catching — a switch that throws the
 * reader somewhere else entirely.
 */
const ANCHOR_TOLERANCE = 0.25
const DEPTHS = [0, 0.12, 0.3, 0.45, 0.62, 0.8, 0.97]
const VIEWPORTS = [
  ["mobile", 390, 844],
  ["tablet", 768, 1024],
  ["desktop", 1440, 900],
]

const failures = []
const fail = (where, msg) => failures.push(`${where}: ${msg}`)

/* ── measured in the page ─────────────────────────────────────── */

const SNAPSHOT = () => {
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight

  /**
   * Visible *and* reachable — opacity has to be accumulated up the
   * tree. The rail's station labels, for one, are faded by a parent;
   * reading only the element's own computed opacity reports them as
   * showing when nothing is on screen.
   */
  const shown = (el) => {
    let node = el
    let alpha = 1
    while (node && node !== document.documentElement) {
      const s = getComputedStyle(node)
      if (s.display === "none" || s.visibility === "hidden") return false
      alpha *= +s.opacity
      if (alpha < 0.02) return false
      node = node.parentElement
    }
    return true
  }

  /** The visually-hidden pattern: a 1px box holding real text for a
   * screen reader. Every geometric check has to leave it alone. */
  const offscreenForSR = (el) => el.clientHeight <= 1 || el.clientWidth <= 1

  /** True if anything between `el` and the viewport clips horizontally.
   * Decorative fields — the nebula, the corona, the orbit dial — are
   * deliberately far wider than the screen and are contained by a
   * parent. Their own rect says nothing about whether the *page*
   * scrolls sideways. */
  const clippedByAncestor = (el) => {
    let node = el.parentElement
    while (node && node !== document.documentElement) {
      const s = getComputedStyle(node)
      if (s.overflowX !== "visible") return true
      node = node.parentElement
    }
    return false
  }

  // The section occupying the middle of the viewport.
  let current = null
  for (const s of document.querySelectorAll("section[id]")) {
    const r = s.getBoundingClientRect()
    if (r.top <= vh / 2 && r.bottom >= vh / 2) current = s.id
  }

  const station =
    document.querySelector('a[aria-current="true"][href^="#"]')?.getAttribute("href") ?? null

  // Only what can actually push the page sideways. Elements inside an
  // <svg> are excluded outright: their DOM rects are user-space
  // geometry the viewBox already clips, so a ray drawn past the edge
  // of its own canvas reports as an overflowing element while the
  // page stays exactly as wide as the screen.
  const overflow = []
  const scrolls = document.documentElement.scrollWidth > vw + 1
  for (const el of document.querySelectorAll("body *")) {
    if (!scrolls) break
    if (el.closest("svg") || !shown(el) || clippedByAncestor(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.bottom < -vh || r.top > vh * 2) continue
    if (r.right > vw + 1 || r.left < -1) {
      const cls = String(el.className || "").slice(0, 44)
      overflow.push(`${el.tagName.toLowerCase()}[${cls}] ${Math.round(r.left)}..${Math.round(r.right)}/${vw}`)
    }
  }

  // Text taller than the box that holds it, where the box cannot
  // scroll. A scrollable axis is a working scroller, not a defect.
  const clipped = []
  for (const el of document.querySelectorAll(
    "h1,h2,h3,h4,p,li,a,button,figcaption,dt,dd,label,summary"
  )) {
    if (!shown(el) || offscreenForSR(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.bottom < 0 || r.top > vh) continue
    const s = getComputedStyle(el)
    const oy = s.overflowY
    if (oy === "visible" || oy === "auto" || oy === "scroll") continue
    if (el.scrollHeight - el.clientHeight > 2) {
      clipped.push(
        `${el.tagName.toLowerCase()} "${(el.textContent || "").trim().slice(0, 30)}" ${el.scrollHeight}>${el.clientHeight}`
      )
    }
  }

  return {
    current,
    station,
    overflow,
    clipped,
    scrollY: Math.round(window.scrollY),
    docHeight: Math.round(document.documentElement.scrollHeight),
    lang: document.documentElement.lang,
  }
}

const OVERLAPS = () => {
  const vh = document.documentElement.clientHeight

  const shown = (el) => {
    let node = el
    let alpha = 1
    while (node && node !== document.documentElement) {
      const s = getComputedStyle(node)
      if (s.display === "none" || s.visibility === "hidden") return false
      alpha *= +s.opacity
      if (alpha < 0.02) return false
      node = node.parentElement
    }
    // A control inside a closed <details> reports a box that is never
    // painted; screenshots confirmed this is not a real collision.
    const d = el.closest("details")
    if (d && !d.open && !el.matches("summary")) return false
    return true
  }

  /** The nearest fixed or sticky ancestor, or null.
   *
   * The masthead and the celestial rail float *over* the page — that
   * is their whole job, and every control beneath them intersects
   * them by design. Only a collision between two controls in the same
   * layer is a real one. */
  const layer = (el) => {
    let node = el
    while (node && node !== document.documentElement) {
      const p = getComputedStyle(node).position
      if (p === "fixed" || p === "sticky") return node
      node = node.parentElement
    }
    return null
  }

  const els = [...document.querySelectorAll("a,button,[role=button],input,summary")]
    .filter(shown)
    .map((el) => ({ el, r: el.getBoundingClientRect(), layer: layer(el) }))
    .filter(({ r }) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < vh)

  const out = []
  for (let i = 0; i < els.length; i++) {
    for (let j = i + 1; j < els.length; j++) {
      const a = els[i]
      const b = els[j]
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue
      if (a.layer !== b.layer) continue
      const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left)
      const oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top)
      if (ox > 2 && oy > 2) {
        const name = (e) => (e.textContent || e.tagName).trim().slice(0, 20) || e.tagName
        out.push(`"${name(a.el)}" over "${name(b.el)}" (${Math.round(ox)}x${Math.round(oy)})`)
      }
    }
  }
  return out
}

/**
 * Mark the element at the middle of the viewport, and remember where
 * it sits. The DOM is not rebuilt on a language change — the provider
 * swaps one content object and React re-renders in place — so the
 * same node is still there afterwards to measure.
 */
const TAG_ANCHOR = () => {
  const vh = document.documentElement.clientHeight
  const el = [...document.querySelectorAll("p,h1,h2,h3,li,figcaption,dd,dt")].find((e) => {
    const r = e.getBoundingClientRect()
    return r.top > vh * 0.2 && r.top < vh * 0.7 && r.height > 8 && e.textContent.trim()
  })
  window.__anchor = el ?? null
  return el
    ? { top: Math.round(el.getBoundingClientRect().top), section: el.closest("section[id]")?.id ?? null }
    : null
}

const READ_ANCHOR = () => {
  const el = window.__anchor
  if (!el || !el.isConnected) return null
  return {
    top: Math.round(el.getBoundingClientRect().top),
    section: el.closest("section[id]")?.id ?? null,
    text: el.textContent.trim().slice(0, 36),
  }
}

/* ── driving the toggle ───────────────────────────────────────── */

/**
 * Click the option for `lang`, whichever mount is reachable.
 *
 * The radios carry aria-labels in the *current* language, so they are
 * not a stable selector — index within the radiogroup is, since
 * LANGUAGES is a fixed ["en", "mr"]. On narrow screens the only
 * reachable copy lives in the menu, so this opens it and closes it
 * again, which is the visitor's actual path.
 */
async function switchTo(page, lang) {
  const index = lang === "en" ? 0 : 1
  const radios = page.locator('[role="radiogroup"] [role="radio"]')

  const reachable = async () => {
    const n = await radios.count()
    for (let i = 0; i < n; i += 2) {
      if (await radios.nth(i + index).isVisible()) return radios.nth(i + index)
    }
    return null
  }

  let target = await reachable()
  let openedMenu = false

  if (!target) {
    const menu = page.locator('header button[aria-expanded="false"]').first()
    if (!(await menu.count())) throw new Error("no reachable language toggle and no menu button")
    await menu.click()
    await page.waitForTimeout(450)
    openedMenu = true
    target = await reachable()
    if (!target) throw new Error("language toggle not reachable even with the menu open")
  }

  await target.click()
  await page.waitForTimeout(700)

  if (openedMenu) {
    const close = page.locator('header button[aria-expanded="true"]').first()
    if (await close.count()) await close.click()
    await page.waitForTimeout(500)
  }
}

/**
 * Travel to a depth the way a visitor does.
 *
 * Teleporting there with a single scrollTo looks equivalent and is
 * not: the reveal animations are driven by an IntersectionObserver,
 * and jumping past a register leaves its contents at their hidden
 * opacity for good. Measured that way, an English page showed a blank
 * column where Marathi showed a whole journey stage, and the
 * "difference" was entirely the unfired animation.
 *
 * Depths are visited in ascending order, so this only ever walks
 * forward from wherever the page already is.
 */
async function travelTo(page, depth) {
  const target = Math.round(
    (await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)) *
      depth
  )
  for (;;) {
    const done = await page.evaluate((to) => {
      const step = Math.min(window.innerHeight * 0.75, Math.abs(to - window.scrollY))
      const next = window.scrollY + Math.sign(to - window.scrollY) * step
      window.scrollTo({ top: next, behavior: "instant" })
      return Math.abs(to - window.scrollY) < 2
    }, target)
    if (done) break
    await page.waitForTimeout(120)
  }
  // Long enough for the last register's reveal to finish.
  await page.waitForTimeout(900)
  await settleImages(page)
}

/**
 * Wait until every image near the viewport has actually arrived.
 *
 * They are lazily loaded, so one that has not yet been fetched can
 * still be filling in while the page is measured. Comparing a
 * before-shot taken mid-load against an after-shot taken once loading
 * finished reports the loading as though it were a language
 * difference — which is exactly what an empty photo mount in English
 * beside a full one in Marathi turned out to be.
 */
async function settleImages(page) {
  await page
    .waitForFunction(
      () => {
        const vh = window.innerHeight
        return [...document.querySelectorAll("img")]
          .filter((im) => {
            const r = im.getBoundingClientRect()
            return r.bottom > -vh && r.top < vh * 2 && im.getAttribute("src")
          })
          .every((im) => im.complete && im.naturalHeight > 0)
      },
      undefined,
      { timeout: 8000 }
    )
    .catch(() => {
      /* A slot with no file behind it yet stays pending; not a failure. */
    })
  await page.waitForTimeout(250)
}

/* ── the run ──────────────────────────────────────────────────── */

const browser = await chromium.launch({ executablePath: CHROME })

for (const [label, width, height] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height } })
  const errors = []
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
  page.on("pageerror", (e) => errors.push(String(e)))

  await page.goto(URL, { waitUntil: "networkidle" })
  await page.waitForTimeout(800)

  for (const depth of DEPTHS) {
    await travelTo(page, depth)

    for (const to of ["mr", "en"]) {
      const before = await page.evaluate(SNAPSHOT)
      const anchorBefore = await page.evaluate(TAG_ANCHOR)
      try {
        await switchTo(page, to)
      } catch (e) {
        fail(`${label} @${Math.round(depth * 100)}%`, String(e.message))
        continue
      }
      const after = await page.evaluate(SNAPSHOT)
      const where = `${label} @${Math.round(depth * 100)}% -> ${to}`

      if (after.lang !== to) fail(where, `documentElement.lang is "${after.lang}"`)

      await settleImages(page)
      const anchorAfter = await page.evaluate(READ_ANCHOR)
      if (anchorBefore && !anchorAfter) {
        fail(where, "the element under the reader was removed from the document")
      } else if (anchorBefore && anchorAfter) {
        const moved = Math.abs(anchorAfter.top - anchorBefore.top)
        if (moved > height * ANCHOR_TOLERANCE)
          fail(
            where,
            `the reader's place moved ${moved}px ("${anchorAfter.text}" ` +
              `${anchorBefore.top} -> ${anchorAfter.top}); ` +
              `document ${before.docHeight} -> ${after.docHeight}`
          )
        if (anchorBefore.section !== anchorAfter.section)
          fail(where, `reader left the section: ${anchorBefore.section} -> ${anchorAfter.section}`)
      }

      if (after.overflow.length)
        fail(where, `horizontal overflow: ${after.overflow.slice(0, 3).join(" | ")}`)

      if (after.clipped.length)
        fail(where, `clipped text: ${after.clipped.slice(0, 3).join(" | ")}`)

      // The rail's station is derived from measured section offsets, so
      // it is the check that would catch stale measurements after the
      // sections change height.
      if (before.station && after.station && before.station !== after.station)
        fail(where, `rail station changed: ${before.station} -> ${after.station}`)

      const overlaps = await page.evaluate(OVERLAPS)
      if (overlaps.length)
        fail(where, `overlapping controls: ${overlaps.slice(0, 3).join(" | ")}`)
    }
  }

  // Toggled hard, repeatedly: does anything race or leak a listener?
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
  await page.waitForTimeout(400)
  for (let i = 0; i < 4; i++) {
    await switchTo(page, "mr")
    await switchTo(page, "en")
  }
  const settled = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    stored: localStorage.getItem("klp.language"),
  }))
  if (settled.lang !== "en")
    fail(`${label} rapid-toggle`, `settled on lang="${settled.lang}", expected en`)
  if (settled.stored !== "en")
    fail(`${label} rapid-toggle`, `localStorage holds "${settled.stored}", expected en`)

  if (errors.length) fail(label, `console: ${errors.slice(0, 3).join(" | ")}`)
  await page.close()
}

await browser.close()

if (failures.length) {
  console.error(`\nFAIL - ${failures.length} runtime language-switch problems:\n`)
  for (const f of failures) console.error("  " + f)
  process.exit(1)
}
console.log("PASS - runtime language switching clean at every depth, both directions, 3 viewports")
