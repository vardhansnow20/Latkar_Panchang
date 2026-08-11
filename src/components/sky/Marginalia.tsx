import { cn } from "@/lib/utils"

/**
 * Marginalia — the graha rule.
 *
 * ── The problem it solves ─────────────────────────────────────────
 * On a wide screen several registers put a single plate in the middle
 * of the frame and leave a third of the viewport empty on either
 * side. Centred content with dead margins is what makes a long page
 * read as a slide deck rather than as a printed object.
 *
 * ── Why these marks and not ornament ──────────────────────────────
 * A real almanac's margins are not empty either, and they are not
 * decorated: they carry the running heads and reference marks that
 * let you find your place. This is that.
 *
 * The marks are the nine grahas plus the three outer planets — Sun,
 * Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu, Uranus,
 * Neptune, Pluto — which are precisely the columns printed across the
 * ephemeris page this register displays: रवि, चंद्र, मंगळ, बुध, गुरु,
 * शुक्र, शनि, राहू, हर्षल, नेपच्यून, प्लुटो. Nothing is invented;
 * the margin repeats the plate's own index, in the plate's own
 * language, which is exactly what marginalia is for.
 *
 * ── Restraint ─────────────────────────────────────────────────────
 * Desktop only. The margins it fills do not exist below `lg` — on a
 * phone the content already spans the frame, and the same marks would
 * be the clutter this page was just cleared of. It is also drawn very
 * faint: a running head is found when looked for and ignored
 * otherwise.
 */

const GRAHA = [
  { glyph: "☉", name: "रवि" },
  { glyph: "☽", name: "चंद्र" },
  { glyph: "♂", name: "मंगळ" },
  { glyph: "☿", name: "बुध" },
  { glyph: "♃", name: "गुरु" },
  { glyph: "♀", name: "शुक्र" },
  { glyph: "♄", name: "शनि" },
  { glyph: "☊", name: "राहू" },
  { glyph: "♅", name: "हर्षल" },
  { glyph: "♆", name: "नेपच्यून" },
  { glyph: "♇", name: "प्लुटो" },
]

export function Marginalia({
  side = "left",
  className,
}: {
  side?: "left" | "right"
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        // The margins this occupies only exist at `lg` and above.
        "pointer-events-none absolute top-0 bottom-0 hidden select-none lg:flex",
        "flex-col items-center justify-center gap-[clamp(1rem,2.4vh,2rem)]",
        side === "left" ? "left-[var(--s-4)]" : "right-[var(--s-4)]",
        className
      )}
    >
      {/* The rule the marks hang from, fading at both ends so it
          reads as a continuing edge rather than a bounded object. */}
      <span
        className="absolute inset-y-0 w-px"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--hairline) 12%, var(--hairline) 88%, transparent)",
        }}
      />

      {GRAHA.map((g, i) => (
        <span key={g.name} className="relative flex flex-col items-center gap-[2px]">
          <span
            className="text-[0.8rem] leading-none text-[var(--metal)] opacity-45"
            // The display serif carries none of these glyphs.
            style={{ fontFamily: '"Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2", sans-serif' }}
          >
            {g.glyph}
          </span>
          <span
            className="text-[0.5rem] leading-none text-[var(--ink-faint)] opacity-55"
            style={{ fontFamily: "var(--font-devanagari)" }}
          >
            {g.name}
          </span>
          {/* A graduation mark between entries, as a printed rule has. */}
          {i < GRAHA.length - 1 && (
            <span className="mt-[2px] h-[3px] w-px bg-[var(--hairline)]" />
          )}
        </span>
      ))}
    </div>
  )
}
