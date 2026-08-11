/**
 * Resolve a file in `public/` to a URL the browser can actually fetch.
 *
 * This project deploys under a sub-path (`base` in vite.config.ts is
 * "/kolhapur-latkar-panchang/" for GitHub Pages). A root-absolute
 * path like "/editions/cover-116.webp" therefore points *above* the
 * app's base and 404s — in dev and in production alike. Every
 * archival image on the site was written that way and none of them
 * were loading; the mounts rendered, the photographs did not.
 *
 * `import.meta.env.BASE_URL` is Vite's own value for that prefix and
 * always carries a trailing slash, so callers pass a path with no
 * leading slash:
 *
 *     asset("editions/cover-116.webp")
 *
 * Using this rather than hard-coding the prefix means the same code
 * works when served from the domain root, from a sub-path, or from a
 * preview deployment on some other prefix entirely.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`
}
