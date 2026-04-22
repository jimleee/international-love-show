import { useTranslation } from "react-i18next";

type Coach = { name: string; image: string; title: string; body: string };

export default function CoachesSection() {
  const { t } = useTranslation();
  const items = t("pages.oneOnOne.coaches", { returnObjects: true }) as Coach[];

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t("pages.oneOnOne.coachesTitle")}
          </h2>
          <p className="text-foreground/60">{t("pages.oneOnOne.coachesSubtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-semibold text-lg">{c.name}</h3>
                <div className="text-xs uppercase tracking-wider text-primary/80">
                  {c.title}
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{c.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
