import { m } from "framer-motion"
import { Register, Measure, ChapterMark } from "@/components/sky/Register"
import { Plate } from "@/components/sky/Plate"
import { Figure } from "@/components/sky/Celestial"
import { about } from "@/data/about"
import { trustJourney, journeyStages, type JourneyStage } from "@/data/trustJourney"
import { heroPhoto, archiveThemes } from "@/data/legacyArchive"
import { rise, unveilSide, sequence, viewport } from "@/lib/motion"
import { cn } from "@/lib/utils"

/** Photographs are referenced by id rather than duplicated, so the
 * archive stays the single source for every caption and alt text. */
const collection = [heroPhoto, ...archiveThemes.flatMap((t) => t.photos)]
const archivePhotoById = (id: string) => collection.find((p) => p.id === id)

/**
 * The two morning registers: why the book is trusted, and who makes
 * it. They sit together because they are the same argument told
 * twice — once as evidence, once as lineage — and because both are
 * carried almost entirely by language rather than by photography.
 */

/**
 * The claims, set as the largest body type on the site.
 *
 * There is no photograph here at all. The previous build put a
 * placeholder press photo beside these four statements and let it
 * take half the width, which weakened the only genuinely load-bearing
 * text on the page. The claims are the evidence; they get the room.
 */
