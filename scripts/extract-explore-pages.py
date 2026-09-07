"""
Render the pages the "Explore the Panchang" walk exhibits.

Those seven beats had no photography and stood as empty mounts. The
client's own print-ready PDFs contain the real thing, so the pages are
rendered from them directly rather than waiting on photography.

Which page is which was decided by reading them, not by guessing:

    cover p1   the invocations printed at the front
    cover p3   the year's festival list, month by month
    p36        a daily page from one of the monthly spreads
    p88        the reference tables: months, tithis, yogas, karanas
    p90        muhurat for setting out, by month, tithi, vara, nakshatra
    p84        cropped, as a close look at the almanac's typesetting

Companion to extract-edition-pages.py, which does the same for the
"Inside the Panchang" register. These plates are capped at 15rem and
never open a lightbox, so only one size is produced — the page already
carries more image weight than it should.

    python -m pip install pypdfium2 pillow
    python scripts/extract-explore-pages.py
"""

import os

import pypdfium2 as pdfium

ASSETS = r"C:\Users\Vardhan\Downloads\117 years legacy document\assets"
COVER = os.path.join(ASSETS, "panchangcover25.pdf")
INTERIOR = os.path.join(ASSETS, "panchang-prn-1947.pdf")

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "editions")

# Plates are capped at 15rem tall (240px). At the page's √2 landscape
# proportion that is ~340px wide, so 760px covers a high-density
# display with headroom and nothing more.
WIDTH = 760
QUALITY = 80

# (pdf, zero-based page, slug, crop as (left, top, right, bottom)
#  fractions of the page, or None for the whole page)
PAGES = [
    (COVER, 1, "invocations", None),
    (COVER, 3, "festival-dates", None),
    (INTERIOR, 36, "daily-page", None),
    (INTERIOR, 88, "reference-tables", None),
    (INTERIOR, 90, "muhurat-page", None),
    # A column of running prose, cropped upright — the point is the
    # texture of the type, so a whole landscape page would show it too
    # small to read as anything.
    (INTERIOR, 84, "typesetting-detail", (0.10, 0.13, 0.40, 0.72)),
]


def main() -> None:
    out_dir = os.path.normpath(OUT)
    os.makedirs(out_dir, exist_ok=True)

    docs: dict[str, pdfium.PdfDocument] = {}

    for src, index, slug, crop in PAGES:
        doc = docs.setdefault(src, pdfium.PdfDocument(src))
        if index >= len(doc):
            print(f"skip {slug}: page {index} beyond {len(doc)}")
            continue

        # Rendered large, then cropped and resized down, so a crop is
        # not a handful of upscaled pixels.
        image = doc[index].render(scale=4.0).to_pil().convert("RGB")

        if crop:
            w, h = image.size
            left, top, right, bottom = crop
            image = image.crop(
                (int(w * left), int(h * top), int(w * right), int(h * bottom))
            )

        if image.width > WIDTH:
            height = round(image.height * WIDTH / image.width)
            image = image.resize((WIDTH, height), 1)  # LANCZOS

        path = os.path.join(out_dir, f"{slug}.webp")
        image.save(path, "WEBP", quality=QUALITY, method=6)
        size_kb = round(os.path.getsize(path) / 1024)
        ratio = image.width / image.height
        print(f"{slug:<22} {image.size[0]}x{image.size[1]}  {size_kb}kB  ratio {ratio:.4f}")


if __name__ == "__main__":
    main()
