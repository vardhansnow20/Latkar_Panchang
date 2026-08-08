/**
 * Shared content shapes. Every file in src/data/ is typed against
 * one of these — a content editor filling in real copy later gets a
 * TypeScript error on a missing field, not a silently broken layout.
 */

export interface NavLink {
  label: string
  /** Section anchor (e.g. "#history") or an external path. */
  href: string
}

export interface SocialLink {
  label: string
  href: string
}

/**
 * A single manifest entry for any image on the site. `aspectRatio`
 * is required (not inferred) so layout never shifts while the real
 * file loads — width/height are derived from it wherever the image
 * renders. `src: null` renders the placeholder treatment.
 */
export interface ImageAsset {
  src: string | null
  alt: string
  aspectRatio: number
}

export interface TimelineEntry {
  id: string
  year: string
  title: string
  body: string
  /** Optional — not every entry needs a photograph; alternating
   * presence/absence is part of the section's rhythm, not a gap. */
  image?: ImageAsset
}

export interface GalleryItem {
  id: string
  image: ImageAsset
  caption: string
}

/**
 * A single sentence, not a headline+body pair — "Why Readers Trust"
 * is written as running prose, not feature-card copy. No icon field
 * on purpose: the section makes its case with one photograph, not
 * three small pictograms standing in for evidence.
 */
export interface Reason {
  id: string
  text: string
}

/**
 * One photograph in the Legacy Archive. `year` is deliberately
 * optional and a free string (not a number) — several of these
 * photographs don't have a confirmed date, and "circa" language
 * needs to fit here without a type error.
 */
export interface ArchivePhoto {
  id: string
  /** Display-size image, used in the section layout. */
  image: ImageAsset
  /** Higher-resolution image, used only in the lightbox. */
  fullImage: ImageAsset
  title: string
  year?: string
  description: string
}

/** One themed group within the Legacy Archive — each gets its own
 * short editorial introduction and its own layout treatment. */
export interface ArchiveTheme {
  id: string
  title: string
  intro: string
  photos: ArchivePhoto[]
}
