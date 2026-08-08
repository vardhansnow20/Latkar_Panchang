/**
 * Source: Kolhapur_Latkar_Panchang_English_Translation.docx.
 *
 * The document defines what a Panchang *is* and names its five
 * elements. It does not define the elements individually, so none of
 * them carries an explanation here — the section presents the five
 * names and nothing more.
 *
 * That is a deliberate choice over filling the space: Tithi, Vara,
 * Nakshatra, Yoga and Karana have precise scriptural meanings, and a
 * plausible-sounding gloss written from general knowledge would be
 * exactly the kind of error a Panchang publisher cannot ship.
 *
 * TODO — client to supply an authentic one-line definition for each
 * element. The layout already reserves room for them; adding the
 * `meaning` strings below is the only change required.
 */
export const elements = {
  eyebrow: "The Five Limbs",
  heading: "What a Panchang Is",
  /** The document's own definition, verbatim in substance. */
  definition:
    "A Panchang is the traditional Hindu almanac that identifies each day through five essential elements — Tithi, Vara, Nakshatra, Yoga, and Karana.",
}

export interface PanchangElement {
  id: string
  /** Devanagari, as the Panchang itself sets it. */
  script: string
  /** Romanised name, as the English translation gives it. */
  name: string
  /** TODO — awaiting authentic source text. Rendered only when set. */
  meaning?: string
}

export const panchangElements: PanchangElement[] = [
  { id: "tithi", script: "तिथि", name: "Tithi" },
  { id: "vara", script: "वार", name: "Vara" },
  { id: "nakshatra", script: "नक्षत्र", name: "Nakshatra" },
  { id: "yoga", script: "योग", name: "Yoga" },
  { id: "karana", script: "करण", name: "Karana" },
]
