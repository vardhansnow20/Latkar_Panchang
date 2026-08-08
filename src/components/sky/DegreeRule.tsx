import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Moon } from "@/components/sky/Celestial"

/**
 * The celestial rail: one continuous graduated measure down the left
 * edge, carrying the reader's position through a full cosmic day.
 *
 * It replaces every local rule the page might otherwise carry — a
 * timeline spine, archive dividers, a progress bar in the nav. One
 * measure that the page travels past says something a dozen separate
 * ones cannot: that this is all a single descent.
 *
 * It does four jobs, which is the test for whether a celestial element
 * has earned its place:
 *   — it graduates the page (the ticks),
 *   — it reports position (the body, waxing and rising and setting),
 *   — it names where you are (the active chapter),
 *   — it navigates (each station is a link).
 *
 * Driven by plain scroll events rather than an animation-frame loop,
 * so it stays accurate even when the tab is throttled — and because
 * Lenis drives native scroll, momentum scrolling feeds it for free.
 */

const TICKS = 26

/**
 * The body overhead at a given point in the journey, matched to the
 * sky behind it: the moon waxes through the night registers, the sun
 * crosses the daylight ones, and the moon returns at dusk. Progress
 * boundaries mirror the gradient stops in globals.css.
 */
function CelestialBody({ p, active }: { p: number; active: boolean }) {
  const size = active ? 15 : 11
  const cls = cn(
    "transition-[color,opacity] duration-[var(--t-reveal)]",
    active ? "text-[var(--color-brass)] opacity-100" : "text-[var(--ink-faint)] opacity-70"
  )

  // Night: a moon, waxing across the first third.
  if (p < 0.345) return <Moon phase={0.15 + (p / 0.345) * 0.85} size={size} className={cls} />

  // Day: a sun, whose corona lengthens toward noon and shortens again.
  if (p < 0.885) {
    const noon = 1 - Math.abs((p - 0.345) / 0.54 - 0.5) * 2 // 0→1→0
    return (
      <svg viewBox="-12 -12 24 24" width={size} height={size} className={cls} aria-hidden="true">
        <circle r={5.2} fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4
            const r1 = 7
            const r2 = 7 + 1.4 + noon * 2.6
            return (
              <line
                key={i}
                x1={r1 * Math.cos(a)} y1={r1 * Math.sin(a)}
                x2={r2 * Math.cos(a)} y2={r2 * Math.sin(a)}
                opacity={0.5 + noon * 0.5}
              />
            )
          })}
        </g>
      </svg>
    )
  }

  // The moon returns.
  return <Moon phase={0.45} size={size} className={cls} />
}

export function DegreeRule({ registers }: { registers: { id: string; label: string }[] }) {
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState<string | null>(null)
  // Where each register sits in the journey, as a fraction — so a
  // station's icon shows the sky at *its* point in the cycle.
  const [stations, setStations] = useState<Record<string, number>>({})

  useEffect(() => {
    const read = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      setProgress(scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0)

      // Resolve by "topmost band crossing the reading line", a third
      // down the viewport — not by largest intersection. The registers
      // are deliberately unequal in height, and a largest-area rule
      // would keep the tall ones selected long after the reader left.
      const line = doc.clientHeight / 3
      let found: string | null = null
      const next: Record<string, number> = {}
      const docH = document.body.scrollHeight || 1
      for (const r of registers) {
        const el = document.getElementById(r.id)
        if (!el) continue
        next[r.id] = (el.offsetTop + el.offsetHeight / 2) / docH
        const box = el.getBoundingClientRect()
        if (box.top <= line && box.bottom > line) found = r.id
      }
      setStations(next)
      setCurrent(found)
    }

    read()
    window.addEventListener("scroll", read, { passive: true })
    window.addEventListener("resize", read)
    return () => {
      window.removeEventListener("scroll", read)
      window.removeEventListener("resize", read)
    }
  }, [registers])

  return (
    <div className="fixed inset-y-0 left-0 z-30 hidden w-[calc(var(--gutter)+var(--rule-channel))] sm:block">
      <div className="relative h-full">
        {/* The measure, and its graduations. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-[var(--gutter)] w-px bg-[var(--hairline)]"
          aria-hidden="true"
        />
        {Array.from({ length: TICKS + 1 }, (_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute left-[var(--gutter)] h-px bg-[var(--hairline)]"
            style={{ top: `${(i / TICKS) * 100}%`, width: i % 6 === 0 ? 10 : 4 }}
          />
        ))}

        {/* The portion already travelled, drawn in brass. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[var(--gutter)] top-0 w-px origin-top bg-[var(--color-brass)]/55"
          style={{ height: `${progress * 100}%` }}
        />

        {/* Stations. Each is a real link, so the rail navigates rather
            than only reporting — and Lenis intercepts the anchor, so
            arriving is eased rather than jumped. */}
        <nav aria-label="Chapters" className="absolute inset-y-0 left-0 w-full">
          <ul className="relative h-full">
            {registers.map((r) => {
              const at = stations[r.id]
              if (at === undefined) return null
              const active = current === r.id
              const passed = at <= progress
              return (
                <li
                  key={r.id}
                  className="absolute -translate-y-1/2"
                  style={{ top: `${at * 100}%`, left: "var(--gutter)" }}
                >
                  <a
                    href={`#${r.id}`}
                    aria-current={active ? "true" : undefined}
                    className="group/station -m-[10px] flex items-center gap-[var(--s-3)] p-[10px]"
                  >
                    <span
                      className={cn(
                        "-translate-x-1/2 transition-opacity duration-[var(--t-reveal)]",
                        passed || active ? "opacity-100" : "opacity-55"
                      )}
                    >
                      <CelestialBody p={at} active={active} />
                    </span>
                    {/* The label is held back until it is wanted —
                        eleven names down the margin would compete with
                        the page itself. */}
                    <span
                      className={cn(
                        "tick whitespace-nowrap transition-[opacity,transform] duration-[var(--t-reveal)] ease-[var(--ease)]",
                        active
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0 group-hover/station:translate-x-0 group-hover/station:opacity-100 group-focus-visible/station:translate-x-0 group-focus-visible/station:opacity-100"
                      )}
                    >
                      {r.label}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
