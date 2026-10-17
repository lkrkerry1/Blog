"""Regenerate the Shirone favicon set from the author avatar.

The committed files under `public/favicon/avatar-*.png` were produced by this
script, so re-run it after replacing `public/images/avatar.webp`:

    python scripts/make-favicons.py

Requires Python 3 with Pillow (`pip install Pillow`).

The crop is a fixed face framing chosen by visually comparing candidates: the
face and the hood silhouette have to stay readable at 32px. Adjust `CROP_BOX`
if you swap in a differently framed avatar.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "images" / "avatar.webp"
OUT = ROOT / "public" / "favicon"

# Face framing in the 640x640 source image (re-measured after the avatar swap).
CROP_BOX = (160, 125, 440, 405)

SIZES = (32, 128, 180, 192)
CORNER_RATIO = 0.22
SS = 4  # supersample factor, gives antialiased squircled corners

# A hairline ring keeps the icon separated from the tab bar it sits on:
# dark ring for light browser chrome, light ring for dark browser chrome.
RING = {
    "light": (12, 26, 64, 100),
    "dark": (255, 255, 255, 120),
}


def squircle_mask(size: int, ss: int = SS) -> Image.Image:
    big = size * ss
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, big - 1, big - 1), radius=int(big * CORNER_RATIO), fill=255
    )
    return mask.resize((size, size), Image.LANCZOS)


def ring_overlay(size: int, color: tuple[int, int, int, int], ss: int = SS) -> Image.Image:
    big = size * ss
    layer = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    ImageDraw.Draw(layer).rounded_rectangle(
        (0, 0, big - 1, big - 1),
        radius=int(big * CORNER_RATIO),
        outline=color,
        width=max(ss, 1),
    )
    return layer.resize((size, size), Image.LANCZOS)


def build(crop: Image.Image, size: int, variant: str) -> Image.Image:
    if variant == "light":
        tint = ImageEnhance.Color(crop).enhance(1.15)
        tint = ImageEnhance.Contrast(tint).enhance(1.10)
        tint = ImageEnhance.Brightness(tint).enhance(0.96)
    else:
        tint = ImageEnhance.Color(crop).enhance(1.05)
        tint = ImageEnhance.Brightness(tint).enhance(1.08)

    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(tint.resize((size, size), Image.LANCZOS), (0, 0), squircle_mask(size))
    out.alpha_composite(ring_overlay(size, RING[variant]))
    return out


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"avatar not found: {SRC}")

    OUT.mkdir(parents=True, exist_ok=True)
    src = Image.open(SRC).convert("RGB")
    crop = src.crop(CROP_BOX)

    for variant in ("light", "dark"):
        for size in SIZES:
            path = OUT / f"avatar-{variant}-{size}.png"
            img = build(crop, size, variant)
            img.save(path, "PNG", optimize=True)
            print(f"wrote {path.relative_to(ROOT)}  {img.size}  {path.stat().st_size} B")


if __name__ == "__main__":
    main()
