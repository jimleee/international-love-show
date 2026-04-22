# 用 resources.docx 真实内容重写各模块 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `docs/resources.docx` 里的真实素材（59 张图片 + 8 个内容段落）替换/补齐到现有静态宣传站的对应模块。

**Architecture:** 一次性 Python 脚本提取 docx 内嵌图 + 压缩 → 写真实文案到 i18n JSON → 新建 4 个 about 子组件 + 1 个 coaches + 1 个 tier group + 1 个 case story → 更新 7 个页面/section。所有新组件遵循现有 Tailwind + i18n + react-router 模式。子页用长滚动呈现，不引入弹窗或新交互模式。

**Tech Stack:** Vite + React 18 + TypeScript + Tailwind CSS + react-i18next + Python(PIL) 图片处理。**无测试框架**（既有项目无 vitest / jest，验收以 `npm run build` + 浏览器视觉走查为准）。

**Spec：** `docs/superpowers/specs/2026-04-22-content-from-docx-design.md`

---

## Task 1: 提取 docx 媒体资源到 public/images

**Files:**
- Create: `scripts/extract-docx-media.py`
- Output dirs: `public/images/founders/`, `public/images/coaches/`, `public/images/courses/`, `public/images/cases/`

**docx → 文件的映射**（基于 docx markdown 中图片出现顺序）：

| docx image # | 类型 | 输出路径 |
|---|---|---|
| image1 | 创始人 | `founders/jessie.png` |
| image2 | 创始人 | `founders/anna.png` |
| image3..image12 | 教练 | `coaches/{xiaowei,xiaolu,duoer,amy,yufei,vivian,vare,grace,anne,mia}.{ext}` |
| image13..image19 | 课程体系 | `courses/course-1.jpg ... course-7.jpg` |
| image20..image59 | 成功案例 | `cases/case-01.jpg ... case-40.jpg` |

- [ ] **Step 1: 创建提取脚本**

Create `scripts/extract-docx-media.py`:

```python
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
```

- [ ] **Step 2: 运行脚本**

```bash
cd D:/AI/my-projects/international-love-show
python scripts/extract-docx-media.py
```

Expected output: `Done.` 前打印 59 行 `-> public/images/...`（2 founders + 10 coaches + 7 courses + 40 cases = 59）。

实际验收：
```bash
ls public/images/founders/ | wc -l    # 2
ls public/images/coaches/ | wc -l     # 10
ls public/images/courses/ | wc -l     # 7
ls public/images/cases/ | wc -l       # 40
```

- [ ] **Step 3: 提交脚本 + 提取的图片**

```bash
git add scripts/extract-docx-media.py public/images/founders public/images/coaches public/images/courses public/images/cases
git commit -m "feat(assets): extract docx media + compress (founders/coaches/courses/cases)"
```

---

## Task 2: 升级 SixTeamsSection — 真实双语团队名

**Files:**
- Modify: `src/i18n/zh.json`
- Modify: `src/i18n/en.json`
- Modify: `src/components/home/SixTeamsSection.tsx`

- [ ] **Step 1: 修改 zh.json 中 home.sixTeams.items**

打开 `src/i18n/zh.json`，把 `home.sixTeams.items` 整段替换为：

```json
"items": [
  { "name": "会员筛选团队", "nameEn": "Member Selection Team", "desc": "严审背景，确保会员真实性" },
  { "name": "精准匹配团队", "nameEn": "Precision Matching Team", "desc": "深度访谈与择偶标准分析，实现双向甄选，严控品质" },
  { "name": "情感陪跑团队", "nameEn": "Emotional Support Team", "desc": "全程陪跑恋爱过程中每一个节点" },
  { "name": "形象蜕变团队", "nameEn": "Image & Confidence Team", "desc": "从穿搭到气场，从礼仪到表达，全面提升你的自信值" },
  { "name": "婚姻推进团队", "nameEn": "Relationship Progression Team", "desc": "从见面、订婚、签证到登记结婚，协助推进感情落地，处理实务细节" },
  { "name": "婚姻经营团队", "nameEn": "Marriage Enrichment Team", "desc": "婚姻不是终点，而是新的开始；陪你走入真实生活中的亲密关系" }
]
```

- [ ] **Step 2: 同步 en.json**

打开 `src/i18n/en.json`，把对应 `home.sixTeams.items` 替换为：

```json
"items": [
  { "name": "Member Selection Team", "nameEn": "会员筛选团队", "desc": "Rigorous background screening to ensure every member is verified and authentic." },
  { "name": "Precision Matching Team", "nameEn": "精准匹配团队", "desc": "In-depth interviews and partner-criteria analysis enable two-way curation and tight quality control." },
  { "name": "Emotional Support Team", "nameEn": "情感陪跑团队", "desc": "Full-journey companionship through every milestone of your relationship." },
  { "name": "Image & Confidence Team", "nameEn": "形象蜕变团队", "desc": "From wardrobe to presence, from etiquette to expression — your confidence, fully elevated." },
  { "name": "Relationship Progression Team", "nameEn": "婚姻推进团队", "desc": "From meeting and engagement to visa and marriage registration — we help your bond translate into real life." },
  { "name": "Marriage Enrichment Team", "nameEn": "Marriage Enrichment Team", "desc": "Marriage is not the finish line but a new beginning — we walk with you into real intimate life." }
]
```

注：英文版的 `nameEn` 字段在中文模式下显示英文，在英文模式下显示中文，作为副标题双语呼应。

- [ ] **Step 3: 修改 SixTeamsSection.tsx 渲染 nameEn**

替换 `src/components/home/SixTeamsSection.tsx` 全文为：

```tsx
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

type Team = { name: string; nameEn: string; desc: string };

export default function SixTeamsSection() {
  const { t } = useTranslation();
  const items = t("home.sixTeams.items", { returnObjects: true }) as Team[];

  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        {t("home.sixTeams.title")}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((tm, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-tight">{tm.name}</h3>
                <div className="text-xs uppercase tracking-wider text-foreground/50 mt-0.5">
                  {tm.nameEn}
                </div>
                <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{tm.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 验证**

```bash
npm run build
```

打开 dev server（http://localhost:5180），刷新主页，确认 6 张卡片：
- 主标题中文/英文显示正确
- 每卡显示中文名 + 小字英文名 + 多行 desc
- 切换语言按钮，所有文案随之切换

- [ ] **Step 5: 提交**

```bash
git add src/i18n/zh.json src/i18n/en.json src/components/home/SixTeamsSection.tsx
git commit -m "feat(home/six-teams): use real bilingual team names from docx"
```

---

## Task 3: CourseSystemSection 加配图

**Files:**
- Modify: `src/i18n/zh.json` 和 `en.json` (给每个 step 加 `image` 字段)
- Modify: `src/components/home/CourseSystemSection.tsx`

- [ ] **Step 1: i18n 加 image 字段**

`src/i18n/zh.json` 中 `home.courseSystem.items` 改为：

```json
"items": [
  { "stage": "破冰阶段", "desc": "认识自我与情感需求", "image": "/images/courses/course-1.jpg" },
  { "stage": "形象提升", "desc": "外形与谈吐的全面打磨", "image": "/images/courses/course-2.jpg" },
  { "stage": "约会实战", "desc": "高情商沟通与约会技巧", "image": "/images/courses/course-3.jpg" },
  { "stage": "关系升温", "desc": "建立健康长久的亲密关系", "image": "/images/courses/course-4.png" }
]
```

注：`course-4.png` 是 PNG（其余 6 张课程图都是 jpg）。

`src/i18n/en.json` 中同步（如果 en.json 已有 courseSystem.items 就改，否则按相同结构补）：

```json
"items": [
  { "stage": "Ice-Breaking", "desc": "Self-awareness and emotional needs", "image": "/images/courses/course-1.jpg" },
  { "stage": "Image Upgrade", "desc": "Polishing your look and conversation", "image": "/images/courses/course-2.jpg" },
  { "stage": "Dating in Practice", "desc": "High-EQ communication and dating skills", "image": "/images/courses/course-3.jpg" },
  { "stage": "Deepening the Bond", "desc": "Building a healthy, lasting relationship", "image": "/images/courses/course-4.png" }
]
```

- [ ] **Step 2: 改 CourseSystemSection.tsx 渲染图片**

替换 `src/components/home/CourseSystemSection.tsx` 全文：

```tsx
import { useTranslation } from "react-i18next";

type Stage = { stage: string; desc: string; image: string };

