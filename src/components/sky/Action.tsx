import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Actions come in two weights, and the distinction is deliberate.
 *
 * `quiet` is a text link with a rule that draws in on pointer — the
 * right treatment for the dozen secondary actions scattered through
 * a long editorial page, where a row of filled buttons would read as
 * a product site.
 *
 * `solid` is the one call to action per page that has to be found
 * without looking: struck brass, its own light, an arrow that steps
 * forward on hover. The opening previously used the quiet treatment
 * for its primary action, which meant the single most important
 * click on the site was indistinguishable from a caption.
 */
export function Action({
  href,
  weight = "quiet",
  className,
  children,
}: {
  href: string
  weight?: "solid" | "quiet"
  className?: string
  children: ReactNode
}) {
  if (weight === "solid") {
    return (
      <a
        href={href}
        className={cn(
          "group/cta relative inline-flex items-center gap-[var(--s-3)] overflow-hidden rounded-full",
          "px-[clamp(1.75rem,4vw,2.75rem)] py-[clamp(0.95rem,1.6vw,1.35rem)] text-[1.02rem]",
          "text-[var(--color-indigo)] transition-[transform,box-shadow] duration-[var(--t-reveal)] ease-[var(--ease)]",
          "hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,248,230,0.7)_inset,0_-1px_0_rgba(90,66,30,0.35)_inset,0_18px_46px_-14px_rgba(176,141,87,0.95),0_3px_10px_rgba(20,24,40,0.4)]",
          "focus-visible:-translate-y-0.5",
          className
        )}
        style={{
          // Struck brass rather than a flat fill: a light edge at the
          // top, deeper metal at the bottom.
          backgroundImage:
            "linear-gradient(168deg, #f0e0bd 0%, #d9c9a3 34%, #c2a273 66%, #ab8a52 100%)",
          boxShadow:
            "0 1px 0 rgba(255,248,230,0.65) inset, 0 -1px 0 rgba(90,66,30,0.35) inset, 0 10px 30px -12px rgba(176,141,87,0.75), 0 2px 6px rgba(20,24,40,0.35)",
        }}
      >
        {/* Glass over the metal: a bright meniscus across the upper
            half, falling away to nothing at the waist. This is the
            single detail that separates "gold-coloured button" from
            "polished object" — it gives the surface a curve. */}
        <span
          aria-hidden="true"
          // No radius of its own. The pill already clips with
          // `overflow-hidden rounded-full`, and `rounded-t-full` on a
          // half-height box resolves to a huge elliptical edge that
          // cuts visibly across the metal near both ends — which is
          // the "broken texture" at the button's tail.
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,253,246,0.55) 0%, rgba(255,250,235,0.18) 55%, transparent 100%)",
          }}
        />
        {/* A cooler reflection pooling along the bottom edge, as light
            bounces back up into a curved surface. */}
        <span
          aria-hidden="true"
          // Full width with a horizontal falloff, rather than inset to
          // 12% with a radius. The inset produced two hard vertical
          // terminations near the ends; a mask fades the pool out
          // instead, which is what a reflection actually does.
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%]"
          style={{
            background:
              "linear-gradient(0deg, rgba(255,246,222,0.28) 0%, transparent 100%)",
            maskImage:
              "linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%)",
          }}
        />

        {/* The light that crosses the metal on approach. Transform
            only, and confined by the pill's own overflow. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-[60%] w-[55%] -skew-x-12 opacity-0 transition-[transform,opacity] duration-[900ms] ease-[var(--ease)] group-hover/cta:translate-x-[320%] group-hover/cta:opacity-100 group-focus-visible/cta:translate-x-[320%] group-focus-visible/cta:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,252,240,0.75), transparent)",
          }}
        />
        <span className="relative font-medium tracking-[var(--tracking-wide)]">{children}</span>
        <ArrowRight
          size={17}
          strokeWidth={2}
          aria-hidden="true"
          className="relative transition-transform duration-[var(--t-reveal)] ease-[var(--ease)] group-hover/cta:translate-x-1 group-focus-visible/cta:translate-x-1"
        />
      </a>
    )
  }

  return (
    <a
      href={href}
      className={cn(
        "group/action inline-flex flex-col gap-[var(--s-1)] -my-[var(--s-2)] py-[var(--s-2)]",
        className
      )}
    >
      <span className="text-body text-[var(--ink-soft)] transition-colors duration-[var(--t-quick)] group-hover/action:text-[var(--ink)]">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="h-px origin-left scale-x-0 bg-[var(--color-brass)] transition-transform duration-[var(--t-reveal)] ease-[var(--ease)] group-hover/action:scale-x-100 group-focus-visible/action:scale-x-100"
      />
    </a>
  )
}
