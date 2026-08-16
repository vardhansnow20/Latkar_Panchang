import { cn } from "@/lib/utils"

/**
 * The horizon — the moment the sky crosses.
 *
 * ── What this band is ─────────────────────────────────────────────
 * The page is one continuous sky running from midnight to midnight,
 * and it has to pass through sunrise and sunset somewhere. A
 * dark-to-light crossing has a middle zone where neither pale nor
 * dark ink holds a legible ratio, so both crossings are placed in
 * bands that carry no words at all.
 *
 * ── Why a sunrise, specifically ───────────────────────────────────
 * A Panchang's day begins at sunrise rather than at midnight — it is
 * why the almanac is computed the way it is. So the one moment the
 * page cannot put words on is also the most meaningful moment in its
 * subject.
 *
 * ── Why this drawing, and not the first one ───────────────────────
 * The first attempt was a circle, a fan of even rays and a dashed
 * arc: correct in structure and cheap-looking in execution, because
 * every element was one weight, one length and one opacity. Real
 * engraved celestial plates are not uniform — the light is graded,
 * the rays are cut to different lengths in a rhythm, the disc carries
 * its own machining, and the horizon is a band of atmosphere rather
 * than a line.
 *
 * What that means concretely, and why each is here:
 *
 *   — the corona is three ray systems at different radii, weights and
 *     opacities, not one; the eye reads layered light as depth;
 *   — ray lengths follow a repeating long/medium/short rhythm, so the
 *     fan has cadence instead of a comb's regularity;
 *   — the disc carries a graduated limb ring and a fine cross of
 *     cardinal marks, which is what makes it an instrument rather
 *     than a circle;
 *   — the horizon is a graded atmospheric band with the light pooling
 *     into it, plus a shimmer on the near side, rather than a stroke;
 *   — a scatter of fixed stars sits above, fading out as it nears the
 *     light, which is what actually happens at dawn.
 *
 * All motion is transform or opacity on a handful of groups, so the
 * whole figure composites on one layer.
 */

