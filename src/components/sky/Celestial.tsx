import { useId, useMemo } from "react"
import { cn } from "@/lib/utils"

/**
 * The celestial vocabulary.
 *
 * The rule this build is written under: a figure is only allowed on
 * the page if it is doing structural work — carrying a composition,
 * marking a position, or measuring something. Nothing here is placed
 * to fill a corner. Where a figure would only be ornament, there is
 * instead nothing, and the space is the point.
 *
 * All forms are stroke-only and inherit `currentColor`, so a figure
 * takes the ink of whatever hour of the sky it sits at.
 */

type FigureName = "wheel" | "orbits" | "chart" | "arc" | "yantra"

const VIEWBOX: Record<FigureName, string> = {
  wheel: "0 0 400 400",
  orbits: "0 0 500 500",
  chart: "0 0 600 400",
  arc: "0 0 600 300",
  yantra: "0 0 400 400",
}

function polar(angleDeg: number, radius: number, cx = 200, cy = 200) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)] as const
}

const FORMS: Record<FigureName, (id: string) => React.ReactNode> = {
  /** A rashi graticule: twelve houses, ringed and graduated. Drawn as
   * an instrument face — the spokes stop short of the centre so it
   * can never read as a pie chart. */
  wheel: () => (
    <g stroke="currentColor" fill="none">
      <circle cx="200" cy="200" r="192" strokeWidth="0.6" />
      <circle cx="200" cy="200" r="174" strokeWidth="0.4" />
      <circle cx="200" cy="200" r="118" strokeWidth="0.4" />
      <circle cx="200" cy="200" r="58" strokeWidth="0.6" />
      {Array.from({ length: 72 }, (_, i) => {
        const a = (i * 360) / 72
        const [x1, y1] = polar(a, 174)
        const [x2, y2] = polar(a, i % 6 === 0 ? 156 : 166)
        return <line key={`t${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.4" />
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 360) / 12
        const [x1, y1] = polar(a, 174)
        const [x2, y2] = polar(a, 58)
        return <line key={`h${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.4" />
      })}
    </g>
  ),

  /** Nested inclined orbits with bodies at different stations. */
  orbits: () => (
    <g stroke="currentColor" fill="none">
      <g strokeWidth="0.55">
        <ellipse cx="250" cy="250" rx="234" ry="88" transform="rotate(-19 250 250)" />
        <ellipse cx="250" cy="250" rx="182" ry="66" transform="rotate(-7 250 250)" />
        <ellipse cx="250" cy="250" rx="128" ry="47" transform="rotate(9 250 250)" />
        <ellipse cx="250" cy="250" rx="72" ry="27" transform="rotate(23 250 250)" />
      </g>
      <g fill="currentColor" stroke="none">
        <circle cx="472" cy="184" r="2.5" />
        <circle cx="74" cy="300" r="2" />
        <circle cx="366" cy="292" r="1.75" />
        <circle cx="188" cy="224" r="1.5" />
      </g>
    </g>
  ),

  /** A plate from a star atlas. The graticule curves the way a
   * projection of the sphere onto paper actually does — that is what
   * keeps it from reading as a plain grid. */
  chart: () => (
    <g stroke="currentColor" fill="none">
      <g strokeWidth="0.35">
        <path d="M18 58 Q300 18 582 58" />
        <path d="M18 138 Q300 106 582 138" />
        <path d="M18 218 Q300 198 582 218" />
        <path d="M18 298 Q300 290 582 298" />
        <path d="M58 18 Q38 200 58 382" />
        <path d="M178 18 Q168 200 178 382" />
        <path d="M300 18 Q300 200 300 382" />
        <path d="M422 18 Q432 200 422 382" />
        <path d="M542 18 Q562 200 542 382" />
      </g>
      <path d="M108 252 L188 180 L278 212 L348 118" strokeWidth="0.55" />
      <path d="M398 302 L470 240 L520 270" strokeWidth="0.55" />
      <g fill="currentColor" stroke="none">
        {[
          [108, 252, 1.8], [188, 180, 2.3], [278, 212, 1.5], [348, 118, 2],
          [398, 302, 1.8], [470, 240, 2], [520, 270, 1.5],
          [78, 88, 1], [240, 68, 1.25], [458, 98, 1], [560, 178, 1.25], [148, 340, 1],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} />
        ))}
      </g>
    </g>
  ),

  /** A single sweeping arc. Used as a compositional line that content
   * is hung along — the one figure that is pure geometry. */
  arc: () => (
    <g stroke="currentColor" fill="none">
      <path d="M0 280 Q300 -40 600 180" strokeWidth="0.6" />
      <path d="M0 296 Q300 -20 600 200" strokeWidth="0.35" strokeDasharray="2 9" />
      <g fill="currentColor" stroke="none">
        <circle cx="300" cy="120" r="2" />
        <circle cx="600" cy="180" r="2.5" />
      </g>
    </g>
  ),

  /** Overlapping circles — the geometry the calculations rest on. */
  yantra: () => {
    const r = 82
    const centres = [
      [200, 200] as const,
      ...Array.from({ length: 6 }, (_, i) => {
        const rad = (i * 60 * Math.PI) / 180
        return [200 + r * Math.cos(rad), 200 + r * Math.sin(rad)] as const
      }),
    ]
    return (
      <g stroke="currentColor" fill="none" strokeWidth="0.5">
        {centres.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} />
        ))}
        <circle cx="200" cy="200" r={r * 2} strokeWidth="0.65" />
      </g>
    )
  },
}

