# 用 resources.docx 真实内容重写各模块 — 设计

日期：2026-04-22
项目目录：`D:\AI\my-projects\international-love-show`
源材料：`docs/resources.docx`（59 张内嵌图片 + 公司简介、使命/愿景/价值观、6 大团队、2 位创始人、10 位教练、20+ 真实成功案例、7 个会员套餐，多数中英双语）
基础设计：`docs/superpowers/specs/2026-04-15-promo-site-design.md`

## 1. 目标

把 docx 里大量真实、品质很高的素材（文本 + 图片）替换/补齐到现有站点对应模块里，去掉占位/编造内容。统一交互原则：**首页 NavMenu 卡片 → 子页直接长排版呈现完整内容，不做弹窗、不做 home 内嵌展开**。

## 2. 总体决策

| 决策项 | 选择 | 备注 |
|---|---|---|
| 图片提取 | 全量提取 docx 59 张图片 | 创始人/教练/案例分别归类 |
| 交互模型 | NavMenu → 子页一次性长排版 | 不做弹窗、不做手风琴 |
| 私人订制套餐 | 分两区块 | 基础 3 个 + 高端 4 个 |
| 成功案例 | 长滚动图文交替 | 每个案例 ~一屏，左右交替 |
| 教练团队 | 落在 `/one-on-one` 子页底部 | 不新建独立路由 |
| 创始人 | 落在 `/about` 子页 | 「品牌简介」之后追加 section |
| 双语 | 凡 docx 提供英文的，全部同步进 `en.json` | 不再用机翻 |

## 3. docx 段落 → 站点模块映射

| docx 段落 | 目标位置 | 改动 |
|---|---|---|
| 品牌简介（ZH/EN）| `/about` 顶部 | 替换 `pages.about.story1Body` 为 docx 全文 |
| 公司使命（ZH/EN）| `/about` 增 section | 新 i18n key `pages.about.mission` |
| 公司愿景（ZH/EN）| `/about` 增 section | 新 key `pages.about.vision` |
| 公司价值观（ZH/EN，4 条）| `/about` 增 section | 新 key `pages.about.values[]`，4 张小卡 |
| 公司创始人（Jessie + Anna）| `/about` 增 section | 新 key `pages.about.founders[]`，2 列大图文 |
| **六大专业团队**（详细 ZH/EN）| 首页 `SixTeamsSection` + `/about` 复用 | 重写 `home.sixTeams.items`：增加 `nameEn` + `desc` 改为多行；保持 6 卡片网格 |
| 教练团队风采（10 人）| `/one-on-one` 新 section「我们的教练」| 新 key `pages.oneOnOne.coaches[]`，3 列卡片网格，每卡：照片 + 名字 + 头衔 + 多行简介 |
| 完善系统的课程体系（仅图）| 首页 `CourseSystemSection` 配图升级 | 用 docx image13–19 作为各 STEP 卡片配图（裁剪比例 16:9）；文本不变 |
| **部分成功会员展示**（20+ 案例）| `/success-cases` 全量重写 | 长滚动图文交替；新 key `pages.successCases.cases[]`，每条：1–2 图 + 标题 + 长文 |
| **会员服务方案**（7 套餐）| `/custom` 全量重写 | 分两区块：`pages.custom.basicTiers[3]` + `pages.custom.premiumTiers[4]` |
| `/party` | 不动 | docx 无对应内容 |
| `/wedding-gallery` | 不动 | docx 无对应内容 |

## 4. 图片提取与归类

**脚本**：`scripts/extract-docx-media.py`（Python，一次性脚本）
- 从 `docs/resources.docx` 解包 `word/media/*`
- 按 docx 中出现顺序（image1 … image59）映射到目标目录与命名

**输出目录与命名**：

| 目录 | 数量 | 命名 | docx 来源 |
|---|---|---|---|
| `public/images/founders/` | 2 | `jessie.png`, `anna.png` | image1, image2 |
| `public/images/coaches/` | 10 | `xiaowei.png`, `xiaolu.png`, `duoer.png`, `amy.png`, `yufei.png`, `vivian.png`, `vare.jpg`, `grace.jpg`, `anne.jpg`, `mia.jpg` | image3–image12 |
| `public/images/courses/` | 7 | `course-1.jpg` … `course-7.jpg` | image13–image19 |
| `public/images/cases/` | 40 | `case-01.jpg` … `case-40.jpg`（每案例 1–2 张，按出现顺序）| image20–image59 |

提取后用 `sharp` 做一次批量压缩（沿用项目已有 `sharp` 依赖；目标质量 80，长边 ≤ 1600px，避免新加图把 13MB 总量再次推高）。

