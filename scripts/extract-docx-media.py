"""一次性脚本：从 docs/resources.docx 提取 word/media/* 并按用途分发到 public/images 子目录。

执行后会同时做长边压缩（jpg quality=82, png 保持无损 optimize），避免新加图把
public/images 总量再次推高。
"""
from __future__ import annotations
import io
import zipfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DOCX = ROOT / "docs" / "resources.docx"
OUT = ROOT / "public" / "images"

# (docx image index, 输出子目录, 文件名 stem) — 不带扩展名，扩展名用 docx 内文件原扩展
MAPPING: list[tuple[int, str, str]] = [
    (1, "founders", "jessie"),
    (2, "founders", "anna"),
    (3, "coaches", "xiaowei"),
    (4, "coaches", "xiaolu"),
    (5, "coaches", "duoer"),
    (6, "coaches", "amy"),
    (7, "coaches", "yufei"),
    (8, "coaches", "vivian"),
    (9, "coaches", "vare"),
    (10, "coaches", "grace"),
    (11, "coaches", "anne"),
    (12, "coaches", "mia"),
]
# image13..image19 → courses/course-1..course-7
for i in range(13, 20):
    MAPPING.append((i, "courses", f"course-{i - 12}"))
# image20..image59 → cases/case-01..case-40
for i in range(20, 60):
    MAPPING.append((i, "cases", f"case-{i - 19:02d}"))

MAX_LONG_SIDE = 1600
JPG_QUALITY = 82


def save_optimized(data: bytes, ext: str, dest: Path) -> None:
    img = Image.open(io.BytesIO(data))
    if max(img.size) > MAX_LONG_SIDE:
        ratio = MAX_LONG_SIDE / max(img.size)
        img = img.resize(
            (int(img.width * ratio), int(img.height * ratio)),
            Image.LANCZOS,
        )
    dest.parent.mkdir(parents=True, exist_ok=True)
    if ext == ".png":
        if img.mode == "P":
            img = img.convert("RGBA")
        img.save(dest, "PNG", optimize=True)
    else:
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        img.save(dest, "JPEG", quality=JPG_QUALITY, optimize=True, progressive=True)


def main() -> None:
    with zipfile.ZipFile(DOCX) as z:
        for idx, sub, stem in MAPPING:
            # docx 里的图片可能是 .png / .jpeg / .jpg
            candidates = [n for n in z.namelist() if n.startswith(f"word/media/image{idx}.")]
            if not candidates:
                print(f"[skip] image{idx} 不存在")
                continue
            src_name = candidates[0]
            ext = Path(src_name).suffix.lower()
            if ext == ".jpeg":
                ext = ".jpg"
            dest = OUT / sub / f"{stem}{ext}"
            save_optimized(z.read(src_name), ext, dest)
            print(f"  -> {dest.relative_to(ROOT)}")
    print("Done.")


if __name__ == "__main__":
    main()
