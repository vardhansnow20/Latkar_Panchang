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

/** A plate unveiled downward, clipped flush to its own top edge. */
export const unveil: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: { clipPath: "inset(0 0 0% 0)", transition: { duration: 1.2, ease: EASE } },
}

/** The same unveiling drawn sideways, for plates that enter beside
 * their text rather than beneath it. */
export const unveilSide: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: { clipPath: "inset(0 0% 0 0)", transition: { duration: 1.2, ease: EASE } },
}

/** Groups whose children should land one at a time. */
export const sequence: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
