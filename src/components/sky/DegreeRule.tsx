import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { onScrollFrame } from "@/lib/onScroll"
import { Moon } from "@/components/sky/Celestial"
import { useContent } from "@/i18n/LanguageProvider"

/**
 * The reader's position through the journey, down the left margin.
 *
 * ── What this replaced, and why ───────────────────────────────────
 * The first version drew a graduated scale: a hairline with
 * twenty-six ticks and a body at every station. At the width the
 * margin actually gives it, the ticks read as a thermometer rather
 * than an instrument — dense, mechanical, and busier than the page it
 * sits beside. It is gone. What remains is the smallest thing that
 * still does the job: one hairline, the distance travelled drawn in
 * brass over it, a station dot per chapter, and the moon riding the
 * head of the fill.
 *
 * ── Why the measurement is split in two ───────────────────────────
 * Station positions depend on layout and change only when the page
 * resizes; progress depends on scroll and changes constantly. The
 * first version recomputed both on every scroll event and wrote the
 * stations into state as a fresh object each time, so the entire rail
 * re-rendered continuously while scrolling. Positions are now
 * measured on mount and resize only, and the scroll path touches a
 * single number.
 */

interface RegisterRef {
  id: string
  label: string
}

export function DegreeRule({ registers }: { registers: RegisterRef[] }) {
  const c = useContent()
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState<string | null>(null)
  const [stations, setStations] = useState<{ id: string; label: string; at: number }[]>([])

  // Layout-dependent: measured on mount and on resize, never on scroll.
  useEffect(() => {
    const measure = () => {
      const docH = document.body.scrollHeight || 1
      const placed = registers
        .map((r) => {
          const el = document.getElementById(r.id)
          if (!el) return null
          return { id: r.id, label: r.label, at: (el.offsetTop + el.offsetHeight / 2) / docH }
        })
        .filter((s): s is { id: string; label: string; at: number } => s !== null)

      // Enforce a floor on the gap between neighbouring stations.
      //
      // A station sits at its register's midpoint, which is honest but
      // collides when a short register follows a long one: the App note
      // is a fraction of the page, so its dot landed within a few pixels
      // of Reach's and the two 18px hit areas overlapped outright —
      // measured at 20px of overlap, which makes the pair unclickable
      // with any confidence. Nudging the later one down preserves the
      // order and the approximate position while separating the targets.
      const MIN_GAP = 0.07
      for (let i = 1; i < placed.length; i++) {
        const gap = placed[i].at - placed[i - 1].at
        if (gap < MIN_GAP) placed[i].at = placed[i - 1].at + MIN_GAP
      }
      // If the nudging pushed the last station past the rail, walk the
      // whole run back up rather than letting it fall off the end.
      const overshoot = placed.length ? placed[placed.length - 1].at - 1 : 0
      if (overshoot > 0) for (const s of placed) s.at -= overshoot

      setStations(placed)
    }
    measure()
    window.addEventListener("resize", measure)
    // Images settling changes section offsets after first paint.
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    return () => {
      window.removeEventListener("resize", measure)
      observer.disconnect()
    }
  }, [registers])

  // Scroll-dependent: one number and one string, both guarded so an
  // unchanged value never schedules a render.
  const lastPct = useRef(-1)
  useEffect(() => {
    return onScrollFrame(() => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const p = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0

      // Quantised to a tenth of a percent: the rail is a few hundred
      // pixels tall, so finer resolution cannot be seen and only costs
      // renders.
      const pct = Math.round(p * 1000)
      if (pct !== lastPct.current) {
        lastPct.current = pct
        setProgress(pct / 1000)
      }

      const line = doc.clientHeight / 3
      let found: string | null = null
      for (const r of registers) {
        const el = document.getElementById(r.id)
        if (!el) continue
        const box = el.getBoundingClientRect()
        if (box.top <= line && box.bottom > line) found = r.id
      }
      setCurrent((prev) => (prev === found ? prev : found))
    })
  }, [registers])

  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden w-[calc(var(--gutter)+var(--rule-channel))] sm:block">
      <div className="relative h-[62vh] top-1/2 -translate-y-1/2">
        {/* The track. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-[var(--gutter)] w-px bg-[var(--hairline)]"
        />
        {/* Distance travelled. Scaled rather than resized, so the
            browser composites it instead of laying out. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-[var(--gutter)] w-px origin-top bg-gradient-to-b from-[var(--color-brass)]/70 to-[var(--color-brass)]"
          style={{ transform: `scaleY(${progress})` }}
        />

        {/* One dot per chapter — a destination, not a graduation. */}
        <nav aria-label={c.ui.chapters} className="pointer-events-auto absolute inset-0">
          <ul className="relative h-full">
            {stations.map((s) => {
              const active = current === s.id
              const passed = s.at <= progress
              return (
                <li
                  key={s.id}
                  className="absolute -translate-y-1/2"
                  style={{ top: `${s.at * 100}%`, left: "var(--gutter)" }}
                >
                  <a
                    href={`#${s.id}`}
                    aria-current={active ? "true" : undefined}
                    className="group/station -m-[9px] flex items-center gap-[var(--s-3)] p-[9px]"
                  >
                    <span
                      className={cn(
                        "block -translate-x-1/2 rounded-full transition-[width,height,background-color,box-shadow] duration-[var(--t-reveal)] ease-[var(--ease)]",
                        active
                          ? "size-[7px] bg-[var(--color-brass)] shadow-[0_0_10px_2px_rgba(176,141,87,0.55)]"
                          : passed
                            ? "size-[4px] bg-[var(--color-brass)]/75"
                            : "size-[3px] bg-[var(--ink-faint)]/50 group-hover/station:bg-[var(--color-brass)]"
                      )}
                    />
                    {/* Shown on approach only, never for the active
                        station.

                        The channel is 72px wide and these labels run to
                        130px, so a permanently-visible name does not sit
                        in the margin — it prints across the article.
                        Measured at 1440px, the active label reached 61px
                        into the reading column and was drawn over the
                        pull-quote. Position is already carried by the
                        dot, which enlarges and takes a brass glow; the
                        name is for when someone points at the rail
                        meaning to use it, and a momentary overlap during
                        that gesture is what the reader has asked for. */}
                    <span
                      className={cn(
                        "tick -translate-x-1 whitespace-nowrap opacity-0 transition-[opacity,transform] duration-[var(--t-reveal)] ease-[var(--ease)]",
                        "group-hover/station:translate-x-0 group-hover/station:opacity-100",
                        "group-focus-visible/station:translate-x-0 group-focus-visible/station:opacity-100"
                      )}
                    >
                      {s.label}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* The moon rides the head of the fill, waxing as it goes. */}
        <div
          aria-hidden="true"
          className="absolute left-[var(--gutter)] -translate-x-1/2 text-[var(--color-brass)] will-change-transform"
          style={{ top: 0, transform: `translate(-50%, -50%) translateY(${progress * 62}vh)` }}
        >
          <Moon phase={progress} size={15} />
        </div>
      </div>
    </div>
  )
}
