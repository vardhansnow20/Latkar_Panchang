import { useState } from "react"
import { m } from "framer-motion"
import { Maximize2 } from "lucide-react"
import { Register, Measure } from "@/components/sky/Register"
import { Plate } from "@/components/sky/Plate"
import { Action } from "@/components/sky/Action"
import { Figure, StarField } from "@/components/sky/Celestial"
import { Lightbox } from "@/components/sky/Lightbox"
import { laxmiCalendar } from "@/data/laxmiCalendar"
import { mobileApp } from "@/data/mobileApp"
import { contact } from "@/data/contact"
import { rise, sequence, viewport } from "@/lib/motion"

/**
 * The three daylight registers — the things you can hold, or will be
 * able to, or can call about. The sky is fully up by now, so these
 * are the only bands set in full paper light.
 */

/**
 * The companion calendar, presented as an object rather than a
 * content block: it is the one register that abandons the frame
 * entirely and runs edge to edge, because a wall calendar is a thing
 * of a certain size and the page should say so.
 */
export function Calendar() {
  const [open, setOpen] = useState(false)

  return (
    <Register id="calendar" tone="day" height="vast" className="overflow-hidden">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="mb-[var(--s-6)]"
      >
        <p className="tick mb-[var(--s-3)]">{laxmiCalendar.eyebrow}</p>
        <h2 className="mb-[var(--s-2)] max-w-[14ch] text-chapter text-[var(--ink)]">
          {laxmiCalendar.heading}
        </h2>
        <p
          className="mb-[var(--s-4)] text-title text-[var(--metal)]"
          style={{ fontFamily: "var(--font-devanagari)" }}
        >
          {laxmiCalendar.script}
        </p>
        <Measure size="wide">
          <p className="text-lead text-[var(--ink-soft)]">{laxmiCalendar.intro}</p>
        </Measure>
      </m.div>

      {/* The sheet is portrait and wall-sized, so it is hung rather
          than run edge to edge: a tall object given its own column,
          with the label beside it at reading height. Running a 1:1.5
          sheet full-bleed would have made it several screens tall. */}
      <div className="lg:flex lg:items-start lg:gap-[var(--s-6)]">
        {/* No clip-path reveal on this plate, deliberately.
         *
         * It was wrapped in `unveil`, whose hidden state is
         * `inset(0 0 100% 0)` — fully clipped. A reveal like that has
         * a failure mode with no floor: if the in-view trigger does
         * not fire, the element keeps its layout box and shows
         * nothing, which is precisely what was reported here — a
         * blank space of the right size and shape, with healthy
         * markup and a 200 on the image behind it.
         *
         * The calendar is the product this section exists to show.
         * It renders unconditionally; correctness beats the nicety. */}
        <div className="mb-[var(--s-5)] w-full max-w-[26rem] lg:mb-0 lg:w-[42%] lg:max-w-none lg:shrink-0">
          <div className="group/sheet relative rotate-[-0.6deg] transition-transform duration-[var(--t-reveal)] ease-[var(--ease)] hover:-translate-y-1.5 hover:rotate-0">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="View the Shree Laxmi Calendar full screen"
              className="block w-full cursor-zoom-in text-left"
            >
              <Plate image={laxmiCalendar.image} mount="deep" glazed interactive />
            </button>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-[var(--s-3)] bottom-[var(--s-3)] flex items-center gap-[var(--s-2)] rounded-full bg-[color-mix(in_srgb,var(--color-indigo)_82%,transparent)] px-[var(--s-3)] py-[var(--s-2)] text-[var(--color-paper)] backdrop-blur-sm [@media(hover:hover)]:hidden"
            >
              <Maximize2 size={13} strokeWidth={1.75} />
              <span className="tick text-[var(--color-paper)]">Tap to open</span>
            </span>
          </div>
        </div>

        <m.div initial="hidden" whileInView="visible" viewport={viewport} variants={rise}>
          <p className="tick mb-[var(--s-3)] tabular-nums">{laxmiCalendar.plate.designation}</p>
          <p
            className="mb-[var(--s-4)] max-w-[30ch] text-title text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {laxmiCalendar.body}
          </p>
          <Measure className="mb-[var(--s-5)]">
            <p className="text-note text-[var(--ink-soft)]">{laxmiCalendar.plate.note}</p>
          </Measure>
          <Action href={laxmiCalendar.link.href}>{laxmiCalendar.link.label}</Action>
        </m.div>
      </div>

      <Lightbox
        items={[
          {
            id: "laxmi-calendar",
            title: laxmiCalendar.heading,
            fullSrc: laxmiCalendar.full.src,
            alt: laxmiCalendar.full.alt,
            designation: laxmiCalendar.plate.designation,
            description: laxmiCalendar.plate.note,
          },
        ]}
        index={open ? 0 : null}
        onClose={() => setOpen(false)}
        onNavigate={() => {}}
      />
    </Register>
  )
}

/**
 * Dusk — the day closing, and the counterpart to Meridian.
 *
 * Same dual purpose as the sunrise band. Compositionally it is the
 * page's second held breath, turning the journey from daylight back
 * toward night so the century closes where it opened. Practically it
 * is where the sky crosses *back*, and it carries no words for the
 * same measured reason: in the middle of a light-to-dark crossing
 * neither pale nor dark ink can hold a legible ratio.
 *
 * Its height is load-bearing. Shrink it and the crossover slides
 * under live type in the registers either side.
 */
