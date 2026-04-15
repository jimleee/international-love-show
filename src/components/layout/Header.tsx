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
