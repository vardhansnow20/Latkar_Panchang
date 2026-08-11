import type { ImageAsset } from "@/types/content"
import { asset } from "@/lib/asset"

/**
 * Source: the client's own 2027 calendar sheet ("Calender 2027.png"),
 * supplied as artwork and rendered to WebP.
 *
 * This entry previously carried a TODO saying the product might not
 * exist — it was invented as a plausible companion in an early design
 * pass, before any source material. The artwork settles it: the
 * product is real, it is published by Latkar Publications L.L.P., and
 * it is titled **श्री लक्ष्मी वार्षिक पंचांग**. The section is now
 * built on the artifact rather than on a guess.
 *
 * Everything below is legible on the sheet itself. Nothing about
 * paper stock, print run, page count or availability is asserted,
 * because the sheet does not say.
 */
export const laxmiCalendar = {
  eyebrow: "Also From This Press",
  heading: "Shree Laxmi Calendar",
  /** As printed on the sheet. */
  script: "॥श्री लक्ष्मी॥ वार्षिक पंचांग",
  intro:
    "The wall calendar from the same house — a full year of the Panchang set out one month to a sheet, for households that keep their dates on the wall rather than the shelf.",
  body: "Every day carries its tithi and nakshatra, the festivals and observances marked in place, and the Rahu Kaal set out for each weekday down the margin.",
  link: { label: "Ask about this year's calendar", href: "#reach" },

  image: {
    src: asset("editions/laxmi-calendar.webp"),
    alt: "The Shree Laxmi annual calendar, January 2027 sheet, published by Latkar Publications",
    aspectRatio: 1500 / 2245,
  } satisfies ImageAsset,
  full: {
    src: asset("editions/laxmi-calendar-full.webp"),
    alt: "The Shree Laxmi annual calendar, January 2027 sheet, at full resolution",
    aspectRatio: 1500 / 2245,
  } satisfies ImageAsset,

  /** Museum label for the sheet, read off the artwork. */
  plate: {
    designation: "January 2027 · Shake 1948 · Vikram Samvat 2083",
    note: "The January sheet. Shalivahan Shake 1948, Margashirsha–Poush, Parabhav samvatsara. Makar Sankranti is marked on the 15th, Republic Day on the 26th, and the Rahu Kaal for every weekday runs down the right-hand column.",
  },
}
