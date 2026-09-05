/**
 * The switching contract, exercised in a real browser.
 *
 * The requirement was not just "text changes" — it was that switching
 * must not reload, must not reset scroll, and must not disturb the
 * scroll-linked machinery (the celestial rail, the sticky scenes).
 * Those are the things a naive implementation breaks, so they are what
 * this checks.
 */
import { chromium } from "playwright-core"

const BASE = process.argv[2] ?? "http://localhost:4174/kolhapur-latkar-panchang/"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on("pageerror", (e) => errors.push(String(e)))
page.on("console", (m) => m.type() === "error" && errors.push(m.text()))

const checks = []
const check = (name, ok, detail = "") => {
  checks.push({ name, ok, detail })
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`)
}

await page.goto(BASE, { waitUntil: "networkidle" })

// Mark the document so a reload is detectable.
await page.evaluate(() => { window.__sameDocument = true })

const heading = () => page.evaluate(() => document.querySelector("h1")?.textContent?.trim() ?? "")
const htmlLang = () => page.evaluate(() => document.documentElement.lang)

const enHeading = await heading()
check("starts in English", (await htmlLang()) === "en", `lang=${await htmlLang()}`)

// Scroll into the archive, well down the page.
await page.evaluate(() => window.scrollTo({ top: 14000, behavior: "instant" }))
await page.waitForTimeout(400)
const beforeY = await page.evaluate(() => Math.round(window.scrollY))

// Switch via the actual control, not by setting state.
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("[role='radio']")].find((b) => b.getAttribute("aria-checked") === "false")
  btn?.click()
})
await page.waitForTimeout(600)

const afterY = await page.evaluate(() => Math.round(window.scrollY))
const mrHeading = await heading()

check("switched to Marathi", (await htmlLang()) === "mr", `lang=${await htmlLang()}`)
check("heading text changed", mrHeading !== enHeading && mrHeading.length > 0, `"${mrHeading.slice(0, 34)}"`)
check("no page reload", await page.evaluate(() => window.__sameDocument === true))
check("scroll position preserved", Math.abs(afterY - beforeY) < 40, `${beforeY} -> ${afterY}`)

// The scroll-linked rail must still be tracking after the swap.
const railOk = await page.evaluate(() => {
  const fill = document.querySelector("[class*='origin-top']")
  const t = fill ? getComputedStyle(fill).transform : ""
  return t !== "" && t !== "none"
})
check("celestial rail still tracking", railOk)

const railActive = await page.evaluate(() => !!document.querySelector("a[aria-current='true']"))
check("active chapter still resolved", railActive)

// Persistence across a genuine reload.
await page.reload({ waitUntil: "networkidle" })
check("Marathi persists after reload", (await htmlLang()) === "mr", `lang=${await htmlLang()}`)
check("reload really happened", await page.evaluate(() => window.__sameDocument === undefined))

// And back again.
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("[role='radio']")].find((b) => b.getAttribute("aria-checked") === "false")
  btn?.click()
})
await page.waitForTimeout(500)
check("switched back to English", (await htmlLang()) === "en" && (await heading()) === enHeading)

check("no console errors throughout", errors.length === 0, errors.slice(0, 2).join(" | "))

await browser.close()
const failed = checks.filter((c) => !c.ok).length
console.log(`\n${checks.length - failed}/${checks.length} passed`)
process.exit(failed ? 1 : 0)
