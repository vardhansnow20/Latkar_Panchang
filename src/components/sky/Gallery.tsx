import { Children, useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * A gallery wall.
 *
 * ── Why this exists ───────────────────────────────────────────────
 * The page was stacking every plate vertically, and that one decision
 * accounted for most of its length: the Archive spent 8.3 screens on
 * eleven pieces, and Contents spent three screens on seven. Measured
 * against the reference the client supplied, a rail carrying
 * seventeen items occupied 257px — the same seventeen pieces stacked
 * here would have run to eight screens. Density is not a detail of
 * that reference; it *is* the experience.
 *
 * It is also the more faithful arrangement. A visitor walks a museum
 * wall sideways, moving along a run of pieces at a fixed height. A
 * vertical column of plates is a contact sheet, not a wall.
 *
 * ── Behaviour ─────────────────────────────────────────────────────
 * Native scroll-snap does the work: no drag library, no transform
 * carousel, no state per frame. That keeps it keyboard-scrollable and
 * screen-reader navigable for free, and it costs nothing on the main
 * thread while the page is moving.
 *
 * On mobile it is not a rail at all. The client asked explicitly for
 * no horizontal pan or drag inside the page on small screens, so the
 * same children lay out as a compact two-column grid — which is
 * dense for the same reason and gives up nothing.
 */

interface GalleryProps {
  children: React.ReactNode
  /** Announced to assistive technology, e.g. "Publication ceremonies". */
  label: string
  /** Rail item width from `sm` up. Pieces keep their own aspect. */
  itemWidth?: string
  /** Pull each piece slightly over its neighbour, so a run reads as
   * objects laid on a wall rather than columns of equal width. */
  overlap?: boolean
  className?: string
}

export function Gallery({
  children,
  label,
  itemWidth = "clamp(13rem, 22vw, 18rem)",
  overlap = false,
  className,
}: GalleryProps) {
  const rail = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [progress, setProgress] = useState(0)

  const items = Children.toArray(children)

  const measure = useCallback(() => {
    const el = rail.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft >= max - 2)
    setProgress(max > 0 ? el.scrollLeft / max : 0)
  }, [])

  useEffect(() => {
    const el = rail.current
    if (!el) return
    measure()
    // Passive: this listener must never be able to delay a scroll.
    el.addEventListener("scroll", measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", measure)
      ro.disconnect()
    }
  }, [measure])

  const step = (dir: 1 | -1) => {
    const el = rail.current
    if (!el) return
    const first = el.firstElementChild as HTMLElement | null
    const by = first ? first.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollBy({ left: by * dir, behavior: reduced ? "auto" : "smooth" })
  }

  // A single piece is not a wall — render it plainly.
  const single = items.length < 2

  return (
    <div className={cn("relative", className)}>
      <div
        ref={rail}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          // Two columns on mobile — but never for a lone piece, which
          // would otherwise be pinned to half the screen width with
          // an empty cell beside it. Several Archive rooms hold one
          // object, and on a phone that is the whole wall.
          "grid gap-[var(--s-4)] pt-[var(--s-2)]",
          single ? "grid-cols-1" : "grid-cols-2",
          // From `sm` the same children become the wall.
          "sm:flex sm:gap-[var(--s-5)] sm:overflow-x-auto sm:overflow-y-hidden",
          // Vertical padding on both edges: a rail clips its own
          // overflow, and every plate's pin stands proud of its top.
          "sm:snap-x sm:snap-mandatory sm:pt-[var(--s-3)] sm:pb-[var(--s-3)]",
          // The scrollbar is replaced by the brass rule below.
          "sm:[-ms-overflow-style:none] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden",
          single && "sm:justify-start"
        )}
      >
        {items.map((child, i) => (
          <div
            key={i}
            className={cn(
              "min-w-0 sm:shrink-0 sm:snap-start",
              overlap && i > 0 && "sm:-ml-[var(--s-4)]",
              // Alternate pieces sit a little low, so the run has the
              // uneven baseline of a hung wall rather than a shelf.
              i % 2 === 1 && "sm:mt-[var(--s-4)]"
            )}
            style={{ ["--w" as string]: itemWidth }}
          >
            <div className="sm:w-[var(--w)]">{child}</div>
          </div>
        ))}
      </div>

      {/* The rule, and the controls. Hidden entirely when there is
          nothing to travel — a dead arrow is worse than no arrow. */}
      {!single && (
        <div className="mt-[var(--s-3)] hidden items-center gap-[var(--s-4)] sm:flex">
          <div className="relative h-px flex-1 bg-[var(--hairline)]">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 bg-[var(--metal)] transition-[width,left] duration-[var(--t-quick)]"
              style={{ width: `${Math.max(12, 100 / items.length)}%`, left: `${progress * (100 - Math.max(12, 100 / items.length))}%` }}
            />
          </div>
          <div className="flex shrink-0 gap-[var(--s-2)]">
            <RailButton dir="left" onClick={() => step(-1)} disabled={atStart} />
            <RailButton dir="right" onClick={() => step(1)} disabled={atEnd} />
          </div>
        </div>
      )}
    </div>
  )
}

function RailButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "left" | "right"
  onClick: () => void
  disabled: boolean
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Previous pieces" : "Next pieces"}
      className={cn(
        "flex size-8 items-center justify-center rounded-full border border-[var(--hairline)]",
        "text-[var(--metal)] transition-[opacity,border-color,background-color] duration-[var(--t-quick)]",
        disabled
          ? "cursor-default opacity-25"
          : "hover:border-[var(--metal)] hover:bg-[color-mix(in_srgb,var(--metal)_10%,transparent)]"
      )}
    >
      <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
    </button>
  )
}
