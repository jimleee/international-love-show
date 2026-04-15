# International Love Show — 静态宣传站实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为客户搭建一个完全独立的中英双语静态宣传网站，沿用 international-love 的视觉风格，承载 7 个页面（首页 + 6 个子服务页）。

**Architecture:** Vite + React 18 + TypeScript + Tailwind 多页面应用，react-router-dom 控制路由，react-i18next 处理中英双语，react-helmet-async 处理 SEO；纯静态产物可托管于任何静态宿主。视觉系统、Tailwind 主题、shadcn/ui 组件直接从 `D:\AI\my-projects\international-love\frontend` 复用。

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind 3, react-router-dom 6, react-i18next, react-helmet-async, embla-carousel-react (Hero 轮播), Python `psd-tools`（一次性提图）。

**参考源**：`D:\AI\my-projects\international-love\frontend`
**项目目录**：`D:\AI\my-projects\international-love-show`

---

## Task 1：项目初始化与依赖安装

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `.gitignore`

- [ ] **Step 1：在项目根目录脚手架 Vite + React + TS**

```bash
cd "D:/AI/my-projects/international-love-show"
npm create vite@latest . -- --template react-ts
# 出现 "Current directory is not empty" 时选 "Ignore files and continue"
```

- [ ] **Step 2：安装运行依赖**

```bash
npm install react-router-dom react-i18next i18next i18next-browser-languagedetector react-helmet-async embla-carousel-react clsx tailwind-merge class-variance-authority lucide-react
```

- [ ] **Step 3：安装 Tailwind 与开发依赖**

```bash
npm install -D tailwindcss postcss autoprefixer @types/node tailwindcss-animate
npx tailwindcss init -p
```

- [ ] **Step 4：从 international-love 拷贝 Tailwind 主题与全局样式**

```bash
cp "D:/AI/my-projects/international-love/frontend/tailwind.config.ts" "D:/AI/my-projects/international-love-show/tailwind.config.ts"
cp "D:/AI/my-projects/international-love/frontend/postcss.config.js" "D:/AI/my-projects/international-love-show/postcss.config.js"
cp "D:/AI/my-projects/international-love/frontend/src/index.css" "D:/AI/my-projects/international-love-show/src/index.css"
cp "D:/AI/my-projects/international-love/frontend/components.json" "D:/AI/my-projects/international-love-show/components.json"
```

确认 `tailwind.config.ts` 中的 `content` 字段为：
```ts
content: ["./index.html", "./src/**/*.{ts,tsx}"],
```

- [ ] **Step 5：配置 Vite 路径别名**

`vite.config.ts`：

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: { port: 5180 },
});
```

`tsconfig.json` 添加：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

- [ ] **Step 6：设置 index.html 与入口**

`index.html`（替换默认）：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>International Love dating Club</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7：启动 dev server 验证**

```bash
npm run dev
```
预期：访问 `http://localhost:5180` 显示默认 Vite React 页面，无报错。Ctrl+C 退出。

- [ ] **Step 8：初始化 git 并提交**

```bash
cd "D:/AI/my-projects/international-love-show"
git init
git add -A
git commit -m "chore: scaffold Vite + React + TS + Tailwind project"
```

---

## Task 2：复用 international-love 的 shadcn UI 组件

**Files:**
- Create: `src/components/ui/` 目录下若干文件（来自 international-love）
- Create: `src/lib/utils.ts`

- [ ] **Step 1：拷贝 utils 与 UI 组件**

```bash
cp "D:/AI/my-projects/international-love/frontend/src/lib/utils.ts" "D:/AI/my-projects/international-love-show/src/lib/utils.ts"
mkdir -p "D:/AI/my-projects/international-love-show/src/components/ui"
cp "D:/AI/my-projects/international-love/frontend/src/components/ui/button.tsx" "D:/AI/my-projects/international-love-show/src/components/ui/button.tsx"
cp "D:/AI/my-projects/international-love/frontend/src/components/ui/card.tsx" "D:/AI/my-projects/international-love-show/src/components/ui/card.tsx"
```

- [ ] **Step 2：验证编译**

```bash
npm run build
```
预期：build 成功（即使页面还是默认内容）。如缺组件，按报错继续从 international-love `components/ui/` 拷贝对应文件。

