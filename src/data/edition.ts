import type { ImageAsset } from "@/types/content"
import { asset } from "@/lib/asset"

/**
 * Pages from the current edition, supplied by the client as two PDFs
 * and rendered to WebP by scripts/extract-edition-pages.py.
 *
 * ── An important correction ───────────────────────────────────────
 * The print file is named `panchang-prn-1947.pdf`, and the brief for
 * this section assumed it was a 1947 CE edition to be set against a
 * 2025 one. It is not. Its first page reads "श्रीशके १९४७ सालची
 * राजावली" and states the Panchang "has completed 115 years and is
 * presented in its 116th year", with dates through October 2025.
 *
 * 1947 is therefore Shalivahan Shake 1947 — the era the Panchang
 * itself counts in — which is 2025–26 CE. The cover confirms it:
 * "शके १९४७", "इसवी सन २०२५-२०२६", "वर्ष ११६ वे".
 *
 * Both files are the *same* current edition: one the cover, one the
 * interior. No historical edition has been supplied, so no
 * then-and-now comparison is possible yet without presenting one
 * year's book as two different eras.
 *
 * Every descriptive line below states only what is legible on the
 * page itself.
 */

export interface EditionPlate {
  id: string
  image: ImageAsset
  full: ImageAsset
  /** Museum label. */
  title: string
  /** Devanagari as printed, where the page carries a title. */
  script?: string
  designation: string
  note: string
  /**
   * A single line lifted out of the page and set apart, where one
   * detail carries the whole plate. Used once, on the Register —
   * more than that and it stops being an emphasis.
   */
  standout?: { value: string; caption: string }
  /**
   * A magnified crop of the same page, shown beside it under glass.
   * Real detail from a higher-resolution render, never an upscale.
   */
  detail?: ImageAsset
}

const plate = (
  slug: string,
  alt: string
): { image: ImageAsset; full: ImageAsset } => ({
  // Every page of this edition is landscape at the same proportion.
  image: { src: asset(`editions/${slug}.webp`), alt, aspectRatio: 1853 / 1309 },
  full: { src: asset(`editions/${slug}-full.webp`), alt, aspectRatio: 1853 / 1309 },
})

export const insideEdition = {
  eyebrow: "Shake 1947 · 2025–26",
  heading: "Inside the Panchang",
  intro:
    "The edition currently on the shelf, opened. These are its own pages — the year's register, and the tables the calculations resolve into.",
}

export const editionPlates: EditionPlate[] = [
  {
    id: "cover",
    ...plate(
      "cover-116",
      "Cover of the Kolhapur Latkar Panchang, year 116, Shalivahan Shake 1947 (2025–26 CE)"
    ),
    title: "The Cover",
    script: "कोल्हापूर लाटकर पंचांग",
    designation: "Year 116 · Shake 1947 · 2025–26 CE",
    note: "The cover is itself an astronomical drawing: a ruled celestial grid, stars, a crescent, and a ringed planet. It names the founders, the present compiler Meghshyam Vasant Latkar, and the price of seventy-five rupees.",
  },
  {
    id: "rajavali",
    ...plate(
      "rajavali",
      "Opening page of the Shake 1947 edition, carrying the year's Rajavali and the table of contents"
    ),
    title: "The Year's Register",
    script: "श्रीशके १९४७ सालची राजावली",
    designation: "Page 1",
    note: "The opening page carries the Rajavali for the year alongside the index, and records that the Panchang has completed 115 years and enters its 116th.",
    standout: {
      // Printed on the page as कोल्हापूर अक्षांश १६°४१'५७" (उत्तर),
      // रेखांश ७४°१४'१६" पूर्व.
      value: "16°41′57″ N · 74°14′16″ E",
      caption: "The position every calculation in the book is made from.",
    },
  },
  {
    id: "ephemeris",
    ...plate(
      "ephemeris",
      "Daily ephemeris page from the Shake 1947 edition, giving the positions of the Sun, Moon and planets for June 2025"
    ),
    detail: {
      src: asset("editions/ephemeris-detail.webp"),
      alt: "Magnified detail of the ephemeris table, showing the planetary columns and their daily readings",
      aspectRatio: 1873 / 878,
    },
    title: "The Ephemeris",
    script: "श्रीशके १९४७ ज्येष्ठ कृष्ण पक्ष",
    designation: "Page 46 · Jyeshtha, June 2025",
    note: "The book's working heart. Each row is one day; each column a body — Ravi, Chandra, Mangal, Budh, Guru, Shukra, Shani, Rahu, and the outer planets Harshal, Neptune and Pluto — read in rāshi, degrees, minutes. Beneath, the lagna end-times computed for Kolhapur itself.",
  },
  {
    id: "tables",
    ...plate(
      "tables",
      "Interior page of the Shake 1947 edition, showing the twelve-rashi income and expenditure table"
    ),
    title: "The Tables",
    script: "राशींना आयव्ययी",
    designation: "Page 13",
    note: "A dense interior page: the twelve rashis set against their āya and vyaya values, remedies and mantras in the columns beside them, and the outer planets treated at the foot.",
  },
]
