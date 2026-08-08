import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ImageAsset } from "@/types/content"

/**
 * Every photograph and document on the page is a plate — a piece
 * mounted in an instrument, not an image in a card. Board, a
 * bevel-cut window, and the shadow of something standing off its
 * backing. Under glass when the piece warrants it.
 *
 * This is the only image component on the site. Photographs of
 * people and scans of certificates get the same mount, because in a
 * collection they *are* the same kind of object: evidence.
 *
 * Aspect ratio always comes from the asset itself. The previous
 * build carried a set of crop classes that inline styles silently
 * overrode, so a dozen declared ratios were doing nothing; here the
 * source's true proportions are the only input, which is also the
 * correct treatment for archival material.
 */

interface PlateProps {
  image: ImageAsset
  /** Mount the plate under glass, with the room's light crossing it.
   * For documents and certificates — the pieces that would really be
   * framed. Applying it to everything would flatten the distinction. */
  glazed?: boolean
  /** Lift and brighten on pointer. Only for plates that open. */
  interactive?: boolean
  /** Board thickness. `none` gives a bare, unmounted image. */
  mount?: "none" | "thin" | "deep"
  className?: string
}

const MOUNT = {
  none: "",
  thin: "plate p-[var(--s-2)]",
  deep: "plate p-[var(--s-3)] sm:p-[var(--s-4)]",
} as const

export function Plate({
  image,
  glazed = false,
  interactive = false,
  mount = "thin",
  className,
}: PlateProps) {
  const [loaded, setLoaded] = useState(false)
  const { src, alt, aspectRatio } = image

  return (
    <div
      className={cn(
        "relative",
        MOUNT[mount],
        interactive &&
          "transition-[transform,box-shadow] duration-[var(--t-reveal)] ease-[var(--ease)] hover:-translate-y-1 hover:shadow-[var(--depth-lift)]",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-[var(--color-paper-sunk)]",
          mount !== "none" && "plate-window rounded-[var(--radius-edge)]",
          glazed && "glass"
        )}
        style={{ aspectRatio }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-[var(--t-reveal)] ease-[var(--ease)]",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        ) : (
          /* No stock stand-in, ever — an empty mount reads honestly as
             a piece not yet in the collection, and cannot be mistaken
             for a design decision. */
          <div className="flex h-full w-full items-center justify-center p-[var(--s-3)]">
            <span className="tick text-center text-[var(--color-ink-faint)]">{alt}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/** A museum label. Set apart from the plate it describes, the way a
 * label is mounted beside a piece rather than printed on it. */
export function PlateLabel({
  title,
  year,
  description,
  className,
}: {
  title: string
  year?: string
  description?: string
  className?: string
}) {
  return (
    <figcaption className={cn("border-t border-[var(--hairline)] pt-[var(--s-2)]", className)}>
      <span className="text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </span>
      {year && <span className="tick ml-[var(--s-2)]">{year}</span>}
      {description && (
        <p className="mt-[var(--s-1)] max-w-[46ch] text-note text-[var(--ink-soft)]">{description}</p>
      )}
    </figcaption>
  )
}