- [ ] **Step 3：提交**

```bash
git add -A
git commit -m "chore: copy shared UI components and utils from international-love"
```

---

## Task 3：i18n 基础设施 + 文案 JSON

**Files:**
- Create: `src/i18n/index.ts`, `src/i18n/zh.json`, `src/i18n/en.json`

- [ ] **Step 1：创建 i18n 初始化**

`src/i18n/index.ts`：

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import zh from "./zh.json";
import en from "./en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    fallbackLng: "zh",
    interpolation: { escapeValue: false },
  });

export default i18n;
```

- [ ] **Step 2：写入完整中文文案 `src/i18n/zh.json`**

```json
{
  "brand": "International Love dating Club",
  "nav": {
    "about": "公司介绍",
    "oneOnOne": "一对一服务",
    "custom": "私人订制",
    "party": "线下 party",
    "weddingGallery": "婚礼花絮",
    "successCases": "部分成功案例"
  },
  "footer": {
    "centers": "三大服务中心",
    "losAngeles": "洛杉矶",
    "sanFrancisco": "旧金山",
    "lasVegas": "拉斯维加斯",
    "copyright": "© 2026 International Love dating Club. 版权所有."
  },
  "home": {
    "carousel": {
      "slide1": "International Love dating Club 高端国际婚恋服务机构",
      "slide2": "一对一教练全程陪伴 为你的爱情保驾护航",
      "slide3": "线下大量会员 每位会员的资料真实可靠",
      "slide4": "私人定制 高效分配 遇见你一生的挚爱",
      "slide5": "六大专业团队 为你的爱情全面打造",
      "slide6": "恋爱秘籍 脱单宝典 完善系统的课程体系",
      "slide7": "线下单身派对 与优秀的人面对面相识",
      "slide8": "洛杉矶 旧金山 拉斯维加斯三大服务中心"
    },
    "manifesto": {
      "title": "用心遇见 真爱无界",
      "subtitle": "为每一段缘分倾注专业与温度"
    },
    "about": {
      "title": "关于我们",
      "body": "International Love dating Club 是一家专注于高端国际婚恋服务的机构，覆盖洛杉矶、旧金山、拉斯维加斯三大服务中心，致力于为每一位会员匹配真实、合适、长久的伴侣。"
    },
    "advantages": {
      "title": "我们的优势特色",
      "items": [
        { "title": "真实可靠", "desc": "每位会员资料严格审核" },
        { "title": "高效匹配", "desc": "一对一教练精准分配" },
        { "title": "全程护航", "desc": "六大专业团队保驾护航" },
        { "title": "完善课程", "desc": "系统的恋爱与婚姻课程体系" }
      ]
    },
    "sixTeams": {
      "title": "六大专业团队 全程护航",
      "items": [
        { "name": "红娘团队", "desc": "资深红娘人工撮合" },
        { "name": "心理咨询团队", "desc": "情感与心理疏导" },
        { "name": "形象设计团队", "desc": "形象与造型升级" },
        { "name": "婚恋课程团队", "desc": "系统课程培训" },
        { "name": "活动策划团队", "desc": "线下派对与约会策划" },
        { "name": "客服管家团队", "desc": "全程贴心服务" }
      ]
    },
    "courseSystem": {
      "title": "完善系统的课程体系",
      "items": [
        { "stage": "破冰阶段", "desc": "认识自我与情感需求" },
        { "stage": "形象提升", "desc": "外形与谈吐的全面打磨" },
        { "stage": "约会实战", "desc": "高情商沟通与约会技巧" },
        { "stage": "关系升温", "desc": "建立健康长久的亲密关系" }
      ]
    },
    "teamShowcase": {
      "title": "团队风采"
    }
  },
  "pages": {
    "about": {
      "title": "公司介绍",
      "intro": "International Love dating Club 创立于美国，扎根北美华人社区，是一家高端国际婚恋服务机构。",
      "highlights": [
        "三大服务中心覆盖：洛杉矶 / 旧金山 / 拉斯维加斯",
        "六大专业团队全程护航",
        "真实会员，严格审核"
      ]
    },
    "oneOnOne": {
      "title": "一对一服务",
      "intro": "资深教练一对一陪伴，为你的每一次相识、每一次约会、每一段关系全程护航。",
      "highlights": [
        "专属教练全程跟进",
        "约会复盘与策略指导",
        "情感心理深度疏导"
      ]
    },
    "custom": {
      "title": "私人订制",
      "intro": "根据你的择偶标准、生活方式与人生阶段，量身定制专属匹配方案。",
      "highlights": [
        "需求深度访谈",
        "高净值私密匹配",
        "稀缺资源优先对接"
      ]
    },
    "party": {
      "title": "线下 party",
      "intro": "高品质线下单身派对，与优秀的人面对面相识。",
      "highlights": [
        "严格筛选嘉宾",
        "精致场地与流程",
        "破冰互动全程引导"
      ]
    },
    "weddingGallery": {
      "title": "婚礼花絮",
      "intro": "见证从相识到走入婚姻殿堂的甜蜜瞬间。"
    },
    "successCases": {
      "title": "部分成功案例",
      "intro": "真实牵手、真实幸福，他们的故事正在发生。"
    }
  }
}
```

- [ ] **Step 3：写入完整英文文案 `src/i18n/en.json`**

```json
{
  "brand": "International Love Dating Club",
  "nav": {
    "about": "About",
    "oneOnOne": "One-on-One",
    "custom": "Custom Matchmaking",
    "party": "Offline Party",
    "weddingGallery": "Wedding Gallery",
    "successCases": "Success Stories"
  },
  "footer": {
    "centers": "Three Service Centers",
    "losAngeles": "Los Angeles",
    "sanFrancisco": "San Francisco",
    "lasVegas": "Las Vegas",
    "copyright": "© 2026 International Love Dating Club. All rights reserved."
  },
  "home": {
    "carousel": {
      "slide1": "International Love Dating Club — Premium International Matchmaking",
      "slide2": "One-on-One Coaching, Guarding Every Step of Your Love",
      "slide3": "A Large Verified Member Base — Every Profile is Real",
      "slide4": "Custom Matchmaking, Efficient Pairing, Meet The One",
      "slide5": "Six Professional Teams, Crafting Your Love Story",
      "slide6": "Dating Playbooks & Systematic Courses",
      "slide7": "Offline Singles Parties — Meet Outstanding People In Person",
      "slide8": "Three Service Centers: LA, SF, Las Vegas"
    },
    "manifesto": {
      "title": "Meet With Heart, Love Without Borders",
      "subtitle": "Professional dedication for every meaningful connection"
    },
    "about": {
      "title": "About Us",
      "body": "International Love Dating Club is a premium international matchmaking agency with three service centers in LA, SF, and Las Vegas, dedicated to matching every member with a real, suitable, and lasting partner."
    },
    "advantages": {
      "title": "Our Advantages",
      "items": [
        { "title": "Verified & Trustworthy", "desc": "Every member profile is strictly reviewed" },
        { "title": "Efficient Matching", "desc": "One-on-one coaches pair you precisely" },
        { "title": "Full-Journey Support", "desc": "Six professional teams have your back" },
        { "title": "Systematic Courses", "desc": "Complete dating & relationship curriculum" }
      ]
    },
    "sixTeams": {
      "title": "Six Professional Teams, Full-Journey Support",
      "items": [
        { "name": "Matchmaker Team", "desc": "Senior matchmakers, hand-curated pairings" },
        { "name": "Psychology Team", "desc": "Emotional and psychological coaching" },
        { "name": "Image Team", "desc": "Style and presentation upgrade" },
        { "name": "Course Team", "desc": "Systematic training programs" },
        { "name": "Event Team", "desc": "Offline parties and date planning" },
        { "name": "Concierge Team", "desc": "Attentive end-to-end service" }
      ]
    },
    "courseSystem": {
      "title": "Complete Course System",
      "items": [
        { "stage": "Self-Discovery", "desc": "Understand yourself and your needs" },
        { "stage": "Image Upgrade", "desc": "Refine appearance and presence" },
        { "stage": "Dating Practice", "desc": "High-EQ communication & dating skills" },
        { "stage": "Relationship Growth", "desc": "Build lasting healthy intimacy" }
      ]
    },
    "teamShowcase": {
      "title": "Team Highlights"
    }
  },
  "pages": {
    "about": {
      "title": "About Us",
      "intro": "Founded in the U.S. and rooted in the North American Chinese community, International Love Dating Club is a premium international matchmaking agency.",
      "highlights": [
        "Three service centers: LA / SF / Las Vegas",
        "Six professional teams supporting every step",
        "Real members, strictly reviewed"
      ]
    },
    "oneOnOne": {
      "title": "One-on-One Service",
      "intro": "A senior coach walks with you through every introduction, date, and relationship.",
      "highlights": [
        "Dedicated coach throughout",
        "Date debrief & strategy",
        "Deep emotional coaching"
      ]
    },
    "custom": {
      "title": "Custom Matchmaking",
      "intro": "A bespoke matching plan tailored to your preferences, lifestyle, and life stage.",
      "highlights": [
        "Deep needs interview",
        "High-net-worth private matching",
        "Priority access to scarce profiles"
      ]
    },
    "party": {
      "title": "Offline Parties",
      "intro": "Premium offline singles parties — meet outstanding people in person.",
      "highlights": [
        "Carefully screened guests",
        "Refined venues and flow",
        "Guided icebreaker activities"
      ]
    },
    "weddingGallery": {
      "title": "Wedding Gallery",
      "intro": "Witness sweet moments — from first meeting to the wedding aisle."
    },
    "successCases": {
      "title": "Success Stories",
      "intro": "Real couples, real happiness — their stories are happening now."
    }
  }
}
```

- [ ] **Step 4：在入口处加载 i18n**

修改 `src/main.tsx`：

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
```

