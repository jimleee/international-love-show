import { useTranslation } from "react-i18next";

type Stage = { stage: string; desc: string };

export default function CourseSystemSection() {
  const { t } = useTranslation();
  const items = t("home.courseSystem.items", { returnObjects: true }) as Stage[];

  return (
    <section className="bg-muted/30 py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("home.courseSystem.title")}</h2>
        <ol className="grid gap-4 md:grid-cols-4 max-w-5xl mx-auto">
          {items.map((s, i) => (
            <li key={i} className="relative bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-primary text-sm font-semibold mb-2">STEP {i + 1}</div>
              <div className="font-semibold text-lg mb-1">{s.stage}</div>
              <div className="text-sm text-foreground/70">{s.desc}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
