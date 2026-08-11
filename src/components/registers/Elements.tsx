import { useEffect, useRef, useState } from "react"
import { m, useMotionValue, type MotionValue } from "framer-motion"
import { Register, Measure } from "@/components/sky/Register"
import { Figure, StarField } from "@/components/sky/Celestial"
import { elements, panchangElements, type PanchangElement } from "@/data/elements"
import { rise, sequence, viewport } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { onScrollFrame } from "@/lib/onScroll"

/**
 * What a Panchang is, and the five limbs it is made of.
 *
 * ── The sequence ──────────────────────────────────────────────────
 * The five were a row of equal cards, which said "here are five
 * things" and nothing else. They are now taken one at a time: the
 * reader descends, the ring turns, and each limb comes to the centre
 * in turn and is read there. Five parts of one day, met in order,
 * rather than five tiles scanned at once.
 *
 * ── What it does not do ───────────────────────────────────────────
 * It does not explain what the limbs *mean*. The source document
 * names Tithi, Vara, Nakshatra, Yoga and Karana and defines none of
 * them, and these are scriptural terms with precise meanings — an
 * invented gloss on a hundred-year-old almanac would be worse than
 * silence. Each limb keeps a reserved slot that renders the moment
 * authentic text is supplied, with no layout change needed.
 *
 * What the sequence *can* honestly teach is structure: that there are
 * five, that they are ordered, and that they are limbs of one system
 * rather than five unrelated features. That is what it does.
 *
 * ── Why it does not lag ───────────────────────────────────────────
 * The same mechanism as the century dial, for the same reasons:
 *
 *   — one passive scroll listener, rAF-throttled and shared;
 *   — the ring's angle is a MotionValue written directly to a
 *     transform, so turning it never re-renders React;
 *   — the only React state is the active index, and it is quantised,
 *     so it changes five times across the whole scene rather than
 *     once per frame;
 *   — the turning element is promoted with will-change, so its
 *     rotation is composited rather than repainted.
 *
 * Nothing is scroll-jacked: the page scrolls at its own speed and the
 * scene is a function of how far through it you are.
 */

const COUNT = panchangElements.length
/** Half a screen per limb, plus a little at each end so the first
 * arrives and the last departs rather than snapping at the edges. */
const SCENE_SCREENS = COUNT * 0.5 + 0.4

/** Devanagari numerals, since the numbering belongs to the same
 * writing system as the names it counts. */
const NUMERALS = ["१", "२", "३", "४", "५"]

export function Elements() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
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
      rotation.set(-step * (COUNT - 1) * p)
      const i = Math.min(Math.max(Math.round(p * (COUNT - 1)), 0), COUNT - 1)
      setActive((prev) => (prev === i ? prev : i))
    }

    return onScrollFrame(read)
  }, [prefersReducedMotion, rotation, step])

  return (
    /* No `overflow-hidden`: an ancestor that clips becomes a scroll
       container, and `position: sticky` would then anchor to it rather
       than to the viewport, so the scene would never stick. */
    <Register id="elements" tone="night" height="open">
      <StarField count={34} className="absolute inset-0" />

      <Figure
        name="yantra" opacity={0.08}
        turning
        className="pointer-events-none absolute hidden sm:block top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 text-[var(--color-brass-soft)] lg:h-[54rem] lg:w-[54rem]"
      />

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="relative mb-[var(--s-5)]"
      >
        <p className="tick mb-[var(--s-3)]">{elements.eyebrow}</p>
        <h2 className="mb-[var(--s-4)] max-w-[16ch] text-register text-[var(--ink)]">
          {elements.heading}
        </h2>
        <Measure size="wide">
          {/* A drop cap, as a museum wall text would set it. */}
          <p className="text-lead text-[var(--ink-soft)] [&::first-letter]:float-left [&::first-letter]:mt-[0.08em] [&::first-letter]:mr-[0.09em] [&::first-letter]:font-[family-name:var(--font-display)] [&::first-letter]:text-[3.4em] [&::first-letter]:leading-[0.78] [&::first-letter]:text-[var(--metal)]">
            {elements.definition}
          </p>
        </Measure>
      </m.div>

      {prefersReducedMotion ? (
        <StaticRow />
      ) : (
        <div ref={sceneRef} style={{ height: `${SCENE_SCREENS * 100}svh` }} className="relative">
          <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
            <Wheel rotation={rotation} active={active} />
          </div>
        </div>
      )}
    </Register>
  )
}

