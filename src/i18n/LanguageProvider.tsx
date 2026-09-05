import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { en, type Content } from "@/i18n/en"
import { mr } from "@/i18n/mr"
import { mergeContent } from "@/i18n/merge"
import { fill } from "@/i18n/ui"

export const LANGUAGES = ["en", "mr"] as const
export type Language = (typeof LANGUAGES)[number]

const STORAGE_KEY = "klp.language"

interface LanguageContextValue {
  language: Language
  setLanguage: (next: Language) => void
  content: Content
  /** Interpolate a chrome string: `t(c.ui.viewFullImage, { title })`. */
  t: (template: string, values?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readStored(): Language | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === "en" || raw === "mr" ? raw : null
  } catch {
    // Private browsing, or storage disabled. Not worth failing over.
    return null
  }
}

/**
 * Language state for the whole page.
 *
 * ── Why the trees are built once ──────────────────────────────────
 * Both merged content trees are memoised for the lifetime of the app,
 * not rebuilt per render. Switching language therefore swaps one
 * object reference: React re-renders the text, and every scroll
 * listener, IntersectionObserver, sticky scene and motion value keeps
 * its identity. Nothing remounts, so the scroll position, the celestial
 * rail, the orbit's active milestone and any open lightbox all survive
 * the switch — which is the whole requirement.
 *
 * ── Why there is no automatic detection ───────────────────────────
 * A visitor whose browser reports Marathi may still expect the English
 * site, and silently rewriting the page under them is the more
 * surprising failure. First visit is English; the choice is one click
 * away and remembered thereafter.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Read synchronously on first render so a returning Marathi reader
  // never sees a frame of English before the effect runs.
  const [language, setLanguageState] = useState<Language>(() => readStored() ?? "en")

  const trees = useMemo(
    () => ({ en, mr: mergeContent(en, mr) }) satisfies Record<Language, Content>,
    []
  )

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Preference simply won't persist; the session still works.
    }
  }, [])

  // Keep the document in step: `lang` drives font selection, hyphenation
  // and screen-reader pronunciation, and getting it wrong makes a
  // screen reader read Devanagari with English phonetics.
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      content: trees[language],
      t: (template, values) => (values ? fill(template, values) : template),
    }),
    [language, setLanguage, trees]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

function useLanguageContext() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>")
  return ctx
}

/** The current language and the setter — for the selector itself. */
export function useLanguage() {
  const { language, setLanguage } = useLanguageContext()
  return { language, setLanguage }
}

/**
 * The whole content tree in the current language.
 *
 * Typed from the English source, so `content.hero.headnig` is a
 * compile error rather than a blank on the page — which is the failure
 * mode of string-keyed lookups like `t("hero.headnig")`.
 */
export function useContent() {
  return useLanguageContext().content
}

/** Interpolation for chrome strings carrying `{placeholders}`. */
export function useT() {
  return useLanguageContext().t
}
