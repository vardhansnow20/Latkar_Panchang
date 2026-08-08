import type { ArchiveTheme, ArchivePhoto, ImageAsset } from "@/types/content"

/**
 * Source: 11 photographs and documents supplied directly by the
 * client (117 years legacy document/assets). Titles and
 * descriptions describe what is visibly happening in each
 * photograph; nothing here states a fact the image itself doesn't
 * support. Where a date or identity isn't legible/confirmed, it's
 * marked TODO rather than guessed.
 *
 * Seven of the eleven photographs share the same banner text —
 * "Kolhapur Latkar Panchang Centenary Festival Committee" and
 * "Centenary Publication Ceremony" — which matches the document's
 * own Centenary section (1910–2010, celebrated at Shri Mahalakshmi
 * Temple, Kolhapur), so those seven are confidently dated 2010.
 *
 * No photographs of historical Panchang covers were included in
 * this set — that theme is intentionally absent rather than
 * populated with a placeholder; add it once cover scans exist.
 */

export const legacyArchive = {
  eyebrow: "1910 — 2026",
  heading: "Legacy Archive",
  intro: "A closer look at the people, ceremonies, and documents behind eleven decades of the Panchang.",
}

const img = (
  slug: string,
  alt: string,
  aspectRatio: number
): { image: ImageAsset; fullImage: ImageAsset } => ({
  image: { src: `/legacy-archive/${slug}.webp`, alt, aspectRatio },
  fullImage: { src: `/legacy-archive/${slug}-full.webp`, alt, aspectRatio },
})

/** The section's opening image — the milestone the rest of the
 * archive orbits around. */
export const heroPhoto: ArchivePhoto = {
  id: "centenary-memento-presentation",
  ...img("centenary-memento-presentation", "A memento presented on stage during the Centenary Celebration, the founders' portraits displayed in the foreground", 1.427),
  title: "A Century Marked",
  year: "2010",
  description: "A memento is presented on stage during the Centenary Celebration, with portraits of the Panchang's founders placed at the front of the stage.",
}

export const archiveThemes: ArchiveTheme[] = [
  {
    id: "editorial-process",
    title: "Editorial Process",
    intro: "Long before a single page reaches print, the calculations are checked, cross-checked, and checked again.",
    photos: [
      {
        id: "editorial-calculation-session",
        ...img("editorial-calculation-session", "Committee members reviewing Panchang calculations at a table, with a Dharmashastra reference text open before them", 1.429),
        title: "Calculating the Calendar",
        // TODO: exact year not confirmed — client to supply.
        description: "Committee members cross-reference Dharmashastra texts while verifying a year's calculations.",
      },
    ],
  },
  {
    id: "committee-meetings",
    title: "Committee Meetings",
    intro: "Every edition passes through the same kind of review that has checked the Panchang for generations.",
    photos: [
      {
        id: "committee-review-table",
        ...img("committee-review-table", "A long table of committee members, including family members, reviewing proofs together", 1.418),
        title: "The Editorial Committee at Work",
        // TODO: exact year not confirmed — client to supply.
        description: "Scholars and family members review proofs together before a new edition goes to print.",
      },
    ],
  },
  {
    id: "recognition-certificates",
    title: "Recognition & Certificates",
    intro: "Formal honors, kept alongside the Panchang itself, in the same hand that earned them.",
    photos: [
      {
        id: "vasudev-shankar-latkar-honor-certificate",
        ...img("vasudev-shankar-latkar-honor-certificate", "An ornate certificate of recognition addressed to Vasudev Shankar Latkar, Panchang-maker of Kolhapur, from the Karveer Peeth purohit assembly", 0.756),
        title: "A Certificate of Recognition",
        // TODO: date on the certificate not fully legible — client to confirm exact year and occasion.
        description: "An honor conferred on Vasudev Shankar Latkar, the Panchang's second-generation compiler, by the Karveer Peeth purohit assembly.",
      },
      {
        id: "archival-document",
        ...img("archival-document", "An aged historical document from the family archive, with illustrated figures and handwritten Devanagari text", 0.654),
        title: "From the Archive",
        // TODO: date and occasion not confirmed — client to supply.
        description: "One of the family's older surviving documents, kept as part of the Panchang's written record.",
      },
    ],
  },
  {
    id: "publication-ceremonies",
    title: "Publication Ceremonies",
    intro: "The Centenary edition's release was marked in public, over the course of a single ceremony.",
    photos: [
      {
        id: "centenary-lamp-lighting",
        ...img("centenary-lamp-lighting", "Committee members lighting a ceremonial lamp on stage at the Centenary Publication Ceremony", 1.401),
        title: "Lighting the Lamp",
        year: "2010",
        description: "The traditional lamp-lighting that opened the Centenary Publication Ceremony.",
      },
      {
        id: "centenary-podium-address",
        ...img("centenary-podium-address", "A speaker addressing the hall at the podium during the Centenary Publication Ceremony", 1.461),
        title: "Addressing the Gathering",
        year: "2010",
        description: "A speaker addresses the hall during the Centenary Publication Ceremony, the founders' portraits placed at the front of the stage.",
      },
      {
        id: "centenary-edition-distribution",
        ...img("centenary-edition-distribution", "Committee members on stage holding copies of the Centenary edition", 1.427),
        title: "Presenting the Centenary Edition",
        year: "2010",
        description: "Committee members receive copies marking the Panchang's hundredth year.",
      },
    ],
  },
  {
    id: "community-gatherings",
    title: "Community Gatherings",
    intro: "The Panchang has always belonged to more than one family.",
    photos: [
      {
        id: "mahalakshmi-temple-gathering",
        ...img("mahalakshmi-temple-gathering", "A large seated crowd gathered under tents at Shri Mahalakshmi Temple, Kolhapur, for the Centenary Celebration", 1.459),
        title: "Gathered at Shri Mahalakshmi Temple",
        year: "2010",
        description: "Readers and well-wishers gather at Shri Mahalakshmi Temple, Kolhapur, for the Centenary Celebration.",
      },
    ],
  },
  {
    id: "spiritual-guidance",
    title: "Spiritual Guidance",
    intro: "The tradition has never stood apart from the religious life it serves.",
    photos: [
      {
        id: "swami-blessing",
        ...img("swami-blessing", "A family elder bowing to receive a blessing from a presiding swami during the Centenary Celebration", 1.410),
        title: "A Blessing",
        year: "2010",
        description: "A family elder receives a blessing from a presiding swami during the Centenary Celebration.",
      },
      {
        id: "swami-address-to-gathering",
        ...img("swami-address-to-gathering", "A presiding swami addressing the gathering from a ceremonial seat", 1.447),
        title: "Spiritual Counsel",
        year: "2010",
        description: "A presiding swami addresses the gathering from the ceremonial seat.",
      },
    ],
  },
]
