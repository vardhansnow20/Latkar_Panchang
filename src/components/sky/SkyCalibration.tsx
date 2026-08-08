import { useEffect } from "react"

/**
 * Keeps the sky's two horizons pinned to the page's two wordless
 * bands, automatically.
 *
 * ── Why this exists ───────────────────────────────────────────────
 * The page is one continuous gradient from midnight through daylight
 * and back. A dark-to-light crossing has an unavoidable middle zone
 * where neither pale nor dark ink holds a legible contrast ratio, so
 * both crossings must happen inside the two bands that carry no text
 * — Meridian at sunrise, Dusk at sunset.
 *
 * When those stops were hard-coded percentages, every change to any
 * section's height moved the bands out from under them and silently
 * dropped body copy to as low as 1.2:1. That happened four times in
 * four consecutive edits, each caught only by measuring. Hard-coded
 * stops are simply the wrong representation: the correct positions
 * are a property of the rendered layout, not a constant.
 *
 * So they are measured. The bands report where they actually are, and
 * the gradient is rebuilt from that. Adding, removing or resizing any
 * section now re-pins the horizons on its own.
 *
 * The static gradient in globals.css remains as the pre-hydration and
 * no-JS fallback; it is approximately right, and this corrects it to
 * exact on mount.
 */

/** Colour stops either side of each horizon. Positions come from the
 * measured bands; only the hues are authored here. */
const NIGHT_TO_DAY = ["#3d3a55", "#776a76", "#b9a189"] as const
const DAY_TO_NIGHT = ["#f2e6cd", "#c98f80", "#7d5a78", "#2b3050"] as const

export function SkyCalibration() {
  useEffect(() => {
    const build = () => {
      // Never recalibrate while a modal is open.
      //
      // The Lightbox locks body scrolling, which collapses the page's
      // measurable height and fires the ResizeObserver below. Left
      // unguarded, opening any artifact recomputed the horizons
      // against a page that was momentarily one viewport tall and
      // wrote a nonsense gradient that survived the dialog closing —
      // measured, it dropped two registers to 1.4:1 for the rest of
      // the session. The layout underneath cannot change while a
      // dialog is up, so skipping is always safe.
      if (document.querySelector('[role="dialog"]')) return

      const meridian = document.getElementById("meridian")
      const dusk = document.getElementById("dusk")
      const docH = document.body.scrollHeight
      if (!meridian || !dusk || docH <= 0) return

      const span = (el: HTMLElement) => ({
        from: (el.offsetTop / docH) * 100,
        to: ((el.offsetTop + el.offsetHeight) / docH) * 100,
      })

      const m = span(meridian)
      const d = span(dusk)

      // Each crossing is inset slightly inside its band, so the last
      // legible colour is reached before the band ends rather than
      // exactly at its edge.
      const inset = (a: number, b: number, t: number) => a + (b - a) * t
      const sunriseA = inset(m.from, m.to, 0.06)
      const sunriseB = inset(m.from, m.to, 0.45)
      const sunriseC = inset(m.from, m.to, 0.92)
      const sunsetA = inset(d.from, d.to, 0.04)
      const sunsetB = inset(d.from, d.to, 0.42)
      const sunsetC = inset(d.from, d.to, 0.66)
      const sunsetD = inset(d.from, d.to, 0.94)

      const f = (n: number) => `${n.toFixed(2)}%`

      const stops = [
        `#10162a 0%`,
        `#1f2a44 ${f(Math.min(8, sunriseA * 0.22))}`,
        `#262f4e ${f(sunriseA * 0.48)}`,
        `#33324f ${f(sunriseA * 0.82)}`,
        `${NIGHT_TO_DAY[0]} ${f(sunriseA)}`,
        `${NIGHT_TO_DAY[1]} ${f(sunriseB)}`,
        `${NIGHT_TO_DAY[2]} ${f(sunriseC)}`,
        // Daylight warms across the whole span between the horizons.
        `#cdb69a ${f(inset(sunriseC, sunsetA, 0.2))}`,
        `#ded0b2 ${f(inset(sunriseC, sunsetA, 0.42))}`,
        `#ede4cf ${f(inset(sunriseC, sunsetA, 0.66))}`,
        `#f6f1e4 ${f(inset(sunriseC, sunsetA, 0.86))}`,
        `${DAY_TO_NIGHT[0]} ${f(sunsetA)}`,
        `${DAY_TO_NIGHT[1]} ${f(sunsetB)}`,
        `${DAY_TO_NIGHT[2]} ${f(sunsetC)}`,
        `${DAY_TO_NIGHT[3]} ${f(sunsetD)}`,
        `#1e2440 ${f(Math.min(99, sunsetD + 2))}`,
        `#10162a 100%`,
      ]

      document.body.style.backgroundImage = `linear-gradient(180deg, ${stops.join(", ")})`
    }

    build()

    // Section heights depend on viewport height (several bands are
    // sized in svh) and on images settling, so recalibrate on both.
    const onResize = () => build()
    window.addEventListener("resize", onResize)
    window.addEventListener("load", build)
    const observer = new ResizeObserver(build)
    observer.observe(document.body)

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("load", build)
      observer.disconnect()
    }
  }, [])

  return null
}
