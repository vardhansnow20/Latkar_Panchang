/**
 * Every in-page link must land somewhere.
 *
 * The hero's call to action pointed at `#explore` for a long time —
 * the name of the data module behind the edition register, not the id
 * of any section on the page. Nothing failed: the browser silently
 * does nothing for an unmatched fragment, so the biggest button on the
 * site simply did not scroll, and the only reason it surfaced was a
 * visitor pasting the dead fragment back in a URL.
 *
 * Bare "#" is skipped. It is the honest placeholder for the social and
 * legal links, which have no destinations yet, and it is reported as a
 * count rather than a failure.
 */
import { chromium } from "playwright-core"

const URL = process.env.URL ?? "http://localhost:4174/kolhapur-latkar-panchang/"
const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe"

const browser = await chromium.launch({ executablePath: CHROME })
const failures = []
let placeholders = 0

for (const lang of ["en", "mr"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.addInitScript((l) => localStorage.setItem("klp.language", l), lang)
  await page.goto(URL, { waitUntil: "networkidle" })
  await page.waitForTimeout(800)

  // Open the menu too, so links that only exist there are covered.
  const menu = page.locator('header button[aria-expanded="false"]').first()
  if (await menu.count()) {
    await menu.click().catch(() => {})
    await page.waitForTimeout(400)
  }

  const result = await page.evaluate(() => {
    const dead = []
    let bare = 0
    for (const a of document.querySelectorAll('a[href^="#"]')) {
      const href = a.getAttribute("href")
      if (href === "#") {
        bare++
        continue
      }
      const id = decodeURIComponent(href.slice(1))
      if (!document.getElementById(id)) {
        dead.push(`${href} on "${(a.textContent || "").trim().slice(0, 34)}"`)
      }
    }
    return { dead, bare }
  })

  placeholders = Math.max(placeholders, result.bare)
  for (const d of result.dead) failures.push(`${lang}: ${d}`)
  await page.close()
}

await browser.close()

if (failures.length) {
  console.error(`\nFAIL - ${failures.length} in-page links point at nothing:\n`)
  for (const f of [...new Set(failures)]) console.error("  " + f)
  process.exit(1)
}
console.log(
  `PASS - every in-page link resolves ` +
    `(${placeholders} bare "#" placeholders, awaiting real destinations)`
)
