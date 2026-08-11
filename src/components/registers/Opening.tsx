import { useRef } from "react"
import { m, useScroll, useTransform } from "framer-motion"
import { Register } from "@/components/sky/Register"
import { Action } from "@/components/sky/Action"
import { Orrery } from "@/components/sky/Orrery"
import {
  StarField,
  ShootingStars,
  MoteField,
  ConstellationNetwork,
  MoonDisc,
} from "@/components/sky/Celestial"
import { hero } from "@/data/hero"
import { rise, sequence } from "@/lib/motion"

/**
 * The opening, staged as a camera move rather than a layout.
 *
 * ── Hierarchy ──────────────────────────────────────────────────────
 * Everything behind the type is held down hard, so the eye lands in
 * one place. Measured as rendered opacity against the sky:
 *
 *   stars          ~10%      constellation  ~20%
 *   instrument     ~25%      moon            ~90%
 *   heading        100%
 *
 * The earlier version let the instrument sit near 70%, which put it
 * in direct competition with the headline — seven objects all asking
 * to be looked at first. Nothing here is brighter than the moon
 * except the words.
 *
 * ── Depth ──────────────────────────────────────────────────────────
 * Seven planes, each behaving differently on three axes at once:
 *
 *   plane          parallax   scale-out   fade
 *   stars            0.06        —          late
 *   nebula           0.10        —          late
 *   constellation    0.22        —          early
 *   astrolabe        0.40       1.14        mid
 *   moon             0.62       1.22        mid
 *   motes            0.80        —          late
 *   type             1.05        —          earliest
 *
 * Far things barely move and hold their light; near things travel
 * fast, grow, and clear out.
 *
 * ── Composition ────────────────────────────────────────────────────
 * The instrument is deliberately NOT concentric with the viewport —
 * it is pushed above centre so the lower third stays open. Perfect
 * centring is what made it read as engineered rather than composed.
 */
