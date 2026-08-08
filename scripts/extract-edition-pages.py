"""
Render selected pages of the client's edition PDFs to WebP.

The client supplies the Panchang as print-ready PDFs — a cover file
and a ~96pp interior file. Those are source documents, not web
assets: a single page at print resolution is many megabytes, and the
whole interior is far past anything a landing page should carry. This
script renders only the handful of pages the site actually exhibits,
at two sizes: a display copy for the page and a larger copy for the
lightbox.

Companion to scripts/optimize-legacy-images.mjs, which does the same
job for the photographic archive.

    python -m pip install pypdfium2 pillow
    python scripts/extract-edition-pages.py

Page indices are zero-based and were chosen by eye. Re-run after
changing PAGES; output is written to public/editions/ and is safe to
overwrite.
"""

import os
import pypdfium2 as pdfium

ASSETS = r"C:\Users\Vardhan\Downloads\117 years legacy document\assets"
COVER = os.path.join(ASSETS, "panchangcover25.pdf")
# Named for Shalivahan Shake 1947, which is 2025-26 CE — not a 1947
# CE edition. See the note at the top of src/data/edition.ts.
INTERIOR = os.path.join(ASSETS, "panchang-prn-1947.pdf")

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "editions")

# (source pdf, zero-based page index, output slug)
PAGES = [
    (COVER, 0, "cover-116"),
    (INTERIOR, 0, "rajavali"),
    (INTERIOR, 12, "tables"),
    (INTERIOR, 45, "ephemeris"),
]

# Display copy, then the lightbox copy. Scale is a multiplier on the
# PDF's own point size; 2.2 lands around 1850px wide for these pages.
RENDITIONS = [(2.2, "", 82), (4.0, "-full", 88)]


def main() -> None:
    out_dir = os.path.normpath(OUT)
    os.makedirs(out_dir, exist_ok=True)

    # Documents are opened once and reused: the interior file is ~44MB
    # and reopening it per page is the slowest part of this script.
    docs: dict[str, pdfium.PdfDocument] = {}

    for src, index, slug in PAGES:
        doc = docs.setdefault(src, pdfium.PdfDocument(src))
        if index >= len(doc):
            print(f"skip {slug}: page {index} beyond {len(doc)}")
            continue
        page = doc[index]
        for scale, suffix, quality in RENDITIONS:
            image = page.render(scale=scale).to_pil().convert("RGB")
            path = os.path.join(out_dir, f"{slug}{suffix}.webp")
            image.save(path, "WEBP", quality=quality, method=6)
            size_kb = round(os.path.getsize(path) / 1024)
            print(f"{slug}{suffix}  {image.size[0]}x{image.size[1]}  {size_kb}KB")


if __name__ == "__main__":
    main()
