import { useEffect, useMemo, useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { site, navLinks } from "@/data/site"
import { Moon } from "@/components/sky/Celestial"
import { onScrollFrame } from "@/lib/onScroll"

/**
 * The house mark: a sun-and-degree rosette, which is the shape an
 * almanac's own subject suggests — rays for the solar day, a graduated
 * ring for the measurement, an open centre for the moon that crosses
 * it. Drawn rather than lettered, so it can stand alone at favicon
 * size once real brand assets exist.
 */
function Sunburst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor">
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * 360) / 16
          const rad = ((a - 90) * Math.PI) / 180
          const long = i % 4 === 0
          const r1 = long ? 15 : 17
          const r2 = long ? 23 : 20.5
          return (
            <line
              key={i}
              x1={24 + r1 * Math.cos(rad)}
              y1={24 + r1 * Math.sin(rad)}
              x2={24 + r2 * Math.cos(rad)}
              y2={24 + r2 * Math.sin(rad)}
              strokeWidth={long ? 1.5 : 0.8}
              opacity={long ? 1 : 0.7}
            />
          )
        })}
        <circle cx="24" cy="24" r="13" strokeWidth="1.2" />
        <circle cx="24" cy="24" r="9.5" strokeWidth="0.6" opacity="0.65" />
      </g>
      {/* The crescent in the centre — the moon on the solar dial. */}
      <path
        d="M27.5 17.6a7.2 7.2 0 1 0 0 12.8 8.4 8.4 0 0 1 0-12.8Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  )
}

/**
 * Navigation, kept to almost nothing.
 *
 * The degree rule down the left edge already reports position and
 * names the current register, so the masthead does not repeat either.
 * What is left is the wordmark and a way to jump — which is all a
 * masthead in a book actually does.
 *
 * It carries no background of its own even once scrolled: a bar of
 * opaque colour laid across a continuous sky would cut the one thing
 * this build is organised around. Legibility comes from a blur and
 * the tone of the register underneath.
 */
/** Where the masthead samples the tone beneath it — just below its own
 * bottom edge, so it reads the register it is actually overlapping. */
const MASTHEAD_LINE = 48

