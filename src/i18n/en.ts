import { site, navLinks, socialLinks, legalLinks } from "@/data/site"
import { hero } from "@/data/hero"
import { history, historyTimeline, historyPortrait, historyPortraitCaption } from "@/data/history"
import { elements, panchangElements } from "@/data/elements"
import {
  explore,
  revealImage,
  closeUpImage,
  interiorPages,
  calendarPageImage,
  latestEditionImage,
} from "@/data/explore"
import { insideEdition, editionPlates } from "@/data/edition"
import { whyTrust, trustReasons } from "@/data/whyTrust"
import { trustJourney, journeyStages } from "@/data/trustJourney"
import { about } from "@/data/about"
import { legacyArchive, heroPhoto, archiveThemes } from "@/data/legacyArchive"
import { laxmiCalendar } from "@/data/laxmiCalendar"
import { mobileApp } from "@/data/mobileApp"
import { contact } from "@/data/contact"
import { interlude } from "@/data/interlude"
import { ui } from "@/i18n/ui"

/**
 * The English content tree — the base language, and the shape every
 * other language is checked against.
 *
 * Deliberately assembled from the existing `src/data` modules rather
 * than copied out of them. Those files carry the provenance comments
 * that say which part of the source document each string came from and
 * what is still a placeholder, and that record is the reason the copy
 * on this site can be trusted. Duplicating the strings here would
 * strand it.
 */
export const en = {
  ui,
  site,
  navLinks,
  socialLinks,
  legalLinks,
  hero,
  history,
  historyTimeline,
  historyPortrait,
  historyPortraitCaption,
  elements,
  panchangElements,
  explore,
  revealImage,
  closeUpImage,
  interiorPages,
  calendarPageImage,
  latestEditionImage,
  insideEdition,
  editionPlates,
  whyTrust,
  trustReasons,
  trustJourney,
  journeyStages,
  about,
  legacyArchive,
  heroPhoto,
  archiveThemes,
  laxmiCalendar,
  mobileApp,
  contact,
  interlude,
}

/** The shape of a complete content tree, derived rather than declared
 * so it can never drift from the English source. */
export type Content = typeof en
