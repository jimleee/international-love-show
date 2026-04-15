# International Love Show — 静态宣传站设计

日期：2026-04-15
项目目录：`D:\AI\my-projects\international-love-show`
姊妹项目（参考来源）：`D:\AI\my-projects\international-love`

## 1. 目标

为客户「International Love dating Club」做一个**完全独立的静态宣传网站**，沿用主站 international-love 的视觉风格，承载公司介绍、核心服务、团队、课程、活动花絮、成功案例等内容。无后端、无注册、无 CTA 转化入口，纯展示。

## 2. 技术决策

| 项 | 决策 |
|---|---|
| 范围 | 完全独立的新项目（独立仓库与构建） |
| 技术栈 | Vite + React 18 + TypeScript + Tailwind CSS |
| 路由 | `react-router-dom`（多页面，BrowserRouter） |
| 国际化 | `react-i18next`（中文 zh / 英文 en，默认 zh） |
| SEO | `react-helmet-async` 每页设置 title / description / og |
| UI 组件 | 复用 international-love 的 shadcn/ui 组件 |
| 响应式 | Tailwind 断点（`sm` / `md` / `lg`），PC 与移动端都支持 |
| 视觉风格 | 完全沿用 international-love：复制 `tailwind.config.ts`、`index.css` 主题变量、字体配置 |
| 部署 | 默认输出 `dist/` 静态产物，可托管于 Nginx / Vercel / Netlify 任意静态宿主 |
| CTA | 不做转化入口；联系信息仅在 Footer 展示 |

## 3. 项目结构

```
international-love-show/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── postcss.config.js
├── 轮播图(1).psd                    # 既有素材
├── public/
│   └── images/
│       ├── carousel/                # 从 PSD 提取的 8 张轮播图（PNG）
│       ├── team/                    # 六大团队照片
│       ├── party/                   # 线下活动照片
│       ├── wedding/                 # 婚礼花絮
│       └── cases/                   # 成功案例
├── scripts/
│   └── extract-psd.py               # 一次性脚本：psd-tools 提取图层 → PNG
├── docs/
│   └── superpowers/specs/           # 本设计文档所在
└── src/
    ├── main.tsx
    ├── App.tsx                      # Router 配置
    ├── index.css                    # 沿用 international-love 主题变量
    ├── i18n/
    │   ├── index.ts
    │   ├── zh.json
    │   └── en.json
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx           # Logo + 6 项导航 + 语言切换
    │   │   └── Footer.tsx           # 三大服务中心地址 + 版权
    │   ├── ui/                      # shadcn 组件（Button / Card 等）
    │   └── home/
    │       ├── HeroCarousel.tsx
    │       ├── ManifestoSection.tsx
    │       ├── AboutSection.tsx
    │       ├── AdvantagesSection.tsx
    │       ├── SixTeamsSection.tsx
    │       ├── CourseSystemSection.tsx
    │       └── TeamShowcaseSection.tsx
    └── pages/
        ├── Home.tsx
        ├── About.tsx
        ├── OneOnOne.tsx
        ├── Custom.tsx
        ├── Party.tsx
        ├── WeddingGallery.tsx
        └── SuccessCases.tsx
```

## 4. 路由与页面映射

| 路径 | 组件 | 内容 |
|---|---|---|
| `/` | `Home.tsx` | Hero 轮播 + 7 个 section（见 §5） |
| `/about` | `About.tsx` | 公司介绍详情（一屏图文 + 亮点） |
| `/one-on-one` | `OneOnOne.tsx` | 一对一服务介绍 |
| `/custom` | `Custom.tsx` | 私人订制服务介绍 |
| `/party` | `Party.tsx` | 线下 party 介绍 |
| `/wedding-gallery` | `WeddingGallery.tsx` | 婚礼花絮 |
| `/success-cases` | `SuccessCases.tsx` | 部分成功案例 |

所有页面共享 `Header` + `Footer`。子页统一采用「轻量介绍页」结构：一屏图文 + 服务亮点列表，无 CTA。

## 5. 首页 Section 设计

| Section | 内容 |
|---|---|
| **HeroCarousel** | 全宽轮播，高度 ≥ 80vh，8 张图（来自 PSD），每张叠加 i18n 标语，自动播放 + 指示器 + 左右箭头 |
| **ManifestoSection** | 公司宣言：单句大标题 + 副标题，居中、留白大、品牌色背景 |
| **AboutSection** | 左图右文（移动端堆叠）介绍公司背景、定位 |
| **AdvantagesSection** | 4–6 个优势卡片网格：图标 + 标题 + 简述 |
| **SixTeamsSection** | 「六大专业团队 全程护航」六卡片网格（团队名 + 职能 + 配图） |
| **CourseSystemSection** | 「完善系统的课程体系」课程模块阶梯/时间线展示 |
| **TeamShowcaseSection** | 团队风采图墙（参考 international-love 的 PartyPhotosSection 版式） |

## 6. 轮播图标语（i18n 化）

按顺序对应 PSD 中 8 张图层：

1. International Love dating Club 高端国际婚恋服务机构
2. 一对一教练全程陪伴 为你的爱情保驾护航
3. 线下大量会员 每位会员的资料真实可靠
4. 私人定制 高效分配 遇见你一生的挚爱
5. 六大专业团队 为你的爱情全面打造
6. 恋爱秘籍 脱单宝典 完善系统的课程体系
7. 线下单身派对 与优秀的人面对面相识
8. 洛杉矶 旧金山 拉斯维加斯三大服务中心

英文译文在实现阶段补齐到 `en.json`。

## 7. PSD 素材提取

一次性脚本 `scripts/extract-psd.py`：
- 依赖：`psd-tools`（Python）
- 读取 `轮播图(1).psd`，导出每个顶层图层为独立 PNG
- 输出至 `public/images/carousel/slide-1.png` … `slide-8.png`
- 失败时回退方案：手工用 Photoshop / Photopea 导出，按相同命名放置

## 8. i18n 方案

- 文案全部存于 `src/i18n/zh.json` / `en.json`
- Header 右上角语言切换按钮（中 / EN）
- 默认语言 `zh`，浏览器语言为英文时自动切到 `en`
- key 命名按页面/section 分组，例如 `home.hero.slide1.title`

## 9. 视觉与样式复用

- 直接拷贝 `international-love/frontend/tailwind.config.ts` → 同步主题色、字体、动画配置
- 拷贝 `index.css` 中的 CSS 变量与字体引入
- 复用 `components/ui/`（Button / Card / Carousel 等 shadcn 组件）
- 首页 Section 的视觉版式参考主站 `components/home/AboutSection.tsx`、`PartyPhotosSection.tsx`

## 10. 不做的事（YAGNI）

- 不做用户系统、注册、登录
- 不做后端 API、数据库
- 不做 CTA 表单、报名入口
- 不做支付、订阅
- 不做 CMS（文案直接写 i18n JSON，便于客户日后替换）
- 不做单元测试（纯静态宣传站，验收以视觉走查为主）

## 11. 验收标准

- `npm run build` 产物可静态托管，无运行时报错
- 7 个路由页面均能正常访问，刷新不 404（Nginx 配置 fallback 到 `index.html`）
- 中英切换正常，所有可见文案均来自 i18n
- 桌面（≥ 1280px）与移动（≤ 480px）两端布局正常
- 8 张轮播图正确加载并叠加对应文案
- Lighthouse 性能 ≥ 85，SEO ≥ 90
