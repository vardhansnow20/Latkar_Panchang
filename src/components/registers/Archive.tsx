import { useState } from "react"
import { m } from "framer-motion"
import { Register, Measure } from "@/components/sky/Register"
import { Plate, PlateLabel } from "@/components/sky/Plate"
import { Figure } from "@/components/sky/Celestial"
import { Lightbox, type LightboxItem } from "@/components/sky/Lightbox"
import { legacyArchive, heroPhoto, archiveThemes } from "@/data/legacyArchive"
import { rise, unveil, unveilSide, sequence, viewport } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { ArchivePhoto } from "@/types/content"

const display = { fontFamily: "var(--font-display)" }

/** Flat sequence, so Previous/Next walks the whole collection rather
 * than being trapped inside one theme. */
const collection: ArchivePhoto[] = [heroPhoto, ...archiveThemes.flatMap((t) => t.photos)]

/**
 * A plate's place in the collection — "PLATE 04 / 11".
 *
 * Deliberately a plain sequence rather than an accession code. A
 * museum-style catalogue number (KLP.2010.03 and the like) would look
 * authoritative and would be entirely invented; a plate number is
 * obviously a presentation device and claims nothing.
 */
/** The collection, in the shape the shared dialog expects. */
const lightboxItems: LightboxItem[] = collection.map((p) => ({
  id: p.id,
  title: p.title,
  fullSrc: p.fullImage.src,
  alt: p.image.alt,
  designation: p.year,
  description: p.description,
}))

const plateNumber = (photo: ArchivePhoto) => {
  const n = collection.findIndex((p) => p.id === photo.id) + 1
  return `Plate ${String(n).padStart(2, "0")} / ${collection.length}`
}

/** Small, fixed tilts. Derived from position so they are stable
 * between renders — a piece that re-hangs itself at a new angle on
 * every paint reads as a bug, not as a hand. */
const TILTS = [-1.3, 0.9, -0.6, 1.2, -1.0, 0.7, -1.4, 0.5, -0.8, 1.1, -0.5]
const tiltFor = (photo: ArchivePhoto) =>
  TILTS[collection.findIndex((p) => p.id === photo.id) % TILTS.length]

/** Gold photo-corners, as an album or a mounted document actually
 * carries. Drawn rather than imaged so they stay crisp at any size. */
function Corners() {
  const corner =
    "pointer-events-none absolute size-5 border-[var(--color-brass)]/60 lg:size-6"
  return (
    <span aria-hidden="true">
      <span className={cn(corner, "top-0 left-0 border-t border-l")} />
      <span className={cn(corner, "top-0 right-0 border-t border-r")} />
      <span className={cn(corner, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(corner, "right-0 bottom-0 border-b border-r")} />
    </span>
  )
}

/** A brass pin holding the piece to the wall. */
function Pin() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-2 left-1/2 z-10 size-[11px] -translate-x-1/2 rounded-full"
      style={{
        background: "radial-gradient(circle at 34% 30%, #f0e0bd 0%, #c2a273 48%, #8a6b3c 100%)",
        boxShadow: "0 2px 5px rgba(20,24,40,0.45), 0 0 0 1px rgba(120,92,48,0.35)",
      }}
    />
  )
}

/**
 * A piece hung on the wall.
 *
 * The tilt is the whole point: a hand-hung photograph is never quite
 * level, and one or two degrees is the difference between a gallery
 * of objects and a grid of images. On approach the piece settles
 * straight and lifts — the interaction reads as *straightening a
 * frame*, which is a gesture anyone who has been in a room with
 * pictures recognises.
 */