export function Figure({
  name,
  turning = false,
  opacity,
  className,
}: {
  name: FigureName
  /** Rotate, very slowly. Only meaningful on the radially symmetric
   * forms; on `chart` or `arc` it would read as a spinning graphic. */
  turning?: boolean
  /**
   * How present the figure is, 0–1. **Always set this rather than a
   * colour-opacity utility.**
   *
   * `text-[var(--color-brass)]/25` looks like it works and does not:
   * Tailwind cannot compose an opacity modifier onto an arbitrary
   * `var()` colour, because it has no channels to recompose, so it
   * silently drops the modifier and the figure renders at full
   * strength. Every celestial figure on this site was doing exactly
   * that — atmosphere authored at 8–45% painting at 100%, which is
   * why the compositions kept reading as cluttered.
   *
   * Applied as a real `opacity`, which composites the whole figure
   * and cannot be silently dropped.
   */
  opacity?: number
  className?: string
}) {
  const id = useId()
  return (
    <svg
      viewBox={VIEWBOX[name]}
      fill="none"
      aria-hidden="true"
      style={opacity === undefined ? undefined : { opacity }}
      className={cn(turning && "turning", className)}
    >
      {FORMS[name](id)}
    </svg>
  )
}

/**
 * A field of stars for the night and dawn registers. Positions and
 * timings are generated once and memoised, so the sky does not
 * rearrange itself on every render.
 */
