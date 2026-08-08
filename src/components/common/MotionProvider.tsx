import { LazyMotion, domAnimation } from "framer-motion"
import type { ReactNode } from "react"

/**
 * Loads Framer Motion's `domAnimation` feature subset instead of the
 * full bundle — this site never needs layout animation or drag, so
 * the larger bundle would be dead weight (blueprint, Performance §9).
 * Mounted once near the root. Because `strict` is on, animated
 * elements must import `m` (not `motion`) from "framer-motion".
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
