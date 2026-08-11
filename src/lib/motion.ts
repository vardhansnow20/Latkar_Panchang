import type { Transition, Variants } from "framer-motion"

/**
 * The motion language, rebuilt.
 *
 * One curve, and it is slower than the previous system's throughout:
 * this page is a descent through a sky, and everything on it should
 * feel like it has mass. Nothing springs, nothing bounces, nothing
 * arrives in under half a second.
 *
 * Reveals are directional by intent rather than uniform — a numeral
 * rises, a plate is unveiled sideways, a column fades up — so that
 * two things entering the same screen never move identically.
 */

/** Keep in sync with --ease in tokens.css. */
export const EASE: Transition["ease"] = [0.22, 1, 0.36, 1]

export const DURATION = {
  quick: 0.2,
  reveal: 0.9,
} as const

const reveal: Transition = { duration: DURATION.reveal, ease: EASE }

/** Fires once, a little before the element is fully in view. */
export const viewport = { once: true, margin: "-12%" } as const

/** Body copy and columns. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: reveal },
}

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: reveal },
}

/**
 * For the epoch numerals only. They travel further and settle slower
 * than body copy, so scale reads as weight. At body size the same
 * distance would read as a glitch.
 */
export const weighted: Variants = {
  hidden: { opacity: 0, y: 64 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.15, ease: EASE },
  },
}

/**
 * A plate unveiled downward, clipped flush to its own top edge.
 *
 * ── Why every value carries a unit ────────────────────────────────
 * These were written as `inset(0 0 100% 0)` → `inset(0 0 0% 0)`,
 * mixing unitless zeros with percentages. That is valid CSS, but it
 * is not reliably *interpolatable*: an animation between two
 * clip-path strings has to match component for component, and a bare
 * `0` against a `0%` can fail to resolve. When it fails the value
 * stays pinned at the `hidden` keyframe — `inset(0 0 100% 0)` — which
 * clips the element completely.
 *
 * The failure is silent and total. The element keeps its layout box,
 * the image behind it still returns 200, and the markup inspects
 * clean; it simply shows nothing. That is exactly how it was
 * reported: a blank space of the right size and shape.
 *
 * Percentages throughout, so both keyframes are the same shape.
 */
export const unveil: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.2, ease: EASE } },
}

/** The same unveiling drawn sideways, for plates that enter beside
 * their text rather than beneath it. Unit-consistent for the reason
 * given above. */
export const unveilSide: Variants = {
  hidden: { clipPath: "inset(0% 100% 0% 0%)" },
  visible: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.2, ease: EASE } },
}

/** Groups whose children should land one at a time. */
export const sequence: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
