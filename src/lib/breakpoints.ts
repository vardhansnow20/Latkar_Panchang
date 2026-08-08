/**
 * JS-side mirror of the `--breakpoint-*` tokens in styles/tokens.css.
 * Tailwind consumes the CSS versions directly for `sm:`/`md:` etc.;
 * this file exists for the rare case JS needs the same numbers —
 * e.g. choosing an Embla Carousel option per breakpoint. Keep the
 * two in sync by hand; there are only five values.
 */
export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

export const mediaQuery = (breakpoint: Breakpoint) =>
  `(min-width: ${breakpoints[breakpoint]}px)`
