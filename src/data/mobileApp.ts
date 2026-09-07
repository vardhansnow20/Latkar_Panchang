import { asset } from "@/lib/asset"

/**
 * The source document (Kolhapur_Latkar_Panchang_English_Translation
 * .docx) says nothing about a mobile app, so the wording below is
 * still the pre-existing placeholder rather than anything drawn from
 * the client's material.
 *
 * The screenshot is the client's own: a capture from their app, Digital
 * Laxmi Calendar. The client has confirmed it is published on both the
 * App Store and Google Play, so the section no longer announces a
 * launch that has already happened.
 *
 * TODO — client to supply the two store URLs. Until they arrive the
 * buttons do not render at all; see `stores` below.
 */

/** A store listing. `href` stays null until its URL is known. */
interface StoreLink {
  id: string
  label: string
  href: string | null
}
export const mobileApp = {
  eyebrow: "Now Available",
  heading: "The Panchang, in Your Pocket.",
  body: "The same calculations, the same care, available the moment you need them.",

  /**
   * A button that goes nowhere is worse than no button, so each store
   * renders only once it has a URL. Until then the line below stands in
   * its place, which says the true thing — the app is out, the links
   * are not published here yet — rather than inviting a dead tap.
   */
  stores: [
    { id: "app-store", label: "App Store", href: null },
    { id: "play-store", label: "Google Play", href: null },
  ] as StoreLink[],
  storesPending:
    "Available on the App Store and Google Play. Direct links are being added here shortly.",
  /**
   * The app's opening screen, at its own proportions rather than a
   * nominal handset ratio — the frame is built from this number, so
   * using 9/19.5 here would letterbox or crop a screenshot that is
   * actually 1220x2712.
   */
  screen: {
    src: asset("app/digital-laxmi-calendar-screen.webp"),
    alt: "The Digital Laxmi Calendar app's opening screen, showing Shri Mahalakshmi of Kolhapur above the title of the annual Panchang",
    aspectRatio: 1220 / 2712,
  },
}