export function Masthead() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  /** The tone of whatever register is currently passing beneath the
   * masthead. The header is fixed and paints no background, so its ink
   * has to be borrowed from the sky behind it — without this it held
   * the dark default at every position and the wordmark sat at 1.05:1
   * against the night sky in the hero. */
  const [tone, setTone] = useState("tone-night")

  const ids = useMemo(() => navLinks.map((l) => l.href.replace(/^#/, "")), [])

  useEffect(() => {
    const read = () => {
      const isScrolled = window.scrollY > 80
      setScrolled((prev) => (prev === isScrolled ? prev : isScrolled))
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const p = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0
      // Quantised — the nav moon is 17px across.
      setProgress((prev) => (Math.abs(prev - p) < 0.004 ? prev : p))
      const line = document.documentElement.clientHeight / 3
      let found: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const box = el.getBoundingClientRect()
        if (box.top <= line && box.bottom > line) found = id
      }
      setCurrent(found)

      // Tone of the register crossing the masthead's own baseline.
      let beneath: string | null = null
      for (const el of document.querySelectorAll("section")) {
        const box = el.getBoundingClientRect()
        if (box.top <= MASTHEAD_LINE && box.bottom > MASTHEAD_LINE) {
          const t = [...el.classList].find((c) => c.startsWith("tone-"))
          if (t) beneath = t
        }
      }
      if (beneath) setTone((prev) => (prev === beneath ? prev : beneath))
    }
    return onScrollFrame(read)
  }, [ids])

  const dark = tone === "tone-night" || tone === "tone-dawn"

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[backdrop-filter,background-color] duration-[var(--t-reveal)]",
        tone,
        // The scrim has to follow the tone too: an indigo veil under
        // dark ink is the same mistake in the other direction.
        scrolled &&
          (dark
            ? "bg-[color-mix(in_srgb,var(--color-indigo)_22%,transparent)] backdrop-blur-md"
            : "bg-[color-mix(in_srgb,var(--color-paper)_34%,transparent)] backdrop-blur-md")
      )}
    >
      <div className="mx-auto flex w-full max-w-[var(--frame)] items-center justify-between gap-[var(--s-5)] px-[var(--gutter)] py-[var(--s-3)] sm:pl-[calc(var(--gutter)+var(--rule-channel))]">
        {/* A stacked wordmark with its own mark and its date, rather
            than one line of text. A house that has published since
            1910 should say so where the name is said. */}
        <a
          href="#opening"
          className="group/mark -my-[var(--s-2)] flex items-center gap-[var(--s-3)] py-[var(--s-2)]"
          aria-label={`${site.name} — top`}
        >
          <Sunburst className="size-7 shrink-0 text-[var(--metal)] transition-transform duration-[1.4s] ease-[var(--ease)] group-hover/mark:rotate-45 sm:size-8" />
          <span className="flex flex-col leading-none">
            <span
              className="text-[0.95rem] leading-[1.16] tracking-[0.13em] text-[var(--ink)] uppercase sm:text-[1.05rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Latkar
            </span>
            <span
              className="text-[0.95rem] leading-[1.16] tracking-[0.13em] text-[var(--ink)] uppercase sm:text-[1.05rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Panchang
            </span>
            <span className="mt-[3px] text-[0.625rem] tracking-[0.3em] text-[var(--metal)] uppercase">
              Since 1910
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-[var(--s-5)]">
            {navLinks.map((link) => {
              const active = current === link.href.replace(/^#/, "")
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "group/nav relative block py-[var(--s-2)] text-[0.78rem] tracking-[var(--tracking-wide)] uppercase transition-colors duration-[var(--t-quick)]",
                      active ? "text-[var(--ink)]" : "text-[var(--ink-faint)] hover:text-[var(--ink)]"
                    )}
                  >
                    {link.label}
                    {/* Gold drawn in from the left on approach, and
                        held for the chapter you are actually in. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 -bottom-px h-px origin-left bg-[var(--color-brass)] transition-transform duration-[var(--t-reveal)] ease-[var(--ease)]",
                        active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
                      )}
                    />
                  </a>
                </li>
              )
            })}

            {/* The moon closes the nav, reporting how far through the
                page the reader is. It is the same reading the degree
                rule shows, kept here because the rule is hidden on
                narrow screens and at the very top of the page. */}
            <li className="ml-[var(--s-2)] flex items-center" aria-hidden="true">
              <span className="mr-[var(--s-4)] h-4 w-px bg-[var(--hairline)]" />
              <Moon phase={progress} size={17} className="text-[var(--metal)]" />
            </li>
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="masthead-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-m-[var(--s-3)] p-[var(--s-3)] text-[var(--ink)] md:hidden"
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <nav
          id="masthead-menu"
          aria-label="Primary"
          className="bg-[color-mix(in_srgb,var(--color-indigo)_88%,transparent)] backdrop-blur-lg md:hidden"
        >
          <ul className="tone-night px-[var(--gutter)] py-[var(--s-2)]">
            {navLinks.map((link) => (
              <li key={link.href} className="border-t border-[var(--hairline)] first:border-t-0">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-[var(--s-3)] text-lead text-[var(--ink)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

/**
 * The colophon. Set at the very bottom of the sky and deliberately
 * plain — after a descent this long the last thing the page should do
 * is stop talking.
 *
 * Toned for night, not day. The cycle closes where it opened, so this
 * sits on #10162a; declaring tone-day here put dark ink on dark navy
 * and dropped the colophon to 3.6:1.
 */
export function Colophon() {
  return (
    <footer className="tone-night relative">
      <div className="mx-auto w-full max-w-[var(--frame)] px-[var(--gutter)] pb-[var(--s-5)] pl-[calc(var(--gutter)+var(--rule-channel))]">
        <div className="rule mb-[var(--s-4)] h-px w-full" />
        <div className="flex flex-col gap-[var(--s-3)] sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-note text-[var(--ink-faint)]">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="tick text-[var(--ink-faint)]">{site.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
