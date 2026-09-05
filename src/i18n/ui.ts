/**
 * Interface chrome: the strings that are not editorial content.
 *
 * These are separated from the page's copy on purpose. Menu labels,
 * dialog controls and accessibility names are ordinary interface
 * language with settled, unambiguous Marathi — unlike the body copy,
 * which carries scriptural and historical claims and belongs to the
 * client's own words.
 *
 * Everything here is still worth a native reader's eye before launch,
 * but none of it asserts anything about the Panchang.
 */
export const ui = {
  skipToContent: "Skip to content",
  home: "Home",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  language: "Language",
  languageEnglish: "English",
  languageMarathi: "Marathi",
  chapters: "Chapters",
  readingProgress: "Reading progress",
  primaryNav: "Primary",
  /** `{title}` is replaced with the plate's own name. */
  viewFullImage: "View full image: {title}",
  close: "Close",
  previous: "Previous",
  next: "Next",
  awaitingMaterial: "Awaiting material from the archive.",
  placeholderPortrait: "Placeholder — awaiting an archival portrait.",
  scrollCue: "Discover our legacy",
  tapToOpen: "Tap to open",
  readFullSuccession: "Read the full succession",
  /** `{n}` and `{total}` are the plate's place in the collection. */
  plateNumber: "Plate {n} / {total}",
  detailPlanetary: "Detail · the planetary columns",
  labelAddress: "Address",
  labelTelephone: "Telephone",
  actionWrite: "Write to us",
  actionCall: "Call us",
  /** Wayfinding names for the celestial rail — the words the reader
   * sees beside the moon. Distinct from the navbar's shorter labels. */
  rail: {
    opening: "The Sky",
    descent: "A Hundred Years",
    inside: "Inside the Edition",
    contents: "The Pages",
    trust: "Why It Is Trusted",
    compilers: "The Compilers",
    archive: "The Archive",
    calendar: "The Calendar",
    almanac: "The App",
    reach: "Reach Us",
  },
}

export type UiStrings = typeof ui

/**
 * Marathi interface chrome.
 *
 * Note on two choices that are not literal:
 *   — "Chapters" is प्रकरणे (sections of a book) rather than
 *     अध्याय, which carries a scriptural connotation this navigation
 *     does not intend;
 *   — "Reading progress" is वाचनाची प्रगती rather than a calque, which
 *     is how a Marathi reader would actually say it.
 */
export const uiMr: UiStrings = {
  skipToContent: "मजकुराकडे जा",
  home: "मुख्यपृष्ठ",
  menuOpen: "मेनू उघडा",
  menuClose: "मेनू बंद करा",
  language: "भाषा",
  languageEnglish: "इंग्रजी",
  languageMarathi: "मराठी",
  chapters: "प्रकरणे",
  readingProgress: "वाचनाची प्रगती",
  primaryNav: "मुख्य",
  viewFullImage: "पूर्ण छायाचित्र पहा: {title}",
  close: "बंद करा",
  previous: "मागील",
  next: "पुढील",
  awaitingMaterial: "संग्रहातील साहित्याची प्रतीक्षा आहे.",
  placeholderPortrait: "तात्पुरते छायाचित्र — संग्रहातील छायाचित्राची प्रतीक्षा.",
  scrollCue: "आमचा वारसा पहा",
  tapToOpen: "उघडण्यासाठी स्पर्श करा",
  readFullSuccession: "संपूर्ण परंपरा वाचा",
  plateNumber: "पत्रक {n} / {total}",
  detailPlanetary: "तपशील · ग्रहांचे स्तंभ",
  labelAddress: "पत्ता",
  labelTelephone: "दूरध्वनी",
  actionWrite: "आम्हाला लिहा",
  actionCall: "आम्हाला दूरध्वनी करा",
  rail: {
    opening: "आकाश",
    descent: "शंभर वर्षे",
    inside: "अंकाच्या आत",
    contents: "पाने",
    trust: "विश्वास का",
    compilers: "संकलक",
    archive: "संग्रह",
    calendar: "दिनदर्शिका",
    almanac: "अ‍ॅप",
    reach: "संपर्क",
  },
}

/** Substitute `{name}` placeholders. Kept trivial on purpose — this is
 * interpolation, not a template language. */
export function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? values[key] : whole
  )
}
