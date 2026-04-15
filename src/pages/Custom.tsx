import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Check, Crown } from "lucide-react";
import PageHero from "@/components/PageHero";

type Tier = { name: string; tagline: string; features: string[]; featured?: boolean };

export default function Custom() {
  const { t } = useTranslation();
  const tiers = t("pages.custom.tiers", { returnObjects: true }) as Tier[];

  return (
    <>
      <Helmet>
        <title>{t("pages.custom.title") + " · " + t("brand")}</title>
        <meta name="description" content={t("pages.custom.intro") as string} />
      </Helmet>

      <PageHero
        title={t("pages.custom.title")}
        subtitle={t("pages.custom.subtitle")}
        image="/images/carousel/slide-4.png"
      />

      <section className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">{t("pages.custom.intro")}</p>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12 md:mb-16">
            {t("pages.custom.tiersTitle")}
          </h2>
          <div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 shadow-md flex flex-col ${
                  tier.featured
                    ? "bg-primary text-primary-foreground shadow-xl scale-[1.02] md:-translate-y-2"
                    : "bg-white"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    RECOMMENDED
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                  <p className={`text-sm mt-2 ${tier.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {tier.tagline}
                  </p>
                </div>
                <ul className="space-y-3 flex-1">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex gap-2 items-start">
                      <Check className={`w-5 h-5 shrink-0 mt-0.5 ${tier.featured ? "text-primary-foreground" : "text-primary"}`} />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src="/images/home/legal-consultation.jpg" alt="" className="w-full h-64 md:h-96 object-cover" />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-5">
            <h3 className="text-2xl md:text-3xl font-semibold">{t("pages.custom.whyTitle")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("pages.custom.whyBody")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
