import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface Props {
  i18nNamespace: string; // 例如 "pages.about"
  heroImage?: string;    // 可选，默认用轮播图 slide-1
}

export default function SimplePage({ i18nNamespace, heroImage = "/images/carousel/slide-1.png" }: Props) {
  const { t } = useTranslation();
  const title = t(`${i18nNamespace}.title`) as string;
  const intro = t(`${i18nNamespace}.intro`) as string;
  const highlights = t(`${i18nNamespace}.highlights`, { returnObjects: true, defaultValue: [] }) as string[];

  return (
    <>
      <Helmet>
        <title>{title} · International Love dating Club</title>
        <meta name="description" content={intro} />
      </Helmet>

      <section className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg">{title}</h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <p className="text-lg leading-relaxed text-foreground/80">{intro}</p>

        {highlights.length > 0 && (
          <ul className="mt-8 space-y-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="text-primary mt-1">●</span>
                <span className="text-foreground/80">{h}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
