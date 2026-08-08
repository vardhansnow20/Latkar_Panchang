# Fonts

The type system (`src/styles/tokens.css`) is already wired to three
roles — display, body, and Devanagari — and works today on system
font fallbacks (Georgia/Palatino for display, the OS UI sans for
body). No visitor sees a missing-font flash; nothing breaks if this
folder stays empty through launch.

When real typefaces are chosen, self-host them here rather than
pulling from a font CDN (keeps the CSP simple and avoids a
render-blocking third-party request):

```
public/fonts/
├── display/      → the manuscript-weight display serif (headings)
├── body/         → the humanist sans (body copy)
└── devanagari/   → reserved for Sanskrit fragments (tithi names, shlokas)
```

1. Drop in `.woff2` files (subset to the glyphs actually used —
   especially important for the Devanagari face).
2. Uncomment the matching `@font-face` block in
   `src/styles/fonts.css` and point `src` at the file(s) you added.
3. Prepend the family name to the relevant stack in
   `src/styles/tokens.css` (`--font-display`, `--font-body`,
   `--font-devanagari`) — everything downstream already reads from
   those variables, so no component changes.

Keep `font-display: swap` as set in the template — see the
Performance section of the architecture blueprint for why.
