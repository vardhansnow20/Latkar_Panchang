import type { NavLink, SocialLink } from "@/types/content"
import { asset } from "@/lib/asset"

/**
 * Site-wide constants — brand, navigation, footer, social. Nothing
 * section-specific lives here; see the sibling files in src/data/
 * for Hero/History/Explore/etc. copy.
 *
 * Source: Kolhapur_Latkar_Panchang_English_Translation.docx,
 * "Basic Information". Full name, tagline, and establishment date
 * are as given in that document — the site previously used an
 * invented name ("Laxmi Latkar Panchang") before this document
 * existed; corrected here.
 */
export const site = {
  name: "Kolhapur Latkar Panchang",
  shortName: "Latkar Panchang",
  tagline: "Over 100 Years of Scripturally Accurate Tradition",
  logo: {
    src: asset("brand/logo-placeholder.svg"), // TODO: swap for the real mark at the same path
    alt: "Kolhapur Latkar Panchang",
  },
} as const

/**
 * Kept deliberately short — the nav is meant to be nearly invisible,
 * not a sitemap. Section headings carry the full phrasing ("Explore
 * the Panchang", "Why Readers Trust This Panchang"); these labels
 * don't need to repeat it.
 */
export const navLinks: NavLink[] = [
  { label: "History", href: "#descent" },
  { label: "Contents", href: "#contents" },
  { label: "Trust", href: "#trust" },
  { label: "Publisher", href: "#compilers" },
  { label: "Archive", href: "#archive" },
  { label: "Calendar", href: "#calendar" },
  { label: "App", href: "#almanac" },
  { label: "Contact", href: "#reach" },
]

// TODO: no social media links were provided in the source document — client to supply.
export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
]

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
]
