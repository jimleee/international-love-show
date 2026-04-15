"""一次性脚本：批量压缩 public/images/ 下的图片以减少首屏负载。"""
from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public" / "images"

CONFIGS = [
    ("party", 1000, 80, [".jpg"]),
    ("stories", 1000, 82, [".jpg"]),
    ("home", 1400, 85, [".jpg", ".jpeg"]),
    ("carousel", 1400, 0, [".png"]),
]


def resize_inplace(p: Path, max_w: int) -> None:
    img = Image.open(p)
    if img.width <= max_w:
        return
    ratio = max_w / img.width
    img = img.resize((max_w, int(img.height * ratio)), Image.LANCZOS)
    if p.suffix.lower() == ".png":
        img.save(p, "PNG", optimize=True)
    else:
        img.convert("RGB").save(p, "JPEG", quality=85, optimize=True, progressive=True)


def opt_jpg(p: Path, max_w: int, q: int) -> None:
    img = Image.open(p)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, int(img.height * ratio)), Image.LANCZOS)
    img.save(p, "JPEG", quality=q, optimize=True, progressive=True)


for folder, max_w, q, exts in CONFIGS:
    d = ROOT / folder
    if not d.exists():
        continue
    for f in d.iterdir():
        if f.suffix.lower() not in exts:
            continue
        if f.suffix.lower() == ".png":
            resize_inplace(f, max_w)
        else:
            opt_jpg(f, max_w, q)

print("Done.")