export default function CourseSystemSection() {
  const { t } = useTranslation();
  const items = t("home.courseSystem.items", { returnObjects: true }) as Stage[];

  return (
    <section className="bg-muted/30 py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("home.courseSystem.title")}
        </h2>
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {items.map((s, i) => (
            <li key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={s.image}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1">
                <div className="text-primary text-sm font-semibold mb-1">STEP {i + 1}</div>
                <div className="font-semibold text-lg mb-1">{s.stage}</div>
                <div className="text-sm text-foreground/70">{s.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 验证 + 提交**

```bash
npm run build
```

主页滚到课程体系：4 张卡片各带配图，aspect 16:9 不变形，hover 微放大。

```bash
git add src/i18n/zh.json src/i18n/en.json src/components/home/CourseSystemSection.tsx
git commit -m "feat(home/course-system): add cover images per step"
```

---

## Task 4: i18n — About 新内容（mission / vision / values / founders）

**Files:**
- Modify: `src/i18n/zh.json`
- Modify: `src/i18n/en.json`

- [ ] **Step 1: 替换 pages.about**

`src/i18n/zh.json` 中 `pages.about` 整段替换为（删除 `story2Title` / `story2Body`）：

```json
"about": {
  "title": "公司介绍",
  "subtitle": "关于 International Love Dating Club",
  "story1Title": "高端国际婚恋服务机构",
  "story1Body": "International Love Dating Club 创立于 2019 年，总部位于美国洛杉矶，是一家专注于高端跨国婚恋与女性成长的专业服务机构。我们在洛杉矶、旧金山、拉斯维加斯设有三大服务中心，在中国亦设立分公司及百余家授权合作机构。迄今为止已成功服务 30,000+ 会员，帮助她们与来自美国、英国、法国、加拿大、澳洲等国家的优质男士建立深厚情感，收获幸福婚姻。我们由一群拥有跨国婚姻经历、理解女性情感成长痛点的专业人士共同创立。我们深知幸福的不易，因此，更愿意牵起你的手，陪你走过从迷茫到坚定、从等待到拥有的每一步。",
  "stat1Value": "30,000+",
  "stat1Label": "服务会员",
  "stat2Value": "2019",
  "stat2Label": "成立于",
  "stat3Value": "3",
  "stat3Label": "服务中心",
  "citiesTitle": "三大服务中心",
  "missionTitle": "公司使命",
  "missionBody": "用生命影响生命，用光亮照亮黑暗，用善良影响迷茫，用信心疗愈绝望！赋予每位女性力量和智慧，去爱、去成长、去拥抱属于她们的幸福！",
  "visionTitle": "公司愿景",
  "visionBody": "引领女性情感成长与跨国婚恋新方向，为每一位女性提供专属的幸福解决方案，愿天下所有的女子都成为更好的自己，遇见那个对的人，拥有温暖长久的爱。",
  "valuesTitle": "公司价值观",
  "values": [
    { "name": "真实", "nameEn": "Authenticity", "desc": "用心对待每一段情感" },
    { "name": "成长", "nameEn": "Growth", "desc": "相信改变，拥抱自己" },
    { "name": "幸福", "nameEn": "Happiness", "desc": "幸福是目标，更是能力" },
    { "name": "陪伴", "nameEn": "Companionship", "desc": "不只连接，更全程陪伴" }
  ],
  "foundersTitle": "公司创始人",
  "founders": [
    {
      "name": "Jessie（冯程程）",
      "image": "/images/founders/jessie.png",
      "body": "让我们向着光明的方向前行，因为有一位伟大的女性，她就是我们敬爱的 International Love Dating Club 创始人冯程程女士。冯女士通过不懈的努力学习网络情感聊天技巧与方法，终于吸引到了心中的灵魂伴侣，并现定居于美国加州洛杉矶。2020 年一月开始，她以情感主播的身份出现在大家的视野中，经过四年多、一千多场次的直播，她为几千万姐妹解答了各种生活情感、网络恋爱情感的疑惑。冯女士潜心研究网络情感选择、交流和关系经营管理，已经帮助许多姐妹通过网络走向了世界各地，寻找到新的幸福生活。为了更好地支持需要帮助的姐妹们，她开启了 International Love Dating Club 这份爱的事业。冯女士希望成为一道光，照亮姐妹们前行的方向，分享幸福，传递善良、信心、温暖和爱。"
    },
    {
      "name": "Anna（蒋逸）",
      "image": "/images/founders/anna.png",
      "body": "在茫茫人海中，有一位独具魅力的女性，她就是我们 International Love Dating Club 公司创始人之一蒋逸女士。2017 年，蒋女士通过不懈的努力学习网络交友技巧与方法，吸引到来自美国的帅气先生。2018 年，他们结婚在美国洛杉矶，开启了一段美好的人生旅程。温柔善良、不张扬不浮躁的蒋女士，以高情商和高智慧为底蕴，于 2019 年创立了独具特色的一对一高端私人订制服务。她倾注了爱与感恩的情怀，以帮助更多姐妹找到自己的幸福为己任，带领姐妹们掌握西方文化和男士的情感需求，吸引到心中的灵魂伴侣。"
    }
  ]
}
```

- [ ] **Step 2: 替换 en.json 中的 pages.about**

```json
"about": {
  "title": "About Us",
  "subtitle": "About International Love Dating Club",
  "story1Title": "A Premier International Matchmaking Organization",
  "story1Body": "Founded in 2019 and headquartered in Los Angeles, International Love Dating Club is a professional organization focused on high-end international matchmaking and women's personal growth. We operate service centers in Los Angeles, San Francisco, and Las Vegas, with branches and over 100 partner agencies across China. We've helped over 30,000 women from all walks of life build sincere, lasting relationships with quality men from the US, UK, France, Canada, and Australia. Founded by a team of women with cross-cultural marriage experience and emotional expertise, we're here to walk beside you — through confusion and courage, from longing to lasting love.",
  "stat1Value": "30,000+",
  "stat1Label": "Members Served",
  "stat2Value": "2019",
  "stat2Label": "Founded",
  "stat3Value": "3",
  "stat3Label": "Service Centers",
  "citiesTitle": "Three Service Centers",
  "missionTitle": "Our Mission",
  "missionBody": "To inspire with life, to heal with light. To awaken lost hearts with kindness, to guide broken spirits with faith. We empower every woman with the strength and wisdom to grow, to love, and to claim her own happiness.",
  "visionTitle": "Our Vision",
  "visionBody": "To lead women toward growth and global love. To offer every woman a personalized path to happiness. So she may become her best self — and meet the right person to build a life with.",
  "valuesTitle": "Our Values",
  "values": [
    { "name": "Authenticity", "nameEn": "真实", "desc": "Every love story matters" },
    { "name": "Growth", "nameEn": "成长", "desc": "Change is power, and you deserve it" },
    { "name": "Happiness", "nameEn": "幸福", "desc": "A destination and a skill" },
    { "name": "Companionship", "nameEn": "陪伴", "desc": "We don't just match — we walk with you" }
  ],
  "foundersTitle": "Our Founders",
  "founders": [
    {
      "name": "Jessie",
      "image": "/images/founders/jessie.png",
      "body": "Let us walk toward the light, for there is a remarkable woman behind it: Ms. Jessie Feng, our beloved founder of International Love Dating Club. Through years of dedicated learning in online emotional communication, she found her own soulmate and now lives in Los Angeles, California. Since January 2020, she has appeared as an emotional-life livestream host and, over four years and more than a thousand sessions, has answered relationship questions from tens of millions of women. With deep research into online relationship selection, communication, and long-term partnership, she has guided countless women toward new lives across the globe. To better support women who need help, she launched International Love Dating Club — wishing to be a light that illuminates their path, sharing happiness and passing on kindness, faith, warmth, and love."
    },
    {
      "name": "Anna",
      "image": "/images/founders/anna.png",
      "body": "Among countless faces, there is one woman of singular charm — Ms. Anna Jiang, co-founder of International Love Dating Club. In 2017, through diligent study of online dating skills, she attracted a wonderful gentleman from the United States. In 2018, they married in Los Angeles and began a beautiful life together. Gentle, kind, and grounded, Anna combines high emotional intelligence with deep wisdom. In 2019 she created our distinctive one-on-one high-end private-bespoke service. Her work is rooted in love and gratitude — helping more women find their own happiness, guiding them to understand Western culture and emotional needs of partners, and attracting the soulmates they have been hoping for."
    }
  ]
}
```

- [ ] **Step 3: 验证 JSON 合法 + 提交**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/i18n/zh.json'))" && echo OK
node -e "JSON.parse(require('fs').readFileSync('src/i18n/en.json'))" && echo OK
```

预期两次都打印 `OK`。

```bash
git add src/i18n/zh.json src/i18n/en.json
git commit -m "feat(i18n): add about mission/vision/values/founders content from docx"
```

---

## Task 5: 新建 4 个 About 子组件

**Files:**
- Create: `src/components/about/MissionSection.tsx`
- Create: `src/components/about/VisionSection.tsx`
- Create: `src/components/about/ValuesSection.tsx`
- Create: `src/components/about/FoundersSection.tsx`

- [ ] **Step 1: MissionSection.tsx**

```tsx
import { useTranslation } from "react-i18next";

export default function MissionSection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("pages.about.missionTitle")}</h2>
        <p className="text-lg text-foreground/75 leading-loose">
          {t("pages.about.missionBody")}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: VisionSection.tsx**

```tsx
import { useTranslation } from "react-i18next";

export default function VisionSection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("pages.about.visionTitle")}</h2>
        <p className="text-lg text-foreground/75 leading-loose">
          {t("pages.about.visionBody")}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: ValuesSection.tsx**

```tsx
import { useTranslation } from "react-i18next";
import { Heart, Sprout, Smile, HandHeart } from "lucide-react";

const ICONS = [Heart, Sprout, Smile, HandHeart];

type Value = { name: string; nameEn: string; desc: string };

export default function ValuesSection() {
  const { t } = useTranslation();
  const items = t("pages.about.values", { returnObjects: true }) as Value[];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("pages.about.valuesTitle")}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((v, i) => {
            const Icon = ICONS[i] ?? Heart;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-semibold text-lg">{v.name}</div>
                <div className="text-xs uppercase tracking-wider text-foreground/50 mt-1">
                  {v.nameEn}
                </div>
                <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: FoundersSection.tsx**

```tsx
import { useTranslation } from "react-i18next";

type Founder = { name: string; image: string; body: string };

export default function FoundersSection() {
  const { t } = useTranslation();
  const items = t("pages.about.founders", { returnObjects: true }) as Founder[];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          {t("pages.about.foundersTitle")}
        </h2>
        <div className="space-y-20">
          {items.map((f, i) => (
            <div
              key={i}
              className={`flex flex-col gap-8 md:gap-12 items-center ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="w-full md:w-2/5">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="w-full h-[420px] object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-3/5 space-y-4">
                <h3 className="text-2xl md:text-3xl font-semibold">{f.name}</h3>
                <p className="text-foreground/75 leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: 提交**

```bash
git add src/components/about/
git commit -m "feat(about): add Mission/Vision/Values/Founders section components"
```

---

## Task 6: 重写 About.tsx — 装载新 section + 删除 story2

**Files:**
- Modify: `src/pages/About.tsx`

- [ ] **Step 1: 替换 About.tsx 全文**

```tsx
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Heart, MapPin } from "lucide-react";
import PageHero from "@/components/PageHero";
import MissionSection from "@/components/about/MissionSection";
import VisionSection from "@/components/about/VisionSection";
import ValuesSection from "@/components/about/ValuesSection";
import FoundersSection from "@/components/about/FoundersSection";

export default function About() {
  const { t } = useTranslation();
  const cities = ["footer.losAngeles", "footer.sanFrancisco", "footer.lasVegas"];

  return (
    <>
      <Helmet>
        <title>{t("pages.about.title") + " · " + t("brand")}</title>
        <meta name="description" content={t("pages.about.story1Body") as string} />
      </Helmet>

      <PageHero
        title={t("pages.about.title")}
        subtitle={t("pages.about.subtitle")}
        image="/images/home/team-frontdesk.jpg"
      />

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl space-y-16 md:space-y-24">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/images/home/team-frontdesk.jpg"
                  alt=""
                  className="w-full h-64 md:h-96 object-cover hover:scale-[1.02] transition-all duration-500"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary fill-primary" />
                  <span className="text-sm font-semibold">{t("brand")}</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-2xl md:text-3xl font-semibold">
                {t("pages.about.story1Title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("pages.about.story1Body")}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {cities.map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    <MapPin className="w-3 h-3" />
                    {t(k)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center bg-white rounded-2xl py-6 md:py-8 shadow-sm">
                <div className="text-2xl md:text-4xl font-bold text-primary">
                  {t(`pages.about.stat${i}Value`)}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">
                  {t(`pages.about.stat${i}Label`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MissionSection />
      <VisionSection />
      <ValuesSection />
      <FoundersSection />
    </>
  );
}
```

- [ ] **Step 2: 验证**

```bash
npm run build
```

打开 http://localhost:5180/about：
- PageHero、品牌简介长文 + cities chips、3 个数字卡 → 之后是
- 公司使命（居中、白底）
- 公司愿景（居中、灰底）
- 公司价值观（4 卡）
- 公司创始人（Jessie 左/Anna 右交替）
- 老的 story2 区块已消失

切换到 EN 全部文案为英文。

- [ ] **Step 3: 提交**

```bash
git add src/pages/About.tsx
git commit -m "feat(about): rewrite page with mission/vision/values/founders, drop story2"
```

---

## Task 7: i18n — OneOnOne 教练数据

**Files:**
- Modify: `src/i18n/zh.json`
- Modify: `src/i18n/en.json`

- [ ] **Step 1: 在 zh.json 的 `pages.oneOnOne` 末尾追加**

把 `pages.oneOnOne` 对象追加 2 个 key（注意 JSON 语法，别漏逗号）：

```json
"coachesTitle": "我们的教练",
"coachesSubtitle": "Meet your coaches — 来自跨文化背景的资深陪跑团队",
"coaches": [
  {
    "name": "小薇",
    "image": "/images/coaches/xiaowei.png",
    "title": "一对一教练辅导咨询",
    "body": "婚姻家庭情感咨询师｜国家认证心理咨询师｜教练技术运用培训师。丰富国际交友经验，指点攻心技巧达人，善于抓住一切机遇，创造人生更多可能。遇见未来，你准备好了吗？"
  },
  {
    "name": "小鹿",
    "image": "/images/coaches/xiaolu.png",
    "title": "高效速成网络交友情感指导",
    "body": "2020 年通过网络与先生结婚，目前定居美国俄亥俄州。从事心理学研究多年，针对性、高效速成的网络交友情感指导。人生只需做对两件事，就会离自己想要的生活状态更近一步：做适合自己的选择，多结交良师益友。"
  },
  {
    "name": "朵儿",
    "image": "/images/coaches/duoer.png",
    "title": "跨国情感桥梁专家",
    "body": "外国语大学背景，修于耶鲁大学人性心理学。中西合璧、定居美国的情感航标，拥有吸引力、驾驭力、沟通力、修复力、心智力五力之翼。专注于跨国情感桥梁，专精于解决跨国文化婚恋难题。心怀梦想，无畏远方！"
  },
  {
    "name": "Amy",
    "image": "/images/coaches/amy.png",
    "title": "家庭婚姻情感咨询师",
    "body": "家庭教育指导师｜哈佛大学心理学认证在修｜文学心理疗法第二硕士在读｜英语语言文学双硕士。近 30 年大学老师，上万场次英语培训演讲、上千场次家庭教育演讲。资深国际教育领域，熟谙中西文化与异国情感沟通密码。先生意大利裔，定居美国。如果有梦想，毫无犹豫砥砺前行。"
  },
  {
    "name": "昱菲",
    "image": "/images/coaches/yufei.png",
    "title": "网络国际寻爱实战教练",
    "body": "离异十年单亲妈妈，2022 年开启跨国恋交友学习与寻找之旅，2023 年和美国先生在中国结婚。真诚地把自己在网络国际寻爱中成功的经验分享给姐妹，教会如何与西方男士交流、沟通和相处。专注于健康养生与女性私密全方位养护，定向于网络交友专业输出与两性婚姻关系疗愈。"
  },
  {
    "name": "Vivian",
    "image": "/images/coaches/vivian.png",
    "title": "跨国婚姻快速选择优质男士秘诀",
    "body": "网络交友四年，通过学习成为高情商、高智商、高能量的女人，与先生 2023 圣诞节结婚。地球村时代，幸运的爱情更在于你的勇敢、认知和能力。每个人都是自己生命的第一负责人——拓展疆域寻找爱情，你也可以书写属于自己的爱情传奇！丰富的理论与跨国婚姻实践经验，定居美国洛杉矶。"
  },
  {
    "name": "Vare",
    "image": "/images/coaches/vare.jpg",
    "title": "跨国婚姻 & 亲子关系教练",
    "body": "曾经是两个孩子的单亲妈妈，跨国婚姻改写了我和孩子的人生轨迹。在网络交友、跨国婚姻这条路上有独特的见解和方法。丰富国际交友经验，指点攻心技巧达人，擅长改善亲子关系。不为失败找理由，只为成功找方法！"
  },
  {
    "name": "Grace",
    "image": "/images/coaches/grace.jpg",
    "title": "网络国际交友资深陪跑",
    "body": "跨国婚恋为我开启了另一扇门，多年的网络国际交友经验沉淀。用爱和温暖拥抱需要帮助的你。用有限的时间，创造无限的美好！"
  },
  {
    "name": "Anne",
    "image": "/images/coaches/anne.jpg",
    "title": "情商爱商成长指导",
    "body": "两个孩子的单亲妈妈，经历过无数次的恋爱经历，深知情商、爱商认识的重要性。毕业于华南师范学院人性心理学，丰富国际交友经验，健康管理师。把自己的亲身经历与实操经验毫无保留分享给姐妹。不为失败找理由，只为成功找方法！"
  },
  {
    "name": "Mia",
    "image": "/images/coaches/mia.jpg",
    "title": "一对一教练辅导咨询",
    "body": "在美十年，有丰富的国际交友经验，已经帮助很多姐妹开启国外幸福生活！"
  }
]
```

- [ ] **Step 2: 在 en.json 的 `pages.oneOnOne` 末尾同步追加（中文留作占位，docx 没给英文）**

```json
"coachesTitle": "Meet Your Coaches",
"coachesSubtitle": "A seasoned, cross-cultural coaching team walking the journey with you",
"coaches": [
  {
    "name": "Xiaowei",
    "image": "/images/coaches/xiaowei.png",
    "title": "One-on-one coaching consultation",
    "body": "Family & relationship counselor · State-certified psychological counselor · Coaching-technique trainer. Rich international dating experience and a master of communication strategy. Are you ready to meet your future?"
  },
  {
    "name": "Xiaolu",
    "image": "/images/coaches/xiaolu.png",
    "title": "Fast-track online dating coaching",
    "body": "Married her husband through the internet in 2020 and now lives in Ohio, USA. Years of psychology research informs targeted, fast-track online dating coaching. Two things bring you closer to the life you want: make choices that fit you, and surround yourself with mentors and good friends."
  },
  {
    "name": "Duo'er",
    "image": "/images/coaches/duoer.png",
    "title": "Cross-cultural relationship bridge",
    "body": "Foreign-languages university background; studied human psychology at Yale. A bicultural anchor based in the US, equipped with the five wings of attraction, control, communication, repair, and mindset. Focused on cross-cultural relationship bridges and untangling international dating challenges. Hold the dream; fear not the distance."
  },
  {
    "name": "Amy",
    "image": "/images/coaches/amy.png",
    "title": "Family & marriage counselor",
    "body": "Family-education advisor · Harvard psychology certification (in progress) · second master's in literary psychotherapy (in progress) · dual master's in English language and literature. Nearly 30 years as a university lecturer, with tens of thousands of English-training talks and over a thousand family-education talks. Deep international-education background; fluent in cross-cultural communication. Husband is Italian-American; based in the US."
  },
  {
    "name": "Yufei",
    "image": "/images/coaches/yufei.png",
    "title": "Hands-on international-dating coach",
    "body": "Single mother for ten years; began her cross-cultural dating journey in October 2022 and married her American husband in China in 2023. Sincerely shares her successful online international-dating playbook — how to communicate, connect, and live with Western men. Focus on health, women's wellness, and healing of marital relationships."
  },
  {
    "name": "Vivian",
    "image": "/images/coaches/vivian.png",
    "title": "Picking quality men in cross-cultural marriage",
    "body": "Four years of online dating; through study became a woman of high EQ, high IQ, and high energy, and married her husband on Christmas 2023. In a global village, luck in love comes more from your courage, awareness, and capability. You are the first person responsible for your own life — expand the search radius and you can write your own love story. Theory plus practice; based in Los Angeles."
  },
  {
    "name": "Vare",
    "image": "/images/coaches/vare.jpg",
    "title": "Cross-cultural marriage & parenting coach",
    "body": "Once a single mother of two; cross-cultural marriage rewrote her family's trajectory. Brings a distinctive perspective and method to online dating and international marriage, plus expertise in mending parent–child relationships. Don't look for reasons to fail — look for ways to succeed."
  },
  {
    "name": "Grace",
    "image": "/images/coaches/grace.jpg",
    "title": "Veteran international-dating coach",
    "body": "Cross-cultural love opened another door for me. Years of accumulated experience in online international dating. I embrace those who need help with love and warmth. Use your limited time to create unlimited beauty."
  },
  {
    "name": "Anne",
    "image": "/images/coaches/anne.jpg",
    "title": "EQ & love-quotient growth coach",
    "body": "Single mother of two with countless dating experiences; understands the importance of EQ and love-quotient. Graduate of South China Normal University in human psychology; rich international-dating experience; certified health manager. Shares everything she has lived and practiced with sisters. Don't look for reasons to fail — look for ways to succeed."
  },
  {
    "name": "Mia",
    "image": "/images/coaches/mia.jpg",
    "title": "One-on-one coaching consultation",
    "body": "Ten years in the US, with rich international-dating experience. Has already helped many sisters begin a happy life abroad."
  }
]
```

- [ ] **Step 3: JSON 校验 + 提交**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/i18n/zh.json'))" && echo OK
node -e "JSON.parse(require('fs').readFileSync('src/i18n/en.json'))" && echo OK
git add src/i18n/zh.json src/i18n/en.json
git commit -m "feat(i18n): add 10 coaches data for /one-on-one"
```

---

## Task 8: 新建 CoachesSection 组件 + 装载到 OneOnOne

**Files:**
- Create: `src/components/oneOnOne/CoachesSection.tsx`
- Modify: `src/pages/OneOnOne.tsx`

- [ ] **Step 1: 创建 CoachesSection.tsx**

```tsx
import { useTranslation } from "react-i18next";

type Coach = { name: string; image: string; title: string; body: string };

export default function CoachesSection() {
  const { t } = useTranslation();
  const items = t("pages.oneOnOne.coaches", { returnObjects: true }) as Coach[];

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t("pages.oneOnOne.coachesTitle")}
          </h2>
          <p className="text-foreground/60">{t("pages.oneOnOne.coachesSubtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-semibold text-lg">{c.name}</h3>
                <div className="text-xs uppercase tracking-wider text-primary/80">
                  {c.title}
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{c.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 在 OneOnOne.tsx 末尾追加 `<CoachesSection />`**

读取当前 `src/pages/OneOnOne.tsx`，在最后一个区块之后、`</> ` 之前插入 `<CoachesSection />`。同时在 import 区添加：

```tsx
import CoachesSection from "@/components/oneOnOne/CoachesSection";
```

- [ ] **Step 3: 验证 + 提交**

```bash
npm run build
```

http://localhost:5180/one-on-one 滚到底，看到 10 张教练卡（3 列 PC / 2 列平板 / 1 列移动），每卡有照片。

```bash
git add src/components/oneOnOne/ src/pages/OneOnOne.tsx
git commit -m "feat(one-on-one): add coaches section with 10 real bios"
```

---

## Task 9: i18n — Custom 套餐（基础 3 + 高端 4）

**Files:**
- Modify: `src/i18n/zh.json`
- Modify: `src/i18n/en.json`

- [ ] **Step 1: 替换 zh.json 中 `pages.custom`**

```json
"custom": {
  "title": "私人订制",
  "subtitle": "为独一无二的你 量身打造",
  "intro": "根据你的择偶标准、生活方式与人生阶段，量身定制专属匹配方案。从基础套餐到高端私人订制，满足不同阶段的需求。",
  "basicTitle": "基础套餐",
  "basicTiers": [
    {
      "name": "B 套餐",
      "duration": "服务期 12 个月",
      "features": [
        "教练团队协助注册三个交友平台",
        "赠送 2 个月教练辅导",
        "12 个月教练直播课程",
        "赠送 100 节聊天技巧录播课程"
      ]
    },
    {
      "name": "C 套餐",
      "duration": "服务期 6 个月",
      "features": [
        "精选 10 位心仪对象（总资产 50 万以内）",
        "赠送 2 个月情感教练辅导",
        "6 个月教练直播课程",
        "赠送 30 节女性成长录播课程"
      ]
    },
    {
      "name": "D 套餐",
      "duration": "服务期 6 个月",
      "features": [
        "精选 6 位心仪对象（总资产 50–100 万美金）",
        "赠送 3 个月情感教练辅导",
        "12 个月教练直播课程",
        "赠送 100 节聊天技巧录播课程"
      ]
    }
  ],
  "premiumTitle": "高端私人订制",
  "premiumSubtitle": "为高净值与精英人群定向匹配",
  "premiumTiers": [
    {
      "name": "白金会员",
      "duration": "服务期 24 个月",
      "asset": "男士总资产 50–100 万美金",
      "scope": "工程师、初/高中教师、销售行业、医院护工、中层管理等",
      "features": [
        "教练团队精选 100 位心仪对象",
        "6 个月情感教练辅导 + 6 个月情感教练陪跑",
        "12 个月教练直播课程",
        "赠送 200 节录播课程"
      ]
    },
    {
      "name": "钻石会员",
      "duration": "服务期 24 个月",
      "asset": "男士总资产 100–150 万美金",
      "scope": "公司高管、个体经营、大学教师/教授、CEO 等",
      "features": [
        "教练团队精选 100 位心仪对象",
        "6 个月情感教练辅导 + 6 个月情感教练陪跑",
        "12 个月教练直播课程",
        "赠送 200 节录播课程"
      ]
    },
    {
      "name": "至尊会员",
      "duration": "服务期 24 个月",
      "asset": "男士总资产 150–250 万美金",
      "scope": "自有公司、医生、律师、科学家、高科技人才等",
      "features": [
        "教练团队精选 100 位心仪对象",
        "6 个月情感教练辅导 + 6 个月情感教练陪跑",
        "12 个月教练直播课程",
        "赠送 200 节录播课程"
      ]
    },
    {
      "name": "超级会员",
      "duration": "服务期 24 个月",
      "asset": "男士总资产 250–500 万美金",
      "scope": "自有连锁企业、手术医生、麻醉师、高级律师、有专利的科学家、500 强企业 CEO、高科技人才管理等",
      "features": [
        "教练团队精选 100 位心仪对象",
        "6 个月情感教练辅导 + 6 个月情感教练陪跑",
        "12 个月教练直播课程",
        "赠送 300 节录播课程"
      ]
    }
  ]
}
```

注：完整移除原有 `pages.custom.tiers`、`tiersTitle`、`whyTitle`、`whyBody` 字段。

- [ ] **Step 2: 替换 en.json 中 `pages.custom`**

```json
"custom": {
  "title": "Bespoke Service",
  "subtitle": "Tailored for one-of-a-kind you",
  "intro": "We design a dedicated matching plan around your criteria, lifestyle, and life stage. From core packages to high-end bespoke tiers, we cover every stage of your journey.",
  "basicTitle": "Core Packages",
  "basicTiers": [
    {
      "name": "Plan B",
      "duration": "12-month service period",
      "features": [
        "Coaching team helps you register on three dating platforms",
        "2 months of coaching included",
        "12 months of live coaching classes",
        "100 recorded lessons on chatting techniques"
      ]
    },
    {
      "name": "Plan C",
      "duration": "6-month service period",
      "features": [
        "Curated 10 candidates (assets up to 500K USD)",
        "2 months of relationship coaching included",
        "6 months of live coaching classes",
        "30 recorded lessons on women's growth"
      ]
    },
    {
      "name": "Plan D",
      "duration": "6-month service period",
      "features": [
        "Curated 6 candidates (assets 500K–1M USD)",
        "3 months of relationship coaching included",
        "12 months of live coaching classes",
        "100 recorded lessons on chatting techniques"
      ]
    }
  ],
  "premiumTitle": "High-End Bespoke",
  "premiumSubtitle": "Targeted matching for high-net-worth and elite circles",
  "premiumTiers": [
    {
      "name": "Platinum",
      "duration": "24-month service period",
      "asset": "Candidate assets: $500K–$1M",
      "scope": "Engineers, school teachers, sales professionals, medical caregivers, mid-level managers",
      "features": [
        "Coaching team curates 100 candidates",
        "6 months of relationship coaching + 6 months of dedicated companionship",
        "12 months of live coaching classes",
        "200 recorded lessons"
      ]
    },
    {
      "name": "Diamond",
      "duration": "24-month service period",
      "asset": "Candidate assets: $1M–$1.5M",
      "scope": "Corporate executives, business owners, university professors, CEOs",
      "features": [
        "Coaching team curates 100 candidates",
        "6 months of relationship coaching + 6 months of dedicated companionship",
        "12 months of live coaching classes",
        "200 recorded lessons"
      ]
    },
    {
      "name": "Supreme",
      "duration": "24-month service period",
      "asset": "Candidate assets: $1.5M–$2.5M",
      "scope": "Business owners, doctors, lawyers, scientists, senior tech talent",
      "features": [
        "Coaching team curates 100 candidates",
        "6 months of relationship coaching + 6 months of dedicated companionship",
        "12 months of live coaching classes",
        "200 recorded lessons"
      ]
    },
    {
      "name": "Super",
      "duration": "24-month service period",
      "asset": "Candidate assets: $2.5M–$5M",
      "scope": "Owners of franchise enterprises, surgeons, anesthesiologists, senior counsels, scientists with patents, Fortune-500 CEOs, senior tech executives",
      "features": [
        "Coaching team curates 100 candidates",
        "6 months of relationship coaching + 6 months of dedicated companionship",
        "12 months of live coaching classes",
        "300 recorded lessons"
      ]
    }
  ]
}
```

- [ ] **Step 3: JSON 校验 + 提交**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/i18n/zh.json'))" && echo OK
node -e "JSON.parse(require('fs').readFileSync('src/i18n/en.json'))" && echo OK
git add src/i18n/zh.json src/i18n/en.json
git commit -m "feat(i18n): rewrite custom packages — 3 core + 4 premium tiers"
```

---

## Task 10: 新建 TierGroup 组件 + 重写 Custom.tsx

**Files:**
- Create: `src/components/custom/TierGroup.tsx`
- Modify: `src/pages/Custom.tsx`

- [ ] **Step 1: 创建 TierGroup.tsx**

```tsx
import { Check } from "lucide-react";

export type Tier = {
  name: string;
  duration: string;
  asset?: string;
  scope?: string;
  features: string[];
};

type Props = {
  title: string;
  subtitle?: string;
  tiers: Tier[];
  variant?: "basic" | "premium";
};

export default function TierGroup({ title, subtitle, tiers, variant = "basic" }: Props) {
  const isPremium = variant === "premium";
  const cols = tiers.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section className={`py-20 px-4 ${isPremium ? "bg-gradient-to-b from-[#1a1a2a] to-[#0f0f1a] text-white" : ""}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
          {subtitle && (
            <p className={isPremium ? "text-white/60" : "text-foreground/60"}>{subtitle}</p>
          )}
        </div>
        <div className={`grid gap-6 sm:grid-cols-2 ${cols}`}>
          {tiers.map((t, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 flex flex-col ${
                isPremium
                  ? "bg-white/5 border border-white/10 backdrop-blur-sm"
                  : "bg-white shadow-sm"
              }`}
            >
              <h3 className="text-xl font-semibold">{t.name}</h3>
              <div className={`text-sm mt-1 ${isPremium ? "text-white/60" : "text-foreground/60"}`}>
                {t.duration}
              </div>
              {t.asset && (
                <div className={`mt-3 text-sm ${isPremium ? "text-amber-300" : "text-primary"}`}>
                  {t.asset}
                </div>
              )}
              {t.scope && (
                <div className={`mt-1 text-xs leading-relaxed ${isPremium ? "text-white/50" : "text-foreground/50"}`}>
                  {t.scope}
                </div>
              )}
              <ul className="mt-5 space-y-2.5 flex-1">
                {t.features.map((f, j) => (
                  <li key={j} className="flex gap-2 text-sm leading-relaxed">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isPremium ? "text-amber-300" : "text-primary"
                      }`}
                    />
                    <span className={isPremium ? "text-white/80" : "text-foreground/75"}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 重写 Custom.tsx**

```tsx
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/PageHero";
import TierGroup, { type Tier } from "@/components/custom/TierGroup";

export default function Custom() {
  const { t } = useTranslation();
  const basic = t("pages.custom.basicTiers", { returnObjects: true }) as Tier[];
  const premium = t("pages.custom.premiumTiers", { returnObjects: true }) as Tier[];

  return (
    <>
      <Helmet>
        <title>{t("pages.custom.title") + " · " + t("brand")}</title>
        <meta name="description" content={t("pages.custom.intro") as string} />
      </Helmet>

      <PageHero
        title={t("pages.custom.title")}
        subtitle={t("pages.custom.subtitle")}
        image="/images/carousel/slide-4.jpg"
      />

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-lg text-foreground/75 leading-relaxed">
            {t("pages.custom.intro")}
          </p>
        </div>
      </section>

      <TierGroup
        title={t("pages.custom.basicTitle")}
        tiers={basic}
        variant="basic"
      />

      <TierGroup
        title={t("pages.custom.premiumTitle")}
        subtitle={t("pages.custom.premiumSubtitle") as string}
        tiers={premium}
        variant="premium"
      />
    </>
  );
}
```

- [ ] **Step 3: 验证 + 提交**

```bash
npm run build
```

http://localhost:5180/custom：
- intro 居中
- 「基础套餐」3 卡（白底 + 蓝色 check）
- 「高端私人订制」4 卡（深色背景 + 金色 check）

```bash
git add src/components/custom/ src/pages/Custom.tsx
git commit -m "feat(custom): real packages — 3 core + 4 premium with TierGroup"
```

---

## Task 11: i18n — SuccessCases 20 个真实案例

**Files:**
- Modify: `src/i18n/zh.json`
- Modify: `src/i18n/en.json`

20 个案例的图片归属（按 docx 顺序，每个分配 1–2 张：image20–image59 共 40 张，平均 2 张/案例）：

**实际提取后的扩展名**：8 个 case 是 png，其余是 jpg。下表已用实际扩展名。Task 11 i18n 必须严格按此表写 `images` 数组。

| # | id | 标题 | images |
|---|---|---|---|
| 1 | vera | 我和大通银行 G 先生的爱情故事 | case-01.jpg, case-02.jpg |
| 2 | furong | 佛罗里达 61 岁芙蓉姐的幸福爱情 | case-03.jpg, case-04.jpg |
| 3 | nurse | 护士和摩托车王子的浪漫爱情 | case-05.jpg, case-06.jpg |
| 4 | xiaolu | 小鹿的爱情故事 | case-07.jpg, case-08.jpg |
| 5 | yufei | 陈昱霏的故事 | case-09.jpg, case-10.jpg |
| 6 | english-teacher | 大学英语老师和美国教授的爱情 | case-11.jpg, **case-12.png** |
| 7 | president-scientist | 公司总裁和医学科学家的浪漫 | **case-13.png**, **case-14.png** |
| 8 | bridal-52 | 她 52 岁第一次穿上婚纱 | **case-15.png**, case-16.jpg |
| 9 | nanchang | 江西南昌的双向奔赴 | case-17.jpg, case-18.jpg |
| 10 | jie | 平凡的我遇到了美国的大学老师 | case-19.jpg |
| 11 | doctor-bridge | 35 岁博士与桥梁工程师 | case-20.jpg |
| 12 | vicky | 香港 Vicky 在德州的新生活 | case-21.jpg, case-22.jpg |
| 13 | susan | 月嫂 Susan 与 Philips 高管 | case-23.jpg, case-24.jpg |
| 14 | beijing-zhao | 北京赵姐的德州绿卡人生 | case-25.jpg, case-26.jpg |
| 15 | yueer | 月儿与法官先生 | case-27.jpg, case-28.jpg |
| 16 | nana | 娜娜带两个孩子的智慧选择 | case-29.jpg, case-30.jpg |
| 17 | principal | 51 岁前校长的洛杉矶幸福 | **case-31.png**, **case-32.png** |
| 18 | huahua | 花花 55 岁遇见机械工程师 | **case-33.png**, **case-34.png** |
| 19 | qiuqiu | 钢琴老师秋秋与 CEO | case-35.jpg, case-36.jpg |
| 20 | mumu | 木木与农场主的甜蜜婚姻 | case-37.jpg, case-38.jpg |

剩余 case-39.jpg, case-40.jpg 暂留作备用图片，i18n 不引用。

**实际提取后的教练扩展名**：amy/duoer/vivian/xiaolu/xiaowei/yufei = .png；anne/grace/mia/vare = .jpg。Task 7 i18n 中的 image 字段必须按实际扩展名（在 plan 中已经使用正确扩展名，无需改动）。

**实际提取后的课程扩展名**：course-1/2/3/5/6/7 = .jpg；**course-4 = .png**。Task 3 i18n 已用 .jpg，需要改 course-4 引用为 .png。

- [ ] **Step 1: 重写 zh.json 中 `pages.successCases`**

```json
"successCases": {
  "title": "部分成功案例",
  "subtitle": "真实牵手 真实幸福",
  "intro": "通过 International Love Dating Club 找到真爱的真实故事。",
  "cases": [
    {
      "id": "vera",
      "title": "我和大通银行 G 先生的爱情故事",
      "images": ["/images/cases/case-01.jpg", "/images/cases/case-02.jpg"],
      "paragraphs": [
        "我叫 Vera，今年 45 岁来自福州。我是一个二宝妈也是一个普通的房产销售，曾经有过一段不幸的婚姻，带着两个女儿一起生活，非常坚辛和无助。上天给你关上一扇门总会给你开一扇窗，2023 年偶然的机会认识了跨国交友平台，经过深入了解，我觉得这是大龄宝妈改变命运的机会，于是我加入异国情缘的旅程。",
        "在网上摸爬滚打了一段时间，我遇见了优秀的 G 先生。我的 G 先生今年 54 岁住在美国休斯顿，在大通银行做软件工程师。他温文儒雅、心地善良、稳重踏实、情绪稳定，对孩子有爱心，对我更是宠爱。每个中外的节日都是仪式感满满的，鲜花加礼物。",
        "经过 10 个月的交流我们完全融入到对方的生活中，他带着给全家人的礼物和对我深深的爱恋跨越半个地球来实现我们的幸福约定。我们在家人和朋友的祝福下举行了结婚仪式。跨国婚姻让我收获了满满的爱情，改变了我的人生也改变了我两个孩子的命运。希望我的故事可以帮助到和我一样的姐妹，勇敢地寻找自己的爱和幸福。"
      ]
    },
    {
      "id": "furong",
      "title": "佛罗里达 61 岁芙蓉姐的幸福爱情",
      "images": ["/images/cases/case-03.jpg", "/images/cases/case-04.jpg"],
      "paragraphs": [
        "现 61 岁的芙蓉，于 2017 年离婚。本以为不会再婚，直到 2021 年 8 月在头条上看到程程的分享，对爱情和家庭的渴望又燃烧起来。果断加入学习的队伍，并且把学习和能力的提高放在第一位。",
        "通过学习，掌握了沟通技巧，提升了经营爱情及家庭的能力。2022 年 6 月底来到美国，很快和现在的先生相遇，并于 2022 年 11 月初喜结良缘。2023 年 4 月初拿到绿卡，和先生幸福地生活在佛罗里达。",
        "她说：我能重获爱情、温暖幸福的家庭，非常感恩程程的引路、鼓励和扶持。每当遇到困难想退缩时都得到了程程的安慰、鼓励和支持，直到现在办理各种事物还经常得到指导！"
      ]
    },
    {
      "id": "nurse",
      "title": "护士和摩托车王子的浪漫爱情",
      "images": ["/images/cases/case-05.jpg", "/images/cases/case-06.jpg"],
      "paragraphs": [
        "50 岁的年龄，很多人觉得这辈子就这么过了，拿着稳定的退休金、带着孙子，过着稳定又无趣的人生。我很不一样，我总是会跨越年龄的束缚，冲破时间对我的禁锢。",
        "今年二月我怀揣梦想、充满希望来到了美国，用自己的高情商、高能量和智慧遇到了真命天子。他绅士、优秀、真诚。在见面三天后，他带我去圣地亚哥过生日；六周后，他决定带我去印第安纳州见他的家人。在他的家乡，我们经历了一次摩托车事故，患难与共，感觉彼此就是生命中最重要的那个人。",
        "认识三个月时我们在印第安纳州订婚，得到了他家人的祝福。回到加州，他在我们第一次见面的地方向我求婚；我们去夏威夷度蜜月，圣诞节顺利结婚。这就是我浪漫神奇的爱情故事——机会永远是留给勇敢者，留给不放弃、有准备的人。"
      ]
    },
    {
      "id": "xiaolu",
      "title": "小鹿的爱情故事",
      "images": ["/images/cases/case-07.jpg", "/images/cases/case-08.jpg"],
      "paragraphs": [
        "2020 年七月，我刷到了抖音上异国恋的主播程程姐，通过她了解了异国恋的相关知识。经过系统学习与层层筛选，2021 年 4 月在网络上认识了我先生，开启了我和他的缘分。",
        "我们第一次视频后先生整晚没睡，第二天早晨就送来 99 朵玫瑰花。第三天我开玩笑地说如果你真的对我感兴趣，能不能在网络上向我求婚？他立刻在商店打来视频让我挑选了一克拉的钻戒，回家后就在网络上向我求婚——这一切让我感觉像做梦一样。",
        "2021 年 8 月 22 号，我们在土耳其的机场第一次拥抱！从相识到见面整整四个月。度假归来，先生马上为我申请未婚妻签证。等待的过程很漫长，但我们的感情经受住了考验。现在我们幸福地定居在美国俄亥俄州。感谢先生的用心，也感谢自己学习之后的情绪稳定。"
      ]
    },
    {
      "id": "yufei",
      "title": "陈昱霏的故事",
      "images": ["/images/cases/case-09.jpg", "/images/cases/case-10.jpg"],
      "paragraphs": [
        "我叫陈昱霏，来自湖南，是一个离异 7 年、带着两个女儿的单亲妈妈。2020 年，我无意间在抖音上面刷到程程姐，并关注了她。",
        "我有过两段不幸的婚姻，对结婚失去了信心。经过我细心的观察，她的真诚打动了我。2022 年 8 月我终于按下了确认键，开始踏上寻爱之旅。每天认真学习、努力链接男士。",
        "九月份我遇到了一位美国男士，对我真诚的关心让我开始有感觉，不到三个月我们确定了关系。因为疫情没法见面，但感情越来越好。开放后他来中国和我见面并结婚。我的先生非常善良，他很爱我的孩子，对我宠爱有加，从此我再也不是那个担当着一切的女汉子。亲爱的姐妹们，下一个接住幸福会是你哟！"
      ]
    },
    {
      "id": "english-teacher",
      "title": "大学英语老师和美国教授的爱情故事",
      "images": ["/images/cases/case-11.jpg", "/images/cases/case-12.jpg"],
      "paragraphs": [
        "我曾是大学老师，单亲母亲 10 多年。孩子成人就业后，我成了空巢家长，也曾在国内寻寻觅觅多年，一直没有遇到我想要的那个心灵相通的人。2015 年我曾到美国做访问学者 2 年，对国外男士的礼仪修养、爱沟通等特点印象较深刻，所以萌生了跨国寻缘的想法。",
        "机缘巧合遇到了 International Love Dating Club 的姐妹们，继而遇到了我现在的先生——大学教授、文学博士，和我同样钟爱英美文学。他人生阅历丰富、健谈幽默、细心体贴，认识半个月后就主动每天早晚打两次越洋视频电话。",
        "5 个月后我们见面进一步加深了解，2 个月后认定对方就是我们要找的终身伴侣。于是辞掉工作再次来到美国，和他组成了甜蜜的二人世界。我们每天一起做饭、一起锻炼、一起旅行、一起读书、一起计划未来。祝愿每个渴望爱、渴望被爱的姐妹们都能获得终身幸福！"
      ]
    },
    {
      "id": "president-scientist",
      "title": "公司总裁和医学科学家的浪漫爱情",
      "images": ["/images/cases/case-13.jpg", "/images/cases/case-14.jpg"],
      "paragraphs": [
        "51 岁的我来自美丽的山城重庆，是一位离婚 15 年的单亲妈妈。独立和坚强是我唯一的选择，真诚和善良是我做人的原则。",
        "2022 年 3 月来到美国与先生邂逅，并坠入爱河。这一切都源于 International Love Dating Club 创始人程程和小玲的引领。同年 8 月我们告别了单身，一起步入了婚姻殿堂，现定居于亚利桑那州凤凰城。",
        "感恩程程的付出，感恩我的教练小玲的耐心辅导。我的先生总是能够以一种成熟和理智的方式来处理我们生活中的各种问题，他说：『我能想到最美好的事情就是带你去看世界，体验生活中的美好。』如今的我们共同分享着家庭中的喜怒哀乐，携手度过每一个难忘的瞬间！"
      ]
    },
    {
      "id": "bridal-52",
      "title": "她 52 岁第一次穿上婚纱",
      "images": ["/images/cases/case-15.jpg", "/images/cases/case-16.jpg"],
      "paragraphs": [
        "她，来自中国深圳，是医美行业的精英女性。30 多年来她独自打拼，外表光鲜，内心却始终缺少一个可以依靠的肩膀。她曾一度以为自己的感情已经没有希望了——直到她遇见了 International Love Dating Club。",
        "她很快认识了一位美国洛杉矶的成熟企业家，稳重、有担当，对爱情依旧充满热忱。他郑重地为她准备了两场婚礼：一场东方仪式（她身穿红色中式礼服、他身着唐装），一场西式婚礼（她披上洁白婚纱、他穿西装，在洛杉矶阳光下完成）。",
        "他说：『你值得拥有一切美好，我要把你打造成最幸福的女人。』她眼中含泪，笑容却如此动人。她用了 30 年等一个人，他用了余生给她答案。"
      ]
    },
    {
      "id": "nanchang",
      "title": "江西南昌单亲妈妈的双向奔赴",
      "images": ["/images/cases/case-17.jpg", "/images/cases/case-18.jpg"],
      "paragraphs": [
        "她来自江西南昌，是一位坚韧的单亲妈妈。为了女儿能拥有更好的人生，她一个人奋斗了十多年。她很少为自己想，也曾以为爱情已经和她无关。",
        "直到她遇见了 International Love Dating Club。在我们的陪伴与专业服务下，她遇见了一位洛杉矶从事装饰工程的男士。他不是一个富豪，但他是一个真正愿意守护她的人。",
        "他说的最多的一句话就是：『你挣的钱你自己支配，是你的；我挣的钱，是我们的。』这句简单的话，让她听了泪如雨下。婚礼那天，她身穿婚纱，恬静又美丽。亲爱的，如果你也曾一个人默默撑起生活，请相信你并不孤单。"
      ]
    },
    {
      "id": "jie",
      "title": "平凡的我遇到了美国的大学老师",
      "images": ["/images/cases/case-19.jpg"],
      "paragraphs": [
        "我叫洁，是一名下岗工人，文化不高，在我这个年龄，在国内很难找到一份满意的工作。2021 年通过朋友的介绍认识了 International Love Dating Club。",
        "非常感恩我的教练琳琳对我的帮助和耐心指导，她是我的贵人，让我遇到了如此优秀的男士、真心疼我爱我的另一半。他带我去了很多地方旅游！",
        "我们第一次见面是在泰国，见面后我们就订婚了。后来他来中国，我们结婚了，我现在正在等配偶签证！"
      ]
    },
    {
      "id": "doctor-bridge",
      "title": "35 岁博士与桥梁工程师的加州生活",
      "images": ["/images/cases/case-20.jpg"],
      "paragraphs": [
        "她是一位 35 岁的中国女性，拥有博士学位，专攻房屋设计。她事业独立、性格温柔，一直渴望能在情感上遇见真正契合的灵魂伴侣。",
        "通过 International Love Dating Club 的专业引导与情感陪伴，她结识了来自美国的 38 岁桥梁工程师——一位稳重而有责任感的男士。",
        "他们在一次次的深度交流中相互欣赏、彼此理解，从线上走到线下，再走进婚姻的殿堂。如今他们已在加州安家，过上『一屋两人两狗』的宁静生活——房子里充满爱，院子里有阳光和狗狗奔跑的身影。"
      ]
    },
    {
      "id": "vicky",
      "title": "香港 Vicky 在德州的新生活",
      "images": ["/images/cases/case-21.jpg", "/images/cases/case-22.jpg"],
      "paragraphs": [
        "香港的会员姐妹 Vicky，以前在香港做会计工作，在工作上独立自信，但在感情上一直没有遇到真正适合自己的灵魂伴侣。她刚刚加入的时候很迷茫，多次问：『琳琳教练，我能成功吗？』",
        "幸运的齿轮总会在为自己按下幸福确认键的那一刻开始，在通过专业系统的学习提升和准备好自己时开始。",
        "她现在已经结婚在德州，两个人生活的非常幸福！她的老公在德州有自己的房产中介公司，现在 Vicky 已经拿到绿卡，和她老公一起做房产中介生意！"
      ]
    },
    {
      "id": "susan",
      "title": "月嫂 Susan 与 Philips 退休高管",
      "images": ["/images/cases/case-23.jpg", "/images/cases/case-24.jpg"],
      "paragraphs": [
        "会员月嫂姐妹 Susan，今年 63 岁，已经在美国做月嫂多年。在刚刚加入 International Love Dating Club 的时候，她很担心自己的英语不好，很难和西方男士沟通。",
        "通过在俱乐部的学习，也经过她自己的努力，在琳琳教练的指导下，她找到了她现在的先生。",
        "她的先生是 Philips 公司的高管退休，对妻子特别的宠爱和呵护。Susan 姐已经拿到绿卡，现在每个月享受着她老公退休工资的一半，两个人生活的非常幸福和快乐！"
      ]
    },
    {
      "id": "beijing-zhao",
      "title": "北京赵姐的德州绿卡新生活",
      "images": ["/images/cases/case-25.jpg", "/images/cases/case-26.jpg"],
      "paragraphs": [
        "北京的赵姐，今年 66 岁，她在北京做保险 30 多年，事业很成功。她很喜欢美国的环境、食物、空气和水，在生活中她很注重健康。",
        "通过 International Love Dating Club 她终于实现了她的梦想。赵姐现在结婚在德州，已经拿到绿卡，每个月都在享受着先生的退休金。",
        "她现在每天都去锻炼身体、练瑜伽。她说，回北京已经不习惯了，在美国心情开心、身体健康——健康是她拥有的最大的财富！"
      ]
    },
    {
      "id": "yueer",
      "title": "月儿与法官先生的奥勒冈州生活",
      "images": ["/images/cases/case-27.jpg", "/images/cases/case-28.jpg"],
      "paragraphs": [
        "月儿今年 53 岁，是一位非常智慧的女士，她的儿子在美国读研究生。月儿的性格开朗活泼，她与她的法官先生在旧金山第一次见面时就一见钟情——当缘分到来的时候挡都挡不住。",
        "月儿和她的先生结婚在奥勒冈州，现在她已经拿到绿卡。",
        "她的先生非常宠爱她，已经把她的名字加到房产上，把她的医疗保险都安排得很好，让她什么都不用担心，完全没有后顾之忧！"
      ]
    },
    {
      "id": "nana",
      "title": "娜娜带两个孩子的智慧选择",
      "images": ["/images/cases/case-29.jpg", "/images/cases/case-30.jpg"],
      "paragraphs": [
        "娜娜，今年 40 岁，她有两个孩子（一个儿子、一个女儿）。在国内相亲，很多男士都嫌弃她带两个『拖油瓶』。",
        "于是她毅然决然选择了 International Love Dating Club，她想带两个孩子来美国，给他们一个好的教育环境。一位智慧妈妈的选择，能改变三代人的命运——智慧的娜娜做到了。",
        "她吸引到了一位从没结过婚的男士，现在她和她的先生结婚在田纳西州。她的老公非常宠爱她，对她的孩子像自己亲生孩子一样，还很感恩他的妻子，给他带来了两个不用换尿片的聪明孩子！"
      ]
    },
    {
      "id": "principal",
      "title": "前校长的洛杉矶幸福",
      "images": ["/images/cases/case-31.jpg", "/images/cases/case-32.jpg"],
      "paragraphs": [
        "她 51 岁，曾是一位学校校长，离婚多年，独立坚强，却始终找不到那个真正懂她的人。在国内尝试了无数次相亲和交友，总是『高不成、低不就』，反而让她逐渐对爱情失去信心。",
        "直到她遇见了 International Love。我们为她量身匹配了一位住在洛杉矶的企业主，一个真正珍惜她、欣赏她的男士。一个多月后，男士在温柔的烛光晚宴中单膝跪地向她求婚，那一刻他们都流下了幸福的泪水。",
        "三个月后，我们亲自参加了她的婚礼，男士激动落泪，说出一句动人的话：『她是我一生的灵魂伴侣。』如今他们已经幸福生活多年。她常常对我们说：『遇到 International Love Dating Club，是我这一生最幸运的决定。』"
      ]
    },
    {
      "id": "huahua",
      "title": "花花 55 岁遇见机械工程师",
      "images": ["/images/cases/case-33.jpg", "/images/cases/case-34.jpg"],
      "paragraphs": [
        "花花，55 岁，来自南京，是一位独具气质的服装搭配设计师。多年来，她独自抚养儿子长大，如今儿子已有了自己的生活，她也开始思考：『我的余生，应该属于怎样的幸福？』她说：『我不需要很多人爱我，我只想要那个真正懂我的人。』",
        "International Love Dating Club 为她匹配了一位居住在洛杉矶的机械工程师——温和、真诚、有担当，欣赏她的美与坚持，也愿意倾听她的内心。他们在半年内结婚。从她第一次走进我们的办公室，到穿上婚纱的那一刻，我们一路陪伴。",
        "她曾对我们说：『你们的耐心、责任心和爱心，让我很感动。我不是被服务，我是被真正陪伴。』婚后他们每个周末旅行，她笑着说：『在他身边，我第一次觉得我可以不用一个人扛所有事。』如今她还成为了我们团队的一员——继续用自己的故事和温度，帮助更多像她一样的姐妹找回爱的勇气。"
      ]
    },
    {
      "id": "qiuqiu",
      "title": "钢琴老师秋秋与洛杉矶 CEO",
      "images": ["/images/cases/case-35.jpg", "/images/cases/case-36.jpg"],
      "paragraphs": [
        "优秀的钢琴老师秋秋是一位温婉优雅的女士。她在国内拥有好几家自己创办的钢琴培训中心，为了给两个孩子好的教育，她放弃了国内舒适的生活，出售了钢琴培训中心，带着两个孩子到了美国洛杉矶。",
        "通过 International Love Dating Club，她和洛杉矶一家公司的 CEO 结婚了。她的先生很爱她和孩子们。",
        "现在她和孩子刚刚拿到了绿卡。她很开心因为自己智慧的选择，拥有了快乐和睦的幸福家庭。"
      ]
    },
    {
      "id": "mumu",
      "title": "木木与农场主的甜蜜婚姻",
      "images": ["/images/cases/case-37.jpg", "/images/cases/case-38.jpg"],
      "paragraphs": [
        "会员木木今年 45 岁，温柔漂亮，在国内经营一家大的餐厅，事业上非常成功，但是上一段婚姻对她的伤害很大，以至于让她一度不再相信爱情。",
        "经过一位朋友的介绍，她和 International Love Dating Club 结缘。在教练的耐心辅导下，她对爱情再一次充满了希望。她加入俱乐部六个月，就成功吸引到了她现在的先生——他是农场主，把她宠得像女儿一样！",
        "木木发自内心感恩朋友的介绍，感恩俱乐部的帮助，让她收获了甜蜜的爱情和婚姻！"
      ]
    }
  ]
}
```

注意：旧的 `pages.successCases.featured` 字段和原 cases 数组（15 条）完全删除。

- [ ] **Step 2: 同步 en.json 中 `pages.successCases`**

EN 版只翻译 `title / subtitle / intro`，每个 case 的 `title` 翻译为简短英文，`paragraphs` 暂留中文（与 zh 一致）作占位，待人工翻译：

```json
"successCases": {
  "title": "Success Stories",
  "subtitle": "Real connections, real happiness",
  "intro": "True stories of women who found love through International Love Dating Club.",
  "cases": [
    {
      "id": "vera",
      "title": "Vera & Mr. G — A love story with a Chase Bank engineer",
      "images": ["/images/cases/case-01.jpg", "/images/cases/case-02.jpg"],
      "paragraphs": [
        "我叫 Vera，今年 45 岁来自福州。我是一个二宝妈也是一个普通的房产销售，曾经有过一段不幸的婚姻，带着两个女儿一起生活，非常坚辛和无助。上天给你关上一扇门总会给你开一扇窗，2023 年偶然的机会认识了跨国交友平台，经过深入了解，我觉得这是大龄宝妈改变命运的机会，于是我加入异国情缘的旅程。",
        "在网上摸爬滚打了一段时间，我遇见了优秀的 G 先生。我的 G 先生今年 54 岁住在美国休斯顿，在大通银行做软件工程师。他温文儒雅、心地善良、稳重踏实、情绪稳定，对孩子有爱心，对我更是宠爱。每个中外的节日都是仪式感满满的，鲜花加礼物。",
        "经过 10 个月的交流我们完全融入到对方的生活中，他带着给全家人的礼物和对我深深的爱恋跨越半个地球来实现我们的幸福约定。我们在家人和朋友的祝福下举行了结婚仪式。跨国婚姻让我收获了满满的爱情，改变了我的人生也改变了我两个孩子的命运。希望我的故事可以帮助到和我一样的姐妹，勇敢地寻找自己的爱和幸福。"
      ]
    }
  ]
}
```

实际操作：完整的 EN 版 cases 数组直接复制 ZH 版结构，把每个 case 的 `title` 字段做英文翻译，`paragraphs` 数组保持 ZH 文本不变（占位）。20 条全部按此模式处理。

为节省 plan 字数，下面给出 20 个英文 title 列表，paragraphs 复制 zh 即可：

| id | en title |
|---|---|
| vera | Vera & Mr. G — A love story with a Chase Bank engineer |
| furong | Furong's happy love at 61 in Florida |
| nurse | The nurse and her motorcycle prince |
| xiaolu | Xiaolu's love story |
| yufei | Yufei's story |
| english-teacher | A university English teacher meets her American professor |
| president-scientist | A company president and a medical scientist |
| bridal-52 | She wore a wedding dress for the first time at 52 |
| nanchang | A single mother from Nanchang and her two-way commitment |
| jie | An ordinary me met a US university teacher |
| doctor-bridge | A 35-year-old PhD and a bridge engineer in California |
| vicky | Hong Kong's Vicky finds new life in Texas |
| susan | Susan and her retired Philips executive |
| beijing-zhao | Sister Zhao from Beijing — a green-card life in Texas |
| yueer | Yue'er and her judge husband in Oregon |
| nana | Nana's wise choice with two children |
| principal | A former school principal's happiness in Los Angeles |
| huahua | Huahua, 55, meets her mechanical engineer |
| qiuqiu | Piano teacher Qiuqiu and a Los Angeles CEO |
| mumu | Mumu and her sweet marriage to a farmer |

- [ ] **Step 3: JSON 校验 + 提交**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/i18n/zh.json'))" && echo OK
node -e "JSON.parse(require('fs').readFileSync('src/i18n/en.json'))" && echo OK
git add src/i18n/zh.json src/i18n/en.json
git commit -m "feat(i18n): rewrite success cases — 20 real stories from docx"
```

---

## Task 12: 新建 CaseStory 组件 + 重写 SuccessCases.tsx

**Files:**
- Create: `src/components/successCases/CaseStory.tsx`
- Modify: `src/pages/SuccessCases.tsx`

- [ ] **Step 1: 创建 CaseStory.tsx**

```tsx
type Props = {
  title: string;
  images: string[];
  paragraphs: string[];
  flip: boolean;
};

export default function CaseStory({ title, images, paragraphs, flip }: Props) {
  return (
    <article
      className={`flex flex-col gap-8 md:gap-12 items-center ${
        flip ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <div className="w-full md:w-5/12 space-y-4">
        {images.map((src, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-lg">
            <img src={src} alt="" className="w-full h-auto object-cover" loading="lazy" />
          </div>
        ))}
      </div>
      <div className="w-full md:w-7/12 space-y-4">
        <h3 className="text-2xl md:text-3xl font-semibold leading-snug">{title}</h3>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-foreground/75 leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}
```

- [ ] **Step 2: 重写 SuccessCases.tsx**

```tsx
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/PageHero";
import CaseStory from "@/components/successCases/CaseStory";

type Case = {
  id: string;
  title: string;
  images: string[];
  paragraphs: string[];
};

export default function SuccessCases() {
  const { t } = useTranslation();
  const cases = t("pages.successCases.cases", { returnObjects: true }) as Case[];

  return (
    <>
      <Helmet>
        <title>{t("pages.successCases.title") + " · " + t("brand")}</title>
        <meta name="description" content={t("pages.successCases.intro") as string} />
      </Helmet>

      <PageHero
        title={t("pages.successCases.title")}
        subtitle={t("pages.successCases.subtitle")}
        image="/images/stories/3.jpg"
      />

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-lg text-foreground/75 leading-relaxed">
            {t("pages.successCases.intro")}
          </p>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="container mx-auto max-w-5xl space-y-20 md:space-y-24">
          {cases.map((c, i) => (
            <CaseStory
              key={c.id}
              title={c.title}
              images={c.images}
              paragraphs={c.paragraphs}
              flip={i % 2 === 1}
            />
          ))}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: 验证 + 提交**

```bash
npm run build
```

http://localhost:5180/success-cases：
- PageHero、intro
- 20 个案例长滚动，奇数案例图在左，偶数案例图在右
- 每个案例有 1–2 张图 + 标题 + 多段
- 移动端宽度时图文堆叠

```bash
git add src/components/successCases/ src/pages/SuccessCases.tsx
git commit -m "feat(success-cases): long-scroll layout with 20 real stories"
```

---

## Task 13: 全站验收

- [ ] **Step 1: 完整 build**

```bash
npm run build
```

预期：无 TypeScript 错误，dist/ 产物生成。

- [ ] **Step 2: dev 服务器走查清单**

打开 http://localhost:5180，挨个走查：

- 主页：6 大团队卡显示中英双名 + 真实 desc，课程体系 4 卡显示配图
- /about：品牌简介为 docx 全文 + 使命 + 愿景 + 价值观 4 卡 + 创始人 2 大图文，老的 story2 不再出现
- /one-on-one：6 步流程之后出现 10 张教练卡（图片真实加载）
- /custom：基础 3 卡白底 + 高端 4 卡深色背景
- /success-cases：20 个案例长滚动，左右交替

切换到 EN：
- About / 6 teams / Custom 在 EN 下文案为英文
- 教练 / 案例 paragraphs 暂为中文（已在 spec 标记为 TODO 占位）

移动端（DevTools 模拟 ≤ 480px）：
- 所有 grid 退化为单列
- 创始人图文堆叠
- 案例图文堆叠

- [ ] **Step 3: 提交最终验收记录**

如有视觉小修补（间距、字号、配色），在此 task 内打补丁修。修完：

```bash
git add -A
git commit -m "chore: minor visual fixes after full-site review"
```

---

## 实施顺序与依赖

Task 1 必须最先完成（其他 task 都依赖图片资源存在）。其余 task 之间相互独立，可按主页 → /about → /one-on-one → /custom → /success-cases 的页面优先级顺序执行。

每个 task 完成后立即提交，避免一个大 commit 难审查。
