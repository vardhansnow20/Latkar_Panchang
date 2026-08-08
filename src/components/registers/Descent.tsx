import { useEffect, useRef, useState } from "react"
import { m, useMotionValue, useTransform, type MotionValue } from "framer-motion"
import { Register, Measure } from "@/components/sky/Register"
import { Plate } from "@/components/sky/Plate"
import { Figure, StarField } from "@/components/sky/Celestial"
import { history, historyTimeline } from "@/data/history"
import { rise, viewport } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const COUNT = historyTimeline.length
/** Screens of scroll given to the orbit. One per milestone plus a
 * half at each end, so the first arrives and the last departs rather
 * than snapping in at the section edges. */
const SCENE_SCREENS = COUNT + 1

/**
 * A hundred years, taken as an orbit rather than a list.
 *
 * The milestones sit as bodies on a single ring. As the reader
 * descends, the ring turns and carries each one in turn to the focus
 * — a fixed point at the right of the dial where the year is read.
 * Nothing is scroll-jacked: the page scrolls at its own speed and the
 * ring's angle is simply a function of how far through the section
 * you are, so the scrollbar never lies and momentum is never fought.
 *
 * Why an orbit and not a line: two of the four milestones have no
 * photograph and the other two are still empty mounts, so a
 * conventional timeline would be a column of text with gaps in it.
 * Here the geometry carries the section and the photographs are a
 * bonus when they arrive.
 *
 * Accessibility: all four entries stay mounted and readable in
 * document order — the ring only changes what is *visually*
 * foremost. Under reduced motion the ring does not turn at all and
 * the entries render as a plain stacked list, which is the honest
 * fallback rather than a degraded animation.
 */
export function Descent() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)

  // Progress is measured directly from the scene's own box on a plain
  // passive scroll listener, rather than through a scroll-tracking
  // hook. Two reasons, and the second is the important one:
  //
  //   — it is the same mechanism the celestial rail and masthead use,
  //     so all three agree about position by construction;
  //   — hook-based scroll tracking measures on an animation frame, so
  //     under a throttled or backgrounded tab it silently stops
  //     updating and the timeline freezes on its first milestone.
  //
  // A rect read in a scroll handler cannot desync that way.
  const rotation = useMotionValue(0)
  const step = 360 / COUNT

  useEffect(() => {
    if (prefersReducedMotion) return
    const el = sceneRef.current
    if (!el) return

    const read = () => {
      const rect = el.getBoundingClientRect()
      const travel = rect.height - document.documentElement.clientHeight
      if (travel <= 0) return
      const p = Math.min(Math.max(-rect.top / travel, 0), 1)
      // Negative, so bodies travel clockwise into the focus.
      rotation.set(-step * (COUNT - 1) * p)
      const i = Math.min(Math.max(Math.round(p * (COUNT - 1)), 0), COUNT - 1)
      setActive((prev) => (prev === i ? prev : i))
    }

    read()
    window.addEventListener("scroll", read, { passive: true })
    window.addEventListener("resize", read)
    return () => {
      window.removeEventListener("scroll", read)
      window.removeEventListener("resize", read)
    }
  }, [prefersReducedMotion, rotation, step])

  return (
    /* No `overflow-hidden` on this section, deliberately.
     *
     * An ancestor with `overflow: hidden` becomes a scroll container,
     * and `position: sticky` then anchors to *that* box rather than
     * the viewport. Because the box does not itself scroll, the scene
     * never sticks — it scrolls away after the first milestone, which
     * is exactly why only 1910 was ever visible. Clipping happens on
     * the sticky element itself instead, where it is harmless. */
    <Register id="descent" tone="night" height="open">
      <StarField count={34} className="absolute inset-0" />

      <Measure size="wide" className="relative mb-[var(--s-7)]">
        <m.div initial="hidden" whileInView="visible" viewport={viewport} variants={rise}>
          <p className="tick mb-[var(--s-3)]">{history.eyebrow}</p>
          <h2 className="mb-[var(--s-3)] text-chapter text-[var(--ink)]">{history.heading}</h2>
          <p className="text-lead text-[var(--ink-soft)]">{history.intro}</p>
        </m.div>
      </Measure>

      {prefersReducedMotion ? (
        <StaticList />
      ) : (
        <div ref={sceneRef} style={{ height: `${SCENE_SCREENS * 100}svh` }} className="relative">
          {/* Clipping lives here, on the sticky element itself, where
              it cannot interfere with its own stickiness — only
              ancestors between a sticky element and the viewport can
              break it. */}
          <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
            <Dial rotation={rotation} active={active} />
          </div>
        </div>
      )}
    </Register>
  )
}

/**
 * The dial. A ring of milestone bodies, a fixed focus marker, and the
 * active entry read beside it.
 */
