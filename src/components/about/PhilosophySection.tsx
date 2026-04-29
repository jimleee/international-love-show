import { useTranslation } from "react-i18next";

const POSTERS = [
  { src: "/images/about/mission.png", titleKey: "pages.about.missionTitle" },
  { src: "/images/about/vision.png", titleKey: "pages.about.visionTitle" },
  { src: "/images/about/values.png", titleKey: "pages.about.valuesTitle" },
];

export default function PhilosophySection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTERS.map((p) => (
            <article
              key={p.src}
              className="group rounded-2xl overflow-hidden shadow-md border border-border/40 bg-white"
            >
              <div className="aspect-[9/16] overflow-hidden">
                <img
                  src={p.src}
                  alt={t(p.titleKey) as string}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
