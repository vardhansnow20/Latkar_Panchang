/**
 * Prepare the Digital Laxmi Calendar app screen for the App register.
 *
 * Source: a phone screenshot supplied by the client
 * (Screenshot_20260904-151529_DigitalLaxmiCalendar.png, 1220x2712).
 *
 * Two sizes, matching the convention the other plates use: a display
 * file sized for the device frame at high pixel density, and a `-full`
 * for anywhere the image is opened on its own. The alpha channel is
 * flattened — the artwork is opaque edge to edge, and keeping an
 * unused alpha channel only costs bytes.
 *
 * Re-runnable: delete the outputs and run again.
 */
import sharp from "sharp"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"

const SRC = "C:/Users/Vardhan/Downloads/Screenshot_20260904-151529_DigitalLaxmiCalendar.png"
const OUT = "public/app"
const SLUG = "digital-laxmi-calendar-screen"

/** The frame is 22rem (352px) at its largest, so 900px covers it at
 * better than 2x on a high-density display with room to grow. */
const DISPLAY_WIDTH = 900
const FULL_WIDTH = 1220

await mkdir(OUT, { recursive: true })

const meta = await sharp(SRC).metadata()
console.log(`source ${meta.width}x${meta.height} ${meta.format}`)

for (const [suffix, width, quality] of [
  ["", DISPLAY_WIDTH, 82],
  ["-full", FULL_WIDTH, 88],
]) {
  const file = join(OUT, `${SLUG}${suffix}.webp`)
  const info = await sharp(SRC)
    .flatten({ background: "#3b2fc9" })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(file)
  console.log(`  ${file}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} kB`)
}

console.log(`aspectRatio: ${meta.width} / ${meta.height} = ${(meta.width / meta.height).toFixed(4)}`)
