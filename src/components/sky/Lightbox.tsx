import { useCallback, useEffect, useRef } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Full-bleed viewing for any artifact on the site.
 *
 * Lifted out of the Archive so the edition plates can open the *same*
 * dialog rather than a second copy of one. Behaviour is unchanged
 * from the Archive's original — a duplicated focus-trapping modal is
 * the kind of thing that drifts apart and leaves one of the two
 * subtly broken.
 *
 * Rendered by plain conditional mount, not through an exit-animation
 * wrapper: an earlier build of this site had a dialog that faded out
 * correctly but was never removed from the DOM, trapping focus behind
 * an invisible overlay. Standard reconciliation cannot fail that way,
 * and the only cost is that closing is instant.
 */

/** The minimum an artifact must provide to be shown full-screen.
 * Both archive photographs and edition pages normalise to this. */
export interface LightboxItem {
  id: string
  title: string
  /** Full-resolution source. */
  fullSrc: string | null
  alt: string
  designation?: string
  description?: string
}

export function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[]
  index: number | null
  onClose: () => void
  onNavigate: (i: number) => void
}) {
  const isOpen = index !== null
  const item = isOpen ? items[index] : null
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreTo = useRef<HTMLElement | null>(null)

  const go = useCallback(
    (step: number) => {
      if (index === null) return
      onNavigate((index + step + items.length) % items.length)
    },
    [index, onNavigate, items.length]
  )

  useEffect(() => {
    if (!isOpen) return
    restoreTo.current = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    document.addEventListener("keydown", onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
      restoreTo.current?.focus()
    }
  }, [isOpen, onClose, go])

  if (!isOpen || !item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      ref={panelRef}
      tabIndex={-1}
      className="tone-night fixed inset-0 z-50 flex flex-col bg-[#12172a]/97 p-[var(--gutter)] outline-none"
    >
      <div className="flex items-start justify-between gap-[var(--s-4)]">
        <div>
          <p className="text-title text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            {item.title}
          </p>
          {item.designation && <p className="tick mt-[var(--s-1)]">{item.designation}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-m-[var(--s-2)] p-[var(--s-2)] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
        >
          <X size={22} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center py-[var(--s-4)]">
        <img
          src={item.fullSrc ?? undefined}
          alt={item.alt}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="flex items-center justify-between gap-[var(--s-4)]">
        <p className="max-w-[52ch] text-note text-[var(--ink-soft)]">{item.description}</p>
        <div className="flex shrink-0 items-center gap-[var(--s-2)]">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous"
            className="-m-[var(--s-2)] p-[var(--s-2)] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <span className="tick tabular-nums">
            {(index ?? 0) + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next"
            className="-m-[var(--s-2)] p-[var(--s-2)] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