function Mounted({
  photo,
  onOpen,
  mount,
  glazed = false,
  corners = false,
  pinned = false,
}: {
  photo: ArchivePhoto
  onOpen: (photo: ArchivePhoto) => void
  mount: "thin" | "deep"
  glazed?: boolean
  corners?: boolean
  pinned?: boolean
}) {
  return (
    <div
      // Tilt travels as a custom property so both the resting angle
      // and the hover reset are plain utility classes on the same
      // property. An inline `transform` would not be overridable by
      // `hover:rotate-0` at all — in Tailwind v4 those are separate
      // properties and would simply compose.
      className="group/mount relative rotate-[var(--tilt)] transition-transform duration-[var(--t-reveal)] ease-[var(--ease)] hover:-translate-y-1.5 hover:rotate-0"
      style={{ "--tilt": `${tiltFor(photo)}deg` } as React.CSSProperties}
    >
      {pinned && <Pin />}
      <div className="relative">
        <PlateButton photo={photo} onOpen={onOpen} mount={mount} glazed={glazed} />
        {corners && <Corners />}
      </div>
    </div>
  )
}

/**
 * The collection, placed in daylight.
 *
 * This is the only register built on real photographs, and it is
 * deliberately positioned late in the sunrise — historical prints and
 * certificates want warm, high-key light, and would have been lost
 * against the night at the top of the page.
 *
 * Each theme is a room with wall text, and the shape of each room is
 * different: a single held plate, a pair set off-level, a run of
 * three, a document under glass. No two themes are laid out alike,
 * because a collection presented in one repeating shape is a
 * contact sheet.
 */
export function Archive() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const open = (photo: ArchivePhoto) =>
    setOpenIndex(collection.findIndex((p) => p.id === photo.id))

  return (
    <Register id="archive" tone="morning" height="vast" className="overflow-hidden">
      <Figure
        name="yantra" opacity={0.2}
        turning
        className="pointer-events-none absolute -left-[26%] top-[8%] h-[34rem] w-[34rem] text-[var(--ink-faint)] lg:-left-[10%] lg:h-[46rem] lg:w-[46rem]"
      />
      {/* A gallery vignette — the room's light falls off at its edges,
          which is what stops a long wall of plates reading as a flat
          sheet of paper. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 58% at 50% 42%, transparent 40%, rgba(74,58,34,0.07) 72%, rgba(74,58,34,0.16) 100%)",
        }}
      />

      {/* The span is the largest thing in the opening: this room is
          organised by time before anything else. */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={rise}
        className="relative mb-[var(--s-7)]"
      >
        <p className="text-epoch text-[var(--color-brass)] tabular-nums" style={display}>
          {legacyArchive.eyebrow}
        </p>
        <div className="rule my-[var(--s-4)] h-px w-full" />
        <h2 className="mb-[var(--s-3)] max-w-[16ch] text-chapter text-[var(--ink)]">
          {legacyArchive.heading}
        </h2>
        <Measure size="wide">
          <p className="text-lead text-[var(--ink-soft)]">{legacyArchive.intro}</p>
        </Measure>
      </m.div>

      {/* The opening plate — the milestone the rest orbits. */}
      <m.figure
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={unveil}
        className="mb-[var(--s-8)]"
      >
        <Mounted photo={heroPhoto} onOpen={open} mount="deep" pinned />
        <p className="tick mt-[var(--s-3)] tabular-nums">{plateNumber(heroPhoto)}</p>
        <PlateLabel
          title={heroPhoto.title}
          year={heroPhoto.year}
          description={heroPhoto.description}
          className="mt-[var(--s-2)] max-w-[var(--measure-wide)]"
        />
      </m.figure>

      {archiveThemes.map((theme, i) => (
        <Room key={theme.id} theme={theme} index={i} onOpen={open} />
      ))}

      <Lightbox
        items={lightboxItems}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </Register>
  )
}

/** Wall text. Numbered, because a visitor walking rooms wants to
 * know how many there are. */
function RoomText({ theme, index }: { theme: (typeof archiveThemes)[number]; index: number }) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={rise}
      className="mb-[var(--s-5)]"
    >
      <div className="mb-[var(--s-3)] flex items-baseline gap-[var(--s-3)]">
        <span className="tick tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(archiveThemes.length).padStart(2, "0")}
        </span>
        <span className="rule hidden h-px flex-1 self-center sm:block" />
      </div>
      <h3 className="mb-[var(--s-2)] text-title text-[var(--ink)]">{theme.title}</h3>
      <Measure size="wide">
        <p className="text-body text-[var(--ink-soft)]">{theme.intro}</p>
      </Measure>
    </m.div>
  )
}

