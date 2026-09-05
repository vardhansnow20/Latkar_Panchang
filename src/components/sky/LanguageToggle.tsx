import { useLanguage, useContent, LANGUAGES, type Language } from "@/i18n/LanguageProvider"
import { cn } from "@/lib/utils"

/**
 * EN · मराठी — a two-state control, not a dropdown.
 *
 * With exactly two languages a select menu costs a click to show one
 * alternative, and a native `<select>` would be the only piece of
 * browser chrome on a page that has none. Both options stay visible;
 * the inactive one is a link to the other language.
 *
 * Built as a radiogroup rather than two buttons so a screen reader
 * announces it as one control with a current selection, and so arrow
 * keys move between the options the way they do in any picker.
 */

const LABEL: Record<Language, string> = {
  en: "EN",
  mr: "मराठी",
}

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage()
  const c = useContent()

  const name: Record<Language, string> = {
    en: c.ui.languageEnglish,
    mr: c.ui.languageMarathi,
  }

  return (
    <div
      role="radiogroup"
      aria-label={c.ui.language}
      className={cn("flex items-center gap-[var(--s-2)]", className)}
    >
      {LANGUAGES.map((lang, i) => {
        const active = language === lang
        return (
          <span key={lang} className="flex items-center gap-[var(--s-2)]">
            {i > 0 && (
              <span aria-hidden="true" className="h-3 w-px bg-[var(--hairline)]" />
            )}
            <button
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={name[lang]}
              // The active option is not focusable in sequence: a
              // radiogroup takes one tab stop, and arrow keys move
              // within it.
              tabIndex={active ? 0 : -1}
              onClick={() => setLanguage(lang)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault()
                  setLanguage(lang === "en" ? "mr" : "en")
                }
              }}
              className={cn(
                // "EN" measures 19px wide, under the 24px WCAG 2.2 AA
                // floor. Padding gives it a real target; the negative
                // margin hands the space back so nothing shifts.
                "group/lang relative -m-[var(--s-2)] min-w-[24px] p-[var(--s-2)] text-center transition-colors duration-[var(--t-quick)]",
                // Devanagari needs a touch more room than "EN" and
                // must not inherit the tracked small-caps treatment.
                lang === "mr"
                  ? "text-[0.82rem] tracking-normal"
                  : "text-[0.78rem] tracking-[var(--tracking-wide)] uppercase",
                active
                  ? "text-[var(--ink)]"
                  : "text-[var(--ink-faint)] hover:text-[var(--ink)]"
              )}
            >
              {LABEL[lang]}
              {/* The same gold underline the navigation uses, so this
                  reads as part of the masthead rather than a widget
                  dropped into it. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 -bottom-px h-px origin-left bg-[var(--metal)] transition-transform duration-[var(--t-reveal)] ease-[var(--ease)]",
                  active ? "scale-x-100" : "scale-x-0 group-hover/lang:scale-x-100"
                )}
              />
            </button>
          </span>
        )
      })}
    </div>
  )
}
