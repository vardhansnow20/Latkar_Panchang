import type { GalleryItem } from "@/types/content"
import { asset } from "@/lib/asset"

/**
 * Source: Kolhapur_Latkar_Panchang_English_Translation.docx,
 * "Hero Introduction" (page-structure description), and the client's
 * own print-ready PDFs for the year 116 edition.
 *
 * The images are pages of that edition, rendered straight from those
 * PDFs by scripts/extract-explore-pages.py — not photography, and not
 * placeholders. Which page fills which beat was decided by reading
 * them; the script records the choices.
 *
 * Where a page turned out not to be what the beat originally imagined,
 * the caption follows the page rather than the other way round. Said
 * plainly: this Panchang has no month-grid page to photograph, so that
 * beat now shows the reference tables it does have.
 *
 * Structured as a seven-beat sequence (Explore.tsx walks through it
 * as an exhibition, not a grid): reveal, close-up, three interior
 * page types, the monthly calendar layout, and the current edition
 * — each beat is its own moment, not a thumbnail among equals.
 */
export const explore = {
  eyebrow: "This Year's Edition",
  heading: "Explore the Panchang",
  intro: "A walk through the pages — from first glimpse to the edition on the shelf today.",
}

/** The invocations printed at the very front of the edition — which
 * is, quite literally, how every year begins. */
export const revealImage: GalleryItem = {
  id: "reveal",
  image: {
    src: asset("editions/invocations.webp"),
    alt: "The invocations printed at the front of the Panchang",
    aspectRatio: 760 / 537,
  },
  caption: "Every year begins the same way.",
}

/**
 * A column of the page that recounts the origins of the year's
 * festivals, cropped upright so the type can actually be read.
 *
 * Neither the alt text nor the caption says "hand-set" any more. That
 * was written against a placeholder, and the real page comes from a
 * print-ready PDF — how the type was set is not something this file
 * can claim to know.
 */
export const closeUpImage: GalleryItem = {
  id: "close-up",
  image: {
    src: asset("editions/typesetting-detail.webp"),
    alt: "A close-up of the Panchang's Devanagari typesetting, on a page recounting the origins of the year's festivals",
    aspectRatio: 760 / 1055,
  },
  caption: "Every character in its place.",
}

/**
 * The sticky-scroll trio — one image panel stays in view while these
 * three captions scroll past it (see Explore.tsx).
 */
export const interiorPages: GalleryItem[] = [
  {
    id: "page",
    image: {
      src: asset("editions/daily-page.webp"),
      alt: "A daily page from one of the Panchang's monthly spreads",
      aspectRatio: 760 / 537,
    },
    caption: "Tithi, Vara, Nakshatra, Yoga, and Karana — every day, in order.",
  },
  {
    id: "festival-page",
    image: {
      src: asset("editions/festival-dates.webp"),
      alt: "The year's festival dates, listed month by month",
      aspectRatio: 760 / 537,
    },
    caption: "Festival dates, set against the same calculations.",
  },
  {
    id: "muhurat-page",
    image: {
      src: asset("editions/muhurat-page.webp"),
      alt: "A muhurat page, giving auspicious times to set out by month, tithi, weekday and nakshatra",
      aspectRatio: 760 / 537,
    },
    caption: "Auspicious timings, referenced from Dharmashastra texts.",
  },
]

/**
 * Originally meant to be a month-grid page. There is no such page:
 * this is a table-based almanac, and the wall calendar is a separate
 * product with its own register further down. So the beat shows what
 * the edition actually carries in that role — the tables everything
 * else is reckoned from — and the caption says so.
 */
export const calendarPageImage: GalleryItem = {
  id: "calendar-page",
  image: {
    src: asset("editions/reference-tables.webp"),
    alt: "Reference tables of the months, tithis, yogas and karanas, with their presiding deities",
    aspectRatio: 760 / 537,
  },
  caption: "The reckoning behind every date.",
}

/** The cover of year 116, and the same file the "Inside the Panchang"
 * register opens with — deliberately, since the walk ends on the object
 * it began describing. */
export const latestEditionImage: GalleryItem = {
  id: "latest-edition",
  image: {
    src: asset("editions/cover-116.webp"),
    alt: "Cover of the Kolhapur Latkar Panchang, year 116, Shalivahan Shake 1947 (2025-26 CE)",
    aspectRatio: 1853 / 1309,
  },
  caption: "This year's edition.",
}
