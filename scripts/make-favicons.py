"""Regenerate the favicon set from the original avatar.

The shipped icons are plain downscales of `public/favicon/avatar.webp`: the
whole image is scaled to each icon size with no cropping, no corner masking and
no colour treatment, so the tab icon shows exactly the avatar and nothing else.

    python scripts/make-favicons.py

Requires Python 3 with Pillow (`pip install Pillow`).

Downscaling a detailed illustration this far does get soft at 32px - that is
expected for a whole-image favicon, and the point of this script is to keep the
icon faithful to the artwork rather than to make a zoomed-in crop of it.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "favicon" / "avatar.webp"
OUT = ROOT / "public" / "favicon"

# 32 = browser tab, 128/192 = bookmarks and Android home screen,
# 180 = iOS "add to home screen".
SIZES = (32, 128, 180, 192)


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"favicon source not found: {SRC}")

    src = Image.open(SRC)
    if src.width != src.height:
        raise SystemExit(
            f"favicon source is {src.width}x{src.height}; a square source is "
            "required so that scaling to a square icon does not distort it."
        )
    src = src.convert("RGB")

    for size in SIZES:
        path = OUT / f"avatar-{size}.png"
        src.resize((size, size), Image.LANCZOS).save(path, "PNG", optimize=True)
        print(f"wrote {path.relative_to(ROOT)}  {size}x{size}  {path.stat().st_size} B")


if __name__ == "__main__":
    main()
