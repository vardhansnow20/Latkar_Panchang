import { useRef, useState } from "react"
import { m, useScroll, useTransform } from "framer-motion"
import { Maximize2 } from "lucide-react"
import { Register, Measure } from "@/components/sky/Register"
import { Plate } from "@/components/sky/Plate"
import { Figure } from "@/components/sky/Celestial"
import { Lightbox, type LightboxItem } from "@/components/sky/Lightbox"
import { insideEdition, editionPlates, type EditionPlate } from "@/data/edition"
import { rise, unveil, unveilSide, sequence, viewport } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

/**
 * The edition, opened — in four beats.
 *
 *   01  The Cover, closed and lifted from the table
 *   02  The Register, and the one line that anchors the whole book
 *   03  The Ephemeris, with its columns magnified under glass
 *   04  The Tables, closing smaller
 *
 * Each beat has a genuinely different wall; a visitor should never
 * see two plates at the same size. These are the only true artifacts
 * on the site — everything in the Archive is a photograph *of* the
 * tradition, where these are the tradition itself.
 *
 * Every plate opens the shared Lightbox at full resolution. That
 * matters more here than in the Archive: these pages are landscape
 * and text-dense, and at any width the page can give them they are
 * legible as objects but not as documents.
 */

/** The plates, in the shape the shared dialog expects. */
const lightboxItems: LightboxItem[] = editionPlates.map((p) => ({
  id: p.id,
  title: p.title,
  fullSrc: p.full.src,
  alt: p.image.alt,
  designation: p.designation,
  description: p.note,
}))

export function Inside() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    /* Clipping is safe here — unlike Descent, this register has no
       sticky child for an overflow container to break. */
    <Register id="inside" tone="dawn" height="vast" className="overflow-hidden">
      <Figure
        name="chart"
        opacity={0.2}
        className="pointer-events-none absolute -top-[4%] -right-[16%] h-[26rem] w-[39rem] text-[var(--ink-faint)] lg:h-[34rem] lg:w-[51rem]"
      />

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="relative mb-[var(--s-6)]"
      >
        <p className="tick mb-[var(--s-3)]">{insideEdition.eyebrow}</p>
        <h2 className="mb-[var(--s-4)] max-w-[16ch] text-chapter text-[var(--ink)]">
          {insideEdition.heading}
        </h2>
        <Measure size="wide">
          <p className="text-lead text-[var(--ink-soft)]">{insideEdition.intro}</p>
        </Measure>
      </m.div>

      <div className="relative flex flex-col gap-[var(--s-6)]">
        {editionPlates.map((plate, i) => (
          <Exhibit key={plate.id} plate={plate} index={i} onOpen={() => setOpenIndex(i)} />
        ))}
      </div>

      <Lightbox
        items={lightboxItems}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </Register>
  )
}

/**
 * A mounted page.
 *
 * Hover matches the Archive exactly — the piece settles straight and
 * lifts — so the two rooms share one physical grammar. The tap
 * affordance is always in the DOM but only shown where a pointer
 * cannot hover, since on a phone there is no other way to learn the
 * plate opens.
 */
