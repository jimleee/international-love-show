import { useTranslation } from "react-i18next";
import { Heart, Sprout, Smile, HandHeart } from "lucide-react";

const ICONS = [Heart, Sprout, Smile, HandHeart];

type Value = { name: string; nameEn: string; desc: string };

export default function PhilosophySection() {
  const { t } = useTranslation();
  const values = t("pages.about.values", { returnObjects: true }) as Value[];

  return (
    <section className="py-14 md:py-16 px-4">
      <div className="container mx-auto max-w-6xl space-y-12">
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              {t("pages.about.missionTitle")}
            </h3>
            <p className="text-foreground/75 leading-relaxed">
              {t("pages.about.missionBody")}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              {t("pages.about.visionTitle")}
            </h3>
            <p className="text-foreground/75 leading-relaxed">
              {t("pages.about.visionBody")}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6">
            {t("pages.about.valuesTitle")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = ICONS[i] ?? Heart;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-border/40 text-center"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-semibold">{v.name}</div>
                  <div className="text-xs uppercase tracking-wider text-foreground/50 mt-1">
                    {v.nameEn}
                  </div>
                  <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
