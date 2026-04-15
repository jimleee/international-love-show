import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // All pages open with a hero image at top, so header starts transparent
  // and turns solid once the user scrolls past the fold.
  const transparent = !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset scroll to top when switching routes so each page opens in its
  // transparent-header, hero-centric state.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleLang = () => i18n.changeLanguage(i18n.language.startsWith("zh") ? "en" : "zh");
  const isZh = i18n.language.startsWith("zh");

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-white/85 backdrop-blur-md border-b border-border/50 shadow-sm"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-5 px-4 md:px-6">
        <Link to="/" className="group flex items-baseline gap-2 md:gap-3 select-none">
          <span
            className={`font-serif text-xl md:text-2xl tracking-wide font-semibold transition-colors ${
              transparent ? "text-white drop-shadow-md" : "text-foreground"
            }`}
          >
            International Love
          </span>
          <span
            className={`hidden md:inline-block h-4 w-px ${transparent ? "bg-white/60" : "bg-foreground/30"}`}
          />
          <span
            className={`hidden md:inline-block font-serif italic text-sm tracking-[0.15em] transition-colors ${
              transparent ? "text-white/80" : "text-foreground/60"
            }`}
          >
            dating club
          </span>
        </Link>

        {/* Minimal pill-style bilingual toggle: both visible, current highlighted */}
        <button
          onClick={toggleLang}
          aria-label="toggle language"
          className={`flex items-center gap-1 text-xs md:text-sm font-medium tracking-wider transition-colors ${
            transparent ? "text-white/90 hover:text-white" : "text-foreground/70 hover:text-foreground"
          }`}
        >
          <span className={isZh ? "font-semibold" : "opacity-60"}>中</span>
          <span className="opacity-40 mx-0.5">/</span>
          <span className={!isZh ? "font-semibold" : "opacity-60"}>EN</span>
        </button>
      </div>
    </header>
  );
}
