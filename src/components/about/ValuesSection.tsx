import { useTranslation } from "react-i18next";
import { Heart, Sprout, Smile, HandHeart } from "lucide-react";

const ICONS = [Heart, Sprout, Smile, HandHeart];

type Value = { name: string; nameEn: string; desc: string };

export default function ValuesSection() {
  const { t } = useTranslation();
  const items = t("pages.about.values", { returnObjects: true }) as Value[];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("pages.about.valuesTitle")}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((v, i) => {
            const Icon = ICONS[i] ?? Heart;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-semibold text-lg">{v.name}</div>
                <div className="text-xs uppercase tracking-wider text-foreground/50 mt-1">
                  {v.nameEn}
                </div>
                <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