/**
 * One room. The layout is chosen by how many pieces it holds and
 * what kind they are, not by position in a rotation — a certificate
 * and a crowd photograph want genuinely different walls.
 */
function Room({
  theme,
  index,
  onOpen,
}: {
  theme: (typeof archiveThemes)[number]
  index: number
  onOpen: (photo: ArchivePhoto) => void
}) {
  const { photos } = theme
  // Documents are the pieces that would really sit under glass.
  const glazed = theme.id === "recognition-certificates"

  return (
    <section className="mb-[var(--s-8)]">
      <RoomText theme={theme} index={index} />

      {photos.length === 1 && (
        <m.figure
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={unveilSide}
          className={cn(
            "w-full",
            // Single pieces alternate which margin they hang from, and
            // at different widths, so consecutive rooms never present
            // the same rectangle in the same place.
            index % 2 === 0 ? "lg:w-[62%]" : "lg:ml-auto lg:w-[54%]"
          )}
        >
          <Mounted photo={photos[0]} onOpen={onOpen} mount="deep" pinned />
          <p className="tick mt-[var(--s-3)] tabular-nums">{plateNumber(photos[0])}</p>
          <PlateLabel
            title={photos[0].title}
            year={photos[0].year}
            description={photos[0].description}
            className="mt-[var(--s-2)]"
          />
        </m.figure>
      )}

      {photos.length === 2 && (
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={sequence}
          className="grid gap-[var(--s-5)] sm:grid-cols-2 sm:gap-[var(--s-6)]"
        >
          {photos.map((photo, i) => (
            <m.figure key={photo.id} variants={rise} className={i === 1 ? "sm:mt-[var(--s-7)]" : ""}>
              {/* Documents get gold photo-corners; a certificate is
                  the one kind of piece that is really mounted that
                  way, so giving them to everything would flatten the
                  distinction rather than raise it. */}
              <Mounted
                photo={photo}
                onOpen={onOpen}
                mount="deep"
                glazed={glazed}
                corners={glazed}
              />
              <p className="tick mt-[var(--s-3)] tabular-nums">{plateNumber(photo)}</p>
              <PlateLabel
                title={photo.title}
                year={photo.year}
                description={photo.description}
                className="mt-[var(--s-2)]"
              />
            </m.figure>
          ))}
        </m.div>
      )}

      {photos.length > 2 && (
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={sequence}
          className="grid gap-[var(--s-5)] sm:grid-cols-3"
        >
          {photos.map((photo, i) => (
            <m.figure
              key={photo.id}
              variants={rise}
              className={cn(
                i === 1 && "sm:mt-[var(--s-6)]",
                i === 2 && "sm:mt-[var(--s-3)]",
                // The run of three overlaps slightly into its
                // neighbour, so the wall reads as pieces laid over one
                // another rather than three columns of equal width.
                i === 1 && "sm:-ml-[var(--s-4)] sm:z-10",
                i === 2 && "sm:-ml-[var(--s-3)]"
              )}
            >
              <Mounted photo={photo} onOpen={onOpen} mount="thin" pinned={i === 1} />
              <p className="tick mt-[var(--s-3)] tabular-nums">{plateNumber(photo)}</p>
              <PlateLabel title={photo.title} year={photo.year} className="mt-[var(--s-2)]" />
            </m.figure>
          ))}
        </m.div>
      )}
    </section>
  )
}

function PlateButton({
  photo,
  onOpen,
  mount,
  glazed,
}: {
  photo: ArchivePhoto
  onOpen: (photo: ArchivePhoto) => void
  mount: "thin" | "deep"
  glazed?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(photo)}
      aria-label={`View full image: ${photo.title}`}
      className="block w-full cursor-zoom-in text-left"
    >
      <Plate image={photo.image} mount={mount} glazed={glazed} interactive />
    </button>
  )
}
