#!/usr/bin/env python3
"""
Watermark raw Midjourney illustrations with "TigmaMinds Academy"
and save with friendly names. Also compresses to WebP.

Usage: python3 scripts/watermark.py
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Paths
RAW_DIR = Path("content/illustrations-raw")
OUT_PNG_DIR = Path("content/illustrations")
OUT_WEBP_DIR = Path("public/content/illustrations")

WATERMARK_TEXT = "tigmaminds.academy"

# Mapping: raw filename (partial match on UUID) -> friendly name
MAPPING = {
    "17ea0de9": "tejimola",
    "ebea385e": "fun-facts",
    "96172511": "majuli-born",
    "de543fe7": "rhino-horn",
    "675c7da1": "dancing-deer",
    "fc88b74f": "elephant-ant",
    "aa7ca883": "golden-deer",
    "d3cbbd0d": "bridge-grew",
    "ad653a13": "brahmaputra-angry",
    "090552bb": "gibbon-song",
    "d3467046": "boy-clouds",
    "5377d054": "tea-leaf-fly",
    "fe7775a6": "bamboo-flute",
    "64c4013e": "weaver-girl",  # has a duplicate "(1)" file, we'll just use the first match
    # These two raws have no current friendly name:
    "4bdb5359": "rhino-children-bridge",  # new: colorful rhino with children on red bridge
    "414b18a7": "brahmaputra-flood",      # new: flooding river through villages
}

# Skip duplicates (the "(1)" file)
SKIP_DUPLICATES = True


def add_watermark(img: Image.Image, text: str) -> Image.Image:
    """Add semi-transparent watermarks: four corners + center."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Try to find a good font, fall back to default
    font_size = max(18, img.width // 45)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except (OSError, IOError):
        try:
            font = ImageFont.truetype("/System/Library/Fonts/SFNSMono.ttf", font_size)
        except (OSError, IOError):
            font = ImageFont.load_default()

    # Measure text
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    margin = max(20, img.width // 30)
    shadow_color = (0, 0, 0, 35)
    text_color = (255, 255, 255, 55)

    # 5 positions: four corners + center
    positions = [
        (margin, margin),                                           # top-left
        (img.width - text_w - margin, margin),                     # top-right
        (margin, img.height - text_h - margin),                    # bottom-left
        (img.width - text_w - margin, img.height - text_h - margin),  # bottom-right
        ((img.width - text_w) // 2, (img.height - text_h) // 2),  # center
    ]

    for (x, y) in positions:
        draw.text((x + 2, y + 2), text, font=font, fill=shadow_color)
        draw.text((x, y), text, font=font, fill=text_color)

    # Composite
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    watermarked = Image.alpha_composite(img, overlay)
    return watermarked


def process():
    os.makedirs(OUT_PNG_DIR, exist_ok=True)
    os.makedirs(OUT_WEBP_DIR, exist_ok=True)

    raw_files = sorted(RAW_DIR.glob("*.png"))
    processed = set()
    stats = {"watermarked": 0, "skipped": 0, "webp_total_kb": 0, "png_total_kb": 0}

    for raw_file in raw_files:
        # Find matching friendly name by UUID
        friendly = None
        for uuid_part, name in MAPPING.items():
            if uuid_part in raw_file.name:
                friendly = name
                break

        if not friendly:
            print(f"  SKIP (no mapping): {raw_file.name}")
            stats["skipped"] += 1
            continue

        # Skip duplicates
        if friendly in processed and SKIP_DUPLICATES:
            print(f"  SKIP (duplicate): {raw_file.name} -> {friendly}")
            stats["skipped"] += 1
            continue

        processed.add(friendly)
        print(f"  {raw_file.name[:60]}... -> {friendly}")

        # Load
        img = Image.open(raw_file)
        original_kb = raw_file.stat().st_size // 1024

        # Watermark
        watermarked = add_watermark(img, WATERMARK_TEXT)

        # Save PNG (for archival)
        png_path = OUT_PNG_DIR / f"{friendly}.png"
        watermarked_rgb = watermarked.convert("RGB")
        watermarked_rgb.save(png_path, "PNG", optimize=True)
        png_kb = png_path.stat().st_size // 1024
        stats["png_total_kb"] += png_kb

        # Save WebP (for web)
        webp_path = OUT_WEBP_DIR / f"{friendly}.webp"
        watermarked_rgb.save(webp_path, "WEBP", quality=82, method=6)
        webp_kb = webp_path.stat().st_size // 1024
        stats["webp_total_kb"] += webp_kb

        print(f"    Raw: {original_kb:,}KB -> PNG: {png_kb:,}KB -> WebP: {webp_kb:,}KB ({100*webp_kb//original_kb}%)")
        stats["watermarked"] += 1

    print(f"\nDone: {stats['watermarked']} watermarked, {stats['skipped']} skipped")
    print(f"Total PNG: {stats['png_total_kb']:,}KB ({stats['png_total_kb']//1024}MB)")
    print(f"Total WebP: {stats['webp_total_kb']:,}KB ({stats['webp_total_kb']//1024}MB)")


if __name__ == "__main__":
    process()
