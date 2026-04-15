import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();
  const toggleLang = () => i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh");

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="font-semibold text-lg">{t("brand")}</Link>
        <button onClick={toggleLang} className="text-sm border rounded px-3 py-1">
          {i18n.language === "zh" ? "EN" : "中"}
        </button>
      </div>
    </header>
  );
}
