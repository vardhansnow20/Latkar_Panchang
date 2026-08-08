import type { ImageAsset } from "@/types/content"

/**
 * Source: Kolhapur_Latkar_Panchang_English_Translation.docx,
 * "Basic Information" + "Hero Introduction". `body` is a trimmed
 * excerpt of the document's own opening description — the full
 * explanation (page structure, sunrise-based calculation) runs
 * longer than a hero can carry and lives in full on Explore/About.
 */
export const hero = {
  eyebrow: "Since 1910",
  /**
   * Shortened from the document's own phrase, "Over 100 Years of
   * Scripturally Accurate Tradition", at the client's direction — a
   * long headline weakened the opening.
   *
   * Deliberately built only from words the source document already
   * uses ("a century", "scriptural", "accuracy"), so the claim is
   * unchanged and nothing new is asserted. Suggested alternatives
   * along the lines of "Panchang Excellence" were not used: the
   * document does not make that claim, and this project does not
   * invent them. The full original phrase is retained verbatim as
   * `site.tagline` and still appears in the colophon.
   */
  heading: "A Century of Scriptural Accuracy",
  /**
   * The opening line is a story rather than a definition, at the
   * client's direction — a reader meets the five elements further
   * down the page, once they care.
   *
   * Every claim here is carried by the source document: "more than a
   * century" (founded 1910), "tens of thousands of homes across
   * India" (the document's own 75,000–100,000 families — deliberately
   * not "countless", which overstates a figure the document states
   * precisely), "three generations", and verification against
   * scripture. Nothing is embellished beyond it.
   */
  body: "For more than a century, in tens of thousands of homes across India, the day has begun with the same family's reckoning of it — three generations, one Panchang, checked against scripture every single year.",
  /**
   * The document's technical definition, kept because it is source
   * content and still belongs on the page — now carried lower down
   * rather than in the opening.
   */
  definition:
    "A Panchang is the traditional Hindu almanac that identifies each day through five essential elements — Tithi, Vara, Nakshatra, Yoga, and Karana.",
  scrollCue: "Discover our legacy",
  cta: { label: "Explore This Year's Edition", href: "#explore" },
  image: {
    src: null,
    alt: "The current edition of the Kolhapur Latkar Panchang, open to a marked page",
    aspectRatio: 4 / 5,
  } satisfies ImageAsset,
  // TODO image: "Current Panchang Cover" — client to supply photograph.
}
