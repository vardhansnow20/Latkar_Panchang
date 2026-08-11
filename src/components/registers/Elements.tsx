import { m } from "framer-motion"
import { Register, Measure } from "@/components/sky/Register"
import { Figure, StarField } from "@/components/sky/Celestial"
import { elements, panchangElements, type PanchangElement } from "@/data/elements"
import { rise, sequence, viewport } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * What a Panchang is, and the five limbs it is made of.
 *
 * The definition and the five elements are one register rather than
 * two: the source document gives a single sentence for the first and
 * five bare names for the second, so split apart each would be a
 * screen of air around one line of text.
 *
 * ── The composition ───────────────────────────────────────────────
 * The five are stations on an arc, not cells in a row. Each carries
 * its own slowly turning ring at its own period, an oversized ghost
 * numeral set behind the glyph, and the name beneath. On desktop they
 * are stepped vertically along a shallow curve so the set reads as a
 * measured arc rather than five equal boxes — the eye travels the
 * line instead of scanning a table.
 *
 * Nothing here explains what the elements *mean*, because the source
 * document does not. Each keeps a reserved slot that will render a
 * definition the moment authentic text is supplied, with no layout
 * change needed.
 */

/** Vertical offsets tracing a shallow arc across the five stations.
 * Applied only from `lg`, where there is width for the curve to read
 * as a curve rather than as five misaligned items. */
const ARC = ["lg:translate-y-7", "lg:translate-y-2", "lg:translate-y-0", "lg:translate-y-2", "lg:translate-y-7"]

/** Distinct, slow, mutually prime-ish periods, so the five rings never
 * fall into visible lockstep with one another. */
const PERIODS = [188, 233, 151, 271, 207]

/** Devanagari numerals, since the numbering belongs to the same
 * writing system as the names it counts. */
const NUMERALS = ["१", "२", "३", "४", "५"]

export function Elements() {
  return (
    <Register id="elements" tone="night" height="vast" className="overflow-hidden">
      <StarField count={34} className="absolute inset-0" />

      {/* Sacred geometry behind the five — this is the one register
          about the structure the calculations rest on. */}
      {/* Held deliberately below the hero's weight. The hero carries
          the page's one full instrument at 0.26; this register is a
          definition, so its geometry stays at roughly a third of that
          — present, never competing. */}
      <Figure
        name="yantra" opacity={0.08}
        turning
        className="pointer-events-none absolute hidden sm:block top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 text-[var(--color-brass-soft)] lg:h-[54rem] lg:w-[54rem]"
      />
      {/* Ambient warmth beneath the arc, so the group sits in light
          rather than floating on flat navy. */}
      <div
        aria-hidden="true"
        className="breathe pointer-events-none absolute bottom-[18%] left-1/2 h-[22rem] w-[80%] max-w-[56rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(176,141,87,0.12) 0%, rgba(176,141,87,0.04) 42%, transparent 70%)",
        }}
      />

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="relative mb-[var(--s-6)]"
      >
        <p className="tick mb-[var(--s-3)]">{elements.eyebrow}</p>
        <h2 className="mb-[var(--s-4)] max-w-[16ch] text-register text-[var(--ink)]">
          {elements.heading}
        </h2>
        <Measure size="wide">
          {/* A drop cap, as a museum wall text would set it — the one
              place on the page type behaves like printed matter. */}
          <p className="text-lead text-[var(--ink-soft)] [&::first-letter]:float-left [&::first-letter]:mt-[0.08em] [&::first-letter]:mr-[0.09em] [&::first-letter]:font-[family-name:var(--font-display)] [&::first-letter]:text-[3.4em] [&::first-letter]:leading-[0.78] [&::first-letter]:text-[var(--metal)]">
            {elements.definition}
          </p>
        </Measure>
      </m.div>

      <m.ol
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sequence}
        className="relative grid gap-[var(--s-6)] sm:grid-cols-2 lg:grid-cols-5 lg:items-start lg:gap-[var(--s-3)]"
      >
        {/* The shared path.
         *
         * Without it the five read as five separate objects that
         * happen to be adjacent. One orbit drawn through all of their
         * centres makes them limbs of a single system, which is what
         * they are — five readings of one day, not five features.
         *
         * The curve matches the vertical arc the stations are stepped
         * along, and sits at the height of their ring centres. Desktop
         * only: at one and two columns there is no shared line to
         * draw, and the stacking already reads as a sequence. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 80"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-[60px] hidden h-[80px] w-full lg:block"
        >
          <path
            d="M4 60 Q500 -4 996 60"
            fill="none"
            stroke="var(--color-brass)"
            strokeWidth="1"
            opacity="0.3"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M4 66 Q500 2 996 66"
            fill="none"
            stroke="var(--color-brass-soft)"
            strokeWidth="1"
            strokeDasharray="2 8"
            opacity="0.22"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {panchangElements.map((el, i) => (
          <Station key={el.id} element={el} index={i} />
        ))}
      </m.ol>
    </Register>
  )
}

function Station({ element, index }: { element: PanchangElement; index: number }) {
  return (
    <m.li
      variants={rise}
      className={cn("group/el relative flex flex-col items-center text-center", ARC[index])}
    >
      {/* The station's own sky: a ring turning at its own period, and
          a second, fainter one turning against it. Both are transform-
          only, so five of them cost nothing. */}
      <div className="relative mb-[var(--s-4)] flex aspect-square w-[7.5rem] items-center justify-center sm:w-[8.5rem]">
        <div
          className="turning absolute inset-0 rounded-full border border-[var(--color-brass)]/25 transition-colors duration-[var(--t-reveal)] group-hover/el:border-[var(--color-brass)]/55"
          style={{ ["--turn-dur" as string]: `${PERIODS[index]}s` }}
        />
        <div
          className="turning absolute inset-[14%] rounded-full border border-dashed border-[var(--color-brass-soft)]/20"
          style={{ ["--turn-dur" as string]: `${PERIODS[index] * 1.6}s`, animationDirection: "reverse" }}
        />

        {/* The oversized numeral, ghosted behind the glyph. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-[4.75rem] leading-none text-[var(--color-brass-soft)]/[0.08] transition-[color,transform] duration-[var(--t-reveal)] ease-[var(--ease)] group-hover/el:scale-105 group-hover/el:text-[var(--color-brass-soft)]/[0.14] sm:text-[5.5rem]"
          style={{ fontFamily: "var(--font-devanagari)" }}
        >
          {NUMERALS[index]}
        </span>

        {/* A held glow that rises only on approach. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-18%] rounded-full opacity-0 transition-opacity duration-[var(--t-reveal)] ease-[var(--ease)] group-hover/el:opacity-100"
          style={{
            background:
              "radial-gradient(circle, rgba(233,214,170,0.22) 0%, rgba(176,141,87,0.08) 45%, transparent 70%)",
          }}
        />

        <span
          className="relative text-[2.6rem] leading-none text-[var(--color-brass-soft)] transition-transform duration-[var(--t-reveal)] ease-[var(--ease)] group-hover/el:-translate-y-1 sm:text-[3rem]"
          style={{ fontFamily: "var(--font-devanagari)" }}
        >
          {element.script}
        </span>
      </div>

      <span className="tick mb-[var(--s-2)] tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className="text-lead text-[var(--ink)] transition-colors duration-[var(--t-reveal)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {element.name}
      </span>

      {/* Renders only once authentic source text exists. */}
      {element.meaning && (
        <span className="mt-[var(--s-2)] max-w-[22ch] text-note text-[var(--ink-soft)]">
          {element.meaning}
        </span>
      )}
    </m.li>
  )
}