function at(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

const CX = 400
const CY = 210
const SUN = 42

/** Three ray systems. Layered light reads as depth; one ring of even
 * spokes reads as a diagram. */
/* Ray lengths are bounded so the longest reaches ~200 units from the
 * centre at y=210 — i.e. it stops just inside the top of the 320-unit
 * viewBox. Now that the figure is clipped to its frame, a ray that
 * overshot would be sliced flat along the edge, which looks like a
 * rendering fault rather than light. */
const CORONA = [
  { count: 48, from: SUN + 10, lengths: [104, 58, 74], width: 0.5, opacity: 0.34, period: 420 },
  { count: 24, from: SUN + 22, lengths: [128, 86], width: 0.9, opacity: 0.5, period: 300 },
  { count: 12, from: SUN + 44, lengths: [114, 88], width: 1.2, opacity: 0.34, period: 620 },
]

/** Fixed stars above the light, thinning as they approach it. */
const STARS = [
  [96, 44, 1.1], [168, 96, 0.8], [243, 38, 1.3], [318, 78, 0.7],
  [486, 62, 0.9], [560, 30, 1.2], [634, 88, 0.8], [712, 52, 1.1],
  [58, 118, 0.7], [742, 128, 0.9], [206, 152, 0.6], [598, 148, 0.6],
] as const

export function Horizon({
  phase = "rise",
  className,
}: {
  phase?: "rise" | "set"
  className?: string
}) {
  const rising = phase === "rise"
  const id = (n: string) => `hz-${n}-${phase}`

  return (
    <svg
      viewBox="0 0 800 320"
      fill="none"
      aria-hidden="true"
      focusable="false"
      // Deliberately NOT `overflow-visible`.
      //
      // The corona reaches 256 units from a centre at y=210, and the
      // ecliptic runs from x=-40 to x=840 — both well outside the
      // 800×320 viewBox. Left visible, they escape the band and spray
      // across the registers above and below it. That was invisible on
      // a phone, where the figure renders about 330×132 and the spill
      // is a few pixels, and glaring on a laptop, where it renders at
      // roughly 832×333 and the overshoot scales with it.
      className={cn(className)}
      style={{ transform: rising ? undefined : "scaleY(-1)" }}
    >
      <defs>
        {/* The light itself: hot at the disc, falling away through two
            stops so the corona sits inside a graded field rather than
            on a flat wash. */}
        <radialGradient id={id("core")}>
          <stop offset="0%" stopColor="var(--color-brass-soft)" stopOpacity="0.62" />
          <stop offset="26%" stopColor="var(--color-brass-soft)" stopOpacity="0.28" />
          <stop offset="58%" stopColor="var(--color-brass)" stopOpacity="0.10" />
          <stop offset="100%" stopColor="var(--color-brass)" stopOpacity="0" />
        </radialGradient>

        {/* The atmosphere lying along the horizon — wide, shallow, and
            brightest where the sun meets it. */}
        <linearGradient id={id("haze")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="24%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="50%" stopColor="var(--color-brass-soft)" stopOpacity="0.62" />
          <stop offset="76%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>

        {/* Edge fade for the two ecliptic curves. They are authored
            wider than the frame so their arc is correct through the
            middle; without this they would simply stop dead at the
            clip and read as two cut wires. */}
        <linearGradient id={id("fade")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="18%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="82%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={id("rule")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="30%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="50%" stopColor="var(--color-brass-soft)" stopOpacity="1" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>

        {/* Everything above the line only — a sun on the horizon is
            half a sun, and the clip is what sells it as *on* the line
            rather than in front of it. */}
        <clipPath id={id("above")}>
          <rect x="-40" y="-40" width="880" height={CY + 40} />
        </clipPath>

        {/* The corona fades out before the frame edge, so the rays end
            in air instead of being cut off by the viewBox.
            Centred on the sun in user space, not on the mask box: an
            objectBoundingBox gradient on a 2.5:1 rect is centred at
            y=160 and stretched horizontally, so the fade reached the
            top edge while still nearly opaque and the fan ended on a
            hard horizontal line. */}
        <radialGradient
          id={id("falloff")}
          gradientUnits="userSpaceOnUse"
          cx={CX}
          cy={CY}
          r="212"
        >
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="58%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={id("coronaMask")}>
          <rect x="0" y="0" width="800" height="320" fill={`url(#${id("falloff")})`} />
        </mask>
      </defs>

      {/* ── Fixed stars, thinning toward the light ─────────────────── */}
      <g fill="currentColor" clipPath={`url(#${id("above")})`}>
        {STARS.map(([x, y, r], i) => {
          // Distance from the sun drives how much of each star has
          // already been washed out by the coming light.
          const d = Math.hypot(x - CX, y - CY)
          const survive = Math.min(1, Math.max(0, (d - 150) / 260))
          return (
            <circle
              key={i}
              className="star"
              cx={x}
              cy={y}
              r={r}
              opacity={0.5 * survive}
              style={{
                ["--star-dur" as string]: `${7 + i}s`,
                ["--star-delay" as string]: `${i * 1.3}s`,
                ["--star-min" as string]: 0.1,
                ["--star-max" as string]: 0.5 * survive,
              }}
            />
          )
        })}
      </g>

      {/* ── The field of light ─────────────────────────────────────── */}
      <ellipse
        className="breathe"
        cx={CX}
        cy={CY}
        rx="300"
        ry="196"
        fill={`url(#${id("core")})`}
        style={{ transformBox: "view-box", transformOrigin: "center" }}
      />

      {/* ── The corona ─────────────────────────────────────────────── */}
      <g clipPath={`url(#${id("above")})`} mask={`url(#${id("coronaMask")})`} stroke="currentColor">
        {CORONA.map((ring, ri) => (
          <g
            key={ri}
            className="turning"
            style={{
              transformBox: "view-box",
              transformOrigin: "center",
              animationDirection: ri === 1 ? "reverse" : "normal",
              ["--turn-dur" as string]: `${ring.period}s`,
            }}
          >
            {Array.from({ length: ring.count }, (_, i) => {
              const deg = (i * 360) / ring.count
              // A repeating rhythm of lengths, so the fan has cadence
              // rather than the regularity of a comb.
              const len = ring.lengths[i % ring.lengths.length]
              const a = at(CX, CY, ring.from, deg)
              const b = at(CX, CY, ring.from + len, deg)
              return (
                <line
                  key={deg}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  strokeWidth={ring.width}
                  strokeLinecap="round"
                  opacity={ring.opacity * (i % ring.lengths.length === 0 ? 1 : 0.6)}
                />
              )
            })}
          </g>
        ))}
      </g>

      {/* ── The disc ───────────────────────────────────────────────── */}
      <g clipPath={`url(#${id("above")})`} stroke="currentColor">
        {/* A graduated limb, which is what makes it an instrument. */}
        <g
          className="turning"
          style={{
            transformBox: "view-box",
            transformOrigin: "center",
            ["--turn-dur" as string]: "540s",
          }}
        >
          {Array.from({ length: 72 }, (_, i) => {
            const deg = i * 5
            const major = i % 6 === 0
            const a = at(CX, CY, SUN, deg)
            const b = at(CX, CY, SUN - (major ? 8 : 4), deg)
            return (
              <line
                key={deg}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={major ? 0.7 : 0.35}
                opacity={major ? 0.55 : 0.3}
              />
            )
          })}
        </g>

        <circle cx={CX} cy={CY} r={SUN} strokeWidth="1.2" opacity="0.8" fill="none" />
        <circle cx={CX} cy={CY} r={SUN - 12} strokeWidth="0.45" opacity="0.35" fill="none" />

        {/* Cardinal marks across the disc — the fine cross an engraved
            plate carries at its centre. */}
        <line x1={CX - SUN + 6} y1={CY} x2={CX + SUN - 6} y2={CY} strokeWidth="0.4" opacity="0.28" />
        <line x1={CX} y1={CY - SUN + 6} x2={CX} y2={CY + SUN - 6} strokeWidth="0.4" opacity="0.28" />
      </g>

      {/* ── The ecliptic, passing through where the sun stands ─────── */}
      <path
        d={`M -40 ${CY + 62} Q ${CX} ${CY - 138} 840 ${CY + 62}`}
        stroke={`url(#${id("fade")})`}
        strokeWidth="0.8"
        opacity="0.26"
        fill="none"
      />
      <path
        d={`M -40 ${CY + 76} Q ${CX} ${CY - 124} 840 ${CY + 76}`}
        stroke={`url(#${id("fade")})`}
        strokeWidth="0.7"
        strokeDasharray="1.5 10"
        opacity="0.2"
        fill="none"
      />

      {/* ── The horizon: a band of atmosphere, not a stroke ────────── */}
      <rect x="0" y={CY - 3} width="800" height="7" fill={`url(#${id("haze")})`} opacity="0.55" />
      <line x1="0" y1={CY} x2="800" y2={CY} stroke={`url(#${id("rule")})`} strokeWidth="1.1" />

      {/* The light pooling on the near side of the line. */}
      <rect x="0" y={CY} width="800" height="30" fill={`url(#${id("haze")})`} opacity="0.22" />

      {/* Graduation, fading out toward both edges so the rule
          dissolves into the sky rather than stopping. */}
      <g stroke="currentColor">
        {Array.from({ length: 65 }, (_, i) => {
          const x = i * 12.5
          const major = i % 4 === 0
          const fade = 1 - Math.abs(x - CX) / CX
          return (
            <line
              key={x}
              x1={x}
              y1={CY}
              x2={x}
              y2={CY + (major ? 10 : 5)}
              strokeWidth={major ? 0.7 : 0.35}
              opacity={0.4 * fade * fade}
            />
          )
        })}
      </g>
    </svg>
  )
}