export function Trust() {
  return (
    <Register id="trust" tone="morning" height="vast" className="overflow-hidden">
      {/* Parchment: a warm field laid over the sky, so this register
          reads as paper in a room rather than another window onto the
          night. The page's own gradient is already crossing into
          morning here, so the two agree — cosmic knowledge handed on
          into human tradition. */}
      <div
        className="pointer-events-none absolute hidden sm:block inset-0 opacity-[0.55]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(233,214,170,0.55), transparent 70%), radial-gradient(ellipse 70% 45% at 20% 90%, rgba(176,141,87,0.28), transparent 72%)",
        }}
      />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <Figure
        name="yantra" opacity={0.13}
        className="pointer-events-none absolute -right-[26%] top-[8%] h-[34rem] w-[34rem] text-[var(--ink-faint)] lg:-right-[10%] lg:h-[46rem] lg:w-[46rem]"
      />

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="relative mb-[var(--s-6)]"
      >
        <p className="tick mb-[var(--s-3)]"><ChapterMark n={3} /> {trustJourney.eyebrow}</p>
        <h2 className="mb-[var(--s-4)] max-w-[16ch] text-chapter text-[var(--ink)]">
          {trustJourney.heading}
        </h2>
        <Measure size="wide">
          <p className="text-lead text-[var(--ink-soft)]">{trustJourney.intro}</p>
        </Measure>
      </m.div>

      {/* ── The journey ────────────────────────────────────────────
          Seven stages on one golden thread. The thread is a single
          element behind the whole run rather than a border per row,
          so it reads as one continuous process — which is the entire
          argument the section is making. */}
      <ol className="relative">
        {/* The thread, and its progressive gold. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-[7px] w-px bg-[var(--hairline)] lg:left-[11px]"
        />

        {journeyStages.map((stage, i) => (
          <Stage key={stage.id} stage={stage} index={i} last={i === journeyStages.length - 1} />
        ))}
      </ol>
    </Register>
  )
}

/**
 * One stage of the publishing journey.
 *
 * The photograph is mounted, not framed as a card: board, bevel, and
 * glass on the documents. Stages the document cannot yet describe
 * render as a node and a name only — present on the thread, honestly
 * empty, and ready to fill.
 */
function Stage({
  stage,
  index,
  last,
}: {
  stage: JourneyStage
  index: number
  last: boolean
}) {
  const photo = stage.photoId ? archivePhotoById(stage.photoId) : undefined
  // Documents and certificates go under glass; photographs of people
  // and places do not — the distinction is what keeps the treatment
  // meaningful rather than decorative.
  const isDocument = stage.id === "heritage" || stage.id === "verification"

  return (
    <m.li
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={sequence}
      className={cn("relative pl-[var(--s-5)] lg:pl-[var(--s-6)]", !last && "pb-[var(--s-5)]")}
    >
      {/* The node this stage occupies on the thread. */}
      <m.span
        variants={rise}
        aria-hidden="true"
        className="absolute top-[0.35em] left-0 flex size-[15px] items-center justify-center rounded-full border border-[var(--color-brass)] bg-[var(--color-paper-raised)] lg:size-[23px]"
      >
        <span className="size-[5px] rounded-full bg-[var(--color-brass)] lg:size-[7px]" />
      </m.span>

      <m.p variants={rise} className="tick mb-[var(--s-2)] tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </m.p>
      <m.h3
        variants={rise}
        className="mb-[var(--s-3)] text-title text-[var(--ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {stage.name}
      </m.h3>

      {stage.body ? (
        <div className="lg:flex lg:items-start lg:gap-[var(--s-6)]">
          <m.div variants={rise} className="lg:order-2 lg:flex-1">
            <Measure size="wide">
              <p className="text-body text-[var(--ink-soft)]">{stage.body}</p>
            </Measure>
          </m.div>

          {photo && (
            <m.figure
              variants={unveilSide}
              className="mt-[var(--s-4)] w-[64%] max-w-[15rem] lg:order-1 lg:mt-0 lg:w-[17rem] lg:max-w-none lg:shrink-0"
            >
              {/* Hung at a common height. Seven stages whose plates
                  each kept their own proportion made the thread run
                  far longer than the writing on it justified, and a
                  journey should read as one movement rather than
                  seven differently-sized stops. */}
              <Plate
                image={photo.image}
                mount={isDocument ? "deep" : "thin"}
                glazed={isDocument}
                maxHeight="11rem"
                interactive
              />
              <figcaption className="mt-[var(--s-2)] text-note text-[var(--ink-faint)]">
                {photo.title}
                {photo.year && <span className="tick ml-[var(--s-2)]">{photo.year}</span>}
              </figcaption>
            </m.figure>
          )}
        </div>
      ) : (
        /* An honest gap. The stage keeps its place on the thread; the
           reason it is empty lives in data/trustJourney.ts. */
        <m.p variants={rise} className="text-note text-[var(--ink-faint)] italic">
          Awaiting material from the archive.
        </m.p>
      )}
    </m.li>
  )
}

/**
 * The people, set as a printed profile — the one place on the site
 * that is genuinely a reading column, with the workshop plate hung
 * out into the margin beside it and the mission statement breaking
 * wider than the measure it interrupts.
 */
export function Compilers() {
  return (
    <Register id="compilers" tone="morning" height="open" className="overflow-hidden">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="mb-[var(--s-5)]"
      >
        <p className="tick mb-[var(--s-3)]">{about.eyebrow}</p>
        <h2 className="max-w-[18ch] text-register text-[var(--ink)]">{about.heading}</h2>
      </m.div>

      <div className="lg:flex lg:gap-[var(--s-6)]">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={unveilSide}
          className="mb-[var(--s-4)] w-[46%] max-w-[12rem] lg:mb-0 lg:order-2 lg:w-[16rem] lg:max-w-none lg:shrink-0"
        >
          <Plate image={about.portrait} mount="thin" />
        </m.div>

        <div className="lg:order-1">
          <Measure>
            <m.p
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={rise}
              className="mb-[var(--s-4)] text-lead text-[var(--ink-soft)]"
            >
              {about.intro}
            </m.p>
            <m.p
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={rise}
              className="text-body text-[var(--ink-soft)]"
            >
              {about.body[0]}
            </m.p>
          </Measure>

          <m.blockquote
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={rise}
            className="my-[var(--s-6)] max-w-[24ch] text-title text-[var(--ink)] lg:max-w-[30ch]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            &ldquo;{about.pullQuote}&rdquo;
          </m.blockquote>

          <Measure>
            <m.p
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={rise}
              className="text-body text-[var(--ink-soft)]"
            >
              {about.body[1]}
            </m.p>

            <m.details
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={rise}
              className="group mt-[var(--s-4)]"
            >
              <summary className="tick -my-[var(--s-2)] cursor-pointer list-none py-[var(--s-2)] transition-colors hover:text-[var(--ink)]">
                Read the full succession
              </summary>
              <p className="mt-[var(--s-3)] text-body text-[var(--ink-soft)]">
                {about.expandableDetail}
              </p>
            </m.details>
          </Measure>
        </div>
      </div>
    </Register>
  )
}