**docx 图片与案例的对应**：脚本不做语义判断，按出现顺序顺序写入。spec 实施阶段在写 `pages.successCases.cases[]` 时，按 docx 案例标题顺序手动指定每条 case 用哪些 `case-XX.jpg`。

## 5. 各子页重写细节

### 5.1 `/about` — 公司介绍

最终结构（自上而下）。**移除现有 story2 区块**（关于 6 大团队的旧文案——已在主页 `SixTeamsSection` 覆盖）：

1. **PageHero**（沿用现有组件） — 标题「公司介绍」+ 副标题
2. **品牌简介**（沿用现有 story1 左图右文 + cities chips 行） — `story1Body` 替换为 docx 全文；图换为 founders 合影或保留现有 team-frontdesk
3. **3 stats 数字网格**（30,000+ / 2019 / 3） — 沿用，文案 docx 验证后确认无需改
4. **公司使命** — 居中大字标题 + 中英双语段落
5. **公司愿景** — 同 mission，背景色用 `bg-muted/30` 区分
6. **公司价值观** — 4 张小卡片网格（4 条 Authenticity / Growth / Happiness / Companionship），ZH/EN 同卡，icon 用 lucide
7. **创始人** — 2 张大图文，左右交替
   - Jessie（冯程程）：照片 + 长简介
   - Anna（蒋逸）：照片 + 长简介

⚠ 删除：现有 `pages.about.story2Title` / `story2Body` 不再使用（i18n key 也删除，避免冗余）

### 5.2 `/one-on-one` — 一对一服务

最终结构：

1. PageHero（不变）
2. intro / processTitle / 6 steps（不变）
3. coachTitle / coachBody（不变）
4. **新增：我们的教练 section**
   - 标题「我们的教练 Meet your coaches」
   - 3 列卡片网格（lg: 3 / md: 2 / sm: 1），10 张
   - 每张卡：上方圆角照片（aspect 3:4）+ 名字 + 头衔（如「一对一教练辅导咨询」）+ 多行简介
   - 卡片背景白、阴影柔，hover 微抬

### 5.3 `/custom` — 私人订制

完全替换 `pages.custom.tiers`，改为：

```
pages.custom.basicTiers = [B套餐, C套餐, D套餐]   // 3 张卡，标题 / 服务期 / 5 行 features
pages.custom.premiumTiers = [白金, 钻石, 至尊, 超级]  // 4 张卡，资产档位 + 对象范围 + 服务条款
```

UI：
- 顶部沿用 PageHero + intro
- **基础套餐**：3 列卡片，lg:3 / md:3 / sm:1
- 视觉分隔：渐变分隔条 + 副标题「高端私人订制」
- **高端套餐**：4 列卡片，lg:4 / md:2 / sm:1，配色更深（金色 / 香槟）以做差异化
- 每张卡片显示：套餐名 / 服务期 / 男士资产档（如有）/ 5–7 条 features / 不再有"立即咨询"按钮（保持无 CTA 原则）

### 5.4 `/success-cases` — 部分成功案例

完全替换 `pages.successCases.cases`。新结构：

- PageHero + intro 不变
- **新版排版**：每个案例占独立 `<article>` 块，最大宽度 ~960px 居中
  - 奇数案例：左图右文
  - 偶数案例：右图左文
  - 图片：1 张时大图占满左/右半，2 张时上下小堆叠
  - 文本块：`<h3>` 标题（如「佛罗里达 61 岁芙蓉姐的幸福爱情」）+ 多段 `<p>`
- 案例之间用 80px 留白分隔，不画分割线
- 移动端：图文堆叠（图在上、文在下），不再左右交替
- 由于案例多（~20），底部不做分页，长滚动到底

i18n 数据结构：

```json
"cases": [
  {
    "id": "vera",
    "title": "我和大通银行 G 先生的爱情故事",
    "images": ["case-01.jpg", "case-02.jpg"],
    "paragraphs": ["...", "...", "..."]
  }
]
```

每条 ~3–6 段；docx 原文按段落拆分。

### 5.5 首页 `SixTeamsSection` — 升级 6 大团队

i18n 重写为：

```json
"sixTeams": {
  "title": "六大专业团队 全程护航",
  "items": [
    { "name": "会员筛选团队", "nameEn": "Member Selection Team", "desc": "严审背景，确保会员真实性" },
    { "name": "精准匹配团队", "nameEn": "Precision Matching Team", "desc": "深度访谈与择偶标准分析，实现双向甄选，严控品质" },
    { "name": "情感陪跑团队", "nameEn": "Emotional Support Team", "desc": "全程陪跑恋爱过程中每一个节点" },
    { "name": "形象蜕变团队", "nameEn": "Image & Confidence Team", "desc": "从穿搭到气场，从礼仪到表达，全面提升你的自信值" },
    { "name": "婚姻推进团队", "nameEn": "Relationship Progression Team", "desc": "从见面、订婚、签证到登记结婚，协助推进感情落地" },
    { "name": "婚姻经营团队", "nameEn": "Marriage Enrichment Team", "desc": "婚姻不是终点，而是新的开始；陪你走入真实生活中的亲密关系" }
  ]
}
```

