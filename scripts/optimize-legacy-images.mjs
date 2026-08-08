import sharp from "sharp"
import { mkdirSync } from "node:fs"
import { join } from "node:path"

const SRC_DIR = "C:\\Users\\Vardhan\\Downloads\\117 years legacy document\\assets"
const OUT_DIR = "C:\\Laxmi Latkar Panchang\\public\\legacy-archive"

mkdirSync(OUT_DIR, { recursive: true })

// [source filename, output slug]
const FILES = [
  ["1.jpg", "editorial-calculation-session"],
  ["2.jpg", "centenary-memento-presentation"],
  ["3.jpg", "swami-blessing"],
  ["4 (1).jpg", "centenary-lamp-lighting"],
  ["5.jpg", "centenary-podium-address"],
  ["6.jpg", "swami-address-to-gathering"],
  ["7.jpg", "mahalakshmi-temple-gathering"],
  ["8.jpg", "centenary-edition-distribution"],
  ["9.jpg", "committee-review-table"],
  ["10.jpg", "vasudev-shankar-latkar-honor-certificate"],
  ["WhatsApp Image 2026-07-09 at 1.44.15 PM.jpeg", "archival-document"],
]

for (const [src, slug] of FILES) {
  const input = join(SRC_DIR, src)
  const meta = await sharp(input).metadata()
  const isPortraitDoc = meta.height > meta.width

  // Full/lightbox version — long edge capped, proportions untouched.
  await sharp(input)
    .resize({ width: isPortraitDoc ? undefined : 2000, height: isPortraitDoc ? 2400 : undefined, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(join(OUT_DIR, `${slug}-full.webp`))

  // Display version — for in-page layout, still generous but lighter.
  await sharp(input)
    .resize({ width: isPortraitDoc ? undefined : 1100, height: isPortraitDoc ? 1300 : undefined, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(join(OUT_DIR, `${slug}.webp`))

  const outMeta = await sharp(join(OUT_DIR, `${slug}.webp`)).metadata()
  console.log(`${slug}: ${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}, ratio ${(outMeta.width / outMeta.height).toFixed(3)}`)
}

console.log("Done.")