- [ ] **Step 5：提交**

```bash
git add -A
git commit -m "feat(i18n): set up react-i18next with full zh/en content"
```

---

## Task 4：Router 与页面骨架

**Files:**
- Modify: `src/App.tsx`
- Create: `src/pages/Home.tsx`, `src/pages/About.tsx`, `src/pages/OneOnOne.tsx`, `src/pages/Custom.tsx`, `src/pages/Party.tsx`, `src/pages/WeddingGallery.tsx`, `src/pages/SuccessCases.tsx`

- [ ] **Step 1：写 App.tsx 路由**

```tsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import OneOnOne from "./pages/OneOnOne";
import Custom from "./pages/Custom";
import Party from "./pages/Party";
import WeddingGallery from "./pages/WeddingGallery";
import SuccessCases from "./pages/SuccessCases";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/one-on-one" element={<OneOnOne />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/party" element={<Party />} />
          <Route path="/wedding-gallery" element={<WeddingGallery />} />
          <Route path="/success-cases" element={<SuccessCases />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2：为 7 个页面创建占位组件**

每个文件：
```tsx
export default function Home() {
  return <div className="container mx-auto py-12">Home</div>;
}
```
其余 6 页同模板，分别返回各页面名占位。

- [ ] **Step 3：dev server 验证 7 个路由可达**

`npm run dev`，访问 `/`、`/about`、`/one-on-one`、`/custom`、`/party`、`/wedding-gallery`、`/success-cases` 均显示对应占位文字。

- [ ] **Step 4：提交**

```bash
git add -A
git commit -m "feat: scaffold router with 7 placeholder pages"
```

---

## Task 5：Header（导航 + 语言切换）

**Files:**
- Create: `src/components/layout/Header.tsx`

- [ ] **Step 1：实现 Header**

```tsx
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NAV = [
  { to: "/about", key: "nav.about" },
  { to: "/one-on-one", key: "nav.oneOnOne" },
  { to: "/custom", key: "nav.custom" },
  { to: "/party", key: "nav.party" },
  { to: "/wedding-gallery", key: "nav.weddingGallery" },
  { to: "/success-cases", key: "nav.successCases" },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const toggleLang = () => i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh");

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="font-semibold text-lg">{t("brand")}</Link>
        <nav className="hidden md:flex gap-6">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-sm hover:text-primary transition ${isActive ? "text-primary font-medium" : "text-foreground/80"}`
              }
            >
              {t(n.key)}
            </NavLink>
          ))}
        </nav>
        <button onClick={toggleLang} className="text-sm border rounded px-3 py-1">
          {i18n.language === "zh" ? "EN" : "中"}
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2：dev 验证导航与语言切换**

`npm run dev`，确认 Header 渲染、点击导航项可跳转、点击语言按钮文案在中英切换。

- [ ] **Step 3：提交**

```bash
git add -A
git commit -m "feat(layout): add Header with i18n nav and language toggle"
```

---

## Task 6：Footer（三大服务中心 + 版权）

**Files:**
- Create: `src/components/layout/Footer.tsx`

- [ ] **Step 1：实现 Footer**

```tsx
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t bg-muted/30 mt-12">
      <div className="container mx-auto px-4 py-10 grid gap-6 md:grid-cols-2">
        <div>
          <div className="font-semibold mb-2">{t("brand")}</div>
          <div className="text-sm text-foreground/70">{t("footer.centers")}</div>
          <ul className="text-sm text-foreground/70 mt-1 space-y-0.5">
            <li>• {t("footer.losAngeles")}</li>
            <li>• {t("footer.sanFrancisco")}</li>
            <li>• {t("footer.lasVegas")}</li>
          </ul>
        </div>
        <div className="text-sm text-foreground/60 md:text-right self-end">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2：dev 验证**

`npm run dev`，确认每页底部出现 Footer，中英切换正常。

- [ ] **Step 3：提交**

```bash
git add -A
git commit -m "feat(layout): add Footer with three service centers"
```

---

## Task 7：从 PSD 提取 8 张轮播图

**Files:**
- Create: `scripts/extract-psd.py`
- Create: `public/images/carousel/slide-1.png` … `slide-8.png`

- [ ] **Step 1：写 Python 提取脚本**

`scripts/extract-psd.py`：

```python
"""一次性脚本：从 轮播图(1).psd 顶层图层导出 PNG。"""
from pathlib import Path
from psd_tools import PSDImage

ROOT = Path(__file__).resolve().parent.parent
PSD_PATH = ROOT / "轮播图(1).psd"
OUT_DIR = ROOT / "public" / "images" / "carousel"
OUT_DIR.mkdir(parents=True, exist_ok=True)

psd = PSDImage.open(PSD_PATH)
# 按顶层组/图层导出，跳过隐藏层与文字层之外的辅助层
exported = []
for layer in psd:
    if layer.kind in ("group", "pixel", "smartobject"):
        img = layer.composite()
        if img is None:
            continue
        idx = len(exported) + 1
        out = OUT_DIR / f"slide-{idx}.png"
        img.save(out)
        exported.append((layer.name, out.name))
        if idx == 8:
            break

for name, fname in exported:
    print(f"{fname}  <-  {name}")
print(f"\nDone. Output: {OUT_DIR}")
```

- [ ] **Step 2：安装并运行**

```bash
pip install psd-tools
python "D:/AI/my-projects/international-love-show/scripts/extract-psd.py"
```
预期：`public/images/carousel/` 下生成 `slide-1.png` … `slide-8.png`。

- [ ] **Step 3：失败回退**

若脚本输出图层数 < 8 或图像异常：手动用 Photopea (https://www.photopea.com) 打开 PSD，逐图层导出 PNG 命名为 `slide-1.png` … `slide-8.png` 放入相同目录。

- [ ] **Step 4：提交**

```bash
git add scripts/extract-psd.py public/images/carousel/
git commit -m "chore(assets): extract 8 carousel images from PSD"
```

---

## Task 8：HeroCarousel 组件

**Files:**
- Create: `src/components/home/HeroCarousel.tsx`

- [ ] **Step 1：实现 Hero 轮播**

```tsx
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = Array.from({ length: 8 }, (_, i) => ({
  src: `/images/carousel/slide-${i + 1}.png`,
  textKey: `home.carousel.slide${i + 1}`,
}));

export default function HeroCarousel() {
  const { t } = useTranslation();
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    const id = setInterval(() => embla.scrollNext(), 5000);
    return () => {
      clearInterval(id);
      embla.off("select", onSelect);
    };
  }, [embla]);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "80vh", minHeight: 480 }}>
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {SLIDES.map((s, i) => (
            <div key={i} className="relative flex-[0_0_100%] h-full">
              <img src={s.src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <h2 className="text-white text-2xl md:text-5xl font-bold text-center max-w-4xl drop-shadow-lg">
                  {t(s.textKey)}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => embla?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-2 rounded-full"
        aria-label="prev"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => embla?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-2 rounded-full"
        aria-label="next"
      >
        <ChevronRight />
      </button>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => embla?.scrollTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition ${selected === i ? "bg-white" : "bg-white/40"}`}
            aria-label={`go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2：临时挂到 Home 验证**

修改 `src/pages/Home.tsx`：

```tsx
import HeroCarousel from "@/components/home/HeroCarousel";
export default function Home() {
  return <HeroCarousel />;
}
```

`npm run dev`，确认轮播图自动播放、左右箭头与指示器都工作，文案中英切换正常。

- [ ] **Step 3：提交**

```bash
git add -A
git commit -m "feat(home): add HeroCarousel with 8 slides and i18n captions"
```

---

## Task 9：ManifestoSection（公司宣言）

**Files:**
- Create: `src/components/home/ManifestoSection.tsx`

- [ ] **Step 1：实现**

```tsx
import { useTranslation } from "react-i18next";

export default function ManifestoSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-primary/5 py-20 px-4 text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-primary">{t("home.manifesto.title")}</h2>
      <p className="mt-4 text-lg md:text-xl text-foreground/70">{t("home.manifesto.subtitle")}</p>
    </section>
  );
}
```

- [ ] **Step 2：提交**

```bash
git add -A
git commit -m "feat(home): add ManifestoSection"
```

---

## Task 10：AboutSection（左图右文）

**Files:**
- Create: `src/components/home/AboutSection.tsx`

- [ ] **Step 1：实现**

```tsx
import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation();
  return (
    <section className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
      <img
        src="/images/carousel/slide-1.png"
        alt=""
        className="rounded-2xl shadow-lg w-full h-80 object-cover"
      />
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("home.about.title")}</h2>
        <p className="text-foreground/70 leading-relaxed">{t("home.about.body")}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2：提交**

