/**
 * Structural check on the Marathi overlay.
 *
 * The overlay merges arrays by index, which is what lets a translator
 * fill entries one at a time — but it also means an overlay array
 * *shorter* than its base does not merely leave the tail untranslated:
 * every entry after the gap lands on the wrong item. That happened
 * once (seven nav labels against eight links, which put "संपर्क" on
 * the App link), and neither TypeScript nor the layout sweep could
 * see it, because both strings were perfectly valid.
 *
 * So: any array the overlay touches must either be absent entirely, or
 * match the base length exactly.
 *
 * Run:  node scripts/translation-shape.test.mjs
 */
import { readFileSync } from "node:fs"

const read = (p) => readFileSync(p, "utf8")

/**
 * Count top-level `{ ... }` entries in a named array literal.
 *
 * Handles both shapes this repo uses: the overlay's `navLinks: [`, and
 * the data modules' `export const navLinks: NavLink[] = [`.
 */
function arrayLength(src, key) {
  const decl = new RegExp(`\\b${key}\\b\\s*(?::\\s*[\\w<>\\[\\]|, ]+)?\\s*(?::|=)\\s*\\[`)
  const m = decl.exec(src)
  if (!m) return null
  // The regex ends on the array literal's own `[`. Searching forward
  // for the next `[` instead would find the one in `NavLink[]`, which
  // closes immediately and yields a count of zero.
  let i = m.index + m[0].length - 1

  // Both depths matter. Counting every `{` seen at bracket-depth 1
  // also counts the nested `image: { … }` inside each entry, which
  // reported historyTimeline as 6 when it holds 4. An entry is a `{`
  // that opens while no other object is open.
  let bracket = 0
  let brace = 0
  let entries = 0
  let str = null
  let comment = null // "line" | "block"

  for (; i < src.length; i++) {
    const ch = src[i]
    const next = src[i + 1]

    // Comments must be skipped before strings: an apostrophe in prose
    // ("the book's working heart") otherwise opens a phantom string
    // that swallows the rest of the array and halves the count.
    if (comment === "line") {
      if (ch === "\n") comment = null
      continue
    }
    if (comment === "block") {
      if (ch === "*" && next === "/") {
        comment = null
        i++
      }
      continue
    }

    if (str) {
      if (ch === "\\") i++
      else if (ch === str) str = null
      continue
    }

    if (ch === "/" && next === "/") {
      comment = "line"
      i++
      continue
    }
    if (ch === "/" && next === "*") {
      comment = "block"
      i++
      continue
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      str = ch
      continue
    }

    if (ch === "[") bracket++
    else if (ch === "]") {
      bracket--
      if (bracket === 0) break
    } else if (ch === "{") {
      if (bracket === 1 && brace === 0) entries++
      brace++
    } else if (ch === "}") brace--
  }
  return entries
}

const dataFiles = {
  navLinks: "src/data/site.ts",
  legalLinks: "src/data/site.ts",
  historyTimeline: "src/data/history.ts",
  panchangElements: "src/data/elements.ts",
  trustReasons: "src/data/whyTrust.ts",
  journeyStages: "src/data/trustJourney.ts",
  editionPlates: "src/data/edition.ts",
  interiorPages: "src/data/explore.ts",
  archiveThemes: "src/data/legacyArchive.ts",
}

const mr = read("src/i18n/mr.ts")
let failed = 0

for (const [key, file] of Object.entries(dataFiles)) {
  const overlay = arrayLength(mr, key)
  if (overlay === null) {
    console.log(`SKIP  ${key.padEnd(18)} not translated (falls back whole)`)
    continue
  }
  const base = arrayLength(read(file), key)
  const ok = base === overlay
  if (!ok) failed++
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${key.padEnd(18)} base=${base} overlay=${overlay}` +
      (ok ? "" : "  <-- labels after the gap will land on the wrong item")
  )
}

console.log(failed ? `\n${failed} array(s) misaligned` : "\nall translated arrays aligned with their base")
process.exit(failed ? 1 : 0)