UI：6 卡片不动，每卡内增加 `nameEn` 小字（在 `name` 下方，灰色 0.85em）。

### 5.6 首页 `CourseSystemSection` — 配图升级

- 文本 4 STEP 不变（破冰 / 形象提升 / 约会实战 / 关系升温）
- 4 张卡片各加 1 张配图（从 `public/images/courses/course-1.jpg` … `course-4.jpg`）
- 卡片版式从纯文本改为：上图（aspect 16:9，圆角顶部）+ 下文区
- 剩余 `course-5.jpg ~ course-7.jpg` 暂不使用（备选）

## 6. i18n 文件改动总览

`zh.json` / `en.json` 同步增加/修改的 key：

```
home.sixTeams.items[].nameEn          // 新增字段
pages.about.story1Body                // 替换为 docx 品牌简介全文
pages.about.mission                   // 新增
pages.about.vision                    // 新增
pages.about.values                    // 新增 (4 条)
pages.about.founders                  // 新增 (2 条 {name, title, image, body})
pages.oneOnOne.coachesTitle           // 新增
pages.oneOnOne.coaches                // 新增 (10 条 {name, title, image, body})
pages.custom.basicTiers               // 新增 (3 条)，淘汰 tiers
pages.custom.premiumTiers             // 新增 (4 条)
pages.successCases.cases              // 完全重写 (20+ 条 {id, title, images[], paragraphs[]})
```

英文版策略：
- docx 原文有英文的：直接照搬
- docx 原文无英文（如教练简介、案例故事、套餐内容）：本期暂留中文同 zh，后期人工翻译
  - 在 spec 实现阶段，所有中文 only 的 key 在 `en.json` 里仍然写中文值（占位），并在该 key 上方加注释如 `"_TODO_translate_coaches": true`，便于后期审计

## 7. 新增/修改的文件清单

**新增**：
- `scripts/extract-docx-media.py` — 一次性提取脚本
- `public/images/founders/jessie.png`, `anna.png`
- `public/images/coaches/*.png|jpg` (10)
- `public/images/courses/course-1..7.jpg` (7)
- `public/images/cases/case-01..40.jpg` (~40)
- `src/components/about/MissionSection.tsx`
- `src/components/about/VisionSection.tsx`
- `src/components/about/ValuesSection.tsx`
- `src/components/about/FoundersSection.tsx`
- `src/components/oneOnOne/CoachesSection.tsx`
- `src/components/custom/TierGroup.tsx` — 通用，给 basic/premium 复用
- `src/components/successCases/CaseStory.tsx` — 单个案例左右交替组件

**修改**：
- `src/i18n/zh.json`, `src/i18n/en.json`
- `src/pages/About.tsx` — 装载新增 4 个 about 子组件
- `src/pages/OneOnOne.tsx` — 末尾追加 CoachesSection
- `src/pages/Custom.tsx` — 改用 TierGroup × 2
- `src/pages/SuccessCases.tsx` — 重写为 CaseStory 列表
- `src/components/home/SixTeamsSection.tsx` — 显示 nameEn 小字
- `src/components/home/CourseSystemSection.tsx` — 增加配图

## 8. 不做的事（YAGNI）

- 不做案例搜索 / 筛选 / 分页
- 不做案例点击展开（已确认全部一次性铺开）
- 不做创始人 / 教练详情页
- 不做对比表格（套餐之间不做横向 compare table，纯卡片足够）
- 不做后端 / CMS（继续 i18n JSON 静态化）
- 不做 CTA 表单 / 报名按钮（沿用原 spec 决策）
- 不做英文人工翻译（凡 docx 没给的，暂用中文占位 + TODO 标记）

## 9. 验收标准

- `npm run build` 通过，产物可静态托管
- `/about` 出现 6 个内容块：PageHero / 品牌简介 / 使命 / 愿景 / 价值观 / 创始人 / 三大服务中心
- `/one-on-one` 末尾出现 10 张教练卡片，照片真实加载
- `/custom` 出现 3 张基础套餐 + 4 张高端套餐
- `/success-cases` 长滚动呈现 20 个真实案例（左右交替，移动端堆叠）
- 主页 `SixTeamsSection` 6 张卡片显示中英双名 + 真实职责
- 主页 `CourseSystemSection` 4 张卡片有配图
- 中英语言切换正常；docx 提供英文的内容在 EN 下显示英文
- 移动端（≤480px）所有新组件不溢出、可读
- 总图片增量经压缩后 < 30MB
