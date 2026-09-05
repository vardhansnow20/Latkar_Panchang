import type { TimelineEntry } from "@/types/content"
import { asset } from "@/lib/asset"

/**
 * Source: Kolhapur_Latkar_Panchang_English_Translation.docx,
 * "History" + "Centenary" sections. All four entries, dates, and
 * names are as given in that document.
 */
/**
 * A studio photograph from the family's archive, on its printed mount.
 * The photographer's imprint reads S. B. Takalkar, G.D. Art (Bom.),
 * Shivaji Udyamnagar, Kolhapur.
 *
 * The caption deliberately does not name the sitter. The client
 * supplied the plate without an attribution, and putting a name under
 * a face on the strength of a guess is the one mistake an archive
 * cannot walk back.
 *
 * TODO — client to identify the sitter and the year, after which the
 * caption below can say so.
 */
export const historyPortrait = {
  src: asset("legacy-archive/studio-portrait-mounted.webp"),
  alt: "A mounted studio photograph from the Latkar family archive, photographed by S. B. Takalkar of Kolhapur",
  aspectRatio: 942 / 1300,
}

/** The caption shown beneath it. Names the plate, not the sitter. */
export const historyPortraitCaption =
  "From the family archive · S. B. Takalkar, Kolhapur"

export const history = {
  eyebrow: "Our History",
  heading: "More Than a Century of Tradition",
  intro: "Three generations of the Latkar family, hereditary priests of Shri Mahalakshmi Temple, have prepared this Panchang since Shalivahan Shaka 1832 (1910 CE).",
}

/** Alternating `image` presence is deliberate — not every entry
 * needs a photograph, and the gap is part of the section's rhythm. */
export const historyTimeline: TimelineEntry[] = [
  {
    id: "founding",
    year: "1910",
    title: "Founding",
    body: "Kolhapur Latkar Panchang was first compiled by the late Pandit Shankar Ganesh Latkar, a distinguished scholar of Dharmashastra and hereditary priest of Shri Mahalakshmi Temple, Kolhapur.",
    /**
     * A painted portrait, signed SNK and dated 1977 — made well after
     * the founder's lifetime, as a commemorative portrait would be.
     *
     * Identified as the founder from the filename the client supplied
     * ("Ganesh_latkar"), which matches Shankar Ganesh Latkar. That is
     * an inference from a filename, not a statement from the source
     * document, so it is flagged rather than assumed settled.
     *
     * TODO — client to confirm the sitter before this caption is
     * treated as final.
     */
    image: {
      src: asset("legacy-archive/founder-portrait-painting.webp"),
      alt: "A painted portrait of the Panchang's founder, signed SNK and dated 1977",
      aspectRatio: 1290 / 1300,
    },
  },
  {
    id: "second-generation",
    year: "1952",
    title: "Second Generation",
    body: "Following the founder's passing, the tradition was continued by Vasudev Shankar (Nana) Latkar, with support from his elder brother, Vasant Latkar.",
  },
  {
    id: "third-generation",
    year: "1989",
    title: "Third Generation",
    body: "Shri Meghshyam Vasant Latkar continued the family tradition after receiving extensive guidance in Panchang studies. He prepares the Panchang to this day.",
    // TODO image: "Family Photograph" — Shri Meghshyam Vasant Latkar. Client to supply.
    image: { src: null, alt: "Shri Meghshyam Vasant Latkar, who prepares the Panchang today", aspectRatio: 4 / 5 },
  },
  {
    id: "centenary",
    year: "2010",
    title: "Centenary",
    body: "The Centenary Celebration of Latkar Panchang (1910–2010) was celebrated at Shri Mahalakshmi Temple, Kolhapur, recognizing a century of uninterrupted service, scriptural excellence, and public trust.",
  },
]
