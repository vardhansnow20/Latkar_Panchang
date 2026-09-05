import { useMemo } from "react"
import { m } from "framer-motion"
import { Register, Measure } from "@/components/sky/Register"
import { Gallery } from "@/components/sky/Gallery"
import { Plate } from "@/components/sky/Plate"
import { Figure } from "@/components/sky/Celestial"
import { rise, sequence, viewport } from "@/lib/motion"
import { useContent } from "@/i18n/LanguageProvider"
import type { Content } from "@/i18n/en"

/**
 * What the book actually contains, opened one page at a time.
 *
 * The scale swings deliberately and hard: a tall plate, then a small
 * detail set in the margin, then three pages in a row at equal
 * weight, then a wide spread. Nothing here repeats the size of the
 * thing above it, because a sequence of equally-sized images is a
 * gallery, and a gallery is what this is not.
 *
 * Every plate is still an empty mount pending photography from the
 * client, so each carries its caption as the load-bearing element —
 * the sequence reads as a described walk-through either way.
 */
/** The seven pieces in the order a reader meets them: the cover, the
 * detail, the three interior page types, a full month, and the
 * edition on the shelf today. Assembled from the existing data so
 * captions and alt text keep their single source. */
/** The walk through the edition, built from the live content tree.
 *
 * Every caption here is translated copy, so this cannot be a
 * module-scope constant: that is evaluated once at import and would
 * pin the sequence to whichever language the page first loaded in. */
const buildPageWalk = (c: Content) => [
  { id: "reveal", image: c.revealImage.image, caption: c.revealImage.caption, mount: "deep" as const },
  { id: "close-up", image: c.closeUpImage.image, caption: c.closeUpImage.caption, mount: "thin" as const },
  ...c.interiorPages.map((p) => ({ id: p.id, image: p.image, caption: p.caption, mount: "thin" as const })),
  { id: "calendar-page", image: c.calendarPageImage.image, caption: c.calendarPageImage.caption, mount: "deep" as const },
  { id: "latest", image: c.latestEditionImage.image, caption: c.latestEditionImage.caption, mount: "deep" as const },
]

export function Contents() {
  const c = useContent()
  const pageWalk = useMemo(() => buildPageWalk(c), [c])
  return (
    <Register id="contents" tone="dawn" height="vast" className="overflow-hidden">
      <Figure
        name="chart" opacity={0.25}
        className="pointer-events-none absolute hidden sm:block -top-[6%] right-[-14%] h-[26rem] w-[39rem] text-[var(--ink-faint)] lg:h-[34rem] lg:w-[51rem]"
      />

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="relative mb-[var(--s-6)]"
      >
        <p className="tick mb-[var(--s-3)]">{c.explore.eyebrow}</p>
        <h2 className="mb-[var(--s-3)] max-w-[16ch] text-register text-[var(--ink)]">
          {c.explore.heading}
        </h2>
        <Measure size="wide">
          <p className="text-lead text-[var(--ink-soft)]">{c.explore.intro}</p>
        </Measure>
      </m.div>

      {/* ── The walk ───────────────────────────────────────────────
          Seven plates, in narrative order, hung as one run.

          This was five stacked blocks of deliberately varied scale,
          and the variety was real design — but it cost three screens
          to show seven pieces, every one of them still an empty
          mount. The section describes itself as a walk through the
          pages, and a walk is horizontal. Read left to right it is
          the same sequence, at a fifth of the height, and the
          captions now carry it as one continuous description rather
          than five captions separated by a screen of air each. */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sequence}
        className="relative"
      >
        <Gallery label={c.explore.heading} itemWidth="clamp(12rem, 21vw, 17rem)">
          {pageWalk.map((page) => (
            <m.figure key={page.id} variants={rise}>
              <Plate image={page.image} mount={page.mount} maxHeight="15rem" />
              <figcaption className="mt-[var(--s-3)] text-note text-[var(--ink-soft)]">
                {page.caption}
              </figcaption>
            </m.figure>
          ))}
        </Gallery>
      </m.div>
    </Register>
  )
}
