import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Heart, MapPin } from "lucide-react";
import PageHero from "@/components/PageHero";

export default function About() {
  const { t } = useTranslation();
  const cities = ["footer.losAngeles", "footer.sanFrancisco", "footer.lasVegas"];

  return (
    <>
      <Helmet>
        <title>{t("pages.about.title") + " · " + t("brand")}</title>
        <meta name="description" content={t("pages.about.story1Body") as string} />
      </Helmet>

      <PageHero
        title={t("pages.about.title")}
        subtitle={t("pages.about.subtitle")}
        image="/images/home/team-frontdesk.jpg"
      />

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl space-y-16 md:space-y-24">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img src="/images/home/team-frontdesk.jpg" alt="" className="w-full h-64 md:h-96 object-cover hover:scale-[1.02] transition-all duration-500" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary fill-primary" />
                  <span className="text-sm font-semibold">{t("brand")}</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-2xl md:text-3xl font-semibold">{t("pages.about.story1Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("pages.about.story1Body")}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {cities.map((k) => (
                  <span key={k} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <MapPin className="w-3 h-3" />
                    {t(k)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center bg-white rounded-2xl py-6 md:py-8 shadow-sm">
                <div className="text-2xl md:text-4xl font-bold text-primary">{t(`pages.about.stat${i}Value`)}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{t(`pages.about.stat${i}Label`)}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src="/images/home/consultants.jpg" alt="" className="w-full h-64 md:h-96 object-cover hover:scale-[1.02] transition-all duration-500" />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <h3 className="text-xl md:text-2xl font-semibold">{t("pages.about.story2Title")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("pages.about.story2Body")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
