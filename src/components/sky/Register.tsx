import type { ReactNode, Ref } from "react"
import { cn } from "@/lib/utils"

/**
 * A register is a band of the page at a given hour of the sunrise.
 *
 * It replaces the old section/container pair entirely. Three things
 * are deliberately different:
 *
 *  1. It paints no background. The sky is one gradient on <body>;
 *     registers are windows onto it. This is what makes the scroll
 *     continuous instead of a stack of panels.
 *  2. It declares a `tone` — the hour it sits at — and inherits the
 *     ink that hour can legibly carry. Text colour is a function of
 *     position on the page, not a per-component choice.
 *  3. Its height comes from a small set of named intents, and they
 *     are wildly unequal on purpose. A page whose bands all breathe
 *     identically reads as a template no matter what is inside them.
 */

const TONE = {
  night: "tone-night",
  dawn: "tone-dawn",
  morning: "tone-morning",
  day: "tone-day",
} as const

const HEIGHT = {
  /** Fills the viewport — for the opening only. Padding is tighter
   * than every other height because this band has to fit a stacked
   * composition inside one screen; at the standard rhythm the title
   * and its action fell below the fold on a laptop. */
  full: "min-h-[100svh] py-[var(--s-4)]",
  /** A room of its own: the archive, the calendar reveal. */
  vast: "py-[var(--s-8)]",
  /** The standard chapter. */
  open: "py-[var(--s-7)]",
  /** Follows hard on the band above rather than announcing itself. */
  close: "py-[var(--s-5)]",
} as const

interface RegisterProps {
  id?: string
  tone: keyof typeof TONE
  height?: keyof typeof HEIGHT
  /** Content spans the full viewport width, escaping the frame and
   * the rule channel. For the one or two things that *are* the page
   * rather than sitting on it. */
  bleed?: boolean
  /** For registers that drive scroll-linked motion from their own
   * position — the opening measures its progress this way. */
  ref?: Ref<HTMLElement>
  className?: string
  children: ReactNode
}

export function Register({
  id,
  tone,
  height = "open",
  bleed = false,
  ref,
  className,
  children,
}: RegisterProps) {
  return (
    <section
      id={id}
      ref={ref}
      className={cn("relative", TONE[tone], HEIGHT[height], className)}
    >
      {bleed ? (
        children
      ) : (
        <div
          className={cn(
            "mx-auto w-full max-w-[var(--frame)] px-[var(--gutter)]",
            // Content clears the rule's channel so the instrument's
            // measure is never written over — but only from `sm` up,
            // where the rule is actually shown. Reserving the channel
            // on a phone would spend up to 72px of the narrowest
            // screens on something that isn't rendered there.
            "sm:pl-[calc(var(--gutter)+var(--rule-channel))]"
          )}
        >
          {children}
        </div>
      )}
    </section>
  )
}

const MEASURE = {
  tight: "max-w-[var(--measure-tight)]",
  normal: "max-w-[var(--measure)]",
  wide: "max-w-[var(--measure-wide)]",
} as const

/**
 * A column set to be read. Widths are in characters rather than
 * pixels, because a measure's job is legibility at whatever size the
 * type happens to be.
 */
export function Measure({
  size = "normal",
  className,
  children,
}: {
  size?: keyof typeof MEASURE
  className?: string
  children: ReactNode
}) {
  return <div className={cn(MEASURE[size], className)}>{children}</div>
}