function MountedPage({
  plate,
  onOpen,
  tilt,
  className,
}: {
  plate: EditionPlate
  onOpen: () => void
  tilt: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "group/page relative rotate-[var(--tilt)] transition-transform duration-[var(--t-reveal)] ease-[var(--ease)] hover:-translate-y-1.5 hover:rotate-0",
        className
      )}
      style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${plate.title} full screen`}
        className="block w-full cursor-zoom-in text-left"
      >
        <Plate image={plate.image} mount="deep" glazed interactive />
      </button>

      {/* Tap affordance. Hidden where hover exists, because there the
          cursor already says the plate is live. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[var(--s-3)] bottom-[var(--s-3)] flex items-center gap-[var(--s-2)] rounded-full bg-[color-mix(in_srgb,var(--color-indigo)_82%,transparent)] px-[var(--s-3)] py-[var(--s-2)] text-[var(--color-paper)] backdrop-blur-sm [@media(hover:hover)]:hidden"
      >
        <Maximize2 size={13} strokeWidth={1.75} />
        <span className="tick text-[var(--color-paper)]">Tap to open</span>
      </span>
    </div>
  )
}

function Exhibit({
  plate,
  index,
  onOpen,
}: {
  plate: EditionPlate
  index: number
  onOpen: () => void
}) {
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Beat 01 only: the cover is lifted off the table as it passes.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const coverLift = useTransform(scrollYProgress, [0, 0.5, 1], [0, -14, 0])
  const coverTurn = useTransform(scrollYProgress, [0, 0.5, 1], [0, -2, 0])

  //  0 cover — large, centred, alone
  //  1 register — hung right, its one line in the opposite margin
  //  2 ephemeris — wide and flat, magnified beside it
  //  3 tables — closing, smaller
  const layout = ["cover", "register", "ephemeris", "tables"][index] ?? "tables"
  const tilt = [-0.8, 0.7, -0.5, 0.9][index] ?? 0

  const label = (
    <m.figcaption variants={rise}>
      <span className="tick mb-[var(--s-2)] block tabular-nums">{plate.designation}</span>
      {plate.script && (
        <span
          className="mb-[var(--s-1)] block text-title leading-tight text-[var(--ink)]"
          style={{ fontFamily: "var(--font-devanagari)" }}
        >
          {plate.script}
        </span>
      )}
      <span
        className="mb-[var(--s-3)] block text-lead text-[var(--ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {plate.title}
      </span>
      <Measure>
        <span className="block text-note text-[var(--ink-soft)]">{plate.note}</span>
      </Measure>

      {/* The emotional beat of the section: one measurement, set
          apart from the prose that surrounds it. */}
      {plate.standout && (
        <span className="mt-[var(--s-5)] block border-t border-[var(--hairline)] pt-[var(--s-4)]">
          <span
            className="block text-[clamp(1.25rem,2.4vw,1.9rem)] leading-none tracking-[0.02em] text-[var(--metal)] tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {plate.standout.value}
          </span>
          <span className="mt-[var(--s-3)] block max-w-[34ch] text-body text-[var(--ink)]">
            {plate.standout.caption}
          </span>
        </span>
      )}
    </m.figcaption>
  )

  return (
    <m.figure
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={sequence}
      className="relative"
    >
      {layout === "cover" && (
        <m.div
          className="mx-auto max-w-[52rem]"
          style={
            prefersReducedMotion
              ? undefined
              : { y: coverLift, rotateY: coverTurn, transformPerspective: 1400 }
          }
        >
          <m.div variants={unveil}>
            <MountedPage plate={plate} onOpen={onOpen} tilt={tilt} />
          </m.div>
          <div className="mt-[var(--s-4)]">{label}</div>
        </m.div>
      )}

      {layout === "register" && (
        <div className="lg:flex lg:items-center lg:gap-[var(--s-6)]">
          <m.div variants={unveilSide} className="lg:order-2 lg:w-[56%] lg:shrink-0">
            <MountedPage plate={plate} onOpen={onOpen} tilt={tilt} />
          </m.div>
          <div className="mt-[var(--s-4)] lg:order-1 lg:mt-0 lg:flex-1">{label}</div>
        </div>
      )}

      {layout === "ephemeris" && (
        <div className="max-w-[58rem]">
          <m.div variants={unveil}>
            <MountedPage plate={plate} onOpen={onOpen} tilt={tilt} />
          </m.div>

          {/* The vitrine: a magnified crop of the same page, mounted
              beside it as a museum would set a glass over one corner
              of a document. */}
          <div className="mt-[var(--s-5)] lg:flex lg:items-start lg:gap-[var(--s-6)]">
            {plate.detail && (
              <m.div variants={unveilSide} className="lg:order-2 lg:w-[52%] lg:shrink-0">
                <div className="relative">
                  <Plate image={plate.detail} mount="thin" glazed />
                  <span className="tick mt-[var(--s-2)] block text-[var(--ink-faint)]">
                    Detail · the planetary columns
                  </span>
                </div>
              </m.div>
            )}
            <div className="mt-[var(--s-4)] lg:order-1 lg:mt-0 lg:flex-1">{label}</div>
          </div>
        </div>
      )}

      {layout === "tables" && (
        <div className="lg:flex lg:items-start lg:gap-[var(--s-6)]">
          <m.div variants={unveilSide} className="lg:w-[46%] lg:shrink-0">
            <MountedPage plate={plate} onOpen={onOpen} tilt={tilt} />
          </m.div>
          <div className="mt-[var(--s-4)] lg:mt-0 lg:flex-1">{label}</div>
        </div>
      )}
    </m.figure>
  )
}
