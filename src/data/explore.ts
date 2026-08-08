import type { GalleryItem } from "@/types/content"

/**
 * Source: Kolhapur_Latkar_Panchang_English_Translation.docx,
 * "Hero Introduction" (page-structure description). The document
 * does not state which year's edition is "current," give per-page
 * captions, or supply photography for festival/muhurat pages —
 * every image below is a placeholder pending real photography; see
 * the TODO comment on each.
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

// TODO image: an artistic partial/macro glimpse — client to supply. Opens the sequence.
export const revealImage: GalleryItem = {
  id: "reveal",
  image: { src: null, alt: "A first glimpse of the Kolhapur Latkar Panchang, partially open", aspectRatio: 3 / 4 },
  caption: "Every year begins the same way.",
}

// TODO image: "First Panchang Edition" or a macro detail shot of the ink/typesetting — client to supply.
export const closeUpImage: GalleryItem = {
  id: "close-up",
  image: { src: null, alt: "A close-up of the Panchang's hand-set Devanagari typesetting", aspectRatio: 4 / 5 },
  caption: "Every character, set by hand.",
}

/**
 * The sticky-scroll trio — one image panel stays in view while these
 * three captions scroll past it (see Explore.tsx). TODO images:
 * interior page photographs — client to supply.
 */
export const interiorPages: GalleryItem[] = [
  {
    id: "page",
    image: { src: null, alt: "A standard interior page of the Panchang", aspectRatio: 4 / 5 },
    caption: "Tithi, Vara, Nakshatra, Yoga, and Karana — every day, in order.",
  },
  {
    id: "festival-page",
    image: { src: null, alt: "A festival page of the Panchang", aspectRatio: 4 / 5 },
    caption: "Festival dates, set against the same calculations.",
  },
  {
    id: "muhurat-page",
    image: { src: null, alt: "A muhurat page of the Panchang", aspectRatio: 4 / 5 },
    caption: "Auspicious timings, referenced from Dharmashastra texts.",
  },
]

// TODO image: a monthly calendar-grid page — client to supply.
export const calendarPageImage: GalleryItem = {
  id: "calendar-page",
  image: { src: null, alt: "The monthly calendar layout inside the Panchang", aspectRatio: 4 / 3 },
  caption: "A full month, at a glance.",
}

// TODO image: "Current Panchang Cover" — client to confirm edition year and supply photograph.
export const latestEditionImage: GalleryItem = {
  id: "latest-edition",
  image: { src: null, alt: "Kolhapur Latkar Panchang cover, current edition", aspectRatio: 4 / 5 },
  caption: "This year's edition.",
}