export function Dusk() {
  return (
    // The id is load-bearing: SkyCalibration measures this band to
    // decide where the sunset crossing goes.
    <Register id="dusk" tone="night" height="close" className="overflow-hidden">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="relative flex min-h-[52svh] items-center justify-center"
      >
        <Figure
          name="arc" opacity={0.4}
          className="h-[8rem] w-full max-w-[44rem] rotate-180 text-[var(--ink-faint)] lg:h-[11rem]"
        />
      </m.div>
    </Register>
  )
}

/**
 * The app. Deliberately the smallest register on the page: the
 * source document says nothing about it, the copy is an unverified
 * placeholder, and there is no screenshot — so it is given the
 * weight of a note about something forthcoming, which is all it can
 * honestly carry. See the TODO in data/mobileApp.ts.
 */
export function Almanac() {
  return (
    <Register id="almanac" tone="night" height="open" className="overflow-hidden">
      <StarField count={30} className="absolute inset-0" />
      <Figure
        name="orbits"
        turning
        opacity={0.16}
        className="pointer-events-none absolute hidden sm:block -right-[28%] top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 text-[var(--color-brass-soft)] lg:-right-[12%] lg:h-[44rem] lg:w-[44rem]"
      />

      <div className="relative lg:flex lg:items-center lg:gap-[var(--s-7)]">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={sequence}
          className="lg:flex-1"
        >
          {/* A held label rather than a badge — the section is a note
              about something forthcoming, and should read as one. */}
          <m.p variants={rise} className="tick mb-[var(--s-4)] flex items-center gap-[var(--s-3)]">
            <span className="inline-block size-[6px] rounded-full bg-[var(--color-brass)]" />
            {mobileApp.eyebrow}
          </m.p>
          <m.h2
            variants={rise}
            className="mb-[var(--s-4)] max-w-[15ch] text-register text-[var(--ink)]"
          >
            {mobileApp.heading}
          </m.h2>
          <Measure size="wide" className="mb-[var(--s-5)]">
            <m.p variants={rise} className="text-lead text-[var(--ink-soft)]">
              {mobileApp.body}
            </m.p>
          </Measure>
          <m.div variants={rise}>
            <Action href={mobileApp.cta.href} weight="solid">
              {mobileApp.cta.label}
            </Action>
          </m.div>
        </m.div>

        {/* The device, empty. No screenshot exists and none is
            invented — the frame stands as a held place, lit from
            behind so it reads as anticipation rather than omission. */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={rise}
          className="relative mx-auto mt-[var(--s-6)] w-[54%] max-w-[15rem] lg:mx-0 lg:mt-0 lg:w-[17rem] lg:shrink-0"
        >
          <div
            aria-hidden="true"
            className="breathe absolute -inset-[38%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(176,141,87,0.22) 0%, rgba(176,141,87,0.07) 45%, transparent 70%)",
            }}
          />
          <div className="relative rounded-[2rem] border border-[var(--color-brass)]/35 bg-[color-mix(in_srgb,var(--color-indigo)_70%,transparent)] p-[var(--s-2)] shadow-[var(--depth-lift)] backdrop-blur-sm">
            <div className="overflow-hidden rounded-[1.6rem]">
              <Plate image={mobileApp.screen} mount="none" />
            </div>
          </div>
        </m.div>
      </div>
    </Register>
  )
}

/**
 * The last band. Centred — everything above is hung off a margin, so
 * resolving to an axis is what makes this read as an ending rather
 * than another chapter, the way a colophon sits centred at the back
 * of a book.
 *
 * Still no form: there is nowhere for one to submit to, and a
 * correspondence card is the more honest object. The action falls
 * back to the telephone when no address is on file, so it is never a
 * dead link.
 */
export function Reach() {
  const details = [
    { label: "Address", value: contact.address },
    { label: "Telephone", value: contact.phone },
    ...(contact.email ? [{ label: "Email", value: contact.email }] : []),
  ]

  const action = contact.email
    ? { label: "Write to us", href: `mailto:${contact.email}` }
    : { label: "Call us", href: `tel:${contact.phone.replace(/\s/g, "")}` }

  return (
    <Register id="reach" tone="night" height="vast" className="overflow-hidden">
      <Figure
        name="wheel" opacity={0.18}
        turning
        className="pointer-events-none absolute hidden sm:block left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 text-[var(--ink-faint)] lg:h-[42rem] lg:w-[42rem]"
      />

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sequence}
        className="relative mx-auto flex max-w-[52ch] flex-col items-center text-center"
      >
        <m.p variants={rise} className="tick mb-[var(--s-4)]">
          {contact.eyebrow}
        </m.p>
        <m.h2 variants={rise} className="mb-[var(--s-4)] max-w-[14ch] text-register text-[var(--ink)]">
          {contact.heading}
        </m.h2>
        <m.p variants={rise} className="mb-[var(--s-6)] text-lead text-[var(--ink-soft)]">
          {contact.body}
        </m.p>

        <m.dl variants={rise} className="mb-[var(--s-6)] flex flex-col items-center gap-[var(--s-4)]">
          {details.map((d) => (
            <div key={d.label} className="flex flex-col items-center">
              <dt className="tick mb-[var(--s-2)]">{d.label}</dt>
              <dd
                className="max-w-[34ch] text-lead text-[var(--ink)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {d.value}
              </dd>
            </div>
          ))}
        </m.dl>

        <m.div variants={rise}>
          <Action href={action.href} weight="solid">
            {action.label}
          </Action>
        </m.div>
      </m.div>
    </Register>
  )
}
