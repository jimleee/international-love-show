import { useTranslation } from "react-i18next";

export default function TeamShowcaseSection() {
  const { t } = useTranslation();
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("home.teamShowcase.title")}</h2>
      <div className="max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-lg">
        <img
          src="/images/carousel/slide-8.jpg"
          alt={t("home.teamShowcase.title") as string}
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
}
