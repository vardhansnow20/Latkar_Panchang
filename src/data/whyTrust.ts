import type { ImageAsset, Reason } from "@/types/content"

/**
 * Source: Kolhapur_Latkar_Panchang_English_Translation.docx,
 * "Why Readers Trust Us", "History", "Current Reach", and "Awards".
 *
 * The document names "Awards & Recognition" as a section in its own
 * right, but the site has no such section and this pass is content-
 * only, not a redesign — the two awards are folded in here as a
 * fourth reason, since a title of recognition is itself a trust
 * signal. Flagged for the client: a dedicated Awards section is
 * worth considering in a future design pass.
 */
export const whyTrust = {
  eyebrow: "Trust",
  heading: "Why Readers Trust This Panchang",
  // TODO image: "Printing Press" — client to supply photograph.
  photo: {
    src: null,
    alt: "The press where the Kolhapur Latkar Panchang is printed",
    aspectRatio: 4 / 5,
  } satisfies ImageAsset,
}

export const trustReasons: Reason[] = [
  {
    id: "scholarship",
    text: "Every religious and astrological decision is prepared under the guidance of learned scholars and supported by authentic Dharmashastra references.",
  },
  {
    id: "lineage",
    text: "Three generations of the Latkar family — hereditary priests of Shri Mahalakshmi Temple — have prepared this Panchang since 1910.",
  },
  {
    id: "reach",
    text: "Trusted by an estimated 75,000 to 100,000 families across India.",
  },
  {
    id: "awards",
    text: "Honoured with the title 'Panchang Bhaskar' by Shri Swami Jagadguru Shankaracharya Peeth, Karveer, and the honorary title 'Jyotish Visharad' for outstanding contributions to astrology and Dharmashastra.",
  },
]
