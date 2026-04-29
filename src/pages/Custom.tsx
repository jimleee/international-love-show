import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/PageHero";
import TierGroup, { type Tier } from "@/components/custom/TierGroup";

export default function Custom() {
  const { t } = useTranslation();
  const basic = t("pages.custom.basicTiers", { returnObjects: true }) as Tier[];
  const premium = t("pages.custom.premiumTiers", { returnObjects: true }) as Tier[];

  return (
    <>
      <Helmet>
        <title>{t("pages.custom.title") + " · " + t("brand")}</title>
        <meta name="description" content={t("pages.custom.intro") as string} />
      </Helmet>

      <PageHero
        title={t("pages.custom.title")}
        subtitle={t("pages.custom.subtitle")}
        image="/images/carousel/slide-4.jpg"
      />

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-lg text-foreground/75 leading-relaxed">
            {t("pages.custom.intro")}
          </p>
        </div>
      </section>

      <TierGroup
        title={t("pages.custom.basicTitle")}
        tiers={basic}
        variant="basic"
        image="/images/custom/basic.jpg"
      />

      <TierGroup
        title={t("pages.custom.premiumTitle")}
        subtitle={t("pages.custom.premiumSubtitle") as string}
        tiers={premium}
        variant="premium"
        image="/images/custom/premium.jpg"
      />
    </>
  );
}
