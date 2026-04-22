import { useTranslation } from "react-i18next";

type Stage = { stage: string; desc: string; image: string };

export default function CourseSystemSection() {
  const { t } = useTranslation();
  const items = t("home.courseSystem.items", { returnObjects: true }) as Stage[];

  return (
    <section className="bg-muted/30 py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("home.courseSystem.title")}
        </h2>
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {items.map((s, i) => (
            <li key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={s.image}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1">
                <div className="text-primary text-sm font-semibold mb-1">STEP {i + 1}</div>
                <div className="font-semibold text-lg mb-1">{s.stage}</div>
                <div className="text-sm text-foreground/70">{s.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
