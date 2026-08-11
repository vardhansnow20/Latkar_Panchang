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
   * The opening has to answer "what is this?" before it answers "why
   * trust it?".
   *
   * The previous headline — "A Century of Scriptural Accuracy" — made
   * a claim about a thing it never named. A reader who has never met
   * a Panchang learned only that something had been accurate for a
   * hundred years, which is why the client reported the hero as
   * confusing. Accuracy is the second question; it is answered
   * immediately below, and again by the whole page.
   *
   * "Almanac" is the word that does the work: it is the source
   * document's own term for a Panchang, and it is the one word a
   * newcomer already understands. "Read from the sky" is a plain
   * description of the method — a Panchang is computed from the
   * positions of sun and moon — and asserts nothing the document
   * does not. No new claim is introduced. The original phrase is
   * still carried verbatim as `site.tagline` in the colophon.
   */
  heading: "The Hindu Almanac, Read from the Sky",
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
   * The document's own definition, promoted into the opening.
   *
   * It was written for the page and then buried below the fold,
   * which left the hero naming nothing. It is the clearest sentence
   * in the source material and it belongs where the question is
   * first asked. Verbatim — the five elements are named exactly as
   * the document names them.
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
