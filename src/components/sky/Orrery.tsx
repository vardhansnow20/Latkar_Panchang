import { cn } from "@/lib/utils"

/**
 * The zodiac orrery — the hero's single celestial object.
 *
 * ── Why this replaced the astrolabe ───────────────────────────────
 * The previous hero carried a full astrolabe: several concentric
 * graduated rings, a rete, alidade and degree scales, all turning
 * against one another. It was accurate to the instrument and almost
 * illegible at hero scale — the client's note was simply that it
 * "looks very complicated", which was fair. Detail that cannot be
 * read at a glance is noise, however faithfully it is drawn.
 *
 * The references the client supplied all resolve to the same three
 * elements and nothing more: a luminous centre, one ring of twelve
 * signs, and a few planets on open orbits. That is what this draws.
 * Roughly a fifth of the geometry, and it reads instantly.
 *
 * ── On the twelve signs ───────────────────────────────────────────
 * These are the rāśi, which map one-to-one onto the familiar zodiac
 * glyphs, so the symbols are both correct for a Hindu almanac and
 * immediately legible to a reader who has never seen one. They are
 * Unicode rather than drawn paths, with a fallback stack carrying
 * symbol coverage declared on the text elements — the display serif
 * has none of these glyphs. The figure itself is decorative: the
 * hero says what a Panchang is in words directly over it, so there
 * is nothing here for a screen reader to gain.
 *
 * ── Motion ────────────────────────────────────────────────────────
 * Every animation is a transform on a group, so the whole thing
 * composites on one layer and costs nothing while the page scrolls.
 * Periods are deliberately co-prime-ish and very slow: the ring takes
 * five minutes to come round, so it reads as *alive* rather than as
 * spinning. `prefers-reduced-motion` is handled globally in
 * globals.css, which flattens every animation on the page.
 */

/** Polar helper. 0° is noon, angles run clockwise, like a dial. */
function at(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

/** A group that turns about the drawing's centre.
 *
 * `transformBox: view-box` is not optional here: without it an SVG
 * group's transform-origin resolves against its own tight bounding
 * box, so each ring would spin about its own contents instead of the
 * common centre — which is precisely the bug that made the previous
 * instrument's plates wobble apart. */
const spin = (seconds: number, reverse = false): React.CSSProperties => ({
  transformBox: "view-box",
  transformOrigin: "center",
  animationDirection: reverse ? "reverse" : "normal",
  ["--turn-dur" as string]: `${seconds}s`,
})

const SIGNS = [
  { glyph: "♈", name: "Mesha (Aries)" },
  { glyph: "♉", name: "Vrishabha (Taurus)" },
  { glyph: "♊", name: "Mithuna (Gemini)" },
  { glyph: "♋", name: "Karka (Cancer)" },
  { glyph: "♌", name: "Simha (Leo)" },
  { glyph: "♍", name: "Kanya (Virgo)" },
  { glyph: "♎", name: "Tula (Libra)" },
  { glyph: "♏", name: "Vrischika (Scorpio)" },
  { glyph: "♐", name: "Dhanu (Sagittarius)" },
  { glyph: "♑", name: "Makara (Capricorn)" },
  { glyph: "♒", name: "Kumbha (Aquarius)" },
  { glyph: "♓", name: "Meena (Pisces)" },
]

/** Orbits, outermost first: radius, period, and the planet's size. */
const ORBITS = [
  { r: 118, period: 96, size: 4.5, phase: 24 },
  { r: 92, period: 148, size: 3, phase: 210 },
  { r: 64, period: 61, size: 3.6, phase: 118 },
]

const C = 200

export function Orrery({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      // Decorative. The hero states what a Panchang is in words
      // directly over this; announcing the drawing as well would only
      // add noise to a screen reader. Its wrapper is aria-hidden too.
      aria-hidden="true"
      focusable="false"
      className={cn("overflow-visible", className)}
    >
      <defs>
        {/* The lit centre. Painted as light rather than as a disc, so
            the headline sits *inside* the glow instead of on top of a
            bright circle it has to fight. */}
        <radialGradient id="orrery-core">
          <stop offset="0%" stopColor="var(--color-brass-soft)" stopOpacity="0.62" />
          <stop offset="34%" stopColor="var(--color-brass)" stopOpacity="0.22" />
          <stop offset="70%" stopColor="var(--color-brass)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--color-brass)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g stroke="currentColor">
        {/* ── The lit centre ──────────────────────────────────────── */}
        <circle
          className="breathe"
          cx={C}
          cy={C}
          r="86"
          fill="url(#orrery-core)"
          stroke="none"
          style={{ transformBox: "view-box", transformOrigin: "center" }}
        />

        {/* ── The open orbits ─────────────────────────────────────── */}
        {ORBITS.map((o) => (
          <circle
            key={`path-${o.r}`}
            cx={C}
            cy={C}
            r={o.r}
            strokeWidth="0.6"
            opacity="0.5"
            fill="none"
          />
        ))}

        {/* ── The planets ─────────────────────────────────────────── */}
        {ORBITS.map((o) => {
          const p = at(C, C, o.r, o.phase)
          return (
            <g key={`planet-${o.r}`} className="turning" style={spin(o.period)}>
              {/* A held halo, so a planet reads as lit rather than as
                  a dot punched out of the sky. */}
              <circle cx={p.x} cy={p.y} r={o.size * 2.6} fill="currentColor" opacity="0.1" stroke="none" />
              <circle cx={p.x} cy={p.y} r={o.size} fill="currentColor" stroke="none" opacity="0.85" />
            </g>
          )
        })}

        {/* ── The zodiac band ─────────────────────────────────────── */}
        <g className="turning" style={spin(300)}>
          <circle cx={C} cy={C} r="150" strokeWidth="0.8" opacity="0.55" fill="none" />
          <circle cx={C} cy={C} r="176" strokeWidth="0.8" opacity="0.55" fill="none" />

          {SIGNS.map((sign, i) => {
            const deg = i * 30
            // The division between this house and the next.
            const a = at(C, C, 150, deg)
            const b = at(C, C, 176, deg)
            const seat = at(C, C, 163, deg + 15)
            return (
              <g key={sign.name}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth="0.6" opacity="0.4" />
                <text
                  x={seat.x}
                  y={seat.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  stroke="none"
                  fill="currentColor"
                  opacity="0.75"
                  fontSize="13"
                  // A stack with symbol coverage on every platform;
                  // the display serif has none of these glyphs.
                  fontFamily='"Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2", sans-serif'
                >
                  {sign.glyph}
                </text>
              </g>
            )
          })}
        </g>

        {/* ── The outermost graduation ────────────────────────────
            One fine ring of degree marks, turning against the band so
            the whole figure never reads as a single rigid object. */}
        <g className="turning" style={spin(420, true)} opacity="0.4">
          <circle cx={C} cy={C} r="192" strokeWidth="0.5" fill="none" opacity="0.5" />
          {Array.from({ length: 72 }, (_, i) => {
            const deg = i * 5
            const long = i % 6 === 0
            const a = at(C, C, 192, deg)
            const b = at(C, C, long ? 183 : 187.5, deg)
            return (
              <line
                key={deg}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={long ? 0.8 : 0.4}
                opacity={long ? 0.9 : 0.5}
              />
            )
          })}
        </g>
      </g>
    </svg>
  )
}
