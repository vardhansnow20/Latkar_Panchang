/**
 * Responsive sweep, in both languages.
 *
 * Drives system Chrome via playwright-core against a production
 * preview build, and checks the things that actually break on a long
 * scrolling page: horizontal overflow, text escaping the viewport,
 * touch-target size, and — because Marathi sets considerably wider
 * than English in places — whether switching language introduces
 * either.
 *
 * Run:  node scripts/responsive-sweep.mjs [baseUrl]
 * Exits non-zero if any check fails, so it can gate a commit.
 */
import { chromium } from "playwright-core"

const BASE = process.argv[2] ?? "http://localhost:4174/kolhapur-latkar-panchang/"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const WIDTHS = [375, 390, 414, 768, 1024, 1440]
const LANGS = ["en", "mr"]

/** Runs in the page. Returns every violation found at this size. */
function audit() {
  const doc = document.documentElement
  const vw = doc.clientWidth
  const out = { vw, docScrollW: doc.scrollWidth, overflow: doc.scrollWidth > vw + 1, offenders: [], small: [], clipped: [] }

  // Elements crossing the right edge. Decorative layers are expected to
  // (they are clipped by their register), so only count those that are
  // NOT inside an overflow-hidden ancestor.
  const clipped = (el) => {
    let n = el.parentElement
    while (n && n !== document.body) {
      const o = getComputedStyle(n)
      if (o.overflowX !== "visible" || o.overflowY !== "visible") return true
      n = n.parentElement
    }
    return false
  }

  // Visually-hidden-until-focused controls (the skip link) measure 1×1
  // and report their text as clipped. That is exactly what `sr-only`
  // is for, so they are not findings.
  const srOnly = (el) => el.closest("[class*='sr-only']") !== null

  for (const el of document.querySelectorAll("main *, header *, footer *")) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (srOnly(el)) continue
    if (r.right > vw + 1 && !clipped(el) && el.getAttribute("aria-hidden") !== "true") {
      out.offenders.push({
        tag: el.tagName,
        cls: (el.getAttribute("class") || "").slice(0, 60),
        right: Math.round(r.right),
        text: (el.textContent || "").trim().slice(0, 40),
      })
    }
  }

  // Text nodes wider than their own container — the signature of a long
  // unbroken Marathi compound that cannot wrap.
  for (const el of document.querySelectorAll("h1,h2,h3,p,li,dd,dt,span,a,button")) {
    if (el.children.length) continue
    if (srOnly(el)) continue
    const t = (el.textContent || "").trim()
    if (!t) continue
    if (el.scrollWidth > el.clientWidth + 2) {
      out.clipped.push({ tag: el.tagName, text: t.slice(0, 44), scrollW: el.scrollWidth, clientW: el.clientWidth })
    }
  }

  // Interactive targets. 24px is the WCAG 2.2 AA floor.
  for (const el of document.querySelectorAll("a, button, [role='radio']")) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue
    if (srOnly(el)) continue
    if (r.width < 24 || r.height < 24) {
      out.small.push({
        tag: el.tagName,
        text: (el.textContent || "").trim().slice(0, 30),
        w: Math.round(r.width),
        h: Math.round(r.height),
      })
    }
  }
  return out
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
let failures = 0
const rows = []

for (const lang of LANGS) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()

    const consoleErrors = []
    page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()))
    page.on("pageerror", (e) => consoleErrors.push(String(e)))

    // Seed the language before first paint, so we measure the chosen
    // language's layout rather than a switch applied afterwards.
    await ctx.addInitScript((l) => localStorage.setItem("klp.language", l), lang)
    await page.goto(BASE, { waitUntil: "networkidle" })

    // Walk the page so every scroll-triggered reveal has fired and
    // sticky scenes have laid out.
    const h = await page.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < h; y += 700) {
      await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y)
      await page.waitForTimeout(45)
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
    await page.waitForTimeout(150)

    const htmlLang = await page.evaluate(() => document.documentElement.lang)
    const r = await page.evaluate(audit)

    const bad = r.overflow || r.offenders.length || r.clipped.length || r.small.length || consoleErrors.length
    if (bad) failures++
    rows.push({ lang, width, htmlLang, ...r, consoleErrors })

    console.log(
      `${bad ? "FAIL" : "PASS"}  ${lang}  ${String(width).padStart(4)}px  ` +
        `lang=${htmlLang}  scrollW=${r.docScrollW}  ` +
        `overflow=${r.overflow}  escaping=${r.offenders.length}  ` +
        `clipped=${r.clipped.length}  small=${r.small.length}  err=${consoleErrors.length}`
    )
    for (const o of r.offenders.slice(0, 4)) console.log(`        ESCAPES  <${o.tag}> right=${o.right} "${o.text}" .${o.cls}`)
    for (const c of r.clipped.slice(0, 4)) console.log(`        CLIPPED  <${c.tag}> ${c.scrollW}>${c.clientW} "${c.text}"`)
    for (const s of r.small.slice(0, 4)) console.log(`        SMALL    <${s.tag}> ${s.w}x${s.h} "${s.text}"`)
    for (const e of consoleErrors.slice(0, 3)) console.log(`        CONSOLE  ${e.slice(0, 110)}`)

    await ctx.close()
  }
}

await browser.close()
console.log(`\n${rows.length - failures}/${rows.length} viewport×language combinations clean`)
process.exit(failures ? 1 : 0)
