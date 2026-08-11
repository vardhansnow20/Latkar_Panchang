import { cn } from "@/lib/utils"

/**
 * The horizon — the moment the sky crosses.
 *
 * ── What this band is ─────────────────────────────────────────────
 * The page is one continuous sky running from midnight to midnight,
 * and it has to pass through sunrise and sunset somewhere. A
 * dark-to-light crossing has a middle zone where neither pale nor
 * dark ink holds a legible ratio, so both crossings are placed in
 * bands that carry no words at all. That constraint is real and is
 * measured on every load by SkyCalibration.
 *
 * But wordless was being read as empty. Both bands held a single
 * faint arc across roughly 60svh, which on a phone is most of a
 * screen of nothing — reported, fairly, as a hole in the page.
 *
 * ── Why a sunrise, specifically ───────────────────────────────────
 * This is not decoration chosen to fill a gap. A Panchang's day
 * begins at sunrise rather than at midnight — it is why the almanac
 * is computed the way it is, and the source document says so. So the
 * one moment the page cannot put words on is also the single most
 * meaningful moment in the subject. Drawing it is the point.
 *
 * Drawn as an engraved sun over a graduated horizon, in the same
 * language as the rest of the instrument: rays cut at two weights,
 * degree marks along the edge, the ecliptic passing through. Nothing
 * here is a stock celestial motif.
 */

function at(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

/** Sun centre, sitting on the horizon line. */
const CX = 400
const CY = 200
const SUN = 46

export function Horizon({
  phase = "rise",
  className,
}: {
  /** `rise` lifts the light out of the line; `set` lowers it into it. */
  phase?: "rise" | "set"
  className?: string
}) {
  const rising = phase === "rise"

  return (
    <svg
      viewBox="0 0 800 300"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("overflow-visible", className)}
      style={{ transform: rising ? undefined : "scaleY(-1)" }}
    >
      <defs>
        {/* The light on the horizon itself — brightest at the sun and
            falling away along the line, the way a real dawn sits. */}
        <linearGradient id={`hz-line-${phase}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="28%" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="50%" stopColor="var(--color-brass-soft)" stopOpacity="0.95" />
          <stop offset="72%" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={`hz-glow-${phase}`}>
          <stop offset="0%" stopColor="var(--color-brass-soft)" stopOpacity="0.55" />
          <stop offset="42%" stopColor="var(--color-brass)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-brass)" stopOpacity="0" />
        </radialGradient>

        {/* Everything above the line only. A sun on the horizon is
            half a sun; clipping is what sells it as *on* the horizon
            rather than floating in front of it. */}
        <clipPath id={`hz-above-${phase}`}>
          <rect x="0" y="0" width="800" height={CY} />
        </clipPath>
      </defs>

      {/* The light in the sky behind the sun. */}
      <ellipse
        className="breathe"
        cx={CX}
        cy={CY}
        rx="250"
        ry="150"
        fill={`url(#hz-glow-${phase})`}
        style={{ transformBox: "view-box", transformOrigin: "center" }}
      />

      <g clipPath={`url(#hz-above-${phase})`} stroke="currentColor">
        {/* The rays, cut at two weights like an engraving. They turn
            very slowly — a full revolution takes six minutes — so the
            light reads as living rather than as a spinning graphic. */}
        <g
          className="turning"
          style={{
            transformBox: "view-box",
            transformOrigin: "center",
            ["--turn-dur" as string]: "360s",
          }}
        >
          {Array.from({ length: 36 }, (_, i) => {
            const deg = i * 10
            const long = i % 3 === 0
            const a = at(CX, CY, SUN + 16, deg)
            const b = at(CX, CY, SUN + (long ? 96 : 52), deg)
            return (
              <line
                key={deg}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={long ? 1 : 0.5}
                opacity={long ? 0.5 : 0.28}
              />
            )
          })}
        </g>

        {/* The disc. */}
        <circle cx={CX} cy={CY} r={SUN} strokeWidth="1.1" opacity="0.75" fill="none" />
        <circle cx={CX} cy={CY} r={SUN - 9} strokeWidth="0.5" opacity="0.4" fill="none" />
      </g>

      {/* The ecliptic, passing through the point where the sun stands.
          Drawn across the whole band so the crossing reads as part of
          a path the page has been following, not an isolated emblem. */}
      <path
        d={`M -20 ${CY + 54} Q ${CX} ${CY - 116} 820 ${CY + 54}`}
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.3"
        fill="none"
      />
      <path
        d={`M -20 ${CY + 66} Q ${CX} ${CY - 104} 820 ${CY + 66}`}
        stroke="var(--color-brass-soft)"
        strokeWidth="0.8"
        strokeDasharray="2 9"
        opacity="0.22"
        fill="none"
      />

      {/* The horizon, graduated. */}
      <g>
        <line
          x1="0"
          y1={CY}
          x2="800"
          y2={CY}
          stroke={`url(#hz-line-${phase})`}
          strokeWidth="1.2"
        />
        {Array.from({ length: 41 }, (_, i) => {
          const x = i * 20
          const major = i % 5 === 0
          // Fade the graduation out toward the edges, so the line
          // dissolves into the sky instead of stopping.
          const fade = 1 - Math.abs(x - CX) / CX
          return (
            <line
              key={x}
              x1={x}
              y1={CY}
              x2={x}
              y2={CY + (major ? 9 : 5)}
              stroke="currentColor"
              strokeWidth={major ? 0.8 : 0.4}
              opacity={0.42 * fade * fade}
            />
          )
        })}
      </g>
    </svg>
  )
}
