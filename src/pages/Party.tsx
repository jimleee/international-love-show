import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Users, Sparkles, Mic, Calendar } from "lucide-react";
import PageHero from "@/components/PageHero";

const ICONS = [Users, Sparkles, Mic, Calendar];

const PHOTOS = Array.from({ length: 41 }, (_, i) => `/images/party/${i + 2}.jpg`);
const ROW1 = PHOTOS.slice(0, 21);
const ROW2 = PHOTOS.slice(21);

type Highlight = { title: string; desc: string };

export default function Party() {
  const { t } = useTranslation();
  const highlights = t("pages.party.highlights", { returnObjects: true }) as Highlight[];

  return (
    <>
      <Helmet>
        <title>{t("pages.party.title") + " · " + t("brand")}</title>
        <meta name="description" content={t("pages.party.intro") as string} />
      </Helmet>

      <PageHero
        title={t("pages.party.title")}
        subtitle={t("pages.party.subtitle")}
        image="/images/party/5.jpg"
      />

      <section className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">{t("pages.party.intro")}</p>
      </section>

      <section className="py-12 md:py-16 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4 mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">{t("pages.party.photosTitle")}</h2>
          <p className="text-muted-foreground mt-2">{t("pages.party.photosSubtitle")}</p>
        </div>

        <div className="mb-4 overflow-hidden">
          <div className="flex gap-4 animate-scroll-left">
            {[...ROW1, ...ROW1].map((src, i) => (
              <div key={i} className="flex-shrink-0 w-[260px] md:w-[340px] rounded-lg overflow-hidden shadow-md group">
                <img src={src} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex gap-4 animate-scroll-right">
            {[...ROW2, ...ROW2].map((src, i) => (
              <div key={i} className="flex-shrink-0 w-[260px] md:w-[340px] rounded-lg overflow-hidden shadow-md group">
                <img src={src} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {highlights.map((h, i) => {
            const Icon = ICONS[i];
            return (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
