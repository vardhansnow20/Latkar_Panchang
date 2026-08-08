import type { TimelineEntry } from "@/types/content"

/**
 * Source: Kolhapur_Latkar_Panchang_English_Translation.docx,
 * "History" + "Centenary" sections. All four entries, dates, and
 * names are as given in that document.
 */
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
    // TODO image: "Founder Portrait" — Pandit Shankar Ganesh Latkar. Client to supply.
    image: { src: null, alt: "Pandit Shankar Ganesh Latkar, founder of the Kolhapur Latkar Panchang", aspectRatio: 4 / 5 },
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
