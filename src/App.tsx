import { useMemo } from "react"
import { MotionProvider } from "@/components/common/MotionProvider"
import { SmoothScroll } from "@/components/sky/SmoothScroll"
import { SkyCalibration } from "@/components/sky/SkyCalibration"
import { Masthead, Colophon } from "@/components/sky/Masthead"
import { DegreeRule } from "@/components/sky/DegreeRule"
import { Opening } from "@/components/registers/Opening"
import { Descent, Meridian } from "@/components/registers/Descent"
import { Elements } from "@/components/registers/Elements"
import { Inside } from "@/components/registers/Inside"
import { Contents } from "@/components/registers/Contents"
import { Trust, Compilers } from "@/components/registers/Testimony"
import { Archive } from "@/components/registers/Archive"
import { Calendar, Dusk, Almanac, Reach } from "@/components/registers/Present"

/**
 * The page, in order of the sunrise it describes.
 *
 * The sequence is not the old section order. It is arranged by hour:
 * the origin and the hundred years that follow it sit in night, the
 * book opens at dawn, the argument and the people arrive in morning
 * light, and the collection — real photographs and certificates —
 * lands in full daylight, where archival material is legible and
 * where it belongs. Everything you can actually obtain is last.
 */
export default function App() {
  // Named for the rule's use, which is wayfinding — these are the
  // words the reader sees beside the moon, so they are register
  // names rather than element ids.
  const registers = useMemo(
    () => [
      { id: "opening", label: "The Sky" },
      { id: "descent", label: "A Hundred Years" },
      { id: "inside", label: "Inside the Edition" },
      { id: "contents", label: "The Pages" },
      { id: "trust", label: "Why It Is Trusted" },
      { id: "compilers", label: "The Compilers" },
      { id: "archive", label: "The Archive" },
      { id: "calendar", label: "The Calendar" },
      { id: "almanac", label: "The App" },
      { id: "reach", label: "Reach Us" },
    ],
    []
  )

  return (
    <MotionProvider>
      <a
        href="#contents-start"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:bg-[var(--color-paper-raised)] focus-visible:px-4 focus-visible:py-2 focus-visible:text-[var(--color-ink)]"
      >
        Skip to content
      </a>

      <SmoothScroll />
      {/* Re-pins the sky's two horizons to the wordless bands after
          any layout change, so contrast can never silently break when
          a section is added or resized. */}
      <SkyCalibration />
      <Masthead />
      <DegreeRule registers={registers} />

      <main id="contents-start">
        <Opening />
        <Descent />
        {/* Definition and its five limbs, before any argument about
            why the book is trusted — a reader has to know what the
            thing is before being told it is reliable. */}
        <Elements />
        {/* The edition itself, opened — placed straight after the five
            limbs, so a reader meets the real object immediately after
            being told what it contains. */}
        <Inside />
        <Contents />
        {/* The horizon. Everything above reads in pale ink on night,
            everything below in dark ink on paper; this empty band is
            where the sky crosses between them. */}
        <Meridian />
        <Trust />
        <Compilers />
        <Archive />
        <Calendar />
        {/* The day turns. Everything below reads in pale ink on night
            again, closing the cycle where the page opened. */}
        <Dusk />
        <Almanac />
        <Reach />
      </main>

      <Colophon />
    </MotionProvider>
  )
}
