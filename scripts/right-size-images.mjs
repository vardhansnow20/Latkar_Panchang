/**
 * Bring every display image down to the size it is actually shown at.
 *
 * The display copies were generated at whatever the source happened to
 * give — and measured in the browser, they ran between 1.5x and 6.8x
 * wider than the largest box any of them ever occupies. The founder's
 * portrait is the extreme: 1290px of image inside a 191px frame, 403kB
 * for something displayed at a thumbnail's size. Across the page that
 * came to 3.6MB of photographs, most of which was pixels no one can
 * see, and it is the reason the page was slow to fill in.
 *
 * Targets are 2.2x the maximum width each image reaches across
 * 390/768/1440/1901 — enough for a high-density display, with a little
 * headroom — and are never allowed to upscale. A few files are already
 * smaller than their target and are left alone.
 *
 * Each display copy is rebuilt from its `-full` sibling rather than
 * from itself, so the result is one compression from the original
 * rather than two. The `-full` copies are what the lightbox opens and
 * are not touched.
 *
 * Re-runnable, but note it overwrites display copies in place: the
 * `-full` files are the masters, so a second run is still sourced from
 * them and does not compound.
 */
import sharp from "sharp"
import { readFile, stat, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join, dirname, basename } from "node:path"

/** file -> width it should be built at, from measured render sizes. */
const TARGETS = {
  "public/editions/rajavali.webp": 1640,
  "public/editions/ephemeris-detail.webp": 1420,
  "public/editions/tables.webp": 1360,
  "public/editions/laxmi-calendar.webp": 1220,
  "public/app/digital-laxmi-calendar-screen.webp": 700,
  "public/legacy-archive/editorial-calculation-session.webp": 720,
  "public/legacy-archive/mahalakshmi-temple-gathering.webp": 720,
  "public/legacy-archive/committee-review-table.webp": 700,
  "public/legacy-archive/centenary-podium-address.webp": 620,
  "public/legacy-archive/swami-blessing.webp": 600,
  "public/legacy-archive/centenary-lamp-lighting.webp": 600,
  "public/legacy-archive/centenary-edition-distribution.webp": 600,
  "public/legacy-archive/swami-address-to-gathering.webp": 600,
  "public/legacy-archive/studio-portrait-mounted.webp": 500,
  "public/legacy-archive/founder-portrait-painting.webp": 440,
  "public/legacy-archive/vasudev-shankar-latkar-honor-certificate.webp": 420,
  "public/legacy-archive/archival-document.webp": 360,
}

let before = 0
let after = 0

for (const [file, width] of Object.entries(TARGETS)) {
  if (!existsSync(file)) {
    console.log(`skip ${file}: not found`)
    continue
  }

  const full = join(dirname(file), `${basename(file, ".webp")}-full.webp`)
  const source = existsSync(full) ? full : file
  // Read the bytes up front. Some of these have no `-full` master, so
  // source and destination are the same path, and handing sharp a file
  // it is about to overwrite fails outright on Windows.
  const original = await readFile(source)
  const meta = await sharp(original).metadata()

  if (meta.width <= width) {
    console.log(`keep ${basename(file)}: source is ${meta.width}px, target ${width}px`)
    continue
  }

  const was = (await stat(file)).size
  const buffer = await sharp(original).resize({ width }).webp({ quality: 80 }).toBuffer()
  await writeFile(file, buffer)
  const now = (await stat(file)).size

  before += was
  after += now
  console.log(
    `${basename(file).padEnd(48)} ${meta.width}px -> ${width}px   ` +
      `${(was / 1024).toFixed(0)}kB -> ${(now / 1024).toFixed(0)}kB`
  )
}

console.log(
  `\nrewritten: ${(before / 1024).toFixed(0)}kB -> ${(after / 1024).toFixed(0)}kB ` +
    `(${(100 - (after / before) * 100).toFixed(0)}% smaller)`
)
