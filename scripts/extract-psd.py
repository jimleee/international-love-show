"""一次性脚本：从 轮播图(1).psd 8 个名为 1..8 的顶层组导出 PNG。

PSD 中除第一组外其余组默认隐藏，需要强制 visible 后再 composite。
按 PSD 文档画布尺寸（750x375）输出。
"""
from pathlib import Path
from psd_tools import PSDImage

ROOT = Path(__file__).resolve().parent.parent
PSD_PATH = ROOT / "轮播图(1).psd"
OUT_DIR = ROOT / "public" / "images" / "carousel"
OUT_DIR.mkdir(parents=True, exist_ok=True)

psd = PSDImage.open(PSD_PATH)
viewport = (0, 0, psd.width, psd.height)

# 找到 8 个名为 "1".."8" 的顶层组
groups = {}
for layer in psd:
    if layer.is_group() and layer.name in {"1", "2", "3", "4", "5", "6", "7", "8"}:
        groups[layer.name] = layer

exported = []
for i in range(1, 9):
    key = str(i)
    if key not in groups:
        print(f"WARN: group {key!r} not found")
        continue
    group = groups[key]
    # 强制可见以让 composite 输出
    group.visible = True
    img = group.composite(viewport=viewport)
    if img is None:
        print(f"WARN: composite returned None for group {key!r}")
        continue
    out = OUT_DIR / f"slide-{i}.png"
    img.save(out)
    exported.append((key, out.name, out.stat().st_size))

for name, fname, size in exported:
    print(f"{fname}  <-  group {name}   ({size/1024:.1f} KB)")
print(f"\nDone. {len(exported)} files in {OUT_DIR}")
