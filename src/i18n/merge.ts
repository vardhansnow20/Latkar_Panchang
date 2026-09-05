/**
 * Deep-merge a partial translation over the base language.
 *
 * ── Why an overlay, and not two parallel dictionaries ──────────────
 * The obvious shape for a bilingual site is `en.ts` and `mr.ts` as
 * complete mirrors of each other. It is also the shape that rots: the
 * two drift, a key added to one is forgotten in the other, and the
 * failure mode is a blank space on a live page.
 *
 * Here English is the single source of truth and Marathi is a partial
 * overlay on top of it. Three things follow from that:
 *
 *   — a missing Marathi string renders the English one rather than
 *     nothing, so the page is never broken by an incomplete
 *     translation;
 *   — the overlay is a `DeepPartial` of the English tree, so a typo in
 *     a key is a *type error* rather than a silent miss;
 *   — the client's authentic Marathi can be filled in key by key, at
 *     whatever pace it arrives, with no code change.
 *
 * Arrays merge element-wise by index, which is what the content
 * actually needs: the four timeline entries and eleven archive plates
 * are fixed sequences, and a translator supplies the second entry's
 * text without restating the other three.
 */

/**
 * Leaves widen to their primitive type.
 *
 * Several data modules are declared `as const`, so their strings carry
 * literal types — `"Latkar Panchang"` rather than `string`. Without
 * widening, a translation would have to equal the English text to
 * typecheck, which is the exact opposite of the point.
 */
export type DeepPartial<T> = T extends readonly (infer U)[]
  ? readonly DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T extends string
      ? string
      : T extends number
        ? number
        : T extends boolean
          ? boolean
          : T

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function mergeContent<T>(base: T, overlay: DeepPartial<T> | undefined): T {
  if (overlay === undefined || overlay === null) return base

  if (Array.isArray(base)) {
    const layer = overlay as readonly unknown[]
    // Index-wise: an overlay shorter than the base leaves the tail in
    // the base language rather than truncating the list.
    return base.map((item, i) =>
      i < layer.length ? mergeContent(item, layer[i] as never) : item
    ) as unknown as T
  }

  if (isPlainObject(base) && isPlainObject(overlay)) {
    const out: Record<string, unknown> = { ...base }
    for (const key of Object.keys(overlay)) {
      const next = overlay[key]
      if (next === undefined) continue
      out[key] = mergeContent((base as Record<string, unknown>)[key], next as never)
    }
    return out as T
  }

  // A leaf: null is a meaningful value in this content (an absent
  // image src), so only `undefined` means "not translated".
  return overlay as T
}
