import { useSyncExternalStore } from "react"

function subscribe(query: string, callback: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

/** Reactive `matchMedia` check, e.g. `useMediaQuery(breakpoints.md)`. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => window.matchMedia(query).matches,
    () => false
  )
}
