/**
 * One-off: bring the two founder-era photographs into the archive.
 *
 * Both arrived from a phone scanning app with its badge burned into the
 * corner, and the studio plate arrived on its side. Neither can be
 * corrected in CSS — a rotation would fight the layout and a watermark
 * cannot be masked without covering the picture — so both are fixed
 * here, once, at source.
 *
 * Re-run only if the originals are replaced. Ideally they are: a scan
 * without the badge would not need the crop, and the studio plate loses
 * part of its left mount margin to it.
 */
import sharp from "sharp"
import { mkdirSync } from "node:fs"
import { join } from "node:path"

const SRC = String.raw`C:\Users\Vardhan\Downloads`
const OUT = String.raw`C:\Laxmi Latkar Panchang\public\legacy-archive`
mkdirSync(OUT, { recursive: true })

const JOBS = [
  {
    // Painted portrait, signed SNK 1977. Watermark sits bottom-right.
    src: "Ganesh_latkar 2026-08-31 at 10.31.42 AM.jpeg",
    slug: "founder-portrait-painting",
    rotate: 0,
    // Trim the badge from the foot. Kept as tight as it can be: every
    // row removed here is painting.
    crop: (w, h) => ({ left: 0, top: 0, width: w, height: Math.round(h * 0.905) }),
  },
  {
    // Studio photograph on its printed mount, S. B. Takalkar, Kolhapur.
    // Arrived rotated a quarter turn anticlockwise.
    src: "WhatsApp Image 2026-08-31 at 10.31.43 AM.jpeg",
    slug: "studio-portrait-mounted",
    rotate: 90,
    // After rotation the badge lies down the left mount margin. Only
    // that margin goes — the photographer's imprint is in the lower
    // right and is worth keeping, so the crop is deliberately
    // asymmetric rather than tidy.
    crop: (w, h) => ({ left: Math.round(w * 0.13), top: 0, width: w - Math.round(w * 0.13), height: h }),
  },
]

for (const job of JOBS) {
  // Dimensions AFTER rotation. `metadata()` reports the source size
  // because sharp applies the rotate lazily on write, so reading it
  // straight gave a crop box wider than the rotated image and sharp
  // rejected the extract outright.
  const src = await sharp(join(SRC, job.src)).metadata()
  const turned = job.rotate % 180 !== 0
  const m = { width: turned ? src.height : src.width, height: turned ? src.width : src.height }
  const box = job.crop(m.width, m.height)

  for (const [suffix, cap, q] of [["-full", 2400, 84], ["", 1300, 80]]) {
    await sharp(join(SRC, job.src))
      .rotate(job.rotate)
      .extract(box)
      .resize({ height: cap, withoutEnlargement: true })
      .webp({ quality: q })
      .toFile(join(OUT, `${job.slug}${suffix}.webp`))
  }

  const out = await sharp(join(OUT, `${job.slug}.webp`)).metadata()
  console.log(`${job.slug}: ${m.width}x${m.height} -> ${out.width}x${out.height}  ratio ${(out.width / out.height).toFixed(3)}`)
}
