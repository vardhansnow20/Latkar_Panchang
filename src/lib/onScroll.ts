/**
 * A scroll subscription that reads at most once per animation frame.
 *
 * Scroll events fire far faster than the screen refreshes — and with
 * momentum scrolling they fire continuously for seconds after the
 * gesture ends. Three components on this page each attached their own
 * listener, and each one measured element rects and then called
 * `setState`, so a single flick could force layout and re-render the
 * masthead, the rail and the timeline dozens of times per frame. That
 * is the whole of the scroll jank.
 *
 * Coalescing to one read per frame means the browser lays out once,
 * paints once, and the work is bounded by the refresh rate no matter
 * how fast the events arrive.
 */
export function onScrollFrame(read: () => void): () => void {
  let queued = false

  const schedule = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      read()
    })
  }

  read()
  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)

  return () => {
    window.removeEventListener("scroll", schedule)
    window.removeEventListener("resize", schedule)
  }
}
