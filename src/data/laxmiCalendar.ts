import type { ImageAsset } from "@/types/content"

/**
 * TODO — the source document (Kolhapur_Latkar_Panchang_English_
 * Translation.docx) contains no information about a "Laxmi
 * Calendar" product. This section and its copy below predate the
 * document and were invented as a plausible companion product in an
 * earlier design pass. Client to confirm: (1) does this product
 * actually exist, and if so (2) supply real name, description, and
 * photography — or, if it doesn't exist, this section should be
 * removed in a future design pass (out of scope for this content-
 * only update).
 */
export const laxmiCalendar = {
  eyebrow: "Also From Our Press",
  heading: "The Laxmi Calendar",
  intro: "A wall calendar built from the same calculations, for households who keep their dates on the wall rather than the shelf.",
  body: "Printed once a year in the same workshop, on the same schedule as the Panchang itself — twelve pages, one month each, the tithis and muhurats set in the same hand.",
  link: { label: "See the Current Year's Calendar", href: "#contact" },
  // TODO image: "Laxmi Calendar" — client to confirm product exists and supply photograph.
  image: {
    src: null,
    alt: "The Laxmi Calendar, hung in a household kitchen",
    aspectRatio: 21 / 9,
  } satisfies ImageAsset,
  /** A second, smaller image peeking from behind the main one — a
   * hint that this is a twelve-page object, not a single sheet.
   * TODO image: a single interior month page — client to supply. */
  detailImage: {
    src: null,
    alt: "A single month page from the Laxmi Calendar",
    aspectRatio: 3 / 4,
  } satisfies ImageAsset,
}
