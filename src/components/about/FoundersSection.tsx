import { useTranslation } from "react-i18next";

type Founder = { name: string; image: string; body: string };

export default function FoundersSection() {
  const { t } = useTranslation();
  const items = t("pages.about.founders", { returnObjects: true }) as Founder[];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          {t("pages.about.foundersTitle")}
        </h2>
        <div className="space-y-20">
          {items.map((f, i) => (
            <div
              key={i}
              className={`flex flex-col gap-8 md:gap-12 items-center ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="w-full md:w-2/5">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="w-full h-[420px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="w-full md:w-3/5 space-y-4">
                <h3 className="text-2xl md:text-3xl font-semibold">{f.name}</h3>
                <p className="text-foreground/75 leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
