import { m } from "framer-motion"
import { Register, Measure } from "@/components/sky/Register"
import { Plate } from "@/components/sky/Plate"
import { Figure } from "@/components/sky/Celestial"
import {
  explore,
  revealImage,
  closeUpImage,
  interiorPages,
  calendarPageImage,
  latestEditionImage,
} from "@/data/explore"
import { rise, unveil, unveilSide, sequence, viewport } from "@/lib/motion"

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
export function Contents() {
  return (
    <Register id="contents" tone="dawn" height="vast" className="overflow-hidden">
      <Figure
        name="chart" opacity={0.25}
        className="pointer-events-none absolute -top-[6%] right-[-14%] h-[26rem] w-[39rem] text-[var(--ink-faint)] lg:h-[34rem] lg:w-[51rem]"
      />

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="relative mb-[var(--s-7)]"
      >
        <p className="tick mb-[var(--s-3)]">{explore.eyebrow}</p>
        <h2 className="mb-[var(--s-3)] max-w-[16ch] text-chapter text-[var(--ink)]">
          {explore.heading}
        </h2>
        <Measure size="wide">
          <p className="text-lead text-[var(--ink-soft)]">{explore.intro}</p>
        </Measure>
      </m.div>

      {/* First glimpse — tall, held alone. */}
      <div className="relative mb-[var(--s-8)] lg:flex lg:items-end lg:gap-[var(--s-6)]">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={unveil}
          className="w-[72%] max-w-[24rem] lg:w-[34%] lg:max-w-none"
        >
          <Plate image={revealImage.image} mount="deep" />
        </m.div>
        <m.p
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={rise}
          className="mt-[var(--s-4)] max-w-[22ch] text-title text-[var(--ink)] lg:mt-0 lg:mb-[var(--s-4)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {revealImage.caption}
        </m.p>
      </div>

      {/* The detail — deliberately the smallest plate in the sequence,
          hung out in the margin. */}
      <div className="mb-[var(--s-8)] lg:flex lg:justify-end">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={unveilSide}
          className="w-[38%] max-w-[11rem]"
        >
          <Plate image={closeUpImage.image} mount="thin" />
          <p className="mt-[var(--s-2)] text-note text-[var(--ink-soft)]">
            {closeUpImage.caption}
          </p>
        </m.div>
      </div>

      {/* The three page types, in a row at equal weight — the one
          moment in the sequence where repetition is the point, since
          these three genuinely are peers. */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sequence}
        className="mb-[var(--s-8)] grid gap-[var(--s-4)] sm:grid-cols-3 sm:gap-[var(--s-5)]"
      >
        {interiorPages.map((page) => (
          <m.figure key={page.id} variants={rise}>
            <Plate image={page.image} mount="thin" />
            <figcaption className="mt-[var(--s-3)] text-note text-[var(--ink-soft)]">
              {page.caption}
            </figcaption>
          </m.figure>
        ))}
      </m.div>

      {/* A full month, given the width it describes. */}
      <div className="mb-[var(--s-8)]">
        <m.div initial="hidden" whileInView="visible" viewport={viewport} variants={unveil}>
          <Plate image={calendarPageImage.image} mount="deep" />
        </m.div>
        <m.p
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={rise}
          className="mt-[var(--s-3)] text-note text-[var(--ink-soft)]"
        >
          {calendarPageImage.caption}
        </m.p>
      </div>

      {/* The edition on the shelf today — the sequence closes on the
          object it opened with, now at full height. */}
      <div className="lg:flex lg:items-end lg:gap-[var(--s-6)]">
        <m.p
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={rise}
          className="mb-[var(--s-4)] max-w-[14ch] text-title text-[var(--ink)] lg:mb-[var(--s-5)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {latestEditionImage.caption}
        </m.p>
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={unveil}
          className="w-[66%] max-w-[22rem] lg:w-[30%] lg:max-w-none"
        >
          <Plate image={latestEditionImage.image} mount="deep" />
        </m.div>
      </div>
    </Register>
  )
}
