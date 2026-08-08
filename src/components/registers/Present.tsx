import { m } from "framer-motion"
import { Register, Measure } from "@/components/sky/Register"
import { Plate } from "@/components/sky/Plate"
import { Action } from "@/components/sky/Action"
import { Figure } from "@/components/sky/Celestial"
import { laxmiCalendar } from "@/data/laxmiCalendar"
import { mobileApp } from "@/data/mobileApp"
import { contact } from "@/data/contact"
import { rise, unveil, sequence, viewport } from "@/lib/motion"

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
  return (
    <Register id="calendar" tone="day" height="vast" bleed className="overflow-hidden">
      <div className="mx-auto w-full max-w-[var(--frame)] pr-[var(--gutter)] pl-[calc(var(--gutter)+var(--rule-channel))]">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={rise}
          className="mb-[var(--s-6)]"
        >
          <p className="tick mb-[var(--s-3)]">{laxmiCalendar.eyebrow}</p>
          <h2 className="mb-[var(--s-3)] max-w-[14ch] text-chapter text-[var(--ink)]">
            {laxmiCalendar.heading}
          </h2>
          <Measure size="wide">
            <p className="text-lead text-[var(--ink-soft)]">{laxmiCalendar.intro}</p>
          </Measure>
        </m.div>
      </div>

      {/* Full width, no column, no margin — the only time on the page
          an object is allowed to be the layout. */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={unveil}
        className="mb-[var(--s-6)]"
      >
        <Plate image={laxmiCalendar.image} mount="none" glazed className="w-full" />
      </m.div>

      <div className="mx-auto w-full max-w-[var(--frame)] pr-[var(--gutter)] pl-[calc(var(--gutter)+var(--rule-channel))]">
        <div className="lg:flex lg:items-start lg:gap-[var(--s-6)]">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={rise}
            className="mb-[var(--s-4)] w-[38%] max-w-[11rem] lg:mb-0 lg:w-[13rem] lg:shrink-0"
          >
            <Plate image={laxmiCalendar.detailImage} mount="thin" />
          </m.div>

          <m.div initial="hidden" whileInView="visible" viewport={viewport} variants={rise}>
            <p
              className="mb-[var(--s-5)] max-w-[34ch] text-title text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {laxmiCalendar.body}
            </p>
            <Action href={laxmiCalendar.link.href}>{laxmiCalendar.link.label}</Action>
          </m.div>
        </div>
      </div>
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
    <Register id="almanac" tone="night" height="close">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="border-t border-[var(--hairline)] pt-[var(--s-4)] lg:flex lg:items-baseline lg:gap-[var(--s-6)]"
      >
        <p className="tick mb-[var(--s-3)] shrink-0 lg:mb-0">{mobileApp.eyebrow}</p>
        <div>
          <h2 className="mb-[var(--s-2)] max-w-[18ch] text-title text-[var(--ink)]">
            {mobileApp.heading}
          </h2>
          <Measure className="mb-[var(--s-4)]">
            <p className="text-body text-[var(--ink-soft)]">{mobileApp.body}</p>
          </Measure>
          <Action href={mobileApp.cta.href}>{mobileApp.cta.label}</Action>
        </div>
      </m.div>
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
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 text-[var(--ink-faint)] lg:h-[42rem] lg:w-[42rem]"
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
        <m.h2 variants={rise} className="mb-[var(--s-4)] max-w-[14ch] text-chapter text-[var(--ink)]">
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