export function StarField({ count = 40, className }: { count?: number; className?: string }) {
  const field = useMemo(() => {
    // A real field is mostly faint, small and white, with a scattering
    // of brighter and warmer bodies. Weighting the population this way
    // — rather than randomising every star equally — is what stops it
    // reading as evenly-spaced dots.
    const pick = () => {
      const r = Math.random()
      if (r < 0.62) return { tint: "rgba(246,241,228,0.9)", size: 0.8 + Math.random() * 0.7, glow: 0 }
      if (r < 0.84) return { tint: "rgba(255,252,244,1)", size: 1.5 + Math.random() * 1.1, glow: 2 }
      if (r < 0.94) return { tint: "rgba(226,190,124,1)", size: 1.8 + Math.random() * 1.4, glow: 5 }
      return { tint: "rgba(176,199,240,1)", size: 1.6 + Math.random() * 1.3, glow: 4 }
    }
    const all = Array.from({ length: count }, (_, i) => {
      const s = pick()
      return {
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        ...s,
        dur: 5 + s.size * 2 + Math.random() * 7,
        delay: Math.random() * 12,
        min: 0.06 + Math.random() * 0.16,
        max: 0.42 + Math.random() * 0.5,
      }
    })

    /**
     * Only a handful of stars actually animate.
     *
     * Every star used to be its own element running an infinite
     * animation, so a field of ninety-six meant ninety-six
     * independently animating nodes layered under a hero that is
     * itself transforming on scroll. The eye cannot track more than a
     * few twinkles at once; the rest is texture, and texture does not
     * need to be live.
     *
     * So the majority are baked into a single element as one stack of
     * radial gradients — painted once, never repainted, one layer —
     * and only a dozen remain as real nodes that breathe.
     */
    const live = all.slice(0, Math.min(12, count))
    const baked = all.slice(live.length)

    const paint = baked
      .map((s) => {
        const r = s.size / 2
        // The glow is baked into the gradient's falloff rather than
        // carried as a box-shadow, which cannot be painted once.
        const halo = s.glow ? r + s.glow : r + 0.5
        return `radial-gradient(circle at ${s.left.toFixed(2)}% ${s.top.toFixed(2)}%, ${s.tint} 0, ${s.tint} ${r.toFixed(2)}px, ${s.tint.replace(/[\d.]+\)$/, "0.18)")} ${(r + 0.6).toFixed(2)}px, transparent ${halo.toFixed(2)}px)`
      })
      .join(", ")

    return { live, paint }
  }, [count])

  return (
    // Clipped to its own box: a star placed at left:99.6% is a few
    // pixels wide and lands past the edge, which is enough to give the
    // document a hairline of horizontal overflow in any section that
    // is not itself clipping. Containing it here fixes that everywhere
    // at once, and is safe — this box never wraps a sticky element.
    <div className={cn("pointer-events-none overflow-hidden", className)} aria-hidden="true">
      {/* The static field: one element, one paint, no animation. */}
      {field.paint && (
        <div className="absolute inset-0" style={{ backgroundImage: field.paint }} />
      )}

      {/* The few that live. */}
      {field.live.map((s) => (
        <span
          key={s.id}
          className="star absolute rounded-full"
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              backgroundColor: s.tint,
              boxShadow: s.glow ? `0 0 ${s.glow}px ${s.glow / 2}px ${s.tint}` : undefined,
              "--star-dur": `${s.dur}s`,
              "--star-delay": `${s.delay}s`,
              "--star-min": s.min,
              "--star-max": s.max,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function ShootingStars({ className }: { className?: string }) {
  const streaks = [
    { top: "14%", left: "8%", dur: 34, delay: 6, len: 190, angle: 24 },
    { top: "31%", left: "52%", dur: 47, delay: 23, len: 150, angle: 18 },
  ]
  return (
    <div className={cn("pointer-events-none overflow-hidden", className)} aria-hidden="true">
      {streaks.map((s, i) => (
        <span
          key={i}
          className="shoot absolute block h-px origin-left"
          style={
            {
              top: s.top,
              left: s.left,
              width: s.len,
              background:
                "linear-gradient(90deg, rgba(255,252,244,0) 0%, rgba(255,252,244,0.95) 62%, rgba(226,190,124,1) 100%)",
              // Angle travels as a custom property, not as an inline
              // transform: the keyframes own `transform` outright, so
              // an inline one would simply be overwritten.
              "--shoot-angle": `${s.angle}deg`,
              "--shoot-dur": `${s.dur}s`,
              "--shoot-delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

/**
 * Dust in the near field.
 *
 * Distinct from `StarField` and doing a different job: stars are
 * fixed points far away, motes are larger, softer, and drift. Having
 * one layer that moves on its own is what stops the foreground from
 * reading as flat, and it is the cheapest depth cue available —
 * transform and opacity only, no scroll listener.
 */
export function MoteField({ count = 18, className }: { count?: number; className?: string }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: 20 + Math.random() * 80,
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 3.5,
        dur: 22 + Math.random() * 26,
        delay: -Math.random() * 40,
        x: (Math.random() - 0.5) * 140,
        y: -(90 + Math.random() * 220),
        opacity: 0.18 + Math.random() * 0.4,
      })),
    [count]
  )

  return (
    // Clipped for the same reason as StarField, and more so: motes
    // drift outward on a transform and would otherwise travel past
    // the viewport edge.
    <div className={cn("pointer-events-none overflow-hidden", className)} aria-hidden="true">
      {motes.map((m) => (
        <span
          key={m.id}
          className="mote absolute rounded-full"
          style={
            {
              top: `${m.top}%`,
              left: `${m.left}%`,
              width: m.size,
              height: m.size,
              background:
                "radial-gradient(circle, rgba(240,228,198,0.95) 0%, rgba(217,201,163,0.35) 45%, transparent 72%)",
              "--mote-dur": `${m.dur}s`,
              "--mote-delay": `${m.delay}s`,
              "--mote-x": `${m.x}px`,
              "--mote-y": `${m.y}px`,
              "--mote-opacity": m.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

/**
 * A brass astrolabe, drawn as an instrument that has been used.
 *
 * This replaces the perfect zodiac wheel as the hero's central
 * object. A mechanically perfect circle reads as a vector graphic no
 * matter how large it is; what makes an antique instrument beautiful
 * is that it is *almost* regular — rings of unequal weight, arcs that
 * stop short, plates slightly out of true with one another, and
 * engraved annotation crowding the rim.
 *
 * So nothing here shares a stroke width, several rings are broken or
 * dashed, two are deliberately off-centre by a degree or two, and the
 * graduations are drawn with alternating weights rather than a single
 * repeated tick. The irregularity is the point.
 *
 * Parts, from the outside in: the limb with its degree scale, the
 * throne, the rete with star pointers, the ecliptic ring set at its
 * proper inclination, the tympan's almucantar arcs, and the alidade
 * lying across the whole face.
 */
export function Astrolabe({ className }: { className?: string }) {
  const id = useId()
  const C = 300

  /**
   * Each plate turns on its own.
   *
   * A single rigid rotation is what made this read as static: the eye
   * has no internal reference to measure it against, so a whole disc
   * turning at one rate looks like a still image. Differential rates
   * — and two plates running counter to the rest — give the movement
   * something to be relative to, and that is what registers as alive
   * without ever becoming noticeable.
   *
   * `view-box` transform-box is required: without it a <g> rotates
   * about its own bounding box, and every ring would wobble around a
   * different centre.
   */
  const turn = (seconds: number, reverse = false): React.CSSProperties => ({
    transformBox: "view-box",
    transformOrigin: `${C}px ${C}px`,
    animation: `turn ${seconds}s linear infinite${reverse ? " reverse" : ""}`,
  })

  // Star pointers on the rete — irregular, as a real rete's are.
  const pointers: Array<[number, number]> = [
    [18, 232], [62, 196], [108, 246], [151, 205],
    [196, 238], [241, 190], [286, 228], [330, 244],
  ]

  return (
    <svg viewBox="0 0 600 600" fill="none" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id={`${id}-brass`} cx="38%" cy="32%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.06" />
        </radialGradient>
      </defs>

      {/* The limb — the heaviest ring, and the only filled one, so the
          instrument reads as a physical disc rather than an outline. */}
      <circle cx={C} cy={C} r="282" fill={`url(#${id}-brass)`} opacity="0.5" />
      <circle cx={C} cy={C} r="282" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
      <circle cx={C} cy={C} r="270" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      {/* Slightly off-centre, as a struck plate would be. */}
      <circle cx={C + 2} cy={C - 1} r="248" stroke="currentColor" strokeWidth="1.1" opacity="0.75" />

      {/* Degree scale on the limb: alternating weights, and a heavier
          mark every thirty degrees where a real limb is numbered.
          Turns slowest of everything that moves. */}
      <g stroke="currentColor" style={turn(240)}>
        {Array.from({ length: 120 }, (_, i) => {
          const a = (i * 360) / 120
          const major = i % 10 === 0
          const mid = i % 5 === 0
          const [x1, y1] = polar(a, 270, C, C)
          const [x2, y2] = polar(a, major ? 249 : mid ? 258 : 263, C, C)
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              strokeWidth={major ? 1.3 : mid ? 0.7 : 0.4}
              opacity={major ? 0.95 : mid ? 0.6 : 0.4}
            />
          )
        })}
      </g>

      {/* The throne, by which the instrument hangs. */}
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.85">
        <path d="M283 18 L283 40 Q300 52 317 40 L317 18" />
        <circle cx={C} cy="12" r="9" strokeWidth="1.1" />
      </g>

      {/* Almucantars — arcs of equal altitude. Struck from a centre
          above the plate's, which is why they crowd toward the top. */}
      <g stroke="currentColor" strokeWidth="0.55" opacity="0.45">
        {[46, 82, 118, 152, 184, 212].map((r, i) => (
          <circle key={i} cx={C} cy={C - 74 + i * 9} r={r} />
        ))}
      </g>

      {/* The ecliptic, off-axis by its proper inclination. Counter-
          rotating: on a real instrument the ecliptic ring and the rete
          move against the plate, and running them opposite ways is
          what stops the whole face reading as one turning disc.
          The inclination lives on an inner group so the CSS rotation
          on the outer one cannot overwrite the transform attribute. */}
      <g style={turn(190, true)}>
        <g transform={`rotate(-23.4 ${C} ${C})`}>
          <ellipse cx={C} cy={C} rx="196" ry="196" stroke="currentColor" strokeWidth="1.2" opacity="0.8"
            transform={`translate(0 -46)`} />
          <ellipse cx={C} cy={C} rx="182" ry="182" stroke="currentColor" strokeWidth="0.45" opacity="0.5"
            transform={`translate(0 -46)`} strokeDasharray="3 6" />
        </g>
      </g>

      {/* Rete and its star pointers turn together, as one cut plate. */}
      <g style={turn(210)}>
        <g stroke="currentColor" opacity="0.8">
          <path d="M300 66 A234 234 0 0 1 512 246" strokeWidth="1.15" />
          <path d="M88 246 A234 234 0 0 1 246 72" strokeWidth="0.8" />
          <path d="M120 420 A234 234 0 0 0 300 534" strokeWidth="1.05" />
          <path d="M356 526 A234 234 0 0 0 504 372" strokeWidth="0.6" strokeDasharray="7 5" />
        </g>
        <g opacity="0.95">
          {pointers.map(([x, y], i) => (
            <path
              key={i}
              d={`M${x} ${y} l6 -10 l6 10 l-6 5 z`}
              fill="currentColor"
              opacity={i % 3 === 0 ? 0.9 : 0.55}
            />
          ))}
        </g>
      </g>

      {/* Bodies at their stations, each on its own orbit and period —
          the only elements whose movement is meant to be legible if
          the reader actually stops and watches. */}
      {[
        { r: 150, dur: 96, size: 2.4, op: 0.9 },
        { r: 196, dur: 148, size: 1.8, op: 0.75 },
        { r: 232, dur: 118, size: 3, op: 0.85 },
        { r: 262, dur: 176, size: 2, op: 0.6 },
      ].map((m, i) => (
        <g key={i} style={turn(m.dur, i % 2 === 1)}>
          <circle cx={C} cy={C - m.r} r={m.size} fill="currentColor" opacity={m.op} />
        </g>
      ))}

      {/* Golden annotation, crowded at the rim the way engraving is. */}
      <g stroke="currentColor" strokeWidth="0.5" opacity="0.55" style={turn(300, true)}>
        <path d="M148 148 L192 192" />
        <path d="M452 148 L408 192" />
        <path d="M148 452 L192 408" />
        <circle cx="192" cy="192" r="3" />
        <circle cx="408" cy="192" r="2" />
        <circle cx="192" cy="408" r="2.5" />
      </g>

      {/* The alidade, sighted slowly across the face. Slowest of all,
          because it is the part a hand would move. */}
      <g style={turn(340)} opacity="0.9">
        <g transform={`rotate(-31 ${C} ${C})`}>
          <path d="M84 300 L516 300" stroke="currentColor" strokeWidth="2.1" />
          <path d="M84 294 L516 294" stroke="currentColor" strokeWidth="0.4" opacity="0.55" />
          <rect x="96" y="286" width="16" height="28" stroke="currentColor" strokeWidth="1" />
          <rect x="488" y="286" width="16" height="28" stroke="currentColor" strokeWidth="1" />
        </g>
      </g>

      {/* The twelve rashis, numbered in Devanagari around the limb.
       *
       * Numerals rather than Western zodiac glyphs: this is a Marathi
       * almanac, and १–१२ is how its own houses are written. Each is
       * counter-rotated by its own angle so every numeral stays
       * upright as the ring carries it round — an engraved scale
       * reads horizontally at every station, it does not tumble. */}
      <g style={turn(240)} fill="currentColor" opacity="0.8">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 360) / 12
          const [x, y] = polar(a, 231, C, C)
          const numeral = ["१", "२", "३", "४", "५", "६", "७", "८", "९", "१०", "११", "१२"][i]
          return (
            <text
              key={i}
              x={x}
              y={y}
              transform={`rotate(${-a} ${x} ${y})`}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fontFamily: "var(--font-devanagari)", fontSize: 17 }}
            >
              {numeral}
            </text>
          )
        })}
      </g>

      {/* The pin at the centre. */}
      <circle cx={C} cy={C} r="9" fill="currentColor" opacity="0.75" />
      <circle cx={C} cy={C} r="16" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
    </svg>
  )
}

/**
 * A network of stars that wires itself together — lines travelling
 * point to point, each node landing as the line reaches it.
 *
 * Built as one connected figure rather than a scatter, because a
 * scatter is texture and a network is a subject. It is the focal
 * layer of the opening, so unlike everything else in this file it is
 * allowed to be plainly visible.
 *
 * Timing is CSS, not JS: the whole thing runs on `pathLength="1"`
 * dash animation, so it plays identically regardless of frame
 * scheduling, and stops dead under reduced motion via the global
 * rule.
 */
export function ConstellationNetwork({ className }: { className?: string }) {
  // A deliberate figure — a long spine with two branches, so it reads
  // as a charted constellation rather than random joins.
  const nodes: Array<[number, number, number]> = [
    [60, 300, 2.2], [170, 244, 3], [286, 268, 2], [392, 190, 3.4],
    [512, 214, 2.2], [614, 132, 2.8], [726, 158, 2], [828, 86, 3.2],
    [318, 380, 2], [470, 348, 2.4], [648, 300, 2.2],
  ]
  const spine = "M60 300 L170 244 L286 268 L392 190 L512 214 L614 132 L726 158 L828 86"
  const branchA = "M286 268 L318 380 L470 348"
  const branchB = "M512 214 L648 300 L470 348"

  return (
    <svg viewBox="0 0 900 440" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d={spine} pathLength="1" className="draw-line" style={{ "--draw-dur": "2.8s" } as React.CSSProperties} />
        <path d={branchA} pathLength="1" className="draw-line" style={{ "--draw-dur": "1.6s", "--draw-delay": "1.4s" } as React.CSSProperties} />
        <path d={branchB} pathLength="1" className="draw-line" style={{ "--draw-dur": "1.6s", "--draw-delay": "2s" } as React.CSSProperties} />
      </g>
      <g fill="currentColor">
        {nodes.map(([cx, cy, r], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            className="arrive"
            style={{ "--arrive-delay": `${0.25 + i * 0.22}s` } as React.CSSProperties}
          />
        ))}
      </g>
    </svg>
  )
}

/**
 * The opening's centre of gravity: a lit disc with the terminator
 * crossing it over a slow lunation, sitting in its own gold light.
 *
 * The phase here is animated in CSS rather than computed, because
 * this moon is a focal object, not a readout — the moon that
 * actually reports something is the one on the degree rule, and that
 * one is driven by real scroll position.
 */
export function MoonDisc({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)} aria-hidden="true">
      {/* Gold light, breathing, in four falloffs.
       *
       * The outermost two use `plus-lighter`, which means they ADD to
       * whatever is behind them rather than sitting on top of it — so
       * the astrolabe's lines genuinely brighten where they pass near
       * the moon, instead of being covered by a translucent disc.
       * That is the difference between a body casting light and a
       * sticker with a gradient behind it. */}
      <div
        className="breathe absolute -inset-[140%] rounded-full mix-blend-plus-lighter"
        style={{
          background:
            "radial-gradient(circle, rgba(176,141,87,0.20) 0%, rgba(176,141,87,0.09) 30%, rgba(140,112,70,0.03) 52%, transparent 70%)",
          animationDelay: "-7s",
        }}
      />
      <div
        className="breathe absolute -inset-[70%] rounded-full mix-blend-plus-lighter"
        style={{
          background:
            "radial-gradient(circle, rgba(233,214,170,0.30) 0%, rgba(176,141,87,0.15) 34%, rgba(176,141,87,0.04) 56%, transparent 72%)",
        }}
      />
      {/* Light rays. Not a starburst: a small number of long, uneven,
          very faint wedges, which is how light actually breaks around
          a bright body seen through atmosphere. They turn far more
          slowly than anything else on the page. */}
      <div
        className="turning absolute -inset-[110%]"
        style={{ ["--turn-dur" as string]: "300s" }}
        aria-hidden="true"
      >
        {[0, 47, 96, 138, 190, 232, 284, 318].map((deg, i) => (
          <span
            key={deg}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              width: `${28 + (i % 3) * 13}%`,
              height: i % 2 === 0 ? 2.5 : 1.5,
              transform: `rotate(${deg}deg)`,
              background:
                "linear-gradient(90deg, rgba(255,246,222,0.30) 0%, rgba(226,190,124,0.10) 42%, transparent 100%)",
              filter: "blur(1.5px)",
            }}
          />
        ))}
      </div>

      {/* Bloom — tight, bright, and hugging the limb, as an overexposed
          highlight blooms into the sensor around a lit body. */}
      <div
        className="breathe absolute -inset-[24%] rounded-full mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(255,248,228,0.42) 0%, rgba(240,228,198,0.20) 42%, transparent 68%)",
          animationDelay: "-4s",
        }}
      />
      <div
        className="absolute -inset-[6%] rounded-full mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(255,252,242,0.34) 0%, rgba(255,246,222,0.12) 55%, transparent 74%)",
        }}
      />

      {/* The disc, treated as an engraving rather than a filled shape.
          Three things do that work: a lit limb so the sphere turns
          away from the light, a field of maria at varied densities,
          and fine hatching laid across the whole face — the mark of a
          plate that was cut by hand. */}
      <div className="relative aspect-square w-full overflow-hidden rounded-full shadow-[0_0_70px_rgba(217,201,163,0.4)]">
        {/* Body and limb: light falls from the upper left, and the
            edge darkens as the sphere curves away. */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 34% 28%, #fbf3dd 0%, #f0e2be 38%, #dcc99c 68%, #b99f70 88%, #947d55 100%)",
          }}
        />

        {/* Maria — irregular in size and edge softness, never a tidy
            row of identical dots. */}
        <div
          className="absolute inset-0 rounded-full opacity-70 mix-blend-multiply"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 22% 17% at 33% 31%, rgba(150,126,88,0.55), transparent 70%)",
              "radial-gradient(ellipse 15% 19% at 61% 54%, rgba(150,126,88,0.5), transparent 72%)",
              "radial-gradient(ellipse 11% 9% at 46% 71%, rgba(150,126,88,0.42), transparent 70%)",
              "radial-gradient(ellipse 8% 7% at 71% 27%, rgba(150,126,88,0.36), transparent 68%)",
              "radial-gradient(ellipse 6% 6% at 24% 58%, rgba(150,126,88,0.3), transparent 66%)",
              "radial-gradient(ellipse 5% 5% at 55% 18%, rgba(150,126,88,0.26), transparent 64%)",
            ].join(","),
          }}
        />

        {/* Engraver's hatching, fine and at an angle. */}
        <div
          className="absolute inset-0 rounded-full opacity-[0.16] mix-blend-multiply"
          style={{
            backgroundImage:
              "repeating-linear-gradient(58deg, rgba(90,72,44,0.9) 0 0.5px, transparent 0.5px 3px)",
          }}
        />
        {/* A second, sparser pass crossing the first — cross-hatching
            is what separates an engraving from a screen texture. */}
        <div
          className="absolute inset-0 rounded-full opacity-[0.09] mix-blend-multiply"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-34deg, rgba(90,72,44,0.9) 0 0.5px, transparent 0.5px 5px)",
          }}
        />

        {/* A struck gold rim. */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(255,246,222,0.55), inset 0 0 14px rgba(176,141,87,0.45)",
          }}
        />

        {/* The terminator, travelling across the face. */}
        <div
          className="lunation absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, #10152699 58%, #101526e6 66%, rgba(16,21,38,0) 74%)",
          }}
        />
      </div>
    </div>
  )
}

/**
 * A moon at a given phase, drawn with real terminator geometry: the
 * lit region is bounded by a semicircle and an ellipse whose
 * horizontal radius runs from +r at new, through 0 at half, to −r at
 * full, flipping the arc's sweep as it crosses. That is why it reads
 * as a crescent thickening into a gibbous rather than a gauge
 * filling up.
 *
 * `phase` is 0–1, new through full.
 */
export function Moon({
  phase,
  size = 18,
  className,
}: {
  phase: number
  size?: number
  className?: string
}) {
  const r = 9
  const p = Math.min(Math.max(phase, 0), 1)
  const rx = r * Math.cos(p * Math.PI)
  const sweep = rx >= 0 ? 0 : 1
  const lit = `M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${Math.abs(rx).toFixed(2)} ${r} 0 0 ${sweep} 0 ${-r}`

  return (
    <svg
      viewBox="-12 -12 24 24"
      style={{ width: size, height: size }}
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      <circle r={r} fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
      <path d={lit} fill="currentColor" />
    </svg>
  )
}