```bash
git add -A
git commit -m "feat(home): add AboutSection"
```

---

## Task 11：AdvantagesSection（优势卡片）

**Files:**
- Create: `src/components/home/AdvantagesSection.tsx`

- [ ] **Step 1：实现**

```tsx
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

type Item = { title: string; desc: string };

export default function AdvantagesSection() {
  const { t } = useTranslation();
  const items = t("home.advantages.items", { returnObjects: true }) as Item[];

  return (
    <section className="bg-muted/30 py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("home.advantages.title")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Card key={i} className="text-center">
              <CardContent className="pt-8 pb-6">
                <CheckCircle2 className="mx-auto text-primary mb-3" size={32} />
                <h3 className="font-semibold text-lg mb-2">{it.title}</h3>
                <p className="text-sm text-foreground/70">{it.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2：提交**

```bash
git add -A
git commit -m "feat(home): add AdvantagesSection"
```

---

## Task 12：SixTeamsSection（六大团队）

**Files:**
- Create: `src/components/home/SixTeamsSection.tsx`

- [ ] **Step 1：实现**

```tsx
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

type Team = { name: string; desc: string };

export default function SixTeamsSection() {
  const { t } = useTranslation();
  const items = t("home.sixTeams.items", { returnObjects: true }) as Team[];

  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("home.sixTeams.title")}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((tm, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{tm.name}</h3>
                <p className="text-sm text-foreground/70">{tm.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2：提交**

```bash
git add -A
git commit -m "feat(home): add SixTeamsSection"
```

---

## Task 13：CourseSystemSection（课程体系）

**Files:**
- Create: `src/components/home/CourseSystemSection.tsx`

- [ ] **Step 1：实现**

```tsx
import { useTranslation } from "react-i18next";

type Stage = { stage: string; desc: string };

export default function CourseSystemSection() {
  const { t } = useTranslation();
  const items = t("home.courseSystem.items", { returnObjects: true }) as Stage[];

  return (
    <section className="bg-muted/30 py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("home.courseSystem.title")}</h2>
        <ol className="grid gap-4 md:grid-cols-4 max-w-5xl mx-auto">
          {items.map((s, i) => (
            <li key={i} className="relative bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-primary text-sm font-semibold mb-2">STEP {i + 1}</div>
              <div className="font-semibold text-lg mb-1">{s.stage}</div>
              <div className="text-sm text-foreground/70">{s.desc}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2：提交**

```bash
git add -A
git commit -m "feat(home): add CourseSystemSection"
```

---

## Task 14：TeamShowcaseSection（团队风采图墙）

**Files:**
- Create: `src/components/home/TeamShowcaseSection.tsx`
- Use: `public/images/carousel/slide-1.png` … `slide-8.png`（暂以轮播图复用作为占位风采图）

- [ ] **Step 1：实现**

```tsx
import { useTranslation } from "react-i18next";

const PHOTOS = Array.from({ length: 8 }, (_, i) => `/images/carousel/slide-${i + 1}.png`);

export default function TeamShowcaseSection() {
  const { t } = useTranslation();
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("home.teamShowcase.title")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PHOTOS.map((src, i) => (
          <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl">
            <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition" />
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2：提交**

```bash
git add -A
git commit -m "feat(home): add TeamShowcaseSection (uses carousel images as placeholders)"
```

---

## Task 15：组装 Home 页

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1：组装所有 section**

```tsx
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import HeroCarousel from "@/components/home/HeroCarousel";
import ManifestoSection from "@/components/home/ManifestoSection";
import AboutSection from "@/components/home/AboutSection";
import AdvantagesSection from "@/components/home/AdvantagesSection";
import SixTeamsSection from "@/components/home/SixTeamsSection";
import CourseSystemSection from "@/components/home/CourseSystemSection";
import TeamShowcaseSection from "@/components/home/TeamShowcaseSection";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t("brand")}</title>
        <meta name="description" content={t("home.manifesto.subtitle") as string} />
      </Helmet>
      <HeroCarousel />
      <ManifestoSection />
      <AboutSection />
      <AdvantagesSection />
      <SixTeamsSection />
      <CourseSystemSection />
      <TeamShowcaseSection />
    </>
  );
}
```

- [ ] **Step 2：dev 验证**

`npm run dev`，访问 `/`，确认 7 节按顺序展示，桌面/移动两种宽度都正常，中英切换无残留。

- [ ] **Step 3：提交**

```bash
git add -A
git commit -m "feat(home): assemble full home page"
```

---

## Task 16：通用 SimplePage 组件（用于 6 个子页）

**Files:**
- Create: `src/components/SimplePage.tsx`

- [ ] **Step 1：实现**

```tsx
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface Props {
  i18nNamespace: string; // 例如 "pages.about"
  heroImage?: string;    // 可选，默认用轮播图 slide-1
}

export default function SimplePage({ i18nNamespace, heroImage = "/images/carousel/slide-1.png" }: Props) {
  const { t } = useTranslation();
  const title = t(`${i18nNamespace}.title`) as string;
  const intro = t(`${i18nNamespace}.intro`) as string;
  const highlights = t(`${i18nNamespace}.highlights`, { returnObjects: true, defaultValue: [] }) as string[];

  return (
    <>
      <Helmet>
        <title>{title} · International Love dating Club</title>
        <meta name="description" content={intro} />
      </Helmet>

      <section className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg">{title}</h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <p className="text-lg leading-relaxed text-foreground/80">{intro}</p>

        {highlights.length > 0 && (
          <ul className="mt-8 space-y-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="text-primary mt-1">●</span>
                <span className="text-foreground/80">{h}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
```

- [ ] **Step 2：提交**

```bash
git add -A
git commit -m "feat: add SimplePage component for sub-pages"
```

---

## Task 17：填充 6 个子页面

**Files:**
- Modify: `src/pages/About.tsx`, `OneOnOne.tsx`, `Custom.tsx`, `Party.tsx`, `WeddingGallery.tsx`, `SuccessCases.tsx`

- [ ] **Step 1：About.tsx**

```tsx
import SimplePage from "@/components/SimplePage";
export default function About() {
  return <SimplePage i18nNamespace="pages.about" />;
}
```

- [ ] **Step 2：OneOnOne.tsx**

```tsx
import SimplePage from "@/components/SimplePage";
export default function OneOnOne() {
  return <SimplePage i18nNamespace="pages.oneOnOne" heroImage="/images/carousel/slide-2.png" />;
}
```

- [ ] **Step 3：Custom.tsx**

```tsx
import SimplePage from "@/components/SimplePage";
export default function Custom() {
  return <SimplePage i18nNamespace="pages.custom" heroImage="/images/carousel/slide-4.png" />;
}
```

- [ ] **Step 4：Party.tsx**

```tsx
import SimplePage from "@/components/SimplePage";
export default function Party() {
  return <SimplePage i18nNamespace="pages.party" heroImage="/images/carousel/slide-7.png" />;
}
```

- [ ] **Step 5：WeddingGallery.tsx**

```tsx
import SimplePage from "@/components/SimplePage";
export default function WeddingGallery() {
  return <SimplePage i18nNamespace="pages.weddingGallery" heroImage="/images/carousel/slide-3.png" />;
}
```

- [ ] **Step 6：SuccessCases.tsx**

```tsx
import SimplePage from "@/components/SimplePage";
export default function SuccessCases() {
  return <SimplePage i18nNamespace="pages.successCases" heroImage="/images/carousel/slide-5.png" />;
}
```

- [ ] **Step 7：dev 走查 6 个子页**

`npm run dev`，逐个访问 `/about`、`/one-on-one`、`/custom`、`/party`、`/wedding-gallery`、`/success-cases`，确认 hero 图、标题、文案、亮点列表（婚礼花絮与成功案例无亮点列表，仅显示标题 + intro）正常显示。

- [ ] **Step 8：提交**

```bash
git add -A
git commit -m "feat(pages): fill all 6 sub-pages using SimplePage"
```

---

## Task 18：构建产物验证

**Files:** 无新增

- [ ] **Step 1：生产构建**

```bash
cd "D:/AI/my-projects/international-love-show"
npm run build
```
预期：无类型错误，`dist/` 目录生成。

- [ ] **Step 2：本地预览生产产物**

```bash
npm run preview
```
访问 `http://localhost:4173`，对 7 个路由逐一刷新页面：
- `/`、`/about`、`/one-on-one`、`/custom`、`/party`、`/wedding-gallery`、`/success-cases`

每个页面均应正常加载（preview 服务器自动处理 SPA fallback，正式部署需在 Nginx 配置 `try_files $uri /index.html;`）。

- [ ] **Step 3：响应式人工走查**

浏览器开发者工具切换到 480px / 768px / 1280px 三种宽度，每页快速过一遍：Header 在窄屏下导航被隐藏（`md:flex`）但 Logo + 语言按钮可见；section 网格按断点正确堆叠/铺开；轮播图比例正常。

- [ ] **Step 4：中英切换走查**

每个页面点击 EN / 中按钮，确认所有可见文案均切换、无中文残留或 i18n key 泄漏。

- [ ] **Step 5：写部署说明并提交**

`README.md`：

```md
# International Love Show — 静态宣传站

## 开发

\`\`\`bash
npm install
npm run dev
\`\`\`

## 构建

\`\`\`bash
npm run build
\`\`\`
产物在 \`dist/\`，可托管于任何静态宿主。

## 部署注意

SPA 路由需要 Nginx fallback：

\`\`\`nginx
location / {
    try_files $uri /index.html;
}
\`\`\`

## 资源

- 轮播图源文件：\`轮播图(1).psd\`
- 提取脚本：\`scripts/extract-psd.py\`（依赖 \`psd-tools\`）
\`\`\`

```bash
git add -A
git commit -m "docs: add README with build and deploy notes"
```

---

## 完成

所有任务完成后：
- 7 个路由页面均可访问
- 中英切换正常
- 桌面与移动响应式正常
- `npm run build` 产物可静态部署
- 所有可见文案均通过 i18n 管理，便于客户后续替换

---

## Plan 自检小结

- ✅ Spec §3 项目结构 → Task 1/2/3/4/5/6
- ✅ Spec §4 路由 → Task 4/15/17
- ✅ Spec §5 首页 7 节 → Task 8–14, 15
- ✅ Spec §6 8 句标语 → Task 3 i18n + Task 8 HeroCarousel
- ✅ Spec §7 PSD 提取 → Task 7
- ✅ Spec §8 i18n → Task 3
- ✅ Spec §9 视觉复用 → Task 1 step 4 + Task 2
- ✅ Spec §11 验收 → Task 18
