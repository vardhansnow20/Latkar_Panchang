import type { ImageAsset } from "@/types/content"

/**
 * Source: Kolhapur_Latkar_Panchang_English_Translation.docx,
 * "History" and "Mission" sections. `pullQuote` is the document's
 * own Mission-statement sentence, presented as an emphasized
 * statement — not an invented attributed quote from a named person.
 */
export const about = {
  eyebrow: "About the Publisher",
  heading: "A Family Tradition Since 1910",
  intro: "Our mission is to present the traditional Panchang in a simple, readable, and practical format that can be understood by everyone.",
  pullQuote: "While older Panchangs were largely intended for scholars and priests, we strive to make authentic scriptural knowledge accessible to every household without compromising accuracy.",
  body: [
    "Kolhapur Latkar Panchang was first compiled in 1910 by the late Pandit Shankar Ganesh Latkar, a distinguished scholar of Dharmashastra and hereditary priest of Shri Mahalakshmi Temple, Kolhapur.",
    "Three generations have since carried the tradition forward, to Shri Meghshyam Vasant Latkar, who prepares the Panchang today.",
  ],
  /**
   * The fuller succession detail — kept out of the main flow per
   * "don't overload the page with large paragraphs," available via
   * the expandable disclosure in About.tsx. Same facts as the
   * History timeline, in narrative rather than timeline form.
   */
  expandableDetail:
    "Following the founder's passing in 1952, the tradition was continued by Vasudev Shankar (Nana) Latkar, with support from his elder brother, Vasant Latkar. Since 1989, Shri Meghshyam Vasant Latkar has continued the family tradition after receiving extensive guidance in Panchang studies, preserving over a century of scholarly tradition.",
  // TODO image: "Workshop" — client to supply photograph.
  portrait: {
    src: null,
    alt: "The workshop where the Kolhapur Latkar Panchang is prepared",
    aspectRatio: 4 / 5,
  } satisfies ImageAsset,
}
