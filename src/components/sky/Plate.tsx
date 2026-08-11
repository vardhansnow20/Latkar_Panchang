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
  /** Hang the piece at a common height, letting the mount board make
   * up the difference — which is how a wall of differently-proportioned
   * pieces is actually framed. The image is contained rather than
   * cropped, because an archival scan must never lose its edges. */
  maxHeight?: string
  className?: string
}

const MOUNT = {
  none: "",
  thin: "plate p-[var(--s-2)]",
  deep: "plate p-[var(--s-3)] sm:p-[var(--s-4)]",
} as const

/**
 * The mount for a piece that has not arrived yet.
 *
 * This was the single worst thing on the page: a flat beige rectangle
 * with a line of caption text floating in it, appearing seven times.
 * It read as a broken image, and no amount of depth elsewhere could
 * outweigh that.
 *
 * It is now what a conservator actually leaves in the frame — a
 * laid-paper interleave with an engraved rosette at its centre,
 * registration marks at the corners where the piece will be aligned,
 * and the description set as a proper label between rules. Honest
 * about being empty, and designed rather than defaulted.
 */
function AwaitingPlate({ label }: { label: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-[var(--s-4)] py-[var(--s-3)]">
      {/* Laid paper — the fine parallel chain-lines of a hand-made
          sheet, at a weight you feel rather than read. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(120,96,58,0.07) 0 1px, transparent 1px 7px), repeating-linear-gradient(0deg, rgba(120,96,58,0.04) 0 1px, transparent 1px 26px)",
        }}
      />

      {/* The engraved rosette a blank plate carries at its centre. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute h-[62%] max-h-[11rem] w-auto text-[var(--color-brass)] opacity-[0.16]"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.7">
          <circle cx="100" cy="100" r="72" />
          <circle cx="100" cy="100" r="54" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="21" />
          {Array.from({ length: 24 }, (_, i) => {
            const a = ((i * 360) / 24 - 90) * (Math.PI / 180)
            const long = i % 3 === 0
            return (
              <line
                key={i}
                x1={100 + 54 * Math.cos(a)}
                y1={100 + 54 * Math.sin(a)}
                x2={100 + (long ? 72 : 64) * Math.cos(a)}
                y2={100 + (long ? 72 : 64) * Math.sin(a)}
                strokeWidth={long ? 0.8 : 0.4}
              />
            )
          })}
        </g>
      </svg>

      {/* Registration marks — where the piece will be squared up. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-[var(--s-3)]">
        {[
          "top-0 left-0 border-t border-l",
          "top-0 right-0 border-t border-r",
          "bottom-0 left-0 border-b border-l",
          "bottom-0 right-0 border-b border-r",
        ].map((pos) => (
          <span
            key={pos}
            className={cn("absolute size-3 border-[var(--color-brass)]/40", pos)}
          />
        ))}
      </span>

      {/* The label, between rules, as a conservator's slip is set. */}
      <span className="relative flex max-w-[34ch] flex-col items-center gap-[var(--s-2)] text-center">
        <span className="h-px w-8 bg-[var(--color-brass)]/45" />
        {/* Set without `.tick`, deliberately. That class carries
            `color: var(--color-brass)`, and brass on the light
            interleave measures 2.75:1 — the label was decoration
            pretending to be text. Same voice, ink that can be read. */}
        <span
          className="font-[family-name:var(--font-mono)] text-[0.6875rem] leading-[1.7] tracking-[var(--tracking-widest)] text-[var(--color-ink-muted)] uppercase"
        >
          {label}
        </span>
        <span className="h-px w-8 bg-[var(--color-brass)]/45" />
      </span>
    </div>
  )
}

export function Plate({
  image,
  glazed = false,
  interactive = false,
  mount = "thin",
  maxHeight,
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
          glazed && "glass",
          // An empty mount is a note that a piece is missing, not an
          // exhibit. Left at full aspect, a landscape page awaiting
          // photography became a blank field most of a screen tall and
          // read as a broken layout. The cap goes on the box that
          // carries the aspect ratio — capping an inner child does
          // nothing, since the ratio still sets this element's height.
          // An awaiting plate is designed, not broken — but it still
          // must not swallow a screen. Held to a third of the viewport.
          !src && "max-h-[24svh]",
          !src && "bg-[color-mix(in_srgb,var(--color-paper-raised)_92%,var(--color-brass))]"
        )}
        style={{ aspectRatio, maxHeight }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={cn(
              "h-full w-full transition-opacity duration-[var(--t-reveal)] ease-[var(--ease)]",
              maxHeight ? "object-contain" : "object-cover",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        ) : (
          <AwaitingPlate label={alt} />
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