function Dial({
  rotation,
  active,
}: {
  rotation: MotionValue<number>
  active: number
}) {
  const step = 360 / COUNT
  // One counter-rotation for every body, derived once. Deriving it
  // inside the map would call a hook per iteration — stable only by
  // luck of a fixed-length array, and a rules-of-hooks violation
  // regardless. Each body then cancels its own placement angle with a
  // plain static transform, so the two together hold it upright.
  const counter = useTransform(rotation, (r) => -r)

  return (
    <div className="relative w-full">
      {/* ── The ring ──────────────────────────────────────────────
          Centred on the left margin at desktop so the dial reads as
          part of a far larger instrument continuing off-page, and
          leaves the right two-thirds clear for reading. On mobile it
          sits top-centre and small, with the entry stacked beneath. */}
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2",
          "top-[26%] w-[124vw] max-w-none",
          "lg:top-1/2 lg:left-0 lg:w-[86svh] lg:-translate-x-[38%]"
        )}
        aria-hidden="true"
      >
        <m.div className="h-full w-full" style={{ rotate: rotation }}>
          {/* The orbital path itself. */}
          <Figure name="orbits" opacity={0.25} className="absolute inset-0 h-full w-full text-[var(--color-brass-soft)]" />
          <div className="absolute inset-[6%] rounded-full border border-[var(--color-brass)]/25" />
          <div className="absolute inset-[18%] rounded-full border border-dashed border-[var(--color-brass-soft)]/15" />

          {/* Bodies, one per milestone, evenly spaced around the ring. */}
          {historyTimeline.map((entry, i) => {
            const angle = i * step
            const isActive = i === active
            return (
              <div
                key={entry.id}
                className="absolute top-1/2 left-1/2 h-0 w-0"
                style={{ transform: `rotate(${angle}deg) translateX(47%)` }}
              >
                {/* Two rotations cancel the two that placed it: the
                    ring's live angle, then its own fixed one. The body
                    therefore never tumbles as the dial turns. */}
                <m.div style={{ rotate: counter }}>
                  <div style={{ transform: `rotate(${-angle}deg)` }}>
                    <span
                      className={cn(
                        "block -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,box-shadow,background-color] duration-[900ms] ease-[var(--ease)]",
                        isActive
                          ? "size-4 bg-[#f3e7c9] shadow-[0_0_28px_10px_rgba(217,201,163,0.5)]"
                          : "size-2 bg-[var(--color-brass-soft)]/55"
                      )}
                    />
                  </div>
                </m.div>
              </div>
            )
          })}
        </m.div>

        {/* ── The focus ──────────────────────────────────────────
            A fixed mark the bodies arrive at, so the ring has a
            destination rather than simply spinning. It lives inside
            the ring's own box and uses the same 47% offset as the
            bodies, which is the only way to guarantee they coincide
            at every viewport size. */}
        <div
          className="absolute top-1/2 left-1/2 h-0 w-0"
          style={{ transform: "translateX(47%)" }}
        >
          <div className="size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-brass)]/35" />
        </div>
      </div>

      {/* ── The entries ──────────────────────────────────────────
          All four stay in the document; only their visual weight
          changes. Stacked in one grid cell so they crossfade in place
          without the layout shifting under them. */}
      <div className="relative grid px-[var(--gutter)] lg:ml-[46%] lg:max-w-[42rem] lg:px-0">
        {historyTimeline.map((entry, i) => {
          const isActive = i === active
          return (
            <div
              key={entry.id}
              className={cn(
                "col-start-1 row-start-1 transition-[opacity,transform] duration-[900ms] ease-[var(--ease)]",
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-4 opacity-0"
              )}
            >
              <p className="tick mb-[var(--s-3)]">
                {String(i + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
              </p>
              <p
                className="mb-[var(--s-3)] text-epoch leading-[0.86] text-[var(--ink)] tabular-nums"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {entry.year}
              </p>
              <p className="tick mb-[var(--s-3)] text-[var(--ink-soft)]">{entry.title}</p>
              <Measure>
                <p className="text-body text-[var(--ink-soft)]">{entry.body}</p>
              </Measure>
              {entry.image && (
                <div className="mt-[var(--s-4)] w-[46%] max-w-[13rem]">
                  <Plate image={entry.image} mount="thin" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** The reduced-motion path: no dial, no scroll scene — the same
 * milestones as an ordinary sequence, which is what someone who has
 * asked for less movement actually wants. */
function StaticList() {
  return (
    <div className="relative flex flex-col gap-[var(--s-7)]">
      {historyTimeline.map((entry, i) => (
        <div key={entry.id}>
          <p className="tick mb-[var(--s-3)]">
            {String(i + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
          </p>
          <p
            className="mb-[var(--s-3)] text-epoch leading-[0.86] text-[var(--ink)] tabular-nums"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {entry.year}
          </p>
          <p className="tick mb-[var(--s-3)] text-[var(--ink-soft)]">{entry.title}</p>
          <Measure>
            <p className="text-body text-[var(--ink-soft)]">{entry.body}</p>
          </Measure>
          {entry.image && (
            <div className="mt-[var(--s-4)] w-[46%] max-w-[13rem]">
              <Plate image={entry.image} mount="thin" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Sunrise — the horizon the whole page turns on.
 *
 * Compositionally it is the emotional centre: one held breath in a
 * long descent, where the geometry is the entire content.
 *
 * Practically, it is where the sky crosses from night to day, and it
 * carries no text *because* that is where the crossing happens. A
 * continuous dark-to-light sky has one unavoidable zone in the middle
 * where neither pale nor dark ink holds a legible ratio; measured, it
 * took body copy to 1.33:1. Rather than tint text to fight it, the
 * crossing gets its own empty band, and every register with words
 * sits clearly on one side of it.
 *
 * It is tall on purpose. Shrinking it pushes the crossover back under
 * live text.
 */
export function Meridian() {
  return (
    // The id is load-bearing: SkyCalibration measures this band to
    // decide where the sunrise crossing goes.
    <Register id="meridian" tone="dawn" height="close" className="overflow-hidden">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="relative flex min-h-[62svh] items-center justify-center"
      >
        <Figure
          name="arc" opacity={0.45}
          className="h-[9rem] w-full max-w-[46rem] text-[var(--ink-faint)] lg:h-[13rem]"
        />
      </m.div>
    </Register>
  )
}