export function Opening() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Written out rather than generated: each is a hook call and must be
  // unconditional and in a stable order every render.
  const starsY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"])
  const nebulaY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])
  const netY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const labY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const moonY = useTransform(scrollYProgress, [0, 1], ["0%", "62%"])
  const motesY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"])
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "105%"])

  const labScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const moonScale = useTransform(scrollYProgress, [0, 1], [1, 1.22])
  const typeFade = useTransform(scrollYProgress, [0, 0.42], [1, 0])
  const midFade = useTransform(scrollYProgress, [0.1, 0.8], [1, 0])
  const netFade = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const skyOpen = useTransform(scrollYProgress, [0, 1], [1, 0.45])
  const cueFade = useTransform(scrollYProgress, [0, 0.16], [1, 0])

  return (
    <Register id="opening" tone="night" height="full" className="grain overflow-hidden" ref={ref}>
      {/* 1 — deep sky colour. */}
      <m.div
        style={{ y: nebulaY, opacity: skyOpen, willChange: "transform, opacity" }}
        className="nebula pointer-events-none absolute -inset-x-[10%] -inset-y-[6%] opacity-70"
        aria-hidden="true"
      />

      {/* 2 — fixed stars, held at the bottom of the hierarchy.
       *
       * The dimming opacity has to sit on an inner plain element, not
       * on the animated wrapper: framer writes `opacity` as an inline
       * style from the scroll value, and an inline style beats a
       * utility class outright. Putting the two on the same node
       * silently discards the hierarchy — which is exactly what
       * happened on the first attempt at this. */}
      <m.div
        style={{ y: starsY, opacity: skyOpen, willChange: "transform, opacity" }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 opacity-[0.5]">
          <StarField count={96} className="absolute inset-0" />
        </div>
      </m.div>
      <ShootingStars className="absolute inset-0" />

      {/* 3 — the charted figure. */}
      <m.div
        style={{ y: netY, opacity: netFade, willChange: "transform, opacity" }}
        className="pointer-events-none absolute inset-x-0 top-[2svh] flex justify-center"
        aria-hidden="true"
      >
        <div className="opacity-[0.3]">
          <ConstellationNetwork className="h-[32svh] w-[150vw] max-w-[82rem] text-[var(--color-brass-soft)] sm:w-[112vw]" />
        </div>
      </m.div>

      {/* 4 — the orrery.
          Centred on the headline rather than pushed above it, so the
          lit core sits behind the type and the words read as though
          they are inside the light. The astrolabe it replaced had to
          be held at quarter strength to stay out of the way; this
          figure is a fifth of the geometry, so it can carry more
          presence without competing. */}
      <m.div
        style={{ y: labY, scale: labScale, opacity: midFade, willChange: "transform, opacity" }}
        className="pointer-events-none absolute inset-x-0 top-[47%] flex -translate-y-1/2 justify-center"
        aria-hidden="true"
      >
        <div className="aspect-square w-[112vw] max-w-[62rem] opacity-[0.26] sm:w-[104vw] sm:opacity-[0.34] lg:w-[102svh]">
          <Orrery className="h-full w-full text-[var(--color-brass-soft)]" />
        </div>
      </m.div>

      {/* The moon's light falling on the instrument. Must live here,
          untransformed, and painted after the orrery: every other
          plane is transformed, and a transform creates a stacking
          context that isolates blend modes, so a glow authored inside
          the moon could never reach the brass. */}
      <div
        className="breathe pointer-events-none absolute inset-x-0 top-[31%] flex justify-center mix-blend-plus-lighter"
        aria-hidden="true"
      >
        <div
          className="aspect-square w-[92vw] max-w-[48rem] -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(233,214,170,0.26) 0%, rgba(176,141,87,0.13) 26%, rgba(176,141,87,0.04) 46%, transparent 66%)",
          }}
        />
      </div>

      {/* The scrim. A soft well of shadow directly beneath the words,
          so every orbit line and star passes *behind* them at reduced
          contrast instead of cutting through the letterforms. This is
          what buys the headline its legibility without dimming the
          composition as a whole. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[52%] flex -translate-y-1/2 justify-center"
        aria-hidden="true"
      >
        <div
          className="h-[62svh] w-[150vw] max-w-[70rem]"
          style={{
            background:
              "radial-gradient(ellipse 46% 50% at 50% 50%, rgba(14,18,34,0.82) 0%, rgba(14,18,34,0.58) 42%, rgba(14,18,34,0.22) 66%, transparent 82%)",
          }}
        />
      </div>

      {/* 6 — near dust. */}
      <m.div style={{ y: motesY, willChange: "transform" }} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <MoteField count={22} className="absolute inset-0" />
      </m.div>

      {/* 7 — the type. */}
      <m.div
        className="relative flex min-h-[calc(100svh-2*var(--s-4))] flex-col items-center justify-center text-center"
        initial="hidden"
        animate="visible"
        variants={sequence}
        style={{ y: typeY, opacity: typeFade, willChange: "transform, opacity" }}
      >
        <m.div variants={rise} style={{ scale: moonScale, y: moonY, willChange: "transform" }} className="mb-[clamp(0.75rem,3svh,2rem)]">
          <MoonDisc className="w-[clamp(4.5rem,12svh,10rem)]" />
        </m.div>

        <m.p variants={rise} className="tick mb-[clamp(0.6rem,2svh,1.4rem)]">
          {hero.eyebrow}
        </m.p>

        <m.h1
          variants={rise}
          className="mb-[clamp(0.7rem,2.2svh,1.5rem)] max-w-[20ch] text-[var(--ink)]"
          // Leading and tracking restated because setting font-size
          // inline bypasses the `text-chapter` utility that carries
          // them — without this the headline inherits body leading of
          // 1.72 and grows by ~160px.
          style={{
            // Restated inline, not left to the utility: an inline
            // fontSize bypasses the class that carries the matching
            // line-height, and the headline then inherits body leading
            // and grows past its container. The svh term is the guard
            // that keeps a long headline inside a short viewport.
            fontSize: "min(var(--text-hero), 14svh)",
            lineHeight: "var(--text-hero--line-height)",
            letterSpacing: "var(--text-hero--letter-spacing)",
          }}
        >
          {hero.heading}
        </m.h1>

        <m.p
          variants={rise}
          className="mb-[clamp(1.1rem,3.2svh,2.25rem)] max-w-[52ch] text-lead text-[var(--ink-soft)]"
        >
          {hero.definition}
        </m.p>

        <m.div variants={rise}>
          <Action href={hero.cta.href} weight="solid">
            {hero.cta.label}
          </Action>
        </m.div>
      </m.div>

      {/* The cue. Pinned to the floor of the viewport rather than sat
          in the stack, so it promises more page without taking any of
          the composition's room. */}
      <m.a
        href="#descent"
        style={{ opacity: cueFade }}
        className="group/cue absolute inset-x-0 bottom-[var(--s-4)] z-10 mx-auto flex w-fit flex-col items-center gap-[var(--s-2)]"
      >
        <span className="tick text-[var(--ink-faint)] transition-colors duration-[var(--t-quick)] group-hover/cue:text-[var(--ink)]">
          {hero.scrollCue}
        </span>
        <span
          aria-hidden="true"
          className="block h-[clamp(1.5rem,4svh,2.75rem)] w-px bg-gradient-to-b from-[var(--color-brass)] to-transparent"
        />
      </m.a>
    </Register>
  )
}
