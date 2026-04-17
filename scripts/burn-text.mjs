/**
 * Burn carousel text into images — like Photoshop text layers baked into the final export.
 * Uses sharp + SVG overlay for high-quality text rendering with gradient backdrop.
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const carouselDir = join(__dirname, "..", "public", "images", "carousel");

const SLIDES = [
  "International Love dating Club\n高端国际婚恋服务机构",
  "一对一教练全程陪伴\n为你的爱情保驾护航",
  "线下大量会员\n每位会员的资料真实可靠",
  "私人定制 高效分配\n遇见你一生的挚爱",
  "六大专业团队\n为你的爱情全面打造",
  "恋爱秘籍 脱单宝典\n完善系统的课程体系",
  "线下单身派对\n与优秀的人面对面相识",
  "洛杉矶 旧金山 拉斯维加斯\n三大服务中心",
];

const WIDTH = 1920;
const HEIGHT = 1080;

function createOverlaySvg(text, slideNum) {
  const lines = text.split("\n");
  // Line 1: larger, line 2: slightly smaller
  const line1 = escapeXml(lines[0]);
  const line2 = lines[1] ? escapeXml(lines[1]) : "";

  // Gradient overlay: bottom 55% fades from black to transparent
  // Text positioned at bottom-left with elegant styling
  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="black" stop-opacity="0"/>
      <stop offset="40%" stop-color="black" stop-opacity="0"/>
      <stop offset="70%" stop-color="black" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.75"/>
    </linearGradient>
    <!-- Subtle vignette for cinematic feel -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="black" stop-opacity="0"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.3"/>
    </radialGradient>
  </defs>

  <!-- Vignette layer -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vignette)"/>

  <!-- Bottom gradient -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad)"/>

  <!-- Decorative thin line above text -->
  <line x1="80" y1="${HEIGHT - 250}" x2="180" y2="${HEIGHT - 250}" stroke="white" stroke-opacity="0.5" stroke-width="1"/>

  <!-- Main text line 1 -->
  <text x="80" y="${HEIGHT - 180}"
        font-family="'Noto Serif SC', 'SimSun', 'Georgia', serif"
        font-size="52"
        font-weight="600"
        fill="white"
        letter-spacing="4">
    <tspan filter="url(#shadow)">${line1}</tspan>
  </text>

  <!-- Main text line 2 -->
  ${line2 ? `<text x="80" y="${HEIGHT - 110}"
        font-family="'Noto Serif SC', 'SimSun', 'Georgia', serif"
        font-size="44"
        font-weight="400"
        fill="white"
        fill-opacity="0.9"
        letter-spacing="3">
    ${line2}
  </text>` : ""}

  <!-- Decorative line below text -->
  <line x1="80" y1="${HEIGHT - 70}" x2="160" y2="${HEIGHT - 70}" stroke="white" stroke-opacity="0.4" stroke-width="1.5"/>

  <!-- Slide number - subtle, bottom right -->
  <text x="${WIDTH - 80}" y="${HEIGHT - 40}"
        font-family="'Georgia', serif"
        font-size="16"
        fill="white"
        fill-opacity="0.35"
        text-anchor="end"
        letter-spacing="3">
    ${String(slideNum).padStart(2, "0")} / 08
  </text>
</svg>`;
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function processSlide(index) {
  const num = index + 1;
  const srcPath = join(carouselDir, `slide-${num}.jpg`);
  const outPath = join(carouselDir, `slide-${num}-final.jpg`);

  const svgOverlay = createOverlaySvg(SLIDES[index], num);
  const svgBuffer = Buffer.from(svgOverlay);

  await sharp(srcPath)
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .composite([{ input: svgBuffer, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(outPath);

  console.log(`✓ slide-${num}-final.jpg`);
}

console.log("Burning text into carousel images...\n");

for (let i = 0; i < SLIDES.length; i++) {
  await processSlide(i);
}

console.log("\nDone! Final images saved as slide-*-final.jpg");
console.log("Rename them to slide-*.jpg when satisfied with the result.");
