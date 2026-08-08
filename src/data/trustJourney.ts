/**
 * The publishing journey, as seven stages.
 *
 * Source: Kolhapur_Latkar_Panchang_English_Translation.docx ("Why
 * Readers Trust Us", "History", "Current Reach", "Awards"), and the
 * eleven photographs supplied by the client.
 *
 * ── What is real, and what is missing ─────────────────────────────
 * The stage *names* are a structural device agreed with the client.
 * The prose under each is only ever the document's own statements —
 * nothing here describes a step in the process that the document
 * does not attest to. Writing plausible copy about proofing rounds,
 * press checks or paper stock would be precisely the sort of
 * invention a publisher of scriptural calendars cannot ship.
 *
 * `printing` therefore carries no description and no photograph: the
 * document says nothing about how the Panchang is physically printed,
 * and no press photograph exists. It stays in the sequence as a named
 * stage so the journey is not silently seven-minus-one, and it will
 * fill in the moment material arrives.
 *
 * Photographs are referenced by id from data/legacyArchive.ts rather
 * than duplicated, so a caption or alt-text correction made there
 * propagates here automatically.
 */

export interface JourneyStage {
  id: string
  /** Ordinal shown on the golden thread. */
  name: string
  /** Document-sourced prose. Absent where the document is silent. */
  body?: string
  /** Photograph id from legacyArchive's collection, when one depicts
   * this stage honestly. Not every stage has one. */
  photoId?: string
  /** Set where a stage is knowingly incomplete, so the gap is visible
   * in the data rather than papered over in the layout. */
  todo?: string
}

export const trustJourney = {
  eyebrow: "The Work Behind It",
  heading: "How a Century of Trust Is Made",
  intro:
    "Every edition passes through the same sequence it has passed through since 1910 — the calculations, the scholars who check them, and the ceremony that puts the finished book into readers' hands.",
}

export const journeyStages: JourneyStage[] = [
  {
    id: "heritage",
    name: "Heritage",
    body: "Kolhapur Latkar Panchang was first compiled in 1910 by the late Pandit Shankar Ganesh Latkar, a scholar of Dharmashastra and hereditary priest of Shri Mahalakshmi Temple, Kolhapur. Three generations have carried it since.",
    photoId: "archival-document",
  },
  {
    id: "research",
    name: "Research",
    body: "Every religious and astrological decision is prepared under the guidance of learned scholars and supported by authentic Dharmashastra references.",
    photoId: "editorial-calculation-session",
  },
  {
    id: "editorial",
    name: "Editorial Process",
    body: "Scholars and family members review the proofs together before a new edition goes to print.",
    photoId: "committee-review-table",
  },
  {
    id: "verification",
    name: "Verification",
    body: "The work has been honoured with the title 'Panchang Bhaskar' by Shri Swami Jagadguru Shankaracharya Peeth, Karveer, and with the honorary title 'Jyotish Visharad' for contributions to astrology and Dharmashastra.",
    photoId: "vasudev-shankar-latkar-honor-certificate",
  },
  {
    id: "printing",
    name: "Printing",
    // TODO — the source document describes no part of the printing
    // process, and no photograph of the press was supplied. Left
    // deliberately empty rather than filled with plausible copy.
    todo: "Client to supply a description of the printing process and a photograph of the press.",
  },
  {
    id: "publication",
    name: "Publication",
    body: "The Centenary edition was released in public ceremony at Shri Mahalakshmi Temple, Kolhapur, marking a hundred years of uninterrupted publication.",
    photoId: "centenary-edition-distribution",
  },
  {
    id: "legacy",
    name: "Legacy",
    body: "The Panchang is trusted by an estimated 75,000 to 100,000 families across India.",
    photoId: "mahalakshmi-temple-gathering",
  },
]