/** The turning ring, and the limb currently at the centre. */
function Wheel({
  rotation,
  active,
}: {
  rotation: MotionValue<number>
  active: number
}) {
  const step = 360 / COUNT

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* ── The ring ─────────────────────────────────────────────
          Five stations on one orbit, marking the limbs' places as the
          ring carries each in turn to the centre. They are plain
          marks rather than labels, so nothing here needs the
          counter-rotation the century dial's upright years require. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[112vw] max-w-[34rem] -translate-x-1/2 -translate-y-1/2 sm:w-[86vw] lg:w-[40rem]"
      >
        <m.div
          className="h-full w-full"
          style={{ rotate: rotation, willChange: "transform" }}
        >
          <div className="absolute inset-0 rounded-full border border-[var(--color-brass)]/22" />
          <div className="absolute inset-[13%] rounded-full border border-dashed border-[var(--color-brass-soft)]/14" />

          {panchangElements.map((el, i) => {
            const angle = i * step
            const lit = i === active
            return (
              // A full-size box rotated about the ring's centre, with
              // the station sitting on its top edge. Rotating a
              // zero-size element and translating it by a percentage
              // moves it nowhere, and container units need a container
              // context this has no reason to declare.
              <div
                key={el.id}
                className="absolute inset-0"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <span
                  className={cn(
                    "absolute top-0 left-1/2 block size-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                    "transition-[background-color,box-shadow] duration-[var(--t-reveal)]",
                    lit
                      ? "bg-[var(--color-brass-soft)] shadow-[var(--glow-gold)]"
                      : "bg-[var(--color-brass)]/35"
                  )}
                />
              </div>
            )
          })}
        </m.div>
      </div>

      {/* ── The limb being read ──────────────────────────────────
          Every limb stays mounted and in document order; only which
          one is visually foremost changes, so the section reads
          correctly to a screen reader and to search. */}
      <ol className="relative grid w-full place-items-center">
        {panchangElements.map((el, i) => (
          <li
            key={el.id}
            aria-current={i === active ? "true" : undefined}
            className={cn(
              // All five occupy the same cell; the inactive ones are
              // faded rather than unmounted.
              "col-start-1 row-start-1 flex flex-col items-center text-center",
              "transition-[opacity,transform] duration-[var(--t-reveal)] ease-[var(--ease)]",
              i === active
                ? "opacity-100"
                : "pointer-events-none translate-y-3 opacity-0"
            )}
            style={{ willChange: "opacity, transform" }}
          >
            <Limb element={el} index={i} />
          </li>
        ))}
      </ol>
    </div>
  )
}

function Limb({ element, index }: { element: PanchangElement; index: number }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="mb-[var(--s-3)] block text-[clamp(3.5rem,17vw,7rem)] leading-none text-[var(--color-brass-soft)]"
        style={{ fontFamily: "var(--font-devanagari)" }}
      >
        {NUMERALS[index]}
      </span>

      <span
        className="block text-[clamp(3rem,14vw,6rem)] leading-[1.05] text-[var(--color-brass-soft)]"
        style={{ fontFamily: "var(--font-devanagari)" }}
      >
        {element.script}
      </span>

      <span className="tick mt-[var(--s-4)] tabular-nums">
        {String(index + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
      </span>

      <span
        className="mt-[var(--s-2)] block text-title text-[var(--ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {element.name}
      </span>

      {/* Renders the moment authentic source text exists. Until then
          the limb is presented by name, which is all the document
          supports. */}
      {element.meaning && (
        <span className="mt-[var(--s-3)] block max-w-[34ch] text-body text-[var(--ink-soft)]">
          {element.meaning}
        </span>
      )}
    </>
  )
}

/** The honest fallback under reduced motion: the five, plainly. */
function StaticRow() {
  return (
    <m.ol
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={sequence}
      className="relative grid gap-[var(--s-5)] sm:grid-cols-3 lg:grid-cols-5"
    >
      {panchangElements.map((el, i) => (
        <m.li key={el.id} variants={rise} className="flex flex-col items-center text-center">
          <span
            className="text-[2.6rem] leading-none text-[var(--color-brass-soft)]"
            style={{ fontFamily: "var(--font-devanagari)" }}
          >
            {el.script}
          </span>
          <span className="tick mt-[var(--s-3)] tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            className="mt-[var(--s-2)] text-lead text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {el.name}
          </span>
        </m.li>
      ))}
    </m.ol>
  )
}
