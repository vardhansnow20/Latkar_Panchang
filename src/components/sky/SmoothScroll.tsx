import { useEffect } from "react"
import Lenis from "lenis"
import { useReducedMotion } from "@/hooks/useReducedMotion"

/**
 * Momentum scrolling for the whole journey.
 *
 * Lenis drives the *native* scroll position rather than transforming a
 * container, which matters more than it sounds: every scroll-linked
 * thing on this page — the parallax planes, the celestial rail, the
 * body indicator — reads `window.scrollY` and listens for real scroll
 * events. Nothing needed rewiring, and native scrollbars, anchor
 * links, find-in-page and keyboard paging all keep working.
 *
 * Deliberately gentle values: `lerp` 0.09 gives a long, heavy glide
 * suited to a page that is meant to be travelled slowly, without the
 * rubbery overshoot that makes momentum scrolling feel like a toy.
 *
 * Under `prefers-reduced-motion` it never initialises at all — a
 * smoothed scroll is precisely the kind of vestibular effect that
 * setting exists to switch off, so the browser's own scrolling is
 * left completely untouched.
 */
export function SmoothScroll() {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.9,
      // Touch devices already have excellent native momentum; layering
      // ours on top fights the platform and feels worse, not better.
      syncTouch: false,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    // In-page anchors have to be handed to Lenis, or the browser jumps
    // instantly and the smoothing is bypassed for exactly the links
    // most likely to be used.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute("href")?.slice(1)
      if (!id) return
      const target = document.getElementById(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: 0, duration: 1.5 })
    }
    document.addEventListener("click", onClick)

    return () => {
      document.removeEventListener("click", onClick)
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [prefersReducedMotion])

  return null
}
