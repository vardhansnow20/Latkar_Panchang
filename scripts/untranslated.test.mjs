/**
 * Find visible English text that survives the switch to Marathi.
 *
 * Works on the rendered page rather than the content tree, because
 * that is where the gap actually shows: a key can be present in the
 * overlay while a sibling on the same object was never filled in, and
 * only the page knows which strings a reader ends up seeing.
 *
 * Method: collect every visible text node in each language, keyed by a
 * stable DOM path, then report the ones whose Marathi is byte-identical
 * to the English *and* contains Latin letters.
 *
 * Run:  node scripts/untranslated.test.mjs [baseUrl]
 */
import { chromium } from "playwright-core"

const BASE = process.argv[2] ?? "http://localhost:4174/kolhapur-latkar-panchang/"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

/**
 * Strings that are correct to leave in Latin script. Brand names, a
 * romanised URL, and the wordmark, which the publisher sets this way.
 */
const ALLOWED = [
  /^Instagram$|^Facebook$|^YouTube$/,
  /^App Store$|^Google Play$/,
  /^LATKAR$|^PANCHANG$|^SINCE 1910$/i,
  /^EN$/,
  /latkarpanchang\.com/i,
  /^©/,
  /^\d[\d\s+\-–—.:/]*$/, // bare numerals, dates, phone
]

function harvest() {
  const out = {}
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let n
  let i = 0
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim()
    if (!t) continue
    const el = n.parentElement
    if (!el) continue
    if (el.closest("[class*='sr-only']")) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === "hidden" || cs.display === "none") continue

    // Stable-ish key: nearest section id + ordinal.
    const sec = el.closest("section")?.id || el.closest("header") ? "chrome" : "page"
    out[`${sec}:${i++}`] = t
  }
  return out
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true })

async function textsFor(lang) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript((l) => localStorage.setItem("klp.language", l), lang)
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: "networkidle" })
  const h = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < h; y += 700) {
    await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y)
    await page.waitForTimeout(40)
  }
  await page.waitForTimeout(200)
  const t = await page.evaluate(harvest)
  await ctx.close()
  return t
}

const en = await textsFor("en")
const mr = await textsFor("mr")
await browser.close()

const enVals = Object.values(en)
const mrVals = Object.values(mr)

const hasLatin = (s) => /[A-Za-z]{3,}/.test(s)
const allowed = (s) => ALLOWED.some((re) => re.test(s))

// Anything still present verbatim in the Marathi render, that also
// appeared in English, and reads as English prose.
const stillEnglish = [...new Set(mrVals)].filter(
  (v) => hasLatin(v) && !allowed(v) && enVals.includes(v)
)

if (stillEnglish.length === 0) {
  console.log("No untranslated visible strings.")
} else {
  console.log(`${stillEnglish.length} visible string(s) still English in Marathi:\n`)
  for (const s of stillEnglish) console.log(`  • ${s.slice(0, 150)}${s.length > 150 ? "…" : ""}`)
}
console.log(`\n(en nodes: ${enVals.length}, mr nodes: ${mrVals.length})`)
process.exit(stillEnglish.length ? 1 : 0)
