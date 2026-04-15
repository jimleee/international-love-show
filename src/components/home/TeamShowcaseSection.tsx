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
